/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Community, UserProfile, AppletEvent, ReflectionTreeStage } from './types';

export const POSITIVE_QUALITIES = [
  'Helpful',
  'Respectful',
  'Creative',
  'Honest',
  'Leader',
  'Good Listener',
  'Motivating',
  'Calm',
  'Patient',
  'Team Player',
  'Supportive',
  'Professional',
  'Friendly',
  'Innovative',
  'Problem Solver',
];

export const GROWTH_OPPORTUNITIES = [
  'Communication',
  'Confidence',
  'Listening',
  'Leadership',
  'Planning',
  'Time Management',
  'Collaboration',
  'Decision Making',
  'Public Speaking',
];

export const REFLECTION_TREE_STAGES: ReflectionTreeStage[] = [
  'Seed',
  'Sprout',
  'Sapling',
  'Young Tree',
  'Blooming Tree',
  'Golden Tree',
  'Forest Guardian',
];

export const TREE_DESCRIPTIONS: { [key in ReflectionTreeStage]: string } = {
  'Seed': 'A tiny spark of potential. Ready to absorb kindness and positive interactions.',
  'Sprout': 'First leaves appear. Your helpfulness and patience have nourished your growth.',
  'Sapling': 'A sturdy stalk. You are becoming a reliable contributor in your circle.',
  'Young Tree': 'Deep roots and spreading branches. Your supportive actions lift those around you.',
  'Blooming Tree': 'Lush flowers unfold. Your leadership and creativity inspire entire communities.',
  'Golden Tree': 'Glistening with positive energy. A symbol of wisdom, integrity, and daily care.',
  'Forest Guardian': 'A majestic presence. Your positive impact ripples infinitely, sheltering all.',
};

export const COSMETICS = {
  hairstyles: [
    { id: 'classic', name: 'Classic Short', cost: 0 },
    { id: 'curly', name: 'Curly Top', cost: 0 },
    { id: 'pompadour', name: 'Retro Pompadour', cost: 10 },
    { id: 'bun', name: 'Elegant Bun', cost: 25 },
    { id: 'pixie', name: 'Chic Pixie', cost: 40 },
    { id: 'long_sleek', name: 'Long Sleek Hair', cost: 0 },
    { id: 'chic_bob', name: 'Chic Bob Cut', cost: 0 },
    { id: 'elegant_hijab', name: 'Elegant Hijab 🧕', cost: 0 },
    { id: 'side_ponytail', name: 'Side Ponytail', cost: 15 },
    { id: 'space_buns', name: 'Space Buns 💫', cost: 20 },
    { id: 'box_braids', name: 'Box Braids', cost: 35 },
    { id: 'cyber_mohawk', name: 'Neon Mohawk ⚡', cost: 60, locked: true },
    { id: 'aurora_waves', name: 'Aurora Waves ✨', cost: 100, locked: true },
  ],
  hairColors: [
    { id: 'dark', name: 'Midnight Charcoal', value: '#1a1a1a' },
    { id: 'blonde', name: 'Sunlit Gold', value: '#e2ba5e' },
    { id: 'brown', name: 'Earthy Walnut', value: '#784315' },
    { id: 'neon_cyan', name: 'Cyber Cyan ⚡', value: '#06b6d4', locked: true, cost: 30 },
    { id: 'purple_laser', name: 'Laser Purple ⚡', value: '#a855f7', locked: true, cost: 50 },
  ],
  skinTones: [
    { id: 'fair', name: 'Alabaster', value: '#fcd34d' },
    { id: 'olive', name: 'Sun-kissed Olive', value: '#f59e0b' },
    { id: 'dark', name: 'Deep Bronze', value: '#7c2d12' },
    { id: 'cyber_gold', name: 'Synthetic Gold ⚡', value: '#fbbf24', locked: true, cost: 80 },
  ],
  outfits: [
    { id: 'hoodie', name: 'Eco-Cotton Hoodie', cost: 0 },
    { id: 'blazer', name: 'Minimalist Blazer', cost: 0 },
    { id: 'oversized_sweater', name: 'Cozy Oversized Sweater', cost: 0 },
    { id: 'summer_dress', name: 'Floral Summer Dress', cost: 0 },
    { id: 'blouse_skirt', name: 'Blouse & Pearl Necklace', cost: 15 },
    { id: 'robe', name: 'Zen Linen Robe', cost: 20 },
    { id: 'kimono', name: 'Flowing Kimono 🌸', cost: 30 },
    { id: 'tech_suit', name: 'Grid Cyber-suit', cost: 50 },
    { id: 'galactic_cloak', name: 'Nebula Cloak ✨', cost: 120, locked: true },
  ],
  accessories: [
    { id: 'none', name: 'No Accessory', cost: 0 },
    { id: 'retro_glasses', name: 'Circular Glasses', cost: 10 },
    { id: 'pearl_earrings', name: 'Pearl Earrings ✨', cost: 10 },
    { id: 'flower_crown', name: 'Flower Crown 🌸', cost: 25 },
    { id: 'cat_ears', name: 'Cute Cat Ears 🐾', cost: 40 },
    { id: 'holo_visor', name: 'Holo Visor ⚡', cost: 45, locked: true },
    { id: 'laurel_wreath', name: 'Golden Laurel Wreath 🌿', cost: 75, locked: true },
  ],
  backgrounds: [
    { id: 'zen', name: 'Zen Moss Green', value: 'linear-gradient(to bottom, #111827, #064e3b)' },
    { id: 'sunset', name: 'Muted Amber Sunset', value: 'linear-gradient(to bottom, #111827, #78350f)' },
    { id: 'cyber', name: 'Neon Grid Slate', value: 'linear-gradient(to bottom, #0f172a, #1e1b4b)' },
    { id: 'nebula', name: 'Cosmic Sanctuary ✨', value: 'linear-gradient(to bottom, #020617, #3b0764)', locked: true, cost: 100 },
  ],
  animationPoses: [
    { id: 'standing', name: 'Peaceful Standing' },
    { id: 'meditating', name: 'Lotus Meditation' },
    { id: 'hovering', name: 'Quantum Float ⚡', locked: true, cost: 150 },
  ],
};

