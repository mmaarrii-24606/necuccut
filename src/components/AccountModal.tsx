import React, { useState, useRef } from 'react';
import { authService, UserProfile } from '../utils/auth';
import { PRESET_AVATARS } from '../data/avatars';
import { sound } from '../utils/audio';

interface AccountModalProps {
  currentUser: UserProfile;
  onUserUpdated: (user: UserProfile) => void;
  onClose: () => void;
}

// Helper to evaluate password strength and security checklist
function evaluatePasswordStrength(pw: string) {
  const hasMinLength = pw.length >= 8;
  const hasValidMin = pw.length >= 6;
  const hasUpperAndLower = /[a-z]/.test(pw) && /[A-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^a-zA-Z0-9]/.test(pw);

  let score = 0;
  if (hasValidMin) score += 1;
  if (hasMinLength) score += 1;
  if (hasUpperAndLower) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecial) score += 1;

  let label = 'Chưa nhập';
  let colorClass = 'bg-stone-300 text-stone-700';
  let barColor = 'bg-stone-300';
  if (pw.length > 0 && pw.length < 6) {
    label = 'Quá ngắn (Cần ít nhất 6 ký tự)';
    colorClass = 'bg-rose-100 text-rose-800';
    barColor = 'bg-rose-500';
  } else if (score <= 2) {
    label = 'Trung bình (Nên thêm chữ hoa/số)';
    colorClass = 'bg-amber-100 text-amber-900';
    barColor = 'bg-amber-500';
  } else if (score <= 3) {
    label = 'Khá mạnh';
    colorClass = 'bg-sky-100 text-sky-900';
    barColor = 'bg-sky-500';
  } else {
    label = 'Rất an toàn & Bảo mật cao!';
    colorClass = 'bg-emerald-100 text-emerald-900';
    barColor = 'bg-emerald-500';
  }

  return {
    score,
    percent: Math.min(100, (score / 5) * 100),
    label,
    colorClass,
    barColor,
    hasMinLength,
    hasUpperAndLower,
    hasNumber,
    hasSpecial,
  };
}

