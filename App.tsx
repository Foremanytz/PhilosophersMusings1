
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { PHILOSOPHERS } from './constants';
import { Philosopher, DialogueMessage } from './types';
import PhilosopherCard from './components/PhilosopherCard';
import { generateDialogue } from './services/geminiService';

const App: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [dialogue, setDialogue] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogue]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length < 2) return [...prev, id];
      return prev;
    });
  };

  const handleGenerate = async () => {
    if (selectedIds.length !== 2 || !topic.trim()) return;

    setIsGenerating(true);
    setError(null);
    setDialogue([]);

    const p1 = PHILOSOPHERS.find(p => p.id === selectedIds[0])!;
    const p2 = PHILOSOPHERS.find(p => p.id === selectedIds[1])!;

    try {
      const result = await generateDialogue(p1, p2, topic);
      if (result.length === 0) throw new Error("對話生成失敗，請再試一次。");
      setDialogue(result);
    } catch (err: any) {
      setError(err.message || '發生未知錯誤');
    } finally {
      setIsGenerating(false);
    }
  };

  const p1 = PHILOSOPHERS.find(p => p.id === selectedIds[0]);
  const p2 = PHILOSOPHERS.find(p => p.id === selectedIds[1]);

  return (
    <div className="min-h-screen pb-20 px-4 pt-10 max-w-4xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 serif-font mb-4 tracking-tight">
          哲學家 <span className="text-amber-700">對話錄</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto leading-relaxed">
          挑選兩位思想家，賦予他們一個議題，見證跨越時空的智慧交鋒。
        </p>
      </header>

      {/* Selection Phase */}
      <section className="space-y-8 mb-12">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-amber-100 text-amber-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              選取兩位哲學家
            </h2>
            <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              已選擇 {selectedIds.length} / 2
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {PHILOSOPHERS.map(p => (
              <PhilosopherCard 
                key={p.id}
                philosopher={p}
                selected={selectedIds.includes(p.id)}
                onClick={() => toggleSelection(p.id)}
                disabled={selectedIds.length >= 2 && !selectedIds.includes(p.id)}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <span className="bg-amber-100 text-amber-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            設定討論主題
          </h2>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="例如：全民教育、生命的意義、AI 的道德..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-amber-500 focus:outline-none transition-all text-lg"
            />
            <button
              onClick={handleGenerate}
              disabled={selectedIds.length < 2 || !topic || isGenerating}
              className={`
                px-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-all
                ${selectedIds.length < 2 || !topic || isGenerating
                  ? 'bg-gray-300 cursor-not-allowed shadow-none'
                  : 'bg-amber-700 hover:bg-amber-800 hover:-translate-y-0.5 active:translate-y-0'}
              `}
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  思辨中...
                </div>
              ) : '開始辯論'}
            </button>
          </div>
        </div>
      </section>

      {/* Dialogue Area */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-8 text-center">
          {error}
        </div>
      )}

      {dialogue.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-center gap-8 mb-10 py-6 border-y border-gray-100">
            <div className="flex flex-col items-center">
              <img src={p1?.avatar} className="w-20 h-20 rounded-full border-4 border-amber-500 shadow-xl mb-2" />
              <span className="font-bold serif-font">{p1?.name}</span>
            </div>
            <div className="text-3xl font-serif text-gray-300 italic">VS</div>
            <div className="flex flex-col items-center">
              <img src={p2?.avatar} className="w-20 h-20 rounded-full border-4 border-amber-200 shadow-xl mb-2" />
              <span className="font-bold serif-font">{p2?.name}</span>
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 space-y-8">
            {dialogue.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-4 ${msg.role === 'p2' ? 'flex-row-reverse' : ''}`}
              >
                <div className="flex-shrink-0">
                  <img 
                    src={msg.role === 'p1' ? p1?.avatar : p2?.avatar} 
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                  />
                </div>
                <div className={`max-w-[80%] space-y-1 ${msg.role === 'p2' ? 'text-right' : ''}`}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">
                    {msg.name}
                  </p>
                  <div className={`
                    p-6 rounded-3xl text-gray-800 leading-relaxed shadow-sm
                    ${msg.role === 'p1' ? 'bg-amber-100 rounded-tl-none' : 'bg-white rounded-tr-none'}
                  `}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </section>
      )}

      {/* Loading Placeholder */}
      {isGenerating && (
        <div className="space-y-8 animate-pulse">
           <div className="h-24 bg-gray-200 rounded-3xl w-2/3"></div>
           <div className="h-32 bg-gray-100 rounded-3xl w-3/4 ml-auto"></div>
           <div className="h-24 bg-gray-200 rounded-3xl w-1/2"></div>
        </div>
      )}
      
      {!dialogue.length && !isGenerating && (
        <div className="mt-20 flex flex-col items-center text-gray-400 opacity-60">
          <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="serif-font italic">「未經審視的生活是不值得過的。」— 蘇格拉底</p>
        </div>
      )}
    </div>
  );
};

export default App;
