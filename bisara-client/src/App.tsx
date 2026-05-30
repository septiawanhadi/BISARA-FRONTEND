import React, { useState } from 'react';
import { Home } from './components/screens/Home';
import { Dictionary } from './components/screens/Dictionary';
import { CameraTranslator } from './components/screens/CameraTranslator';
import { VoiceTranslator } from './components/screens/VoiceTranslator';
import { Quiz } from './components/screens/Quiz';
import { TeacherDashboard } from './components/screens/TeacherDashboard';
import type { UserProfile, DictionaryItem, QuizRound, AvatarConfig } from './types';
import { Bell } from 'lucide-react';

// Static assets configurations inside App.tsx
const initialDictionary: DictionaryItem[] = [
  { key: "halo-apa-kabar", word: "Halo, apa kabar?", category: "kalimat", clip: "halo", description: "Lambaikan tangan kanan Anda di depan bahu kanan secara santai dari kiri ke kanan.", learned: true, icon: "👋" },
  { key: "siapa-nama-kamu", word: "Siapa nama kamu?", category: "kalimat", clip: "nama", description: "Arahkan jari telunjuk Anda ke arah lawan bicara, lalu silangkan jari telunjuk dan jari tengah membentuk huruf N.", learned: true, icon: "👤" },
  { key: "boleh-minta-tolong", word: "Boleh minta tolong?", category: "kalimat", clip: "tolong", description: "Satukan kedua telapak tangan Anda di depan dada lalu gerakkan perlahan ke bawah searah ulu hati.", learned: false, icon: "🤝" },
  { key: "aku-mau-makan", word: "Aku mau makan", category: "kalimat", clip: "makan", description: "Bentuk tangan kanan menguncup, sentuh ujung-ujung jari ke mulut beberapa kali berturut-turut.", learned: false, icon: "🍚" },
  { key: "terima-kasih-bantuan", word: "Terima kasih atas bantuannya!", category: "kalimat", clip: "terima-kasih", description: "Letakkan ujung jari tangan kanan di dagu, gerakkan tangan melengkung ke depan dan ke bawah.", learned: true, icon: "❤️" },
  { key: "ada-apa-dengan-dia", word: "Ada apa dengan dia?", category: "kalimat", clip: "tanya", description: "Arahkan tangan kanan dengan telapak menghadap ke atas, lalu gerakkan sedikit ke atas dan bawah dengan ekspresi bingung.", learned: false, icon: "❓" },
  
  { key: "makan", word: "Makan", category: "kata", clip: "makan", description: "Bentuk ujung-ujung jari tangan kanan menyatu lalu arahkan mendekati mulut berulang kali.", learned: false, icon: "🍽️" },
  { key: "minum", word: "Minum", category: "kata", clip: "minum", description: "Bentuk genggaman tangan kanan seperti memegang gelas, lalu gerakkan ibu jari mengarah ke mulut seolah menenggak cairan.", learned: false, icon: "🥤" },
  { key: "tolong", word: "Tolong", category: "kata", clip: "tolong", description: "Katupkan kedua telapak tangan di depan dada seakan memohon bantuan dengan santun.", learned: true, icon: "🙏" },
  { key: "terima-kasih", word: "Terima Kasih", category: "kata", clip: "terima-kasih", description: "Letakkan ujung jari di dekat dagu atau bibir bawah, kemudian gerakkan tangan melengkung ke depan dan bawah secara halus.", learned: false, icon: "💖" },
  { key: "halo", word: "Halo", category: "kata", clip: "halo", description: "Lambaikan telapak tangan kanan terbuka di depan dada atau pelipis melambangkan sapaan hangat.", learned: true, icon: "👋" },
  { key: "belajar", word: "Belajar", category: "kata", clip: "belajar", description: "Buka telapak tangan kiri mendatar di depan dada, lalu ketukkan ujung jari tangan kanan berulang kali di atas telapak tangan kiri.", learned: false, icon: "📖" },
  { key: "rumah", word: "Rumah", category: "kata", clip: "rumah", description: "Satukan ujung-ujung jari kedua tangan di atas membentuk atap segitiga menyiku.", learned: true, icon: "🏠" },
  { key: "sekolah", word: "Sekolah", category: "kata", clip: "sekolah", description: "Gambarkan atap rumah dengan tangan, kemudian ketukkan ujung jari kanan di telapak kiri melambangkan belajar.", learned: false, icon: "🏫" },
  { key: "buku", word: "Buku", category: "kata", clip: "buku", description: "Satukan kedua telapak tangan merapat, lalu buka perlahan seperti membuka lembaran buku.", learned: true, icon: "📚" },
  { key: "saya", word: "Saya", category: "kata", clip: "saya", description: "Ketuk dada tengah Anda perlahan menggunakan ibu jari atau telapak tangan kanan terbuka.", learned: false, icon: "🙋" },
  { key: "kamu", word: "Kamu", category: "kata", clip: "kamu", description: "Arahkan jari telunjuk tangan kanan menunjuk lurus ke depan ke arah lawan bicara.", learned: true, icon: "👉" },
  { key: "guru", word: "Guru", category: "kata", clip: "guru", description: "Sentuhkan ujung jari telunjuk dan jempol kanan di dekat kening kemudian gerakkan ke bawah membentuk gerakan mengajar.", learned: false, icon: "👩‍🏫" },
];

