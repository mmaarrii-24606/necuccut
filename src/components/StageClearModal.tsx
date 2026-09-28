import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameRank } from '../data/ranks';
import { CHARACTERS } from '../data/characters';
import { GAME_THEMES } from '../data/themes';
import { POOP_STYLES } from '../data/poopStyles';
import { sound } from '../utils/audio';

interface StageClearModalProps {
  stagePassed: number;
  nextStage: number;
  score: number;
  survivalSeconds: number;
  poopsDodged: number;
  rankUp: boolean;
  oldRank: GameRank;
  newRank: GameRank;
  newThemeUnlocked?: string;
  newCharUnlocked?: number;
  newPoopUnlocked?: string;
  expEarned: number;
  onNextStage: () => void;
  onHome: () => void;
}

export const StageClearModal: React.FC<StageClearModalProps> = ({
  stagePassed,
  nextStage,
  score,
  survivalSeconds,
  poopsDodged,
  rankUp,
  oldRank,
  newRank,
  newThemeUnlocked,
  newCharUnlocked,
  newPoopUnlocked,
  expEarned,
  onNextStage,
  onHome
}) => {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.55 }
    });
    sound.playLevelUpSound();
  }, []);

  const newChar = newCharUnlocked ? CHARACTERS.find(c => c.id === newCharUnlocked) : null;
  const newTheme = newThemeUnlocked ? GAME_THEMES.find(t => t.id === newThemeUnlocked) : null;
  const newPoop = newPoopUnlocked ? POOP_STYLES.find(p => p.id === newPoopUnlocked) : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 select-none animate-fadeIn">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-emerald-400 text-center flex flex-col items-center max-h-[92vh] overflow-y-auto custom-scrollbar">
        {/* Victory Trophy Badge */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 -mt-12 sm:-mt-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center text-3xl sm:text-4xl shadow-xl border-4 border-white animate-bounce-gentle shrink-0">
          🏆
        </div>

        {/* Title */}
        <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight flex items-center justify-center gap-1.5 shrink-0">
          <span>🎉</span>
          <span>QUA MÀN {stagePassed}!</span>
          <span>🎉</span>
        </h2>

        <p className="text-xs text-emerald-800 font-bold">
          Xuất sắc sống sót và chinh phục Màn {stagePassed} / 50!
        </p>

        {/* RANK UP PROMOTION BANNER */}
        {rankUp && (
          <div className="w-full mt-2.5 p-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 border-2 border-yellow-200 shadow-md animate-bounce shrink-0">
            <div className="text-[11px] font-black uppercase text-amber-950 tracking-wider">
              ⭐ THĂNG HẠNG RANK MỚI! ⭐
            </div>
            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="text-2xl">{oldRank.icon}</span>
              <span className="text-xs font-bold text-amber-900 line-through">{oldRank.name.split(' ')[0]}</span>
              <span className="text-sm font-black text-amber-950">➔</span>
              <span className="text-3xl animate-pulse">{newRank.icon}</span>
              <span className="text-base font-black text-amber-950">{newRank.name}</span>
            </div>
            <p className="mt-0.5 text-[10px] text-amber-900 font-semibold">
              Cứ mỗi 5 màn qua được là lên 1 Rank vinh quang!
            </p>
          </div>
        )}

        {/* Result Stats Box */}
        <div className="w-full mt-3 bg-emerald-50/80 rounded-2xl p-3 border-2 border-emerald-200 flex flex-col gap-1.5 shrink-0 text-xs sm:text-sm font-bold text-emerald-950">
          <div className="flex justify-between items-center">
            <span>Thời gian sống sót:</span>
            <span className="text-base font-black text-blue-700">{survivalSeconds}s</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Điểm đạt được:</span>
            <span className="text-base font-black text-amber-700">{score} điểm</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Số cục cứt đã né:</span>
            <span className="text-base font-black text-emerald-700">{poopsDodged} 💩</span>
          </div>
          <div className="flex justify-between items-center border-t border-emerald-200/80 pt-1 text-xs">
            <span>Kinh nghiệm nhận:</span>
            <span className="font-extrabold text-teal-800">+{expEarned} EXP ⭐</span>
          </div>
        </div>

        {/* Unlocked rewards section: "Mỗi khi qua màn là được thêm giao diện mới" */}
        {(newTheme || newChar || newPoop) && (
          <div className="w-full mt-2.5 p-2.5 bg-gradient-to-r from-teal-50 via-sky-50 to-amber-50 rounded-2xl border-2 border-teal-300 shrink-0 text-left">
            <span className="block text-[11px] font-black text-teal-950 uppercase tracking-wider text-center mb-1.5">
              🎁 MỞ KHÓA BỘ GIAO DIỆN MỚI CHO MÀN {nextStage}:
            </span>

            <div className="flex flex-col gap-1.5">
              {newTheme && (
                <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl shadow-2xs border border-teal-200">
                  <span className="text-xl p-1 bg-sky-100 rounded-lg">{newTheme.icon}</span>
                  <div className="overflow-hidden">
                    <span className="block text-[10px] text-teal-700 font-bold uppercase">Giao diện màn chơi mới</span>
                    <span className="block text-xs font-black text-teal-950 truncate">{newTheme.name}</span>
                  </div>
                </div>
              )}

              {newChar && (
                <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl shadow-2xs border border-teal-200">
                  <span className="text-xl p-1 bg-amber-100 rounded-lg">{newChar.emoji}</span>
                  <div className="overflow-hidden">
                    <span className="block text-[10px] text-amber-700 font-bold uppercase">Nhân vật mới</span>
                    <span className="block text-xs font-black text-amber-950 truncate">{newChar.name}</span>
                  </div>
                </div>
              )}

              {newPoop && (
                <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl shadow-2xs border border-teal-200">
                  <span className="text-xl p-1 bg-amber-100 rounded-lg" style={{ filter: newPoop.filterStyle }}>
                    {newPoop.emoji}
                  </span>
                  <div className="overflow-hidden">
                    <span className="block text-[10px] text-amber-700 font-bold uppercase">Kiểu cục cứt mới</span>
                    <span className="block text-xs font-black text-amber-950 truncate">{newPoop.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full mt-3 flex flex-col gap-2 shrink-0">
          {nextStage <= 50 ? (
            <button
              onClick={() => {
                sound.playClickSound();
                onNextStage();
              }}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-base rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 border-b-4 border-emerald-700 cursor-pointer animate-bounce-gentle"
            >
              <span>▶</span>
              <span>QUA MÀN TIẾP THEO (MÀN {nextStage})</span>
            </button>
          ) : (
            <div className="p-2.5 rounded-2xl bg-amber-200 text-amber-950 font-black text-xs">
              👑 BẠN ĐÃ PHÁ ĐẢO TOÀN BỘ 50 MÀN CHƠI CỦA GAME! 👑
            </div>
          )}

          <button
            onClick={() => {
              sound.playClickSound();
              onHome();
            }}
            className="w-full py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-emerald-300 cursor-pointer"
          >
            <span>🏠</span>
            <span>VỀ TRANG CHỦ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
