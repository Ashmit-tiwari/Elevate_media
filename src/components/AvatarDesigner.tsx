/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AvatarConfig, UserProfile } from '../types';
import { COSMETICS } from '../data';
import { AvatarSVG } from './AvatarSVG';
import { Sparkles, Check, Lock } from 'lucide-react';

interface AvatarDesignerProps {
  profile: UserProfile;
  onChange: (newAvatar: AvatarConfig) => void;
  onUpdatePoints: (newPoints: number, unlockedItem: string) => void;
}

export const AvatarDesigner: React.FC<AvatarDesignerProps> = ({
  profile,
  onChange,
  onUpdatePoints,
}) => {
  const [activeTab, setActiveTab] = React.useState<'hairstyle' | 'hairColor' | 'skinTone' | 'clothing' | 'accessories' | 'background' | 'animationPose'>('hairstyle');

  const currentAvatar = profile.avatar;

  const handleSelect = (category: string, itemId: string, cost?: number) => {
    // Check if locked
    const isLocked = isItemLocked(category, itemId);
    if (isLocked && cost !== undefined) {
      if (profile.impactPoints >= cost) {
        // Unlock item!
        onUpdatePoints(profile.impactPoints - cost, `${category}:${itemId}`);
        const updated = { ...currentAvatar, [category]: itemId };
        onChange(updated);
      } else {
        alert(`You need ${cost} Impact Points to unlock this cosmetic reward! Keep participating in your community to grow and earn points. 🌱`);
      }
      return;
    }

    const updated = { ...currentAvatar, [category]: itemId };
    onChange(updated);
  };

  const isItemLocked = (category: string, itemId: string): boolean => {
    const registry = (COSMETICS as any)[category];
    if (!registry) {
      // Backgrounds has a custom key
      if (category === 'background') {
        const bg = COSMETICS.backgrounds.find(b => b.id === itemId);
        if (bg?.locked && !profile.unlockedCosmetics.includes(`background:${itemId}`)) return true;
      }
      return false;
    }
    const item = registry.find((i: any) => i.id === itemId);
    if (item?.locked && !profile.unlockedCosmetics.includes(`${category}:${itemId}`)) {
      return true;
    }
    return false;
  };

  const tabs = [
    { id: 'hairstyle', name: 'Hairstyle' },
    { id: 'hairColor', name: 'Hair Color' },
    { id: 'skinTone', name: 'Skin Tone' },
    { id: 'clothing', name: 'Outfit' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'background', name: 'Backdrop' },
    { id: 'animationPose', name: 'Pose' },
  ];

  return (
    <div id="avatar-designer-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Live Preview Side */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center bg-white/[0.02] border border-white/10 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active Identity</span>
        </div>

        <div className="w-64 h-64 my-6">
          <AvatarSVG config={currentAvatar} className="w-full h-full shadow-2xl" />
        </div>

        <div className="text-center">
          <h4 className="text-lg font-medium text-white/90">
            {profile.name || 'Anonymous Creator'}
          </h4>
          <p className="text-xs text-white/40 uppercase tracking-widest mt-1">
            Impact: <span className="text-emerald-400 font-bold">{profile.impactPoints} pts</span>
          </p>
        </div>
      </div>

      {/* Wardrobe Selector Side */}
      <div className="lg:col-span-7 bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col min-h-[400px]">
        {/* Gender / Vibe Preset Selector */}
        <div id="avatar-base-style-presets" className="mb-6 pb-5 border-b border-white/5">
          <label className="text-xs font-semibold uppercase tracking-widest text-white/50 block mb-3">
            Avatar Base Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'neutral', name: 'Neutral Style' },
              { id: 'masculine', name: 'Masculine Style' },
              { id: 'feminine', name: 'Feminine Style' }
            ].map(g => {
              const selected = currentAvatar.gender === g.id || (!currentAvatar.gender && g.id === 'neutral');
              return (
                <button
                  key={g.id}
                  id={`btn-preset-gender-${g.id}`}
                  onClick={() => {
                    const updated = {
                      ...currentAvatar,
                      gender: g.id,
                      // If switching to feminine, remove beard and default to long hair / dress if still on initial defaults
                      ...(g.id === 'feminine' ? {
                        beard: 'none',
                        hairstyle: currentAvatar.hairstyle === 'classic' ? 'long_sleek' : currentAvatar.hairstyle,
                        clothing: currentAvatar.clothing === 'hoodie' ? 'summer_dress' : currentAvatar.clothing
                      } : {}),
                      // If switching to masculine, reset highly feminine defaults if still on them
                      ...(g.id === 'masculine' ? {
                        hairstyle: currentAvatar.hairstyle === 'long_sleek' || currentAvatar.hairstyle === 'elegant_hijab' ? 'classic' : currentAvatar.hairstyle,
                        clothing: currentAvatar.clothing === 'summer_dress' ? 'hoodie' : currentAvatar.clothing
                      } : {})
                    };
                    onChange(updated);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-300 border text-center ${
                    selected
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : 'bg-white/5 border-transparent text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {g.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 border-b border-white/5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {tabs.map(t => (
            <button
              key={t.id}
              id={`tab-btn-${t.id}`}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                activeTab === t.id
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Dynamic Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 flex-1 max-h-[320px] overflow-y-auto pr-1">
          {activeTab === 'hairstyle' &&
            COSMETICS.hairstyles.map(item => {
              const locked = isItemLocked('hairstyles', item.id);
              const selected = currentAvatar.hairstyle === item.id;
              return (
                <button
                  key={item.id}
                  id={`item-hair-${item.id}`}
                  onClick={() => handleSelect('hairstyle', item.id, item.cost)}
                  className={`relative p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-24 ${
                    selected
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10 text-white/70'
                  }`}
                >
                  <span className="text-sm font-semibold block">{item.name}</span>
                  <div className="flex justify-between items-center w-full mt-auto">
                    {locked ? (
                      <span className="flex items-center gap-1 text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                        <Lock className="w-2.5 h-2.5" />
                        {item.cost} pts
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/40">Free / Unlocked</span>
                    )}
                    {selected && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                </button>
              );
            })}

          {activeTab === 'hairColor' &&
            COSMETICS.hairColors.map(item => {
              const locked = isItemLocked('hairColors', item.id);
              const selected = currentAvatar.hairColor === item.id;
              return (
                <button
                  key={item.id}
                  id={`item-haircolor-${item.id}`}
                  onClick={() => handleSelect('hairColor', item.id, item.cost)}
                  className={`relative p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-24 ${
                    selected
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10 text-white/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: item.value }}
                    ></span>
                    <span className="text-xs font-semibold">{item.name}</span>
                  </div>
                  <div className="flex justify-between items-center w-full mt-auto">
                    {locked ? (
                      <span className="flex items-center gap-1 text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                        <Lock className="w-2.5 h-2.5" />
                        {item.cost} pts
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/40">Free / Unlocked</span>
                    )}
                    {selected && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                </button>
              );
            })}

          {activeTab === 'skinTone' &&
            COSMETICS.skinTones.map(item => {
              const locked = isItemLocked('skinTones', item.id);
              const selected = currentAvatar.skinTone === item.id;
              return (
                <button
                  key={item.id}
                  id={`item-skintone-${item.id}`}
                  onClick={() => handleSelect('skinTone', item.id, item.cost)}
                  className={`relative p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-24 ${
                    selected
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10 text-white/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: item.value }}
                    ></span>
                    <span className="text-xs font-semibold">{item.name}</span>
                  </div>
                  <div className="flex justify-between items-center w-full mt-auto">
                    {locked ? (
                      <span className="flex items-center gap-1 text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                        <Lock className="w-2.5 h-2.5" />
                        {item.cost} pts
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/40">Free / Unlocked</span>
                    )}
                    {selected && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                </button>
              );
            })}

          {activeTab === 'clothing' &&
            COSMETICS.outfits.map(item => {
              const locked = isItemLocked('outfits', item.id);
              const selected = currentAvatar.clothing === item.id;
              return (
                <button
                  key={item.id}
                  id={`item-clothing-${item.id}`}
                  onClick={() => handleSelect('clothing', item.id, item.cost)}
                  className={`relative p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-24 ${
                    selected
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10 text-white/70'
                  }`}
                >
                  <span className="text-sm font-semibold block">{item.name}</span>
                  <div className="flex justify-between items-center w-full mt-auto">
                    {locked ? (
                      <span className="flex items-center gap-1 text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                        <Lock className="w-2.5 h-2.5" />
                        {item.cost} pts
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/40">Free / Unlocked</span>
                    )}
                    {selected && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                </button>
              );
            })}

          {activeTab === 'accessories' &&
            COSMETICS.accessories.map(item => {
              const locked = isItemLocked('accessories', item.id);
              const selected = currentAvatar.accessories === item.id;
              return (
                <button
                  key={item.id}
                  id={`item-acc-${item.id}`}
                  onClick={() => handleSelect('accessories', item.id, item.cost)}
                  className={`relative p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-24 ${
                    selected
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10 text-white/70'
                  }`}
                >
                  <span className="text-sm font-semibold block">{item.name}</span>
                  <div className="flex justify-between items-center w-full mt-auto">
                    {locked ? (
                      <span className="flex items-center gap-1 text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                        <Lock className="w-2.5 h-2.5" />
                        {item.cost} pts
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/40">Free / Unlocked</span>
                    )}
                    {selected && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                </button>
              );
            })}

          {activeTab === 'background' &&
            COSMETICS.backgrounds.map(item => {
              const locked = isItemLocked('background', item.id);
              const selected = currentAvatar.background === item.id;
              return (
                <button
                  key={item.id}
                  id={`item-bg-${item.id}`}
                  onClick={() => handleSelect('background', item.id, item.cost)}
                  className={`relative p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-24 ${
                    selected
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10 text-white/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded border border-white/20"
                      style={{ background: item.value }}
                    ></span>
                    <span className="text-xs font-semibold">{item.name}</span>
                  </div>
                  <div className="flex justify-between items-center w-full mt-auto">
                    {locked ? (
                      <span className="flex items-center gap-1 text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                        <Lock className="w-2.5 h-2.5" />
                        {item.cost} pts
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/40">Free / Unlocked</span>
                    )}
                    {selected && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                </button>
              );
            })}

          {activeTab === 'animationPose' &&
            COSMETICS.animationPoses.map(item => {
              const locked = isItemLocked('animationPoses', item.id);
              const selected = currentAvatar.animationPose === item.id;
              return (
                <button
                  key={item.id}
                  id={`item-pose-${item.id}`}
                  onClick={() => handleSelect('animationPose', item.id, item.cost)}
                  className={`relative p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-24 ${
                    selected
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10 text-white/70'
                  }`}
                >
                  <span className="text-sm font-semibold block">{item.name}</span>
                  <div className="flex justify-between items-center w-full mt-auto">
                    {locked ? (
                      <span className="flex items-center gap-1 text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                        <Lock className="w-2.5 h-2.5" />
                        {item.cost} pts
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/40">Free / Unlocked</span>
                    )}
                    {selected && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};
