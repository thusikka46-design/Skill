/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Minimalist Apple/Notion-inspired Navigation Bar (Light Theme)
 */

import React from 'react';
import { 
  Clock, 
  Sparkles, 
  Users, 
  MessageSquare, 
  Video, 
  Wallet, 
  ShieldCheck, 
  User, 
  Code2, 
  ExternalLink 
} from 'lucide-react';
import { UserProfile } from '../types/index.ts';

export type ScreenId = 
  | 'landing' 
  | 'auth' 
  | 'profile' 
  | 'explore' 
  | 'chat' 
  | 'session' 
  | 'wallet' 
  | 'admin';

interface NavbarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  currentUser: UserProfile;
  onOpenDefense: () => void;
  isAuthenticated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  currentUser,
  onOpenDefense,
  isAuthenticated,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      {/* Top Academic Banner */}
      <div className="bg-gradient-to-r from-teal-50 via-slate-50 to-indigo-50 border-b border-slate-200/80 px-4 py-1.5 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-100 text-teal-800 border border-teal-200">
            HND in IT Viva Defense
          </span>
          <span className="hidden sm:inline text-slate-700 font-medium">
            Project: Non-Monetary Peer Skill Exchange with TimeBank Economy & Gemini AI
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenDefense}
            className="inline-flex items-center space-x-1.5 text-teal-700 hover:text-teal-800 font-semibold text-xs hover:underline cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Architecture & DDL Scripts</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-600/30 group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-lg">
                Skill<span className="text-teal-600">Swap</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                Network
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium -mt-0.5">
              1 Hour Taught = 1 Time Credit
            </p>
          </div>
        </div>

        {/* Desktop Screen Switcher */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentScreen === 'landing'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('explore')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-all ${
              currentScreen === 'explore'
                ? 'bg-white text-teal-700 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Match & Explore</span>
          </button>
          <button
            onClick={() => onNavigate('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-all ${
              currentScreen === 'chat'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>Swap & Chat</span>
          </button>
          <button
            onClick={() => onNavigate('session')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-all ${
              currentScreen === 'session'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-indigo-600" />
            <span>Live Hub & Roadmap</span>
          </button>
          <button
            onClick={() => onNavigate('wallet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-all ${
              currentScreen === 'wallet'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-teal-600" />
            <span>TimeBank Wallet</span>
          </button>
          <button
            onClick={() => onNavigate('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center space-x-1.5 transition-all ${
              currentScreen === 'admin'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Admin</span>
          </button>
        </nav>

        {/* Right User Bar & TimeBank Badge */}
        <div className="flex items-center space-x-3">
          {/* Time Credit Balance Pill */}
          <button 
            onClick={() => onNavigate('wallet')}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 hover:bg-teal-100/80 transition-colors cursor-pointer group"
            title="TimeBank Credit Balance"
          >
            <Clock className="w-4 h-4 text-teal-600 group-hover:rotate-45 transition-transform" />
            <div className="text-left">
              <div className="text-xs font-extrabold text-teal-800 leading-none">
                {currentUser.timeCreditBalance.toFixed(1)} <span className="text-[10px] font-semibold text-teal-600">Credits</span>
              </div>
              <div className="text-[10px] text-teal-700/80 leading-none mt-0.5">
                {currentUser.timeCreditBalance} hr(s) available
              </div>
            </div>
          </button>

          {/* Profile / Auth Button */}
          {isAuthenticated ? (
            <button
              onClick={() => onNavigate('profile')}
              className={`flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all ${
                currentScreen === 'profile'
                  ? 'border-teal-500 bg-white ring-2 ring-teal-100'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border border-slate-200"
              />
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.name}
                </span>
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  {currentUser.role}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile Screen Navigation Bar */}
      <div className="md:hidden flex items-center overflow-x-auto px-3 py-2 space-x-1.5 border-t border-slate-100 bg-slate-50 no-scrollbar">
        {[
          { id: 'landing', label: 'Home' },
          { id: 'explore', label: 'AI Match' },
          { id: 'chat', label: 'Chat' },
          { id: 'session', label: 'Live Hub' },
          { id: 'wallet', label: 'Wallet' },
          { id: 'profile', label: 'Profile' },
          { id: 'admin', label: 'Admin' },
          { id: 'auth', label: 'Auth' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as ScreenId)}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium ${
              currentScreen === item.id
                ? 'bg-teal-600 text-white font-semibold'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
