/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Screen 7: TimeBank Wallet & Activity Tracker
 * Time credit balance card ("3.0 Credits Available"), transaction ledger table,
 * past swaps, and feedback/ratings.
 */

import React, { useState } from 'react';
import { 
  Wallet, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  Layers, 
  Download, 
  TrendingUp, 
  Repeat, 
  Award,
  Sparkles
} from 'lucide-react';
import { UserProfile, TimeBankTransaction, ReviewItem } from '../../types/index.ts';

interface WalletScreenProps {
  currentUser: UserProfile;
  transactions: TimeBankTransaction[];
  reviews: ReviewItem[];
}

export const WalletScreen: React.FC<WalletScreenProps> = ({
  currentUser,
  transactions,
  reviews,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'EARNED') return tx.receiverName.includes(currentUser.name);
    if (filterType === 'SPENT') return tx.senderName.includes(currentUser.name);
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Economic Principle */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 mb-2">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>TimeBank Non-Monetary Currency System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              TimeBank Wallet & Transaction Ledger
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
              Strict 1 Hour Taught = 1 Time Credit Earned. Currency is non-inflationary, zero-speculation, and backed strictly by verified human mentorship hours.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>ACID Ledger Synced</span>
            </span>
          </div>
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-3xl p-6 sm:p-7 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">
              Total Available Balance
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight">
              {currentUser.timeCreditBalance.toFixed(1)}
            </span>
            <span className="text-sm font-bold text-teal-100 uppercase">
              Time Credits
            </span>
          </div>

          <p className="mt-2 text-xs text-teal-100/90 font-medium">
            Entitles you to {currentUser.timeCreditBalance.toFixed(1)} hour(s) of peer instruction with any community mentor.
          </p>

          <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-teal-100 font-semibold">
            <span>Egalitarian Parity:</span>
            <span>1 Credit = 1 Hour Taught</span>
          </div>
        </div>

        {/* Total Hours Taught Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Hours Taught (Credits Earned)
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">
              +{currentUser.totalHoursTaught.toFixed(1)} hrs
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Accumulated by teaching React, UI Design & APIs to cohort peers.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-bold">
            <span className="flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Mentorship Contributions</span>
            </span>
            <span>100% Verified</span>
          </div>
        </div>

        {/* Total Hours Learned Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Hours Learned (Credits Spent)
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">
              {currentUser.totalHoursLearned.toFixed(1)} hrs
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Invested in Python Data Science, Machine Learning & DevOps.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-bold">
            <span className="flex items-center space-x-1">
              <Repeat className="w-3.5 h-3.5" />
              <span>Skill Acquisition Ratio</span>
            </span>
            <span>Balanced Solvency</span>
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Audit-Trail Transaction Ledger
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Every credit movement is immutably recorded with sender, receiver, and exchange reason.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            {['ALL', 'EARNED', 'SPENT'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === type
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Transaction ID</th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Sender / Debited</th>
                <th className="pb-3">Receiver / Credited</th>
                <th className="pb-3">Description</th>
                <th className="pb-3 text-right">Credits Transferred</th>
                <th className="pb-3 pr-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => {
                const isEarned = tx.receiverName.includes(currentUser.name);
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pl-2 font-mono font-semibold text-slate-600">
                      #{tx.id}
                    </td>
                    <td className="py-3.5 text-slate-500 whitespace-nowrap">
                      {tx.timestamp}
                    </td>
                    <td className="py-3.5 font-bold text-slate-800">
                      {tx.senderName}
                    </td>
                    <td className="py-3.5 font-bold text-slate-800">
                      {tx.receiverName}
                    </td>
                    <td className="py-3.5 text-slate-600 max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="py-3.5 text-right font-extrabold whitespace-nowrap">
                      <span
                        className={
                          isEarned ? 'text-emerald-600 font-bold' : 'text-slate-900 font-bold'
                        }
                      >
                        {isEarned ? `+${tx.creditsTransferred.toFixed(1)}` : `-${tx.creditsTransferred.toFixed(1)}`} Credits
                      </span>
                    </td>
                    <td className="py-3.5 pr-2 text-right">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{tx.status}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Peer Reviews & Community Feedback Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Peer Ratings & Endorsements Received</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified evaluations logged at the conclusion of each 1-hour swap session.
            </p>
          </div>
          <div className="flex items-center space-x-1 text-sm font-extrabold text-slate-900">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{currentUser.averageRating.toFixed(1)}</span>
            <span className="text-xs text-slate-400 font-normal">/ 5.0 Rating</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={rev.reviewerAvatar}
                      alt={rev.reviewerName}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {rev.reviewerName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {rev.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-0.5 text-xs text-amber-600 font-bold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{rev.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="text-[11px] font-bold text-teal-800 mb-1">
                  Session: {rev.sessionTitle}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{rev.feedback}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>Verified TimeBank Exchange</span>
                <span className="text-emerald-600 font-semibold">1.0 Credit Signed Off</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