const avatarShop: Record<string, AvatarConfig> = {
  timi: {
    name: "Timi si Kucing",
    color: "#7C3AED",
    accent: "#FF4D9D",
    emoji: "🐱",
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="40" fill="#7C3AED"/><polygon points="20,20 40,40 20,50" fill="#6D28D9"/><polygon points="80,20 60,40 80,50" fill="#6D28D9"/><circle cx="50" cy="56" r="25" fill="#C084FC"/><circle cx="42" cy="52" r="4.5" fill="#111827"/><circle cx="58" cy="52" r="4.5" fill="#111827"/><polygon points="50,59 47,56 53,56" fill="#FF4D9D"/></svg>`
  },
  kiko: {
    name: "Kiko si Kelinci",
    color: "#22D3EE",
    accent: "#FF8A00",
    emoji: "🐰",
    starsNeeded: 50,
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="40" fill="#22D3EE"/><rect x="25" y="8" width="14" height="34" rx="7" fill="#0EA5E9"/><rect x="61" y="8" width="14" height="34" rx="7" fill="#0EA5E9"/><circle cx="50" cy="56" r="25" fill="#E0F7FA"/><circle cx="42" cy="52" r="4" fill="#111827"/><circle cx="58" cy="52" r="4" fill="#111827"/><polygon points="50,59 47,56 53,56" fill="#FF4D9D"/></svg>`
  },
  lulu: {
    name: "Lulu si Beruang",
    color: "#FF8A00",
    accent: "#FFD60A",
    emoji: "🐻",
    starsNeeded: 120,
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="28" cy="28" r="14" fill="#D97706"/><circle cx="72" cy="28" r="14" fill="#D97706"/><circle cx="50" cy="50" r="40" fill="#FF8A00"/><circle cx="50" cy="58" r="20" fill="#FFE082"/><circle cx="42" cy="48" r="4" fill="#111827"/><circle cx="58" cy="48" r="4" fill="#111827"/><ellipse cx="50" cy="54" rx="4" ry="2.5" fill="#111827"/></svg>`
  },
  koko_hat: {
    name: "Topi Wisuda Emas",
    color: "#F5F7FF",
    accent: "#FFD60A",
    emoji: "🎓",
    starsNeeded: 200,
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="40" fill="#334155"/><polygon points="50,15 88,32 50,48 12,32" fill="#1E293B"/><rect x="35" y="38" width="30" height="20" rx="3" fill="#0F172A"/><circle cx="40" cy="58" r="4" fill="#FFFFFF"/><circle cx="60" cy="58" r="4" fill="#FFFFFF"/><circle cx="40" cy="58" r="2" fill="#0F172A"/><circle cx="60" cy="58" r="2" fill="#0F172A"/></svg>`
  }
};

const quizRounds: QuizRound[] = [
  { word: "Terima Kasih", expectedKey: "terima-kasih" },
  { word: "Makan", expectedKey: "makan" },
  { word: "Belajar", expectedKey: "belajar" }
];

