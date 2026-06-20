import React from 'react';

const avatarSvgs: Record<string, string> = {
  timi: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="40" fill="#7C3AED"/><polygon points="20,20 40,40 20,50" fill="#6D28D9"/><polygon points="80,20 60,40 80,50" fill="#6D28D9"/><circle cx="50" cy="56" r="25" fill="#C084FC"/><circle cx="42" cy="52" r="4.5" fill="#111827"/><circle cx="58" cy="52" r="4.5" fill="#111827"/><polygon points="50,59 47,56 53,56" fill="#FF4D9D"/></svg>`,
  kiko: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="40" fill="#22D3EE"/><rect x="25" y="8" width="14" height="34" rx="7" fill="#0EA5E9"/><rect x="61" y="8" width="14" height="34" rx="7" fill="#0EA5E9"/><circle cx="50" cy="56" r="25" fill="#E0F7FA"/><circle cx="42" cy="52" r="4" fill="#111827"/><circle cx="58" cy="52" r="4" fill="#111827"/><polygon points="50,59 47,56 53,56" fill="#FF4D9D"/></svg>`,
  lulu: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="28" cy="28" r="14" fill="#D97706"/><circle cx="72" cy="28" r="14" fill="#D97706"/><circle cx="50" cy="50" r="40" fill="#FF8A00"/><circle cx="50" cy="58" r="20" fill="#FFE082"/><circle cx="42" cy="48" r="4" fill="#111827"/><circle cx="58" cy="48" r="4" fill="#111827"/><ellipse cx="50" cy="54" rx="4" ry="2.5" fill="#111827"/></svg>`,
};

interface AvatarViewerProps {
  avatarId: string;
  activeClip: string | null;
  frameIndex: number;
  activeLetter?: string | null;
}

export const AvatarViewer: React.FC<AvatarViewerProps> = ({ 
  avatarId, 
  activeClip, 
  frameIndex,
  activeLetter
}) => {
  const getWordSvg = (clip: string, frame: number) => {
    if (clip === 'makan') {
      const cycle = (frame % 30) / 30;
      const pull = Math.sin(cycle * Math.PI);
      const tx = -8 * pull;
      const ty = -18 * pull;
      
      return (
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] object-contain">
          <rect width="100" height="100" fill="#F8FAFC" rx="16" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="50" cy="32" r="14" fill="#FFE0B2"/>
          <path d="M38,32 C38,20 62,20 62,32" fill="#4E342E"/>
          <circle cx="50" cy="38" r={2 + 3 * pull} fill="#FF4D9D" />
          <path d="M30,75 C30,60 70,60 70,75 L70,95 L30,95 Z" fill="#5C6BC0"/>
          <g transform={`translate(${tx}, ${ty})`}>
            <path d="M50,75 L62,50 L52,38" fill="none" stroke="#FFE0B2" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="52" cy="38" r="6.5" fill="#FFE0B2"/>
            <path d="M48,38 L45,35" stroke="#E65100" strokeWidth="2"/>
          </g>
        </svg>
      );
    }
    
    if (clip === 'terima-kasih') {
      const cycle = (frame % 90) / 90;
      const pull = Math.sin(cycle * Math.PI);
      const tx = 15 * pull;
      const ty = 20 * pull;
      
      return (
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] object-contain">
          <rect width="100" height="100" fill="#F8FAFC" rx="16" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="50" cy="32" r="14" fill="#FFE0B2"/>
          <path d="M38,32 C38,20 62,20 62,32" fill="#4E342E"/>
          <path d="M30,75 C30,60 70,60 70,75 L70,95 L30,95 Z" fill="#D81B60"/>
          <g transform={`translate(${tx}, ${ty})`}>
            <path d="M50,75 L65,58 L52,32" fill="none" stroke="#FFE0B2" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="52" cy="32" r="6.5" fill="#FFE0B2"/>
          </g>
        </svg>
      );
    }
    
    if (clip === 'tolong') {
      const cycle = (frame % 60) / 60;
      const pull = Math.sin(cycle * Math.PI * 2) * 5;
      
      return (
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] object-contain">
          <rect width="100" height="100" fill="#F8FAFC" rx="16" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="50" cy="32" r="14" fill="#FFE0B2"/>
          <path d="M38,32 C38,20 62,20 62,32" fill="#4E342E"/>
          <path d="M30,75 C30,60 70,60 70,75 L70,95 L30,95 Z" fill="#0284C7"/>
          <g transform={`translate(0, ${pull})`}>
            <path d="M35,75 L45,55 L48,45" fill="none" stroke="#FFE0B2" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M65,75 L55,55 L52,45" fill="none" stroke="#FFE0B2" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
            <ellipse cx="50" cy="45" rx="5" ry="7" fill="#FFE0B2"/>
          </g>
        </svg>
      );
    }
    
    if (clip === 'belajar') {
      const tap = Math.sin(frame * 0.4) > 0 ? 1 : 0;
      const ty = tap * 8;
      
      return (
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] object-contain">
          <rect width="100" height="100" fill="#F8FAFC" rx="16" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="50" cy="32" r="14" fill="#FFE0B2"/>
          <path d="M38,32 C38,20 62,20 62,32" fill="#4E342E"/>
          <path d="M30,75 C30,60 70,60 70,75 L70,95 L30,95 Z" fill="#0284C7"/>
          <path d="M30,75 L42,60 L58,60" fill="none" stroke="#FFE0B2" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
          <g transform={`translate(0, ${ty})`}>
            <path d="M65,75 L52,50" fill="none" stroke="#FFE0B2" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="52" cy="50" r="5" fill="#FFE0B2"/>
          </g>
        </svg>
      );
    }
    
    if (clip === 'halo') {
      const wave = Math.sin(frame * 0.3) * 8;
      
      return (
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] object-contain">
          <rect width="100" height="100" fill="#F8FAFC" rx="16" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="50" cy="32" r="14" fill="#FFE0B2"/>
          <path d="M38,32 C38,20 62,20 62,32" fill="#4E342E"/>
          <path d="M30,75 C30,60 70,60 70,75 L70,95 L30,95 Z" fill="#8B5CF6"/>
          <g transform={`translate(${wave}, 0)`} style={{ transformOrigin: '30px 75px' }}>
            <path d="M30,75 L20,50 L16,38" fill="none" stroke="#FFE0B2" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="16" cy="38" r="6.5" fill="#FFE0B2"/>
          </g>
        </svg>
      );
    }

    if (clip === 'buku') {
      const cycle = (frame % 60) / 60;
      const openScaleX = cycle < 0.3 ? 0.2 : cycle < 0.8 ? 0.2 + 0.8 * ((cycle - 0.3) / 0.5) : 1.0;
      
      return (
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] object-contain">
          <rect width="100" height="100" fill="#F8FAFC" rx="16" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="50" cy="32" r="14" fill="#FFE0B2"/>
          <path d="M38,32 C38,20 62,20 62,32" fill="#4E342E"/>
          <path d="M30,75 C30,60 70,60 70,75 L70,95 L30,95 Z" fill="#10B981"/>
          <g transform={`translate(50, 60) scale(${openScaleX}, 1) translate(-50, -60)`}>
            <path d="M30,60 L48,60 L48,68 L30,68 Z" fill="#FFE0B2" stroke="#D97706" strokeWidth="1"/>
            <path d="M52,60 L70,60 L70,68 L52,68 Z" fill="#FFE0B2" stroke="#D97706" strokeWidth="1"/>
          </g>
        </svg>
      );
    }
    
    return (
      <div className="w-[85%] h-[85%] bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-scale-in">
        <span className="text-5xl mb-3">👋</span>
        <span className="font-nunito font-extrabold text-bisara-navy text-lg leading-snug">
          Peragaan Isyarat "{clip.toUpperCase()}"
        </span>
        <span className="text-slate-400 font-bold text-xs mt-1.5 max-w-[200px]">
          Ikuti panduan teks dan visual di sebelah kiri Anda.
        </span>
      </div>
    );
  };

  if (activeLetter) {
    const letter = activeLetter.toUpperCase();
    const isAOrB = letter === 'A' || letter === 'B';
    const imgSrc = isAOrB ? `/feedback/sign${letter}.png` : null;

    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg overflow-hidden">
        <style>{`
          @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-scale-in {
            animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}</style>
        {isAOrB && imgSrc ? (
          <div className="flex flex-col items-center gap-3 animate-scale-in">
            <div className="relative w-[220px] h-[220px] bg-white border-4 border-bisara-accent rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
              <img 
                src={imgSrc} 
                alt={`Isyarat Huruf ${letter}`} 
                className="w-full h-full object-contain p-2"
              />
              <div className="absolute top-2 right-2 bg-bisara-accent text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow">
                BISINDO
              </div>
            </div>
            <div className="text-center">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Isyarat Tangan</span>
              <span className="text-3xl font-fredoka font-black text-bisara-navy mt-1 block">Huruf {letter}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center max-w-[240px] animate-scale-in">
            <div className="w-[180px] h-[180px] bg-white border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-6xl shadow-inner relative">
              ✋
              <div className="absolute bottom-2 right-2 bg-slate-100 border border-slate-200 text-slate-500 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                {letter}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Mengeja Huruf</span>
              <span className="text-2xl font-nunito font-black text-bisara-navy mt-1 block">{letter}</span>
              <span className="text-[11px] text-slate-400 font-bold mt-1.5 block leading-normal">
                Visualisasi gambar hanya tersedia untuk huruf A dan B di modul latihan ini.
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeClip) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 bg-slate-50 rounded-lg overflow-hidden">
        <style>{`
          @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-scale-in {
            animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}</style>
        {getWordSvg(activeClip, frameIndex)}
      </div>
    );
  }

  // Idle state
  let avatarSvg = avatarSvgs[avatarId] || avatarSvgs.timi;
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 rounded-lg overflow-hidden relative p-6">
      <style>{`
        @keyframes floatBreathe {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .avatar-float {
          animation: floatBreathe 3s ease-in-out infinite;
        }
      `}</style>
      <div className="w-36 h-36 avatar-float flex items-center justify-center bg-white border-2 border-slate-200 rounded-3xl p-3 shadow-md">
        <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: avatarSvg }} />
      </div>
      <div className="mt-4 text-slate-400 font-bold text-xs select-none">
        {avatarId === 'timi' ? 'Timi' : avatarId === 'kiko' ? 'Kiko' : 'Lulu'} sedang menunggu...
      </div>
    </div>
  );
};
