import React from 'react';
import { PenTool, Sparkles, LogIn, LogOut, User } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface HeaderProps {
  user: SupabaseUser | null;
  onLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogin, onLogout }) => {
  return (
    <header className="w-full py-6 px-4 border-b border-white/10 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-purple-500/20">
            <PenTool className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">VectorCraft AI</h1>
            <p className="text-xs text-zinc-400 font-medium flex items-center gap-1">
              Powered by Gemini 3 Pro <Sparkles className="w-3 h-3 text-amber-400" />
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://ai.google.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Documentation
          </a>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-zinc-400">
                <User className="w-4 h-4" />
                <span className="text-sm truncate max-w-[150px]">{user.email}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-950 bg-white rounded-lg hover:bg-zinc-200 transition-all shadow-lg shadow-white/5"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};