export default function App() {
  const [currentView, setCurrentView] = useState<string>('login'); // login, register, role, avatar, home, dictionary, camera-translator, voice-translator, quiz
  const [user, setUser] = useState<UserProfile>({
    username: "Anya",
    role: "student",
    nickname: "Anya",
    gender: "female",
    avatarId: "timi",
    stars: 38,
    progress: 38,
    quizCount: 1,
  });

  const [dictionary] = useState<DictionaryItem[]>(initialDictionary);
  const [unlockedAvatars, setUnlockedAvatars] = useState<string[]>(["timi"]);
  const [selectedGesture, setSelectedGesture] = useState<DictionaryItem>(initialDictionary[9]); // default Terima Kasih
  const [showConfetti, setShowConfetti] = useState(false);

  // Authentication Flow Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('role');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('role');
  };

  const handleRoleSelect = (role: string) => {
    setUser(prev => ({ ...prev, role }));
  };

  const proceedFromRole = () => {
    if (user.role === 'student') {
      setCurrentView('avatar');
    } else {
      setUser(prev => ({ ...prev, role: 'Guru' }));
      setCurrentView('home');
    }
  };

  const selectAvatar = (key: string) => {
    if (!unlockedAvatars.includes(key)) {
      const needed = avatarShop[key].starsNeeded || 0;
      alert(`Avatar terkunci! Butuh ${needed} bintang.`);
      return;
    }
    setUser(prev => ({ ...prev, avatarId: key }));
  };

  const proceedFromAvatar = () => {
    setCurrentView('home');
    triggerConfettiEffect();
  };

  const handleSelectGesture = (item: DictionaryItem) => {
    setSelectedGesture(item);
    setCurrentView('camera-translator');
  };

  const handleQuizComplete = (starsEarned: number) => {
    setUser(prev => {
      const newStars = prev.stars + starsEarned;
      const newQuizCount = Math.min(prev.quizCount + 1, 3);
      
      // Check avatar unlock achievements
      const unlocked = [...unlockedAvatars];
      Object.keys(avatarShop).forEach(key => {
        const cost = avatarShop[key].starsNeeded || 0;
        if (key !== 'timi' && newStars >= cost && !unlocked.includes(key)) {
          unlocked.push(key);
          alert(`🎉 Keren! Anda berhasil membuka kunci "${avatarShop[key].name}"!`);
        }
      });
      setUnlockedAvatars(unlocked);

      return {
        ...prev,
        stars: newStars,
        quizCount: newQuizCount
      };
    });
    alert(`Selamat! Anda mendapatkan total ${starsEarned} Bintang kuis.`);
    setCurrentView('home');
  };

  const triggerConfettiEffect = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Nav highlights helper
  const isNavActive = (view: string) => currentView === view;

  return (
    <div className="flex flex-col min-h-screen bg-bisara-bg font-nunito relative">
      
      {/* Dynamic full page canvas confetti simulation overlay */}
      {showConfetti && (
        <div className="fixed inset-0 bg-transparent z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
          {Array.from({ length: 80 }).map((_, i) => {
            const randomColor = ['#2563FF', '#22D3EE', '#FFD60A', '#FF8A00', '#FF4D9D', '#7C3AED'][i % 6];
            return (
              <div 
                key={i} 
                className="absolute w-3 h-3 bg-red-500 rounded-sm animate-bounce"
                style={{
                  backgroundColor: randomColor,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  opacity: Math.random()
                }}
              />
            );
          })}
        </div>
      )}

      {/* ==================== GLOBAL APP NAVBAR SHELL ==================== */}
      {['home', 'dictionary', 'camera-translator', 'voice-translator', 'quiz'].includes(currentView) && (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-[4%] sticky top-0 z-[100] shadow-sm">
          <div 
            onClick={() => setCurrentView('home')} 
            className="max-h-12 max-w-[150px] cursor-pointer flex items-center"
          >
            <img src="/Logo%20Sementara%20Kali.png" alt="Bisara Logo" className="h-10 w-auto object-contain" />
          </div>

          <nav className="flex gap-7 h-full">
            <button 
              onClick={() => setCurrentView('home')} 
              className={`flex items-center text-base font-bold h-full relative transition-colors ${
                isNavActive('home') ? 'text-bisara-accent-muted border-b-4 border-bisara-accent-muted' : 'text-bisara-navy hover:text-bisara-accent'
              }`}
            >
              Beranda
            </button>
            <button 
              onClick={() => setCurrentView('dictionary')} 
              className={`flex items-center text-base font-bold h-full relative transition-colors ${
                isNavActive('dictionary') || isNavActive('camera-translator') ? 'text-bisara-accent-muted border-b-4 border-bisara-accent-muted' : 'text-bisara-navy hover:text-bisara-accent'
              }`}
            >
              Kosakata
            </button>
            <button 
              onClick={() => setCurrentView('camera-translator')} 
              className={`flex items-center text-base font-bold h-full relative transition-colors ${
                isNavActive('camera-translator') ? 'text-bisara-accent-muted border-b-4 border-bisara-accent-muted' : 'text-bisara-navy hover:text-bisara-accent'
              }`}
            >
              Sign-to-Text
            </button>
            <button 
              onClick={() => setCurrentView('voice-translator')} 
              className={`flex items-center text-base font-bold h-full relative transition-colors ${
                isNavActive('voice-translator') ? 'text-bisara-accent-muted border-b-4 border-bisara-accent-muted' : 'text-bisara-navy hover:text-bisara-accent'
              }`}
            >
              Voice-to-Sign
            </button>
            <button 
              onClick={() => setCurrentView('quiz')} 
              className={`flex items-center text-base font-bold h-full relative transition-colors ${
                isNavActive('quiz') ? 'text-bisara-accent-muted border-b-4 border-bisara-accent-muted' : 'text-bisara-navy hover:text-bisara-accent'
              }`}
            >
              Tugas
            </button>
          </nav>

          <div className="flex items-center gap-6">
            {/* Server heartbeat badge */}
            <span className="bg-cyan-100 bg-opacity-40 text-[#0891B2] font-black px-3.5 py-1.5 rounded-full text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-bisara-cyan inline-block"></span>
              Server Latency: 12ms
            </span>

            <button className="relative w-11 h-11 rounded-full bg-bisara-bg flex items-center justify-center text-bisara-accent-muted transition-all hover:scale-105 active:scale-95">
              <Bell size={22} strokeWidth={2.5} />
              <span className="absolute top-2.5 right-3 w-2 h-2 rounded-full bg-bisara-pink" />
            </button>

            <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-md hover:bg-slate-100 transition-colors">
              <div className="text-right">
                <div className="text-sm font-extrabold text-bisara-navy leading-none">{user.nickname}</div>
                <div className="text-[11px] text-slate-400 font-bold mt-0.5">{user.username} ({user.role === 'student' ? 'Murid' : 'Guru'})</div>
              </div>
              <div 
                className="w-11 h-11 rounded-full bg-bisara-bg border border-slate-200 overflow-hidden flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: avatarShop[user.avatarId]?.svg }}
              />
            </div>
          </div>
        </header>
      )}

      {/* ==================== CORE SCREENS VIEWSTACK ROUTER ==================== */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 py-10 flex">
        
        {/* LOGIN SCREEN */}
        {currentView === 'login' && (
          <div className="flex w-full min-h-[calc(100vh-80px)] bg-bisara-bg">
            <div className="hidden md:flex md:w-[35%] bg-bisara-yellow relative overflow-hidden items-center justify-center rounded-r-[40%_70%] shadow-lg">
              <div className="text-center p-10 z-10">
                <div className="max-w-[250px] mx-auto mb-6">
                  <img src="/Logo%20Sementara%20Kali.png" alt="Bisara Logo" className="w-full h-auto object-contain" />
                </div>
                <p className="font-bold text-bisara-navy text-base">Cara seru belajar isyarat SIBI!</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center px-[5%] md:px-[10%]">
              <div className="max-w-[500px] w-full mx-auto bg-white p-8 rounded-lg shadow-md border border-slate-100">
                <h1 className="font-zain text-5xl font-black text-bisara-navy mb-2">Login</h1>
                <p className="text-slate-400 font-semibold text-sm mb-6">Masuk untuk memulai petualangan belajarmu!</p>

                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-extrabold text-bisara-navy mb-2">Username</label>
                    <input 
                      type="text" 
                      required 
                      defaultValue="Anya"
                      onChange={(e) => setUser(prev => ({ ...prev, nickname: e.target.value, username: e.target.value }))}
                      placeholder="Masukkan Username Disini" 
                      className="w-full px-5 py-4 border border-slate-200 rounded-md outline-none text-base font-nunito focus:border-bisara-accent focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-extrabold text-bisara-navy mb-2">Password</label>
                    <input 
                      type="password" 
                      required 
                      defaultValue="123456"
                      placeholder="Masukkan Password Disini" 
                      className="w-full px-5 py-4 border border-slate-200 rounded-md outline-none text-base font-nunito focus:border-bisara-accent focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  <div className="flex justify-between items-center text-sm font-bold mt-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-bisara-accent" />
                      Ingat Saya
                    </label>
                    <a href="#" className="text-bisara-accent font-extrabold hover:opacity-85">Lupa Password</a>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 mt-4 bg-bisara-accent hover:bg-opacity-95 text-white font-extrabold rounded-full shadow-[0_8px_25px_rgba(37,99,255,0.25)] hover:scale-102 active:scale-95 transition-transform"
                  >
                    Login
                  </button>
                </form>

                <div className="text-center text-sm font-semibold text-slate-400 mt-6">
                  Belum punya akun? <button onClick={() => setCurrentView('register')} className="text-bisara-accent font-extrabold hover:underline">Daftar Akun Baru</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REGISTER SCREEN */}
        {currentView === 'register' && (
          <div className="flex w-full min-h-[calc(100vh-80px)] bg-bisara-bg">
            <div className="hidden md:flex md:w-[35%] bg-bisara-yellow relative overflow-hidden items-center justify-center rounded-r-[40%_70%] shadow-lg">
              <div className="text-center p-10 z-10">
                <div className="max-w-[250px] mx-auto mb-6">
                  <img src="/Logo%20Sementara%20Kali.png" alt="Bisara Logo" className="w-full h-auto object-contain" />
                </div>
                <p className="font-bold text-bisara-navy text-base">Belajar SIBI dengan AI interaktif!</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center px-[5%] md:px-[10%]">
              <div className="max-w-[500px] w-full mx-auto bg-white p-8 rounded-lg shadow-md border border-slate-100">
                <h1 className="font-zain text-5xl font-black text-bisara-navy mb-2">Register</h1>
                <p className="text-slate-400 font-semibold text-sm mb-6">Yuk, buat akun kamu sekarang!</p>

                <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-extrabold text-bisara-navy mb-2">Email</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="Masukkan Email Disini" 
                      className="w-full px-5 py-4 border border-slate-200 rounded-md outline-none text-base font-nunito focus:border-bisara-accent focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-extrabold text-bisara-navy mb-2">Username</label>
                    <input 
                      type="text" 
                      required 
                      onChange={(e) => setUser(prev => ({ ...prev, nickname: e.target.value, username: e.target.value }))}
                      placeholder="Masukkan Username Disini" 
                      className="w-full px-5 py-4 border border-slate-200 rounded-md outline-none text-base font-nunito focus:border-bisara-accent focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-extrabold text-bisara-navy mb-2">Password</label>
                    <input 
                      type="password" 
                      required 
                      placeholder="Masukkan Password Disini" 
                      className="w-full px-5 py-4 border border-slate-200 rounded-md outline-none text-base font-nunito focus:border-bisara-accent focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-sm font-semibold mt-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" required className="w-4 h-4 rounded text-bisara-accent" />
                      Saya menyetujui Syarat dan Ketentuan
                    </label>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 mt-4 bg-bisara-accent hover:bg-opacity-95 text-white font-extrabold rounded-full shadow-[0_8px_25px_rgba(37,99,255,0.25)] hover:scale-102 active:scale-95 transition-transform"
                  >
                    Register
                  </button>
                </form>

                <div className="text-center text-sm font-semibold text-slate-400 mt-6">
                  Sudah punya akun? <button onClick={() => setCurrentView('login')} className="text-bisara-accent font-extrabold hover:underline">Login</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CHOOSE ROLE SCREEN */}
        {currentView === 'role' && (
          <div className="flex w-full min-h-[calc(100vh-80px)] bg-bisara-bg">
            <div className="hidden md:flex md:w-[35%] bg-bisara-yellow relative overflow-hidden items-center justify-center rounded-r-[40%_70%] shadow-lg">
              <div className="text-center p-10 z-10">
                <div className="max-w-[250px] mx-auto mb-6">
                  <img src="/Logo%20Sementara%20Kali.png" alt="Bisara Logo" className="w-full h-auto object-contain" />
                </div>
                <p className="font-bold text-bisara-navy text-base">Tentukan cara kamu bergabung!</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center px-[5%] md:px-[10%]">
              <div className="max-w-[550px] w-full mx-auto bg-white p-8 rounded-lg shadow-md border border-slate-100">
                <h1 className="font-zain text-5xl font-black text-bisara-navy mb-2">Pilih Role</h1>
                <p className="text-slate-400 font-semibold text-sm mb-6">Pilih bagaimana kamu ingin berinteraksi di BISARA</p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div 
                    onClick={() => handleRoleSelect('student')}
                    className={`border-2 rounded-lg p-6 text-center cursor-pointer relative overflow-hidden transition-all hover:scale-102 ${
                      user.role === 'student' ? 'border-bisara-accent bg-blue-50 bg-opacity-20 shadow-md' : 'border-slate-200'
                    }`}
                  >
                    {user.role === 'student' && <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-bisara-accent text-white flex items-center justify-center text-xs font-bold">✓</div>}
                    <div className="w-full h-32 bg-blue-50 text-bisara-accent rounded-md flex items-center justify-center mb-4">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                    </div>
                    <h3 className="font-zain text-2xl font-extrabold text-bisara-navy mb-1">Murid</h3>
                    <p className="text-[10px] text-slate-400 font-bold leading-normal">Belajar SIBI interaktif, selesaikan kuis, dan kumpulkan bintang!</p>
                  </div>

                  <div 
                    onClick={() => handleRoleSelect('teacher')}
                    className={`border-2 rounded-lg p-6 text-center cursor-pointer relative overflow-hidden transition-all hover:scale-102 ${
                      user.role === 'teacher' ? 'border-bisara-accent bg-blue-50 bg-opacity-20 shadow-md' : 'border-slate-200'
                    }`}
                  >
                    {user.role === 'teacher' && <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-bisara-accent text-white flex items-center justify-center text-xs font-bold">✓</div>}
                    <div className="w-full h-32 bg-violet-50 text-bisara-accent-muted rounded-md flex items-center justify-center mb-4">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    </div>
                    <h3 className="font-zain text-2xl font-extrabold text-bisara-navy mb-1">Guru</h3>
                    <p className="text-[10px] text-slate-400 font-bold leading-normal">Buat tugas kuis, pantau performa akurasi isyarat, dan atur materi.</p>
                  </div>
                </div>

                <button 
                  onClick={proceedFromRole}
                  className="w-full py-4 bg-bisara-accent hover:bg-opacity-95 text-white font-extrabold rounded-full shadow-[0_8px_25px_rgba(37,99,255,0.25)] hover:scale-102 active:scale-95 transition-transform"
                >
                  Lanjut
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CHOOSE AVATAR SCREEN */}
        {currentView === 'avatar' && (
          <div className="flex w-full min-h-[calc(100vh-80px)] bg-bisara-bg">
            <div className="hidden md:flex md:w-[35%] bg-bisara-yellow relative overflow-hidden items-center justify-center rounded-r-[40%_70%] shadow-lg">
              <div className="text-center p-10 z-10">
                <div className="max-w-[250px] mx-auto mb-6">
                  <img src="/Logo%20Sementara%20Kali.png" alt="Bisara Logo" className="w-full h-auto object-contain" />
                </div>
                <p className="font-bold text-bisara-navy text-base">Personalisasi karakter belajarmu!</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center px-[5%] md:px-[10%]">
              <div className="max-w-[500px] w-full mx-auto bg-white p-8 rounded-lg shadow-md border border-slate-100">
                <h1 className="font-zain text-5xl font-black text-bisara-navy mb-2">Pilih Avatar</h1>
                <p className="text-slate-400 font-semibold text-sm mb-6">Pilih tutor favoritmu untuk memandu gerakan SIBI</p>

                <div className="flex flex-col items-center gap-6 mb-6">
                  {/* Large selected character box */}
                  <div 
                    className="w-36 h-36 border-2 border-slate-200 rounded-lg flex items-center justify-center bg-white shadow-md overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: avatarShop[user.avatarId]?.svg }}
                  />

                  {/* Thumbnail Row */}
                  <div className="flex gap-4">
                    {Object.keys(avatarShop).map(key => {
                      if (key === 'koko_hat') return null; // cap is not picker
                      const av = avatarShop[key];
                      const isUnlocked = unlockedAvatars.includes(key);
                      return (
                        <div 
                          key={key}
                          onClick={() => selectAvatar(key)}
                          className={`w-16 h-16 border-2.5 rounded-md cursor-pointer flex items-center justify-center bg-white transition-all hover:scale-108 relative ${
                            user.avatarId === key ? 'border-bisara-accent shadow-sm scale-105' : 'border-slate-200'
                          } ${!isUnlocked ? 'opacity-50' : ''}`}
                        >
                          {!isUnlocked && <span className="absolute text-base">🔒</span>}
                          <div className="w-[80%] h-[80%]" dangerouslySetInnerHTML={{ __html: av.svg }} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-extrabold text-bisara-navy mb-2">Nama Panggilan</label>
                  <input 
                    type="text" 
                    value={user.nickname}
                    onChange={(e) => setUser(prev => ({ ...prev, nickname: e.target.value, username: e.target.value }))}
                    placeholder="Masukkan Nama Panggilan Kamu"
                    className="w-full px-5 py-4 border border-slate-200 rounded-md outline-none text-base focus:border-bisara-accent focus:ring-4 focus:ring-blue-100 transition-all font-nunito"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-extrabold text-bisara-navy mb-2">Gender</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setUser(prev => ({ ...prev, gender: 'female' }))}
                      className={`py-3.5 rounded-md border-2 font-extrabold text-base flex items-center justify-center gap-2 transition-all ${
                        user.gender === 'female' 
                          ? 'border-bisara-pink text-bisara-pink bg-pink-50 bg-opacity-20' 
                          : 'border-slate-200 text-slate-500'
                      }`}
                    >
                      ♀ Perempuan
                    </button>
                    <button 
                      onClick={() => setUser(prev => ({ ...prev, gender: 'male' }))}
                      className={`py-3.5 rounded-md border-2 font-extrabold text-base flex items-center justify-center gap-2 transition-all ${
                        user.gender === 'male' 
                          ? 'border-bisara-accent text-bisara-accent bg-blue-50 bg-opacity-20' 
                          : 'border-slate-200 text-slate-500'
                      }`}
                    >
                      ♂ Laki-laki
                    </button>
                  </div>
                </div>

                <button 
                  onClick={proceedFromAvatar}
                  className="w-full py-4 bg-bisara-accent hover:bg-opacity-95 text-white font-extrabold rounded-full shadow-[0_8px_25px_rgba(37,99,255,0.25)] hover:scale-102 active:scale-95 transition-transform"
                >
                  Lanjut
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HOME SCREEN */}
        {currentView === 'home' && (
          user.role === 'Guru' ? <TeacherDashboard /> : <Home user={user} onNavigate={setCurrentView} />
        )}

        {/* DICTIONARY SCREEN */}
        {currentView === 'dictionary' && (
          <Dictionary 
            dictionary={dictionary} 
            onNavigate={setCurrentView} 
            onSelectGesture={handleSelectGesture} 
          />
        )}

        {/* CAMERA TRANSLATOR SCREEN */}
        {currentView === 'camera-translator' && (
          <CameraTranslator 
            selectedGesture={selectedGesture} 
            onNavigate={setCurrentView} 
          />
        )}

        {/* VOICE TRANSLATOR SCREEN */}
        {currentView === 'voice-translator' && (
          <VoiceTranslator 
            avatarId={user.avatarId} 
            dictionary={dictionary} 
            onNavigate={setCurrentView} 
          />
        )}

        {/* QUIZ SCREEN */}
        {currentView === 'quiz' && (
          <Quiz 
            quizRounds={quizRounds}
            avatarShop={avatarShop}
            unlockedAvatars={unlockedAvatars}
            userStars={user.stars}
            onNavigate={setCurrentView}
            onQuizComplete={handleQuizComplete}
            triggerConfetti={triggerConfettiEffect}
          />
        )}

      </main>
    </div>
  );
}
