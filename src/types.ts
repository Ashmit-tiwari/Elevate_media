/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AvatarConfig {
  gender?: string; // 'masculine' | 'feminine' | 'neutral'
  hairstyle: string;
  hairColor: string;
  skinTone: string;
  faceShape: string;
  eyes: string;
  eyebrows: string;
  nose: string;
  mouth: string;
  beard: string;
  glasses: string;
  clothing: string;
  shoes: string;
  accessories: string;
  background: string;
  animationPose: string;
}

export type CommunityType = 'city' | 'university' | 'company' | 'ngo' | 'club';

export interface Community {
  id: string;
  name: string;
  type: CommunityType;
  mission: string;
  membersCount: number;
  impactPoints: number;
  mood: number; // 0-100% positive mood
  stage: string; // e.g. Village, Town, Modern City, etc.
  achievements: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar: AvatarConfig;
  joinedCommunities: string[]; // Community IDs
  impactPoints: number;
  reflectionTreeStage: ReflectionTreeStage;
  unlockedCosmetics: string[]; // List of unlocked cosmetic item IDs
  cooldowns: { [receiverId: string]: string }; // Map of user ID to ISO timestamp of last interaction
}

export type ReflectionTreeStage =
  | 'Seed'
  | 'Sprout'
  | 'Sapling'
  | 'Young Tree'
  | 'Blooming Tree'
  | 'Golden Tree'
  | 'Forest Guardian';

export interface AppletEvent {
  id: string;
  title: string;
  orgId: string; // Community ID
  orgName: string;
  description: string;
  date: string;
  qrCodeUrl: string;
  participants: string[]; // User IDs
  isCompleted: boolean;
}

export interface Appreciation {
  id: string;
  receiverId: string;
  receiverName: string;
  qualities: string[]; // up to 3
  growthOpportunity: string; // constructive feedback
  eventId?: string; // optional event context
  date: string; // ISO String
}

export interface WeeklyReflection {
  id: string;
  userId: string;
  dateRange: string;
  interactionCount: number;
  topQualities: string[];
  topFeelings: string[];
  growthOpportunities: string[];
  pointsGained: number;
  treeStageBefore: ReflectionTreeStage;
  treeStageAfter: ReflectionTreeStage;
  aiSummary?: string;
}
