import React, { useState } from 'react';
import { CameraPreview } from '../shared/CameraPreview';
import { Card } from '../ui/Card';
import type { QuizRound, AvatarConfig } from '../../types';

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
  quizRounds, 
  avatarShop,
  unlockedAvatars,
  onQuizComplete,
  triggerConfetti
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [starsEarned, setStarsEarned] = useState(0);
  const [totalSessionStars, setTotalSessionStars] = useState(0);
  const [isDoneDetecting, setIsDoneDetecting] = useState(false);

  const activeRound = quizRounds[currentIndex];

  const handleAccuracyUpdate = (acc: number) => {
    setAccuracy(acc);
  };

  const handleDetectAI = () => {
    // Math random mock matching accuracy
    const acc = accuracy || Math.floor(75 + Math.random() * 20);
    setAccuracy(acc);
    setIsDoneDetecting(true);

    let roundStars = 1;
    if (acc >= 85) {
      roundStars = 3;
      triggerConfetti();
    } else if (acc >= 70) {
      roundStars = 2;
    }
    
    setStarsEarned(roundStars);
    setTotalSessionStars(prev => prev + roundStars);
  };

  const handleNext = () => {
    setIsDoneDetecting(false);
    setAccuracy(null);
    setStarsEarned(0);

    if (currentIndex + 1 < quizRounds.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed full session!
      onQuizComplete(totalSessionStars);
      // Reset
      setCurrentIndex(0);
      setTotalSessionStars(0);
    }
  };

  return (
    <div className="w-full">
      <h2 className="font-zain text-5xl font-extrabold text-bisara-navy mb-6">
        Tugas & Kuis Asesmen
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-8">
        {/* Play Sandbox */}
        <Card className="text-center" hoverEffect={false}>
          <div className="flex justify-between items-center text-sm font-extrabold text-slate-400 mb-8">
            <span>TINGKAT ACC: <strong className="text-bisara-accent">{accuracy ? `${accuracy}%` : '--%'}</strong></span>
            <span>SOAL {currentIndex + 1} DARI {quizRounds.length}</span>
          </div>

          <p className="text-lg font-nunito font-extrabold text-slate-500 mb-2">
            PERAGAKAN ISYARAT BERIKUT:
          </p>
          <h1 className="font-zain text-6xl font-extrabold text-bisara-navy mb-6">
            {activeRound.word}
          </h1>

          {/* Star Icons */}
          <div className="flex justify-center gap-4 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <span 
                key={i} 
                className={`text-5xl transition-transform duration-300 select-none ${
                  isDoneDetecting && i < starsEarned 
                    ? 'text-bisara-yellow scale-110 drop-shadow-[0_0_8px_rgba(255,214,10,0.4)]' 
                    : 'text-slate-200'
                }`}
              >
                ★
              </span>
            ))}
          </div>

          {/* Camera Sandbox Container */}
          <div className="max-w-[480px] mx-auto mb-8">
            <CameraPreview isQuizMode={true} onAccuracyUpdate={handleAccuracyUpdate} />
          </div>

          <div className="flex gap-4 justify-center">
            <button 
              onClick={handleDetectAI}
              className="px-8 py-4 bg-bisara-pink text-white font-extrabold rounded-full shadow-[0_4px_15px_rgba(255,77,157,0.2)] hover:scale-105 active:scale-95 transition-transform"
            >
              Mulai Deteksi AI
            </button>
            <button 
              onClick={handleNext}
              disabled={!isDoneDetecting}
              className={`px-8 py-4 font-extrabold rounded-full transition-transform ${
                isDoneDetecting 
                  ? 'bg-bisara-accent text-white hover:scale-105 active:scale-95' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Lanjut
            </button>
          </div>
        </Card>

        {/* List of active tasks & shop */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-100 rounded-lg p-8 shadow-sm">
            <h3 className="font-zain text-3xl font-extrabold text-bisara-navy mb-5">Tugas Kuis Aktif</h3>
            
            <div className="flex flex-col gap-4">
              <div className="border border-slate-200 rounded-md p-4 bg-blue-50 bg-opacity-30 border-bisara-accent">
                <div className="font-extrabold text-bisara-navy">Kata Santun Terpandu</div>
                <div className="text-xs text-slate-400 font-bold mt-1">5 Kuis • Pre-syarat SIBI</div>
                <div className="text-xs text-bisara-accent font-extrabold mt-3">Sedang Berjalan</div>
              </div>
              <div className="border border-slate-200 rounded-md p-4">
                <div className="font-extrabold text-bisara-navy">Kata Dasar SIBI</div>
                <div className="text-xs text-slate-400 font-bold mt-1">10 Kuis • Selesai</div>
                <div className="text-xs text-bisara-pink font-extrabold mt-3">Selesai</div>
              </div>
            </div>
          </div>

          {/* Reward unlocks shop */}
          <div className="bg-white border border-slate-100 rounded-lg p-8 shadow-sm">
            <h3 className="font-zain text-3xl font-extrabold text-bisara-navy mb-1">Koleksi Reward Avatar</h3>
            <p className="text-xs text-slate-400 font-bold mb-5">Selesaikan tugas bintang 3 untuk membuka karakter unik!</p>

            <div className="grid grid-cols-3 gap-4">
              {Object.keys(avatarShop).map(key => {
                const av = avatarShop[key];
                const isUnlocked = unlockedAvatars.includes(key);
                return (
                  <div 
                    key={key}
                    className={`border border-slate-200 rounded-md p-3 text-center bg-slate-50 opacity-60 transition-all ${
                      isUnlocked ? 'bg-white border-bisara-yellow opacity-100' : ''
                    }`}
                  >
                    <div className="text-3xl mb-2 select-none">{av.emoji}</div>
                    <div className="text-[10px] font-extrabold text-bisara-navy truncate">{av.name}</div>
                    <div className="text-[9px] font-extrabold text-slate-400 mt-1">
                      {isUnlocked ? 'Unlocked' : `${av.starsNeeded} 🌟`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