export const AccountModal: React.FC<AccountModalProps> = ({
  currentUser,
  onUserUpdated,
  onClose
}) => {
  const isGuest = authService.isGuest();
  const [tab, setTab] = useState<'profile' | 'avatar' | 'login' | 'register' | 'changePass'>(
    isGuest ? 'login' : 'profile'
  );

  // Form states
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSecurityGuide, setShowSecurityGuide] = useState(true);
  const [selectedRegisterAvatar, setSelectedRegisterAvatar] = useState<string>(
    currentUser.avatarUrl || PRESET_AVATARS[0].url
  );

  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearForms = () => {
    setEmail('');
    setDisplayName('');
    setPassword('');
    setConfirmPassword('');
    setOldPassword('');
    setNewPassword('');
    setMessage(null);
  };

  // Process uploaded image from phone or computer using HTML5 canvas (center-crop to 160x160)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ text: 'Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP...)', isError: true });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 160;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Center crop square
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;

        ctx.fillStyle = '#FFF8EE';
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        sound.playBonusSound();

        if (tab === 'register') {
          setSelectedRegisterAvatar(dataUrl);
          setMessage({ text: 'Đã tải ảnh từ thiết bị! Hoàn tất đăng ký để lưu.', isError: false });
        } else {
          const res = authService.updateAvatar(dataUrl);
          onUserUpdated({ ...authService.getCurrentUser() });
          setMessage({ text: res.message, isError: !res.success });
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSelectPresetAvatar = (url: string) => {
    sound.playClickSound();
    if (tab === 'register') {
      setSelectedRegisterAvatar(url);
    } else {
      const res = authService.updateAvatar(url);
      onUserUpdated({ ...authService.getCurrentUser() });
      setMessage({ text: res.message, isError: !res.success });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ text: 'Vui lòng nhập đầy đủ địa chỉ Gmail và mật khẩu!', isError: true });
      return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await authService.login(email, password);
      if (res.success) {
        sound.playBonusSound();
        setMessage({ text: res.message, isError: false });
        onUserUpdated({ ...authService.getCurrentUser() });
        setTimeout(() => setTab('profile'), 600);
      } else {
        setMessage({ text: res.message, isError: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ text: 'Vui lòng nhập địa chỉ Gmail và mật khẩu!', isError: true });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ text: 'Mật khẩu xác nhận không khớp!', isError: true });
      return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await authService.register(email, password, displayName, selectedRegisterAvatar);
      if (res.success) {
        sound.playLevelUpSound();
        setMessage({
          text: '🎉 Tạo tài khoản Gmail thành công! Bạn có thể chọn 30 Avatar có sẵn hoặc tải ảnh lên bên dưới.',
          isError: false
        });
        onUserUpdated({ ...authService.getCurrentUser() });
        setTimeout(() => setTab('avatar'), 500);
      } else {
        setMessage({ text: res.message, isError: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setMessage({ text: 'Vui lòng điền mật khẩu cũ và mật khẩu mới!', isError: true });
      return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await authService.changePassword(oldPassword, newPassword);
      if (res.success) {
        sound.playBonusSound();
        setMessage({ text: res.message, isError: false });
        setOldPassword('');
        setNewPassword('');
        setTimeout(() => setTab('profile'), 1000);
      } else {
        setMessage({ text: res.message, isError: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sound.playClickSound();
    authService.logout();
    onUserUpdated({ ...authService.getCurrentUser() });
    setTab('login');
    setMessage({ text: 'Đã đăng xuất khỏi tài khoản!', isError: false });
  };

  const pwStrength = evaluatePasswordStrength(tab === 'changePass' ? newPassword : password);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 select-none animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#FFFDF9] rounded-3xl p-4 sm:p-5 shadow-2xl border-4 border-[#7A4419] h-[90vh] max-h-[680px] flex flex-col overflow-hidden">
        {/* Hidden file input for uploading avatar from phone or computer */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#F3DEC4] shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src={currentUser.avatarUrl || PRESET_AVATARS[0].url}
              alt="Avatar"
              className="w-11 h-11 rounded-2xl border-2 border-[#7A4419] object-cover bg-[#FFE8CC] shadow-xs"
            />
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#4A2511] leading-tight">
                TÀI KHOẢN GMAIL & AVATAR
              </h2>
              <p className="text-[11px] font-bold text-[#8C583A]">
                Đăng nhập Gmail bảo mật • 30 Avatar & Tải ảnh cá nhân
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#FDE8CD] hover:bg-[#F5CFA0] text-[#4A2511] font-black text-base flex items-center justify-center transition-transform active:scale-90 cursor-pointer border border-[#D4A373]"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-2.5 flex rounded-2xl bg-[#F9EAD8] p-1 border-2 border-[#E6C7A6] gap-1 text-xs font-black text-[#5C3317] shrink-0">
          {!isGuest && (
            <>
              <button
                onClick={() => {
                  sound.playClickSound();
                  clearForms();
                  setTab('profile');
                }}
                className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                  tab === 'profile' ? 'bg-[#8B4513] text-white shadow-xs' : 'hover:bg-[#F3DEC4]'
                }`}
              >
                👤 Hồ Sơ
              </button>
              <button
                onClick={() => {
                  sound.playClickSound();
                  setMessage(null);
                  setTab('avatar');
                }}
                className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                  tab === 'avatar' ? 'bg-[#8B4513] text-white shadow-xs' : 'hover:bg-[#F3DEC4]'
                }`}
              >
                🖼️ Đổi Avatar (30)
              </button>
            </>
          )}

          {isGuest && (
            <>
              <button
                onClick={() => {
                  sound.playClickSound();
                  clearForms();
                  setTab('login');
                }}
                className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                  tab === 'login' ? 'bg-[#8B4513] text-white shadow-xs' : 'hover:bg-[#F3DEC4]'
                }`}
              >
                🔑 Đăng Nhập Gmail
              </button>

              <button
                onClick={() => {
                  sound.playClickSound();
                  clearForms();
                  setTab('register');
                }}
                className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
                  tab === 'register' ? 'bg-[#8B4513] text-white shadow-xs' : 'hover:bg-[#F3DEC4]'
                }`}
              >
                ✨ Tạo Tài Khoản Gmail
              </button>
            </>
          )}
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`mt-2 p-2.5 rounded-xl text-xs font-bold text-center border-2 shrink-0 ${
              message.isError
                ? 'bg-rose-50 text-rose-800 border-rose-300'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pt-2.5 pr-1.5 pb-4">
          {/* TAB 1: PROFILE VIEW (When logged in) */}
          {tab === 'profile' && !isGuest && (
            <div className="flex flex-col gap-3">
              {/* Profile Card with Avatar & Change Avatar button */}
              <div className="flex items-center justify-between gap-3 p-3.5 bg-[#FFF6E9] rounded-2xl border-2 border-[#E6C7A6]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={currentUser.avatarUrl || PRESET_AVATARS[0].url}
                      alt={currentUser.displayName}
                      className="w-16 h-16 rounded-2xl border-3 border-[#7A4419] object-cover bg-white shadow-md"
                    />
                    <button
                      onClick={() => {
                        sound.playClickSound();
                        setTab('avatar');
                      }}
                      className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#D27D2D] hover:bg-[#B3621B] text-white text-xs flex items-center justify-center border-2 border-white shadow cursor-pointer"
                      title="Đổi Avatar"
                    >
                      📷
                    </button>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-black text-[#4A2511] truncate">
                      {currentUser.displayName}
                    </h3>
                    <p className="text-xs font-bold text-[#8C583A] truncate">
                      📧 {currentUser.username}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] font-black text-[#6B3E26]">
                      <span>Cấp {currentUser.level}</span>
                      <span>•</span>
                      <span>Màn {currentUser.maxStageUnlocked}/50</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playClickSound();
                    setTab('avatar');
                  }}
                  className="px-3 py-2 rounded-xl bg-[#8B4513] hover:bg-[#6B3E26] text-white text-xs font-black shrink-0 shadow-xs cursor-pointer"
                >
                  🖼️ Đổi Avatar
                </button>
              </div>

              {/* High Scores */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800">🟢 Mức Dễ</span>
                  <div className="text-base font-black text-emerald-950">{currentUser.highScores.easy}đ</div>
                </div>
                <div className="p-2.5 rounded-2xl bg-amber-50 border-2 border-amber-200">
                  <span className="text-[11px] font-bold text-amber-800">🟡 Bình thường</span>
                  <div className="text-base font-black text-amber-950">{currentUser.highScores.normal}đ</div>
                </div>
                <div className="p-2.5 rounded-2xl bg-rose-50 border-2 border-rose-200">
                  <span className="text-[11px] font-bold text-rose-800">🔴 Mức Khó</span>
                  <div className="text-base font-black text-rose-950">{currentUser.highScores.hard}đ</div>
                </div>
              </div>

              {/* Player Statistics */}
              <div className="p-3 bg-[#FAF2E8] rounded-2xl border-2 border-[#E6C7A6] text-xs flex flex-col gap-1.5 text-[#4A2511] font-semibold">
                <div className="flex justify-between">
                  <span>Tổng số trận đã chơi:</span>
                  <strong className="font-black">{currentUser.stats.totalGames} trận</strong>
                </div>
                <div className="flex justify-between">
                  <span>Tổng cục cứt đã né:</span>
                  <strong className="font-black text-[#8B4513]">{currentUser.stats.totalPoopsDodged} cục</strong>
                </div>
                <div className="flex justify-between">
                  <span>Màn chơi đã vượt qua:</span>
                  <strong className="font-black text-emerald-700">{currentUser.stats.stagesCleared} lần</strong>
                </div>
                <div className="flex justify-between">
                  <span>Bộ sưu tập đã mở:</span>
                  <strong className="font-black text-purple-800">{currentUser.unlockedCharacters.length}/50</strong>
                </div>
              </div>

              {/* Account Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    sound.playClickSound();
                    setTab('changePass');
                  }}
                  className="flex-1 py-2.5 text-xs font-black rounded-xl bg-[#F3DEC4] hover:bg-[#E6C7A6] text-[#4A2511] transition-all cursor-pointer"
                >
                  🔒 Đổi mật khẩu
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2.5 text-xs font-black rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 transition-all cursor-pointer"
                >
                  🚪 Đăng xuất
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: AVATAR PICKER (30 Built-in Avatars + Upload from Phone/PC) */}
          {tab === 'avatar' && (
            <div className="flex flex-col gap-3">
              {/* Current Avatar & Upload from Device */}
              <div className="p-3 rounded-2xl bg-[#FFF6E9] border-2 border-[#E6C7A6] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatarUrl || PRESET_AVATARS[0].url}
                    alt="Current Avatar"
                    className="w-16 h-16 rounded-2xl border-3 border-[#7A4419] object-cover bg-white shadow"
                  />
                  <div>
                    <div className="text-sm font-black text-[#4A2511]">
                      Ảnh đại diện hiện tại
                    </div>
                    <div className="text-[11px] font-semibold text-[#8C583A]">
                      Chọn 1 trong 30 hình bên dưới hoặc tải ảnh của bạn lên
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClickSound();
                    fileInputRef.current?.click();
                  }}
                  className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-gradient-to-b from-[#D27D2D] to-[#9A4E14] hover:from-[#E08E45] hover:to-[#8B4513] text-white text-xs font-black border-b-3 border-[#5C2C0C] shadow flex items-center justify-center gap-1.5 cursor-pointer shrink-0 active:scale-95 transition-all"
                >
                  <span>📤</span>
                  <span>Tải ảnh từ Điện thoại / Máy tính</span>
                </button>
              </div>

              {/* 30 Built-in Avatars Grid */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-black text-[#4A2511]">
                    🎨 30 Hình Ảnh Hoạt Hình Có Sẵn Của Ứng Dụng:
                  </span>
                  <span className="text-[11px] font-bold text-[#8C583A]">
                    Chạm để đổi ngay
                  </span>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                  {PRESET_AVATARS.map(av => {
                    const isSelected = currentUser.avatarUrl === av.url;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => handleSelectPresetAvatar(av.url)}
                        className={`group relative p-1 rounded-2xl border-2 transition-all flex flex-col items-center cursor-pointer ${
                          isSelected
                            ? 'bg-[#FDE8CD] border-[#7A4419] ring-2 ring-[#D27D2D] scale-105 shadow-md'
                            : 'bg-white hover:bg-[#FFF6E9] border-[#E6C7A6]'
                        }`}
                        title={av.name}
                      >
                        <img
                          src={av.url}
                          alt={av.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <span className="mt-0.5 text-[9px] font-bold text-[#5C3317] truncate w-full text-center">
                          #{av.id}
                        </span>
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center shadow">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOGIN WITH GMAIL */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <div className="p-3 rounded-2xl bg-[#FFF6E9] border-2 border-[#E6C7A6] text-xs text-[#5C3317] font-semibold flex items-center gap-2.5">
                <span className="text-2xl">📧</span>
                <div>
                  <strong className="font-black text-[#4A2511] block">
                    Đăng nhập bằng tài khoản Gmail của bạn
                  </strong>
                  <span>Lưu trữ kỷ lục, Rank, 50 màn chơi và Avatar cá nhân an toàn!</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#4A2511] mb-1">
                  Địa chỉ Gmail của bạn
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-bold text-[#4A2511] bg-white rounded-xl border-2 border-[#D4A373] focus:border-[#8B4513] focus:outline-none"
                    placeholder="vidu.tenban@gmail.com"
                    required
                  />
                  {!email.includes('@') && email.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={() => setEmail(`${email.trim()}@gmail.com`)}
                      className="absolute right-2 px-2 py-1 rounded-lg bg-[#FDE8CD] hover:bg-[#F5CFA0] text-[#4A2511] text-[11px] font-black border border-[#D4A373] cursor-pointer"
                    >
                      + @gmail.com
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#4A2511] mb-1">
                  Mật khẩu tài khoản game
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-bold text-[#4A2511] bg-white rounded-xl border-2 border-[#D4A373] focus:border-[#8B4513] focus:outline-none pr-10"
                    placeholder="Nhập mật khẩu đã tạo"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-sm text-[#8C583A] hover:text-[#4A2511] cursor-pointer"
                    title="Hiện / Ẩn mật khẩu"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 w-full py-3 bg-gradient-to-b from-[#D27D2D] to-[#8B4513] hover:from-[#E08E45] hover:to-[#6B3E26] text-white font-black text-sm rounded-2xl border-b-4 border-[#4A2511] shadow-md active:scale-98 transition-all cursor-pointer"
              >
                {isLoading ? 'Đang đăng nhập...' : '🔑 ĐĂNG NHẬP BẰNG GMAIL'}
              </button>

              <div className="text-center text-xs font-semibold text-[#6B3E26] mt-1">
                Chưa có tài khoản Gmail trên game?{' '}
                <button
                  type="button"
                  onClick={() => {
                    clearForms();
                    setTab('register');
                  }}
                  className="font-black underline text-[#8B4513] hover:text-[#D27D2D] cursor-pointer"
                >
                  Đăng ký & Chọn Avatar ngay
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: REGISTER WITH GMAIL + PASSWORD SECURITY GUIDE + AVATAR SELECTION */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="flex flex-col gap-3">
              {/* Detailed Security Guide Box as requested */}
              <div className="p-3 rounded-2xl bg-[#FFF6E9] border-2 border-[#D4A373] text-xs text-[#4A2511]">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#6B3E26] flex items-center gap-1.5">
                    <span>🛡️</span>
                    <span>CÁCH TẠO MẬT KHẨU AN TOÀN & BẢO MẬT THÔNG TIN:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSecurityGuide(!showSecurityGuide)}
                    className="text-[11px] font-bold underline text-[#8B4513] cursor-pointer"
                  >
                    {showSecurityGuide ? 'Thu gọn' : 'Xem hướng dẫn'}
                  </button>
                </div>

                {showSecurityGuide && (
                  <ul className="mt-2 space-y-1 text-[11px] font-semibold text-[#5C3317] list-disc pl-4">
                    <li>
                      <strong>Tuyệt đối không dùng mật khẩu thật của hộp thư Gmail:</strong> Hãy tự đặt một mật khẩu riêng chỉ dùng cho trò chơi này để bảo vệ Gmail cá nhân của bạn 100%.
                    </li>
                    <li>
                      <strong>Công thức mật khẩu mạnh:</strong> Từ <strong>8 ký tự trở lên</strong>, kết hợp chữ HOA (<code>A-Z</code>), chữ thường (<code>a-z</code>), chữ số (<code>0-9</code>) và ký tự đặc biệt (<code>!@#$</code>). Ví dụ: <code>Shiba@2026!</code>
                    </li>
                    <li>
                      <strong>Mã hóa chuẩn Web Crypto:</strong> Mật khẩu của bạn được băm một chiều bằng thuật toán <strong>SHA-256 kèm chuỗi Muối (Salt) ngẫu nhiên</strong>, không lưu dạng văn bản thô.
                    </li>
                  </ul>
                )}
              </div>

              {/* Gmail Input */}
              <div>
                <label className="block text-xs font-black text-[#4A2511] mb-1">
                  1. Địa chỉ Gmail của bạn
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm font-bold text-[#4A2511] bg-white rounded-xl border-2 border-[#D4A373] focus:border-[#8B4513] focus:outline-none"
                    placeholder="Ví dụ: quynhnhu06@gmail.com"
                    required
                  />
                  {!email.includes('@') && email.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={() => setEmail(`${email.trim()}@gmail.com`)}
                      className="absolute right-2 px-2 py-1 rounded-lg bg-[#FDE8CD] hover:bg-[#F5CFA0] text-[#4A2511] text-[11px] font-black border border-[#D4A373] cursor-pointer"
                    >
                      + @gmail.com
                    </button>
                  )}
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-xs font-black text-[#4A2511] mb-1">
                  2. Biệt danh hiển thị trong game
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-bold text-[#4A2511] bg-white rounded-xl border-2 border-[#D4A373] focus:border-[#8B4513] focus:outline-none"
                  placeholder="Ví dụ: Thánh Né Cứt"
                />
              </div>

              {/* Password + Real-time Strength Meter */}
              <div>
                <label className="block text-xs font-black text-[#4A2511] mb-1">
                  3. Tạo mật khẩu an toàn cho tài khoản
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm font-bold text-[#4A2511] bg-white rounded-xl border-2 border-[#D4A373] focus:border-[#8B4513] focus:outline-none pr-10"
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự, nên 8+ ký tự)"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-sm text-[#8C583A] hover:text-[#4A2511] cursor-pointer"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>

                {/* Live Password Security Meter */}
                {password.length > 0 && (
                  <div className="mt-1.5 p-2 rounded-xl bg-[#FAF2E8] border border-[#E6C7A6]">
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                      <span className="text-[#5C3317]">Độ an toàn mật khẩu:</span>
                      <span className={`px-2 py-0.5 rounded-md font-black ${pwStrength.colorClass}`}>
                        {pwStrength.label}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${pwStrength.barColor}`}
                        style={{ width: `${pwStrength.percent}%` }}
                      />
                    </div>
                    <div className="mt-1.5 grid grid-cols-2 gap-1 text-[10px] font-bold">
                      <span className={pwStrength.hasMinLength ? 'text-emerald-700' : 'text-stone-500'}>
                        {pwStrength.hasMinLength ? '✓' : '○'} Từ 8 ký tự trở lên
                      </span>
                      <span className={pwStrength.hasUpperAndLower ? 'text-emerald-700' : 'text-stone-500'}>
                        {pwStrength.hasUpperAndLower ? '✓' : '○'} Có chữ HOA & thường
                      </span>
                      <span className={pwStrength.hasNumber ? 'text-emerald-700' : 'text-stone-500'}>
                        {pwStrength.hasNumber ? '✓' : '○'} Có chữ số (0-9)
                      </span>
                      <span className={pwStrength.hasSpecial ? 'text-emerald-700' : 'text-stone-500'}>
                        {pwStrength.hasSpecial ? '✓' : '○'} Ký tự đặc biệt (!@#$)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-black text-[#4A2511] mb-1">
                  4. Nhập lại mật khẩu xác nhận
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-bold text-[#4A2511] bg-white rounded-xl border-2 border-[#D4A373] focus:border-[#8B4513] focus:outline-none"
                  placeholder="Nhập lại mật khẩu bên trên"
                  required
                />
              </div>

              {/* Choose Avatar right during registration (30 built-in or upload) */}
              <div className="p-2.5 rounded-2xl bg-[#FFF6E9] border-2 border-[#E6C7A6]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedRegisterAvatar}
                      alt="Avatar"
                      className="w-10 h-10 rounded-xl border-2 border-[#7A4419] object-cover bg-white"
                    />
                    <div>
                      <span className="text-xs font-black text-[#4A2511] block">
                        5. Chọn Avatar Tài Khoản (30 mẫu hoặc tải ảnh)
                      </span>
                      <span className="text-[10px] font-semibold text-[#8C583A]">
                        Bạn có thể đổi lại bất cứ lúc nào sau khi tạo xong
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 rounded-xl bg-[#8B4513] hover:bg-[#6B3E26] text-white text-[11px] font-black cursor-pointer shrink-0"
                  >
                    📤 Tải ảnh lên
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-1.5 max-h-28 overflow-y-auto custom-scrollbar p-1">
                  {PRESET_AVATARS.map(av => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => handleSelectPresetAvatar(av.url)}
                      className={`p-0.5 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedRegisterAvatar === av.url
                          ? 'border-[#7A4419] bg-[#FDE8CD] scale-105'
                          : 'border-transparent hover:border-[#D4A373]'
                      }`}
                    >
                      <img src={av.url} alt={av.name} className="w-9 h-9 rounded-lg mx-auto" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-b from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white font-black text-sm rounded-2xl border-b-4 border-emerald-900 shadow-md active:scale-98 transition-all cursor-pointer"
              >
                {isLoading ? 'Đang tạo tài khoản...' : '✨ HOÀN TẤT TẠO TÀI KHOẢN GMAIL'}
              </button>
            </form>
          )}

          {/* TAB 5: CHANGE PASSWORD */}
          {tab === 'changePass' && (
            <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-black text-[#4A2511] mb-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-bold rounded-xl border-2 border-[#D4A373]"
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#4A2511] mb-1">Mật khẩu mới (Tối thiểu 6 ký tự)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-bold rounded-xl border-2 border-[#D4A373]"
                  placeholder="Nhập mật khẩu mới an toàn"
                  required
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setTab('profile')}
                  className="flex-1 py-2.5 text-xs font-black rounded-xl bg-stone-200 text-stone-700 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 text-xs font-black rounded-xl bg-[#8B4513] text-white cursor-pointer"
                >
                  {isLoading ? 'Đang lưu...' : 'Lưu mật khẩu mới'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
