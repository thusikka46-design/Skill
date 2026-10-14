/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TypeScript Domain Definitions for SkillSwap Community Network
 */

export type UserRole = 'LEARNER' | 'MENTOR' | 'BOTH' | 'ADMIN';
export type SkillType = 'OFFERED' | 'WANTED';
export type ProficiencyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type SwapStatus = 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
export type SessionStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TransactionType = 'SWAP_COMPLETION' | 'SIGNUP_BONUS' | 'ADMIN_ADJUSTMENT' | 'DISPUTE_REFUND';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  headline: string;
  bio: string;
  timeCreditBalance: number;
  averageRating: number;
  totalHoursTaught: number;
  totalHoursLearned: number;
  avatarUrl: string;
  offeredSkills: string[];
  wantedSkills: string[];
  availability: string;
  location: string;
}

export interface SwapperCardData {
  id: string;
  name: string;
  role: UserRole;
  headline: string;
  bio: string;
  avatarUrl: string;
  rating: number;
  reviewCount: number;
  timeCreditBalance: number;
  offeredSkills: string[];
  wantedSkills: string[];
  compatibilityScore: number;
  compatibilityReasoning: string;
  category: string;
  isOnline: boolean;
  hoursTaught: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isAiGenerated?: boolean;
}

export interface RoadmapDay {
  day: number;
  topic: string;
  focus_areas: string[];
  completed?: boolean;
}

export interface TimeBankTransaction {
  id: string;
  timestamp: string;
  senderName: string;
  receiverName: string;
  creditsTransferred: number;
  type: TransactionType;
  description: string;
  status: 'SETTLED' | 'PENDING';
}

export interface ReviewItem {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  sessionTitle: string;
  rating: number;
  feedback: string;
  date: string;
}

export interface SwapSession {
  id: string;
  partnerName: string;
  partnerAvatar: string;
  skillName: string;
  scheduledAt: string;
  durationHours: number;
  status: SessionStatus;
  meetingLink: string;
  role: 'TEACHING' | 'LEARNING';
  roadmap: RoadmapDay[];
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  module: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'INFO';
}
