import React from 'react';
import { Card } from '../ui/Card';
import { BookOpen, Mic, Camera } from 'lucide-react';
import type { UserProfile } from '../../types';

interface HomeProps {
  user: UserProfile;
  onNavigate: (viewId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ user, onNavigate }) => {
  const percent = Math.min(Math.floor((user.quizCount / 3) * 100), 100);

  return (
    <div className="w-full">
      <div className="mb-[35px]">
        <h2 className="font-zain text-5xl font-extrabold text-bisara-navy">
          Halo, Teman Pintar!
        </h2>
        <p className="text-xl text-slate-500 font-semibold">
          Sudah siap belajar bareng BISARA?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-10">
        {/* Card 1: Kosakata */}
        <Card 
          onClick={() => onNavigate('dictionary')}
          className="border-b-4 border-bisara-accent relative overflow-hidden flex flex-col items-center cursor-pointer"
        >
          <div className="absolute top-[-30px] right-[-30px] w-[100px] h-[100px] rounded-full bg-bisara-accent opacity-[0.15]" />
          <div className="w-20 h-20 bg-bisara-accent text-white rounded-[20px] flex items-center justify-center shadow-md mb-6 hover:rotate-6 hover:scale-110 transition-transform duration-300">
            <BookOpen size={36} />
          </div>
          <h3 className="font-zain text-3xl font-extrabold text-bisara-accent mb-3">Kosakata</h3>
          <p className="text-base text-slate-500 font-bold text-center">
            Pelajari kata-kata baru dengan isyarat SIBI!
          </p>
        </Card>

        {/* Card 2: Voice to Sign */}
        <Card 
          onClick={() => onNavigate('voice-translator')}
          className="border-b-4 border-bisara-orange relative overflow-hidden flex flex-col items-center cursor-pointer"
        >
          <div className="absolute top-[-30px] right-[-30px] w-[100px] h-[100px] rounded-full bg-bisara-orange opacity-[0.15]" />
          <div className="w-20 h-20 bg-gradient-to-br from-bisara-yellow to-bisara-orange text-white rounded-[20px] flex items-center justify-center shadow-md mb-6 hover:rotate-6 hover:scale-110 transition-transform duration-300">
            <Mic size={36} />
          </div>
          <h3 className="font-zain text-3xl font-extrabold text-bisara-orange mb-3">Voice-to-Sign</h3>
          <p className="text-base text-slate-500 font-bold text-center">
            Ubah suara atau teks kamu jadi gerakan tangan!
          </p>
        </Card>

        {/* Card 3: Sign to Text */}
        <Card 
          onClick={() => onNavigate('camera-translator')}
          className="border-b-4 border-bisara-pink relative overflow-hidden flex flex-col items-center cursor-pointer"
        >
          <div className="absolute top-[-30px] right-[-30px] w-[100px] h-[100px] rounded-full bg-bisara-pink opacity-[0.15]" />
          <div className="w-20 h-20 bg-bisara-pink text-white rounded-[20px] flex items-center justify-center shadow-md mb-6 hover:rotate-6 hover:scale-110 transition-transform duration-300">
            <Camera size={36} />
          </div>
          <h3 className="font-zain text-3xl font-extrabold text-bisara-pink mb-3">Sign-to-Text</h3>
          <p className="text-base text-slate-500 font-bold text-center">
            Buat gerakan tangan kamu menjadi teks dan suara!
          </p>
        </Card>
      </div>

      {/* Daily progress tracking card */}
      <div className="bg-blue-50 bg-opacity-30 border-2 border-dashed border-bisara-accent rounded-lg p-8 shadow-sm">
        <div className="mb-4">
          <h3 className="font-zain text-3xl font-extrabold text-bisara-navy">Target Harian</h3>
          <p className="text-base text-slate-500 font-semibold">
            Selesaikan 3 kuis hari ini untuk hadiah spesial!
          </p>
        </div>

        <div className="h-10 bg-white border border-slate-200 rounded-full overflow-hidden relative flex items-center shadow-inner mb-3">
          <div 
            className="h-full bg-gradient-to-r from-yellow-300 to-bisara-yellow rounded-full flex items-center justify-end pr-4 shadow-[2px_0_10px_rgba(255,214,10,0.5)] transition-all duration-1000"
            style={{ width: `${percent}%` }}
          >
            <span className="font-extrabold text-bisara-navy text-sm">{percent}%</span>
          </div>
        </div>

        <div className="text-base text-slate-500 font-extrabold">
          {user.quizCount}/3 Kuis Selesai
        </div>
      </div>
    </div>
  );
};
