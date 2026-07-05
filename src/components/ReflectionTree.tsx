/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ReflectionTreeStage } from '../types';

interface ReflectionTreeProps {
  stage: ReflectionTreeStage;
  className?: string;
}

export const ReflectionTree: React.FC<ReflectionTreeProps> = ({ stage, className = '' }) => {
  // Let's design gorgeous SVG representation for each stage
  const renderTreeSVG = () => {
    switch (stage) {
      case 'Seed':
        return (
          <g>
            {/* Ground */}
            <path d="M 40 160 Q 100 150 160 160" stroke="#ffffff" strokeWidth="2" opacity="0.1" fill="none" />
            <ellipse cx="100" cy="160" rx="35" ry="8" fill="#14532d" opacity="0.3" />
            {/* Seed */}
            <path d="M 100 145 C 93 145, 93 155, 100 158 C 107 155, 107 145, 100 145 Z" fill="#d97706" />
            {/* Ambient magic spark */}
            <circle cx="100" cy="130" r="3" fill="#10b981" className="animate-ping" />
            <circle cx="100" cy="130" r="1.5" fill="#34d399" />
          </g>
        );
      case 'Sprout':
        return (
          <g>
            {/* Ground */}
            <path d="M 40 160 Q 100 150 160 160" stroke="#ffffff" strokeWidth="2" opacity="0.1" fill="none" />
            <ellipse cx="100" cy="160" rx="45" ry="10" fill="#14532d" opacity="0.4" />
            {/* Tiny Stem */}
            <path d="M 100 160 Q 98 140 102 125" stroke="#10b981" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Left Leaf */}
            <path d="M 99 135 C 85 130, 85 120, 99 128 Z" fill="#34d399" />
            {/* Right Leaf */}
            <path d="M 101 130 C 115 125, 115 115, 101 123 Z" fill="#059669" />
            {/* Glow */}
            <circle cx="100" cy="115" r="8" fill="#10b981" opacity="0.2" className="animate-pulse" />
          </g>
        );
      case 'Sapling':
        return (
          <g>
            {/* Ground */}
            <path d="M 40 160 Q 100 150 160 160" stroke="#ffffff" strokeWidth="2" opacity="0.1" fill="none" />
            <ellipse cx="100" cy="160" rx="55" ry="12" fill="#14532d" opacity="0.5" />
            {/* Main Trunk */}
            <path d="M 100 160 Q 97 120 102 90" stroke="#059669" strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* Branches */}
            <path d="M 99 125 Q 80 115 75 105" stroke="#059669" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 101 115 Q 120 105 125 95" stroke="#059669" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Foliage/Nodes */}
            <circle cx="75" cy="105" r="8" fill="#34d399" opacity="0.9" />
            <circle cx="125" cy="95" r="9" fill="#10b981" opacity="0.9" />
            <circle cx="102" cy="90" r="11" fill="#059669" opacity="0.9" />
            {/* Magic Nodes */}
            <circle cx="102" cy="90" r="3" fill="#67e8f9" className="animate-pulse" />
          </g>
        );
      case 'Young Tree':
        return (
          <g>
            {/* Ground */}
            <ellipse cx="100" cy="160" rx="65" ry="14" fill="#064e3b" opacity="0.6" />
            {/* Trunk with gradient style */}
            <path d="M 98 160 L 102 160 L 101 80 L 99 80 Z" fill="#047857" />
            {/* Branches */}
            <path d="M 100 130 C 80 120, 70 95, 65 90" stroke="#047857" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 100 115 C 120 105, 130 85, 135 80" stroke="#047857" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 100 100 C 90 85, 95 65, 95 60" stroke="#047857" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Foliage Layers */}
            <circle cx="65" cy="90" r="16" fill="#10b981" opacity="0.45" />
            <circle cx="65" cy="90" r="12" fill="#059669" opacity="0.8" />
            
            <circle cx="135" cy="80" r="18" fill="#3b82f6" opacity="0.45" />
            <circle cx="135" cy="80" r="13" fill="#2563eb" opacity="0.8" />
            
            <circle cx="95" cy="60" r="20" fill="#a855f7" opacity="0.45" />
            <circle cx="95" cy="60" r="14" fill="#7e22ce" opacity="0.8" />

            {/* Glowing leaves */}
            <circle cx="65" cy="90" r="4" fill="#a7f3d0" className="animate-ping" />
            <circle cx="135" cy="80" r="4" fill="#bfdbfe" className="animate-ping" />
            <circle cx="95" cy="60" r="4" fill="#f5d0fe" className="animate-ping" />
          </g>
        );
      case 'Blooming Tree':
        return (
          <g>
            {/* Ground */}
            <ellipse cx="100" cy="165" rx="75" ry="16" fill="#022c22" opacity="0.7" />
            {/* Roots */}
            <path d="M 94 165 Q 85 170 75 172" stroke="#064e3b" strokeWidth="4" fill="none" />
            <path d="M 106 165 Q 115 170 125 172" stroke="#064e3b" strokeWidth="4" fill="none" />
            {/* Trunk */}
            <path d="M 96 165 Q 96 110 98 70 L 102 70 Q 104 110 104 165 Z" fill="#065f46" />
            {/* Rich branches */}
            <path d="M 99 120 C 75 110, 60 80, 55 70" stroke="#065f46" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 101 105 C 125 95, 140 75, 145 65" stroke="#065f46" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 100 85 C 80 70, 85 45, 80 40" stroke="#065f46" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 100 85 C 120 70, 115 45, 120 40" stroke="#065f46" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Huge Glowing Bloom Foliage */}
            <g opacity="0.75" className="animate-[pulse_4s_infinite_ease-in-out]">
              <circle cx="55" cy="70" r="22" fill="#ec4899" />
              <circle cx="145" cy="65" r="24" fill="#a855f7" />
              <circle cx="80" cy="40" r="26" fill="#e879f9" />
              <circle cx="120" cy="40" r="26" fill="#f472b6" />
            </g>
            <g opacity="0.9">
              <circle cx="55" cy="70" r="16" fill="#db2777" />
              <circle cx="145" cy="65" r="18" fill="#7e22ce" />
              <circle cx="80" cy="40" r="20" fill="#c084fc" />
              <circle cx="120" cy="40" r="20" fill="#f472b6" />
            </g>

            {/* Glowing flower buds */}
            <circle cx="55" cy="70" r="3" fill="#ffffff" />
            <circle cx="145" cy="65" r="3" fill="#ffffff" />
            <circle cx="80" cy="40" r="3" fill="#ffffff" />
            <circle cx="120" cy="40" r="3" fill="#ffffff" />
          </g>
        );
      case 'Golden Tree':
        return (
          <g>
            {/* Ground */}
            <ellipse cx="100" cy="165" rx="80" ry="18" fill="#78350f" opacity="0.4" />
            {/* Golden light aura */}
            <circle cx="100" cy="90" r="55" fill="#f59e0b" opacity="0.12" filter="blur(15px)" className="animate-pulse" />
            {/* Trunk */}
            <path d="M 95 165 Q 94 105 97 60 L 103 60 Q 106 105 105 165 Z" fill="#d97706" />
            {/* Branches */}
            <path d="M 98 120 Q 70 100 50 85" stroke="#d97706" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 102 110 Q 130 90, 150 75" stroke="#d97706" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 100 80 Q 80 60, 75 45" stroke="#d97706" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 100 80 Q 120 60, 125 45" stroke="#d97706" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Golden Leaves */}
            <g opacity="0.8" className="animate-[pulse_3s_infinite]">
              <circle cx="50" cy="85" r="24" fill="#fbbf24" />
              <circle cx="150" cy="75" r="26" fill="#f59e0b" />
              <circle cx="75" cy="45" r="28" fill="#fbbf24" />
              <circle cx="125" cy="45" r="28" fill="#f59e0b" />
              <circle cx="100" cy="30" r="25" fill="#fbbf24" />
            </g>
            <g opacity="0.95">
              <circle cx="50" cy="85" r="16" fill="#f59e0b" />
              <circle cx="150" cy="75" r="18" fill="#d97706" />
              <circle cx="75" cy="45" r="20" fill="#f59e0b" />
              <circle cx="125" cy="45" r="20" fill="#d97706" />
              <circle cx="100" cy="30" r="17" fill="#fbbf24" />
            </g>

            {/* Sparkles */}
            <g fill="#ffffff">
              <circle cx="50" cy="85" r="2" />
              <circle cx="150" cy="75" r="2" />
              <circle cx="75" cy="45" r="2" />
              <circle cx="125" cy="45" r="2" />
              <circle cx="100" cy="30" r="2" />
            </g>
          </g>
        );
      case 'Forest Guardian':
        return (
          <g>
            {/* Ground */}
            <ellipse cx="100" cy="165" rx="85" ry="20" fill="#022c22" opacity="0.9" />
            {/* Ancient protective rings */}
            <ellipse cx="100" cy="165" rx="75" ry="12" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.4" className="animate-spin" />
            {/* Multi-layered light halo */}
            <circle cx="100" cy="85" r="70" fill="#06b6d4" opacity="0.1" filter="blur(20px)" />
            <circle cx="100" cy="85" r="50" fill="#a855f7" opacity="0.08" filter="blur(15px)" />
            
            {/* Massive ancient trunk */}
            <path d="M 93 165 C 91 125, 95 90, 96 50 L 104 50 C 105 90, 109 125, 107 165 Z" fill="#0f172a" />
            {/* Celtic/ancient-style carvings on trunk */}
            <path d="M 98 140 Q 100 130 102 140" stroke="#10b981" strokeWidth="2" opacity="0.7" fill="none" />
            <path d="M 97 110 Q 100 100 103 110" stroke="#06b6d4" strokeWidth="2" opacity="0.7" fill="none" />

            {/* Majestic root system */}
            <path d="M 93 165 Q 80 175, 60 180" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 107 165 Q 120 175, 140 180" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" fill="none" />

            {/* Giant Spread Branches */}
            <path d="M 96 110 C 65 95, 50 75, 40 60" stroke="#0f172a" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M 104 100 C 135 85, 150 65, 160 50" stroke="#0f172a" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M 100 70 Q 75 40, 70 30" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 100 70 Q 125 40, 130 30" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" fill="none" />

            {/* Cosmic Guardian Canopy */}
            <g opacity="0.75" className="animate-[pulse_5s_infinite_ease-in-out]">
              <circle cx="40" cy="60" r="28" fill="#06b6d4" />
              <circle cx="160" cy="50" r="30" fill="#a855f7" />
              <circle cx="70" cy="30" r="32" fill="#10b981" />
              <circle cx="130" cy="30" r="32" fill="#ec4899" />
              <circle cx="100" cy="20" r="26" fill="#3b82f6" />
            </g>
            <g opacity="0.9">
              <circle cx="40" cy="60" r="18" fill="#0891b2" />
              <circle cx="160" cy="50" r="20" fill="#7e22ce" />
              <circle cx="70" cy="30" r="22" fill="#059669" />
              <circle cx="130" cy="30" r="22" fill="#db2777" />
              <circle cx="100" cy="20" r="18" fill="#2563eb" />
            </g>

            {/* Stellar star cluster around canopy */}
            <circle cx="40" cy="60" r="3" fill="#ffffff" className="animate-ping" />
            <circle cx="160" cy="50" r="3" fill="#ffffff" className="animate-ping" />
            <circle cx="70" cy="30" r="3" fill="#ffffff" className="animate-ping" />
            <circle cx="130" cy="30" r="3" fill="#ffffff" className="animate-ping" />
            <circle cx="100" cy="20" r="3" fill="#ffffff" className="animate-ping" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center w-full h-full min-h-[220px] ${className}`}>
      {/* Dynamic Backing Glow corresponding to the stage */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`w-48 h-48 rounded-full blur-[80px] pointer-events-none transition-all duration-1000 ${
            stage === 'Seed' || stage === 'Sprout'
              ? 'bg-emerald-500/5'
              : stage === 'Sapling' || stage === 'Young Tree'
              ? 'bg-cyan-500/10'
              : stage === 'Blooming Tree'
              ? 'bg-purple-500/10'
              : stage === 'Golden Tree'
              ? 'bg-amber-500/15 shadow-[0_0_50px_rgba(245,158,11,0.2)]'
              : 'bg-indigo-500/20 shadow-[0_0_60px_rgba(99,102,241,0.3)]'
          }`}
        />
      </div>

      <svg
        viewBox="0 0 200 200"
        className="w-full h-56 md:h-64 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderTreeSVG()}
      </svg>
    </div>
  );
};
