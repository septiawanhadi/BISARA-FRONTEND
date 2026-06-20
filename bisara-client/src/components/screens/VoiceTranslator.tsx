import React, { useState, useRef, useEffect } from 'react';
import { AvatarViewer } from '../shared/AvatarViewer';
import { Alert } from '../ui/Alert';
import { ArrowLeft, Mic, Play } from 'lucide-react';
import type { DictionaryItem } from '../../types';
import { fuzzyMatchWord } from '../../lib/fuzzyMatcher';
import { ApiService } from '../../lib/api';

interface VoiceTranslatorProps {
  avatarId: string;
  dictionary: DictionaryItem[];
  onNavigate: (viewId: string) => void;
}

export const VoiceTranslator: React.FC<VoiceTranslatorProps> = ({ 
  avatarId, 
  dictionary,
  onNavigate 
}) => {
  const [inputText, setInputText] = useState('');
  const [transcript, setTranscript] = useState('Belum ada suara terdeteksi. Silakan klik tombol mikrofon di bawah dan mulailah berbicara!');
  const [statusBadge, setStatusBadge] = useState('Siap Menerima');
  const [isRecording, setIsRecording] = useState(false);
  const [activeClip, setActiveClip] = useState<string | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [timerText, setTimerText] = useState('00:00');
  
  // Spelling fallback states
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [spelledWord, setSpelledWord] = useState<string | null>(null);
  const [spelledIndex, setSpelledIndex] = useState<number>(0);

  const recognitionRef = useRef<any>(null);
  const animationTimerRef = useRef<number | null>(null);
  const durationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Setup Native Web Speech recognition API inside React hook
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = 'id-ID';
      rec.interimResults = false;

      rec.onstart = () => {
        setIsRecording(true);
        setStatusBadge('Mendengarkan...');
        setTranscript('Sedang mendengarkan suara Anda...');
        setTimerText('00:00');
        startDurationTimer();
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(`"${text}"`);
        processVoiceSpelling(text);
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === 'network') {
          setTranscript('Gagal terhubung ke server suara browser (Network Error). Jika Anda menggunakan Brave, Opera, atau Vivaldi, browser tersebut memblokir server suara Google secara default. Harap gunakan browser Google Chrome / Safari resmi, atau Anda bisa menggunakan kolom pencarian teks di atas untuk menuliskan kata/kalimat.');
        } else if (event.error === 'not-allowed') {
          setTranscript('Izin akses mikrofon ditolak. Silakan aktifkan izin mikrofon pada ikon gembok di sebelah kiri alamat web browser Anda.');
        } else {
          setTranscript('Maaf, suara kurang terdengar jelas atau mikrofon bermasalah. Ketuk ikon mic dan coba lagi.');
        }
        stopRecordingState();
      };

      rec.onend = () => {
        stopRecordingState();
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, []);

  const toggleSpeechRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        alert("Browser Anda tidak mendukung deteksi suara native.");
      }
    }
  };

  const stopRecordingState = () => {
    setIsRecording(false);
    setStatusBadge('Siap Menerima');
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
    }
  };

  const startDurationTimer = () => {
    if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    let seconds = 0;
    durationTimerRef.current = setInterval(() => {
      seconds++;
      setTimerText(`00:${seconds < 10 ? '0' + seconds : seconds}`);
      if (seconds >= 3) {
        if (durationTimerRef.current) clearInterval(durationTimerRef.current);
      }
    }, 1000) as any;
  };

  const processVoiceSpelling = async (phrase: string) => {
    setStatusBadge("Mencari...");
    try {
      const res = await ApiService.searchDictionary(phrase);
      if (res.matched && res.word && res.clip) {
        setStatusBadge(`Mendeteksi: ${res.word} (${Math.round((res.confidence || 1) * 100)}%)`);
        playAvatarGesture(res.clip);
      } else {
        spellOutWord(phrase);
      }
    } catch (e) {
      console.error(e);
      // Fail-safe local match fallback
      const matched = fuzzyMatchWord(phrase, dictionary);
      if (matched) {
        setStatusBadge(`Mendeteksi (Lokal): ${matched.word}`);
        playAvatarGesture(matched.clip);
      } else {
        spellOutWord(phrase);
      }
    }
  };

  const spellOutWord = (word: string) => {
    const cleanWord = word.replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (!cleanWord) {
      setStatusBadge("Gagal Mengartikan");
      setTranscript(`Maaf, kata kunci untuk "${word}" belum tersedia.`);
      playAvatarGesture("scratch_head");
      return;
    }

    setSpelledWord(cleanWord);
    setSpelledIndex(0);
    setActiveLetter(cleanWord[0]);
    setActiveClip('spell');
    setTranscript(`Mengeja kata: "${cleanWord}"`);
    setStatusBadge("Mengeja Huruf");

    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    if (durationTimerRef.current) clearInterval(durationTimerRef.current);

    let letterIndex = 0;
    let frame = 0;
    const framesPerLetter = 36; // 1.2 seconds at 30 FPS

    animationTimerRef.current = setInterval(() => {
      frame++;
      setFrameIndex(frame % framesPerLetter);

      const currentLetterPos = Math.floor(frame / framesPerLetter);
      if (currentLetterPos !== letterIndex) {
        letterIndex = currentLetterPos;
        if (letterIndex >= cleanWord.length) {
          clearInterval(animationTimerRef.current!);
          animationTimerRef.current = null;
          setActiveClip(null);
          setActiveLetter(null);
          setSpelledWord(null);
          setStatusBadge("Siap Menerima");
          setTranscript(`Selesai mengeja "${cleanWord}"`);
        } else {
          setSpelledIndex(letterIndex);
          setActiveLetter(cleanWord[letterIndex]);
        }
      }
    }, 33) as any;
  };

  const playAvatarGesture = (clipName: string) => {
    setActiveLetter(null);
    setSpelledWord(null);
    setActiveClip(clipName);
    setFrameIndex(0);
    startDurationTimer();

    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    
    let frame = 0;
    animationTimerRef.current = setInterval(() => {
      frame++;
      setFrameIndex(frame);
      if (frame >= 90) { // 3 seconds at 30 FPS
        if (animationTimerRef.current) clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
        setActiveClip(null);
      }
    }, 33) as any;
  };

  const handleTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = inputText.trim();
      if (val) {
        setTranscript(`"${val}"`);
        processVoiceSpelling(val);
        setInputText('');
      }
    }
  };

  const handleReplay = () => {
    if (activeClip) {
      playAvatarGesture(activeClip);
    } else {
      playAvatarGesture('halo');
    }
  };

  return (
    <div className="w-full">
      <button 
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-br from-bisara-accent to-purple-400 text-white font-extrabold text-sm mb-6 shadow-md hover:translate-y-[-2px] transition-transform duration-300"
      >
        <ArrowLeft size={16} strokeWidth={3} />
        Kembali ke Beranda
      </button>

      <h2 className="font-zain text-5xl font-extrabold text-bisara-navy mb-6">
        Voice-to-Sign Translator
      </h2>

      {/* Input keyboard fallback */}
      <div className="relative mb-6">
        <svg className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleTextInputKeyDown}
          placeholder="Tulis kata atau kalimat untuk digerakkan oleh avatar..."
          className="w-full pl-16 pr-6 py-5 text-xl font-nunito text-bisara-navy bg-white border border-slate-200 rounded-lg shadow-sm outline-none focus:border-bisara-accent focus:shadow-md focus:ring-4 focus:ring-blue-100 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-8">
        {/* Controls Column */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#ECFDF5] border-2 border-dashed border-bisara-cyan rounded-lg p-[30px_24px] shadow-sm">
            <h3 className="font-zain text-3xl font-extrabold text-bisara-navy mb-3">Hasil Deteksi</h3>
            <p className="font-nunito text-base text-bisara-navy font-bold min-h-[80px] mb-4">
              {transcript}
            </p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 bg-opacity-50 text-bisara-accent font-extrabold text-sm ${isRecording ? 'animate-pulse' : ''}`}>
              <span className="w-2 h-2 rounded-full bg-bisara-accent" />
              <span>{statusBadge}</span>
            </div>
          </div>

          <Alert type="hint">
            Gunakan suara yang jelas dengan artikulasi baik. Sistem kami mendeteksi kata kunci seperti "Makan", "Minum", "Tolong", "Terima Kasih", dan "Halo". Avatar akan memperagakan gerakan SIBI sesuai kata yang Anda sebutkan!
          </Alert>
        </div>

        {/* Canvas Avatar Column */}
        <div className="bg-white border-2 border-bisara-accent rounded-lg p-6 shadow-md flex flex-col items-center gap-6">
          <div className="w-full relative">
            <div className="w-full h-[380px] bg-slate-100 rounded-md relative overflow-hidden">
              <AvatarViewer 
                avatarId={avatarId} 
                activeClip={activeClip} 
                frameIndex={frameIndex} 
                activeLetter={activeLetter}
              />
            </div>

            {/* Subtitle overlay for spelling */}
            {activeLetter && (
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white font-black text-6xl px-8 py-3 rounded-2xl shadow-xl z-20 animate-scaleIn select-none font-fredoka">
                {activeLetter}
              </div>
            )}
            
            {/* Word spelling progression indicator */}
            {spelledWord && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 border border-slate-200 px-4 py-2 rounded-full shadow-md z-20 flex gap-1.5 items-center select-none">
                {spelledWord.split('').map((char, idx) => (
                  <span 
                    key={idx} 
                    className={`text-lg font-black transition-all ${
                      idx === spelledIndex ? 'text-bisara-accent scale-125 underline' : 'text-slate-400'
                    }`}
                  >
                    {char}
                  </span>
                ))}
              </div>
            )}

            {/* Overlapping Mic floating button */}
            <button 
              onClick={toggleSpeechRecording}
              className={`w-[72px] h-[72px] rounded-full text-white text-3xl flex items-center justify-center shadow-lg absolute bottom-[-36px] left-1/2 transform -translate-x-1/2 z-10 hover:scale-108 transition-transform duration-300 ${isRecording ? 'animate-pulse bg-bisara-pink' : 'bg-bisara-pink'}`}
            >
              <Mic size={28} strokeWidth={2.5} />
            </button>
          </div>

          {/* Soundwave timeline controller */}
          <div className="w-full mt-6 border-2 border-bisara-accent-muted rounded-full px-6 py-3 flex items-center justify-between gap-4 bg-white">
            <button 
              onClick={handleReplay}
              className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-bisara-orange hover:scale-110 transition-transform"
            >
              <Play size={18} fill="currentColor" />
            </button>

            {/* Animated wave lines */}
            <div className="flex-1 flex items-center justify-center gap-1.5 h-[50px]">
              {Array.from({ length: 15 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1 rounded-full bg-bisara-accent transition-all duration-300 ${
                    activeClip ? 'animate-[soundwave_1.2s_ease-in-out_infinite]' : 'h-2.5'
                  }`}
                  style={{ 
                    animationDelay: `${0.1 * (i % 6)}s`,
                    backgroundColor: i % 4 === 0 ? 'var(--primary-blue)' : i % 4 === 1 ? 'var(--pink-accent)' : i % 4 === 2 ? 'var(--orange-accent)' : 'var(--purple-accent)'
                  }}
                />
              ))}
            </div>

            <div className="font-extrabold text-bisara-accent-muted text-sm">{timerText}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
