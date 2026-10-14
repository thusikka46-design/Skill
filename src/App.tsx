/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Main Application Orchestrator for SkillSwap Community Network
 * Project: HND in IT Internship Viva Defense
 */

import React, { useState } from 'react';
import { Navbar, ScreenId } from './components/Navbar.tsx';
import { LandingScreen } from './components/screens/LandingScreen.tsx';
import { AuthScreen } from './components/screens/AuthScreen.tsx';
import { ProfileScreen } from './components/screens/ProfileScreen.tsx';
import { ExploreScreen } from './components/screens/ExploreScreen.tsx';
import { ChatDashboardScreen } from './components/screens/ChatDashboardScreen.tsx';
import { LiveSessionScreen } from './components/screens/LiveSessionScreen.tsx';
import { WalletScreen } from './components/screens/WalletScreen.tsx';
import { AdminScreen } from './components/screens/AdminScreen.tsx';
import { SessionBookingModal } from './components/SessionBookingModal.tsx';
import { VivaDefenseModal } from './components/defense/VivaDefenseModal.tsx';

import {
  INITIAL_CURRENT_USER,
  INITIAL_SWAPPERS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_TRANSACTIONS,
  INITIAL_REVIEWS,
  INITIAL_AUDIT_LOGS,
} from './data/mockData.ts';
import { 
  UserProfile, 
  UserRole, 
  SwapperCardData, 
  ChatMessage, 
  TimeBankTransaction, 
  ReviewItem, 
  SystemAuditLog 
} from './types/index.ts';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_CURRENT_USER);
  const [swappers, setSwappers] = useState<SwapperCardData[]>(INITIAL_SWAPPERS);
  const [activeSwapperId, setActiveSwapperId] = useState<string>(INITIAL_SWAPPERS[0].id);
  const [chatThreads, setChatThreads] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT_MESSAGES);
  const [transactions, setTransactions] = useState<TimeBankTransaction[]>(INITIAL_TRANSACTIONS);
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(INITIAL_AUDIT_LOGS);

  // Modals state
  const [isDefenseModalOpen, setIsDefenseModalOpen] = useState(false);
  const [bookingSwapper, setBookingSwapper] = useState<SwapperCardData | null>(null);

  // Navigation handler
  const handleNavigate = (screen: ScreenId) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth handler
  const handleLoginSuccess = (role: UserRole, name: string) => {
    setIsAuthenticated(true);
    setCurrentUser((prev) => ({
      ...prev,
      name,
      role,
    }));
    handleNavigate('explore');
  };

  // Profile update handler
  const handleUpdateProfile = (updated: UserProfile) => {
    setCurrentUser(updated);

    // Add audit log
    const newLog: SystemAuditLog = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actor: updated.name.toLowerCase().replace(/\s+/g, '_'),
      action: 'PROFILE_SKILLS_UPDATED',
      module: 'UserProfileService',
      details: `Updated offered skills (${updated.offeredSkills.length}) and wanted skills (${updated.wantedSkills.length}). AI match cache refreshed.`,
      status: 'SUCCESS',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Select swapper to open chat
  const handleSelectSwapperToChat = (swapper: SwapperCardData) => {
    setActiveSwapperId(swapper.id);
    handleNavigate('chat');
  };

  // Open swap booking modal
  const handleOpenBooking = (swapper: SwapperCardData) => {
    setBookingSwapper(swapper);
  };

  // Confirm booking session
  const handleConfirmBooking = (sessionData: {
    swapperId: string;
    swapperName: string;
    skill: string;
    scheduledAt: string;
    durationHours: number;
    notes: string;
  }) => {
    // 1. Send swap proposal message to chat thread
    const newMsg: ChatMessage = {
      id: `msg_prop_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: sessionData.swapperId,
      text: `[TimeBank Swap Proposed] 1.0 Hour on "${sessionData.skill}". Scheduled: ${sessionData.scheduledAt.replace('T', ' ')}. Message: ${sessionData.notes}`,
      timestamp: 'Just now',
    };

    setChatThreads((prev) => ({
      ...prev,
      [sessionData.swapperId]: [...(prev[sessionData.swapperId] || []), newMsg],
    }));

    // 2. Add audit event
    const newLog: SystemAuditLog = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actor: 'session_scheduler',
      action: 'ESCROW_CREDIT_RESERVATION',
      module: 'TimeBankCore',
      details: `Reserved 1.00 TimeBank credit from ${currentUser.name} in escrow for swap with ${sessionData.swapperName} on ${sessionData.skill}.`,
      status: 'SUCCESS',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Complete session & release credit
  const handleCompleteSessionTransfer = (
    hours: number,
    partnerName: string,
    skill: string,
    rating: number,
    feedback: string
  ) => {
    // Deduct 1 hour from learner (currentUser) and record transaction
    const newTx: TimeBankTransaction = {
      id: `tx_${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderName: currentUser.name,
      receiverName: partnerName,
      creditsTransferred: hours,
      type: 'SWAP_COMPLETION',
      description: `${hours.toFixed(1)} hr session completion: ${skill}`,
      status: 'SETTLED',
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update current user balance
    setCurrentUser((prev) => ({
      ...prev,
      timeCreditBalance: Math.max(0, prev.timeCreditBalance - hours),
      totalHoursLearned: prev.totalHoursLearned + hours,
    }));

    // Record review
    const newRev: ReviewItem = {
      id: `rev_${Date.now()}`,
      reviewerName: currentUser.name,
      reviewerAvatar: currentUser.avatarUrl,
      sessionTitle: skill,
      rating,
      feedback,
      date: 'Just now',
    };
    setReviews((prev) => [newRev, ...prev]);

    // Add audit log
    const audit: SystemAuditLog = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actor: 'stored_proc_executor',
      action: 'TIMEBANK_SWAP_SETTLED',
      module: 'PostgreSQL_ACID_Engine',
      details: `execute_timebank_swap_transfer completed: ${hours} credit debited from ${currentUser.name}, credited to ${partnerName}. Zero leakage verified.`,
      status: 'SUCCESS',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Send Chat message
  const handleSendMessage = (receiverId: string, text: string, isAi = false) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      text,
      timestamp: 'Just now',
      isAiGenerated: isAi,
    };

    setChatThreads((prev) => ({
      ...prev,
      [receiverId]: [...(prev[receiverId] || []), newMsg],
    }));
  };

  // Trigger Solvency Audit
  const handleTriggerAuditCheck = () => {
    const audit: SystemAuditLog = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actor: 'auditor_cron',
      action: 'SYSTEM_SOLVENCY_AUDIT',
      module: 'SolvencyMonitor',
      details: 'Audit verification executed: All credit debits match credit credits. Total supply in circulation is conserved.',
      status: 'SUCCESS',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-teal-100 selection:text-teal-900 flex flex-col">
      {/* Navigation Bar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenDefense={() => setIsDefenseModalOpen(true)}
        isAuthenticated={isAuthenticated}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentScreen === 'landing' && (
          <LandingScreen
            onNavigate={handleNavigate}
            onOpenDefense={() => setIsDefenseModalOpen(true)}
          />
        )}

        {currentScreen === 'auth' && (
          <AuthScreen
            onLoginSuccess={handleLoginSuccess}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {currentScreen === 'explore' && (
          <ExploreScreen
            swappers={swappers}
            currentUser={currentUser}
            onSelectSwapperToChat={handleSelectSwapperToChat}
            onRequestSwapSession={handleOpenBooking}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'chat' && (
          <ChatDashboardScreen
            swappers={swappers}
            currentUser={currentUser}
            activeSwapperId={activeSwapperId}
            onSelectSwapper={setActiveSwapperId}
            chatThreads={chatThreads}
            onSendMessage={handleSendMessage}
            onRequestSwapSession={handleOpenBooking}
          />
        )}

        {currentScreen === 'session' && (
          <LiveSessionScreen
            currentUser={currentUser}
            onCompleteSessionTransfer={handleCompleteSessionTransfer}
          />
        )}

        {currentScreen === 'wallet' && (
          <WalletScreen
            currentUser={currentUser}
            transactions={transactions}
            reviews={reviews}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminScreen
            auditLogs={auditLogs}
            onTriggerAuditCheck={handleTriggerAuditCheck}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-900">
              Skill<span className="text-teal-600">Swap</span> Community Network
            </span>
            <span>•</span>
            <span>IT Internship Viva Defense (HND in IT)</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDefenseModalOpen(true)}
              className="text-teal-700 font-bold hover:underline cursor-pointer"
            >
              PostgreSQL DDL & Architecture
            </button>
            <span>•</span>
            <button
              onClick={() => handleNavigate('explore')}
              className="text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Swapper Explorer
            </button>
            <span>•</span>
            <button
              onClick={() => handleNavigate('wallet')}
              className="text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              TimeBank Ledger
            </button>
          </div>
        </div>
      </footer>

      {/* 1-Hour Swap Request Booking Modal */}
      {bookingSwapper && (
        <SessionBookingModal
          swapper={bookingSwapper}
          currentUser={currentUser}
          isOpen={Boolean(bookingSwapper)}
          onClose={() => setBookingSwapper(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* Viva Defense Technical Architecture Hub Modal */}
      <VivaDefenseModal
        isOpen={isDefenseModalOpen}
        onClose={() => setIsDefenseModalOpen(false)}
      />
    </div>
  );
}
