/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Screen 1: Landing / Home Page
 * Minimalist Hero section with Light Emerald accents, 3-step "How TimeBank Works" grid,
 * live statistics cards, and clear CTA buttons.
 */

import React from 'react';
import { 
  Sparkles, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Repeat, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  Layers,
  Code2,
  Users
} from 'lucide-react';
import { ScreenId } from '../Navbar.tsx';

interface LandingScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenDefense: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate, onOpenDefense }) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-teal-50/40 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Non-Monetary TimeBank & AI Skill Matching</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Exchange Knowledge.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">
              Zero Money, Pure Hours.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A peer-to-peer egalitarian learning community. Teach 1 hour of what you know, earn 1 Time Credit, and redeem it with verified community mentors. Powered by Google AI Studio (Gemini 3.8 Flash).
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('explore')}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-teal-600 text-white hover:bg-teal-700 shadow-sm shadow-teal-600/30 inline-flex items-center space-x-2 transition-all hover:translate-y-[-1px] cursor-pointer"
            >
              <span>Explore AI Matches</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('auth')}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-xs inline-flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>Join with 3.0 Free Credits</span>
            </button>
            <button
              onClick={onOpenDefense}
              className="px-4 py-3.5 rounded-xl font-bold text-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 inline-flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-indigo-600" />
              <span>Viva Defense Architecture</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-10 pt-8 border-t border-slate-200/60 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Strict 1 Hour = 1 Credit Rule</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Gemini 3.8 Flash Reciprocal Matching</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>ACID PostgreSQL Audit Ledger</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Statistics Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Swappers</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">1,480+</div>
            <p className="mt-1 text-xs text-teal-600 font-semibold flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18% internship cohort growth</span>
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hours Exchanged</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">3,892 hrs</div>
            <p className="mt-1 text-xs text-slate-500 font-medium">100% non-monetary learning</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tuition Fees Saved</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">$194,600</div>
            <p className="mt-1 text-xs text-emerald-600 font-semibold">At avg $50/hr tutor cost</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Match Accuracy</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">94.8%</div>
            <p className="mt-1 text-xs text-slate-500 font-medium">Gemini verified skill synergy</p>
          </div>
        </div>
      </section>

      {/* 3-Step "How TimeBank Works" Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            The TimeBank Principle
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How Peer Skill Exchange Works
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            No fiat money, no subscription fees. An hour of your time is valued equally, regardless of whether you teach React or Spanish.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 transition-colors relative">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 font-extrabold text-lg flex items-center justify-center mb-5 border border-teal-100">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Offer What You Know</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              List the programming frameworks, cloud tools, languages, or design principles you can mentor others in. Our Gemini AI engine cleans up your profile bio and categorizes your skills into standardized industry tags.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs text-teal-700 font-semibold">
              <span>Automatic Taxonomy Validation</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors relative">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-lg flex items-center justify-center mb-5 border border-indigo-100">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Teach & Earn Time Credits</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Accept a swap request or schedule a 1-hour video session. After the session completes and both parties submit feedback, exactly 1.0 Time Credit is automatically transferred into your TimeBank Wallet.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs text-indigo-700 font-semibold">
              <span>ACID Double-Entry Ledger</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 transition-colors relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-lg flex items-center justify-center mb-5 border border-emerald-100">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Learn Anything for Free</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Redeem your accumulated Time Credits with senior engineers, database administrators, or AI researchers. Generate a tailored 7-Day lesson roadmap to fast-track your internship deliverables.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs text-emerald-700 font-semibold">
              <span>Personalized AI Learning Roadmaps</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-800">
              Viva Defense Technical Highlight
            </span>
            <h3 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight">
              Four Interconnected AI Modules in One Clean Engine
            </h3>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              Engineered with Google AI Studio's `@google/genai` TypeScript SDK: Real-time reciprocal compatibility scoring, 7-day lesson roadmap syllabus generation, automated icebreaker messaging, and double-entry TimeBank ledger accounting.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                <div className="font-bold text-sm text-teal-300">Reciprocal AI Matcher</div>
                <div className="text-xs text-slate-300 mt-1">Cross-references User A's offered skills with User B's desired learning goals for optimal synergy.</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                <div className="font-bold text-sm text-indigo-300">Structured Syllabus Roadmap</div>
                <div className="text-xs text-slate-300 mt-1">Generates daily hands-on focus areas, test checkpoints, and a capstone defense project.</div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('explore')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-900 transition-colors cursor-pointer"
              >
                Launch Swapper Explorer
              </button>
              <button
                onClick={onOpenDefense}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/20 text-white border border-white/20 transition-colors cursor-pointer"
              >
                View PostgreSQL DDL Schema
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
