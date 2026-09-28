import React, { useState, useRef, useEffect } from 'react';
import { Character } from '../data/characters';
import { GameTheme } from '../data/themes';
import { PoopStyle } from '../data/poopStyles';
import { GameDifficulty, UserProfile, authService } from '../utils/auth';
import { GAME_RANKS, GameRank } from '../data/ranks';
import { PRESET_AVATARS } from '../data/avatars';
import { sound } from '../utils/audio';
import { processUploadedLogoFile, setCustomGameLogo } from '../utils/gameLogo';

interface StartScreenProps {
  currentUser: UserProfile;
  selectedCharacter: Character;
  selectedTheme: GameTheme;
  selectedPoopStyle: PoopStyle;
  difficulty: GameDifficulty;
  highScore: number;
  volume: number;
  isMuted: boolean;
  gameLogo: string;
  onUpdateGameLogo: (newLogo: string) => void;
  onStartGame: () => void;
  onOpenSettings: () => void;
  onOpenStages: () => void;
  onOpenCharacters: () => void;
  onOpenThemes: () => void;
  onOpenAccount: () => void;
  onChangeVolume: (newVol: number) => void;
  onToggleSound: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  currentUser,
  selectedCharacter,
  selectedTheme,
  selectedPoopStyle,
  highScore,
  volume,
  isMuted,
  gameLogo,
  onUpdateGameLogo,
  onStartGame,
  onOpenSettings,
  onOpenStages,
  onOpenCharacters,
  onOpenThemes,
  onOpenAccount,
  onChangeVolume,
  onToggleSound
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVolumePopover, setShowVolumePopover] = useState(false);
  const volumePopoverRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const currentRank: GameRank = GAME_RANKS.find(r => r.tier === currentUser.rankTier) || GAME_RANKS[0];
  const isGuest = authService.isGuest();
  const displayVolume = isMuted ? 0 : volume;

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processUploadedLogoFile(file);
      const saved = setCustomGameLogo(dataUrl);
      onUpdateGameLogo(saved);
      sound.playClickSound();
    } catch {
      // ignore invalid file
    } finally {
      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }
    }
  };

  // Close volume popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (volumePopoverRef.current && !volumePopoverRef.current.contains(e.target as Node)) {
        setShowVolumePopover(false);
      }
    };
    if (showVolumePopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showVolumePopover]);

  const toggleFullscreen = () => {
    sound.playClickSound();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || displayVolume === 0) return '🔇';
    if (displayVolume < 45) return '🔉';
    return '🔊';
  };

  return (
    <div
      className="relative w-full h-full max-h-screen overflow-hidden flex flex-col justify-between p-3 sm:p-5 select-none"
      style={{
        background: 'linear-gradient(180deg, #FFFDF8 0%, #FFF4E2 55%, #FDE5C0 100%)',
      }}
    >
      {/* Subtle bottom pastel hills only — upper area is 100% clear so nothing ever touches the title */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 overflow-hidden z-0">
        <div
          className="absolute -bottom-16 -left-12 right-12 h-32 rounded-[100%]"
          style={{ background: '#F7D49E', borderTop: '3px solid #E2B170' }}
        />
        <div
          className="absolute -bottom-18 left-16 -right-12 h-32 rounded-[100%]"
          style={{ background: '#F3C786', borderTop: '3px solid #D9A15B' }}
        />
      </div>

      {/* Top Utilities Header Bar */}
      <header className="relative w-full flex items-center justify-between gap-2 z-30 shrink-0">
        {/* LEFT: NÚT CÀI ĐẶT ⚙️ + Tài khoản Gmail & Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <button
            onClick={() => {
              sound.playClickSound();
              onOpenSettings();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 bg-gradient-to-b from-[#D27D2D] to-[#9A4E14] hover:from-[#E08E45] hover:to-[#8B4513] text-white font-black text-xs sm:text-sm rounded-2xl shadow-sm border-2 border-[#5C2C0C] active:scale-95 transition-all cursor-pointer shrink-0"
            title="Cài đặt trò chơi (Giao diện, Cục cứt, Mức chơi...)"
          >
            <span className="text-sm sm:text-base">⚙️</span>
            <span>Cài đặt</span>
          </button>

          {/* Gmail Account & Avatar Button */}
          <button
            onClick={() => {
              sound.playClickSound();
              onOpenAccount();
            }}
            className="flex items-center gap-2 px-2.5 py-1 bg-[#FFFDF9] hover:bg-[#FFF5E6] active:scale-95 transition-all rounded-2xl shadow-sm border-2 border-[#8B4513] text-xs font-black text-[#4A2511] cursor-pointer min-w-0"
            title="Đăng nhập Gmail & Đổi Avatar tài khoản"
          >
            <img
              src={currentUser.avatarUrl || PRESET_AVATARS[0].url}
              alt="Avatar"
              className="w-7 h-7 rounded-xl border-2 border-[#7A4419] object-cover bg-[#FFE8CC] shrink-0"
            />
            <div className="text-left min-w-0">
              <div className="truncate max-w-[90px] sm:max-w-[130px] text-[#4A2511] font-black leading-tight">
                {currentUser.displayName}
              </div>
              <div className="text-[10px] font-bold text-[#9A4E14] leading-tight truncate">
                {isGuest ? '📧 Đăng nhập Gmail' : `Lv.${currentUser.level} • Đổi Avatar`}
              </div>
            </div>
          </button>
        </div>

        {/* Right Action Controls: Volume 0-100 Slider Popover & Fullscreen */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Volume Button + 0-100 Popover */}
          <div className="relative" ref={volumePopoverRef}>
            <button
              onClick={() => {
                sound.playClickSound();
                setShowVolumePopover(prev => !prev);
              }}
              className="h-9 px-2.5 sm:px-3 rounded-2xl bg-[#FFFDF9] hover:bg-[#FFF5E6] active:scale-95 transition-all shadow-sm border-2 border-[#8B4513] flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#4A2511] cursor-pointer"
              title="Điều chỉnh âm lượng từ 0 - 100"
            >
              <span className="text-base">{getVolumeIcon()}</span>
              <span className="tabular-nums text-xs font-black text-[#6B3E26]">
                {displayVolume}%
              </span>
            </button>

            {/* 0 - 100 Volume Adjustment Popover */}
            {showVolumePopover && (
              <div className="absolute right-0 mt-2 w-64 p-3.5 rounded-2xl bg-[#FFFDF9] border-3 border-[#7A4419] shadow-2xl z-50 animate-fadeIn">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#4A2511] flex items-center gap-1.5">
                    <span>{getVolumeIcon()}</span>
                    <span>Âm lượng trò chơi</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#FDE8CD] border border-[#D4A373] text-xs font-black text-[#4A2511] tabular-nums">
                    {displayVolume} / 100
                  </span>
                </div>

                {/* Range Slider 0 - 100 */}
                <div className="flex items-center gap-2 my-2">
                  <span className="text-[11px] font-bold text-[#8C583A]">0</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={displayVolume}
                    onChange={e => onChangeVolume(Number(e.target.value))}
                    className="w-full h-2.5 bg-[#E6C7A6] rounded-lg appearance-none cursor-pointer accent-[#8B4513]"
                  />
                  <span className="text-[11px] font-bold text-[#8C583A]">100</span>
                </div>

                {/* Quick Preset Volume Buttons */}
                <div className="grid grid-cols-4 gap-1.5 mt-2.5">
                  {[0, 35, 70, 100].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        onChangeVolume(val);
                        if (val > 0) sound.playClickSound();
                      }}
                      className={`py-1 rounded-xl text-[11px] font-black border transition-all cursor-pointer ${
                        displayVolume === val
                          ? 'bg-[#8B4513] text-white border-[#4A2511]'
                          : 'bg-[#FFF6E9] hover:bg-[#FDE8CD] text-[#4A2511] border-[#D4A373]'
                      }`}
                    >
                      {val === 0 ? 'Tắt (0)' : `${val}%`}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onToggleSound();
                  }}
                  className="mt-2 w-full py-1.5 rounded-xl bg-[#F3DEC4] hover:bg-[#E6C7A6] text-[#4A2511] text-xs font-black transition-all cursor-pointer"
                >
                  {isMuted || displayVolume === 0 ? '🔊 Bật lại âm thanh' : '🔇 Tắt tiếng nhanh (M)'}
                </button>
              </div>
            )}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-2xl bg-[#FFFDF9] hover:bg-[#FFF5E6] active:scale-95 transition-all shadow-sm border-2 border-[#8B4513] flex items-center justify-center text-sm font-black text-[#4A2511] cursor-pointer"
            title="Toàn màn hình (Fullscreen)"
          >
            {isFullscreen ? '🗗' : '⛶'}
          </button>
        </div>
      </header>

      {/* Main Content Area: Safe vertical spacing so NÉ CỤC CỨT is NEVER covered or overlapped by anything */}
      <main className="relative w-full max-w-xl mx-auto flex-1 min-h-0 flex flex-col items-center justify-evenly text-center z-10 py-1 gap-1.5">
        {/* HERO LOGO & TITLE SECTION - 100% unobstructed, no overlapping badges, full Vietnamese diacritic clearance */}
        <div className="w-full flex flex-col items-center justify-center pt-1 pb-0.5 px-2 shrink-0">
          {/* Hidden file input so user can click the logo to upload their exact logo image file if desired */}
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoFileChange}
            className="hidden"
          />

          {/* Official Web Game Logo Badge (placed cleanly above title with safe margin so it never touches text) */}
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className="group relative mb-1.5 p-1 rounded-3xl bg-[#FFFDF9] border-3 border-[#8B4513] shadow-[0_4px_0_#8B4513] hover:scale-105 active:scale-95 transition-transform cursor-pointer shrink-0"
            title="Logo Web Game Né Cục Cứt (Nhấn để tải ảnh logo từ máy nếu muốn đổi)"
          >
            <img
              src={gameLogo}
              alt="Logo Web Game Né Cục Cứt"
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-[#FFE8CC] block"
            />
          </button>

          <h1
            className="block w-full text-center whitespace-nowrap text-4xl sm:text-6xl md:text-7xl font-black text-[#4A2511] tracking-wide select-none py-1.5"
            style={{
              fontFamily: "'Nunito', 'Fredoka', sans-serif",
              lineHeight: 1.35,
              textShadow: '0 4px 0 #FFFFFF, 0 7px 0 #D4A373',
            }}
          >
            NÉ CỤC CỨT
          </h1>

          {/* Slogan placed cleanly below with clear margin so it never touches the title */}
          <p className="mt-1 text-xs sm:text-base font-black text-[#5C2C0C] bg-[#FFE8C2] py-1.5 px-5 rounded-full border-2 border-[#8B4513] shadow-xs inline-block">
            Trúng cục cứt thúi hoắc cuộc đời
          </p>
        </div>

        {/* Cute Cartoon Stats Bar (Rank + Stage 1-50 + High Score) */}
        <div className="w-full max-w-md flex flex-col gap-1.5 shrink-0">
          <div className="w-full p-2.5 sm:p-3 rounded-3xl bg-[#FFFDF9] border-3 border-[#8B4513] shadow-[0_4px_0_#8B4513] flex items-center justify-between gap-2">
            {/* Rank Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-[#FFF5E4] border-2 border-[#D4A373]">
              <span className="text-lg sm:text-xl">{currentRank.icon}</span>
              <div className="text-left">
                <span className="block text-[9px] font-bold text-[#8C583A] uppercase leading-none">
                  Hạng Rank
                </span>
                <span className="text-xs sm:text-sm font-black text-[#4A2511]">
                  {currentRank.name.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* 50 Stages Selector Button */}
            <button
              onClick={() => {
                sound.playClickSound();
                onOpenStages();
              }}
              className="px-3 py-2 rounded-2xl bg-gradient-to-b from-[#E08E45] to-[#9A4E14] hover:from-[#F09D52] hover:to-[#8B4513] active:scale-95 text-white shadow border-2 border-[#5C2C0C] flex items-center gap-1.5 text-xs sm:text-sm font-black transition-all cursor-pointer"
              title="Chọn 50 màn chơi"
            >
              <span className="text-sm sm:text-base">🗺️</span>
              <span>Màn {currentUser.currentStage}/50</span>
            </button>

            {/* High Score */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-[#FFF5E4] border-2 border-[#D4A373]">
              <span className="text-base sm:text-lg">🏆</span>
              <div className="text-left">
                <span className="block text-[9px] font-bold text-[#8C583A] uppercase leading-none">
                  Kỷ lục
                </span>
                <span className="text-xs sm:text-sm font-black text-[#B3541E] tabular-nums">
                  {highScore}đ
                </span>
              </div>
            </div>
          </div>

          {/* Consecutive Loss Warning (compact so it never pushes layout) */}
          {currentUser.consecutiveLosses > 0 && (
            <div className="px-3 py-1 rounded-xl bg-rose-100 border border-rose-400 text-rose-900 text-[11px] font-black shrink-0">
              ⚠️ Đang thua liên tiếp {currentUser.consecutiveLosses}/3 trận (Thua 3 trận sẽ tụt 1 Rank!)
            </div>
          )}
        </div>

        {/* Big Cartoon Start Button: ▶ BẮT ĐẦU CHƠI */}
        <button
          onClick={() => {
            sound.playClickSound();
            onStartGame();
          }}
          className="w-full max-w-md py-3.5 sm:py-4 bg-gradient-to-b from-[#F59E0B] via-[#D97706] to-[#9A4E14] hover:from-[#FBBF24] hover:to-[#8B4513] text-white text-xl sm:text-3xl font-black rounded-3xl shadow-[0_5px_0_#5C2C0C] active:translate-y-1 active:shadow-[0_2px_0_#5C2C0C] transition-all flex items-center justify-center gap-3 border-3 border-[#5C2C0C] cursor-pointer shrink-0"
        >
          <span className="text-xl sm:text-2xl">▶</span>
          <span>BẮT ĐẦU CHƠI</span>
        </button>

        {/* Character, Poop & Theme Quick Selector Cards */}
        <div className="w-full max-w-md grid grid-cols-3 gap-2 sm:gap-2.5 shrink-0">
          <button
            onClick={() => {
              sound.playClickSound();
              onOpenCharacters();
            }}
            className="p-2 bg-[#FFFDF9] hover:bg-[#FFF5E6] active:scale-95 transition-all rounded-2xl shadow-[0_3px_0_#D4A373] border-2 border-[#8B4513] text-left flex items-center gap-2 cursor-pointer overflow-hidden"
          >
            <span className="text-xl sm:text-2xl p-1.5 bg-[#FFE8CC] rounded-xl border border-[#D4A373] shrink-0">
              {selectedCharacter.emoji}
            </span>
            <div className="overflow-hidden min-w-0">
              <span className="block text-[10px] font-bold text-[#8C583A] uppercase truncate">
                Nhân Vật
              </span>
              <span className="block text-xs sm:text-sm font-black text-[#4A2511] truncate">
                {selectedCharacter.name}
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              sound.playClickSound();
              onOpenSettings();
            }}
            className="p-2 bg-[#FFFDF9] hover:bg-[#FFF5E6] active:scale-95 transition-all rounded-2xl shadow-[0_3px_0_#D4A373] border-2 border-[#8B4513] text-left flex items-center gap-2 cursor-pointer overflow-hidden"
          >
            <span
              className="text-xl sm:text-2xl p-1.5 bg-[#FFE8CC] rounded-xl border border-[#D4A373] shrink-0"
              style={{ filter: selectedPoopStyle.filterStyle }}
            >
              {selectedPoopStyle.emoji}
            </span>
            <div className="overflow-hidden min-w-0">
              <span className="block text-[10px] font-bold text-[#8C583A] uppercase truncate">
                Cục Cứt
              </span>
              <span className="block text-xs sm:text-sm font-black text-[#4A2511] truncate">
                {selectedPoopStyle.name.replace(/^\d+\.\s*(Cứt\s*)?/, '')}
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              sound.playClickSound();
              onOpenThemes();
            }}
            className="p-2 bg-[#FFFDF9] hover:bg-[#FFF5E6] active:scale-95 transition-all rounded-2xl shadow-[0_3px_0_#D4A373] border-2 border-[#8B4513] text-left flex items-center gap-2 cursor-pointer overflow-hidden"
          >
            <span className="text-xl sm:text-2xl p-1.5 bg-[#FFE8CC] rounded-xl border border-[#D4A373] shrink-0">
              {selectedTheme.icon}
            </span>
            <div className="overflow-hidden min-w-0">
              <span className="block text-[10px] font-bold text-[#8C583A] uppercase truncate">
                Màn Chơi
              </span>
              <span className="block text-xs sm:text-sm font-black text-[#4A2511] truncate">
                {selectedTheme.name.replace(/^\d+\.\s*/, '')}
              </span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};
