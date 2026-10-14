/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Screen 2: Authentication Page
 * Minimalist Sign-In & Sign-Up form UI with Role Selection (Learner/Mentor/Both)
 * and Google OAuth button mockup.
 */

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  Repeat 
} from 'lucide-react';
import { UserRole } from '../../types/index.ts';
import { ScreenId } from '../Navbar.tsx';

interface AuthScreenProps {
  onLoginSuccess: (role: UserRole, name: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, onNavigate }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('BOTH');
  const [fullName, setFullName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.rivera@skillswap.net');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    setTimeout(() => {
      setIsLoading(false);
      setNotification(`Welcome, ${fullName}! Account authenticated with 3.0 initial TimeBank credits.`);
      setTimeout(() => {
        onLoginSuccess(selectedRole, fullName);
      }, 700);
    }, 600);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('BOTH', 'Alex Rivera (Google)');
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-3 shadow-sm shadow-teal-600/30">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isSignUp ? 'Create Your TimeBank Account' : 'Welcome Back to SkillSwap'}
          </h2>
          <p className="text-xs text-slate-500 mt-1.5">
            {isSignUp 
              ? 'Receive 3.0 initial Time Credits immediately to start exchanging skills.'
              : 'Access your peer sessions, active chats, and TimeBank wallet.'}
          </p>
        </div>

        {/* Google OAuth Button Mockup */}
        <button
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-800 text-xs font-bold transition-all shadow-2xs mb-6 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google Account</span>
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Or with email
          </span>
        </div>

        {notification && (
          <div className="mb-5 p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center space-x-2">
            <Check className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
                  />
                </div>
              </div>

              {/* Role Selection (Learner / Mentor / Both) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Platform Role Selection
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'LEARNER', label: 'Learner', icon: BookOpen, desc: 'Seek guidance' },
                    { id: 'MENTOR', label: 'Mentor', icon: GraduationCap, desc: 'Teach peers' },
                    { id: 'BOTH', label: 'Both', icon: Repeat, desc: 'Reciprocal (Recommended)' },
                  ].map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;
                    return (
                      <button
                        type="button"
                        key={role.id}
                        onClick={() => setSelectedRole(role.id as UserRole)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/70 text-teal-900 ring-1 ring-teal-600'
                            : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-700' : 'text-slate-400'}`} />
                          {isSelected && <Check className="w-3 h-3 text-teal-700 font-bold" />}
                        </div>
                        <div className="mt-1.5 text-xs font-bold">{role.label}</div>
                        <div className="text-[10px] text-slate-500 truncate">{role.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu or domain.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Password
              </label>
              {!isSignUp && (
                <a href="#reset" onClick={(e) => e.preventDefault()} className="text-[11px] text-teal-700 font-semibold hover:underline">
                  Forgot?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
              />
            </div>
          </div>

          {/* Credit Grant Badge on Signup */}
          {isSignUp && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              <span>
                New members automatically receive <strong className="text-slate-900 font-bold">3.0 starter Time Credits</strong> to book their first peer sessions immediately.
              </span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm shadow-teal-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isSignUp ? 'Create Account & Claim 3 Credits' : 'Sign In to TimeBank'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Sign Up and Sign In */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-teal-700 font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-teal-700 font-bold hover:underline cursor-pointer"
              >
                Sign Up with 3 Credits
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
