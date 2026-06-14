import React, { useState, useRef, useEffect } from 'react';
import { CameraPreview } from '../shared/CameraPreview';
import { AvatarViewer } from '../shared/AvatarViewer';
import { Card } from '../ui/Card';
import type { QuizRound, AvatarConfig } from '../../types';
import { 
  ArrowLeft, 
  Award, 
  CheckCircle, 
  X, 
  Sparkles
} from 'lucide-react';

interface QuizProps {
  quizRounds: QuizRound[];
  avatarShop: Record<string, AvatarConfig>;
  unlockedAvatars: string[];
  userStars: number;
  onNavigate: (viewId: string) => void;
  onQuizComplete: (starsEarned: number) => void;
  triggerConfetti: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ 
  avatarShop,
  unlockedAvatars,
  onNavigate,
  onQuizComplete,
  triggerConfetti
}) => {
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [completedLevels, setCompletedLevels] = useState<number[]>(() => {
    const saved = localStorage.getItem('bisara_completed_levels');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Overall stars collected in this session
  const [sessionStars, setSessionStars] = useState(0);

  // Avatar animation states for quiz screens
  const [activeClip, setActiveClip] = useState<string | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const animationTimerRef = useRef<number | null>(null);

  // --- LEVEL 1 STATES (Mengenal SPOK) ---
  const [tappedElements, setTappedElements] = useState<string[]>([]);
  const [activeExplanation, setActiveExplanation] = useState<string | null>(null);

  // --- LEVEL 2 STATES (Mencocokkan) ---
  const [l2Answer, setL2Answer] = useState<string | null>(null);
  const [l2Checked, setL2Checked] = useState(false);

  // --- LEVEL 3 STATES (Menyusun) ---
  const [l3Pool, setL3Pool] = useState<string[]>(['kopi', 'Ayah', 'minum']);
  const [l3Selected, setL3Selected] = useState<string[]>([]);
  const [l3Checked, setL3Checked] = useState(false);
  const [l3IsCorrect, setL3IsCorrect] = useState(false);

  // --- LEVEL 4 STATES (Lengkapi) ---
  const [l4Answer, setL4Answer] = useState<string | null>(null);
  const [l4Checked, setL4Checked] = useState(false);

  // --- LEVEL 5 STATES (Identifikasi) ---
  const [l5SelectedWord, setL5SelectedWord] = useState<string | null>(null);
  const [l5Checked, setL5Checked] = useState(false);

  // --- LEVEL 6 STATES (Kalimat Kontekstual Camera) ---
  const [l6Accuracy, setL6Accuracy] = useState<number | null>(null);
  const [l6DoneDetecting, setL6DoneDetecting] = useState(false);
  const [l6Stars, setL6Stars] = useState(0);

  // Clean up animation timers
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    };
  }, []);

  const playAvatarGesture = (clipName: string) => {
    setActiveClip(clipName);
    setFrameIndex(0);
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

  const handleCompleteLevel = (levelNum: number, stars: number) => {
    // Save to completed levels list
    if (!completedLevels.includes(levelNum)) {
      const updated = [...completedLevels, levelNum];
      setCompletedLevels(updated);
      localStorage.setItem('bisara_completed_levels', JSON.stringify(updated));
    }
    setSessionStars(prev => prev + stars);
    triggerConfetti();
    
    // Auto navigate back to selector or complete session
    if (levelNum === 6) {
      onQuizComplete(sessionStars + stars);
      // Reset
      setCurrentLevel(null);
      setSessionStars(0);
    } else {
      // Go back to Level Selector Dashboard
      setCurrentLevel(null);
    }
  };

  const startLevel = (levelNum: number) => {
    // Reset specific states
    if (levelNum === 1) {
      setTappedElements([]);
      setActiveExplanation(null);
    } else if (levelNum === 2) {
      setL2Answer(null);
      setL2Checked(false);
    } else if (levelNum === 3) {
      setL3Pool(['kopi', 'Ayah', 'minum']);
      setL3Selected([]);
      setL3Checked(false);
      setL3IsCorrect(false);
    } else if (levelNum === 4) {
      setL4Answer(null);
      setL4Checked(false);
    } else if (levelNum === 5) {
      setL5SelectedWord(null);
      setL5Checked(false);
    } else if (levelNum === 6) {
      setL6Accuracy(null);
      setL6DoneDetecting(false);
      setL6Stars(0);
    }
    setCurrentLevel(levelNum);
  };

  // --- LEVEL 1 HANDLERS ---
  const handleL1Click = (element: string, explanation: string, clip: string) => {
    if (!tappedElements.includes(element)) {
      setTappedElements(prev => [...prev, element]);
    }
    setActiveExplanation(explanation);
    playAvatarGesture(clip);
  };

  // --- LEVEL 3 HANDLERS ---
  const handleL3WordClick = (word: string, isFromSelected: boolean) => {
    if (l3Checked) return;
    if (isFromSelected) {
      setL3Selected(prev => prev.filter(w => w !== word));
      setL3Pool(prev => [...prev, word]);
    } else {
      setL3Pool(prev => prev.filter(w => w !== word));
      setL3Selected(prev => [...prev, word]);
    }
  };

  const handleL3Submit = () => {
    const isCorrect = l3Selected[0] === 'Ayah' && l3Selected[1] === 'minum' && l3Selected[2] === 'kopi';
    setL3IsCorrect(isCorrect);
    setL3Checked(true);
  };

  // --- LEVEL 6 HANDLERS ---
  const handleL6AccuracyUpdate = (acc: number) => {
    setL6Accuracy(acc);
  };

  const handleL6DetectAI = () => {
    const acc = l6Accuracy || Math.floor(75 + Math.random() * 21);
    setL6Accuracy(acc);
    setL6DoneDetecting(true);

    let stars = 1;
    if (acc >= 85) {
      stars = 3;
    } else if (acc >= 70) {
      stars = 2;
    }
    setL6Stars(stars);
  };

  const isLevelUnlocked = (num: number) => {
    if (num === 1) return true;
    return completedLevels.includes(num - 1);
  };

  return (
    <div className="w-full font-nunito">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-zain text-5xl font-extrabold text-bisara-navy flex items-center gap-3">
            <Award className="text-bisara-yellow w-10 h-10" />
            Tugas Kuis & Asesmen SPOKKA
          </h2>
          <p className="text-slate-500 font-semibold text-sm">
            Selesaikan 6 level kuis untuk menguasai struktur bahasa isyarat BISINDO!
          </p>
        </div>
        {currentLevel ? (
          <button 
            onClick={() => setCurrentLevel(null)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-bisara-navy font-extrabold text-sm hover:bg-slate-200 transition-all active:scale-95"
          >
            <ArrowLeft size={16} strokeWidth={3} />
            Kembali ke Level
          </button>
        ) : (
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-bisara-navy font-extrabold text-sm hover:bg-slate-200 transition-all active:scale-95"
          >
            <ArrowLeft size={16} strokeWidth={3} />
            Kembali ke Beranda
          </button>
        )}
      </div>

      {/* ==================== SCREEN 0: LEVEL SELECTOR ==================== */}
      {currentLevel === null && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="flex flex-col gap-6">
            <h3 className="font-zain text-3xl font-extrabold text-bisara-navy">
              6 Level Pembelajaran SPOKKA
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Level 1 Card */}
              <Card 
                hoverEffect={isLevelUnlocked(1)} 
                onClick={() => isLevelUnlocked(1) && startLevel(1)}
                className={`flex flex-col relative overflow-hidden text-left cursor-pointer border-b-4 ${
                  completedLevels.includes(1) 
                    ? 'border-green-500 bg-green-50 bg-opacity-20' 
                    : 'border-bisara-accent'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="px-3 py-1 bg-bisara-accent bg-opacity-10 text-bisara-accent rounded-full text-xs font-black uppercase font-zain tracking-wider">
                    Level 1: Mengenal
                  </div>
                  {completedLevels.includes(1) ? (
                    <span className="text-green-500 font-bold text-xs flex items-center gap-1">
                      <CheckCircle size={14} /> Selesai
                    </span>
                  ) : (
                    <span className="text-slate-300 font-bold text-xs">Belum Selesai</span>
                  )}
                </div>
                <h4 className="font-zain text-2xl font-black text-bisara-navy mb-2">Mengenal SPOK</h4>
                <p className="text-xs text-slate-400 font-bold leading-relaxed mb-4">
                  Pelajari posisi Subjek (S), Predikat (P), Objek (O), dan Keterangan (K) dalam bahasa isyarat.
                </p>
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-bisara-accent">
                  <span>Mulai Pembelajaran ➔</span>
                  <span className="text-bisara-yellow text-sm">★★★</span>
                </div>
              </Card>

              {/* Level 2 Card */}
              <Card 
                hoverEffect={isLevelUnlocked(2)} 
                onClick={() => isLevelUnlocked(2) && startLevel(2)}
                className={`flex flex-col relative overflow-hidden text-left cursor-pointer border-b-4 ${
                  !isLevelUnlocked(2) ? 'opacity-50 border-slate-200' :
                  completedLevels.includes(2) 
                    ? 'border-green-500 bg-green-50 bg-opacity-20' 
                    : 'border-bisara-orange'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="px-3 py-1 bg-bisara-orange bg-opacity-10 text-bisara-orange rounded-full text-xs font-black uppercase font-zain tracking-wider">
                    Level 2: Mencocokkan
                  </div>
                  {!isLevelUnlocked(2) ? (
                    <span className="text-slate-400 font-bold text-xs">🔒 Terkunci</span>
                  ) : completedLevels.includes(2) ? (
                    <span className="text-green-500 font-bold text-xs flex items-center gap-1">
                      <CheckCircle size={14} /> Selesai
                    </span>
                  ) : (
                    <span className="text-slate-300 font-bold text-xs">Belum Selesai</span>
                  )}
                </div>
                <h4 className="font-zain text-2xl font-black text-bisara-navy mb-2">Mencocokkan Unsur</h4>
                <p className="text-xs text-slate-400 font-bold leading-relaxed mb-4">
                  Pilih peran gramatikal kata yang tepat dalam sebuah visualisasi adegan / deskripsi.
                </p>
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-bisara-orange">
                  <span>{isLevelUnlocked(2) ? 'Mulai Uji Coba ➔' : 'Selesaikan Level 1'}</span>
                  <span className="text-bisara-yellow text-sm">★★★</span>
                </div>
              </Card>

              {/* Level 3 Card */}
              <Card 
                hoverEffect={isLevelUnlocked(3)} 
                onClick={() => isLevelUnlocked(3) && startLevel(3)}
                className={`flex flex-col relative overflow-hidden text-left cursor-pointer border-b-4 ${
                  !isLevelUnlocked(3) ? 'opacity-50 border-slate-200' :
                  completedLevels.includes(3) 
                    ? 'border-green-500 bg-green-50 bg-opacity-20' 
                    : 'border-bisara-pink'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="px-3 py-1 bg-bisara-pink bg-opacity-10 text-bisara-pink rounded-full text-xs font-black uppercase font-zain tracking-wider">
                    Level 3: Menyusun
                  </div>
                  {!isLevelUnlocked(3) ? (
                    <span className="text-slate-400 font-bold text-xs">🔒 Terkunci</span>
                  ) : completedLevels.includes(3) ? (
                    <span className="text-green-500 font-bold text-xs flex items-center gap-1">
                      <CheckCircle size={14} /> Selesai
                    </span>
                  ) : (
                    <span className="text-slate-300 font-bold text-xs">Belum Selesai</span>
                  )}
                </div>
                <h4 className="font-zain text-2xl font-black text-bisara-navy mb-2">Menyusun Kalimat</h4>
                <p className="text-xs text-slate-400 font-bold leading-relaxed mb-4">
                  Urutkan kata-kata isyarat yang acak menjadi susunan SPOK yang baku dan benar.
                </p>
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-bisara-pink">
                  <span>{isLevelUnlocked(3) ? 'Mulai Uji Coba ➔' : 'Selesaikan Level 2'}</span>
                  <span className="text-bisara-yellow text-sm">★★★</span>
                </div>
              </Card>

              {/* Level 4 Card */}
              <Card 
                hoverEffect={isLevelUnlocked(4)} 
                onClick={() => isLevelUnlocked(4) && startLevel(4)}
                className={`flex flex-col relative overflow-hidden text-left cursor-pointer border-b-4 ${
                  !isLevelUnlocked(4) ? 'opacity-50 border-slate-200' :
                  completedLevels.includes(4) 
                    ? 'border-green-500 bg-green-50 bg-opacity-20' 
                    : 'border-bisara-accent-muted'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="px-3 py-1 bg-bisara-accent-muted bg-opacity-10 text-bisara-accent-muted rounded-full text-xs font-black uppercase font-zain tracking-wider">
                    Level 4: Melengkapi
                  </div>
                  {!isLevelUnlocked(4) ? (
                    <span className="text-slate-400 font-bold text-xs">🔒 Terkunci</span>
                  ) : completedLevels.includes(4) ? (
                    <span className="text-green-500 font-bold text-xs flex items-center gap-1">
                      <CheckCircle size={14} /> Selesai
                    </span>
                  ) : (
                    <span className="text-slate-300 font-bold text-xs">Belum Selesai</span>
                  )}
                </div>
                <h4 className="font-zain text-2xl font-black text-bisara-navy mb-2">Lengkapi Kalimat</h4>
                <p className="text-xs text-slate-400 font-bold leading-relaxed mb-4">
                  Isi bagian yang kosong agar kalimat memiliki unsur tata bahasa yang lengkap dan logis.
                </p>
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-bisara-accent-muted">
                  <span>{isLevelUnlocked(4) ? 'Mulai Uji Coba ➔' : 'Selesaikan Level 3'}</span>
                  <span className="text-bisara-yellow text-sm">★★★</span>
                </div>
              </Card>

              {/* Level 5 Card */}
              <Card 
                hoverEffect={isLevelUnlocked(5)} 
                onClick={() => isLevelUnlocked(5) && startLevel(5)}
                className={`flex flex-col relative overflow-hidden text-left cursor-pointer border-b-4 ${
                  !isLevelUnlocked(5) ? 'opacity-50 border-slate-200' :
                  completedLevels.includes(5) 
                    ? 'border-green-500 bg-green-50 bg-opacity-20' 
                    : 'border-bisara-cyan'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="px-3 py-1 bg-[#E0F7FA] text-[#0891B2] rounded-full text-xs font-black uppercase font-zain tracking-wider">
                    Level 5: Identifikasi
                  </div>
                  {!isLevelUnlocked(5) ? (
                    <span className="text-slate-400 font-bold text-xs">🔒 Terkunci</span>
                  ) : completedLevels.includes(5) ? (
                    <span className="text-green-500 font-bold text-xs flex items-center gap-1">
                      <CheckCircle size={14} /> Selesai
                    </span>
                  ) : (
                    <span className="text-slate-300 font-bold text-xs">Belum Selesai</span>
                  )}
                </div>
                <h4 className="font-zain text-2xl font-black text-bisara-navy mb-2">Identifikasi Unsur</h4>
                <p className="text-xs text-slate-400 font-bold leading-relaxed mb-4">
                  Sentuh langsung kata yang mewakili Subjek, Predikat, atau Objek dalam kalimat.
                </p>
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#0891B2]">
                  <span>{isLevelUnlocked(5) ? 'Mulai Uji Coba ➔' : 'Selesaikan Level 4'}</span>
                  <span className="text-bisara-yellow text-sm">★★★</span>
                </div>
              </Card>

              {/* Level 6 Card */}
              <Card 
                hoverEffect={isLevelUnlocked(6)} 
                onClick={() => isLevelUnlocked(6) && startLevel(6)}
                className={`flex flex-col relative overflow-hidden text-left cursor-pointer border-b-4 ${
                  !isLevelUnlocked(6) ? 'opacity-50 border-slate-200' :
                  completedLevels.includes(6) 
                    ? 'border-green-500 bg-green-50 bg-opacity-20' 
                    : 'border-yellow-500'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="px-3 py-1 bg-[#FFFDE7] text-[#D4AF37] rounded-full text-xs font-black uppercase font-zain tracking-wider">
                    Level 6: Kontekstual Camera
                  </div>
                  {!isLevelUnlocked(6) ? (
                    <span className="text-slate-400 font-bold text-xs">🔒 Terkunci</span>
                  ) : completedLevels.includes(6) ? (
                    <span className="text-green-500 font-bold text-xs flex items-center gap-1">
                      <CheckCircle size={14} /> Selesai
                    </span>
                  ) : (
                    <span className="text-slate-300 font-bold text-xs">Belum Selesai</span>
                  )}
                </div>
                <h4 className="font-zain text-2xl font-black text-bisara-navy mb-2">Kalimat Kontekstual Mandiri</h4>
                <p className="text-xs text-slate-400 font-bold leading-relaxed mb-4">
                  Tantangan akhir! Peragakan kalimat lengkap di depan kamera dan biarkan AI Cloud mendeteksinya.
                </p>
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#D4AF37]">
                  <span>{isLevelUnlocked(6) ? 'Buka Kamera & Tes ➔' : 'Selesaikan Level 5'}</span>
                  <span className="text-bisara-yellow text-sm">★★★</span>
                </div>
              </Card>

            </div>
          </div>

          {/* Right sidebar: Rewards & Stars */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-slate-100 rounded-lg p-8 shadow-sm">
              <h3 className="font-zain text-3xl font-extrabold text-bisara-navy mb-5 flex items-center gap-2">
                <Sparkles className="text-bisara-yellow" />
                Pencapaian Bintang
              </h3>
              
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="text-6xl text-bisara-yellow animate-pulse select-none">⭐</div>
                <div className="text-center">
                  <div className="text-3xl font-zain font-black text-bisara-navy">
                    {completedLevels.length * 3} Bintang
                  </div>
                  <div className="text-xs text-slate-400 font-extrabold mt-1">
                    Dari {completedLevels.length} Level Selesai
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-lg p-8 shadow-sm">
              <h3 className="font-zain text-3xl font-extrabold text-bisara-navy mb-1">Piala & Lencana</h3>
              <p className="text-xs text-slate-400 font-bold mb-5">Terus kumpulkan bintang untuk membuka kunci avatar!</p>
              
              <div className="flex flex-col gap-4">
                {Object.keys(avatarShop).map(key => {
                  const av = avatarShop[key];
                  const isUnlocked = unlockedAvatars.includes(key);
                  return (
                    <div key={key} className="flex items-center gap-4 p-3 border border-slate-100 rounded-md bg-slate-50">
                      <span className="text-3xl select-none">{av.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-extrabold text-bisara-navy truncate">{av.name}</div>
                        <div className="text-[10px] font-bold text-slate-400">
                          {isUnlocked ? 'Terbuka' : `Butuh ${av.starsNeeded} Bintang`}
                        </div>
                      </div>
                      <span className="text-xs">
                        {isUnlocked ? '🔓' : '🔒'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SCREEN 1: LEVEL 1 (Mengenal SPOK) ==================== */}
      {currentLevel === 1 && (
        <Card hoverEffect={false}>
          <div className="px-3 py-1 bg-bisara-accent bg-opacity-10 text-bisara-accent rounded-full text-xs font-black uppercase font-zain tracking-wider inline-block mb-4">
            Level 1: Belajar
          </div>
          <h3 className="font-zain text-4xl font-extrabold text-bisara-navy mb-4">Mengenal Struktur SPOK</h3>
          <p className="text-slate-500 font-semibold text-base mb-8">
            Kalimat SIBI memiliki pola Subjek, Predikat, Objek, dan Keterangan. Ketuk setiap kotak di bawah untuk belajar dan perhatikan gerakan isyaratnya!
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
            <div className="flex flex-col gap-6">
              
              {/* Interactive sentence builder */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 flex flex-wrap justify-center gap-4 items-center min-h-[140px]">
                
                <button 
                  onClick={() => handleL1Click('S', 'Subjek (S): Pelaku atau aktor yang melakukan tindakan di dalam kalimat. Pada contoh ini adalah "Saya".', 'saya')}
                  className={`px-6 py-4 rounded-lg font-nunito text-lg font-extrabold border-2 transition-all ${
                    tappedElements.includes('S') 
                      ? 'bg-blue-500 text-white border-blue-600 scale-102 shadow-md' 
                      : 'bg-white border-blue-400 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Saya <span className="text-xs block mt-1 opacity-80">(Subjek)</span>
                </button>

                <button 
                  onClick={() => handleL1Click('P', 'Predikat (P): Tindakan, perbuatan, atau aktivitas yang dikerjakan oleh Subjek. Di sini adalah "belajar".', 'belajar')}
                  className={`px-6 py-4 rounded-lg font-nunito text-lg font-extrabold border-2 transition-all ${
                    tappedElements.includes('P') 
                      ? 'bg-red-500 text-white border-red-600 scale-102 shadow-md' 
                      : 'bg-white border-red-400 text-red-600 hover:bg-red-50'
                  }`}
                >
                  belajar <span className="text-xs block mt-1 opacity-80">(Predikat)</span>
                </button>

                <button 
                  onClick={() => handleL1Click('O', 'Objek (O): Hal atau sasaran yang dikenai tindakan oleh Subjek. Di sini adalah "buku".', 'buku')}
                  className={`px-6 py-4 rounded-lg font-nunito text-lg font-extrabold border-2 transition-all ${
                    tappedElements.includes('O') 
                      ? 'bg-green-500 text-white border-green-600 scale-102 shadow-md' 
                      : 'bg-white border-green-400 text-green-600 hover:bg-green-50'
                  }`}
                >
                  buku <span className="text-xs block mt-1 opacity-80">(Objek)</span>
                </button>

                <button 
                  onClick={() => handleL1Click('K', 'Keterangan (K): Unsur yang menerangkan tempat, waktu, atau suasana. Di sini adalah "di sekolah".', 'sekolah')}
                  className={`px-6 py-4 rounded-lg font-nunito text-lg font-extrabold border-2 transition-all ${
                    tappedElements.includes('K') 
                      ? 'bg-yellow-500 text-black border-yellow-600 scale-102 shadow-md' 
                      : 'bg-white border-yellow-400 text-yellow-700 hover:bg-yellow-50'
                  }`}
                >
                  di sekolah <span className="text-xs block mt-1 opacity-80">(Keterangan)</span>
                </button>

              </div>

              {/* Explanations card */}
              <div className="bg-white border border-slate-100 p-6 rounded-md shadow-sm min-h-[140px]">
                <h4 className="font-zain text-2xl font-extrabold text-bisara-navy mb-2">Keterangan Tata Bahasa:</h4>
                <p className="text-base font-bold text-slate-500 leading-relaxed">
                  {activeExplanation || 'Ketuk salah satu kata di atas untuk memunculkan panduan tata bahasa beserta peragaan isyaratnya di sebelah kanan.'}
                </p>
              </div>

              {/* Button Action */}
              <button 
                disabled={tappedElements.length < 4}
                onClick={() => handleCompleteLevel(1, 3)}
                className={`py-4 px-8 font-extrabold rounded-full transition-transform ${
                  tappedElements.length === 4 
                    ? 'bg-bisara-accent hover:bg-opacity-95 text-white hover:scale-102 shadow-[0_4px_15px_rgba(37,99,255,0.2)]' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {tappedElements.length < 4 ? 'Ketuk Semua Kata Untuk Menyelesaikan' : 'Selesaikan Level 1 & Dapat 3 Bintang ⭐'}
              </button>

            </div>

            {/* Avatar Column */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 flex flex-col items-center gap-4">
              <div className="w-full h-[320px] rounded-md overflow-hidden relative border border-slate-100 bg-white">
                <AvatarViewer avatarId="timi" activeClip={activeClip} frameIndex={frameIndex} />
              </div>
              <div className="text-center font-bold text-xs text-slate-400">
                {activeClip ? `Memperagakan Isyarat: "${activeClip.toUpperCase()}"` : 'Timi sedang menunggu ketukan Anda'}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ==================== SCREEN 2: LEVEL 2 (Mencocokkan) ==================== */}
      {currentLevel === 2 && (
        <Card hoverEffect={false}>
          <div className="px-3 py-1 bg-bisara-orange bg-opacity-10 text-bisara-orange rounded-full text-xs font-black uppercase font-zain tracking-wider inline-block mb-4">
            Level 2: Mencocokkan
          </div>
          <h3 className="font-zain text-4xl font-extrabold text-bisara-navy mb-4">Mencocokkan Unsur Kalimat</h3>
          <p className="text-slate-500 font-semibold text-base mb-8">
            Bacalah kalimat di bawah ini dengan saksama dan pilih jawaban yang paling tepat!
          </p>

          <div className="max-w-[700px] mx-auto bg-slate-50 p-8 rounded-lg border border-slate-200 mb-8 text-center">
            <h4 className="text-xs text-slate-400 font-extrabold uppercase mb-2">Kalimat Cerita</h4>
            <p className="text-2xl font-nunito font-extrabold text-bisara-navy mb-6">
              "Anya sedang makan donat."
            </p>
            <div className="w-full h-[1px] bg-slate-200 my-6" />
            <h3 className="text-lg font-nunito font-extrabold text-slate-600 mb-6">
              Siapakah yang berperan sebagai <span className="text-bisara-accent">Subjek (S)</span> di kalimat tersebut?
            </h3>

            {/* Choices list */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => !l2Checked && setL2Answer('makan')}
                className={`py-4 px-6 border-2 rounded-lg font-extrabold text-base transition-all text-left flex items-center justify-between ${
                  l2Answer === 'makan' 
                    ? 'border-bisara-pink bg-pink-50 bg-opacity-10 text-bisara-pink' 
                    : 'border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <span>A. makan</span>
                <span className="text-xs font-black opacity-60">(Kata Kerja / Tindakan)</span>
              </button>

              <button 
                onClick={() => !l2Checked && setL2Answer('donat')}
                className={`py-4 px-6 border-2 rounded-lg font-extrabold text-base transition-all text-left flex items-center justify-between ${
                  l2Answer === 'donat' 
                    ? 'border-bisara-pink bg-pink-50 bg-opacity-10 text-bisara-pink' 
                    : 'border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <span>B. donat</span>
                <span className="text-xs font-black opacity-60">(Kata Benda / Objek Sasaran)</span>
              </button>

              <button 
                onClick={() => !l2Checked && setL2Answer('anya')}
                className={`py-4 px-6 border-2 rounded-lg font-extrabold text-base transition-all text-left flex items-center justify-between ${
                  l2Answer === 'anya' 
                    ? 'border-bisara-accent bg-blue-50 bg-opacity-10 text-bisara-accent' 
                    : 'border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <span>C. Anya</span>
                <span className="text-xs font-black opacity-60">(Pelaku / Aktor Utama)</span>
              </button>
            </div>

            {/* Feedback message */}
            {l2Checked && (
              <div className="mt-8">
                {l2Answer === 'anya' ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-5 rounded-md font-extrabold">
                    🎉 Jawaban Benar! Anya adalah pelaku (Subjek) yang melakukan aktivitas makan.
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-md font-extrabold flex items-center justify-between">
                    <span>❌ Salah! Coba ingat kembali bahwa Subjek adalah "pelaku".</span>
                    <button 
                      onClick={() => { setL2Checked(false); setL2Answer(null); }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md text-xs font-bold"
                    >
                      Coba Lagi
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Submit button */}
            <div className="mt-8 flex justify-center">
              {!l2Checked ? (
                <button 
                  disabled={!l2Answer}
                  onClick={() => setL2Checked(true)}
                  className={`py-4 px-10 rounded-full font-extrabold transition-transform ${
                    l2Answer 
                      ? 'bg-bisara-accent text-white hover:scale-102 shadow-md' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Periksa Jawaban
                </button>
              ) : (
                l2Answer === 'anya' && (
                  <button 
                    onClick={() => handleCompleteLevel(2, 3)}
                    className="py-4 px-10 bg-bisara-pink text-white rounded-full font-extrabold hover:scale-102 shadow-md"
                  >
                    Lanjut & Dapat 3 Bintang ⭐
                  </button>
                )
              )}
            </div>

          </div>
        </Card>
      )}

      {/* ==================== SCREEN 3: LEVEL 3 (Menyusun) ==================== */}
      {currentLevel === 3 && (
        <Card hoverEffect={false}>
          <div className="px-3 py-1 bg-bisara-pink bg-opacity-10 text-bisara-pink rounded-full text-xs font-black uppercase font-zain tracking-wider inline-block mb-4">
            Level 3: Menyusun
          </div>
          <h3 className="font-zain text-4xl font-extrabold text-bisara-navy mb-4">Menyusun Struktur S-P-O</h3>
          <p className="text-slate-500 font-semibold text-base mb-8">
            Urutkan kartu kata di bawah agar membentuk pola kalimat **Subjek (S) - Predikat (P) - Objek (O)** yang logis!
          </p>

          <div className="max-w-[700px] mx-auto bg-slate-50 p-8 rounded-lg border border-slate-200 mb-8 text-center">
            
            {/* Target Slot Area */}
            <h4 className="text-xs text-slate-400 font-extrabold uppercase mb-4">Susunan Kalimat Anda</h4>
            <div className="flex justify-center gap-4 min-h-[90px] border-2 border-dashed border-slate-300 rounded-lg items-center bg-white p-4 mb-8">
              {l3Selected.length === 0 && (
                <span className="text-slate-400 font-semibold text-sm">Klik kartu kata di bawah untuk menyusun kalimat</span>
              )}
              {l3Selected.map(word => (
                <button 
                  key={word}
                  onClick={() => handleL3WordClick(word, true)}
                  className="px-6 py-3 bg-bisara-accent text-white font-extrabold rounded-md shadow hover:bg-opacity-90 transition-all flex items-center gap-2"
                >
                  <span>{word}</span>
                  <X size={14} />
                </button>
              ))}
            </div>

            {/* Source Pools */}
            <h4 className="text-xs text-slate-400 font-extrabold uppercase mb-4">Pilihan Kartu Kata</h4>
            <div className="flex justify-center gap-4 min-h-[60px] items-center mb-8">
              {l3Pool.map(word => (
                <button 
                  key={word}
                  onClick={() => handleL3WordClick(word, false)}
                  className="px-6 py-3 bg-white border border-slate-200 text-bisara-navy font-extrabold rounded-md shadow hover:translate-y-[-2px] transition-all"
                >
                  {word}
                </button>
              ))}
            </div>

            {/* Feedback alert */}
            {l3Checked && (
              <div className="mt-8">
                {l3IsCorrect ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-5 rounded-md font-extrabold">
                    🎉 Luar Biasa! Susunan "Ayah (S) - minum (P) - kopi (O)" sangat tepat sesuai pola SPOK.
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-md font-extrabold flex items-center justify-between">
                    <span>❌ Salah! Susunan yang Anda buat belum memenuhi pola Subjek-Predikat-Objek.</span>
                    <button 
                      onClick={() => {
                        setL3Checked(false);
                        setL3Selected([]);
                        setL3Pool(['kopi', 'Ayah', 'minum']);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md text-xs font-bold"
                    >
                      Ulangi
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Controller row */}
            <div className="mt-8 flex justify-center">
              {!l3Checked ? (
                <button 
                  disabled={l3Pool.length > 0}
                  onClick={handleL3Submit}
                  className={`py-4 px-10 rounded-full font-extrabold transition-transform ${
                    l3Pool.length === 0 
                      ? 'bg-bisara-accent text-white hover:scale-102 shadow-md' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Periksa Struktur Kalimat
                </button>
              ) : (
                l3IsCorrect && (
                  <button 
                    onClick={() => handleCompleteLevel(3, 3)}
                    className="py-4 px-10 bg-bisara-pink text-white rounded-full font-extrabold hover:scale-102 shadow-md"
                  >
                    Lanjut & Dapat 3 Bintang ⭐
                  </button>
                )
              )}
            </div>

          </div>
        </Card>
      )}

      {/* ==================== SCREEN 4: LEVEL 4 (Lengkapi) ==================== */}
      {currentLevel === 4 && (
        <Card hoverEffect={false}>
          <div className="px-3 py-1 bg-bisara-accent-muted bg-opacity-10 text-bisara-accent-muted rounded-full text-xs font-black uppercase font-zain tracking-wider inline-block mb-4">
            Level 4: Melengkapi
          </div>
          <h3 className="font-zain text-4xl font-extrabold text-bisara-navy mb-4">Melengkapi Bagian Kalimat</h3>
          <p className="text-slate-500 font-semibold text-base mb-8">
            Pilih kata pelengkap yang tepat untuk memenuhi posisi kosong di kalimat berikut!
          </p>

          <div className="max-w-[700px] mx-auto bg-slate-50 p-8 rounded-lg border border-slate-200 mb-8 text-center">
            
            {/* Fill-in slot representation */}
            <div className="flex justify-center items-center gap-3 mb-8">
              <span className="px-6 py-4 bg-white border border-dashed border-bisara-pink rounded-lg font-bold text-bisara-pink text-xl min-w-[120px]">
                {l4Answer ? l4Answer : ' . . . '}
              </span>
              <span className="text-2xl font-nunito font-black text-bisara-navy">membaca</span>
              <span className="text-2xl font-nunito font-black text-bisara-navy">buku</span>
            </div>
            
            <p className="text-sm font-bold text-slate-400 mb-6">
              Pilihlah salah satu kata di bawah ini yang dapat berfungsi sebagai <span className="text-bisara-accent-muted">Subjek (S)</span>!
            </p>

            {/* Choices */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => !l4Checked && setL4Answer('Buku')}
                className={`py-4 px-6 border-2 rounded-lg font-extrabold text-base transition-all text-left flex items-center justify-between ${
                  l4Answer === 'Buku' 
                    ? 'border-bisara-pink bg-pink-50 bg-opacity-10 text-bisara-pink' 
                    : 'border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <span>A. Buku</span>
                <span className="text-xs font-black text-slate-400">Pilihan ini akan membuat kalimat rancu karena Buku tidak bisa membaca</span>
              </button>

              <button 
                onClick={() => !l4Checked && setL4Answer('Makan')}
                className={`py-4 px-6 border-2 rounded-lg font-extrabold text-base transition-all text-left flex items-center justify-between ${
                  l4Answer === 'Makan' 
                    ? 'border-bisara-pink bg-pink-50 bg-opacity-10 text-bisara-pink' 
                    : 'border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <span>B. Makan</span>
                <span className="text-xs font-black text-slate-400">Makan adalah Kata Kerja (Predikat), tidak cocok sebagai Subjek pelaku</span>
              </button>

              <button 
                onClick={() => !l4Checked && setL4Answer('Saya')}
                className={`py-4 px-6 border-2 rounded-lg font-extrabold text-base transition-all text-left flex items-center justify-between ${
                  l4Answer === 'Saya' 
                    ? 'border-bisara-accent-muted bg-purple-50 bg-opacity-10 text-bisara-accent-muted' 
                    : 'border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <span>C. Saya</span>
                <span className="text-xs font-black text-[#7C3AED]">Benar, "Saya" adalah Kata Ganti Orang yang berfungsi sebagai Subjek</span>
              </button>
            </div>

            {/* Feedback alert */}
            {l4Checked && (
              <div className="mt-8">
                {l4Answer === 'Saya' ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-5 rounded-md font-extrabold">
                    🎉 Hebat! "Saya membaca buku" merupakan kalimat lengkap yang logis dengan pola S-P-O.
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-md font-extrabold flex items-center justify-between">
                    <span>❌ Salah! Kata tersebut tidak logis diletakkan sebagai pelaku (Subjek).</span>
                    <button 
                      onClick={() => { setL4Checked(false); setL4Answer(null); }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md text-xs font-bold"
                    >
                      Ulangi
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Check answers controller */}
            <div className="mt-8 flex justify-center">
              {!l4Checked ? (
                <button 
                  disabled={!l4Answer}
                  onClick={() => setL4Checked(true)}
                  className={`py-4 px-10 rounded-full font-extrabold transition-transform ${
                    l4Answer 
                      ? 'bg-bisara-accent text-white hover:scale-102 shadow-md' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Periksa Kelengkapan
                </button>
              ) : (
                l4Answer === 'Saya' && (
                  <button 
                    onClick={() => handleCompleteLevel(4, 3)}
                    className="py-4 px-10 bg-bisara-pink text-white rounded-full font-extrabold hover:scale-102 shadow-md"
                  >
                    Lanjut & Dapat 3 Bintang ⭐
                  </button>
                )
              )}
            </div>

          </div>
        </Card>
      )}

      {/* ==================== SCREEN 5: LEVEL 5 (Identifikasi) ==================== */}
      {currentLevel === 5 && (
        <Card hoverEffect={false}>
          <div className="px-3 py-1 bg-bisara-cyan bg-opacity-15 text-[#0891B2] rounded-full text-xs font-black uppercase font-zain tracking-wider inline-block mb-4">
            Level 5: Identifikasi
          </div>
          <h3 className="font-zain text-4xl font-extrabold text-bisara-navy mb-4">Identifikasi Unsur Kalimat</h3>
          <p className="text-slate-500 font-semibold text-base mb-8">
            Sentuh kata yang tepat dari kalimat di bawah ini untuk menjawab pertanyaan!
          </p>

          <div className="max-w-[700px] mx-auto bg-slate-50 p-8 rounded-lg border border-slate-200 mb-8 text-center">
            
            <h4 className="text-xs text-slate-400 font-extrabold uppercase mb-6">Kalimat Sasaran</h4>
            
            {/* Clickable Word Card Array */}
            <div className="flex justify-center gap-4 mb-8">
              <button 
                onClick={() => !l5Checked && setL5SelectedWord('Ibu')}
                className={`px-8 py-5 border-2 rounded-lg font-nunito text-xl font-extrabold transition-all ${
                  l5SelectedWord === 'Ibu'
                    ? 'bg-bisara-pink text-white border-bisara-pink shadow-md scale-102'
                    : 'bg-white border-slate-200 text-bisara-navy hover:border-bisara-cyan'
                }`}
              >
                Ibu
              </button>

              <button 
                onClick={() => !l5Checked && setL5SelectedWord('memasak')}
                className={`px-8 py-5 border-2 rounded-lg font-nunito text-xl font-extrabold transition-all ${
                  l5SelectedWord === 'memasak'
                    ? 'bg-bisara-accent text-white border-bisara-accent shadow-md scale-102'
                    : 'bg-white border-slate-200 text-bisara-navy hover:border-bisara-cyan'
                }`}
              >
                memasak
              </button>

              <button 
                onClick={() => !l5Checked && setL5SelectedWord('sayur')}
                className={`px-8 py-5 border-2 rounded-lg font-nunito text-xl font-extrabold transition-all ${
                  l5SelectedWord === 'sayur'
                    ? 'bg-bisara-pink text-white border-bisara-pink shadow-md scale-102'
                    : 'bg-white border-slate-200 text-bisara-navy hover:border-bisara-cyan'
                }`}
              >
                sayur
              </button>
            </div>

            <div className="w-full h-[1px] bg-slate-200 my-6" />
            <h3 className="text-lg font-nunito font-extrabold text-slate-600 mb-6">
              Manakah kata di atas yang berperan sebagai <span className="text-bisara-accent">Predikat (P)</span>?
            </h3>

            {/* Feedback alert */}
            {l5Checked && (
              <div className="mt-8">
                {l5SelectedWord === 'memasak' ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-5 rounded-md font-extrabold">
                    🎉 Tepat Sekali! "memasak" adalah tindakan / kata kerja yang menjadi Predikat (P) di kalimat tersebut.
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-md font-extrabold flex items-center justify-between">
                    <span>❌ Salah! Kata tersebut merupakan Kata Benda (Subjek/Objek), bukan kata kerja (Predikat).</span>
                    <button 
                      onClick={() => { setL5Checked(false); setL5SelectedWord(null); }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md text-xs font-bold"
                    >
                      Ulangi
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Check answers controller */}
            <div className="mt-8 flex justify-center">
              {!l5Checked ? (
                <button 
                  disabled={!l5SelectedWord}
                  onClick={() => setL5Checked(true)}
                  className={`py-4 px-10 rounded-full font-extrabold transition-transform ${
                    l5SelectedWord 
                      ? 'bg-bisara-accent text-white hover:scale-102 shadow-md' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Identifikasi
                </button>
              ) : (
                l5SelectedWord === 'memasak' && (
                  <button 
                    onClick={() => handleCompleteLevel(5, 3)}
                    className="py-4 px-10 bg-bisara-pink text-white rounded-full font-extrabold hover:scale-102 shadow-md"
                  >
                    Lanjut & Dapat 3 Bintang ⭐
                  </button>
                )
              )}
            </div>

          </div>
        </Card>
      )}

      {/* ==================== SCREEN 6: LEVEL 6 (Kalimat Kamera) ==================== */}
      {currentLevel === 6 && (
        <Card hoverEffect={false}>
          <div className="px-3 py-1 bg-yellow-100 text-[#D4AF37] rounded-full text-xs font-black uppercase font-zain tracking-wider inline-block mb-4">
            Level 6: Asesmen Kamera
          </div>
          <h3 className="font-zain text-4xl font-extrabold text-bisara-navy mb-4">Tantangan Kalimat Kontekstual SIBI</h3>
          <p className="text-slate-500 font-semibold text-base mb-8">
            Uji kemandirian Anda! Peragakan seluruh kalimat lengkap di bawah ini menggunakan bahasa isyarat SIBI secara teratur di depan kamera.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
            
            {/* Guide Column */}
            <div className="flex flex-col gap-6">
              <div className="bg-white border-1.5 border-slate-100 rounded-lg p-6 shadow-sm relative">
                <h4 className="text-xs text-slate-400 font-black uppercase mb-1">Target Kalimat SIBI</h4>
                <h3 className="font-zain text-4xl font-extrabold text-bisara-navy mb-4">
                  "Saya membaca buku"
                </h3>
                
                {/* Visual guideline representation */}
                <div className="w-full h-[220px] bg-slate-50 rounded-md overflow-hidden flex flex-col items-center justify-center border border-slate-100 relative">
                  <span className="text-6xl mb-4">📖</span>
                  <div className="text-center px-4">
                    <p className="text-xs font-extrabold text-slate-500">
                      Rangkaian Gerakan:
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 mt-1">
                      Ketuk dada (Saya) ➔ Tangan menunjuk kening lalu turun (membaca) ➔ Telapak tangan membuka (buku)
                    </p>
                  </div>
                </div>
              </div>

              {/* AI scoring outputs */}
              {l6DoneDetecting && (
                <div className="bg-white border border-slate-100 rounded-lg p-6 shadow-sm flex flex-col items-center gap-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase">Hasil Penilaian AI</h4>
                  
                  {/* Star indicators */}
                  <div className="flex gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-4xl transition-all ${
                          i < l6Stars ? 'text-bisara-yellow scale-110' : 'text-slate-200'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-zain font-black text-bisara-navy">
                      Akurasi: {l6Accuracy}%
                    </div>
                    <div className="text-xs text-slate-400 font-bold mt-1">
                      {l6Stars === 3 ? 'Sangat Baik! Struktur S-P-O benar.' :
                       l6Stars === 2 ? 'Baik! Butuh sedikit penyempurnaan gerakan.' :
                       'Coba latihan kembali kosakata ini di Kamus.'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Camera preview column */}
            <div className="flex flex-col items-center gap-6 bg-slate-50 border border-slate-200 rounded-lg p-6">
              
              {/* Webcam Component */}
              <div className="max-w-[480px] w-full">
                <CameraPreview isQuizMode={true} onAccuracyUpdate={handleL6AccuracyUpdate} />
              </div>

              {/* Interactive buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={handleL6DetectAI}
                  className="px-8 py-4 bg-bisara-pink text-white font-extrabold rounded-full shadow-[0_4px_15px_rgba(255,77,157,0.2)] hover:scale-105 active:scale-95 transition-transform"
                >
                  Mulai Deteksi AI
                </button>
                <button 
                  onClick={() => handleCompleteLevel(6, l6Stars)}
                  disabled={!l6DoneDetecting}
                  className={`px-8 py-4 font-extrabold rounded-full transition-transform ${
                    l6DoneDetecting 
                      ? 'bg-bisara-accent text-white hover:scale-105 active:scale-95 shadow-[0_4px_15px_rgba(37,99,255,0.2)]' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Selesaikan Kuis & Klaim Bintang ⭐
                </button>
              </div>

            </div>

          </div>
        </Card>
      )}

    </div>
  );
};
