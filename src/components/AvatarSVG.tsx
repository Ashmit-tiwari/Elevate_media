/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AvatarConfig } from '../types';
import { COSMETICS } from '../data';

interface AvatarSVGProps {
  config: AvatarConfig;
  className?: string;
  size?: number | string;
}

export const AvatarSVG: React.FC<AvatarSVGProps> = ({ config, className = '', size = '100%' }) => {
  // Extract values
  const skinColor = COSMETICS.skinTones.find(s => s.id === config.skinTone)?.value || '#fcd34d';
  const hairColor = COSMETICS.hairColors.find(h => h.id === config.hairColor)?.value || '#1a1a1a';
  const backgroundGrad = COSMETICS.backgrounds.find(b => b.id === config.background)?.value || COSMETICS.backgrounds[0].value;

  const isFeminine = config.gender === 'feminine';

  // Render hairstyle path
  const renderHair = () => {
    switch (config.hairstyle) {
      case 'curly':
        return (
          <g fill={hairColor}>
            <circle cx="90" cy="50" r="16" />
            <circle cx="110" cy="50" r="16" />
            <circle cx="100" cy="40" r="18" />
            <circle cx="80" cy="60" r="14" />
            <circle cx="120" cy="60" r="14" />
            <circle cx="100" cy="55" r="10" />
          </g>
        );
      case 'pompadour':
        return (
          <g fill={hairColor}>
            <path d="M 75 60 C 70 35, 100 20, 125 35 C 130 50, 125 65, 120 70 C 110 50, 90 50, 75 60 Z" />
            <path d="M 73 60 C 73 50, 85 45, 95 45 C 105 45, 120 50, 123 60 C 120 70, 80 70, 73 60 Z" />
          </g>
        );
      case 'bun':
        return (
          <g fill={hairColor}>
            {/* Bun on top */}
            <circle cx="100" cy="30" r="22" />
            {/* Side bangs */}
            <path d="M 73 65 C 70 45, 100 40, 100 60 C 100 40, 130 45, 127 65 C 120 75, 80 75, 73 65 Z" />
          </g>
        );
      case 'pixie':
        return (
          <g fill={hairColor}>
            <path d="M 74 65 C 72 45, 100 38, 126 48 C 128 58, 125 70, 123 75 C 115 62, 100 62, 85 75 C 78 72, 75 68, 74 65 Z" />
            {/* Jagged fringe */}
            <polygon points="76,62 84,68 88,58 98,68 102,58 112,68 118,58 124,65 120,50 80,50" />
          </g>
        );
      case 'long_sleek':
        return (
          <g fill={hairColor}>
            {/* Top/Front hair framing the face */}
            <path d="M 72 65 C 70 40, 130 40, 128 65 C 122 55, 110 52, 100 56 C 90 52, 78 55, 72 65 Z" />
            {/* Strands framing cheeks */}
            <path d="M 72 65 C 68 85, 70 115, 76 125 C 78 115, 76 85, 76 65 Z" />
            <path d="M 128 65 C 132 85, 130 115, 124 125 C 122 115, 124 85, 124 65 Z" />
          </g>
        );
      case 'chic_bob':
        return (
          <g fill={hairColor}>
            {/* Top cap and framing sides */}
            <path d="M 70 65 C 68 38, 132 38, 130 65 C 130 85, 126 105, 124 110 C 120 100, 125 75, 120 65 C 110 55, 90 55, 80 65 C 75 75, 80 100, 76 110 C 74 105, 70 85, 70 65 Z" />
          </g>
        );
      case 'space_buns':
        return (
          <g fill={hairColor}>
            {/* Left Bun */}
            <circle cx="70" cy="40" r="16" />
            {/* Right Bun */}
            <circle cx="130" cy="40" r="16" />
            {/* Hair base */}
            <path d="M 72 65 C 70 42, 130 42, 128 65 C 120 52, 80 52, 72 65 Z" />
            {/* Side bangs */}
            <path d="M 73 65 C 71 85, 76 100, 78 100 C 78 90, 77 75, 76 65 Z" />
            <path d="M 127 65 C 129 85, 124 100, 122 100 C 122 90, 123 75, 124 65 Z" />
          </g>
        );
      case 'side_ponytail':
        return (
          <g fill={hairColor}>
            {/* Hair tie */}
            <ellipse cx="126" cy="62" rx="6" ry="3" fill="#ec4899" />
            {/* Flowing ponytail on the side */}
            <path d="M 126 62 C 145 60, 155 90, 145 115 C 138 100, 140 75, 126 65 Z" />
            {/* Base hair */}
            <path d="M 72 65 C 70 42, 130 42, 128 65 C 120 52, 80 52, 72 65 Z" />
            {/* Sweeping fringe */}
            <path d="M 72 65 C 85 52, 115 52, 124 65 C 115 58, 85 58, 72 65 Z" />
          </g>
        );
      case 'box_braids':
        return (
          <g fill={hairColor}>
            {/* Hair cap with braided lines */}
            <path d="M 72 65 C 70 40, 130 40, 128 65 C 120 55, 80 55, 72 65 Z" />
            {/* front braided lines */}
            <path d="M 75 60 Q 100 50 125 60" stroke="#4b5563" strokeWidth="1.5" fill="none" opacity="0.5" />
            <path d="M 80 55 Q 100 45 120 55" stroke="#4b5563" strokeWidth="1.5" fill="none" opacity="0.5" />
            {/* Front hanging braids */}
            <path d="M 74 65 L 70 120 L 74 120 Z" />
            <path d="M 126 65 L 130 120 L 126 120 Z" />
            <path d="M 78 65 L 76 115 L 80 115 Z" />
            <path d="M 122 65 L 124 115 L 120 115 Z" />
          </g>
        );
      case 'elegant_hijab':
        return (
          <g>
            {/* Outer wrap (covers neck and shoulders) */}
            <path d="M 64 90 C 55 90, 48 135, 48 165 L 152 165 C 152 135, 145 90, 136 90 Z" fill={hairColor} />
            {/* Inner frame around the face */}
            <path d="M 100 55 C 75 55, 68 85, 68 100 C 68 122, 78 132, 100 132 C 122 132, 132 122, 132 100 C 132 85, 125 55, 100 55 Z" fill="#334155" opacity="0.25" />
            {/* Main folds */}
            <path d="M 70 65 C 65 40, 135 40, 130 65 C 142 85, 138 135, 118 142 C 100 148, 80 142, 70 125 C 62 105, 62 85, 70 65 Z" fill={hairColor} />
            {/* Draping details */}
            <path d="M 70 125 C 80 135, 120 135, 130 125" stroke="#4b5563" strokeWidth="2" fill="none" opacity="0.3" />
          </g>
        );
      case 'cyber_mohawk':
        return (
          <g>
            {/* Glow backing */}
            <path d="M 92 65 L 92 15 L 100 5 L 108 15 L 108 65 Z" fill={hairColor} opacity="0.3" filter="blur(4px)" />
            {/* Mohawk */}
            <path d="M 94 65 L 94 20 L 100 8 L 106 20 L 106 65 Z" fill={hairColor} />
            <path d="M 97 60 L 97 25 L 100 15 L 103 25 L 103 60 Z" fill="#ffffff" opacity="0.8" />
          </g>
        );
      case 'aurora_waves':
        return (
          <g fill={hairColor}>
            {/* Huge flowing locks */}
            <path d="M 70 70 C 60 90, 65 130, 80 140 C 90 145, 80 110, 85 90 Z" opacity="0.8" />
            <path d="M 130 70 C 140 90, 135 130, 120 140 C 110 145, 120 110, 115 90 Z" opacity="0.8" />
            {/* Base top */}
            <path d="M 72 65 C 70 40, 130 40, 128 65 C 120 50, 80 50, 72 65 Z" />
            {/* Wave accents */}
            <path d="M 76 60 Q 100 35 124 60" stroke="#22d3ee" strokeWidth="3" fill="none" opacity="0.6" />
          </g>
        );
      case 'classic':
      default:
        return (
          <g fill={hairColor}>
            <path d="M 72 65 C 70 45, 130 45, 128 65 C 120 52, 80 52, 72 65 Z" />
            <path d="M 73 65 C 73 58, 85 53, 100 53 C 115 53, 127 58, 127 65 C 120 58, 80 58, 73 65 Z" />
          </g>
        );
    }
  };

  // Render clothing
  const renderClothing = () => {
    switch (config.clothing) {
      case 'summer_dress':
        return (
          <g>
            {/* Dress bodice falling over shoulders */}
            <path d="M 70 140 C 60 145, 50 170, 50 200 L 150 200 C 150 170, 140 145, 130 140 Z" fill="#ec4899" />
            {/* Sweetheart neckline */}
            <path d="M 70 140 C 80 155, 100 158, 100 158 C 100 158, 120 155, 130 140 L 100 145 Z" fill={skinColor} />
            {/* Flower pattern accents */}
            <circle cx="75" cy="170" r="3" fill="#fef08a" />
            <circle cx="78" cy="173" r="3" fill="#fef08a" />
            <circle cx="125" cy="175" r="3" fill="#fef08a" />
            <circle cx="122" cy="178" r="3" fill="#fef08a" />
            <circle cx="100" cy="185" r="4" fill="#fef08a" />
          </g>
        );
      case 'blouse_skirt':
        return (
          <g>
            {/* Blouse body */}
            <path d="M 70 140 C 50 148, 45 195, 45 200 L 155 200 C 155 195, 150 148, 130 140 Z" fill="#e2e8f0" />
            {/* Neck V-line */}
            <polygon points="85,140 115,140 100,162" fill={skinColor} />
            {/* Pearl necklace string */}
            <circle cx="89" cy="148" r="2.5" fill="#ffffff" />
            <circle cx="94" cy="152" r="2.5" fill="#ffffff" />
            <circle cx="100" cy="154" r="3" fill="#ffffff" />
            <circle cx="106" cy="152" r="2.5" fill="#ffffff" />
            <circle cx="111" cy="148" r="2.5" fill="#ffffff" />
            {/* Pink ribbon bow */}
            <path d="M 97 162 Q 100 157 103 162" stroke="#ec4899" strokeWidth="2.5" fill="none" />
          </g>
        );
      case 'kimono':
        return (
          <g>
            {/* Kimono base */}
            <path d="M 70 140 C 50 145, 42 190, 42 200 L 158 200 C 158 190, 150 145, 130 140 Z" fill="#8b5cf6" />
            {/* Deep V folds */}
            <path d="M 70 140 L 100 185 L 108 185 L 78 140 Z" fill="#f43f5e" />
            <path d="M 130 140 L 100 185 L 92 185 L 122 140 Z" fill="#f43f5e" />
            {/* Obi belt */}
            <rect x="68" y="180" width="64" height="20" fill="#facc15" />
            {/* Sakura petal motifs */}
            <circle cx="60" cy="165" r="3.5" fill="#fbcfe8" opacity="0.8" />
            <circle cx="140" cy="170" r="3.5" fill="#fbcfe8" opacity="0.8" />
          </g>
        );
      case 'oversized_sweater':
        return (
          <g>
            {/* Sweater body */}
            <path d="M 68 140 C 48 146, 40 190, 40 200 L 160 200 C 160 190, 152 146, 132 140 Z" fill="#fda4af" />
            {/* Cozy thick neck collar */}
            <ellipse cx="100" cy="142" rx="28" ry="8" fill="#f43f5e" />
            {/* Knit arm line creases */}
            <path d="M 55 160 C 60 170, 70 175, 75 185" stroke="#e11d48" strokeWidth="2" fill="none" opacity="0.4" />
            <path d="M 145 160 C 140 170, 130 175, 125 185" stroke="#e11d48" strokeWidth="2" fill="none" opacity="0.4" />
          </g>
        );
      case 'blazer':
        return (
          <g>
            {/* White shirt base */}
            <polygon points="80,140 120,140 100,175" fill="#f8fafc" />
            {/* Dark tie */}
            <polygon points="97,148 103,148 105,170 100,178 95,170" fill="#a855f7" />
            {/* Blazer outer */}
            <path d="M 70 140 C 50 150, 45 195, 45 200 L 155 200 C 155 195, 150 150, 130 140 C 120 160, 100 185, 100 185 C 100 185, 80 160, 70 140 Z" fill="#1e293b" />
            {/* Lapels */}
            <polygon points="70,140 85,165 75,170" fill="#334155" />
            <polygon points="130,140 115,165 125,170" fill="#334155" />
          </g>
        );
      case 'robe':
        return (
          <g>
            {/* Robe body */}
            <path d="M 70 140 C 50 145, 45 190, 45 200 L 155 200 C 155 190, 150 145, 130 140 C 110 150, 90 150, 70 140 Z" fill="#d97706" opacity="0.85" />
            {/* Inner fold */}
            <path d="M 70 140 L 100 185 L 130 140 L 100 150 Z" fill="#fef3c7" opacity="0.9" />
            {/* Collar lining */}
            <path d="M 70 140 L 100 185 L 105 185 L 75 140 Z" fill="#f59e0b" />
          </g>
        );
      case 'tech_suit':
        return (
          <g>
            {/* Cyber armor */}
            <path d="M 70 140 C 50 148, 45 195, 45 200 L 155 200 C 155 195, 150 148, 130 140 Z" fill="#0f172a" />
            {/* Glowing nodes */}
            <circle cx="75" cy="155" r="5" fill="#06b6d4" className="animate-pulse" />
            <circle cx="125" cy="155" r="5" fill="#06b6d4" className="animate-pulse" />
            {/* Grid lines */}
            <path d="M 85 145 L 85 190 M 115 145 L 115 190 M 85 165 L 115 165" stroke="#3b82f6" strokeWidth="2" opacity="0.7" />
            {/* Glowing collar */}
            <path d="M 80 140 C 90 148, 110 148, 120 140" fill="none" stroke="#06b6d4" strokeWidth="3" />
          </g>
        );
      case 'galactic_cloak':
        return (
          <g>
            {/* Space cloak */}
            <path d="M 70 140 C 50 145, 40 190, 40 200 L 160 200 C 160 190, 150 145, 130 140 Z" fill="#1e1b4b" />
            {/* Nebula sparkles */}
            <circle cx="65" cy="165" r="2" fill="#e879f9" />
            <circle cx="135" cy="170" r="1.5" fill="#a78bfa" />
            <circle cx="100" cy="180" r="2.5" fill="#67e8f9" />
            <path d="M 100 140 C 90 155, 110 155, 100 190" stroke="#f472b6" strokeWidth="3" fill="none" opacity="0.6" />
          </g>
        );
      case 'hoodie':
      default:
        return (
          <g>
            {/* Hoodie body */}
            <path d="M 70 140 C 50 148, 45 195, 45 200 L 155 200 C 155 195, 150 148, 130 140 Z" fill="#3b82f6" />
            {/* Cowl collar */}
            <path d="M 70 140 C 70 125, 130 125, 130 140 C 120 150, 80 150, 70 140 Z" fill="#2563eb" />
            {/* Drawstrings */}
            <line x1="90" y1="148" x2="90" y2="175" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="110" y1="148" x2="110" y2="175" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="90" cy="175" r="3.5" fill="#ef4444" />
            <circle cx="110" cy="175" r="3.5" fill="#ef4444" />
          </g>
        );
    }
  };

  // Facial details (eyes, beard, glasses, mouth)
  const renderFaceDetails = () => {
    return (
      <g>
        {/* Eyebrows */}
        <g stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
          {config.eyebrows === 'expressive' ? (
            <>
              <path d="M 83 75 Q 92 70 95 76" fill="none" />
              <path d="M 105 76 Q 108 70 117 75" fill="none" />
            </>
          ) : (
            <>
              <line x1="82" y1="74" x2="94" y2="74" />
              <line x1="106" y1="74" x2="118" y2="74" />
            </>
          )}
        </g>

        {/* Eyes & Lash Extensions for Feminine Option */}
        <g fill="#1a1a1a">
          {config.eyes === 'happy' ? (
            <g stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round">
              <path d="M 84 84 Q 90 78 94 84" />
              <path d="M 106 84 Q 110 78 116 84" />
              {isFeminine && (
                <>
                  {/* Fluttery lashes on curved happy eyes */}
                  <path d="M 84 81 L 81 78" stroke="#1a1a1a" strokeWidth="1.8" />
                  <path d="M 94 81 L 97 78" stroke="#1a1a1a" strokeWidth="1.8" />
                  <path d="M 106 81 L 103 78" stroke="#1a1a1a" strokeWidth="1.8" />
                  <path d="M 116 81 L 119 78" stroke="#1a1a1a" strokeWidth="1.8" />
                </>
              )}
            </g>
          ) : config.eyes === 'focused' ? (
            <>
              <line x1="83" y1="83" x2="95" y2="83" stroke="#1a1a1a" strokeWidth="3.5" />
              <line x1="105" y1="83" x2="117" y2="83" stroke="#1a1a1a" strokeWidth="3.5" />
              <circle cx="89" cy="85" r="2.5" />
              <circle cx="111" cy="85" r="2.5" />
              {isFeminine && (
                <g stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="83" y1="83" x2="80" y2="79" />
                  <line x1="95" y1="83" x2="98" y2="79" />
                  <line x1="105" y1="83" x2="102" y2="79" />
                  <line x1="117" y1="83" x2="120" y2="79" />
                </g>
              )}
            </>
          ) : (
            <>
              <circle cx="89" cy="84" r="4.5" />
              <circle cx="111" cy="84" r="4.5" />
              {/* Eye sparkle */}
              <circle cx="90.5" cy="82.5" r="1.5" fill="#ffffff" />
              <circle cx="112.5" cy="82.5" r="1.5" fill="#ffffff" />
              {isFeminine && (
                <g stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none">
                  {/* Elegant upward curved eyelashes */}
                  <path d="M 85 81 Q 88 77 91 80" />
                  <path d="M 84 83 Q 86 79 89 81" />
                  <path d="M 115 81 Q 112 77 109 80" />
                  <path d="M 116 83 Q 114 79 111 81" />
                </g>
              )}
            </>
          )}
        </g>

        {/* Rosy Cheek Blush for Feminine Option */}
        {isFeminine && (
          <g opacity="0.4">
            <circle cx="78" cy="94" r="5" fill="#ec4899" filter="blur(1px)" />
            <circle cx="122" cy="94" r="5" fill="#ec4899" filter="blur(1px)" />
          </g>
        )}

        {/* Nose */}
        <path d="M 98 90 Q 100 95 102 90" stroke="#78350f" strokeWidth="2" fill="none" opacity="0.4" />

        {/* Beard (Only render if not feminine style to match preference) */}
        {!isFeminine && config.beard !== 'none' && (
          <g fill={hairColor} opacity="0.9">
            {config.beard === 'stubble' ? (
              <path d="M 78 100 C 80 128, 120 128, 122 100 C 114 114, 86 114, 78 100 Z" fill="#4b5563" opacity="0.5" />
            ) : config.beard === 'mustache' ? (
              <path d="M 90 102 Q 100 96 110 102 Q 100 104 90 102 Z" />
            ) : (
              // Full beard
              <path d="M 76 95 C 75 135, 125 135, 124 95 C 118 110, 82 110, 76 95 Z" />
            )}
          </g>
        )}

        {/* Mouth */}
        {config.mouth === 'smile' ? (
          isFeminine ? (
            // Pretty soft lips smiling
            <g>
              <path d="M 92 104 Q 100 114 108 104" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 92 104 Q 100 110 108 104" stroke="#fda4af" strokeWidth="1" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            <path d="M 92 104 Q 100 114 108 104" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          )
        ) : config.mouth === 'open' ? (
          <path d="M 93 103 C 93 103, 100 115, 107 103 Z" fill="#991b1b" />
        ) : (
          // Neutral
          <line x1="93" y1="105" x2="107" y2="105" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        )}
      </g>
    );
  };

  // Render Accessories
  const renderAccessories = () => {
    // Cross-compatible key lookup
    const accessoryId = config.accessories || config.glasses || 'none';

    switch (accessoryId) {
      case 'retro_glasses':
        return (
          <g stroke="#d97706" strokeWidth="3" fill="none" strokeLinecap="round">
            <circle cx="88" cy="84" r="11" />
            <circle cx="112" cy="84" r="11" />
            <line x1="99" y1="84" x2="101" y2="84" />
            <line x1="77" y1="84" x2="73" y2="81" />
            <line x1="123" y1="84" x2="127" y2="81" />
          </g>
        );
      case 'pearl_earrings':
        return (
          <g fill="#ffffff">
            {/* Render earrings if hijab isn't covering ears */}
            {config.hairstyle !== 'elegant_hijab' && (
              <>
                {/* Left earring */}
                <circle cx="65" cy="103" r="3.5" stroke="#fbbf24" strokeWidth="1" />
                <circle cx="65" cy="107" r="2" />
                {/* Right earring */}
                <circle cx="135" cy="103" r="3.5" stroke="#fbbf24" strokeWidth="1" />
                <circle cx="135" cy="107" r="2" />
              </>
            )}
          </g>
        );
      case 'flower_crown':
        return (
          <g>
            {/* Vine crown base */}
            <path d="M 70 60 Q 100 48 130 60" fill="none" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" />
            {/* Five colorful flower blossoms */}
            <circle cx="76" cy="56" r="5.5" fill="#ec4899" />
            <circle cx="76" cy="56" r="2" fill="#fef08a" />
            
            <circle cx="90" cy="52" r="5" fill="#f59e0b" />
            <circle cx="90" cy="52" r="1.5" fill="#ffffff" />

            <circle cx="100" cy="49" r="6.5" fill="#a855f7" />
            <circle cx="100" cy="49" r="2" fill="#fde047" />

            <circle cx="110" cy="52" r="5" fill="#10b981" />
            <circle cx="110" cy="52" r="1.5" fill="#ffffff" />

            <circle cx="124" cy="56" r="5.5" fill="#3b82f6" />
            <circle cx="124" cy="56" r="2" fill="#fef08a" />
          </g>
        );
      case 'cat_ears':
        return (
          <g>
            {/* Black headband wire */}
            <path d="M 75 60 C 80 50, 120 50, 125 60" fill="none" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
            {/* Left kitten ear */}
            <polygon points="76,55 64,30 84,40" fill="#111827" />
            <polygon points="74,51 67,34 81,41" fill="#fda4af" />
            {/* Right kitten ear */}
            <polygon points="124,55 136,30 116,40" fill="#111827" />
            <polygon points="122,51 133,34 119,41" fill="#fda4af" />
          </g>
        );
      case 'holo_visor':
        return (
          <g>
            {/* Glowing neon visor */}
            <path d="M 72 80 L 128 80 L 124 94 L 76 94 Z" fill="#06b6d4" opacity="0.8" className="animate-pulse" />
            <path d="M 72 80 L 128 80 L 124 94 L 76 94 Z" stroke="#22d3ee" strokeWidth="2" fill="none" />
            <line x1="78" y1="87" x2="122" y2="87" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
          </g>
        );
      case 'laurel_wreath':
        return (
          <g fill="#10b981">
            {/* Leaves lining the brow */}
            <path d="M 72 65 C 75 55, 95 55, 98 65" fill="none" stroke="#047857" strokeWidth="2" />
            <path d="M 128 65 C 125 55, 105 55, 102 65" fill="none" stroke="#047857" strokeWidth="2" />
            <circle cx="75" cy="58" r="3" />
            <circle cx="82" cy="54" r="3" />
            <circle cx="90" cy="53" r="3" />
            <circle cx="110" cy="53" r="3" />
            <circle cx="118" cy="54" r="3" />
            <circle cx="125" cy="58" r="3" />
          </g>
        );
      case 'none':
      default:
        return null;
    }
  };

  // Determine pose animations
  let poseClass = 'animate-none';
  if (config.animationPose === 'meditating') {
    poseClass = 'origin-center animate-[bounce_4s_infinite_ease-in-out]';
  } else if (config.animationPose === 'hovering') {
    poseClass = 'origin-center animate-[pulse_3s_infinite_ease-in-out] scale-102';
  } else {
    // Standing: gentle breathing
    poseClass = 'origin-bottom animate-[pulse_5s_infinite_ease-in-out]';
  }

  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 border border-white/10 ${className}`}
      style={{
        background: backgroundGrad,
        width: size,
        aspectRatio: '1 / 1',
      }}
    >
      {/* Background Particle FX for high-tier unlocks */}
      {config.background === 'nebula' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-40"></div>
          <div className="absolute top-2/3 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping opacity-70"></div>
        </div>
      )}

      <svg
        viewBox="0 0 200 200"
        className={`w-full h-full p-2 select-none ${poseClass}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="avatar-g">
          {/* Hair back layer for long styles */}
          {(config.hairstyle === 'aurora_waves' || config.hairstyle === 'long_sleek' || config.hairstyle === 'box_braids' || config.hairstyle === 'side_ponytail' || config.hairstyle === 'space_buns') && (
            <g fill={hairColor}>
              {config.hairstyle === 'aurora_waves' && (
                <path d="M 64 90 C 50 110, 50 150, 70 170 C 80 150, 75 110, 75 90 Z" opacity="0.5" />
              )}
              {config.hairstyle === 'long_sleek' && (
                <>
                  <path d="M 66 90 L 58 160 L 76 160 L 76 100 Z" />
                  <path d="M 134 90 L 142 160 L 124 160 L 124 100 Z" />
                </>
              )}
              {config.hairstyle === 'box_braids' && (
                <>
                  <path d="M 64 90 C 50 110, 55 170, 70 170 C 72 170, 75 110, 75 90 Z" opacity="0.8" />
                  <path d="M 136 90 C 150 110, 145 170, 130 170 C 128 170, 125 110, 125 90 Z" opacity="0.8" />
                </>
              )}
              {config.hairstyle === 'side_ponytail' && (
                <path d="M 124 64 C 136 70, 150 90, 144 120 C 134 110, 134 85, 124 64 Z" opacity="0.85" />
              )}
              {config.hairstyle === 'space_buns' && (
                <>
                  <circle cx="70" cy="40" r="14" opacity="0.7" />
                  <circle cx="130" cy="40" r="14" opacity="0.7" />
                </>
              )}
            </g>
          )}

          {/* Base Head Outline */}
          <g id="face">
            {/* Neck */}
            <rect x="92" y="115" width="16" height="30" fill={skinColor} rx="4" />
            {/* Shadow under chin */}
            <path d="M 92 120 C 92 120, 100 128, 108 120 Z" fill="#7c2d12" opacity="0.15" />
            
            {/* Face base shape */}
            <circle cx="100" cy="95" r="32" fill={skinColor} />
            {/* Ears (hidden if hijab is worn) */}
            {config.hairstyle !== 'elegant_hijab' && (
              <>
                <circle cx="66" cy="95" r="7" fill={skinColor} />
                <circle cx="134" cy="95" r="7" fill={skinColor} />
              </>
            )}
          </g>

          {/* Facial features (eyes, nose, beard, mouth, blush) */}
          {renderFaceDetails()}

          {/* Eyewear / Accessories */}
          {renderAccessories()}

          {/* Hair Top Layer */}
          {renderHair()}

          {/* Clothing / Torso */}
          {renderClothing()}
        </g>
      </svg>
    </div>
  );
};
