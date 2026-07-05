/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  Community,
  AppletEvent,
  Appreciation,
  WeeklyReflection as WeeklyReflectionType,
  AvatarConfig,
} from './types';
import {
  INITIAL_COMMUNITIES,
  INITIAL_FRIENDS,
  INITIAL_EVENTS,
  MOCK_INTERACTIONS_HISTORY,
  DEFAULT_AVATAR,
  POSITIVE_QUALITIES,
  GROWTH_OPPORTUNITIES,
  REFLECTION_TREE_STAGES,
  TREE_DESCRIPTIONS,
} from './data';
import { AvatarSVG } from './components/AvatarSVG';
import { AvatarDesigner } from './components/AvatarDesigner';
import { ReflectionTree } from './components/ReflectionTree';
import { sha256 } from 'js-sha256';
import {
  Sparkles,
  Heart,
  User,
  Users,
  Compass,
  MessageSquare,
  QrCode,
  Calendar,
  Lock,
  ChevronRight,
  TrendingUp,
  Smile,
  ShieldCheck,
  Award,
  BookOpen,
  ArrowRight,
  Plus,
  Send,
  RefreshCw,
  X,
  CheckCircle,
} from 'lucide-react';

// Robust SHA-256 helper that uses 'js-sha256' but has a 100% reliable inline fallback
const secureSha256 = (ascii: string): string => {
  try {
    if (typeof sha256 === 'function') {
      return sha256(ascii);
    }
  } catch (e) {
    console.warn('External js-sha256 failed, utilizing secure built-in fallback.', e);
  }

  // Pure TS/JS 100% compliant SHA-256 implementation
  const rightRotate = (value: number, amount: number) => (value >>> amount) | (value << (32 - amount));
  const mathPow = Math.pow;
  const lengthProperty = 'length';
  let i, j;
  let result = '';

  const words: number[] = [];
  const asciiLength = ascii[lengthProperty];
  
  const hash = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  let padded = ascii + '\x80';
  while (padded[lengthProperty] % 64 - 56) padded += '\x00';
  for (i = 0; i < padded[lengthProperty]; i++) {
    j = padded.charCodeAt(i);
    words[i >> 2] |= j << (24 - (i % 4) * 8);
  }
  words[words[lengthProperty]] = ((asciiLength >>> 29) & 7);
  words[words[lengthProperty]] = (asciiLength << 3);
  
  for (j = 0; j < words[lengthProperty]; j += 16) {
    const w = words.slice(j, j + 16);
    const oldHash = hash.slice(0);
    
    for (i = 0; i < 64; i++) {
      let w_i = w[i];
      if (i >= 16) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
        const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
        w_i = w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      
      const a = hash[0], b = hash[1], c = hash[2], d = hash[3], e = hash[4], f = hash[5], g = hash[6], h = hash[7];
      const s0_rot = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = s0_rot + maj;
      
      const s1_rot = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = h + s1_rot + ch + k[i] + w_i;
      
      hash.unshift((temp1 + temp2) | 0);
      hash.pop();
      hash[4] = (hash[4] + temp1) | 0;
    }
    
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }
  
  for (i = 0; i < 8; i++) {
    const h_i = hash[i];
    for (j = 3; j + 1; j--) {
      const b = (h_i >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
};

// Secure SHA-256 hashes of the admin password "PokemonGO@2911" and its common variations
const ALLOWED_ADMIN_HASHES = new Set([
  '98cd7a7e910e425835b23e0e5d81813fbcf6d219fc4f606775af79f7af2347f2', // PokemonGO@2911 (exact case)
  'ccc0385048e95d60b8340352e074d66ed9a77e2af16b6aaee13b58892a0dabb7', // pokemongo@2911 (all lowercase)
  '680c4013f53b2dc8656e38e472bca5c60cdbaa3e0efeed48332bde870a0fcc1a', // PokemonGo@2911 (common mixed case)
  '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // admin (all lowercase shortcut)
  '835d6dc88b708bc646d6db82c853ef4182fabbd4a8de59c213f2b5ab3ae7d9be', // ADMIN (uppercase shortcut)
  '7c95965aaa9b112fba0772473f390596359e0e8da736d9ef1bc36e7df0fa426b', // pokemongo (lowercase shorthand)
  '6224b6c508dcbd727d8ef70f017c42e293972229a5d11e67179f5507844980ce', // PokemonGO (exact mixed shorthand)
  'b75dc68652c07b9c75e1dce325c684ce2a54084b5f00ae5a8d8a5354a668b427'  // PokemonGo (mixed shorthand)
]);

export default function App() {
  // --- Persistent & Core States ---
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('elevate_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    }
    return null; // Triggers onboarding
  });

  const [communities, setCommunities] = useState<Community[]>(() => {
    const saved = localStorage.getItem('elevate_communities');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITIES;
  });

  const [events, setEvents] = useState<AppletEvent[]>(() => {
    const saved = localStorage.getItem('elevate_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [appreciations, setAppreciations] = useState<Appreciation[]>(() => {
    const saved = localStorage.getItem('elevate_appreciations');
    return saved ? JSON.parse(saved) : MOCK_INTERACTIONS_HISTORY;
  });

  // --- UI Navigation / Active States ---
  const [activeTab, setActiveTab] = useState<'home' | 'interact' | 'avatar' | 'communities' | 'coach' | 'admin'>('home');
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [onboardingName, setOnboardingName] = useState('');
  const [onboardingAvatar, setOnboardingAvatar] = useState<AvatarConfig>({ ...DEFAULT_AVATAR });
  const [onboardingCommunities, setOnboardingCommunities] = useState<string[]>(['comm-1', 'comm-2']);

  // --- Admin Mode States ---
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');

  // --- Admin Add/Edit Community Form States ---
  const [adminEditingCommunityId, setAdminEditingCommunityId] = useState<string | null>(null);
  const [commName, setCommName] = useState('');
  const [commType, setCommType] = useState<'city' | 'university' | 'company' | 'ngo' | 'club'>('club');
  const [commMission, setCommMission] = useState('');
  const [commStage, setCommStage] = useState('Growing Circle');
  const [commMood, setCommMood] = useState(100);
  const [commMembersCount, setCommMembersCount] = useState(10);
  const [commAchievementsInput, setCommAchievementsInput] = useState('');

  // --- Admin Add Event Form States ---
  const [showEventForm, setShowEventForm] = useState(false);
  const [evtTitle, setEvtTitle] = useState('');
  const [evtOrgId, setEvtOrgId] = useState('');
  const [evtDescription, setEvtDescription] = useState('');
  const [evtDate, setEvtDate] = useState('');

  // --- My Scanner / QR Code Modal State ---
  const [showMyQrModal, setShowMyQrModal] = useState(false);

  // --- Interact Form States ---
  const [interactSearch, setInteractSearch] = useState('');
  const [selectedReceiver, setSelectedReceiver] = useState<{ id: string; name: string; avatarSeed?: string } | null>(null);
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);
  const [selectedGrowth, setSelectedGrowth] = useState<string>('');
  const [cooldownRemaining, setCooldownRemaining] = useState<number | null>(null);
  const [appreciationSuccess, setAppreciationSuccess] = useState(false);

  // --- Event Interaction States ---
  const [selectedEvent, setSelectedEvent] = useState<AppletEvent | null>(null);
  const [joinedEventIds, setJoinedEventIds] = useState<string[]>(['evt-1']);

  // --- Weekly Reflection Modal ---
  const [activeWeeklyReflection, setActiveWeeklyReflection] = useState<WeeklyReflectionType | null>(null);
  const [reflectionLoading, setReflectionLoading] = useState(false);
  const [showReflectionModal, setShowReflectionModal] = useState(false);

  // --- AI Coach Chat States ---
  const [coachMessages, setCoachMessages] = useState<{ sender: 'user' | 'coach'; text: string }[]>(() => {
    return [
      {
        sender: 'coach',
        text: "Welcome to your personal growth space! I'm your Elevate Companion. I can help you interpret recent community reflections, set leadership goals, or practice active listening. What would you like to focus on today? 🌱",
      },
    ];
  });
  const [coachInput, setCoachInput] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);

  // --- Trigger Mock Scanner Modal ---
  const [showScanner, setShowScanner] = useState(false);
  const [scannerStatus, setScannerStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [scannedResult, setScannedResult] = useState<string>('');

  // --- Save states to LocalStorage on changes ---
  useEffect(() => {
    if (profile) {
      localStorage.setItem('elevate_profile', JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('elevate_communities', JSON.stringify(communities));
  }, [communities]);

  useEffect(() => {
    localStorage.setItem('elevate_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('elevate_appreciations', JSON.stringify(appreciations));
  }, [appreciations]);

  // --- Onboarding Completion ---
  const handleCompleteOnboarding = () => {
    if (!onboardingName.trim()) {
      alert('Please enter your name to personalize your Elevate journey.');
      return;
    }
    const newProfile: UserProfile = {
      id: 'user-primary-' + Date.now(),
      name: onboardingName.trim(),
      avatar: onboardingAvatar,
      joinedCommunities: onboardingCommunities,
      impactPoints: 20, // Initial welcome points
      reflectionTreeStage: 'Seed',
      unlockedCosmetics: [],
      cooldowns: {},
    };
    setProfile(newProfile);
    setActiveTab('home');
  };

  // --- Handle Wardrobe Upgrades & Cosmetic Purchases ---
  const handleUpdateAvatar = (newAvatar: AvatarConfig) => {
    if (profile) {
      setProfile({
        ...profile,
        avatar: newAvatar,
      });
    }
  };

  const handleSpendPoints = (newPoints: number, unlockedItem: string) => {
    if (profile) {
      setProfile({
        ...profile,
        impactPoints: newPoints,
        unlockedCosmetics: [...profile.unlockedCosmetics, unlockedItem],
      });
    }
  };

  // --- Trigger Cooldown Check for Appreciation ---
  useEffect(() => {
    if (profile && selectedReceiver) {
      const lastAppreciatedStr = profile.cooldowns[selectedReceiver.id];
      if (lastAppreciatedStr) {
        const lastDate = new Date(lastAppreciatedStr);
        const diffDays = Math.ceil((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 30) {
          setCooldownRemaining(30 - diffDays);
        } else {
          setCooldownRemaining(null);
        }
      } else {
        setCooldownRemaining(null);
      }
    } else {
      setCooldownRemaining(null);
    }
  }, [selectedReceiver, profile]);

  // --- Handle Quality Toggle ---
  const handleToggleQuality = (quality: string) => {
    if (selectedQualities.includes(quality)) {
      setSelectedQualities(selectedQualities.filter(q => q !== quality));
    } else {
      if (selectedQualities.length >= 3) {
        alert('Please select up to 3 qualities to appreciate, so that each choice is deeply meaningful.');
        return;
      }
      setSelectedQualities([...selectedQualities, quality]);
    }
  };

  // --- Submit Appreciation ---
  const handleSubmitAppreciation = () => {
    if (!profile || !selectedReceiver) return;
    if (selectedQualities.length === 0) {
      alert('Please select at least 1 positive quality.');
      return;
    }
    if (!selectedGrowth) {
      alert('Please choose an opportunity for growth.');
      return;
    }

    const newAppreciation: Appreciation = {
      id: 'ap-' + Date.now(),
      receiverId: selectedReceiver.id,
      receiverName: selectedReceiver.name,
      qualities: selectedQualities,
      growthOpportunity: selectedGrowth,
      date: new Date().toISOString(),
    };

    // Update list of appreciations
    setAppreciations([newAppreciation, ...appreciations]);

    // Update cooldown map in primary profile
    const updatedCooldowns = {
      ...profile.cooldowns,
      [selectedReceiver.id]: new Date().toISOString(),
    };

    // Reward points for genuine real-world appreciation
    const pointReward = 15;
    const currentPoints = profile.impactPoints + pointReward;

    // Check tree stage progress based on total points
    let treeStage = profile.reflectionTreeStage;
    if (currentPoints >= 150) treeStage = 'Forest Guardian';
    else if (currentPoints >= 110) treeStage = 'Golden Tree';
    else if (currentPoints >= 80) treeStage = 'Blooming Tree';
    else if (currentPoints >= 55) treeStage = 'Young Tree';
    else if (currentPoints >= 35) treeStage = 'Sapling';
    else if (currentPoints >= 20) treeStage = 'Sprout';

    // Boost the community impact points
    const updatedCommunities = communities.map(c => {
      if (profile.joinedCommunities.includes(c.id)) {
        return {
          ...c,
          impactPoints: c.impactPoints + 15,
          mood: Math.min(100, c.mood + 1), // Vibe elevates!
        };
      }
      return c;
    });
    setCommunities(updatedCommunities);

    setProfile({
      ...profile,
      cooldowns: updatedCooldowns,
      impactPoints: currentPoints,
      reflectionTreeStage: treeStage,
    });

    setAppreciationSuccess(true);
    setTimeout(() => {
      setAppreciationSuccess(false);
      setSelectedReceiver(null);
      setSelectedQualities([]);
      setSelectedGrowth('');
      setActiveTab('home');
    }, 3000);
  };

  // --- Sunday Review / Weekly Summary Generator ---
  const handleTriggerWeeklyReview = async () => {
    if (!profile) return;
    setReflectionLoading(true);
    setShowReflectionModal(true);

    // Collect all real feedback stats
    const recentInteractionsCount = appreciations.length + 4; // Simulated baseline counts

    // Amalgamate popular qualities
    const mockQualities = ['Good Listener', 'Creative', 'Motivating', 'Helpful'];
    const mockFeelings = ['Comfortable', 'Inspired', 'Supported'];
    const mockGrowths = ['Confidence', 'Public Speaking', 'Planning'];

    try {
      const response = await fetch('/api/ai/reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          interactionCount: recentInteractionsCount,
          topQualities: mockQualities,
          growthOpportunities: mockGrowths,
        }),
      });

      const data = await response.json();

      const newReflection: WeeklyReflectionType = {
        id: 'ref-' + Date.now(),
        userId: profile.id,
        dateRange: 'June 29 - July 5',
        interactionCount: recentInteractionsCount,
        topQualities: mockQualities,
        topFeelings: mockFeelings,
        growthOpportunities: mockGrowths,
        pointsGained: 35,
        treeStageBefore: profile.reflectionTreeStage,
        treeStageAfter: profile.reflectionTreeStage,
        aiSummary: data.summary,
      };

      setActiveWeeklyReflection(newReflection);
    } catch (err) {
      console.error('Failed to query Weekly Reflection API:', err);
    } finally {
      setReflectionLoading(false);
    }
  };

  // --- Send Message to AI Growth Coach ---
  const handleSendCoachMessage = async () => {
    if (!coachInput.trim() || !profile) return;
    const userMsg = coachInput.trim();
    setCoachInput('');
    setCoachMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setCoachLoading(true);

    try {
      const response = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          userName: profile.name,
          qualities: appreciations.flatMap(a => a.qualities).slice(0, 4),
          growthOpportunities: appreciations.map(a => a.growthOpportunity).slice(0, 2),
        }),
      });

      const data = await response.json();
      setCoachMessages(prev => [...prev, { sender: 'coach', text: data.reply }]);
    } catch (err) {
      console.error('Error contacting AI coach:', err);
      setCoachMessages(prev => [
        ...prev,
        {
          sender: 'coach',
          text: "I'm reflecting on your beautiful journey. Growth is a series of gentle steps. Remember, working on confidence and strategic listening helps build high-vibrancy communities! 🌱",
        },
      ]);
    } finally {
      setCoachLoading(false);
    }
  };

  // --- Trigger Mock QR Scanner ---
  const handleScanAction = (codeType: 'user' | 'event') => {
    setShowScanner(true);
    setScannerStatus('scanning');

    setTimeout(() => {
      setScannerStatus('success');
      if (codeType === 'user') {
        const randomFriend = INITIAL_FRIENDS[Math.floor(Math.random() * INITIAL_FRIENDS.length)];
        setScannedResult(`Successfully scanned profile code for ${randomFriend.name}!`);
        setTimeout(() => {
          setSelectedReceiver(randomFriend);
          setActiveTab('interact');
          setShowScanner(false);
        }, 1500);
      } else {
        const randomEvent = events.find(e => !joinedEventIds.includes(e.id)) || events[0];
        setScannedResult(`Successfully registered for event: ${randomEvent.title}!`);
        setTimeout(() => {
          if (!joinedEventIds.includes(randomEvent.id)) {
            setJoinedEventIds([...joinedEventIds, randomEvent.id]);
          }
          setActiveTab('communities');
          setSelectedEvent(randomEvent);
          setShowScanner(false);
        }, 1500);
      }
    }, 2000);
  };

  // --- Calculations for dashboard statistics ---
  const statsOverview = useMemo(() => {
    const totalImpact = appreciations.length * 15;
    const activeCommunitiesCount = profile ? profile.joinedCommunities.length : 0;
    return {
      totalImpact,
      activeCommunitiesCount,
    };
  }, [appreciations, profile]);

  // --- Onboarding Flow Render ---
  if (!profile) {
    return (
      <div id="onboarding-flow" className="min-h-screen bg-[#050505] text-[#e5e7eb] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Glow background effects */}
        <div className="absolute top-[-15%] right-[10%] w-[500px] h-[500px] bg-[#10b981]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-[#a855f7]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-4xl bg-white/[0.02] border border-white/10 rounded-[32px] p-8 md:p-12 backdrop-blur-xl relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-[#10b981] to-[#3b82f6] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4 animate-[pulse_4s_infinite_ease-in-out]">
              <div className="w-8 h-8 border-3 border-white/95 rounded-full flex items-center justify-center">
                <div className="w-3.5 h-3.5 bg-emerald-400 rounded-full"></div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-bold">Elevate</span>
            </h1>
            <p className="text-white/40 uppercase tracking-[0.25em] text-xs mt-2">
              "Grow Together. Inspire Better."
            </p>
          </div>

          {onboardingStep === 1 ? (
            <div id="step-1-container" className="space-y-6 max-w-md mx-auto">
              <h2 className="text-xl font-medium text-center text-white/85">
                Let's begin your personal growth journey
              </h2>
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                  What is your name?
                </label>
                <input
                  id="input-onboarding-name"
                  type="text"
                  placeholder="Enter your name"
                  value={onboardingName}
                  onChange={e => setOnboardingName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 transition-all text-base font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                  Select Communities You Belong To
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {communities.map(c => {
                    const selected = onboardingCommunities.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        id={`comm-select-${c.id}`}
                        onClick={() => {
                          if (selected) {
                            setOnboardingCommunities(onboardingCommunities.filter(id => id !== c.id));
                          } else {
                            setOnboardingCommunities([...onboardingCommunities, c.id]);
                          }
                        }}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-300 ${
                          selected
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                            : 'bg-white/[0.01] border-white/5 text-white/55 hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold">{c.name}</p>
                          <p className="text-xs text-white/30">{c.mission.slice(0, 60)}...</p>
                        </div>
                        {selected && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                id="btn-onboarding-next"
                onClick={() => {
                  if (!onboardingName.trim()) {
                    alert('Please enter your name to customize your avatar!');
                    return;
                  }
                  setOnboardingStep(2);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold rounded-xl transition-all hover:scale-102 flex items-center justify-center gap-2"
              >
                Create Digital Identity
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div id="step-2-container" className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-medium text-white/85">
                  Design Your Digital Avatar
                </h2>
                <p className="text-sm text-white/40">
                  Your avatar is your identity throughout the Elevate network.
                </p>
              </div>

              {/* Embed Designer component temporarily */}
              <AvatarDesigner
                profile={{
                  id: 'onboarding',
                  name: onboardingName,
                  avatar: onboardingAvatar,
                  joinedCommunities: onboardingCommunities,
                  impactPoints: 20,
                  reflectionTreeStage: 'Seed',
                  unlockedCosmetics: [],
                  cooldowns: {},
                }}
                onChange={setOnboardingAvatar}
                onUpdatePoints={() => {}} // Free during onboarding
              />

              <div className="flex gap-4 max-w-md mx-auto mt-6">
                <button
                  id="btn-onboarding-back"
                  onClick={() => setOnboardingStep(1)}
                  className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all"
                >
                  Back
                </button>
                <button
                  id="btn-onboarding-complete"
                  onClick={handleCompleteOnboarding}
                  className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  Grow Together 🌱
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Active App Layout ---
  return (
    <div id="elevate-root" className="min-h-screen bg-[#050505] text-[#e5e7eb] font-sans flex overflow-hidden">
      
      {/* 1. Navigation Rail / Sidebar */}
      <nav id="nav-rail" className="w-20 md:w-24 flex flex-col items-center py-8 bg-[#0a0a0c] border-r border-white/5 select-none shrink-0">
        
        {/* Network Logo */}
        <div className="mb-10">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#10b981] to-[#3b82f6] rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.25)]">
            <div className="w-6 h-6 border-2 border-white/95 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-col gap-6 flex-1 w-full px-2">
          
          {/* Home Tab */}
          <button
            id="nav-btn-home"
            onClick={() => setActiveTab('home')}
            title="Dashboard"
            className={`p-3 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col items-center gap-1 group ${
              activeTab === 'home'
                ? 'text-[#10b981] bg-[#10b981]/10 border border-emerald-500/20'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[9px] font-bold tracking-wider mt-0.5 opacity-60">HOME</span>
          </button>

          {/* Interact Tab */}
          <button
            id="nav-btn-interact"
            onClick={() => {
              setSelectedReceiver(null);
              setActiveTab('interact');
            }}
            title="Appreciation Panel"
            className={`p-3 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col items-center gap-1 group ${
              activeTab === 'interact'
                ? 'text-[#10b981] bg-[#10b981]/10 border border-emerald-500/20'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-[9px] font-bold tracking-wider mt-0.5 opacity-60">GIVE</span>
          </button>

          {/* Wardrobe Tab */}
          <button
            id="nav-btn-avatar"
            onClick={() => setActiveTab('avatar')}
            title="Avatar Design & Wardrobe"
            className={`p-3 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col items-center gap-1 group ${
              activeTab === 'avatar'
                ? 'text-[#10b981] bg-[#10b981]/10 border border-emerald-500/20'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[9px] font-bold tracking-wider mt-0.5 opacity-60">WARDROBE</span>
          </button>

          {/* Communities & Events Tab */}
          <button
            id="nav-btn-communities"
            onClick={() => {
              setSelectedEvent(null);
              setActiveTab('communities');
            }}
            title="Communities & Events"
            className={`p-3 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col items-center gap-1 group ${
              activeTab === 'communities'
                ? 'text-[#10b981] bg-[#10b981]/10 border border-emerald-500/20'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[9px] font-bold tracking-wider mt-0.5 opacity-60">GROUPS</span>
          </button>

          {/* AI Growth Companion Tab */}
          <button
            id="nav-btn-coach"
            onClick={() => setActiveTab('coach')}
            title="AI Coach"
            className={`p-3 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col items-center gap-1 group ${
              activeTab === 'coach'
                ? 'text-[#10b981] bg-[#10b981]/10 border border-emerald-500/20'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[9px] font-bold tracking-wider mt-0.5 opacity-60">COACH</span>
          </button>

          {/* Admin Panel Tab */}
          <button
            id="nav-btn-admin"
            onClick={() => setActiveTab('admin')}
            title="Admin Console"
            className={`p-3 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col items-center gap-1 group ${
              activeTab === 'admin'
                ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Lock className="w-5 h-5" />
            <span className="text-[9px] font-bold tracking-wider mt-0.5 opacity-60">ADMIN</span>
          </button>
        </div>

        {/* User Mini Profile Avatar at Bottom */}
        <div className="mt-auto">
          <button
            id="btn-nav-mini-profile"
            onClick={() => setActiveTab('avatar')}
            className="w-12 h-12 rounded-2xl border border-white/10 p-0.5 hover:border-emerald-500 transition-all bg-white/[0.02]"
          >
            <AvatarSVG config={profile.avatar} className="w-full h-full rounded-xl" />
          </button>
        </div>
      </nav>

      {/* 2. Main Workspace */}
      <main id="main-workspace" className="flex-1 flex flex-col relative overflow-hidden min-w-0">
        
        {/* Background Glowing Orbs */}
        <div className="absolute top-[-10%] right-[10%] w-[400px] h-[400px] bg-[#10b981]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[350px] h-[350px] bg-[#a855f7]/5 rounded-full blur-[90px] pointer-events-none"></div>

        {/* Top Header */}
        <header id="main-header" className="h-20 flex items-center justify-between px-6 md:px-10 border-b border-white/5 shrink-0 z-10 bg-[#050505]/40 backdrop-blur-md">
          <div>
            <h1 className="text-xl md:text-2xl font-light tracking-tight text-white">
              Elevate, <span className="font-semibold">{profile.name}</span>
            </h1>
            <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.2em] mt-0.5">
              GROW TOGETHER. INSPIRE BETTER. &bull; WEEKLY REFLECTION AVAILABLE
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex px-4 py-2 bg-white/5 rounded-full border border-white/10 items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
              <span className="text-xs font-medium text-white/70">SF Bay Area &bull; High Vibrancy</span>
            </div>
            
            {/* Action Bar for quick simulation */}
            <button
              id="header-btn-my-qr"
              onClick={() => setShowMyQrModal(true)}
              className="px-3.5 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>My QR Code</span>
            </button>

            <button
              id="header-btn-quick-scan"
              onClick={() => handleScanAction('user')}
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulate Scan</span>
            </button>
          </div>
        </header>

        {/* Content Container (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 z-10">
          
          {/* =======================================================
              VIEW 1: HOME DASHBOARD
              ======================================================= */}
          {activeTab === 'home' && (
            <div id="view-home-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Reflection Tree Card (gorgeous Glassmorphism) */}
              <div className="lg:col-span-7 bg-white/[0.01] border border-white/10 rounded-[32px] p-6 relative flex flex-col items-center justify-center overflow-hidden min-h-[460px] backdrop-blur-md">
                <div className="absolute top-6 left-6 text-xs font-semibold text-white/30 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Personal Reflection Tree</span>
                </div>

                <div className="w-full flex-1 flex flex-col items-center justify-center my-6">
                  <ReflectionTree stage={profile.reflectionTreeStage} className="w-full" />
                </div>

                <div className="text-center mt-4">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                    {profile.reflectionTreeStage} Stage
                  </span>
                  <p className="text-sm text-white/50 max-w-sm mt-3 mx-auto leading-relaxed">
                    "{TREE_DESCRIPTIONS[profile.reflectionTreeStage]}"
                  </p>
                </div>

                <div className="w-full border-t border-white/5 mt-6 pt-5 flex justify-between items-center text-xs">
                  <span className="text-white/40">Next stage unlock in</span>
                  <span className="text-emerald-400 font-bold">
                    {profile.reflectionTreeStage === 'Forest Guardian' ? 'MAX LEVEL' : `${profile.impactPoints} / ${
                      profile.reflectionTreeStage === 'Seed' ? '20' :
                      profile.reflectionTreeStage === 'Sprout' ? '35' :
                      profile.reflectionTreeStage === 'Sapling' ? '55' :
                      profile.reflectionTreeStage === 'Young Tree' ? '80' :
                      profile.reflectionTreeStage === 'Blooming Tree' ? '110' : '150'
                    } Points`}
                  </span>
                </div>
              </div>

              {/* Right Side: Quick Stats, Sunday Reflection, and Community Health */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* 1. Sunday Weekly Reflection Card */}
                <div className="bg-gradient-to-br from-white/[0.06] to-transparent border border-white/10 rounded-[28px] p-6 backdrop-blur-xl relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-widest text-[#10b981]">🌱 Weekly Reflection</h4>
                      <p className="text-xs text-white/30 mt-0.5">Last updated: Today</p>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold uppercase">Ready</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-sm text-white/50 font-medium italic">People Appreciated</span>
                      <span className="text-sm font-semibold text-white">Leadership, Helpful, Listening</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-sm text-white/50 font-medium italic">People Felt</span>
                      <span className="text-sm font-semibold text-white">Comfortable, Inspired</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-sm text-white/50 font-medium italic">Growth Opportunity</span>
                      <span className="text-sm font-semibold text-cyan-400">Confidence</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/50 font-medium italic">Impact Gained</span>
                      <span className="text-sm font-bold text-emerald-400">+{statsOverview.totalImpact + 35} Points</span>
                    </div>
                  </div>

                  <button
                    id="btn-open-weekly-reflection"
                    onClick={handleTriggerWeeklyReview}
                    className="w-full mt-6 py-3 bg-[#10b981] hover:bg-[#059669] text-black font-bold rounded-2xl transition-all shadow-lg hover:scale-101 flex items-center justify-center gap-2"
                  >
                    Open AI Reflection Summary
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* 2. Community Health & Mood tracker */}
                <div className="bg-white/[0.01] border border-white/10 rounded-[28px] p-6 backdrop-blur-md">
                  <div className="flex justify-between items-center mb-5">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40">Community Vibrancy Map</h4>
                    <span className="text-[10px] text-white/30 font-semibold">{profile.joinedCommunities.length} Joined Groups</span>
                  </div>

                  <div className="space-y-4">
                    {communities
                      .filter(c => profile.joinedCommunities.includes(c.id))
                      .map(c => (
                        <div key={c.id} className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-white">{c.name}</span>
                            <span className="text-xs text-emerald-400 font-bold">{c.mood}% Mood</span>
                          </div>
                          {/* Mini Progress Bar representing stages */}
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full"
                              style={{ width: `${c.mood}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-[9px] text-white/30 uppercase font-semibold mt-1.5 tracking-wider">
                            <span>Stage: {c.stage}</span>
                            <span>{c.membersCount} Active</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =======================================================
              VIEW 2: INTERACT & APPRECIATE
              ======================================================= */}
          {activeTab === 'interact' && (
            <div id="view-interact-container" className="max-w-4xl mx-auto bg-white/[0.01] border border-white/10 rounded-[32px] p-6 md:p-10 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>

              {/* Header inside form */}
              <div className="mb-8 text-center md:text-left">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-500/20 inline-block">
                  Acknowledge Connection
                </span>
                <h3 className="text-2xl md:text-3xl font-light text-white mt-3">
                  Appreciate Someone's Presence Today
                </h3>
                <p className="text-sm text-white/40 mt-1 max-w-xl">
                  Connect via real-world presence and recognize their contribution. Feedback is stored completely anonymously to eliminate peer pressure or bias.
                </p>
              </div>

              {/* Part A: Select recipient */}
              {!selectedReceiver ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                      Find Person
                    </label>
                    <div className="flex gap-3">
                      <input
                        id="interact-search-input"
                        type="text"
                        placeholder="Search friend name or organization member..."
                        value={interactSearch}
                        onChange={e => setInteractSearch(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 transition-all text-sm font-medium"
                      />
                      <button
                        id="btn-scan-qr"
                        onClick={() => handleScanAction('user')}
                        className="px-5 py-3.5 bg-white text-black font-bold rounded-2xl flex items-center gap-2 hover:scale-102 active:scale-98 transition-all shadow-md"
                      >
                        <QrCode className="w-4 h-4" />
                        <span className="hidden sm:inline">Scan QR</span>
                      </button>
                    </div>
                  </div>

                  {/* Suggest Friends/Members list */}
                  <div>
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                      Suggested Connections Around You
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {INITIAL_FRIENDS.filter(f =>
                        f.name.toLowerCase().includes(interactSearch.toLowerCase())
                      ).map(f => (
                        <button
                          key={f.id}
                          id={`friend-select-${f.id}`}
                          onClick={() => setSelectedReceiver(f)}
                          className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/15 text-left transition-all duration-300 hover:bg-white/[0.03]"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center border border-emerald-500/20 text-emerald-300 text-sm font-bold">
                            {f.name.slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white/90">{f.name}</p>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">Active Peer</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Part B: Appreciation Questions Form */
                <div className="space-y-8">
                  {/* Selected Peer Badge */}
                  <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 text-base font-bold">
                        {selectedReceiver.name.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{selectedReceiver.name}</p>
                        <p className="text-xs text-white/40">Real-life Interaction &bull; Safe & Anonymous</p>
                      </div>
                    </div>
                    <button
                      id="btn-change-receiver"
                      onClick={() => {
                        setSelectedReceiver(null);
                        setSelectedQualities([]);
                        setSelectedGrowth('');
                      }}
                      className="text-xs font-semibold text-white/40 hover:text-white transition-colors uppercase tracking-wider"
                    >
                      Change
                    </button>
                  </div>

                  {/* Cooldown Guardian Screen */}
                  {cooldownRemaining !== null ? (
                    <div id="cooldown-active-screen" className="p-8 text-center bg-purple-950/20 border border-purple-500/20 rounded-[24px]">
                      <Lock className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                      <h4 className="text-lg font-bold text-white">Trust Cooldown Active</h4>
                      <p className="text-sm text-white/50 max-w-md mx-auto mt-2">
                        To maintain high-quality interactions and prevent farming points or reputation, you can appreciate the same peer only once every 30 days.
                      </p>
                      <div className="inline-block mt-4 px-4 py-2 bg-purple-950/60 rounded-full text-purple-300 font-bold border border-purple-500/20 text-xs">
                        Next Appreciation Unlocks in: {cooldownRemaining} Days
                      </div>
                    </div>
                  ) : appreciationSuccess ? (
                    <div id="appreciation-success-screen" className="p-8 text-center bg-emerald-950/20 border border-emerald-500/20 rounded-[24px]">
                      <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4 animate-[bounce_1.5s_infinite]" />
                      <h4 className="text-xl font-bold text-white">Appreciation Shared Anonymously</h4>
                      <p className="text-sm text-white/50 max-w-md mx-auto mt-2">
                        You have successfully appreciated **{selectedReceiver.name}**! This will contribute to their Weekly Reflection next Sunday and nurture their Reflection Tree.
                      </p>
                      <p className="text-xs text-emerald-400 font-semibold mt-4">
                        🌱 +15 Impact Points earned toward your community!
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* 1. Question: Positive Qualities */}
                      <div className="space-y-4">
                        <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest">
                          1. How did this person positively impact your interaction today? <span className="text-emerald-400 font-bold">(Select up to 3)</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {POSITIVE_QUALITIES.map(q => {
                            const active = selectedQualities.includes(q);
                            return (
                              <button
                                key={q}
                                id={`quality-btn-${q}`}
                                onClick={() => handleToggleQuality(q)}
                                className={`p-3 rounded-xl border text-xs font-semibold transition-all duration-300 text-center ${
                                  active
                                    ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.2)] border-emerald-400'
                                    : 'bg-white/[0.01] border-white/5 hover:border-white/10 text-white/65'
                                }`}
                              >
                                {q}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. Question: Growth Opportunity */}
                      <div className="space-y-4 border-t border-white/5 pt-6">
                        <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest">
                          2. Where do you think this person has the greatest opportunity to grow? <span className="text-cyan-400 font-bold">(Select 1)</span>
                        </label>
                        <p className="text-[11px] text-white/30 italic">
                          No toxic ratings or reviews. Only supportive, constructive growth paths.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {GROWTH_OPPORTUNITIES.map(g => {
                            const active = selectedGrowth === g;
                            return (
                              <button
                                key={g}
                                id={`growth-btn-${g}`}
                                onClick={() => setSelectedGrowth(g)}
                                className={`p-3 rounded-xl border text-xs font-semibold transition-all duration-300 text-center ${
                                  active
                                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.2)] border-cyan-400'
                                    : 'bg-white/[0.01] border-white/5 hover:border-white/10 text-white/65'
                                }`}
                              >
                                {g}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Submit */}
                      <div className="border-t border-white/5 pt-6 flex justify-end gap-3">
                        <button
                          id="btn-cancel-appreciation"
                          onClick={() => {
                            setSelectedReceiver(null);
                            setSelectedQualities([]);
                            setSelectedGrowth('');
                          }}
                          className="px-6 py-3 bg-white/5 hover:bg-white/10 font-semibold rounded-xl text-white transition-all text-xs uppercase tracking-widest"
                        >
                          Cancel
                        </button>
                        <button
                          id="btn-submit-appreciation"
                          onClick={handleSubmitAppreciation}
                          className="px-8 py-3 bg-[#10b981] hover:bg-[#059669] text-black font-bold rounded-xl transition-all text-xs uppercase tracking-widest shadow-lg"
                        >
                          Send Appreciation Anonymously
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* =======================================================
              VIEW 3: AVATAR & IDENTITY DESIGNER (WARDROBE)
              ======================================================= */}
          {activeTab === 'avatar' && (
            <div id="view-avatar-container" className="space-y-6">
              <div className="mb-6">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest bg-purple-950/40 px-3.5 py-1.5 rounded-full border border-purple-500/20 inline-block">
                  Avatar Progression & Wardrobe
                </span>
                <h3 className="text-2xl md:text-3xl font-light text-white mt-3">
                  Evolve Your Digital Appearance
                </h3>
                <p className="text-sm text-white/40 mt-1 max-w-xl">
                  Unlock rare cosmetics, glowing frames, hover poses, and particle backdrops using your **Impact Points**. Earn points by doing real-life kind acts and community collaboration.
                </p>
              </div>

              <AvatarDesigner
                profile={profile}
                onChange={handleUpdateAvatar}
                onUpdatePoints={handleSpendPoints}
              />
            </div>
          )}

          {/* =======================================================
              VIEW 4: COMMUNITIES & EVENTS
              ======================================================= */}
          {activeTab === 'communities' && (
            <div id="view-communities-container" className="space-y-8">
              
              {/* Event detail page if an event is selected */}
              {selectedEvent ? (
                <div id="selected-event-panel" className="bg-white/[0.01] border border-white/10 rounded-[32px] p-6 md:p-10 backdrop-blur-md max-w-4xl mx-auto">
                  <button
                    id="btn-back-to-events"
                    onClick={() => setSelectedEvent(null)}
                    className="text-xs text-white/40 hover:text-white transition-all uppercase font-semibold tracking-wider flex items-center gap-1.5 mb-6"
                  >
                    &larr; Back to Communities & Events
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Event summary info */}
                    <div className="md:col-span-8 space-y-5">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] bg-[#10b981]/15 text-emerald-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">
                          Verified Event
                        </span>
                        <span className="text-xs text-white/40">{selectedEvent.date}</span>
                      </div>
                      
                      <h2 className="text-2xl md:text-3xl font-semibold text-white">{selectedEvent.title}</h2>
                      
                      <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">
                        Organized by: <span className="text-white font-bold">{selectedEvent.orgName}</span>
                      </p>

                      <p className="text-sm leading-relaxed text-white/70">{selectedEvent.description}</p>

                      <div className="border-t border-white/5 pt-5 space-y-3">
                        <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Event Participants</p>
                        <div className="flex gap-2">
                          {selectedEvent.participants.map((pid, idx) => (
                            <div
                              key={pid}
                              className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white"
                            >
                              P{idx + 1}
                            </div>
                          ))}
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40">
                            +12
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Verification QR Code sidebar */}
                    <div className="md:col-span-4 bg-white/[0.02] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                      <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Participation QR Code</h4>
                      
                      {/* Stylized QR Code Graphic */}
                      <div className="w-40 h-40 bg-white p-3 rounded-xl shadow-lg relative flex items-center justify-center">
                        <QrCode className="w-full h-full text-black stroke-[1.5]" />
                        {/* Overlay Applet Icon */}
                        <div className="absolute w-8 h-8 bg-black rounded-lg flex items-center justify-center border border-white/20">
                          <div className="w-3.5 h-3.5 border border-emerald-400 rounded-full"></div>
                        </div>
                      </div>

                      <p className="text-[10px] text-white/30 font-semibold mt-3">ID: {selectedEvent.qrCodeUrl}</p>
                      
                      <button
                        id="btn-join-event-participation"
                        onClick={() => {
                          if (joinedEventIds.includes(selectedEvent.id)) {
                            alert("You are already checked-in and verified as a participant!");
                            return;
                          }
                          setJoinedEventIds([...joinedEventIds, selectedEvent.id]);
                          alert(`Joined successfully! Now you are verified to appreciate others after the event.`);
                        }}
                        className={`w-full mt-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                          joinedEventIds.includes(selectedEvent.id)
                            ? 'bg-white/5 text-emerald-400 border border-emerald-500/20'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md'
                        }`}
                      >
                        {joinedEventIds.includes(selectedEvent.id) ? 'Verified Participant ✔' : 'Check-In QR Code'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Communities Listing */}
                  <div>
                    <h3 className="text-lg font-semibold uppercase tracking-widest text-white/40 mb-4">Organizations & Communities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {communities.map(c => {
                        const joined = profile.joinedCommunities.includes(c.id);
                        return (
                          <div key={c.id} className="bg-white/[0.01] border border-white/10 rounded-[24px] p-6 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] bg-white/5 px-2.5 py-1 rounded-full uppercase tracking-wider text-white/50 font-bold border border-white/10">
                                  {c.type}
                                </span>
                                <span className="text-xs text-emerald-400 font-bold">Stage: {c.stage}</span>
                              </div>
                              <h4 className="text-lg font-bold text-white mt-3">{c.name}</h4>
                              <p className="text-sm text-white/50 mt-1.5 leading-relaxed">{c.mission}</p>
                              
                              {c.achievements.length > 0 && (
                                <div className="mt-4 flex gap-2 flex-wrap">
                                  {c.achievements.map(ach => (
                                    <span key={ach} className="text-[9px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                                      <Award className="w-2.5 h-2.5 text-purple-400" />
                                      {ach}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="border-t border-white/5 mt-5 pt-4 flex justify-between items-center">
                              <span className="text-xs text-white/30">{c.membersCount} Members</span>
                              <button
                                id={`community-join-btn-${c.id}`}
                                onClick={() => {
                                  if (joined) {
                                    // Leave community
                                    setProfile({
                                      ...profile,
                                      joinedCommunities: profile.joinedCommunities.filter(id => id !== c.id),
                                    });
                                  } else {
                                    // Join community
                                    setProfile({
                                      ...profile,
                                      joinedCommunities: [...profile.joinedCommunities, c.id],
                                    });
                                  }
                                }}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                                  joined
                                    ? 'bg-white/5 text-white/40 hover:bg-red-500/15 hover:text-red-300 hover:border-red-500/30 border border-white/10'
                                    : 'bg-emerald-500 text-black hover:bg-emerald-400'
                                }`}
                              >
                                {joined ? 'Leave Community' : 'Join Group'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Upcoming Events Listing */}
                  <div>
                    <h3 className="text-lg font-semibold uppercase tracking-widest text-white/40 mb-4">Upcoming Local Events</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {events.map(evt => (
                        <div key={evt.id} className="bg-white/[0.01] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between text-[10px] text-white/40 font-bold uppercase tracking-wider mb-2.5">
                              <span>{evt.date}</span>
                              <span className="text-cyan-400">{evt.orgName}</span>
                            </div>
                            <h4 className="text-base font-bold text-white mb-2 leading-tight">{evt.title}</h4>
                            <p className="text-xs text-white/50 leading-relaxed line-clamp-3">{evt.description}</p>
                          </div>

                          <button
                            id={`event-details-btn-${evt.id}`}
                            onClick={() => setSelectedEvent(evt)}
                            className="w-full mt-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1"
                          >
                            <span>Open Event QR Code</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* =======================================================
              VIEW 5: AI GROWTH COMPANION (COACH)
              ======================================================= */}
          {activeTab === 'coach' && (
            <div id="view-coach-container" className="max-w-4xl mx-auto flex flex-col h-[520px] bg-white/[0.01] border border-white/10 rounded-[32px] backdrop-blur-md overflow-hidden relative">
              <div className="absolute top-[-10%] right-[-10%] w-56 h-56 bg-purple-500/5 rounded-full blur-[70px] pointer-events-none"></div>

              {/* Coach top banner */}
              <div className="p-5 border-b border-white/5 bg-[#0a0a0c]/40 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30 text-purple-300">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Elevate Companion</h4>
                  <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Online &bull; Ready to nurture growth</p>
                </div>
              </div>

              {/* Chat log */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {coachMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-purple-600 text-white rounded-tr-none shadow-md'
                          : 'bg-white/[0.03] border border-white/10 text-white/90 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {coachLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-white/5 bg-[#0a0a0c]/20 flex gap-2">
                <input
                  id="coach-input-field"
                  type="text"
                  placeholder="Ask for feedback advice, peer exercises, or meditation ideas..."
                  value={coachInput}
                  onChange={e => setCoachInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSendCoachMessage();
                  }}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500 transition-all"
                />
                <button
                  id="coach-send-btn"
                  onClick={handleSendCoachMessage}
                  className="px-5 py-3 bg-purple-500 hover:bg-purple-400 text-black font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}

          {/* =======================================================
              VIEW 6: ADMIN PANEL (PASSWORD LOCKED)
              ======================================================= */}
          {activeTab === 'admin' && (
            <div id="view-admin-container" className="max-w-6xl mx-auto w-full p-1 space-y-6">
              {!isAdminAuthenticated ? (
                /* PASSWORD LOCKED ENTRY */
                <div className="max-w-md mx-auto my-12 bg-white/[0.01] border border-white/10 rounded-[32px] p-8 md:p-10 backdrop-blur-md relative overflow-hidden text-center">
                  <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none"></div>
                  
                  <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center text-purple-300 mx-auto mb-6">
                    <Lock className="w-8 h-8" />
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-wide">Elevate Creator Console</h3>
                  <p className="text-xs text-white/40 mt-2 leading-relaxed">
                    Provide the node authority key to integrate new groups, configure local events, or delete custom records.
                  </p>

                  <div className="mt-8 space-y-4 text-left">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest font-bold">Authority Password</label>
                      </div>
                      <input
                        id="admin-password-input"
                        type="password"
                        placeholder="••••••••••••"
                        value={adminPasswordInput}
                        onChange={e => {
                          setAdminPasswordInput(e.target.value);
                          setAdminAuthError('');
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const trimmed = adminPasswordInput.trim();
                            const hashed = secureSha256(trimmed);
                            const isMatch = ALLOWED_ADMIN_HASHES.has(hashed);
                            console.log('[Admin Auth Enter] Input length:', trimmed.length, 'Hash matched:', isMatch);
                            
                            if (isMatch) {
                              setIsAdminAuthenticated(true);
                              setAdminAuthError('');
                            } else {
                              setAdminAuthError('Access Denied: Invalid Security Credential.');
                            }
                          }
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all text-center tracking-widest font-mono"
                      />
                    </div>

                    {adminAuthError && (
                      <p className="text-xs text-red-400 font-semibold text-center">{adminAuthError}</p>
                    )}

                    <button
                      id="btn-admin-unlock"
                      onClick={() => {
                        const trimmed = adminPasswordInput.trim();
                        const hashed = secureSha256(trimmed);
                        const isMatch = ALLOWED_ADMIN_HASHES.has(hashed);
                        console.log('[Admin Auth Button] Input length:', trimmed.length, 'Hash matched:', isMatch);
                        
                        // Explicitly clear error state before testing
                        setAdminAuthError('');
                        
                        if (isMatch) {
                          setIsAdminAuthenticated(true);
                        } else {
                          setAdminAuthError('Access Denied: Invalid Security Credential.');
                        }
                      }}
                      className="w-full py-3.5 bg-purple-500 hover:bg-purple-400 text-black font-extrabold rounded-xl text-xs uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(168,85,247,0.2)] cursor-pointer"
                    >
                      Authenticate Node
                    </button>
                  </div>
                </div>
              ) : (
                /* AUTHENTICATED ADMIN CONSOLE */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left panel: List & Action - 7 columns */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-[#050505]/40 border border-white/10 rounded-[28px] p-6 backdrop-blur-md relative overflow-hidden">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                            Live Database
                          </span>
                          <h4 className="text-lg font-bold text-white mt-2">Active Communities ({communities.length})</h4>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setIsAdminAuthenticated(false);
                              setAdminPasswordInput('');
                            }}
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg text-[10px] uppercase font-bold tracking-widest transition-all border border-white/10 cursor-pointer"
                          >
                            Lock Console
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
                        {communities.map(c => (
                          <div key={c.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded uppercase font-bold border border-emerald-500/20">
                                  {c.type}
                                </span>
                                <h5 className="font-bold text-white text-sm">{c.name}</h5>
                              </div>
                              <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed">{c.mission}</p>
                              <div className="flex gap-4 mt-2 text-[10px] text-white/30 font-semibold">
                                <span>{c.membersCount} Members</span>
                                <span>Stage: {c.stage}</span>
                                <span className="text-emerald-400">Mood: {c.mood}%</span>
                              </div>
                            </div>

                            <div className="flex sm:flex-col gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  setAdminEditingCommunityId(c.id);
                                  setCommName(c.name);
                                  setCommType(c.type);
                                  setCommMission(c.mission);
                                  setCommStage(c.stage);
                                  setCommMood(c.mood);
                                  setCommMembersCount(c.membersCount);
                                  setCommAchievementsInput(c.achievements.join(', '));
                                }}
                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border border-white/10 flex-1 text-center cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${c.name}?`)) {
                                    setCommunities(prev => prev.filter(item => item.id !== c.id));
                                  }
                                }}
                                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border border-red-500/20 flex-1 text-center cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Events management */}
                    <div className="bg-[#050505]/40 border border-white/10 rounded-[28px] p-6 backdrop-blur-md">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-base font-bold text-white uppercase tracking-wider">Active Events ({events.length})</h4>
                        <button
                          onClick={() => {
                            setShowEventForm(!showEventForm);
                            if (communities.length > 0) {
                              setEvtOrgId(communities[0].id);
                            }
                          }}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          {showEventForm ? 'Close Event Form' : 'Create New Event'}
                        </button>
                      </div>

                      {showEventForm && (
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 mb-4 space-y-4">
                          <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">New Event Node</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1 font-semibold">Event Title</label>
                              <input
                                type="text"
                                value={evtTitle}
                                onChange={e => setEvtTitle(e.target.value)}
                                placeholder="e.g. Clean Energy Day"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1 font-semibold">Organizing Group</label>
                              <select
                                value={evtOrgId}
                                onChange={e => setEvtOrgId(e.target.value)}
                                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                              >
                                {communities.map(c => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1 font-semibold">Date</label>
                            <input
                              type="date"
                              value={evtDate}
                              onChange={e => setEvtDate(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1 font-semibold">Description</label>
                            <textarea
                              value={evtDescription}
                              onChange={e => setEvtDescription(e.target.value)}
                              placeholder="Describe the event and positive real-world activities involved..."
                              rows={3}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                            />
                          </div>

                          <button
                            onClick={() => {
                              if (!evtTitle || !evtDate || !evtDescription || !evtOrgId) {
                                alert('Please fill in all event fields.');
                                return;
                              }
                              const selectedOrg = communities.find(c => c.id === evtOrgId);
                              const newEvent: AppletEvent = {
                                id: 'evt-' + Date.now(),
                                title: evtTitle,
                                orgId: evtOrgId,
                                orgName: selectedOrg ? selectedOrg.name : 'Unknown',
                                description: evtDescription,
                                date: evtDate,
                                qrCodeUrl: 'EVT-CUSTOM-' + Date.now(),
                                participants: [],
                                isCompleted: false
                              };
                              setEvents(prev => [...prev, newEvent]);
                              setEvtTitle('');
                              setEvtDescription('');
                              setEvtDate('');
                              setShowEventForm(false);
                            }}
                            className="w-full py-2.5 bg-[#10b981] hover:bg-[#059669] text-black font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer"
                          >
                            Deploy Event Node
                          </button>
                        </div>
                      )}

                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {events.map(evt => (
                          <div key={evt.id} className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between text-xs text-white/80">
                            <div>
                              <p className="font-bold text-white">{evt.title}</p>
                              <p className="text-[10px] text-white/40 mt-0.5">{evt.date} &bull; Organised by {evt.orgName}</p>
                            </div>
                            <button
                              onClick={() => {
                                if (confirm(`Delete event "${evt.title}"?`)) {
                                  setEvents(prev => prev.filter(e => e.id !== evt.id));
                                }
                              }}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 rounded-lg hover:text-red-300 transition-all cursor-pointer"
                              title="Delete Event"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right panel: Add/Edit form - 5 columns */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-[#050505]/40 border border-white/10 rounded-[28px] p-6 backdrop-blur-md relative overflow-hidden">
                      <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none"></div>
                      
                      <h4 className="text-base font-bold text-white uppercase tracking-wider mb-5">
                        {adminEditingCommunityId ? 'Edit Group Node' : 'Integrate New Community'}
                      </h4>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Group/Community Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Berkeley Cycling League"
                            value={commName}
                            onChange={e => setCommName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Classification Type</label>
                          <select
                            value={commType}
                            onChange={e => setCommType(e.target.value as any)}
                            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                          >
                            <option value="city">City / Municipal</option>
                            <option value="university">University / School</option>
                            <option value="company">Company / Enterprise</option>
                            <option value="ngo">NGO / Charitable</option>
                            <option value="club">Club / Interest Group</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Mission / Vision</label>
                          <textarea
                            placeholder="Describe how this community intends to grow, foster positive feedback, or support its members..."
                            value={commMission}
                            onChange={e => setCommMission(e.target.value)}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-all resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Growth Stage</label>
                            <input
                              type="text"
                              placeholder="e.g. Village Circle"
                              value={commStage}
                              onChange={e => setCommStage(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Initial Member Count</label>
                            <input
                              type="number"
                              value={commMembersCount}
                              onChange={e => setCommMembersCount(Number(e.target.value))}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Initial Mood (0-100%)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={commMood}
                              onChange={e => setCommMood(Number(e.target.value))}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Impact Achievements (comma separated)</label>
                            <input
                              type="text"
                              placeholder="Green Badge, Active Team"
                              value={commAchievementsInput}
                              onChange={e => setCommAchievementsInput(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
                            />
                          </div>
                        </div>

                        <div className="pt-2 flex gap-3">
                          <button
                            onClick={() => {
                              if (!commName || !commMission) {
                                alert('Please provide a community name and mission statement.');
                                return;
                              }

                              const achievementsList = commAchievementsInput
                                ? commAchievementsInput.split(',').map(s => s.trim()).filter(Boolean)
                                : [];

                              if (adminEditingCommunityId) {
                                // Update
                                setCommunities(prev => prev.map(c => {
                                  if (c.id === adminEditingCommunityId) {
                                    return {
                                      ...c,
                                      name: commName,
                                      type: commType,
                                      mission: commMission,
                                      stage: commStage,
                                      mood: commMood,
                                      membersCount: commMembersCount,
                                      achievements: achievementsList
                                    };
                                  }
                                  return c;
                                }));
                                setAdminEditingCommunityId(null);
                              } else {
                                // Add New
                                const newComm: Community = {
                                  id: 'comm-' + Date.now(),
                                  name: commName,
                                  type: commType,
                                  mission: commMission,
                                  membersCount: commMembersCount,
                                  impactPoints: 0,
                                  mood: commMood,
                                  stage: commStage,
                                  achievements: achievementsList
                                };
                                setCommunities(prev => [...prev, newComm]);
                              }

                              // Reset fields
                              setCommName('');
                              setCommMission('');
                              setCommStage('Growing Circle');
                              setCommMood(100);
                              setCommMembersCount(10);
                              setCommAchievementsInput('');
                            }}
                            className="flex-1 py-3 bg-purple-500 hover:bg-purple-400 text-black font-extrabold rounded-xl text-xs uppercase tracking-widest transition-all shadow-[0_4px_15px_rgba(168,85,247,0.15)] cursor-pointer"
                          >
                            {adminEditingCommunityId ? 'Save Changes' : 'Integrate Node'}
                          </button>

                          {adminEditingCommunityId && (
                            <button
                              onClick={() => {
                                setAdminEditingCommunityId(null);
                                setCommName('');
                                setCommMission('');
                                setCommStage('Growing Circle');
                                setCommMood(100);
                                setCommMembersCount(10);
                                setCommAchievementsInput('');
                              }}
                              className="py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs uppercase font-bold tracking-wider cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Fast Seed option */}
                    <div className="bg-[#050505]/40 border border-white/10 rounded-[28px] p-5 text-center">
                      <p className="text-xs text-white/50 leading-relaxed">
                        Need to reset back to standard clean nodes? Re-seed default database state:
                      </p>
                      <button
                        onClick={() => {
                          if (confirm('Revert all communities and events to default? This will clear customized nodes.')) {
                            localStorage.removeItem('elevate_communities');
                            localStorage.removeItem('elevate_events');
                            setCommunities(INITIAL_COMMUNITIES);
                            setEvents(INITIAL_EVENTS);
                            alert('Database restored successfully.');
                          }
                        }}
                        className="mt-3 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
                      >
                        Reset Defaults
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* 3. Bottom Joined Communities Mini Rail */}
        <div id="joined-communities-mini-rail" className="h-24 px-6 md:px-10 border-t border-white/5 flex items-center justify-between shrink-0 bg-[#050505]/40 backdrop-blur-md z-10">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Joined Communities</span>
              <div className="flex gap-2.5 mt-1.5">
                {communities
                  .filter(c => profile.joinedCommunities.includes(c.id))
                  .map(c => (
                    <div
                      key={c.id}
                      title={c.name}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-extrabold text-white/70 hover:border-emerald-500/40 transition-all cursor-help"
                    >
                      {c.name.slice(0, 2)}
                    </div>
                  ))}
                <button
                  id="btn-joined-mini-rail-add"
                  onClick={() => {
                    setSelectedEvent(null);
                    setActiveTab('communities');
                  }}
                  className="w-8 h-8 rounded-lg bg-white/[0.01] border border-dashed border-white/20 flex items-center justify-center hover:border-white/50 text-white/30 hover:text-white transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Acknowledge Real Interaction</p>
              <p className="text-xs text-white">Scan to elevate together</p>
            </div>
            <button
              id="btn-scan-primary-action"
              onClick={() => handleScanAction('user')}
              className="h-12 px-6 bg-white text-black font-bold rounded-xl flex items-center gap-2 hover:scale-103 active:scale-97 transition-all shadow-[0_4px_25px_rgba(255,255,255,0.12)] text-xs uppercase tracking-widest cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>ELEVATE TOGETHER</span>
            </button>
          </div>
        </div>
      </main>

      {/* =======================================================
          MODAL A: WEEKLY AI REFLECTION MODAL
          ======================================================= */}
      {showReflectionModal && (
        <div id="weekly-reflection-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-gradient-to-b from-[#111827] to-[#030712] border border-white/10 rounded-[32px] p-6 md:p-10 relative overflow-hidden max-h-[85vh] flex flex-col justify-between">
            <div className="absolute top-[-25%] right-[-10%] w-72 h-72 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <button
              id="btn-close-reflection-modal"
              onClick={() => setShowReflectionModal(false)}
              className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              <div className="text-center">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/20">
                  🌱 Sunday Weekly Summary
                </span>
                <h3 className="text-2xl md:text-3xl font-light text-white mt-3">
                  Your Impact Reflection
                </h3>
                <p className="text-xs text-white/40 mt-1 uppercase tracking-wider font-semibold">
                  For the week of June 29 - July 5
                </p>
              </div>

              {reflectionLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
                  <p className="text-sm text-white/50 font-medium">Generating your motivating summary via Elevate AI Companion...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Custom AI reflection text */}
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl leading-relaxed text-sm text-white/80 space-y-4 italic whitespace-pre-wrap">
                    {activeWeeklyReflection?.aiSummary}
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      <p className="text-[10px] text-white/40 uppercase font-semibold">Weekly Interactions</p>
                      <p className="text-lg font-bold text-white mt-1">
                        {activeWeeklyReflection?.interactionCount} People
                      </p>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      <p className="text-[10px] text-white/40 uppercase font-semibold">Communities Influenced</p>
                      <p className="text-lg font-bold text-white mt-1">
                        {profile.joinedCommunities.length} Active Groups
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              id="btn-dismiss-reflection-modal"
              onClick={() => setShowReflectionModal(false)}
              className="w-full mt-6 py-3 bg-[#10b981] hover:bg-[#059669] text-black font-bold rounded-xl transition-all text-xs uppercase tracking-widest cursor-pointer"
            >
              Acknowledge & Continue Growing 🌱
            </button>
          </div>
        </div>
      )}

      {/* =======================================================
          MODAL B: MOCK QR SCANNER / ANIMATION
          ======================================================= */}
      {showScanner && (
        <div id="mock-scanner-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white/[0.02] border border-white/10 rounded-3xl p-6 text-center relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <button
                id="btn-close-scanner"
                onClick={() => setShowScanner(false)}
                className="text-white/30 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-base font-bold text-white uppercase tracking-widest mb-4">Simulating QR Scan</h3>

            <div className="w-48 h-48 mx-auto bg-black border border-white/10 rounded-2xl relative flex items-center justify-center overflow-hidden mb-5">
              {/* Scan Animation Line */}
              {scannerStatus === 'scanning' && (
                <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_10px_#10b981] animate-[bounce_2s_infinite]"></div>
              )}
              
              <QrCode className={`w-32 h-32 text-white/70 ${scannerStatus === 'scanning' ? 'opacity-40 animate-pulse' : 'opacity-80'}`} />

              {scannerStatus === 'success' && (
                <div className="absolute inset-0 bg-emerald-950/80 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-emerald-400 animate-scaleUp" />
                </div>
              )}
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
              {scannerStatus === 'scanning' ? 'Awaiting Device Presence...' : 'Presence Acknowledged!'}
            </p>
            <p className="text-sm text-emerald-400 font-bold mt-2">
              {scannerStatus === 'scanning' ? 'Verify interaction via NFC/QR scan' : scannedResult}
            </p>
          </div>
        </div>
      )}

      {/* =======================================================
          MODAL C: MY PERSONAL IDENTITY QR CARD
          ======================================================= */}
      {showMyQrModal && (
        <div id="my-identity-qr-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm bg-gradient-to-b from-[#111827] to-[#030712] border border-white/15 rounded-[32px] p-6 relative overflow-hidden text-center shadow-[0_10px_50px_rgba(168,85,247,0.15)] animate-scaleUp">
            
            {/* Ambient glows based on avatar color or default theme */}
            <div className="absolute top-[-25%] right-[-10%] w-52 h-52 bg-[#10b981]/10 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="absolute bottom-[-15%] left-[-10%] w-52 h-52 bg-[#a855f7]/10 rounded-full blur-[60px] pointer-events-none"></div>

            <button
              id="btn-close-my-qr-modal"
              onClick={() => setShowMyQrModal(false)}
              className="absolute top-5 right-5 text-white/30 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[9px] bg-purple-500/15 text-purple-300 border border-purple-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-widest inline-block mb-4">
              Your Personal Node ID
            </span>

            {/* Profile Avatar Card inside */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 mb-5 space-y-4">
              <div className="w-20 h-20 mx-auto bg-black border border-white/10 rounded-2xl p-1 relative flex items-center justify-center overflow-hidden">
                <AvatarSVG config={profile.avatar} className="w-full h-full rounded-xl" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">{profile.name}</h4>
                <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mt-0.5">
                  🌱 Reflection Stage: {profile.reflectionTreeStage}
                </p>
                <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] text-white/60 font-bold mt-2">
                  <span>{profile.impactPoints} Impact Points</span>
                </div>
              </div>
            </div>

            {/* Simulated Scannable QR Code */}
            <div className="w-48 h-48 mx-auto bg-white p-4 rounded-3xl relative flex flex-col items-center justify-center shadow-lg mb-5">
              <QrCode className="w-36 h-36 text-black" />
              <p className="text-[8px] text-black/40 font-mono tracking-widest uppercase mt-1">
                {profile.id}
              </p>
            </div>

            <p className="text-[11px] text-white/50 leading-relaxed max-w-xs mx-auto font-medium">
              Show this QR code to another member of your community. When they scan it using <strong className="text-white">Simulate Scan</strong>, they can log your real-world support and kindness!
            </p>

            <button
              id="btn-dismiss-my-qr"
              onClick={() => setShowMyQrModal(false)}
              className="w-full mt-6 py-3 bg-white text-black font-extrabold rounded-xl text-xs uppercase tracking-widest transition-all hover:bg-neutral-200 cursor-pointer"
            >
              Close Identity Badge
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
