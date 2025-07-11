'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// CSGO-inspired nickname generation patterns
const nicknamePatterns = [
  // Simple patterns
  (name: string) => name.toLowerCase(),
  (name: string) => name.toUpperCase(),
  (name: string) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
  
  // Mixed case patterns
  (name: string) => {
    return name.split('').map((char, i) => 
      i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
    ).join('');
  },
  
  // Letter substitutions
  (name: string) => name.toLowerCase().replace(/i/g, '1').replace(/o/g, '0'),
  (name: string) => name.toLowerCase().replace(/a/g, '4').replace(/e/g, '3'),
  (name: string) => name.toLowerCase().replace(/s/g, '5').replace(/t/g, '7'),
  
  // Add numbers
  (name: string) => name.toLowerCase() + Math.floor(Math.random() * 999),
  (name: string) => Math.floor(Math.random() * 999) + name.toLowerCase(),
  
  // CSGO pro-style patterns
  (name: string) => {
    const variations = ['x', 'z', 'q', 'k'];
    return name.toLowerCase() + variations[Math.floor(Math.random() * variations.length)];
  },
  
  // Shortened versions
  (name: string) => name.substring(0, 3).toLowerCase(),
  (name: string) => name.substring(0, 4).toLowerCase(),
  
  // Reversed
  (name: string) => name.toLowerCase().split('').reverse().join(''),
  
  // With underscores
  (name: string) => name.toLowerCase().replace(/\s+/g, '_'),
  
  // With dots
  (name: string) => name.toLowerCase().replace(/\s+/g, '.'),
];

// CSGO pro player inspired names (similar but not exact copies)
const proPlayerInspiredNames = [
  // Short, punchy names like ropz, donk
  'k1x', 'v0x', 'z3n', 'n0x', 'm4x', 'p1x', 't0x', 'b1x',
  'r4z', 'l4z', 'h4z', 'w4z', 'c4z', 'f4z', 'd4z', 'g4z',
  'k1ck', 'p1ck', 'r1ck', 't1ck', 'n1ck', 'm1ck', 's1ck', 'b1ck',
  
  // Clean, natural names (no leetspeak)
  'kix', 'vox', 'zen', 'nox', 'max', 'pix', 'tox', 'bix',
  'raz', 'laz', 'haz', 'waz', 'caz', 'faz', 'daz', 'gaz',
  'kick', 'pick', 'rick', 'tick', 'nick', 'mick', 'sick', 'bick',
  'nex', 'vex', 'rex', 'tex', 'dex', 'pex', 'sex', 'lex',
  
  // Mixed case names like ZywOo, NiKo
  'ZyK0', 'NiX0', 'MiK0', 'PiK0', 'TiK0', 'BiK0', 'SiK0', 'LiK0',
  'ZyN0', 'MiN0', 'PiN0', 'TiN0', 'BiN0', 'SiN0', 'LiN0', 'KiN0',
  'ZyX0', 'MiX0', 'PiX0', 'TiX0', 'BiX0', 'SiX0', 'LiX0', 'KiX0',
  
  // Clean mixed case names
  'ZyKo', 'NiXo', 'MiKo', 'PiKo', 'TiKo', 'BiKo', 'SiKo', 'LiKo',
  'ZyNo', 'MiNo', 'PiNo', 'TiNo', 'BiNo', 'SiNo', 'LiNo', 'KiNo',
  'ZyXo', 'MiXo', 'PiXo', 'TiXo', 'BiXo', 'SiXo', 'LiXo', 'KiXo',
  
  // Gaming style names
  'n00b', 'pr0', 'l33t', 'h4x', 'pwn', 'k1ll', 'w1n', 'b34t',
  'g0d', 'b0ss', 'k1ng', 'l0rd', 'd3m0n', 'gh0st', 'ph4nt0m', 'sh4d0w',
  'n1ght', 'd4rk', 'l1ght', 'st4r', 'm00n', 's0n', 'd4wn', 'tw1l1ght',
  
  // Clean gaming names
  'noob', 'pro', 'leet', 'hax', 'pwn', 'kill', 'win', 'beat',
  'god', 'boss', 'king', 'lord', 'demon', 'ghost', 'phantom', 'shadow',
  'night', 'dark', 'light', 'star', 'moon', 'son', 'dawn', 'twilight',
  
  // Action/combat inspired
  'sh00t', 'h1t', 'm1ss', 'd0dge', 'bl0ck', 'p4rry', 'r0ll', 'jump',
  'sl1de', 'cr4wl', 'w4lk', 'r4n', 'fl1p', 'sp1n', 'tw1st', 'b3nd',
  
  // Clean action names
  'shoot', 'hit', 'miss', 'dodge', 'block', 'parry', 'roll', 'jump',
  'slide', 'crawl', 'walk', 'run', 'flip', 'spin', 'twist', 'bend',
  
  // Tech/cyber inspired
  'h4ck', 'c0de', 'b1t', 'b4t', 'exe', 'dll', 'sys', 'n3t',
  'w1f1', 'blu3', 'r3d', 'gr33n', 'y3ll0w', 'purpl3', 'cy4n', 'm4g3nt4',
  
  // Clean tech names
  'hack', 'code', 'bit', 'bat', 'exe', 'dll', 'sys', 'net',
  'wifi', 'blue', 'red', 'green', 'yellow', 'purple', 'cyan', 'magenta',
  
  // Abstract/creative
  'v0id', 'n0va', 'puls3', 'w4v3', 'r4d1o', 't3l3', 'm1cr0', 'm4cr0',
  'n4n0', 'p1c0', 'f3mt0', '4tt0', 'z3pt0', 'y0ct0', 'x3ct0', 'w3ct0',
  
  // Clean abstract names
  'void', 'nova', 'pulse', 'wave', 'radio', 'tele', 'micro', 'macro',
  'nano', 'pico', 'femto', 'atto', 'zepto', 'yocto', 'xecto', 'wecto',
  
  // Longer, interesting names (~10 characters)
  'nightmare', 'shadowman', 'phantomx', 'demonlord', 'ghostrider',
  'cyberpunk', 'neonlight', 'digitalx', 'virtualx', 'quantumx',
  'stealthx', 'silentx', 'deadlyx', 'lethalx', 'fatalx',
  'invisible', 'untouchable', 'unstoppable', 'invincible', 'immortal',
  'legendary', 'mythical', 'mystical', 'magical', 'enchanted',
  'thunderx', 'lightning', 'stormx', 'hurricane', 'tornado',
  'firestorm', 'iceberg', 'volcano', 'earthquake', 'tsunami',
  'dragonx', 'phoenix', 'griffin', 'unicorn', 'pegasus',
  'warlord', 'commander', 'general', 'captain', 'sergeant',
  'assassin', 'sniperx', 'scoutx', 'spy', 'saboteur',
  'ninja', 'samurai', 'knight', 'paladin', 'berserker',
  'wizard', 'sorcerer', 'warlock', 'necromancer', 'druid',
  'hunter', 'ranger', 'archer', 'warrior', 'fighter',
  'monk', 'priest', 'cleric', 'shaman', 'druid',
  'rogue', 'thief', 'bandit', 'outlaw', 'criminal',
  'hero', 'villain', 'antihero', 'protagonist', 'antagonist',
  'master', 'apprentice', 'student', 'teacher', 'mentor',
  'guardian', 'protector', 'defender', 'champion', 'hero',
  'destroyer', 'annihilator', 'terminator', 'exterminator', 'eliminator'
];

