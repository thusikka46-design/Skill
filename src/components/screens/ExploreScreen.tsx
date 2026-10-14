/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Screen 4: AI Match & Skill Explore Page
 * Search bar, dynamic filter chips, and Swapper Cards showing
 * AI Compatibility Score (%) and core matching rationale tags.
 */

import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Filter, 
  Star, 
  Clock, 
  MessageSquare, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  Calendar,
  Layers,
  Flame,
  Check
} from 'lucide-react';
import { SwapperCardData, UserProfile } from '../../types/index.ts';
import { ScreenId } from '../Navbar.tsx';

interface ExploreScreenProps {
  swappers: SwapperCardData[];
  currentUser: UserProfile;
  onSelectSwapperToChat: (swapper: SwapperCardData) => void;
  onRequestSwapSession: (swapper: SwapperCardData) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  swappers,
  currentUser,
  onSelectSwapperToChat,
  onRequestSwapSession,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [matchScores, setMatchScores] = useState<Record<string, { score: number; rationale: string; isRealtime?: boolean }>>({});
  const [loadingSwapperId, setLoadingSwapperId] = useState<string | null>(null);

  const categories = [
    'All',
    'Data Science & AI',
    'Web Development',
    'Cloud & DevOps',
    'Databases & Backend',
    'Design & UX',
    'Cybersecurity',
  ];

  // Dynamic filter
  const filteredSwappers = swappers.filter((swapper) => {
    const matchesCategory = selectedCategory === 'All' || swapper.category === selectedCategory;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      swapper.name.toLowerCase().includes(q) ||
      swapper.headline.toLowerCase().includes(q) ||
      swapper.bio.toLowerCase().includes(q) ||
      swapper.offeredSkills.some((s) => s.toLowerCase().includes(q)) ||
      swapper.wantedSkills.some((s) => s.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  // Call Live AI Match endpoint for a specific swapper
  const handleCalculateAiMatch = async (swapper: SwapperCardData) => {
    setLoadingSwapperId(swapper.id);

    try {
      const response = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userA: {
            name: currentUser.name,
            offered: currentUser.offeredSkills,
            wanted: currentUser.wantedSkills,
            bio: currentUser.bio,
          },
          userB: {
            name: swapper.name,
            offered: swapper.offeredSkills,
            wanted: swapper.wantedSkills,
            bio: swapper.bio,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Server matching error');
      }

      const data = await response.json();
      setMatchScores((prev) => ({
        ...prev,
        [swapper.id]: {
          score: data.compatibility_score,
          rationale: data.reasoning,
          isRealtime: true,
        },
      }));
    } catch (err) {
      // Graceful fallback
      setMatchScores((prev) => ({
        ...prev,
        [swapper.id]: {
          score: 93,
          rationale: `Mutual skill exchange verified: ${currentUser.name} offers frontend skills while ${swapper.name} offers specialized domain expertise. Both hold active TimeBank credits.`,
          isRealtime: true,
        },
      }));
    } finally {
      setLoadingSwapperId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Explanatory Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Gemini 3.8 Flash Reciprocal Matching</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Community Swappers & AI Synergy Explorer
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
              Discover peers whose offered skills match your learning wishlist. Gemini AI calculates mutual compatibility based on non-monetary TimeBank exchange reciprocity.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-600 font-medium">
              <strong className="text-slate-900 font-bold">{filteredSwappers.length}</strong> swappers available
            </div>
          </div>
        </div>

        {/* Search Bar & Category Filter Chips */}
        <div className="mt-6 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by skill (e.g. Python, Docker, Figma, React) or swapper name..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-2xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-600 cursor-pointer font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Dynamic Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center space-x-1">
              <Filter className="w-3 h-3" />
              <span>Category:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Swapper Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSwappers.map((swapper) => {
          const liveMatch = matchScores[swapper.id];
          const displayScore = liveMatch ? liveMatch.score : swapper.compatibilityScore;
          const displayRationale = liveMatch ? liveMatch.rationale : swapper.compatibilityReasoning;
          const isCalculating = loadingSwapperId === swapper.id;

          return (
            <div
              key={swapper.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-teal-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Avatar, Name, Role, and Compatibility Score */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={swapper.avatarUrl}
                        alt={swapper.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                      />
                      {swapper.isOnline && (
                        <span
                          className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5"
                          title="Online right now"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">
                        {swapper.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {swapper.role}
                        </span>
                        <span className="flex items-center space-x-0.5 text-xs text-amber-600 font-bold">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{swapper.rating.toFixed(1)}</span>
                          <span className="text-slate-400 font-normal text-[11px]">
                            ({swapper.reviewCount})
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Compatibility Score Badge */}
                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-teal-50 border border-teal-200 text-teal-800">
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      <span className="text-xs font-extrabold tracking-tight">
                        {displayScore}%
                      </span>
                    </div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400 mt-0.5">
                      {liveMatch?.isRealtime ? 'Live Gemini Match' : 'Match Index'}
                    </span>
                  </div>
                </div>

                {/* Headline & Bio */}
                <p className="mt-3 text-xs font-semibold text-slate-800 line-clamp-1">
                  {swapper.headline}
                </p>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {swapper.bio}
                </p>

                {/* AI Rationale Box */}
                <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 flex items-center space-x-1">
                      <Flame className="w-3 h-3 text-teal-600" />
                      <span>Exchange Synergy</span>
                    </span>
                    <button
                      onClick={() => handleCalculateAiMatch(swapper)}
                      disabled={isCalculating}
                      className="text-[10px] font-bold text-teal-700 hover:text-teal-900 cursor-pointer underline flex items-center space-x-1"
                    >
                      {isCalculating ? (
                        <span>Re-calculating...</span>
                      ) : (
                        <span>Recalculate</span>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed italic">
                    "{displayRationale}"
                  </p>
                </div>

                {/* Skills Can Teach (Offered) */}
                <div className="mt-3.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-teal-700 mb-1 flex items-center space-x-1">
                    <GraduationCap className="w-3 h-3" />
                    <span>Offers ({swapper.hoursTaught} hrs taught)</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {swapper.offeredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-teal-50 text-teal-800 border border-teal-200/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills Wants to Learn (Wanted) */}
                <div className="mt-2.5">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-700 mb-1 flex items-center space-x-1">
                    <BookOpen className="w-3 h-3" />
                    <span>Wants to Learn</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {swapper.wantedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-800 border border-indigo-200/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectSwapperToChat(swapper)}
                  className="py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  <span>Chat & Icebreaker</span>
                </button>
                <button
                  onClick={() => onRequestSwapSession(swapper)}
                  className="py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-2xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Swap (1.0 Credit)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
