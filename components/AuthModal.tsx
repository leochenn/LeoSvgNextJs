
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { X, Mail, Lock, Loader2 } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [checkEmail, setCheckEmail] = useState(false);
    const [otpCode, setOtpCode] = useState('');

    useEffect(() => {
        if (!isOpen) {
            // Reset state when modal is closed
            setCheckEmail(false);
            setOtpCode('');
            setError(null);
            setIsLoading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onClose();
            } else {
                const { error, data } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;

                // Check if user already exists (identities is empty for existing users)
                if (data.user && data.user.identities && data.user.identities.length === 0) {
                    throw new Error('User already registered');
                }

                // If sign up successful but no session, email confirmation is required
                if (data.user && !data.session) {
                    setCheckEmail(true);
                } else {
                    onClose();
                }
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: otpCode,
                type: 'signup'
            });

            if (error) throw error;

            // Success!
            onClose();
        } catch (err: any) {
            setError(err.message || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (checkEmail) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-xl p-8 text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="mx-auto w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                        <Mail className="w-6 h-6 text-indigo-400" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Verify your account</h2>
                    <p className="text-zinc-400 mb-6">
                        Enter the verification code sent to <span className="text-white font-medium">{email}</span>
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm text-left">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-widest font-mono focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
                                placeholder="00000000"
                                required
                                maxLength={8}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-zinc-950 font-bold py-3 rounded-lg hover:bg-zinc-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Verify & Login
                        </button>
                    </form>

                    <p className="mt-4 text-sm text-zinc-500">
                        Didn't receive code? <span className="text-zinc-400">Check spam folder or check your template settings.</span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden p-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-2">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-zinc-400 mb-6">
                    {isLogin ? 'Login to continue creating' : 'Sign up to start your journey'}
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-800/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-800/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-zinc-950 font-bold py-3 rounded-lg hover:bg-zinc-200 active:scale-95 transition-all flex items-center justify-center gap-2 mt-6"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-zinc-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
                    >
                        {isLogin ? 'Sign up' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};