export default function Home() {
  const [realName, setRealName] = useState('');
  const [nicknames, setNicknames] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateNicknames = () => {
    const generated: string[] = [];
    
    if (realName.trim()) {
      // Generate 3 nicknames based on the real name
      const usedPatterns = new Set<number>();
      let nameBasedCount = 0;
      
      while (nameBasedCount < 3 && usedPatterns.size < nicknamePatterns.length) {
        const patternIndex = Math.floor(Math.random() * nicknamePatterns.length);
        if (!usedPatterns.has(patternIndex)) {
          usedPatterns.add(patternIndex);
          const nickname = nicknamePatterns[patternIndex](realName);
          if (nickname && !generated.includes(nickname)) {
            generated.push(nickname);
            nameBasedCount++;
          }
        }
      }
    }
    
    // Fill remaining slots with pro player inspired names
    const shuffledPros = [...proPlayerInspiredNames].sort(() => Math.random() - 0.5);
    for (let i = 0; generated.length < 5; i++) {
      if (!generated.includes(shuffledPros[i])) {
        generated.push(shuffledPros[i]);
      }
    }
    
    setNicknames(generated);
    setCopiedIndex(null);
  };

  const copyToClipboard = async (nickname: string, index: number) => {
    try {
      await navigator.clipboard.writeText(nickname);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            CSGO Nickname
          </h1>
          <h2 className="text-xl font-bold text-orange-500 mb-6">
            Generator
          </h2>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="realName" className="block text-sm font-medium text-gray-300 mb-2">
              Enter your real name (optional)
            </label>
            <input
              id="realName"
              type="text"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              placeholder="e.g., John Smith (or leave empty for random)"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              onKeyPress={(e) => e.key === 'Enter' && generateNicknames()}
            />
          </div>

          <button
            onClick={generateNicknames}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Generate Nickname
          </button>
        </motion.div>

        {/* Nickname Suggestions */}
        <AnimatePresence>
          {nicknames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              <h3 className="text-lg font-semibold text-white text-center">
                Nickname Suggestions
              </h3>
              
              <div className="space-y-2">
                {nicknames.map((nickname, index) => (
                  <motion.div
                    key={`${nickname}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-orange-500 transition-all duration-200 cursor-pointer group"
                    onClick={() => copyToClipboard(nickname, index)}
                  >
                    <span className="text-white font-mono text-lg">{nickname}</span>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-orange-500 text-sm font-medium"
                    >
                      {copiedIndex === index ? 'Copied!' : 'Click to copy'}
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={generateNicknames}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
              >
                Regenerate
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
