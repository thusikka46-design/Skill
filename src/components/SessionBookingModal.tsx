/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive 1-Hour TimeBank Session Booking Modal
 */

import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Video, 
  ArrowRight 
} from 'lucide-react';
import { SwapperCardData, UserProfile } from '../types/index.ts';

interface SessionBookingModalProps {
  swapper: SwapperCardData;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (sessionData: {
    swapperId: string;
    swapperName: string;
    skill: string;
    scheduledAt: string;
    durationHours: number;
    notes: string;
  }) => void;
}

export const SessionBookingModal: React.FC<SessionBookingModalProps> = ({
  swapper,
  currentUser,
  isOpen,
  onClose,
  onConfirmBooking,
}) => {
  if (!isOpen) return null;

  const [selectedSkill, setSelectedSkill] = useState(swapper.offeredSkills[0] || 'Technical Mentorship');
  const [scheduledDate, setScheduledDate] = useState('2026-10-16T18:00');
  const [notes, setNotes] = useState(`Hi ${swapper.name}, I would like to schedule our 1-hour swap on ${selectedSkill}. I have 1.0 TimeBank credit ready.`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const durationHours = 1.0;
  const hasSufficientCredits = currentUser.timeCreditBalance >= durationHours;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasSufficientCredits) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      onConfirmBooking({
        swapperId: swapper.id,
        swapperName: swapper.name,
        skill: selectedSkill,
        scheduledAt: scheduledDate,
        durationHours,
        notes,
      });
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 max-w-lg w-full shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <img
            src={swapper.avatarUrl}
            alt={swapper.name}
            className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
          />
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Request 1-Hour Swap with {swapper.name}
            </h3>
            <p className="text-xs text-slate-500">
              Compatibility: <strong className="text-teal-700">{swapper.compatibilityScore}%</strong> • Rate: 1.0 Credit / Hour
            </p>
          </div>
        </div>

        {success ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-2">
            <Check className="w-8 h-8 text-emerald-600 mx-auto" />
            <div className="font-extrabold text-base">Swap Request Submitted!</div>
            <p className="text-xs text-emerald-800">
              1.0 Time Credit placed into escrow. Session scheduled with {swapper.name}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Skill to Learn */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Skill to Learn
              </label>
              <select
                value={selectedSkill}
                onChange={(e) => {
                  setSelectedSkill(e.target.value);
                  setNotes(`Hi ${swapper.name}, I would like to schedule our 1-hour swap on ${e.target.value}. I have 1.0 TimeBank credit ready.`);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 bg-white"
              >
                {swapper.offeredSkills.map((sk) => (
                  <option key={sk} value={sk}>
                    {sk}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Proposed Date & Time
              </label>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 bg-white"
              />
            </div>

            {/* Notes / Message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Outreach Message / Learning Objectives
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-600 leading-relaxed"
              />
            </div>

            {/* Credit Escrow Summary Box */}
            <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span>Time Credit Escrow:</span>
                <span>1.0 Credit ({durationHours} hr)</span>
              </div>
              <div className="flex items-center justify-between text-teal-800 text-[11px]">
                <span>Your Available Balance:</span>
                <span>{currentUser.timeCreditBalance.toFixed(1)} Credits</span>
              </div>
              {!hasSufficientCredits && (
                <div className="text-red-600 font-bold text-[11px] pt-1">
                  Insufficient TimeBank balance. Teach a 1-hour session first to earn credits!
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!hasSufficientCredits || isSubmitting}
                className="py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-2xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Securing Escrow...</span>
                ) : (
                  <>
                    <span>Confirm & Lock 1.0 Credit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
