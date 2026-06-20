import React from 'react';
import { CameraPreview } from '../shared/CameraPreview';
import { Alert } from '../ui/Alert';
import { ArrowLeft } from 'lucide-react';
import type { DictionaryItem } from '../../types';

interface CameraTranslatorProps {
  selectedGesture: DictionaryItem;
  onNavigate: (viewId: string) => void;
}

export const CameraTranslator: React.FC<CameraTranslatorProps> = ({ 
  selectedGesture, 
  onNavigate 
}) => {

  const drawDynamicGestureVector = (clipName: string) => {
    let paths = "";
    if (clipName === 'makan') {
      paths = `<!-- Head -->
        <circle cx="50" cy="30" r="14" fill="#FFE0B2"/>
        <path d="M38,30 C38,18 62,18 62,30" fill="#4E342E"/>
        <!-- Body -->
        <path d="M30,70 C30,55 70,55 70,70 L70,95 L30,95 Z" fill="#5C6BC0"/>
        <!-- Hand -->
        <path d="M50,75 L62,50 L52,38" fill="none" stroke="#FFE0B2" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="52" cy="38" r="6" fill="#FFE0B2"/>
        <path d="M48,38 L45,35" stroke="#E65100" stroke-width="2"/>`;
    } else if (clipName === 'terima-kasih') {
      paths = `<!-- Head -->
        <circle cx="50" cy="30" r="14" fill="#FFE0B2"/>
        <path d="M38,30 C38,18 62,18 62,30" fill="#4E342E"/>
        <!-- Body -->
        <path d="M30,70 C30,55 70,55 70,70 L70,95 L30,95 Z" fill="#D81B60"/>
        <!-- Hand -->
        <path d="M50,75 L65,58 L52,32" fill="none" stroke="#FFE0B2" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="52" cy="32" r="6" fill="#FFE0B2"/>`;
    } else {
      paths = `<!-- Head -->
        <circle cx="50" cy="30" r="14" fill="#FFE0B2"/>
        <path d="M38,30 C38,18 62,18 62,30" fill="#4E342E"/>
        <!-- Body -->
        <path d="M30,70 C30,55 70,55 70,70 L70,95 L30,95 Z" fill="#0284C7"/>
        <!-- Hand -->
        <path d="M30,75 L20,55 L16,40" fill="none" stroke="#FFE0B2" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="16" cy="40" r="6" fill="#FFE0B2"/>`;
    }

    return (
      <svg viewBox="0 0 100 100" className="w-[90%] h-[90%] object-contain">
        <rect width="100" height="100" fill="#FFFDF5" rx="15" />
        {React.createElement('g', { dangerouslySetInnerHTML: { __html: paths } })}
      </svg>
    );
  };

  return (
    <div className="w-full">
      <button 
        onClick={() => onNavigate('dictionary')}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-br from-bisara-accent to-purple-400 text-white font-extrabold text-sm mb-6 shadow-md hover:translate-y-[-2px] transition-transform duration-300"
      >
        <ArrowLeft size={16} strokeWidth={3} />
        Kembali ke Kamus
      </button>

      <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-8">
        {/* Guide Column */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border-1.5 border-slate-100 rounded-lg p-[30px_24px] shadow-sm relative">
            {/* Speech bubble tail */}
            <div className="absolute right-[-12px] top-[50px] w-6 h-6 bg-white border-r-1.5 border-b-1.5 border-slate-100 transform rotate-[-45deg] hidden md:block" />
            <h3 className="font-zain text-4xl font-extrabold text-bisara-navy mb-4">
              {selectedGesture.word}
            </h3>
            
            {/* Gesture Illustration box */}
            <div className="w-full h-[280px] bg-slate-50 rounded-md overflow-hidden flex items-center justify-center relative">
              {drawDynamicGestureVector(selectedGesture.clip)}
            </div>
          </div>

          <Alert type="hint">
            {selectedGesture.description}
          </Alert>
        </div>

        {/* Camera Sandbox Preview column */}
        <div className="flex flex-col items-center">
          <CameraPreview isQuizMode={false} gestureKey={selectedGesture.clip} />
        </div>
      </div>
    </div>
  );
};
