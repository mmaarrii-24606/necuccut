import React from 'react';
import { CHARACTERS } from '../data/characters';
import { sound } from '../utils/audio';

interface CharacterModalProps {
  currentLevel: number;
  unlockedCharacterIds: number[];
  selectedCharacterId: number;
  onSelectCharacter: (charId: number) => void;
  onClose: () => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  currentLevel,
  unlockedCharacterIds,
  selectedCharacterId,
  onSelectCharacter,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-3xl p-4 sm:p-5 shadow-2xl border-4 border-[#8B4513] h-[88vh] max-h-[660px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#E6C7A6] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl p-1.5 bg-[#FFE8CC] rounded-2xl border border-[#D4A373]">
              🐾
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#4A2511] leading-tight">
                CHỌN NHÂN VẬT (1 - 50)
              </h2>
              <p className="text-xs font-bold text-[#8C583A]">
                Đã mở khóa: {unlockedCharacterIds.length}/50 nhân vật • Qua màn mở nhân vật mới!
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
          <span>👇 Cuộn xuống để chọn nhân vật yêu thích:</span>
          <span className="text-[11px] bg-[#FFE8CC] text-[#4A2511] px-2.5 py-0.5 rounded-full font-black border border-[#D4A373]">
            {unlockedCharacterIds.length}/50 đã mở
          </span>
        </div>

        {/* Character Cards List - Dedicated scroll container + inner grid */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1.5 pb-6 touch-pan-y overscroll-contain">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {CHARACTERS.map(char => {
              const isUnlocked = unlockedCharacterIds.includes(char.id) || char.unlockLevel === 1;
              const isSelected = selectedCharacterId === char.id;

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
                      ? 'bg-[#FFF6E9] hover:bg-amber-100/70 border-[#E6C7A6] cursor-pointer'
                      : 'bg-gray-100 border-gray-200 opacity-55 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="w-12 h-12 text-2xl bg-white rounded-xl shadow-xs border border-[#E6C7A6] flex items-center justify-center shrink-0">
                      {isUnlocked ? char.emoji : '🔒'}
                    </span>

                    <div className="min-w-0 flex-1 text-left">
                      <div className="text-xs sm:text-sm font-black text-[#4A2511] leading-snug break-words">
                        {char.id}. {char.name}
                      </div>
                      <div className="text-[11px] font-bold text-[#8C583A] leading-snug mt-0.5 break-words">
                        {isUnlocked ? `${char.title} • ${char.specialTrait}` : `Mở khóa ở Màn ${char.unlockLevel}`}
                      </div>
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

        {/* Footer */}
        <div className="pt-3 border-t border-[#E6C7A6] flex items-center justify-between text-xs text-[#4A2511] font-bold shrink-0">
          <span>
            Màn hiện tại của bạn: <strong className="text-[#8B4513] text-sm">Màn {currentLevel}</strong>
          </span>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="px-5 py-2 bg-gradient-to-b from-[#D27D2D] to-[#9A4E14] hover:opacity-95 text-white font-black rounded-xl text-xs shadow cursor-pointer active:scale-95"
          >
            ĐÓNG
          </button>
        </div>
      </div>
    </div>
  );
};
