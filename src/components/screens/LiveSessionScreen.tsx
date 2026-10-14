/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Screen 6: Live Session & Learning Hub
 * Video session preview screen with an "AI Day-by-Day Lesson Roadmap"
 * accordion module.
 */

import React, { useState } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  Clock, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  Star, 
  Users, 
  Layers, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { RoadmapDay, UserProfile } from '../../types/index.ts';
import { DEFAULT_ROADMAP_SAMPLE } from '../../data/mockData.ts';

interface LiveSessionScreenProps {
  currentUser: UserProfile;
  onCompleteSessionTransfer: (hours: number, partnerName: string, skill: string, rating: number, feedback: string) => void;
}

export const LiveSessionScreen: React.FC<LiveSessionScreenProps> = ({
  currentUser,
  onCompleteSessionTransfer,
}) => {
  // Video room state
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [sessionTimer, setSessionTimer] = useState('42:18');
  const [partnerName, setPartnerName] = useState('Elena Rostova');

  // AI Roadmap state
  const [roadmapSkill, setRoadmapSkill] = useState('Python Data Science');
  const [roadmapDuration, setRoadmapDuration] = useState('7 Days');
  const [roadmapDays, setRoadmapDays] = useState<RoadmapDay[]>(DEFAULT_ROADMAP_SAMPLE);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);

  // Settlement modal state
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewFeedback, setReviewFeedback] = useState('Exceptional session! Elena clarified pandas groupby aggregations and feature scaling with great real-world examples.');
  const [transferDone, setTransferDone] = useState(false);

  // Toggle Day Accordion
  const toggleAccordion = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  // Toggle Day Completion
  const toggleDayCompletion = (dayNum: number) => {
    setRoadmapDays(
      roadmapDays.map((d) => (d.day === dayNum ? { ...d, completed: !d.completed } : d))
    );
  };

  // Generate or Regenerate Roadmap via Express Backend
  const handleGenerateRoadmap = async () => {
    setIsLoadingRoadmap(true);
    try {
      const response = await fetch('/api/ai/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: roadmapSkill,
          duration: roadmapDuration,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate roadmap');
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setRoadmapDays(data.map((item) => ({ ...item, completed: false })));
        setExpandedDay(1);
      }
    } catch (err) {
      console.warn('Using standard pedagogical curriculum fallback:', err);
    } finally {
      setIsLoadingRoadmap(false);
    }
  };

  const handleFinalizeSettlement = () => {
    onCompleteSessionTransfer(1.0, partnerName, roadmapSkill, reviewRating, reviewFeedback);
    setTransferDone(true);
    setTimeout(() => {
      setShowCompleteModal(false);
      setTransferDone(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Escrow Guarantee Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 mb-2">
              <Video className="w-3.5 h-3.5 text-indigo-600" />
              <span>Live Peer Exchange Session & Learning Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Virtual Classroom & AI Syllabus Navigator
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
              Conduct verified 1-on-1 peer teaching sessions. Day-by-day learning milestones are dynamically structured by Gemini AI, with automated TimeBank credit settlement upon mutual completion.
            </p>
          </div>

          {/* TimeBank Escrow Pill */}
          <div className="bg-teal-50 border border-teal-200 p-3.5 rounded-2xl flex items-center space-x-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-teal-900">
                1.0 Credit in Escrow
              </div>
              <div className="text-[11px] text-teal-700/80">
                Held safely for session completion
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Video Stream (Left) + AI Day-by-Day Roadmap (Right) */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Video Stream Preview & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Video Screen Container */}
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-800 relative aspect-video flex flex-col justify-between p-4">
            {/* Top Bar inside Video */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center space-x-2 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-medium border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold">LIVE</span>
                <span className="text-slate-400">|</span>
                <span>{sessionTimer}</span>
              </div>

              <div className="bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-medium border border-white/10 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span>1-Hour TimeBank Slot</span>
              </div>
            </div>

            {/* Simulated Video Feeds */}
            <div className="relative w-full h-full flex items-center justify-center my-2">
              {/* Partner Feed (Full) */}
              <div className="w-full h-full rounded-2xl overflow-hidden relative bg-slate-800 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
                  alt="Partner Stream"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-xs font-semibold border border-white/10">
                  {partnerName} (Python Instructor)
                </div>
              </div>

              {/* Self Camera Picture-in-Picture (Bottom-Right) */}
              <div className="absolute bottom-3 right-3 w-36 sm:w-44 aspect-video rounded-xl overflow-hidden border-2 border-white/20 shadow-md bg-slate-950">
                {isVideoOn ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    Camera Off
                  </div>
                )}
                <div className="absolute bottom-1.5 left-1.5 bg-slate-900/80 px-1.5 py-0.5 rounded text-[10px] text-white font-medium">
                  You ({currentUser.name})
                </div>
              </div>
            </div>

            {/* Video Action Controls Bar */}
            <div className="flex items-center justify-center space-x-3 z-10 pt-2">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-2xl backdrop-blur-md transition-all cursor-pointer ${
                  isMicOn
                    ? 'bg-slate-800/80 text-white hover:bg-slate-700'
                    : 'bg-red-500/90 text-white hover:bg-red-600'
                }`}
                title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-2xl backdrop-blur-md transition-all cursor-pointer ${
                  isVideoOn
                    ? 'bg-slate-800/80 text-white hover:bg-slate-700'
                    : 'bg-red-500/90 text-white hover:bg-red-600'
                }`}
                title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3 rounded-2xl backdrop-blur-md transition-all cursor-pointer ${
                  isScreenSharing
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800/80 text-white hover:bg-slate-700'
                }`}
                title="Share Screen"
              >
                <Monitor className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowCompleteModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/30 flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>End & Release 1.0 Credit</span>
              </button>
            </div>
          </div>

          {/* Session Details Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Verified Academic Exchange Session #SS-2026
                </h4>
                <p className="text-[11px] text-slate-500">
                  Topic: {roadmapSkill} • Escrow: 1.0 Time Credit ($0 fiat)
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCompleteModal(true)}
              className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
            >
              Sign Off & Rate
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Day-by-Day Lesson Roadmap Accordion Module (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                    AI Day-by-Day Lesson Roadmap
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Syllabus synthesized by Gemini 3.8 Flash
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {roadmapDuration}
              </span>
            </div>

            {/* Skill Selector & Regenerate Input */}
            <div className="space-y-2 mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Subject Skill
                  </label>
                  <input
                    type="text"
                    value={roadmapSkill}
                    onChange={(e) => setRoadmapSkill(e.target.value)}
                    placeholder="e.g. React.js, Docker..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium bg-white focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Duration
                  </label>
                  <select
                    value={roadmapDuration}
                    onChange={(e) => setRoadmapDuration(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium bg-white focus:outline-none focus:border-teal-600"
                  >
                    <option value="7 Days">7 Days (Standard)</option>
                    <option value="14 Days">14 Days (In-Depth)</option>
                    <option value="30 Days">30 Days (Mastery)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateRoadmap}
                disabled={isLoadingRoadmap}
                className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-2xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRoadmap ? 'animate-spin' : ''}`} />
                <span>{isLoadingRoadmap ? 'Gemini Formulating Curriculum...' : 'Regenerate Syllabus with Gemini'}</span>
              </button>
            </div>

            {/* Accordion List */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {roadmapDays.map((item) => {
                const isExpanded = expandedDay === item.day;
                return (
                  <div
                    key={item.day}
                    className={`rounded-2xl border transition-all ${
                      item.completed
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : isExpanded
                        ? 'border-teal-500 bg-white shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Accordion Day Header */}
                    <div
                      onClick={() => toggleAccordion(item.day)}
                      className="p-3.5 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDayCompletion(item.day);
                          }}
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                            item.completed
                              ? 'bg-emerald-600 text-white'
                              : 'border border-slate-300 text-transparent hover:border-slate-400'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800">
                              Day {item.day}
                            </span>
                            {item.completed && (
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                Completed
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {item.topic}
                          </div>
                        </div>
                      </div>

                      <div className="text-slate-400 pl-2">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Accordion Focus Areas Content */}
                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100 text-xs">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Hands-On Focus Areas:
                        </div>
                        <ul className="space-y-1.5">
                          {item.focus_areas.map((point, idx) => (
                            <li key={idx} className="flex items-start space-x-2 text-slate-600 text-[11px] leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Complete Session & Release 1.0 Credit Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full shadow-lg">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-3 shadow-sm shadow-teal-600/30">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Complete Session & Transfer Credit
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Both parties confirm 1 hour of peer instruction. Exactly 1.0 Time Credit will be debited/credited in the immutable ledger.
              </p>
            </div>

            {transferDone ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-extrabold text-sm">Transaction Settled!</div>
                <div className="text-xs text-emerald-800">
                  1.0 Time Credit transferred. Balance and audit logs updated.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Rating selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                    Rate Peer Instructor ({reviewRating} / 5 Stars)
                  </label>
                  <div className="flex items-center justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="cursor-pointer text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Feedback & Peer Review
                  </label>
                  <textarea
                    rows={3}
                    value={reviewFeedback}
                    onChange={(e) => setReviewFeedback(e.target.value)}
                    placeholder="Write a brief constructive evaluation..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 leading-relaxed"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                  <strong>ACID Integrity Check:</strong> Learner balance will be atomically debited -1.0 credit, and {partnerName}'s balance will be credited +1.0 credit.
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setShowCompleteModal(false)}
                    className="py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFinalizeSettlement}
                    className="py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-2xs flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>Release 1.0 Credit</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
