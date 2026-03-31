import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BookOpen, Stethoscope, Activity, ChevronRight, Loader2, History, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getStemExplanation } from '../services/gemini';
import { cn } from '../lib/utils';

interface Explanation {
  id: string;
  concept: string;
  content: string;
  timestamp: Date;
}

export default function TutorInterface() {
  const [concept, setConcept] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanations, setExplanations] = useState<Explanation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!concept.trim() || loading) return;

    setLoading(true);
    try {
      const response = await getStemExplanation(concept);
      const newExplanation: Explanation = {
        id: Math.random().toString(36).substring(7),
        concept: concept.trim(),
        content: response,
        timestamp: new Date(),
      };
      setExplanations(prev => [newExplanation, ...prev]);
      setSelectedId(newExplanation.id);
      setConcept('');
    } catch (error) {
      console.error('Error fetching explanation:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedExplanation = explanations.find(e => e.id === selectedId);

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Stethoscope size={20} />
            </div>
            <h1 className="font-serif italic text-xl tracking-tight">MedSTEM Tutor</h1>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Enter STEM concept..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <button 
              type="submit"
              disabled={loading || !concept.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-blue-600 disabled:text-gray-300 hover:bg-blue-50 rounded-md transition-colors"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <ChevronRight size={16} />}
            </button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="flex items-center gap-2 px-2 mb-4 text-[10px] uppercase tracking-widest font-semibold text-gray-400">
            <History size={12} />
            <span>Consultation History</span>
          </div>
          
          <AnimatePresence initial={false}>
            {explanations.map((exp) => (
              <motion.button
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => setSelectedId(exp.id)}
                className={cn(
                  "w-full text-left p-3 rounded-xl transition-all group relative",
                  selectedId === exp.id 
                    ? "bg-blue-50 border border-blue-100 text-blue-900" 
                    : "hover:bg-gray-50 border border-transparent text-gray-600"
                )}
              >
                <div className="text-xs font-medium truncate pr-6">{exp.concept}</div>
                <div className="text-[10px] opacity-50 mt-1">
                  {exp.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setExplanations(prev => prev.filter(item => item.id !== exp.id));
                    if (selectedId === exp.id) setSelectedId(null);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              </motion.button>
            ))}
          </AnimatePresence>

          {explanations.length === 0 && !loading && (
            <div className="text-center py-12 px-6">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 text-gray-300">
                <BookOpen size={24} />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Enter a complex STEM concept to begin your medical-grade briefing.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Activity size={16} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Status</div>
              <div className="text-xs font-medium text-gray-600">Clinical Mode Active</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative bg-white">
        <AnimatePresence mode="wait">
          {selectedExplanation ? (
            <motion.div
              key={selectedExplanation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 overflow-y-auto"
            >
              <div className="max-w-3xl mx-auto px-8 py-12">
                <div className="mb-12">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-600 mb-2">Subject Briefing</div>
                  <h2 className="text-4xl font-serif italic text-gray-900 mb-4">{selectedExplanation.concept}</h2>
                  <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-gray-100 pt-4">
                    <span className="flex items-center gap-1.5"><Activity size={12} /> STEM-Medical Correlation</span>
                    <span className="flex items-center gap-1.5"><BookOpen size={12} /> Professional Grade</span>
                  </div>
                </div>

                <div className="markdown-body prose prose-slate max-w-none">
                  <ReactMarkdown>{selectedExplanation.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-12">
              <div className="max-w-md text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto mb-8">
                  <Stethoscope size={32} />
                </div>
                <h2 className="text-2xl font-serif italic text-gray-900 mb-4">Welcome, Doctor.</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  This interface is designed to bridge the gap between advanced STEM principles and clinical medicine. 
                  Select a topic or enter a new one to receive a structured, medical-grade explanation.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {['Quantum Entanglement', 'Neural Networks', 'Fluid Dynamics', 'Blockchain'].map(topic => (
                    <button
                      key={topic}
                      onClick={() => {
                        setConcept(topic);
                        setTimeout(() => {
                          const form = document.querySelector('form');
                          form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                        }, 0);
                      }}
                      className="p-3 text-left border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all text-xs text-gray-600"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {loading && !selectedExplanation && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-sm font-serif italic text-gray-600">Analyzing clinical correlations...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
