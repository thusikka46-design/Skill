/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Screen 5: Interactive Swap & Chat Dashboard
 * Clean 2-column layout (contacts on left, chat thread on right)
 * with a "Generate AI Ice-breaker" button.
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Clock, 
  Calendar, 
  Video, 
  Star, 
  Check, 
  User, 
  Search, 
  ArrowRight,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { SwapperCardData, ChatMessage, UserProfile } from '../../types/index.ts';

interface ChatDashboardScreenProps {
  swappers: SwapperCardData[];
  currentUser: UserProfile;
  activeSwapperId: string;
  onSelectSwapper: (id: string) => void;
  chatThreads: Record<string, ChatMessage[]>;
  onSendMessage: (receiverId: string, text: string, isAi?: boolean) => void;
  onRequestSwapSession: (swapper: SwapperCardData) => void;
}

export const ChatDashboardScreen: React.FC<ChatDashboardScreenProps> = ({
  swappers,
  currentUser,
  activeSwapperId,
  onSelectSwapper,
  chatThreads,
  onSendMessage,
  onRequestSwapSession,
}) => {
  const [inputText, setInputText] = useState('');
  const [isGeneratingIcebreaker, setIsGeneratingIcebreaker] = useState(false);
  const [icebreakerOptions, setIcebreakerOptions] = useState<string[]>([]);
  const [showIcebreakerModal, setShowIcebreakerModal] = useState(false);
  const [contactSearch, setContactSearch] = useState('');

  const activeSwapper = swappers.find((s) => s.id === activeSwapperId) || swappers[0];
  const messages = (activeSwapper ? chatThreads[activeSwapper.id] : []) || [];

  const filteredContacts = swappers.filter((s) =>
    s.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    s.offeredSkills.some((skill) => skill.toLowerCase().includes(contactSearch.toLowerCase()))
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeSwapper) return;
    onSendMessage(activeSwapper.id, inputText.trim());
    setInputText('');
  };

  // Generate AI Icebreakers via Express Backend Route
  const handleGenerateIcebreaker = async () => {
    if (!activeSwapper) return;
    setIsGeneratingIcebreaker(true);
    setShowIcebreakerModal(true);

    try {
      const targetSkill = activeSwapper.offeredSkills[0] || 'Technical Mentorship';
      const response = await fetch('/api/ai/icebreaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: {
            name: currentUser.name,
            offered: currentUser.offeredSkills,
            bio: currentUser.bio,
          },
          receiver: {
            name: activeSwapper.name,
            bio: activeSwapper.bio,
          },
          skill: targetSkill,
        }),
      });

      if (!response.ok) {
        throw new Error('Icebreaker generation failed');
      }

      const list = await response.json();
      setIcebreakerOptions(Array.isArray(list) ? list : []);
    } catch (err) {
      // Fallback 3 distinct messages
      const targetSkill = activeSwapper.offeredSkills[0] || 'Specialized Mentorship';
      const mySkill = currentUser.offeredSkills[0] || 'Web Development';
      setIcebreakerOptions([
        `Hi ${activeSwapper.name}! I noticed your mastery in ${targetSkill}. I would love to trade 1 hour of ${mySkill} mentorship in exchange for a focused walkthrough on your best practices. Would you be open to a TimeBank session this week?`,
        `Hey ${activeSwapper.name}, your work in ${targetSkill} caught my attention! I am currently building a practical system and would value your feedback. In return, I can help you accelerate your goals in ${mySkill}. Let me know if you would like to collaborate!`,
        `Hello ${activeSwapper.name}! As fellow members of the SkillSwap community network, I have active TimeBank credits ready and would enjoy deep-diving into ${targetSkill} together while sharing practical tips from my background in ${mySkill}.`,
      ]);
    } finally {
      setIsGeneratingIcebreaker(false);
    }
  };

  const handleUseIcebreaker = (text: string) => {
    setInputText(text);
    setShowIcebreakerModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Container with clean 2-column layout */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row h-[740px]">
        
        {/* LEFT COLUMN: Contacts & Peer Swapper List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/60 shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                <span>Active Swapper Chats</span>
              </h2>
              <span className="text-[11px] font-semibold text-slate-500">
                {swappers.length} Available
              </span>
            </div>

            {/* Search contacts */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                placeholder="Filter swapper contacts..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredContacts.map((swapper) => {
              const isSelected = activeSwapper?.id === swapper.id;
              const thread = chatThreads[swapper.id] || [];
              const lastMessage = thread[thread.length - 1];

              return (
                <div
                  key={swapper.id}
                  onClick={() => onSelectSwapper(swapper.id)}
                  className={`p-3.5 flex items-start space-x-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-l-4 border-l-teal-600 shadow-2xs'
                      : 'hover:bg-slate-100/80'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={swapper.avatarUrl}
                      alt={swapper.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    {swapper.isOnline && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {swapper.name}
                      </span>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/60">
                        {swapper.compatibilityScore}%
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {lastMessage ? lastMessage.text : `Teaches: ${swapper.offeredSkills.slice(0, 2).join(', ')}`}
                    </p>

                    <div className="flex items-center space-x-1.5 mt-1">
                      <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                        {swapper.role}
                      </span>
                      <span className="text-[9px] text-slate-400">•</span>
                      <span className="text-[9px] text-slate-500 font-medium truncate">
                        {swapper.offeredSkills[0]}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TimeBank Rule Notice at bottom */}
          <div className="p-3 bg-teal-50/70 border-t border-teal-100 text-[11px] text-teal-900 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-teal-700 shrink-0" />
            <span>All sessions are credited at <strong>1.0 credit / hour</strong>.</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Chat Thread & Messages */}
        <div className="flex-1 flex flex-col bg-white">
          {activeSwapper ? (
            <>
              {/* Chat Thread Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white z-10">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={activeSwapper.avatarUrl}
                      alt={activeSwapper.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    {activeSwapper.isOnline && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-slate-900 text-sm">
                        {activeSwapper.name}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {activeSwapper.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Teaches <strong className="text-teal-700 font-medium">{activeSwapper.offeredSkills.join(', ')}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Generate AI Icebreaker Button */}
                  <button
                    onClick={handleGenerateIcebreaker}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Generate AI Ice-breaker</span>
                  </button>

                  {/* Propose 1.0 hr Swap Session */}
                  <button
                    onClick={() => onRequestSwapSession(activeSwapper)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-2xs inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Propose 1h Swap</span>
                  </button>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
                {/* Intro Exchange Banner */}
                <div className="max-w-md mx-auto text-center p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 shadow-2xs">
                  <span className="font-bold text-slate-900 block mb-0.5">
                    Peer Learning Exchange Connection
                  </span>
                  <span>
                    Gemini AI calculated a <strong className="text-teal-700">{activeSwapper.compatibilityScore}% Compatibility Score</strong> between your profiles.
                  </span>
                </div>

                {/* Messages Loop */}
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-xs text-slate-400">
                      No messages yet with {activeSwapper.name}. Click "Generate AI Ice-breaker" to draft an introductory proposal!
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md sm:max-w-lg rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                            isMe
                              ? 'bg-teal-600 text-white rounded-br-xs'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                          }`}
                        >
                          {msg.isAiGenerated && (
                            <div className="flex items-center space-x-1 text-[10px] font-semibold text-teal-200 mb-1">
                              <Sparkles className="w-3 h-3" />
                              <span>AI-Assisted Outreach</span>
                            </div>
                          )}
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                          {msg.timestamp}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-slate-200 bg-white">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${activeSwapper.name} or paste an AI icebreaker...`}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white shadow-2xs transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
              Select a swapper on the left to start collaborating.
            </div>
          )}
        </div>
      </div>

      {/* AI Icebreaker Modal / Drawer */}
      {showIcebreakerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-lg w-full shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Gemini AI Outreach Icebreakers
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Tailored for {activeSwapper?.name} based on mutual TimeBank reciprocity
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIcebreakerModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

            {isGeneratingIcebreaker ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-600 font-medium">
                  Gemini 3.8 Flash synthesizing profile synergies and drafting proposals...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  Select an AI-crafted opening message to paste into your chat:
                </p>
                {icebreakerOptions.map((option, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleUseIcebreaker(option)}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                        {idx === 0 ? 'Value-First Exchange' : idx === 1 ? 'Project-Oriented Pitch' : 'Community Learning'}
                      </span>
                      <span className="text-[10px] text-teal-700 font-bold group-hover:underline flex items-center space-x-0.5">
                        <span>Use</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      "{option}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
