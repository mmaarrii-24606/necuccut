import React, { useState, useRef } from 'react';
import { Character, CHARACTERS } from '../data/characters';
import { GameTheme, GAME_THEMES } from '../data/themes';
import { PoopStyle, POOP_STYLES } from '../data/poopStyles';
import { GameDifficulty, UserProfile } from '../utils/auth';
import { sound } from '../utils/audio';
import {
  isCustomGameLogo,
  processUploadedLogoFile,
  resetGameLogo,
  setCustomGameLogo
} from '../utils/gameLogo';

interface SettingsModalProps {
  currentUser: UserProfile;
  difficulty: GameDifficulty;
  selectedCharacter: Character;
  selectedTheme: GameTheme;
  selectedPoopStyle: PoopStyle;
  volume: number;
  isMuted: boolean;
  gameLogo: string;
  onUpdateGameLogo: (newLogo: string) => void;
  isInGame?: boolean;
  onSetDifficulty: (diff: GameDifficulty) => void;
  onSelectCharacter: (charId: number) => void;
  onSelectTheme: (themeId: string) => void;
  onSelectPoopStyle: (styleId: string) => void;
  onChangeVolume: (newVol: number) => void;
  onToggleSound: () => void;
  onExitHome?: () => void;
  onOpenAccount?: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentUser,
  difficulty,
  selectedCharacter,
  selectedTheme,
  selectedPoopStyle,
  volume,
  isMuted,
  gameLogo,
  onUpdateGameLogo,
  isInGame = false,
  onSetDifficulty,
  onSelectCharacter,
  onSelectTheme,
  onSelectPoopStyle,
  onChangeVolume,
  onToggleSound,
  onExitHome,
  onOpenAccount,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'customization' | 'difficulty' | 'options'>('customization');
  const [customSubTab, setCustomSubTab] = useState<'character' | 'poop' | 'theme'>('character');
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processUploadedLogoFile(file);
      const saved = setCustomGameLogo(dataUrl);
      onUpdateGameLogo(saved);
      sound.playClickSound();
    } catch {
      // ignore
    } finally {
      if (logoFileInputRef.current) {
        logoFileInputRef.current.value = '';
      }
    }
  };

  const handleResetLogo = () => {
    sound.playClickSound();
    const def = resetGameLogo();
    onUpdateGameLogo(def);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 select-none animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border-4 border-amber-300 h-[88vh] max-h-[640px] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2.5 border-b-2 border-amber-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src={gameLogo}
              alt="Logo Né Cục Cứt"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl border-2 border-amber-500 object-cover bg-amber-100 shrink-0"
            />
            <div>
              <h2 className="text-lg sm:text-xl font-black text-amber-950 leading-tight">
                CÀI ĐẶT TRÒ CHƠI
              </h2>
              <p className="text-[11px] text-amber-800">
                Tùy chỉnh giao diện, mức chơi và hệ thống
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-base flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Main Tab Navigation */}
        <div className="mt-2.5 flex rounded-xl bg-amber-50 p-1 border border-amber-200 gap-1 text-xs font-bold shrink-0">
          <button
            onClick={() => {
              sound.playClickSound();
              setActiveTab('customization');
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'customization' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            <span>🎨</span>
            <span>Giao Diện</span>
          </button>

          <button
            onClick={() => {
              sound.playClickSound();
              setActiveTab('difficulty');
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'difficulty' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            <span>🎯</span>
            <span>Mức Chơi</span>
          </button>

          <button
            onClick={() => {
              sound.playClickSound();
              setActiveTab('options');
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'options' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            <span>🏠</span>
            <span>Hệ Thống</span>
          </button>
        </div>

        {/* Tab 1: CUSTOMIZATION (Nhân vật, Cục cứt, Màn chơi) */}
        {activeTab === 'customization' && (
          <div className="flex-1 min-h-0 flex flex-col pt-2.5 overflow-hidden">
            {/* Sub-tabs for 3 customization sections */}
            <div className="flex gap-1.5 pb-2 shrink-0">
              <button
                onClick={() => {
                  sound.playClickSound();
                  setCustomSubTab('character');
                }}
                className={`flex-1 py-1 px-2 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                  customSubTab === 'character'
                    ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-2xs'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                🐾 Nhân Vật ({currentUser.unlockedCharacters.length}/50)
              </button>

              <button
                onClick={() => {
                  sound.playClickSound();
                  setCustomSubTab('poop');
                }}
                className={`flex-1 py-1 px-2 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                  customSubTab === 'poop'
                    ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-2xs'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                💩 Cục Cứt ({(currentUser.unlockedPoopStyles || ['poop1']).length}/50)
              </button>

              <button
                onClick={() => {
                  sound.playClickSound();
                  setCustomSubTab('theme');
                }}
                className={`flex-1 py-1 px-2 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                  customSubTab === 'theme'
                    ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-2xs'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                🌈 Màn Chơi ({currentUser.unlockedThemes.length}/50)
              </button>
            </div>

            {/* Scroll indicator banner */}
            <div className="pb-1 px-1 text-[11px] font-bold text-amber-800 flex items-center justify-between shrink-0">
              <span>👇 Cuộn xuống để xem toàn bộ 50 lựa chọn:</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-black">
                {customSubTab === 'character'
                  ? `${currentUser.unlockedCharacters.length}/50 đã mở`
                  : customSubTab === 'poop'
                  ? `${(currentUser.unlockedPoopStyles || ['poop1']).length}/50 đã mở`
                  : `${currentUser.unlockedThemes.length}/50 đã mở`}
              </span>
            </div>

            {/* Subtab Content Area with Smooth Scrolling */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-6 touch-pan-y overscroll-contain">
              {/* SUBTAB: CHARACTERS */}
              {customSubTab === 'character' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CHARACTERS.map(char => {
                    const isUnlocked = currentUser.unlockedCharacters.includes(char.id) || char.unlockLevel === 1;
                    const isSelected = selectedCharacter.id === char.id;

                    return (
                      <div
                        key={char.id}
                        onClick={() => {
                          if (isUnlocked) {
                            sound.playClickSound();
                            onSelectCharacter(char.id);
                          }
                        }}
                        className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-400 cursor-pointer'
                            : isUnlocked
                            ? 'bg-amber-50/50 hover:bg-amber-100/70 border-amber-200 cursor-pointer'
                            : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="text-3xl p-1.5 bg-white rounded-xl shadow-xs shrink-0">
                            {isUnlocked ? char.emoji : '🔒'}
                          </span>
                          <div className="min-w-0 flex-1 text-left">
                            <div className="text-xs font-black text-amber-950 leading-snug break-words">
                              {char.id}. {char.name}
                            </div>
                            <div className="text-[10px] text-amber-700 leading-snug mt-0.5 break-words">
                              {isUnlocked ? `${char.title} • ${char.specialTrait}` : `Mở khóa ở Màn ${char.unlockLevel}`}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isSelected ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-black whitespace-nowrap">
                              ✓ Đang chọn
                            </span>
                          ) : isUnlocked ? (
                            <span className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-amber-900 text-[10px] font-bold whitespace-nowrap">
                              Chọn
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-gray-200 text-gray-500 text-[10px] font-bold whitespace-nowrap">
                              Khóa
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* SUBTAB: POOP STYLES (Pure Poop only, no crowns!) */}
              {customSubTab === 'poop' && (
                <div className="flex flex-col gap-2">
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
                    💡 <strong>Cục Cứt Nguyên Bản:</strong> Chỉ có cục cứt rơi từ trên xuống, không gắn vương miện hay phụ kiện!
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {POOP_STYLES.map(style => {
                      const isUnlocked = (currentUser.unlockedPoopStyles || ['poop1']).includes(style.id) || style.unlockLevel === 1;
                      const isSelected = selectedPoopStyle.id === style.id;

                      return (
                        <div
                          key={style.id}
                          onClick={() => {
                            if (isUnlocked) {
                              sound.playClickSound();
                              onSelectPoopStyle(style.id);
                            }
                          }}
                          className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between gap-2.5 ${
                            isSelected
                              ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-400 cursor-pointer'
                              : isUnlocked
                              ? 'bg-amber-50/50 hover:bg-amber-100/70 border-amber-200 cursor-pointer'
                              : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span
                              className="text-3xl p-1.5 bg-white rounded-xl shadow-xs shrink-0"
                              style={{ filter: isUnlocked ? style.filterStyle : undefined }}
                            >
                              {isUnlocked ? style.emoji : '🔒'}
                            </span>
                            <div className="min-w-0 flex-1 text-left">
                              <div className="text-xs font-black text-amber-950 leading-snug break-words">
                                {style.name}
                              </div>
                              <div className="text-[10px] text-amber-700 leading-snug mt-0.5 break-words">
                                {isUnlocked ? style.description : `Mở khóa ở Màn ${style.unlockLevel}`}
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {isSelected ? (
                              <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-black whitespace-nowrap">
                                ✓ Đang chọn
                              </span>
                            ) : isUnlocked ? (
                              <span className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-amber-900 text-[10px] font-bold whitespace-nowrap">
                                Chọn
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-gray-200 text-gray-500 text-[10px] font-bold whitespace-nowrap">
                                Khóa
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUBTAB: THEMES (Game Maps / Màn Chơi) */}
              {customSubTab === 'theme' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GAME_THEMES.map(th => {
                    const isUnlocked = currentUser.unlockedThemes.includes(th.id) || th.unlockLevel === 1;
                    const isSelected = selectedTheme.id === th.id;

                    return (
                      <div
                        key={th.id}
                        onClick={() => {
                          if (isUnlocked) {
                            sound.playClickSound();
                            onSelectTheme(th.id);
                          }
                        }}
                        className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-400 cursor-pointer'
                            : isUnlocked
                            ? 'bg-amber-50/50 hover:bg-amber-100/70 border-amber-200 cursor-pointer'
                            : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="text-3xl p-1.5 bg-white rounded-xl shadow-xs shrink-0">
                            {isUnlocked ? th.icon : '🔒'}
                          </span>
                          <div className="min-w-0 flex-1 text-left">
                            <div className="text-xs font-black text-amber-950 leading-snug break-words">
                              {th.name}
                            </div>
                            <div className="text-[10px] text-amber-700 leading-snug mt-0.5 break-words">
                              {isUnlocked ? th.description : `Mở khóa ở Màn ${th.unlockLevel}`}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isSelected ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-black whitespace-nowrap">
                              ✓ Đang chọn
                            </span>
                          ) : isUnlocked ? (
                            <span className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-amber-900 text-[10px] font-bold whitespace-nowrap">
                              Chọn
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-gray-200 text-gray-500 text-[10px] font-bold whitespace-nowrap">
                              Khóa
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: DIFFICULTY (Mức chơi) - Eye-catching Arcade Styling */}
        {activeTab === 'difficulty' && (
          <div className="flex-1 min-h-0 flex flex-col justify-between py-2 overflow-y-auto custom-scrollbar pr-1 gap-2.5">
            <div className="text-center shrink-0">
              <span className="px-3 py-1 bg-amber-100 text-amber-950 rounded-full text-xs font-black uppercase tracking-wider border border-amber-300 inline-block shadow-xs">
                🎯 CHỌN CẤP ĐỘ THỬ THÁCH
              </span>
              <p className="text-[11px] text-amber-800 mt-1">
                Tốc độ rơi và tần suất mưa cứt sẽ thay đổi theo mức chơi bạn chọn
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* EASY CARD */}
              <button
                onClick={() => {
                  sound.playClickSound();
                  onSetDifficulty('easy');
                }}
                className={`p-3.5 rounded-2xl text-left border-3 transition-all flex flex-col gap-2 cursor-pointer relative overflow-hidden ${
                  difficulty === 'easy'
                    ? 'bg-gradient-to-r from-emerald-100 to-green-50 border-emerald-500 shadow-lg ring-3 ring-emerald-300 scale-[1.01]'
                    : 'bg-emerald-50/50 hover:bg-emerald-100/60 border-emerald-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl p-1.5 bg-white rounded-2xl shadow-xs border border-emerald-200">
                      🌱
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm sm:text-base font-black text-emerald-950">
                          MỨC DỄ (Tập Sự)
                        </span>
                        <span className="px-2 py-0.2 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black">
                          ÊM ĐỀM
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-800 font-semibold">
                        Cục cứt rơi thong thả, giãn cách rộng, thích hợp giải trí.
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {difficulty === 'easy' ? (
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-xs flex items-center gap-1">
                        ✓ Đang chọn
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold">
                        Chọn
                      </span>
                    )}
                  </div>
                </div>

                {/* Meter & High Score */}
                <div className="flex items-center justify-between pt-1 border-t border-emerald-200/80 text-[11px]">
                  <div className="flex items-center gap-3 text-emerald-900 font-bold">
                    <span>Tốc độ: ⭐☆☆</span>
                    <span>•</span>
                    <span>Mật độ: ⭐☆☆</span>
                  </div>
                  <span className="font-black text-emerald-900 bg-white/80 px-2 py-0.5 rounded-lg border border-emerald-200">
                    🏆 Kỷ lục: {currentUser.highScores.easy}đ
                  </span>
                </div>
              </button>

              {/* NORMAL CARD */}
              <button
                onClick={() => {
                  sound.playClickSound();
                  onSetDifficulty('normal');
                }}
                className={`p-3.5 rounded-2xl text-left border-3 transition-all flex flex-col gap-2 cursor-pointer relative overflow-hidden ${
                  difficulty === 'normal'
                    ? 'bg-gradient-to-r from-amber-100 to-yellow-50 border-amber-500 shadow-lg ring-3 ring-amber-300 scale-[1.01]'
                    : 'bg-amber-50/50 hover:bg-amber-100/60 border-amber-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl p-1.5 bg-white rounded-2xl shadow-xs border border-amber-200">
                      ⚡
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm sm:text-base font-black text-amber-950">
                          MỨC BÌNH THƯỜNG (Cao Thủ)
                        </span>
                        <span className="px-2 py-0.2 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black">
                          CHUẨN XÁC
                        </span>
                      </div>
                      <div className="text-[11px] text-amber-800 font-semibold">
                        Tốc độ tiêu chuẩn, cứ mỗi 20s sẽ tăng tốc kịch tính!
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {difficulty === 'normal' ? (
                      <span className="px-2.5 py-1 rounded-xl bg-amber-600 text-white text-xs font-black shadow-xs flex items-center gap-1">
                        ✓ Đang chọn
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl bg-white border border-amber-300 text-amber-800 text-xs font-bold">
                        Chọn
                      </span>
                    )}
                  </div>
                </div>

                {/* Meter & High Score */}
                <div className="flex items-center justify-between pt-1 border-t border-amber-200/80 text-[11px]">
                  <div className="flex items-center gap-3 text-amber-900 font-bold">
                    <span>Tốc độ: ⭐⭐☆</span>
                    <span>•</span>
                    <span>Mật độ: ⭐⭐☆</span>
                  </div>
                  <span className="font-black text-amber-900 bg-white/80 px-2 py-0.5 rounded-lg border border-amber-200">
                    🏆 Kỷ lục: {currentUser.highScores.normal}đ
                  </span>
                </div>
              </button>

              {/* HARD CARD */}
              <button
                onClick={() => {
                  sound.playClickSound();
                  onSetDifficulty('hard');
                }}
                className={`p-3.5 rounded-2xl text-left border-3 transition-all flex flex-col gap-2 cursor-pointer relative overflow-hidden ${
                  difficulty === 'hard'
                    ? 'bg-gradient-to-r from-rose-100 to-red-50 border-rose-500 shadow-lg ring-3 ring-rose-300 scale-[1.01]'
                    : 'bg-rose-50/50 hover:bg-rose-100/60 border-rose-200 hover:border-rose-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl p-1.5 bg-white rounded-2xl shadow-xs border border-rose-200">
                      🔥
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm sm:text-base font-black text-rose-950">
                          MỨC KHÓ (Bão Cứt Thần Tốc)
                        </span>
                        <span className="px-2 py-0.2 rounded-full bg-rose-200 text-rose-900 text-[10px] font-black">
                          CỰC HẠN
                        </span>
                      </div>
                      <div className="text-[11px] text-rose-800 font-semibold">
                        Cứt rơi xé gió, dồn dập liên hoàn, thử thách ngón tay vàng!
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {difficulty === 'hard' ? (
                      <span className="px-2.5 py-1 rounded-xl bg-rose-600 text-white text-xs font-black shadow-xs flex items-center gap-1">
                        ✓ Đang chọn
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-xl bg-white border border-rose-300 text-rose-800 text-xs font-bold">
                        Chọn
                      </span>
                    )}
                  </div>
                </div>

                {/* Meter & High Score */}
                <div className="flex items-center justify-between pt-1 border-t border-rose-200/80 text-[11px]">
                  <div className="flex items-center gap-3 text-rose-900 font-bold">
                    <span>Tốc độ: ⭐⭐⭐</span>
                    <span>•</span>
                    <span>Mật độ: ⭐⭐⭐</span>
                  </div>
                  <span className="font-black text-rose-900 bg-white/80 px-2 py-0.5 rounded-lg border border-rose-200">
                    🏆 Kỷ lục: {currentUser.highScores.hard}đ
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: SYSTEM OPTIONS (Trang chủ, Logo Web Game, Âm thanh, Tài khoản) */}
        {activeTab === 'options' && (
          <div className="flex-1 min-h-0 flex flex-col justify-start gap-2.5 py-2 overflow-y-auto pr-1">
            {/* Web Game Logo Card */}
            <div className="w-full p-3 bg-amber-50/70 rounded-2xl border-2 border-amber-200 flex items-center justify-between gap-3">
              <input
                ref={logoFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={gameLogo}
                  alt="Logo Web Game Né Cục Cứt"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl border-2 border-amber-500 object-cover bg-amber-100 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-black text-amber-950 truncate">
                    Logo Web Game Né Cục Cứt
                  </div>
                  <div className="text-[11px] text-amber-800 font-semibold">
                    Hiển thị trên Trang chủ & biểu tượng Tab trình duyệt
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => logoFileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-2xs cursor-pointer active:scale-95 transition-all"
                >
                  📁 Đổi ảnh Logo
                </button>
                {isCustomGameLogo() && (
                  <button
                    type="button"
                    onClick={handleResetLogo}
                    className="px-2 py-1.5 rounded-xl bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold cursor-pointer"
                    title="Khôi phục Logo mặc định"
                  >
                    Mặc định
                  </button>
                )}
              </div>
            </div>

            {/* Return Home Button */}
            {onExitHome && (
              <button
                onClick={() => {
                  sound.playClickSound();
                  onExitHome();
                  onClose();
                }}
                className="w-full py-3 bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-sm rounded-2xl border-2 border-amber-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shadow-xs"
              >
                <span className="text-lg">🏠</span>
                <span>VỀ TRANG CHỦ (MÀN HÌNH CHÍNH)</span>
              </button>
            )}

            {/* Volume 0 - 100 Slider & Sound Toggle */}
            <div className="w-full p-3.5 bg-white rounded-2xl border-2 border-amber-200 shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{isMuted || volume === 0 ? '🔇' : volume < 45 ? '🔉' : '🔊'}</span>
                  <span className="font-black text-sm text-amber-950">Âm lượng trò chơi (0 - 100)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 border border-amber-300 text-xs font-black text-amber-950 tabular-nums">
                    {isMuted ? 0 : volume} / 100
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClickSound();
                      onToggleSound();
                    }}
                    className={`px-2 py-0.5 rounded-lg text-xs font-black cursor-pointer ${
                      isMuted ? 'bg-gray-200 text-gray-700' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isMuted ? 'Đang TẮT' : 'Đang BẬT'}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-800">0</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={isMuted ? 0 : volume}
                  onChange={e => onChangeVolume(Number(e.target.value))}
                  className="w-full h-2.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <span className="text-xs font-bold text-amber-800">100</span>
              </div>
            </div>

            {/* Account / Profile Button */}
            {onOpenAccount && (
              <button
                onClick={() => {
                  sound.playClickSound();
                  onOpenAccount();
                  onClose();
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm rounded-2xl flex items-center justify-between px-4 cursor-pointer active:scale-95 transition-all shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">👤</span>
                  <span>Tài Khoản & Hồ Sơ Cá Nhân</span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md">
                  {currentUser.displayName} (Lv.{currentUser.level})
                </span>
              </button>
            )}

            <div className="mt-1 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900/80 text-center font-medium">
              ⌨️ <strong>Phím tắt:</strong> ESC (Trang chủ) • Space (Tạm dừng) • M (Bật/tắt âm)
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-2.5 border-t border-amber-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-bold text-amber-800 truncate">
            Đang dùng: <strong>{selectedCharacter.name}</strong> • <strong>{selectedPoopStyle.name}</strong>
          </span>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black rounded-xl text-xs shadow hover:opacity-95 active:scale-95 cursor-pointer"
          >
            ÁP DỤNG & ĐÓNG
          </button>
        </div>
      </div>
    </div>
  );
};
