import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Users, BookOpen, UserCheck, Plus } from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const [students] = useState([
    { id: '1', name: 'Anya Forger', stars: 38, accuracy: '87%', status: 'Belajar Kata Santun' },
    { id: '2', name: 'Budi Saputra', stars: 124, accuracy: '91%', status: 'Belajar Anggota Keluarga' },
    { id: '3', name: 'Kiko Kelinci', stars: 210, accuracy: '95%', status: 'Lulus Semua Tugas' }
  ]);

  const [classes] = useState([
    { id: 'c1', name: 'Kelas Inklusi 3-A', code: 'INK3A', count: 3 },
    { id: 'c2', name: 'Kelas Khusus SIBI', code: 'SIBI1', count: 12 }
  ]);

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="font-zain text-5xl font-extrabold text-bisara-navy">
            Dashboard Guru (LMS Portal)
          </h2>
          <p className="text-lg text-slate-500 font-semibold">
            Kelola pembelajaran inklusif dan tugas kuis siswa Anda.
          </p>
        </div>
        
        <button 
          onClick={() => alert('Fitur tambah kelas belum diaktifkan.')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-bisara-accent text-white font-extrabold text-sm shadow-md hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus size={16} strokeWidth={3} />
          Buat Kelas Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="flex items-center gap-5 p-6" hoverEffect={false}>
          <div className="w-14 h-14 bg-blue-100 text-bisara-accent rounded-md flex items-center justify-center">
            <Users size={28} />
          </div>
          <div>
            <div className="text-3xl font-zain font-extrabold text-bisara-navy">2 Kelas Active</div>
            <div className="text-xs text-slate-400 font-bold">Total 15 Siswa Terdaftar</div>
          </div>
        </Card>

        <Card className="flex items-center gap-5 p-6" hoverEffect={false}>
          <div className="w-14 h-14 bg-pink-100 text-bisara-pink rounded-md flex items-center justify-center">
            <BookOpen size={28} />
          </div>
          <div>
            <div className="text-3xl font-zain font-extrabold text-bisara-navy">3 Tugas Aktif</div>
            <div className="text-xs text-slate-400 font-bold">Kamus SIBI Terintegrasi</div>
          </div>
        </Card>

        <Card className="flex items-center gap-5 p-6" hoverEffect={false}>
          <div className="w-14 h-14 bg-amber-100 text-bisara-orange rounded-md flex items-center justify-center">
            <UserCheck size={28} />
          </div>
          <div>
            <div className="text-3xl font-zain font-extrabold text-bisara-navy">Rata-rata Akurasi 91%</div>
            <div className="text-xs text-slate-400 font-bold">Inference Server Cloud Aktif</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
        {/* Student Checklist Monitoring */}
        <Card hoverEffect={false}>
          <h3 className="font-zain text-3xl font-extrabold text-bisara-navy mb-5">
            Daftar Progress Siswa
          </h3>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-extrabold text-slate-400">
                  <th className="pb-3">NAMA SISWA</th>
                  <th className="pb-3">TOTAL BINTANG</th>
                  <th className="pb-3">AKURASI SIBI</th>
                  <th className="pb-3 text-right">STATUS TUGAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map(s => (
                  <tr key={s.id} className="text-sm font-semibold text-bisara-navy">
                    <td className="py-4 font-bold">{s.name}</td>
                    <td className="py-4 text-bisara-orange">🌟 {s.stars} Stars</td>
                    <td className="py-4 text-bisara-accent font-extrabold">{s.accuracy}</td>
                    <td className="py-4 text-right text-slate-500">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Classes List */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-100 rounded-lg p-8 shadow-sm">
            <h3 className="font-zain text-3xl font-extrabold text-bisara-navy mb-5">Daftar Kelas</h3>
            
            <div className="flex flex-col gap-4">
              {classes.map(c => (
                <div key={c.id} className="border border-slate-200 rounded-md p-4 flex justify-between items-center">
                  <div>
                    <div className="font-extrabold text-bisara-navy">{c.name}</div>
                    <div className="text-xs text-slate-400 font-bold mt-1">KODE: {c.code}</div>
                  </div>
                  <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500">
                    {c.count} Murid
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
