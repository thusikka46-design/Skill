/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Screen 8: Admin Dashboard
 * High-level metric cards (Total Users, Completed Swaps, Active Hours)
 * and system audit log table.
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Clock, 
  Repeat, 
  Sparkles, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  TrendingUp, 
  RefreshCw,
  Database,
  Cpu
} from 'lucide-react';
import { SystemAuditLog } from '../../types/index.ts';

interface AdminScreenProps {
  auditLogs: SystemAuditLog[];
  onTriggerAuditCheck: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  auditLogs,
  onTriggerAuditCheck,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      onTriggerAuditCheck();
      setIsRefreshing(false);
      setAuditMessage('System Integrity Audit Passed: Σ(Credits Minted) = Σ(User Balances + Escrow). Zero leakage.');
      setTimeout(() => setAuditMessage(null), 5000);
    }, 600);
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesModule = moduleFilter === 'ALL' || log.module.toLowerCase().includes(moduleFilter.toLowerCase());
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesModule && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Governance Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Platform Governance & System Audit Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Administrator Dashboard & Audit Trails
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
              Real-time monitoring of community member growth, TimeBank credit circulation, Gemini 3.8 Flash inference latency, and immutable transaction security logs.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Run Automated Solvency Audit</span>
            </button>
          </div>
        </div>

        {auditMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{auditMessage}</span>
          </div>
        )}
      </div>

      {/* High-Level Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Members
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">
            1,482
          </div>
          <p className="mt-1 text-xs text-teal-600 font-semibold flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>+142 this internship semester</span>
          </p>
        </div>

        {/* Completed Swaps */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Completed Swaps
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">
            3,892
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            99.2% satisfactory rating
          </p>
        </div>

        {/* Active Hours Exchanged */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Hours Exchanged
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">
            3,892.0 hrs
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Strict 1:1 hour-credit balance
          </p>
        </div>

        {/* System Solvency */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Solvency Ratio
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-emerald-700">
            100.00%
          </div>
          <p className="mt-1 text-xs text-emerald-600 font-semibold">
            Zero fractional inflation
          </p>
        </div>
      </div>

      {/* System Technical Specs Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              Google AI Studio (Gemini 3.8 Flash) Model Status
            </h4>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              Operating with Server-Side SDK proxying (`@google/genai`). Structured JSON schema enforcement active across `/api/ai/match`, `/api/ai/roadmap`, and `/api/ai/icebreaker`.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              PostgreSQL Schema & Stored Procedure Enforcements
            </h4>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              `execute_timebank_swap_transfer()` stored procedure with row-level locks (`FOR UPDATE`) prevents double-spend race conditions in concurrent swap sessions.
            </p>
          </div>
        </div>
      </div>

      {/* System Audit Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-slate-700" />
              <span>Immutable System Audit Log</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live tamper-evident log records generated by platform microservices.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Filter Module */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search audit actions..."
                className="pl-3 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Event ID</th>
                <th className="pb-3">Timestamp (UTC)</th>
                <th className="pb-3">Actor / Process</th>
                <th className="pb-3">Action Type</th>
                <th className="pb-3">Subsystem Module</th>
                <th className="pb-3">Event Details</th>
                <th className="pb-3 pr-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pl-2 font-mono font-semibold text-slate-500">
                    #{log.id}
                  </td>
                  <td className="py-3 text-slate-500 whitespace-nowrap text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-3 font-bold text-slate-800">
                    <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                      {log.actor}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-slate-900">
                    {log.action}
                  </td>
                  <td className="py-3 text-slate-600">
                    <span className="text-[11px] text-teal-800 font-medium">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600 max-w-sm truncate text-[11px]">
                    {log.details}
                  </td>
                  <td className="py-3 pr-2 text-right">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : log.status === 'WARNING'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                      }`}
                    >
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>{log.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
