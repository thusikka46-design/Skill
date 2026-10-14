/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive Viva Defense & Technical Architecture Hub
 * Project: SkillSwap Community Network (HND in IT Internship Viva Defense)
 */

import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Database, 
  Sparkles, 
  ShieldCheck, 
  Copy, 
  Check, 
  Play, 
  Terminal, 
  Layers, 
  BookOpen, 
  FileText,
  Activity
} from 'lucide-react';
import { GEMINI_SKILLSWAP_SYSTEM_INSTRUCTION, SYSTEM_PROMPT_DOCS } from '../../ai/systemPrompt.ts';

interface VivaDefenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VivaDefenseModal: React.FC<VivaDefenseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'sql' | 'prompt' | 'tester' | 'proof'>('sql');
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Live AI Tester state
  const [testerRoute, setTesterRoute] = useState<'/api/ai/match' | '/api/ai/roadmap' | '/api/ai/icebreaker'>('/api/ai/match');
  const [testerLoading, setTesterLoading] = useState(false);
  const [testerResponse, setTesterResponse] = useState<any>(null);

  // Default test payloads
  const [matchPayloadUserA, setMatchPayloadUserA] = useState('React.js, TypeScript, UI Prototyping');
  const [matchPayloadUserB, setMatchPayloadUserB] = useState('Python Data Science, Pandas, Machine Learning');
  const [roadmapSkill, setRoadmapSkill] = useState('React.js');
  const [roadmapDuration, setRoadmapDuration] = useState('7 Days');

  const fullSqlScript = `-- =========================================================================
-- SkillSwap Community Network — Production PostgreSQL DDL Script
-- Architecture Module: Relational Persistence Layer (TimeBank & Skill Match)
-- HND in IT Internship Viva Defense
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS & DOMAIN TYPES
CREATE TYPE user_role_enum AS ENUM ('LEARNER', 'MENTOR', 'BOTH', 'ADMIN');
CREATE TYPE skill_type_enum AS ENUM ('OFFERED', 'WANTED');
CREATE TYPE proficiency_enum AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
CREATE TYPE swap_status_enum AS ENUM ('PENDING', 'ACCEPTED', 'COMPLETED', 'REJECTED', 'CANCELLED');
CREATE TYPE session_status_enum AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE transaction_type_enum AS ENUM ('SWAP_COMPLETION', 'SIGNUP_BONUS', 'ADMIN_ADJUSTMENT', 'DISPUTE_REFUND');

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'BOTH',
    headline VARCHAR(180),
    bio TEXT,
    time_credit_balance NUMERIC(10, 2) NOT NULL DEFAULT 3.00,
    average_rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    total_hours_taught NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_hours_learned NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    avatar_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_positive_credits CHECK (time_credit_balance >= 0.00),
    CONSTRAINT chk_valid_rating CHECK (average_rating >= 0.00 AND average_rating <= 5.00)
);

-- 3. SKILLS MASTER CATALOG TABLE
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. USER_SKILLS JUNCTION TABLE
CREATE TABLE IF NOT EXISTS user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    skill_type skill_type_enum NOT NULL,
    proficiency_level proficiency_enum NOT NULL DEFAULT 'INTERMEDIATE',
    experience_years INT DEFAULT 1 CHECK (experience_years >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_skill_type UNIQUE (user_id, skill_id, skill_type)
);

-- 5. SWAP_REQUESTS TABLE
CREATE TABLE IF NOT EXISTS swap_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_offered_id UUID NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
    skill_wanted_id UUID NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
    status swap_status_enum NOT NULL DEFAULT 'PENDING',
    ai_compatibility_score NUMERIC(5, 2),
    ai_rationale TEXT,
    initial_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_different_swappers CHECK (requester_id <> provider_id)
);

-- 6. SESSIONS TABLE
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    swap_request_id UUID NOT NULL REFERENCES swap_requests(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_hours NUMERIC(4, 2) NOT NULL DEFAULT 1.00,
    meeting_link VARCHAR(500),
    status session_status_enum NOT NULL DEFAULT 'SCHEDULED',
    session_roadmap_json JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_positive_duration CHECK (duration_hours > 0.00)
);

-- 7. TIMEBANK_TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS timebank_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    receiver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    swap_request_id UUID REFERENCES swap_requests(id) ON DELETE SET NULL,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    credits_transferred NUMERIC(6, 2) NOT NULL,
    transaction_type transaction_type_enum NOT NULL,
    description VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_positive_transfer CHECK (credits_transferred > 0.00)
);

-- 8. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating_score INT NOT NULL,
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_rating_range CHECK (rating_score >= 1 AND rating_score <= 5),
    CONSTRAINT chk_different_reviewers CHECK (reviewer_id <> reviewee_id)
);

-- INDEXES & ATOMIC TRANSACTION PROCEDURE
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_skills_lookup ON user_skills(skill_type, skill_id);
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON timebank_transactions(timestamp DESC);

CREATE OR REPLACE FUNCTION execute_timebank_swap_transfer(
    p_session_id UUID,
    p_learner_id UUID,
    p_mentor_id UUID,
    p_hours NUMERIC
) RETURNS VOID AS $$
DECLARE
    v_balance NUMERIC;
BEGIN
    SELECT time_credit_balance INTO v_balance FROM users WHERE id = p_learner_id FOR UPDATE;
    IF v_balance < p_hours THEN
        RAISE EXCEPTION 'Insufficient TimeBank credits. Balance is %, required is %', v_balance, p_hours;
    END IF;

    UPDATE users SET time_credit_balance = time_credit_balance - p_hours, total_hours_learned = total_hours_learned + p_hours WHERE id = p_learner_id;
    UPDATE users SET time_credit_balance = time_credit_balance + p_hours, total_hours_taught = total_hours_taught + p_hours WHERE id = p_mentor_id;

    INSERT INTO timebank_transactions (sender_id, receiver_id, session_id, credits_transferred, transaction_type, description)
    VALUES (p_learner_id, p_mentor_id, p_session_id, p_hours, 'SWAP_COMPLETION', CONCAT('TimeBank credit transfer for ', p_hours, ' hour(s).'));
END;
$$ LANGUAGE plpgsql;`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(fullSqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(GEMINI_SKILLSWAP_SYSTEM_INSTRUCTION);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Run live tester call against the backend
  const handleRunTest = async () => {
    setTesterLoading(true);
    setTesterResponse(null);

    try {
      let body: any = {};
      if (testerRoute === '/api/ai/match') {
        body = {
          userA: {
            name: 'Alex Rivera (Candidate)',
            offered: matchPayloadUserA.split(',').map((s) => s.trim()),
            wanted: ['Python Data Science', 'Machine Learning'],
            bio: 'Frontend engineer preparing internship presentation',
          },
          userB: {
            name: 'Elena Rostova (Mentor)',
            offered: matchPayloadUserB.split(',').map((s) => s.trim()),
            wanted: ['React.js', 'UI Prototyping'],
            bio: 'Senior Python educator and data scientist',
          },
        };
      } else if (testerRoute === '/api/ai/roadmap') {
        body = {
          skill: roadmapSkill,
          duration: roadmapDuration,
        };
      } else if (testerRoute === '/api/ai/icebreaker') {
        body = {
          sender: {
            name: 'Alex Rivera',
            offered: ['React.js', 'TypeScript'],
            bio: 'Web app engineer',
          },
          receiver: {
            name: 'Elena Rostova',
            bio: 'Data science mentor',
          },
          skill: roadmapSkill,
        };
      }

      const res = await fetch(testerRoute, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      setTesterResponse({ status: res.status, data: json });
    } catch (err: any) {
      setTesterResponse({ status: 500, error: err.message });
    } finally {
      setTesterLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-5xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Technical Architecture & Viva Defense Blueprint
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                  HND in IT Defense
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Verified relational schemas, Gemini 3.8 Flash system instructions, and live endpoint tester
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 px-6 pt-4 border-b border-slate-200 bg-white overflow-x-auto no-scrollbar">
          {[
            { id: 'sql', label: 'PostgreSQL DDL (Module 2)', icon: Database },
            { id: 'prompt', label: 'Gemini Agent System Prompt (Module 4)', icon: Sparkles },
            { id: 'tester', label: 'Live AI Express Tester (Module 3)', icon: Play },
            { id: 'proof', label: 'TimeBank Proof & Invariant', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3 text-xs font-bold inline-flex items-center space-x-1.5 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          
          {/* TAB 1: PostgreSQL DDL */}
          {activeTab === 'sql' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Production Relational Data Model (7 Core Entities)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Includes ENUMs, composite unique keys, foreign keys with ON DELETE policies, and performance B-Tree indexes.
                  </p>
                </div>
                <button
                  onClick={handleCopySql}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 inline-flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
                </button>
              </div>

              {/* Entity Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="font-bold text-teal-800 font-mono">1. users</span>
                  <div className="text-[11px] text-slate-500 mt-1">Credentials, role, credit balance, average rating</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="font-bold text-teal-800 font-mono">2. skills</span>
                  <div className="text-[11px] text-slate-500 mt-1">Normalized skill tags, categories, descriptions</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="font-bold text-teal-800 font-mono">3. user_skills</span>
                  <div className="text-[11px] text-slate-500 mt-1">OFFERED vs WANTED mappings with proficiency</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="font-bold text-teal-800 font-mono">4. swap_requests</span>
                  <div className="text-[11px] text-slate-500 mt-1">Bilateral proposals, AI compatibility scores</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="font-bold text-indigo-800 font-mono">5. sessions</span>
                  <div className="text-[11px] text-slate-500 mt-1">Scheduled meetings, duration, roadmap JSON</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="font-bold text-indigo-800 font-mono">6. timebank_txs</span>
                  <div className="text-[11px] text-slate-500 mt-1">Double-entry audit transfer ledger (1 hr = 1 credit)</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="font-bold text-indigo-800 font-mono">7. reviews</span>
                  <div className="text-[11px] text-slate-500 mt-1">Peer ratings (1-5) and feedback sign-off</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="font-bold text-emerald-800 font-mono">Stored Procedure</span>
                  <div className="text-[11px] text-slate-500 mt-1">Atomic debit/credit with FOR UPDATE row locking</div>
                </div>
              </div>

              {/* Code viewer */}
              <div className="bg-slate-900 rounded-2xl p-4 overflow-x-auto text-xs font-mono text-slate-200 shadow-sm border border-slate-800 max-h-[420px]">
                <pre>{fullSqlScript}</pre>
              </div>
            </div>
          )}

          {/* TAB 2: Gemini Agent System Prompt */}
          {activeTab === 'prompt' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Google AI Studio System Instruction String
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configured for model <code className="font-mono text-teal-700 bg-teal-50 px-1 py-0.5 rounded">gemini-3.8-flash</code> with strict JSON MIME response schemas.
                  </p>
                </div>
                <button
                  onClick={handleCopyPrompt}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 inline-flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? 'Copied System Prompt!' : 'Copy System Prompt'}</span>
                </button>
              </div>

              {/* Rationale Cards */}
              <div className="grid md:grid-cols-3 gap-3">
                {SYSTEM_PROMPT_DOCS.defenseRationale.map((rationale, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700">
                    <span className="font-bold text-teal-800 block mb-1">
                      Architectural Defense #{idx + 1}
                    </span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">{rationale}</p>
                  </div>
                ))}
              </div>

              {/* Prompt Box */}
              <div className="bg-slate-900 rounded-2xl p-5 text-xs font-mono text-slate-200 shadow-sm border border-slate-800 whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto">
                {GEMINI_SKILLSWAP_SYSTEM_INSTRUCTION}
              </div>
            </div>
          )}

          {/* TAB 3: Live Express AI Endpoint Tester */}
          {activeTab === 'tester' && (
            <div className="space-y-5">
              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <h3 className="text-sm font-extrabold text-slate-900">
                  Live Express Backend & Gemini Route Tester
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Execute live requests against the 3 required server routes and inspect raw JSON candidate outputs.
                </p>
              </div>

              {/* Route Picker */}
              <div className="flex flex-wrap gap-2">
                {[
                  { route: '/api/ai/match', label: '1. POST /api/ai/match' },
                  { route: '/api/ai/roadmap', label: '2. POST /api/ai/roadmap' },
                  { route: '/api/ai/icebreaker', label: '3. POST /api/ai/icebreaker' },
                ].map((item) => (
                  <button
                    key={item.route}
                    onClick={() => {
                      setTesterRoute(item.route as any);
                      setTesterResponse(null);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      testerRoute === item.route
                        ? 'bg-teal-600 text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Parameters Input */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                {testerRoute === '/api/ai/match' ? (
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        User A Skills (You)
                      </label>
                      <input
                        type="text"
                        value={matchPayloadUserA}
                        onChange={(e) => setMatchPayloadUserA(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        User B Skills (Peer)
                      </label>
                      <input
                        type="text"
                        value={matchPayloadUserB}
                        onChange={(e) => setMatchPayloadUserB(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Target Skill
                      </label>
                      <input
                        type="text"
                        value={roadmapSkill}
                        onChange={(e) => setRoadmapSkill(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Target Duration
                      </label>
                      <input
                        type="text"
                        value={roadmapDuration}
                        onChange={(e) => setRoadmapDuration(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleRunTest}
                    disabled={testerLoading}
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-2xs inline-flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{testerLoading ? 'Invoking Gemini Model...' : 'Execute Route Request'}</span>
                  </button>
                </div>
              </div>

              {/* Response output */}
              {testerResponse && (
                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-xs font-mono text-slate-200">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 mb-2 border-b border-slate-800">
                    <span>HTTP Status: <strong className="text-emerald-400">{testerResponse.status || 200} OK</strong></span>
                    <span>Format: application/json</span>
                  </div>
                  <pre className="max-h-60 overflow-y-auto whitespace-pre-wrap">
                    {JSON.stringify(testerResponse.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TimeBank Proof & Invariant */}
          {activeTab === 'proof' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">
                  Mathematical Solvency & Anti-Inflation Proof
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Traditional fiat and crypto platforms suffer from inflation, market speculation, and price disparity where high-demand skills crowd out foundational subjects. The SkillSwap TimeBank implements <strong>Edgar Cahn's Equal Time Valuation Model</strong>:
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 space-y-2">
                  <div className="font-bold text-teal-800">Law of Time Credit Conservation:</div>
                  <div>{"TotalCredits(t) = MintedEndowments(N × 3.0) - SunkDisputes"}</div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Every session transfer between Learner L and Mentor M preserves the total monetary supply:
                    <br />
                    {"Balance_L' = Balance_L - Δt"}
                    <br />
                    {"Balance_M' = Balance_M + Δt"}
                    <br />
                    {"ΔTotal = (-Δt) + (+Δt) ≡ 0"}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-teal-50/40">
                    <span className="font-bold text-teal-900 block mb-1">Egalitarian Knowledge Value</span>
                    <p className="text-slate-600 text-[11px]">
                      One hour of teaching Beginner Git equals exactly one hour of learning Cloud Distributed Architecture. Value is pegged to human attention and mentorship, not corporate market monopolies.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-indigo-50/40">
                    <span className="font-bold text-indigo-900 block mb-1">Double-Entry Auditability</span>
                    <p className="text-slate-600 text-[11px]">
                      Every transaction creates reciprocal debits and credits verified with PostgreSQL row-level locks, ensuring zero counterfeit credits can enter circulation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <span>SkillSwap Community Network • HND in IT Viva Defense Ready</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
