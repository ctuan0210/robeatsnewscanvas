import React, { useRef } from 'react';
import { SlotConfig, SongItem } from '../types';
import {
  Upload,
  Link as LinkIcon,
  Trash2,
  RotateCcw,
  Move,
  Palette,
} from 'lucide-react';

interface SlotEditorProps {
  slotType: 'star' | 'pro';
  slot: SlotConfig;
  onChange: (updated: Partial<SlotConfig>) => void;
  onOpenCatalog: () => void;
  songs: SongItem[];
}

export const SlotEditor: React.FC<SlotEditorProps> = ({
  slotType,
  slot,
  onChange,
  onOpenCatalog,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isStar = slotType === 'star';

  // Handle local image file upload (locks to Zoom 0.9x)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange({
          coverImage: reader.result as string,
          scale: 0.9, // Locked to 0.9x as requested
          offsetX: 0,
          offsetY: 0,
          fit: 'cover',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick score formatters
  const formatScoreWithDots = (val: string) => {
    const raw = val.replace(/[^0-9]/g, '');
    if (!raw) return val;
    const parts = [];
    let rem = raw;
    while (rem.length > 3) {
      parts.unshift(rem.slice(-3));
      rem = rem.slice(0, -3);
    }
    if (rem.length > 0) parts.unshift(rem);
    return parts.join('.');
  };

  const artistX = slot.artistOffsetX || 0;
  const artistY = slot.artistOffsetY || 0;
  const songX = slot.songOffsetX || 0;
  const songY = slot.songOffsetY || 0;

  const currentScoreSize = slot.scoreFontSize || 34;
  const currentStrokeWidth = slot.strokeWidth !== undefined ? slot.strokeWidth : 6;

  return (
    <div className="space-y-4">
      {/* 1. Cover Art (Locked Zoom 0.9x) */}
      <div className="bg-[#17122e] border border-purple-500/20 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400/50"></span>
            Cover art
          </label>
          {slot.coverImage && (
            <button
              onClick={() => onChange({ coverImage: '', scale: 0.9, offsetX: 0, offsetY: 0 })}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> Clear Cover
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-purple-400/40 hover:border-pink-400 bg-purple-900/10 hover:bg-purple-900/20 text-purple-200 text-xs font-medium transition cursor-pointer"
          >
            <Upload className="w-4 h-4 text-pink-400" />
            Upload Local Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Pick from Song List Button */}
          <button
            onClick={onOpenCatalog}
            className="flex items-center justify-center p-2.5 rounded-xl border border-purple-500/30 hover:border-purple-400 bg-purple-900/20 hover:bg-purple-900/40 text-purple-200 text-xs font-medium transition cursor-pointer"
          >
            Pick from Song List
          </button>
        </div>

        {/* URL Input */}
        <div className="relative">
          <LinkIcon className="w-3.5 h-3.5 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Or paste direct image URL (https://...)"
            value={slot.coverImage.startsWith('data:') ? '' : slot.coverImage}
            onChange={(e) => onChange({ coverImage: e.target.value, fit: 'cover', scale: 0.9 })}
            className="w-full bg-[#100c22] border border-purple-500/30 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-purple-400/40 focus:outline-none focus:border-pink-500 transition"
          />
        </div>
      </div>

      {/* 2. Text Edits */}
      <div className="bg-[#17122e] border border-purple-500/20 rounded-xl p-3.5 space-y-3">
        {/* Artist Input */}
        <div>
          <label className="text-xs font-semibold text-purple-200 block mb-1">
            Artist Name
          </label>
          <input
            type="text"
            value={slot.artist}
            onChange={(e) => onChange({ artist: e.target.value })}
            placeholder="e.g. FinnMK, Kawai Sprite, Camellia..."
            className="w-full bg-[#100c22] border border-purple-500/30 rounded-xl px-3 py-2 text-sm text-yellow-300 font-righteous placeholder-purple-400/40 focus:outline-none focus:border-yellow-400 transition"
          />
        </div>

        {/* Song Name Multiline Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-purple-200">
              Song Title
            </label>
            <span className="text-[10px] text-purple-400">Press Enter for new line</span>
          </div>
          <textarea
            rows={2}
            value={slot.songName}
            onChange={(e) => onChange({ songName: e.target.value })}
            placeholder="Type song title (wraps automatically or press Enter for a new line)"
            className="w-full bg-[#100c22] border border-purple-500/30 rounded-xl px-3 py-2 text-sm text-yellow-300 font-righteous placeholder-purple-400/40 focus:outline-none focus:border-yellow-400 transition resize-none"
          />
        </div>

        {/* Score Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-purple-200">
              Score
            </label>
            <div className="flex gap-1.5 text-[10px]">
              <button
                onClick={() => onChange({ score: formatScoreWithDots(slot.score) })}
                className="px-2 py-0.5 rounded bg-purple-800/40 hover:bg-purple-700/60 text-purple-200 border border-purple-600/30 transition cursor-pointer"
                title="Format with dots e.g. 12.345.678"
              >
                Add Dots (.)
              </button>
              <button
                onClick={() => onChange({ score: '12.345.678' })}
                className="px-2 py-0.5 rounded bg-purple-800/40 hover:bg-purple-700/60 text-purple-200 border border-purple-600/30 transition cursor-pointer"
              >
                Default
              </button>
            </div>
          </div>
          <input
            type="text"
            value={slot.score}
            onChange={(e) => onChange({ score: e.target.value })}
            placeholder="12.345.678"
            className="w-full bg-[#100c22] border border-purple-500/30 rounded-xl px-3 py-2 text-sm text-yellow-300 font-righteous tracking-wider placeholder-purple-400/40 focus:outline-none focus:border-yellow-400 transition"
          />
        </div>
      </div>

      {/* 3. Typography & Color (per Star / Pro Mission) */}
      <div className="bg-[#17122e] border border-purple-500/20 rounded-xl p-3.5 space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-pink-400" />
            {isStar ? 'Star Typography & Styling' : 'Pro Typography & Styling'}
          </label>
          <button
            onClick={() =>
              onChange({
                textColor: '#fed835',
                scoreColor: '#fed835',
                artistFontSize: 28,
                songFontSize: 34,
                scoreFontSize: 34,
                strokeWidth: 6,
              })
            }
            className="text-[11px] text-purple-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Reset Styles
          </button>
        </div>

        {/* Text Font Color (Artist & Song) */}
        <div className="flex items-center justify-between gap-3 bg-[#100c22] p-2.5 rounded-xl border border-purple-500/20">
          <span className="text-xs text-purple-300">Text Font Color:</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={slot.textColor || '#fed835'}
              onChange={(e) => onChange({ textColor: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
              title="Artist & Song Text Color"
            />
            <input
              type="text"
              value={slot.textColor || '#fed835'}
              onChange={(e) => onChange({ textColor: e.target.value })}
              className="w-24 bg-[#140f29] border border-purple-500/30 rounded-lg px-2 py-1 text-xs text-white uppercase font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* Score Font Color */}
        <div className="flex items-center justify-between gap-3 bg-[#100c22] p-2.5 rounded-xl border border-purple-500/20">
          <span className="text-xs text-purple-300">Score Text Font Color:</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={slot.scoreColor || '#fed835'}
              onChange={(e) => onChange({ scoreColor: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
              title="Score Text Font Color"
            />
            <input
              type="text"
              value={slot.scoreColor || '#fed835'}
              onChange={(e) => onChange({ scoreColor: e.target.value })}
              className="w-24 bg-[#140f29] border border-purple-500/30 rounded-lg px-2 py-1 text-xs text-white uppercase font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* Font Sizes Sliders */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <div className="flex justify-between text-[10px] text-purple-400 mb-1">
              <span>Artist Size</span>
              <span className="font-mono text-yellow-400">{slot.artistFontSize || 28}px</span>
            </div>
            <input
              type="range"
              min="18"
              max="44"
              value={slot.artistFontSize || 28}
              onChange={(e) => onChange({ artistFontSize: parseInt(e.target.value, 10) })}
              className="w-full accent-yellow-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-purple-400 mb-1">
              <span>Song Title Size</span>
              <span className="font-mono text-yellow-400">{slot.songFontSize || 34}px</span>
            </div>
            <input
              type="range"
              min="20"
              max="52"
              value={slot.songFontSize || 34}
              onChange={(e) => onChange({ songFontSize: parseInt(e.target.value, 10) })}
              className="w-full accent-yellow-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-purple-400 mb-1">
              <span>Score Size</span>
              <span className="font-mono text-yellow-400">{currentScoreSize}px</span>
            </div>
            <input
              type="range"
              min="20"
              max="52"
              value={currentScoreSize}
              onChange={(e) => onChange({ scoreFontSize: parseInt(e.target.value, 10) })}
              className="w-full accent-yellow-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-purple-400 mb-1">
              <span>Stroke Width</span>
              <span className="font-mono text-purple-300">{currentStrokeWidth}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              value={currentStrokeWidth}
              onChange={(e) => onChange({ strokeWidth: parseInt(e.target.value, 10) })}
              className="w-full accent-purple-400"
            />
          </div>
        </div>
      </div>

      {/* 4. Manual Text Movement (Artist & Song Name) */}
      <div className="bg-[#17122e] border border-purple-500/20 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-yellow-300" />
            Manual Text Movement
          </label>
          <button
            onClick={() =>
              onChange({
                artistOffsetX: 0,
                artistOffsetY: 0,
                songOffsetX: 0,
                songOffsetY: 0,
              })
            }
            className="text-[11px] text-purple-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Center All
          </button>
        </div>

        {/* Artist Position Sliders */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] text-purple-300">
            <span>Artist Position:</span>
            <span className="font-mono text-[10px] text-yellow-400">
              X: {artistX > 0 ? `+${artistX}` : artistX}px | Y: {artistY > 0 ? `+${artistY}` : artistY}px
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-purple-400 block">Move Left / Right</label>
              <input
                type="range"
                min="-150"
                max="150"
                value={artistX}
                onChange={(e) => onChange({ artistOffsetX: parseInt(e.target.value, 10) })}
                className="w-full accent-yellow-400"
              />
            </div>
            <div>
              <label className="text-[10px] text-purple-400 block">Move Up / Down</label>
              <input
                type="range"
                min="-100"
                max="100"
                value={artistY}
                onChange={(e) => onChange({ artistOffsetY: parseInt(e.target.value, 10) })}
                className="w-full accent-yellow-400"
              />
            </div>
          </div>
        </div>

        {/* Song Name Position Sliders */}
        <div className="space-y-1.5 pt-2 border-t border-purple-500/20">
          <div className="flex justify-between text-[11px] text-purple-300">
            <span>Song Title Position:</span>
            <span className="font-mono text-[10px] text-yellow-400">
              X: {songX > 0 ? `+${songX}` : songX}px | Y: {songY > 0 ? `+${songY}` : songY}px
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-purple-400 block">Move Left / Right</label>
              <input
                type="range"
                min="-150"
                max="150"
                value={songX}
                onChange={(e) => onChange({ songOffsetX: parseInt(e.target.value, 10) })}
                className="w-full accent-yellow-400"
              />
            </div>
            <div>
              <label className="text-[10px] text-purple-400 block">Move Up / Down</label>
              <input
                type="range"
                min="-100"
                max="100"
                value={songY}
                onChange={(e) => onChange({ songOffsetY: parseInt(e.target.value, 10) })}
                className="w-full accent-yellow-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
