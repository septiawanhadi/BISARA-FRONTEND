import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { 
  Users, 
  BookOpen, 
  UserCheck, 
  Plus, 
  Bell, 
  Sliders, 
  TrendingUp, 
  User, 
  Copy, 
  PlusCircle, 
  CheckCircle,
  Trash2,
  Lock,
  Mail,
  School
} from 'lucide-react';
import type { UserProfile } from '../../types';

interface TeacherDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  onUpdateProfile: (updatedFields: Partial<UserProfile>) => void;
}

interface Student {
  id: string;
  name: string;
  stars: number;
  accuracy: string;
  status: string;
  difficultGesture: string;
}

interface Classroom {
  id: string;
  name: string;
  code: string;
  count: number;
  students: Student[];
}

interface QuizAssignment {
  id: string;
  word: string;
  targetAccuracy: number;
  difficulty: string;
  assignedDate: string;
  status: 'Aktif' | 'Ditutup';
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  activeTab,
  setActiveTab,
  user,
  onUpdateProfile
}) => {
  // --- LMS STATE DATABASE ---
  const [classes, setClasses] = useState<Classroom[]>([
    { 
      id: 'c1', 
      name: 'Kelas Inklusi 3-A', 
      code: 'INK3A', 
      count: 3,
      students: [
        { id: '1', name: 'Anya Forger', stars: 138, accuracy: '87%', status: 'Belajar Kata Kerja', difficultGesture: 'Belajar (Deviasi siku)' },
        { id: '2', name: 'Budi Saputra', stars: 124, accuracy: '91%', status: 'Belajar Anggota Keluarga', difficultGesture: 'Tolong (Jarak tangan)' },
        { id: '3', name: 'Kiko Kelinci', stars: 195, accuracy: '95%', status: 'Lulus Semua Tugas', difficultGesture: 'Rumah (Kecepatan rilis)' }
      ]
    },
    { 
      id: 'c2', 
      name: 'Kelas Khusus SIBI', 
      code: 'SIBI1', 
      count: 2,
      students: [
        { id: '4', name: 'Lulu Beruang', stars: 85, accuracy: '82%', status: 'Belajar Angka', difficultGesture: 'Satu (Sudut jari)' },
        { id: '5', name: 'Roni Rubah', stars: 92, accuracy: '89%', status: 'Belajar Kata Sifat', difficultGesture: 'Makan (Tinggi lengan)' }
      ]
    }
  ]);

  const [assignedQuizzes, setAssignedQuizzes] = useState<QuizAssignment[]>([
    { id: 'q1', word: 'Terima Kasih', targetAccuracy: 85, difficulty: 'Adaptif AI', assignedDate: '30 Mei 2026', status: 'Aktif' },
    { id: 'q2', word: 'Makan', targetAccuracy: 80, difficulty: 'Sedang', assignedDate: '28 Mei 2026', status: 'Aktif' },
    { id: 'q3', word: 'Tolong', targetAccuracy: 75, difficulty: 'Mudah', assignedDate: '15 Mei 2026', status: 'Ditutup' }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Anya Forger baru saja mengumpulkan tugas "Kuis Terima Kasih" dengan akurasi 95%!', time: '5 menit yang lalu', unread: true },
    { id: 2, text: 'Siswa baru "Lulu Beruang" bergabung ke Kelas Khusus SIBI.', time: '2 jam yang lalu', unread: true },
    { id: 3, text: 'Server AI Inference mendeteksi lonjakan latensi singkat (12ms) - stabil.', time: '1 hari yang lalu', unread: false }
  ]);

  const [showToast, setShowToast] = useState<string | null>(null);

  // Form states for class creation
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('3');
  const [showAddClassForm, setShowAddClassForm] = useState(false);

  // Form states for quiz assignment
  const [quizWord, setQuizWord] = useState('Belajar');
  const [quizDifficulty, setQuizDifficulty] = useState('Adaptif AI');
  const [quizAccuracy, setQuizAccuracy] = useState(85);

  // Form states for teacher profile
  const [teacherName, setTeacherName] = useState(user.nickname || 'Anya');
  const [teacherNip, setTeacherNip] = useState('19920815 201803 2 003');
  const [teacherSchool, setTeacherSchool] = useState('Sekolah Inklusi Harapan');
  const [teacherEmail, setTeacherEmail] = useState('guru.anya@sekolahinklusi.sch.id');

  const triggerToast = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  // Class handler
  const handleAddClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    // Generate random 5 letter alphanumeric code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomCode = '';
    for (let i = 0; i < 5; i++) {
      randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const newClass: Classroom = {
      id: 'c' + (classes.length + 1),
      name: `${newClassName} (Grade ${newClassGrade})`,
      code: randomCode,
      count: 0,
      students: []
    };

    setClasses(prev => [...prev, newClass]);
    setNewClassName('');
    setShowAddClassForm(false);
    triggerToast(`🎉 Kelas "${newClass.name}" berhasil dibuat dengan Kode: ${randomCode}!`);
  };

  // Add mock student helper
  const handleAddMockStudent = (classId: string) => {
    const mockNames = ['Joni Setiawan', 'Siti Aminah', 'Rudi Tabuti', 'Asep Surasep'];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const randomStars = Math.floor(40 + Math.random() * 150);
    const randomAcc = Math.floor(75 + Math.random() * 20) + '%';

    const newStudent: Student = {
      id: 's' + Date.now(),
      name: randomName,
      stars: randomStars,
      accuracy: randomAcc,
      status: 'Belajar Kosakata Dasar',
      difficultGesture: 'Belajar (Posisi siku)'
    };

    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          count: c.count + 1,
          students: [...c.students, newStudent]
        };
      }
      return c;
    }));

    triggerToast(`👤 ${randomName} berhasil ditambahkan ke kelas!`);
  };

  // Quiz handler
  const handleAssignQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuiz: QuizAssignment = {
      id: 'q' + (assignedQuizzes.length + 1),
      word: quizWord,
      targetAccuracy: quizAccuracy,
      difficulty: quizDifficulty,
      assignedDate: 'Hari Ini',
      status: 'Aktif'
    };

    setAssignedQuizzes(prev => [newQuiz, ...prev]);
    triggerToast(`📝 Tugas kuis baru untuk kata "${quizWord}" telah didistribusikan!`);
  };

  const handleToggleQuizStatus = (id: string) => {
    setAssignedQuizzes(prev => prev.map(q => {
      if (q.id === id) {
        const nextStatus = q.status === 'Aktif' ? 'Ditutup' : 'Aktif';
        triggerToast(`Kuis "${q.word}" sekarang ${nextStatus}.`);
        return { ...q, status: nextStatus };
      }
      return q;
    }));
  };

  const handleDeleteQuiz = (id: string) => {
    setAssignedQuizzes(prev => prev.filter(q => q.id !== id));
    triggerToast('Tugas kuis berhasil dihapus.');
  };

  // Profile save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      nickname: teacherName,
      username: teacherName.toLowerCase().replace(/\s/g, '')
    });
    triggerToast('💾 Pengaturan profil berhasil disimpan!');
  };

  // Copy code to clipboard helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(`📋 Kode "${text}" disalin ke papan klip.`);
  };

  // Mark notifications as read
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    triggerToast('Semua notifikasi ditandai dibaca.');
  };

  // Calculate statistics
  const totalClasses = classes.length;
  const totalStudents = classes.reduce((acc, c) => acc + c.students.length + c.count, 0);
  const activeQuizCount = assignedQuizzes.filter(q => q.status === 'Aktif').length;

  return (
    <div className="w-full relative">
      {/* Toast Alert popup */}
      {showToast && (
        <div className="fixed top-24 right-6 bg-slate-900 border border-emerald-500 text-white font-extrabold px-6 py-4 rounded-lg shadow-xl z-[999] flex items-center gap-3 animate-bounce">
          <CheckCircle className="text-emerald-400" size={20} />
          <span className="font-nunito">{showToast}</span>
        </div>
      )}

      {/* ==================== 1. TAB: DASBOR UTAMA ==================== */}
      {activeTab === 'dasbor' && (
        <div className="w-full">
          <div className="mb-8">
            <h2 className="font-zain text-5xl font-extrabold text-bisara-navy">
              Selamat Datang, Guru Inspiratif!
            </h2>
            <p className="text-lg text-slate-500 font-semibold mt-0.5">
              Portal Asesmen SIBI & Sistem Informasi Manajemen Kelas Inklusi Anda.
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="flex items-center gap-5 p-6 border-b-4 border-bisara-accent hover:translate-y-[-2px] transition-transform duration-300" hoverEffect={false}>
              <div className="w-14 h-14 bg-violet-100 text-bisara-purple-accent rounded-md flex items-center justify-center">
                <Users size={28} />
              </div>
              <div>
                <div className="text-3xl font-zain font-extrabold text-bisara-navy">{totalClasses} Kelas Aktif</div>
                <div className="text-xs text-slate-400 font-extrabold">Kode Akses Terbuka</div>
              </div>
            </Card>

            <Card className="flex items-center gap-5 p-6 border-b-4 border-bisara-pink hover:translate-y-[-2px] transition-transform duration-300" hoverEffect={false}>
              <div className="w-14 h-14 bg-pink-100 text-bisara-pink rounded-md flex items-center justify-center">
                <Users size={28} />
              </div>
              <div>
                <div className="text-3xl font-zain font-extrabold text-bisara-navy">{totalStudents} Murid</div>
                <div className="text-xs text-slate-400 font-extrabold">Aktif Belajar SIBI</div>
              </div>
            </Card>

            <Card className="flex items-center gap-5 p-6 border-b-4 border-bisara-orange hover:translate-y-[-2px] transition-transform duration-300" hoverEffect={false}>
              <div className="w-14 h-14 bg-amber-100 text-bisara-orange rounded-md flex items-center justify-center">
                <UserCheck size={28} />
              </div>
              <div>
                <div className="text-3xl font-zain font-extrabold text-bisara-navy">91% Akurasi Rata-rata</div>
                <div className="text-xs text-slate-400 font-extrabold">Inference Server Stabil</div>
              </div>
            </Card>

            <Card className="flex items-center gap-5 p-6 border-b-4 border-bisara-accent hover:translate-y-[-2px] transition-transform duration-300" hoverEffect={false}>
              <div className="w-14 h-14 bg-blue-100 text-bisara-accent rounded-md flex items-center justify-center">
                <BookOpen size={28} />
              </div>
              <div>
                <div className="text-3xl font-zain font-extrabold text-bisara-navy">{activeQuizCount} Kuis Aktif</div>
                <div className="text-xs text-slate-400 font-extrabold">Pembelajaran Adaptif</div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-8">
            {/* Recent student results */}
            <div className="flex flex-col gap-6">
              <Card hoverEffect={false} className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-zain text-3xl font-extrabold text-bisara-navy">
                    Aktivitas Uji Coba Kuis Siswa Terbaru
                  </h3>
                  <button 
                    onClick={() => setActiveTab('progress')}
                    className="text-bisara-accent font-extrabold text-sm hover:underline"
                  >
                    Selengkapnya
                  </button>
                </div>

                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-extrabold text-slate-400">
                        <th className="pb-3">NAMA SISWA</th>
                        <th className="pb-3">KATA Challenge</th>
                        <th className="pb-3 text-center">AKURASI SIBI</th>
                        <th className="pb-3 text-right">HASIL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {classes[0].students.map(student => (
                        <tr key={student.id} className="text-sm font-semibold text-bisara-navy">
                          <td className="py-4 font-bold flex items-center gap-2">
                            <span className="text-base">👦</span>
                            {student.name}
                          </td>
                          <td className="py-4 text-slate-500 font-extrabold">"{student.name === 'Anya Forger' ? 'Terima Kasih' : student.name === 'Budi Saputra' ? 'Tolong' : 'Rumah'}"</td>
                          <td className="py-4 text-center">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 font-black rounded-full text-xs">
                              {student.accuracy}
                            </span>
                          </td>
                          <td className="py-4 text-right text-amber-500 font-bold">🌟 {student.stars > 130 ? '3 Bintang' : '2 Bintang'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Quick action grid shortcut */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setActiveTab('kelas')}
                  className="bg-white border border-slate-200 text-bisara-navy rounded-lg p-6 flex flex-col items-start text-left shadow-sm hover:border-bisara-accent hover:shadow-md transition-all group"
                >
                  <PlusCircle size={32} className="text-bisara-accent mb-3 group-hover:scale-110 transition-transform" />
                  <span className="font-zain text-2xl font-extrabold">Buat Kelas Baru</span>
                  <span className="text-xs text-slate-400 font-bold mt-1">Dapatkan kode akses instan untuk siswa inklusi.</span>
                </button>

                <button 
                  onClick={() => setActiveTab('quiz-manager')}
                  className="bg-white border border-slate-200 text-bisara-navy rounded-lg p-6 flex flex-col items-start text-left shadow-sm hover:border-bisara-orange hover:shadow-md transition-all group"
                >
                  <Sliders size={32} className="text-bisara-orange mb-3 group-hover:scale-110 transition-transform" />
                  <span className="font-zain text-2xl font-extrabold">Tugaskan Kuis AI</span>
                  <span className="text-xs text-slate-400 font-bold mt-1">Pilih tingkat akurasi target dan materi kosakata.</span>
                </button>
              </div>
            </div>

            {/* Notification and Heartbeat Panel */}
            <div className="flex flex-col gap-6">
              <Card hoverEffect={false} className="p-8">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-zain text-3xl font-extrabold text-bisara-navy flex items-center gap-2">
                    <Bell size={22} className="text-bisara-pink" />
                    Pemberitahuan LMS
                  </h3>
                  <button 
                    onClick={markAllNotificationsRead}
                    className="text-xs text-slate-400 font-bold hover:text-bisara-accent"
                  >
                    Tandai Dibaca
                  </button>
                </div>

                <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-4 border rounded-md flex flex-col gap-1 transition-colors ${
                        n.unread ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold text-bisara-navy leading-normal">{n.text}</div>
                      <div className="text-[10px] text-slate-400 font-extrabold self-end">{n.time}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Server metrics status box */}
              <div className="bg-[#1E293B] text-white rounded-lg p-6 shadow-md border border-slate-700 relative overflow-hidden">
                <div className="absolute right-[-20px] bottom-[-20px] w-24 h-24 bg-bisara-cyan opacity-10 rounded-full"></div>
                <h4 className="text-xs font-extrabold text-bisara-cyan tracking-wider uppercase mb-2">INTELLIGENCE HEARTBEAT</h4>
                <div className="text-2xl font-extrabold font-zain mb-1">FastAPI Inference Server</div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mt-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                  <span>ONLINE | API Latency: 12ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 2. TAB: MANAJEMEN KELAS ==================== */}
      {activeTab === 'kelas' && (
        <div className="w-full">
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="font-zain text-5xl font-extrabold text-bisara-navy">
                Manajemen Kelas SIBI
              </h2>
              <p className="text-lg text-slate-500 font-semibold mt-0.5">
                Kelola pendaftaran siswa, cetak kode akses, dan tambahkan rombongan belajar.
              </p>
            </div>

            <button 
              onClick={() => setShowAddClassForm(!showAddClassForm)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-bisara-accent text-white font-extrabold text-sm shadow-md hover:scale-105 active:scale-95 transition-transform"
            >
              <Plus size={16} strokeWidth={3} />
              {showAddClassForm ? 'Batal' : 'Buat Kelas Baru'}
            </button>
          </div>

          {/* Add class inline form */}
          {showAddClassForm && (
            <Card hoverEffect={false} className="p-6 mb-8 border border-bisara-accent bg-blue-50 bg-opacity-20 animate-fadeIn">
              <h3 className="font-zain text-3xl font-extrabold text-bisara-navy mb-4">Informasi Kelas Baru</h3>
              <form onSubmit={handleAddClassSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div>
                  <label className="block text-xs font-extrabold text-bisara-navy mb-2">NAMA KELAS</label>
                  <input 
                    type="text" 
                    required 
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Contoh: Kelas Inklusi B" 
                    className="w-full px-4 py-3 border border-slate-200 rounded-md outline-none text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-bisara-navy mb-2">TINGKAT / TAHUN</label>
                  <select 
                    value={newClassGrade}
                    onChange={(e) => setNewClassGrade(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-md outline-none text-sm font-semibold bg-white"
                  >
                    <option value="1">Kelas 1 (Sekolah Dasar)</option>
                    <option value="2">Kelas 2 (Sekolah Dasar)</option>
                    <option value="3">Kelas 3 (Sekolah Dasar)</option>
                    <option value="4">Kelas 4 (Sekolah Dasar)</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="px-6 py-3.5 bg-bisara-accent text-white font-extrabold rounded-md shadow-md hover:bg-opacity-95 text-sm"
                >
                  Simpan & Buat Kode Akses
                </button>
              </form>
            </Card>
          )}

          {/* Class grid list */}
          <div className="flex flex-col gap-8">
            {classes.map(classroom => (
              <Card key={classroom.id} hoverEffect={false} className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-5 mb-6 gap-4">
                  <div>
                    <h3 className="font-zain text-3xl font-extrabold text-bisara-navy">{classroom.name}</h3>
                    <div className="text-xs text-slate-400 font-extrabold mt-1">Total {classroom.students.length} Siswa Terdaftar</div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Enrollment code badge */}
                    <div className="bg-slate-50 border border-slate-200 rounded-md p-3 flex items-center gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold block">KODE KELAS</span>
                        <span className="font-mono font-bold text-bisara-navy tracking-wider text-base">{classroom.code}</span>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(classroom.code)}
                        className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-500 transition-colors"
                        title="Salin Kode"
                      >
                        <Copy size={16} />
                      </button>
                    </div>

                    <button 
                      onClick={() => handleAddMockStudent(classroom.id)}
                      className="px-4 py-3 rounded-md border-2 border-bisara-accent text-bisara-accent font-extrabold hover:bg-blue-50 text-xs transition-colors"
                    >
                      + Tambah Murid
                    </button>
                  </div>
                </div>

                {/* Student list in this class */}
                {classroom.students.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 font-bold text-sm">
                    Belum ada murid di kelas ini. Klik tombol "+ Tambah Murid" untuk mensimulasikan gabungnya siswa baru!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {classroom.students.map(student => (
                      <div key={student.id} className="border border-slate-200 rounded-lg p-5 flex flex-col justify-between bg-[#FFFDF5]">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <span className="w-10 h-10 rounded-full bg-blue-100 text-base flex items-center justify-center">👦</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 font-extrabold px-2.5 py-1 rounded-full">{student.accuracy} Acc</span>
                          </div>
                          <h4 className="font-extrabold text-bisara-navy text-base leading-tight mb-1">{student.name}</h4>
                          <span className="text-[11px] font-bold text-slate-400 block">{student.status}</span>
                        </div>
                        
                        <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-4">
                          <span className="text-xs text-bisara-orange font-bold">🌟 {student.stars} Bintang</span>
                          <span className="text-[10px] bg-amber-50 text-bisara-orange font-extrabold px-2 py-0.5 rounded">SIBI Aktif</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ==================== 3. TAB: PEMANTAUAN PROGRESS ==================== */}
      {activeTab === 'progress' && (
        <div className="w-full">
          <div className="mb-8">
            <h2 className="font-zain text-5xl font-extrabold text-bisara-navy">
              Pemantauan Kuantitatif & Progress Tracker
            </h2>
            <p className="text-lg text-slate-500 font-semibold mt-0.5">
              Analisis akurasi pergerakan sendi motorik siswa SIBI terintegrasi AI Cloud Server.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-8">
            {/* Student Accuracy Table */}
            <div className="flex flex-col gap-6">
              <Card hoverEffect={false} className="p-8">
                <h3 className="font-zain text-3xl font-extrabold text-bisara-navy mb-5">Daftar Akurasi Siswa</h3>
                
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-extrabold text-slate-400">
                        <th className="pb-3">NAMA</th>
                        <th className="pb-3 text-center">BINTANG TUGAS</th>
                        <th className="pb-3 text-center">RATA-RATA AKURASI</th>
                        <th className="pb-3 text-right">STATUS MOTORIK</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {classes.flatMap(c => c.students).map(s => {
                        const accVal = parseInt(s.accuracy);
                        let statusColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
                        let statusText = 'Sangat Baik';

                        if (accVal < 85) {
                          statusColor = 'text-rose-600 bg-rose-50 border-rose-200';
                          statusText = 'Perlu Bimbingan';
                        } else if (accVal < 90) {
                          statusColor = 'text-amber-600 bg-amber-50 border-amber-200';
                          statusText = 'Cukup Baik';
                        }

                        return (
                          <tr key={s.id} className="text-sm font-semibold text-bisara-navy">
                            <td className="py-4 font-bold">{s.name}</td>
                            <td className="py-4 text-center text-bisara-orange font-extrabold">🌟 {s.stars}</td>
                            <td className="py-4 text-center">
                              <span className="font-black text-bisara-accent text-base">{s.accuracy}</span>
                            </td>
                            <td className="py-4 text-right">
                              <span className={`px-3 py-1 rounded-full text-xs font-black border ${statusColor}`}>
                                {statusText}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Progress Weekly Mock SVG Line Chart */}
              <Card hoverEffect={false} className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-zain text-3xl font-extrabold text-bisara-navy">
                    Tren Akurasi Kelas Mingguan
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <span className="w-3 h-3 bg-bisara-accent rounded-full inline-block"></span>
                    <span>Rata-rata Akurasi</span>
                  </div>
                </div>

                {/* SVG Graph */}
                <div className="w-full h-[220px] bg-slate-50 border border-slate-100 rounded-lg p-4 relative">
                  <svg viewBox="0 0 500 150" className="w-full h-[85%] overflow-visible">
                    {/* Grid lines */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="0" y1="75" x2="500" y2="75" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="5,5" />
                    
                    {/* Line path */}
                    <path 
                      d="M 50 110 L 150 90 L 250 55 L 350 42 L 450 35" 
                      fill="none" 
                      stroke="var(--primary-blue)" 
                      strokeWidth="4" 
                      strokeLinecap="round"
                    />

                    {/* Chart points */}
                    <circle cx="50" cy="110" r="6" fill="#2563FF" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="150" cy="90" r="6" fill="#2563FF" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="250" cy="55" r="6" fill="#2563FF" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="350" cy="42" r="6" fill="#2563FF" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="450" cy="35" r="6" fill="#2563FF" stroke="#FFFFFF" strokeWidth="2" />

                    {/* Labels under points */}
                    <text x="50" y="140" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle">Senin (75%)</text>
                    <text x="150" y="140" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle">Selasa (80%)</text>
                    <text x="250" y="140" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle">Rabu (87%)</text>
                    <text x="350" y="140" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle">Kamis (91%)</text>
                    <text x="450" y="140" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle">Jumat (93%)</text>
                  </svg>
                </div>
              </Card>
            </div>

            {/* Analysis and report box */}
            <div className="flex flex-col gap-6">
              <Card hoverEffect={false} className="p-8 border border-bisara-orange bg-[#FFFDF5]">
                <h3 className="font-zain text-3xl font-extrabold text-bisara-navy mb-4 flex items-center gap-2">
                  <TrendingUp size={24} className="text-bisara-orange" />
                  Deviasi Isyarat Tersulit
                </h3>
                <p className="text-xs font-semibold text-slate-500 mb-6">
                  Berdasarkan dataset asinkron yang diproses kecerdasan AI, berikut adalah gerakan sendi motorik tersulit bagi kelas Anda minggu ini:
                </p>

                <div className="flex flex-col gap-5">
                  {classes[0].students.map(student => (
                    <div key={student.id} className="border-b border-amber-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-extrabold text-bisara-navy">{student.name}</span>
                        <span className="text-[10px] bg-red-100 text-red-600 font-extrabold px-2 py-0.5 rounded">
                          Deviasi Tinggi
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-bold">
                        Masalah: <span className="text-bisara-orange font-extrabold">"{student.difficultGesture}"</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-amber-50 rounded-md border border-amber-200">
                  <h4 className="text-xs font-extrabold text-bisara-orange uppercase tracking-wider mb-2">SOLUSI INTERVENSI GURU</h4>
                  <p className="text-[11px] font-semibold text-slate-600 leading-normal">
                    Minta siswa memosisikan jarak webcam minimal 1 meter dari dada, dan latih kelengkungan sendi lengan secara konstan pada kata **"Belajar"** serta **"Tolong"** agar model AI tidak mengabaikan landmark.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 4. TAB: QUIZ MANAGER ==================== */}
      {activeTab === 'quiz-manager' && (
        <div className="w-full">
          <div className="mb-8">
            <h2 className="font-zain text-5xl font-extrabold text-bisara-navy">
              Quiz Manager (Penugasan Kuis Adaptif)
            </h2>
            <p className="text-lg text-slate-500 font-semibold mt-0.5">
              Buat tugas kuis berbasis AI, sesuaikan ambang akurasi lulus, dan pantau pengiriman siswa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-8">
            {/* Active Quizzes List */}
            <Card hoverEffect={false} className="p-8">
              <h3 className="font-zain text-3xl font-extrabold text-bisara-navy mb-5">Daftar Penugasan Kuis Aktif</h3>
              
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-extrabold text-slate-400">
                      <th className="pb-3">KATA KUNCI</th>
                      <th className="pb-3 text-center">TINGKAT LEVEL</th>
                      <th className="pb-3 text-center">TARGET LULUS</th>
                      <th className="pb-3 text-center">STATUS</th>
                      <th className="pb-3 text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assignedQuizzes.map(quiz => (
                      <tr key={quiz.id} className="text-sm font-semibold text-bisara-navy">
                        <td className="py-4 font-bold flex items-center gap-1.5">
                          <span className="text-base">📝</span>
                          "{quiz.word}"
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            quiz.difficulty === 'Adaptif AI' 
                              ? 'bg-purple-100 text-bisara-purple-accent border border-purple-200' 
                              : quiz.difficulty === 'Sedang' 
                                ? 'bg-amber-100 text-bisara-orange' 
                                : 'bg-blue-100 text-bisara-accent'
                          }`}>
                            {quiz.difficulty}
                          </span>
                        </td>
                        <td className="py-4 text-center font-extrabold text-slate-500">{quiz.targetAccuracy}% Acc</td>
                        <td className="py-4 text-center">
                          <span className={`w-2.5 h-2.5 rounded-full inline-block ${
                            quiz.status === 'Aktif' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                          }`} title={quiz.status}></span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => handleToggleQuizStatus(quiz.id)}
                              className="text-xs text-bisara-accent hover:underline font-extrabold"
                            >
                              {quiz.status === 'Aktif' ? 'Tutup' : 'Buka'}
                            </button>
                            <button 
                              onClick={() => handleDeleteQuiz(quiz.id)}
                              className="text-xs text-bisara-pink hover:text-red-700 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Quiz Assignment Panel */}
            <Card hoverEffect={false} className="p-8 border border-bisara-accent">
              <h3 className="font-zain text-3xl font-extrabold text-bisara-navy mb-4 flex items-center gap-2">
                <Sliders size={24} className="text-bisara-accent" />
                Buat Tugas Baru
              </h3>
              
              <form onSubmit={handleAssignQuizSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-extrabold text-bisara-navy mb-2">PILIH KOSAKATA TARGET</label>
                  <select 
                    value={quizWord}
                    onChange={(e) => setQuizWord(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-md outline-none text-sm font-semibold bg-white"
                  >
                    <option value="Belajar">Belajar</option>
                    <option value="Terima Kasih">Terima Kasih</option>
                    <option value="Makan">Makan</option>
                    <option value="Minum">Minum</option>
                    <option value="Tolong">Tolong</option>
                    <option value="Rumah">Rumah</option>
                    <option value="Sekolah">Sekolah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-bisara-navy mb-2">TINGKAT KESULITAN (AI MODE)</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Mudah', 'Sedang', 'Sulit', 'Adaptif AI'].map(diff => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setQuizDifficulty(diff)}
                        className={`py-2 px-3 border rounded text-xs font-extrabold transition-colors ${
                          quizDifficulty === diff 
                            ? 'bg-bisara-accent text-white border-bisara-accent shadow' 
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-extrabold text-bisara-navy">TARGET AKURASI LULUS</label>
                    <span className="text-xs font-black text-bisara-accent">{quizAccuracy}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="65" 
                    max="95" 
                    value={quizAccuracy}
                    onChange={(e) => setQuizAccuracy(parseInt(e.target.value))}
                    className="w-full accent-bisara-accent cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-extrabold mt-1">
                    <span>65% (Kasar)</span>
                    <span>95% (Sempurna)</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 mt-2 bg-bisara-accent hover:bg-opacity-95 text-white font-extrabold rounded-full shadow-[0_8px_25px_rgba(124,58,237,0.25)] text-sm"
                >
                  Tugaskan Sekarang
                </button>
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* ==================== 5. TAB: PENGATURAN PROFIL ==================== */}
      {activeTab === 'profil' && (
        <div className="w-full">
          <div className="mb-8">
            <h2 className="font-zain text-5xl font-extrabold text-bisara-navy">
              Pengaturan Profil Guru & Lembaga
            </h2>
            <p className="text-lg text-slate-500 font-semibold mt-0.5">
              Kelola informasi kredensial mengajar Anda serta konfigurasi instansi sekolah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
            {/* Avatar picker card */}
            <div className="flex flex-col gap-6">
              <Card hoverEffect={false} className="p-6 text-center flex flex-col items-center">
                {/* Large teacher avatar preview emoji */}
                <div className="w-28 h-28 rounded-full bg-violet-100 border-4 border-white shadow-md flex items-center justify-center text-5xl mb-4">
                  👩‍🏫
                </div>
                
                <h3 className="font-extrabold text-bisara-navy text-lg leading-tight mb-1">{teacherName}</h3>
                <span className="text-[10px] bg-violet-100 text-bisara-purple-accent font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  GURU INKLUSI
                </span>

                <div className="w-full border-t border-slate-100 my-4 pt-4 text-left text-xs font-semibold text-slate-400 flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span>ID Portal:</span>
                    <span className="font-bold text-bisara-navy">ANYA-GURU</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Instansi:</span>
                    <span className="font-bold text-bisara-navy text-right">Sekolah Harapan</span>
                  </div>
                </div>
              </Card>

              {/* Security info card */}
              <div className="bg-slate-950 text-white rounded-lg p-6 shadow-sm border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-bisara-pink uppercase tracking-wider">
                  <Lock size={14} />
                  Kredensial Akun
                </div>
                <p className="text-[10px] text-slate-400 font-bold leading-normal">
                  Akun Anda terhubung dengan Google LDAP Instansi Pendidikan. Perubahan kata sandi harus divalidasi oleh IT Administrator Sekolah.
                </p>
              </div>
            </div>

            {/* Profile fields form */}
            <Card hoverEffect={false} className="p-8">
              <h3 className="font-zain text-3xl font-extrabold text-bisara-navy mb-6">Sunting Informasi Profil</h3>

              <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-extrabold text-bisara-navy mb-2 flex items-center gap-1.5">
                      <User size={14} />
                      NAMA LENGKAP & GELAR
                    </label>
                    <input 
                      type="text" 
                      required 
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      placeholder="Masukkan nama lengkap disini"
                      className="w-full px-4 py-3 border border-slate-200 rounded-md outline-none text-sm font-semibold focus:border-bisara-accent transition-all font-nunito"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-bisara-navy mb-2 flex items-center gap-1.5">
                      <School size={14} />
                      NIP / NOMOR INDUK PEGAWAI
                    </label>
                    <input 
                      type="text" 
                      required 
                      value={teacherNip}
                      onChange={(e) => setTeacherNip(e.target.value)}
                      placeholder="Masukkan nomor induk disini"
                      className="w-full px-4 py-3 border border-slate-200 rounded-md outline-none text-sm font-semibold focus:border-bisara-accent transition-all font-nunito"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-extrabold text-bisara-navy mb-2 flex items-center gap-1.5">
                      <School size={14} />
                      NAMA INSTANSI SEKOLAH
                    </label>
                    <input 
                      type="text" 
                      required 
                      value={teacherSchool}
                      onChange={(e) => setTeacherSchool(e.target.value)}
                      placeholder="Masukkan nama sekolah disini"
                      className="w-full px-4 py-3 border border-slate-200 rounded-md outline-none text-sm font-semibold focus:border-bisara-accent transition-all font-nunito"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-bisara-navy mb-2 flex items-center gap-1.5">
                      <Mail size={14} />
                      ALAMAT EMAIL RESMI
                    </label>
                    <input 
                      type="email" 
                      required 
                      value={teacherEmail}
                      onChange={(e) => setTeacherEmail(e.target.value)}
                      placeholder="Contoh: official@sekolah.sch.id"
                      className="w-full px-4 py-3 border border-slate-200 rounded-md outline-none text-sm font-semibold focus:border-bisara-accent transition-all font-nunito"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6 mt-2 flex justify-end">
                  <button 
                    type="submit"
                    className="px-8 py-3.5 bg-bisara-accent text-white font-extrabold rounded-md shadow-md hover:bg-opacity-95 text-sm transition-colors"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
