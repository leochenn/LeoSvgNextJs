/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback, useEffect } from 'react';
import { Send, Loader2, Wand2, Clock, Trash2, Lock } from 'lucide-react';
import { fetchHistory, deleteHistoryItem } from '../services/historyService';
import { GenerationStatus } from '../types';
import { User } from '@supabase/supabase-js';

interface InputSectionProps {
  onGenerate: (prompt: string) => void;
  status: GenerationStatus;
  user: User | null;
  onLoginClick: () => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate, status, user, onLoginClick }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchHistory().then(setHistory);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status !== GenerationStatus.LOADING) {
      onGenerate(input.trim());
    }
  }, [input, status, onGenerate]);

  const isLoading = status === GenerationStatus.LOADING;

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 px-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 mb-3">
          What do you want to create?!!
        </h2>
        <p className="text-zinc-400 text-lg">
          Describe an object, icon, or scene, and we'll render it as vector art.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur-lg"></div>
        <div className="relative flex items-center bg-zinc-900 rounded-xl border border-white/10 shadow-2xl overflow-hidden p-2">
          <div className="pl-4 text-zinc-500">
            <Wand2 className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => {
              setShowHistory(true);
              fetchHistory().then(setHistory);
            }}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            placeholder={user ? "e.g. A futuristic cyberpunk helmet with neon lights..." : "Please login to generate vector art"}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-500 px-4 py-3 text-lg"
            disabled={isLoading || !user}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || !user}
            className={`
              flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200
              ${!input.trim() || isLoading || !user
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-white text-zinc-950 hover:bg-zinc-200 active:scale-95 shadow-lg shadow-white/10'}
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="hidden sm:inline">Crafting...</span>
              </>
            ) : !user ? (
              <>
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Login Required</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Generate</span>
                <Send className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* History Dropdown */}
        {showHistory && history.length > 0 && user && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto">
            {history.map((item, index) => (
              <div
                key={index}
                className="group/item flex items-center w-full border-b border-white/5 last:border-none hover:bg-white/5 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => {
                    setInput(item);
                    setShowHistory(false);
                  }}
                  className="flex-1 flex items-center gap-3 px-4 py-3 text-left text-zinc-300 hover:text-white min-w-0"
                >
                  <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="truncate">{item}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHistoryItem(item, user!.id);
                    setHistory(prev => prev.filter(i => i !== item));
                  }}
                  className="mr-3 p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-white/10 transition-all shrink-0"
                  title="Remove from history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </form>

      {/* Quick suggestions */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {['Retro Camera', 'Space Rocket', 'Origami Bird', 'Isometric House'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setInput(suggestion)}
            className="px-3 py-1.5 text-xs font-medium text-zinc-400 bg-zinc-800/50 border border-white/5 rounded-full hover:bg-zinc-800 hover:text-white hover:border-white/20 transition-all"
            disabled={isLoading}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
