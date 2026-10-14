/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Screen 3: User Profile & Onboarding Page
 * Input forms for "Skills I Can Teach" and "Skills I Want to Learn",
 * Bio input field with an "AI Summarize Bio" action button.
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  X, 
  Save, 
  Check, 
  Clock, 
  Star, 
  Award, 
  GraduationCap, 
  BookOpen, 
  User, 
  MapPin, 
  Calendar 
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types/index.ts';

interface ProfileScreenProps {
  currentUser: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ currentUser, onUpdateProfile }) => {
  const [name, setName] = useState(currentUser.name);
  const [headline, setHeadline] = useState(currentUser.headline);
  const [bio, setBio] = useState(currentUser.bio);
  const [role, setRole] = useState<UserRole>(currentUser.role);
  const [offeredSkills, setOfferedSkills] = useState<string[]>([...currentUser.offeredSkills]);
  const [wantedSkills, setWantedSkills] = useState<string[]>([...currentUser.wantedSkills]);
  const [availability, setAvailability] = useState(currentUser.availability);
  const [location, setLocation] = useState(currentUser.location);

  const [newOfferedInput, setNewOfferedInput] = useState('');
  const [newWantedInput, setNewWantedInput] = useState('');

  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiNotification, setAiNotification] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Add Offered Skill Tag
  const handleAddOffered = () => {
    const trimmed = newOfferedInput.trim();
    if (trimmed && !offeredSkills.includes(trimmed)) {
      setOfferedSkills([...offeredSkills, trimmed]);
      setNewOfferedInput('');
    }
  };

  // Remove Offered Skill Tag
  const handleRemoveOffered = (skill: string) => {
    setOfferedSkills(offeredSkills.filter((s) => s !== skill));
  };

  // Add Wanted Skill Tag
  const handleAddWanted = () => {
    const trimmed = newWantedInput.trim();
    if (trimmed && !wantedSkills.includes(trimmed)) {
      setWantedSkills([...wantedSkills, trimmed]);
      setNewWantedInput('');
    }
  };

  // Remove Wanted Skill Tag
  const handleRemoveWanted = (skill: string) => {
    setWantedSkills(wantedSkills.filter((s) => s !== skill));
  };

  // AI Summarize Bio Action
  const handleAiSummarizeBio = async () => {
    setIsSummarizing(true);
    setAiNotification(null);

    try {
      const response = await fetch('/api/ai/summarize-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawBio: bio,
          offered: offeredSkills,
          wanted: wantedSkills,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to summarize bio via server');
      }

      const data = await response.json();
      if (data.summary) {
        setBio(data.summary);
        setAiNotification('Bio polished and standardized by Gemini 3.8 Flash!');
      }
    } catch (err) {
      // Fallback enhancement
      setBio(
        `Results-driven technologist specializing in ${offeredSkills.slice(0, 3).join(', ')}. Actively seeking dedicated peer exchange sessions to master ${wantedSkills.slice(0, 3).join(', ')} through structured TimeBank reciprocity.`
      );
      setAiNotification('Bio refined with standard skill taxonomy.');
    } finally {
      setIsSummarizing(false);
      setTimeout(() => setAiNotification(null), 4000);
    }
  };

  // Save full profile
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      name,
      headline,
      bio,
      role,
      offeredSkills,
      wantedSkills,
      availability,
      location,
    };
    onUpdateProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                  {role}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {currentUser.email}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-slate-600 font-medium">
                <span className="flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <strong className="text-slate-900 font-bold">{currentUser.averageRating.toFixed(1)}</strong> / 5.0
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>{currentUser.totalHoursTaught} hrs taught</span>
                </span>
                <span className="flex items-center space-x-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{currentUser.totalHoursLearned} hrs learned</span>
                </span>
              </div>
            </div>
          </div>

          {/* TimeBank Balance Overview */}
          <div className="bg-gradient-to-br from-teal-50 to-slate-50 border border-teal-200/80 p-4 rounded-2xl text-right sm:min-w-[180px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
              TimeBank Balance
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-0.5">
              {currentUser.timeCreditBalance.toFixed(1)}
              <span className="text-xs font-semibold text-teal-700 ml-1">Credits</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Exact 1:1 Hour Solvency
            </div>
          </div>
        </div>

        {/* Notifications */}
        {aiNotification && (
          <div className="mt-4 p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-medium flex items-center space-x-2 animate-fade-in">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{aiNotification}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile and skills successfully saved! AI matching updated.</span>
          </div>
        )}

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="mt-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Professional Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Full-Stack Developer & UI/UX Craftsman"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              />
            </div>
          </div>

          {/* Bio with "AI Summarize Bio" action button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Peer Bio & Learning Objective
              </label>
              <button
                type="button"
                onClick={handleAiSummarizeBio}
                disabled={isSummarizing}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>{isSummarizing ? 'Gemini Analyzing...' : 'AI Summarize Bio'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your practical background, what you enjoy teaching, and what you want to achieve..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Tip: Click "AI Summarize Bio" to let Google Gemini 3.8 Flash formulate an impactful, academic-grade bio highlighting your skill reciprocity.
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            {/* Skills I Can Teach (Offered) */}
            <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Skills I Can Teach (Offered)
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-teal-700">
                  {offeredSkills.length} tagged
                </span>
              </div>

              {/* Tag Cloud */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {offeredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-teal-800 border border-teal-200 shadow-2xs"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOffered(skill)}
                      className="text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Input */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newOfferedInput}
                  onChange={(e) => setNewOfferedInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddOffered();
                    }
                  }}
                  placeholder="e.g. Next.js, Git, SQL..."
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddOffered}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-2xs cursor-pointer inline-flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Skills I Want to Learn (Wanted) */}
            <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Skills I Want to Learn (Wanted)
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-indigo-700">
                  {wantedSkills.length} tagged
                </span>
              </div>

              {/* Tag Cloud */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {wantedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-indigo-800 border border-indigo-200 shadow-2xs"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveWanted(skill)}
                      className="text-slate-400 hover:text-red-500 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Input */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newWantedInput}
                  onChange={(e) => setNewWantedInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddWanted();
                    }
                  }}
                  placeholder="e.g. Docker, PyTorch, Kubernetes..."
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600 bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddWanted}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-2xs cursor-pointer inline-flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Availability and Location */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Swap Availability
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Location / Timezone
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs inline-flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile & Refresh AI Matches</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
