import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Character } from '../data/characters';
import { PoopStyle } from '../data/poopStyles';
import { GameRank } from '../data/ranks';
import { sound } from '../utils/audio';

interface GameOverModalProps {
  score: number;
  survivalSeconds: number;
  poopsDodged: number;
  highScore: number;
  currentStage: number;
  isNewRecord: boolean;
  rankDown: boolean;
  consecutiveLosses: number;
  oldRank: GameRank;
  newRank: GameRank;
  expEarned: number;
  character?: Character;
  poopStyle?: PoopStyle;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  survivalSeconds,
  poopsDodged,
  highScore,
  currentStage,
  isNewRecord,
  rankDown,
  consecutiveLosses,
  oldRank,
  newRank,
  expEarned,
  poopStyle,
  onRestart,
  onHome
}) => {
  useEffect(() => {
    if (isNewRecord) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isNewRecord]);

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 select-none animate-fadeIn">
      <div className="relative w-full max-w-sm sm:max-w-md bg-[#FFFDF9] rounded-3xl p-4 sm:p-5 shadow-2xl border-4 border-[#7A4419] text-center flex flex-col items-center max-h-[92vh] overflow-y-auto custom-scrollbar">
        {/* Cute Cartoon Character Knocked Out with Poop on Head, 2 Spinning Spiral Eyes & Pink Tongue Sticking Out! */}
        <div className="relative mt-2 mb-1 shrink-0 flex flex-col items-center">
          {/* Stink lines & dizzy stars */}
          <div className="text-xs font-black text-emerald-700 animate-pulse whitespace-nowrap mb-0.5">
            💫 〰️ 💨 🪰
          </div>

          {/* Poop stuck right on top of the character's head */}
          <div
            className="text-4xl sm:text-5xl -mb-4 z-20 animate-bounce drop-shadow-md"
            style={{ filter: poopStyle?.filterStyle }}
          >
            {poopStyle?.emoji || '💩'}
          </div>

          {/* Cute Chubby Cartoon Head with 2 Spinning Spiral Eyes & Pink Tongue Out */}
          <div className="relative w-20 h-20 rounded-full bg-[#FFE8CC] border-4 border-[#6B3E26] shadow-xl flex flex-col items-center justify-center pt-2">
            {/* 2 Spinning Spiral Eyes */}
            <div className="flex items-center justify-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white border-2 border-[#4A2511] flex items-center justify-center shadow-inner">
                <svg className="w-5 h-5 animate-spin text-[#4A2511]" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 12c0-1.5 1.2-2.5 2.5-2.5S17 10.8 17 12.5c0 2.5-2 4.5-4.8 4.5-3.5 0-6.2-2.8-6.2-6.5C6 6 9.5 3 13.5 3c4.8 0 8.5 3.8 8.5 9"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="w-7 h-7 rounded-full bg-white border-2 border-[#4A2511] flex items-center justify-center shadow-inner">
                <svg
                  className="w-5 h-5 animate-spin text-[#4A2511]"
                  style={{ animationDirection: 'reverse' }}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 12c0-1.5 1.2-2.5 2.5-2.5S17 10.8 17 12.5c0 2.5-2 4.5-4.8 4.5-3.5 0-6.2-2.8-6.2-6.5C6 6 9.5 3 13.5 3c4.8 0 8.5 3.8 8.5 9"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Rosy Blush Cheeks + Wavy Mouth + Cute Pink Tongue Sticking Out */}
            <div className="w-full flex items-center justify-center mt-1">
              <span className="w-3.5 h-2 rounded-full bg-[#FF8FA3] mr-2.5" />
              <div className="relative flex flex-col items-center">
                <div className="w-6 h-1 bg-[#4A2511] rounded-full" />
                <div className="w-4 h-4.5 -mt-0.5 bg-[#FF5D8F] border-2 border-[#4A2511] rounded-b-full shadow-xs animate-bounce">
                  <div className="w-0.5 h-2.5 bg-[#D6336C] mx-auto mt-0.5 rounded-full" />
                </div>
              </div>
              <span className="w-3.5 h-2 rounded-full bg-[#FF8FA3] ml-2.5" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="mt-1 text-2xl sm:text-3xl font-black text-[#4A2511] tracking-tight shrink-0">
          GAME OVER
        </h2>

        {/* Slogan */}
        <p className="mt-0.5 px-3.5 py-0.5 rounded-full bg-[#FFE8CC] text-[#5C2C0C] text-xs sm:text-sm font-black border-2 border-[#D4A373]">
          Trúng cục cứt thúi hoắc cuộc đời!
        </p>

        <p className="text-[11px] font-bold text-[#8C583A] mt-1">
          Bị cứt rơi trúng đầu ở Màn {currentStage} / 50
        </p>

        {/* New Record Banner if applicable */}
        {isNewRecord && (
          <div className="mt-1.5 px-3 py-1 bg-yellow-400 text-yellow-950 rounded-full text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-md animate-pulse shrink-0">
            🏆 KỶ LỤC MỚI CỦA BẠN! 🏆
          </div>
        )}

        {/* RANK DOWN WARNING */}
        {rankDown ? (
          <div className="w-full mt-2 p-2.5 rounded-2xl bg-rose-100 border-2 border-rose-400 shadow-sm shrink-0">
            <div className="text-[11px] font-black text-rose-900 uppercase">
              ⚠️ BỊ TỤT HẠNG RANK! (THUA 3 LẦN LIÊN TIẾP)
            </div>
            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="text-xl">{oldRank.icon}</span>
              <span className="text-xs font-bold text-gray-600 line-through">{oldRank.name.split(' ')[0]}</span>
              <span className="text-sm font-black text-rose-800">➔</span>
              <span className="text-2xl">{newRank.icon}</span>
              <span className="text-sm font-black text-rose-950">{newRank.name}</span>
            </div>
          </div>
        ) : (
          <div className="w-full mt-2 px-3 py-1.5 rounded-xl bg-[#FFF5E6] border border-[#E6C7A6] text-xs flex items-center justify-between text-[#4A2511] shrink-0">
            <div className="flex items-center gap-1">
              <span>Hạng hiện tại:</span>
              <strong className="flex items-center gap-0.5">{newRank.icon} {newRank.name.split(' ')[0]}</strong>
            </div>
            <div className="flex items-center gap-1">
              <span>Thua liên tiếp:</span>
              <strong className={`font-black ${consecutiveLosses >= 2 ? 'text-rose-600 animate-pulse' : 'text-[#8B4513]'}`}>
                {consecutiveLosses}/3 lần
              </strong>
            </div>
          </div>
        )}

        {/* Result Stats Box */}
        <div className="w-full mt-2.5 bg-[#FFF6E9] rounded-2xl p-3 border-2 border-[#E6C7A6] flex flex-col gap-1.5 shrink-0 text-xs sm:text-sm font-bold text-[#4A2511]">
          <div className="flex items-center justify-between">
            <span>Bạn đã sống được:</span>
            <span className="text-lg font-black text-blue-700 tabular-nums">
              {survivalSeconds} giây
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Điểm:</span>
            <span className="text-xl font-black text-[#B3541E] tabular-nums">
              {score}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-[#6B3E26] border-t border-[#E6C7A6] pt-1">
            <span>🏆 Kỷ lục:</span>
            <span className="font-extrabold text-[#4A2511]">{highScore} điểm</span>
          </div>

          <div className="flex items-center justify-between text-[11px] font-medium text-[#8C583A]">
            <span>Cục cứt đã né:</span>
            <span className="font-bold text-[#4A2511]">{poopsDodged} 💩</span>
          </div>

          <div className="flex items-center justify-between text-[11px] font-medium text-[#8C583A]">
            <span>Kinh nghiệm nhận được:</span>
            <span className="font-bold text-emerald-700">+{expEarned} EXP ⭐</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full mt-3 flex flex-col gap-2 shrink-0">
          <button
            onClick={() => {
              sound.playClickSound();
              onRestart();
            }}
            className="w-full py-3 bg-gradient-to-b from-[#F59E0B] via-[#D97706] to-[#9A4E14] hover:from-[#FBBF24] hover:to-[#8B4513] text-white font-black text-base rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 border-b-4 border-[#5C2C0C] cursor-pointer"
          >
            <span>🔄</span>
            <span>CHƠI LẠI MÀN {currentStage} (PHÍM R)</span>
          </button>

          <button
            onClick={() => {
              sound.playClickSound();
              onHome();
            }}
            className="w-full py-2 bg-[#FFF3DF] hover:bg-[#FDE4BE] text-[#4A2511] font-bold text-xs rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 border-2 border-[#D4A373] cursor-pointer"
          >
            <span>🏠</span>
            <span>VỀ TRANG CHỦ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
