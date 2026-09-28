import React from 'react';
import { GAME_RANKS } from '../data/ranks';
import { GAME_THEMES } from '../data/themes';
import { getStageRequiredTime } from '../utils/auth';
import { sound } from '../utils/audio';

interface StageModalProps {
  currentStage: number;
  maxStageUnlocked: number;
  onSelectStage: (stageNum: number) => void;
  onClose: () => void;
}

export const StageModal: React.FC<StageModalProps> = ({
  currentStage,
  maxStageUnlocked,
  onSelectStage,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-3xl p-4 sm:p-5 shadow-2xl border-4 border-[#8B4513] h-[88vh] max-h-[660px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#E6C7A6] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl p-1.5 bg-[#FFE8CC] rounded-2xl border border-[#D4A373]">
              🗺️
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#4A2511] leading-tight">
                CHỌN MÀN CHƠI (1 - 50)
              </h2>
              <p className="text-xs font-bold text-[#8C583A]">
                Đã mở khóa: {maxStageUnlocked}/50 màn • Cứ vượt qua 5 màn sẽ thăng 1 Hạng Rank!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-[#FFE8CC] hover:bg-[#FDE4BE] text-[#4A2511] font-black text-base flex items-center justify-center transition-transform active:scale-90 cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Sub-banner */}
        <div className="py-2 px-1 text-xs font-bold text-[#8C583A] flex items-center justify-between shrink-0">
          <span>👇 Cuộn xuống để chọn màn chơi:</span>
          <span className="text-[11px] bg-[#FFE8CC] text-[#4A2511] px-2.5 py-0.5 rounded-full font-black border border-[#D4A373]">
            Đang ở Màn {currentStage}/50
          </span>
        </div>

        {/* Scrollable Container with inner grid (matches Character & Poop selection layout) */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1.5 pb-6 touch-pan-y overscroll-contain">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Array.from({ length: 50 }, (_, i) => i + 1).map(stageNum => {
              const isUnlocked = stageNum <= maxStageUnlocked;
              const isSelected = stageNum === currentStage;
              const isMilestone = stageNum % 5 === 0;
              const rankTier = Math.min(10, Math.floor((stageNum - 1) / 5) + 1);
              const rankObj = GAME_RANKS[rankTier - 1];
              const stageTheme = GAME_THEMES[stageNum - 1] || GAME_THEMES[0];
              const cleanThemeName = stageTheme.name.replace(/^\d+\.\s*/, '');
              const requiredSeconds = getStageRequiredTime(stageNum);

              return (
                <div
                  key={stageNum}
                  onClick={() => {
                    if (isUnlocked) {
                      sound.playClickSound();
                      onSelectStage(stageNum);
                    }
                  }}
                  className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-400 cursor-pointer'
                      : isUnlocked
                      ? 'bg-[#FFF6E9] hover:bg-amber-100/70 border-[#E6C7A6] cursor-pointer'
                      : 'bg-gray-100 border-gray-200 opacity-55 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="w-12 h-12 text-2xl bg-white rounded-xl shadow-xs border border-[#E6C7A6] flex items-center justify-center shrink-0">
                      {isUnlocked ? stageTheme.icon : '🔒'}
                    </span>

                    <div className="min-w-0 flex-1 text-left">
                      <div className="text-xs sm:text-sm font-black text-[#4A2511] leading-snug break-words">
                        Màn {stageNum}: {cleanThemeName}
                      </div>
                      <div className="text-[11px] font-bold text-[#8C583A] leading-snug mt-0.5">
                        {isUnlocked
                          ? `⏱️ Mục tiêu: ${requiredSeconds}s • ${rankObj.icon} ${rankObj.name.split(' ')[0]}`
                          : `🔒 Vượt qua Màn ${stageNum - 1} để mở`}
                      </div>
                      {isMilestone && (
                        <div className="text-[10px] font-black text-amber-700 mt-0.5">
                          ⭐ Mốc thăng hạng {rankObj.name.split(' ')[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isSelected ? (
                      <span className="px-2.5 py-1 rounded-lg bg-[#8B4513] text-white text-[10px] font-black whitespace-nowrap">
                        ✓ Đang chọn
                      </span>
                    ) : isUnlocked ? (
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-[#D4A373] text-[#4A2511] text-[10px] font-bold whitespace-nowrap">
                        Chọn
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-gray-200 text-gray-500 text-[10px] font-bold whitespace-nowrap">
                        Khóa
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-[#E6C7A6] flex items-center justify-between text-xs text-[#4A2511] font-bold shrink-0">
          <span>
            ⭐ Màn 5, 10, 15... là mốc Thăng Hạng Rank!
          </span>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="px-5 py-2 bg-gradient-to-b from-[#D27D2D] to-[#9A4E14] hover:opacity-95 text-white font-black text-xs rounded-xl shadow cursor-pointer active:scale-95"
          >
            ĐÓNG
          </button>
        </div>
      </div>
    </div>
  );
};