export const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'comm-1',
    name: 'Global Friends Guild',
    type: 'club',
    mission: 'A space for meaningful real-world interactions and peer-to-peer appreciation.',
    membersCount: 350,
    impactPoints: 1200,
    mood: 90,
    stage: 'Growing Circle',
    achievements: ['Kindness Core', 'Vibrancy Champion'],
  },
  {
    id: 'comm-2',
    name: 'Creators & Innovators Network',
    type: 'club',
    mission: 'Empowering collective intelligence and mutual support for active learners.',
    membersCount: 210,
    impactPoints: 850,
    mood: 85,
    stage: 'Regional Circle',
    achievements: ['Innovation Star'],
  }
];

export const INITIAL_FRIENDS = [
  { id: 'user-2', name: 'Sophia Lin', email: 'sophia@example.com', avatarSeed: 'sophia' },
  { id: 'user-3', name: 'Liam Mercer', email: 'liam@example.com', avatarSeed: 'liam' },
  { id: 'user-4', name: 'Alex Turner', email: 'alex@example.com', avatarSeed: 'alex' },
  { id: 'user-5', name: 'Emily Brooks', email: 'emily@example.com', avatarSeed: 'emily' },
];

export const INITIAL_EVENTS: AppletEvent[] = [
  {
    id: 'evt-1',
    title: 'Weekly Creative Meetup',
    orgId: 'comm-1',
    orgName: 'Global Friends Guild',
    description: 'Join us to share stories, show appreciation, and build genuine human connections.',
    date: '2026-07-10',
    qrCodeUrl: 'EVT-GLOBAL-MEET-2026',
    participants: ['user-2', 'user-3'],
    isCompleted: false,
  }
];

export const MOCK_INTERACTIONS_HISTORY = [
  {
    id: 'ap-1',
    receiverId: 'user-2',
    receiverName: 'Sophia Chen',
    qualities: ['Good Listener', 'Creative', 'Supportive'],
    growthOpportunity: 'Confidence',
    date: '2026-06-20T10:30:00Z',
  },
  {
    id: 'ap-2',
    receiverId: 'user-3',
    receiverName: 'Mateo Rodriguez',
    qualities: ['Leader', 'Problem Solver', 'Professional'],
    growthOpportunity: 'Communication',
    date: '2026-06-25T14:15:00Z',
  },
];

export const DEFAULT_AVATAR = {
  hairstyle: 'classic',
  hairColor: 'dark',
  skinTone: 'fair',
  faceShape: 'oval',
  eyes: 'normal',
  eyebrows: 'classic',
  nose: 'small',
  mouth: 'smile',
  beard: 'none',
  glasses: 'none',
  clothing: 'hoodie',
  shoes: 'sneakers',
  accessories: 'none',
  background: 'zen',
  animationPose: 'standing',
};
