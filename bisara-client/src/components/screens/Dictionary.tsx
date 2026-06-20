import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Search, ArrowLeft } from 'lucide-react';
import type { DictionaryItem } from '../../types';

interface DictionaryProps {
  dictionary: DictionaryItem[];
  onNavigate: (viewId: string) => void;
  onSelectGesture: (item: DictionaryItem) => void;
}

export const Dictionary: React.FC<DictionaryProps> = ({ 
  dictionary, 
  onNavigate,
  onSelectGesture
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'learned' | 'unlearned'>('all');
 
  const filteredItems = dictionary.filter(item => {
    const matchesSearch = item.word.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesStatus = true;
    if (filterStatus === 'learned') matchesStatus = item.learned === true;
    if (filterStatus === 'unlearned') matchesStatus = item.learned === false;
    return matchesSearch && matchesStatus;
  });
 
  const words = filteredItems;
 
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
        Kosakata & Isyarat
      </h2>
 
      {/* Search Input Box */}
      <div className="relative mb-6">
        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400" size={24} strokeWidth={2.5} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari Kata SIBI..."
          className="w-full pl-16 pr-6 py-5 text-xl font-nunito text-bisara-navy bg-white border border-slate-200 rounded-lg shadow-sm outline-none focus:border-bisara-accent focus:shadow-md focus:ring-4 focus:ring-blue-100 transition-all"
        />
      </div>
 
      {/* Filters Row */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <div className="text-sm text-slate-400 font-extrabold font-nunito">
          Menampilkan {words.length} kosakata dasar SIBI
        </div>
 
        <div className="flex gap-3">
          <button 
            onClick={() => setFilterStatus(filterStatus === 'unlearned' ? 'all' : 'unlearned')}
            className={`px-6 py-2.5 rounded-full font-extrabold text-sm border-2 transition-transform hover:translate-y-[-2px] ${
              filterStatus === 'unlearned' 
                ? 'bg-bisara-accent-muted border-bisara-accent-muted text-white' 
                : 'bg-white border-bisara-accent-muted text-bisara-accent-muted'
            }`}
          >
            Belum Dipelajari
          </button>
          <button 
            onClick={() => setFilterStatus(filterStatus === 'learned' ? 'all' : 'learned')}
            className={`px-6 py-2.5 rounded-full font-extrabold text-sm border-2 transition-transform hover:translate-y-[-2px] ${
              filterStatus === 'learned' 
                ? 'bg-bisara-pink border-bisara-pink text-white' 
                : 'bg-white border-bisara-pink text-bisara-pink'
            }`}
          >
            Sudah Dipelajari
          </button>
        </div>
      </div>
 
      {/* Words Lists */}
      {words.length > 0 ? (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {words.map(item => (
              <Card 
                key={item.key} 
                onClick={() => onSelectGesture(item)}
                className="cursor-pointer flex flex-col items-center"
              >
                <div className={`w-[72px] h-[72px] rounded-full flex items-center justify-center text-3xl mb-[18px] ${item.learned ? 'bg-pink-100 text-bisara-pink' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.icon}
                </div>
                <div className="font-nunito text-xl font-extrabold text-bisara-navy mb-4">
                  {item.word}
                </div>
                <div className="flex gap-2 justify-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${item.learned ? 'bg-pink-100 text-bisara-pink' : 'bg-violet-100 text-bisara-accent-muted'}`}>
                    {item.learned ? 'Sudah' : 'Belum'} Dipelajari
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-orange-100 text-bisara-orange">
                    Kata
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 font-extrabold font-nunito">
          Tidak ada kosakata yang cocok dengan pencarian Anda.
        </div>
      )}
    </div>
  );
};
