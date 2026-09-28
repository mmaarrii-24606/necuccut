import { CHARACTERS } from '../data/characters';
import { GAME_THEMES } from '../data/themes';
import { POOP_STYLES } from '../data/poopStyles';
import { GAME_RANKS, GameRank } from '../data/ranks';
import { PRESET_AVATARS } from '../data/avatars';

export type GameDifficulty = 'easy' | 'normal' | 'hard';

export interface UserStats {
  totalGames: number;
  totalPoopsDodged: number;
  maxSurvivalSeconds: number;
  totalPlayTimeSeconds: number;
  stagesCleared: number;
}

export interface UserProfile {
  id: string;
  username: string; // Gmail address (e.g., player@gmail.com) or username
  displayName: string;
  avatarUrl: string;
  passwordHash?: string;
  salt?: string;
  createdAt: number;
  level: number;
  exp: number;
  maxExp: number;

  // 50 Stages and Rank System
  currentStage: number; // Current chosen stage (1 - 50)
  maxStageUnlocked: number; // Furthest stage unlocked (1 - 50)
  rankTier: number; // 1 to 10 (1=Đồng, 2=Bạc, 3=Vàng, ..., 10=Huyền Thoại)
  consecutiveLosses: number; // 0, 1, 2 (If reaches 3 -> rank down!)

  // Selections & Unlocks (up to 50 each)
  selectedCharacterId: number;
  selectedThemeId: string;
  selectedPoopStyleId: string;

  unlockedCharacters: number[];
  unlockedThemes: string[];
  unlockedPoopStyles: string[];

  highScores: {
    easy: number;
    normal: number;
    hard: number;
  };
  stats: UserStats;
}

const STORAGE_USERS_KEY = 'poop_dodger_accounts_v2';
const STORAGE_CURRENT_KEY = 'poop_dodger_current_session_v2';
const STORAGE_LEGACY_HIGHSCORE = 'poop_dodger_high_score';

// Helper to hash password securely with Web Crypto API and salt
async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(password + salt + 'poop_dodger_secret_pepper');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Calculate max exp required for next level
export function getRequiredExp(level: number): number {
  return Math.min(1000, 100 + (level - 1) * 50);
}

// Get required survival seconds to clear a stage (starting at 20s)
export function getStageRequiredTime(stage: number): number {
  return Math.min(40, 20 + Math.floor((stage - 1) * 0.4));
}

// Default guest profile
export function createDefaultProfile(username = 'Khách Vui Tính', displayName = 'Người Chơi Mới'): UserProfile {
  const legacyBest = parseInt(localStorage.getItem(STORAGE_LEGACY_HIGHSCORE) || '0', 10);
  return {
    id: 'guest_' + Date.now(),
    username,
    displayName,
    avatarUrl: PRESET_AVATARS[0].url,
    createdAt: Date.now(),
    level: 1,
    exp: 0,
    maxExp: getRequiredExp(1),

    currentStage: 1,
    maxStageUnlocked: 1,
    rankTier: 1, // Start at Rank Đồng
    consecutiveLosses: 0,

    selectedCharacterId: 1,
    selectedThemeId: 'stage1',
    selectedPoopStyleId: 'poop1',

    unlockedCharacters: [1],
    unlockedThemes: ['stage1'],
    unlockedPoopStyles: ['poop1'],

    highScores: {
      easy: legacyBest,
      normal: legacyBest,
      hard: legacyBest
    },
    stats: {
      totalGames: 0,
      totalPoopsDodged: 0,
      maxSurvivalSeconds: 0,
      totalPlayTimeSeconds: 0,
      stagesCleared: 0
    }
  };
}

class AuthService {
  private currentUser: UserProfile | null = null;

  constructor() {
    this.loadSession();
  }

  private getAllUsers(): Record<string, UserProfile> {
    try {
      const data = localStorage.getItem(STORAGE_USERS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private saveAllUsers(users: Record<string, UserProfile>) {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  }

  private loadSession(): UserProfile {
    try {
      const session = localStorage.getItem(STORAGE_CURRENT_KEY);
      if (session) {
        const parsed = JSON.parse(session);
        // Ensure new rank, stage & avatar fields exist if migrating
        if (!parsed.currentStage) parsed.currentStage = 1;
        if (!parsed.maxStageUnlocked) parsed.maxStageUnlocked = 1;
        if (!parsed.rankTier) parsed.rankTier = 1;
        if (parsed.consecutiveLosses === undefined) parsed.consecutiveLosses = 0;
        if (!parsed.unlockedPoopStyles) parsed.unlockedPoopStyles = ['poop1'];
        if (!parsed.avatarUrl) parsed.avatarUrl = PRESET_AVATARS[0].url;

        if (parsed.username && !parsed.username.startsWith('guest_')) {
          const all = this.getAllUsers();
          if (all[parsed.username.toLowerCase()]) {
            const combined: UserProfile = {
              ...parsed,
              ...all[parsed.username.toLowerCase()],
            };
            if (!combined.avatarUrl) combined.avatarUrl = PRESET_AVATARS[0].url;
            this.currentUser = combined;
            return combined;
          }
        }
        this.currentUser = parsed;
        return parsed;
      }
    } catch {
      // Fallback
    }

    const guest = createDefaultProfile();
    this.currentUser = guest;
    this.saveSession(guest);
    return guest;
  }

  private saveSession(user: UserProfile) {
    this.currentUser = user;
    localStorage.setItem(STORAGE_CURRENT_KEY, JSON.stringify(user));
    const overallMax = Math.max(user.highScores.easy, user.highScores.normal, user.highScores.hard);
    localStorage.setItem(STORAGE_LEGACY_HIGHSCORE, String(overallMax));

    if (user.username && !user.id.startsWith('guest_')) {
      const users = this.getAllUsers();
      users[user.username.toLowerCase()] = user;
      this.saveAllUsers(users);
    }
  }

  public getCurrentUser(): UserProfile {
    if (!this.currentUser) {
      return this.loadSession();
    }
    return this.currentUser;
  }

  public getCurrentRank(): GameRank {
    const user = this.getCurrentUser();
    return GAME_RANKS.find(r => r.tier === user.rankTier) || GAME_RANKS[0];
  }

  public isGuest(): boolean {
    return !this.currentUser || this.currentUser.id.startsWith('guest_');
  }

  // Register new secured Gmail account
  public async register(emailInput: string, password: string, displayName?: string, customAvatarUrl?: string): Promise<{ success: boolean; message: string }> {
    let cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: 'Vui lòng nhập địa chỉ Gmail của bạn!' };
    }
    // If user typed only the username part without @, auto-append @gmail.com if valid
    if (!cleanEmail.includes('@')) {
      cleanEmail = `${cleanEmail}@gmail.com`;
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]{3,}@gmail\.com$/;
    if (!gmailRegex.test(cleanEmail)) {
      return {
        success: false,
        message: 'Vui lòng nhập đúng định dạng Gmail hợp lệ (ví dụ: tenban@gmail.com)!'
      };
    }

    if (!password || password.length < 6) {
      return { success: false, message: 'Mật khẩu bảo mật phải có ít nhất 6 ký tự!' };
    }

    const allUsers = this.getAllUsers();
    if (allUsers[cleanEmail]) {
      return { success: false, message: 'Địa chỉ Gmail này đã được đăng ký! Hãy chuyển sang mục Đăng nhập.' };
    }

    const salt = generateSalt();
    const hash = await hashPassword(password, salt);

    const guestData = this.currentUser && this.currentUser.id.startsWith('guest_') ? this.currentUser : createDefaultProfile();
    const defaultName = cleanEmail.split('@')[0];

    const newUser: UserProfile = {
      ...guestData,
      id: 'usr_' + Date.now(),
      username: cleanEmail,
      displayName: displayName?.trim() || defaultName,
      avatarUrl: customAvatarUrl || guestData.avatarUrl || PRESET_AVATARS[0].url,
      passwordHash: hash,
      salt: salt,
      createdAt: Date.now()
    };

    allUsers[cleanEmail] = newUser;
    this.saveAllUsers(allUsers);
    this.saveSession(newUser);

    return { success: true, message: 'Tạo tài khoản Gmail thành công! Hãy chọn Avatar yêu thích của bạn nhé.' };
  }

  // Login with Gmail
  public async login(emailInput: string, password: string): Promise<{ success: boolean; message: string }> {
    let cleanUser = emailInput.trim().toLowerCase();
    const allUsers = this.getAllUsers();

    // Try exact match first, or with @gmail.com appended
    let user = allUsers[cleanUser];
    if (!user && !cleanUser.includes('@')) {
      user = allUsers[`${cleanUser}@gmail.com`];
    }

    if (!user || !user.passwordHash || !user.salt) {
      return { success: false, message: 'Địa chỉ Gmail hoặc mật khẩu không chính xác!' };
    }

    const computed = await hashPassword(password, user.salt);
    if (computed !== user.passwordHash) {
      return { success: false, message: 'Địa chỉ Gmail hoặc mật khẩu không chính xác!' };
    }

    if (!user.avatarUrl) {
      user.avatarUrl = PRESET_AVATARS[0].url;
    }

    this.saveSession(user);
    return { success: true, message: `Đăng nhập thành công! Chào mừng ${user.displayName}!` };
  }

  // Update avatar (from 30 built-in avatars or uploaded image)
  public updateAvatar(newAvatarUrl: string): { success: boolean; message: string } {
    if (!this.currentUser) return { success: false, message: 'Không tìm thấy phiên người dùng!' };
    this.currentUser.avatarUrl = newAvatarUrl;
    this.saveSession(this.currentUser);
    return { success: true, message: 'Đã cập nhật ảnh đại diện (Avatar) thành công!' };
  }

  // Update display name
  public updateDisplayName(newDisplayName: string): { success: boolean; message: string } {
    if (!this.currentUser) return { success: false, message: 'Không tìm thấy phiên người dùng!' };
    const clean = newDisplayName.trim();
    if (!clean || clean.length < 2) {
      return { success: false, message: 'Biệt danh phải có ít nhất 2 ký tự!' };
    }
    this.currentUser.displayName = clean;
    this.saveSession(this.currentUser);
    return { success: true, message: 'Đã cập nhật biệt danh thành công!' };
  }

  // Change password
  public async changePassword(oldPass: string, newPass: string): Promise<{ success: boolean; message: string }> {
    if (!this.currentUser || this.isGuest()) {
      return { success: false, message: 'Bạn đang dùng tài khoản khách! Hãy đăng ký tài khoản trước.' };
    }
    if (!newPass || newPass.length < 4) {
      return { success: false, message: 'Mật khẩu mới phải có ít nhất 4 ký tự!' };
    }

    const computed = await hashPassword(oldPass, this.currentUser.salt || '');
    if (computed !== this.currentUser.passwordHash) {
      return { success: false, message: 'Mật khẩu hiện tại không chính xác!' };
    }

    const newSalt = generateSalt();
    const newHash = await hashPassword(newPass, newSalt);

    this.currentUser.salt = newSalt;
    this.currentUser.passwordHash = newHash;
    this.saveSession(this.currentUser);

    return { success: true, message: 'Đổi mật khẩu thành công!' };
  }

  // Logout
  public logout() {
    const guest = createDefaultProfile();
    this.saveSession(guest);
  }

  // Select stage (1 - 50)
  public selectStage(stageNum: number) {
    if (!this.currentUser) return;
    if (stageNum >= 1 && stageNum <= this.currentUser.maxStageUnlocked) {
      this.currentUser.currentStage = stageNum;
      // Auto switch theme matching stage if desired
      const stageTheme = `stage${stageNum}`;
      if (this.currentUser.unlockedThemes.includes(stageTheme)) {
        this.currentUser.selectedThemeId = stageTheme;
      }
      this.saveSession(this.currentUser);
    }
  }

  // Select character
  public selectCharacter(charId: number) {
    if (!this.currentUser) return;
    if (this.currentUser.unlockedCharacters.includes(charId)) {
      this.currentUser.selectedCharacterId = charId;
      this.saveSession(this.currentUser);
    }
  }

  // Select theme
  public selectTheme(themeId: string) {
    if (!this.currentUser) return;
    if (this.currentUser.unlockedThemes.includes(themeId)) {
      this.currentUser.selectedThemeId = themeId;
      this.saveSession(this.currentUser);
    }
  }

  // Select poop style
  public selectPoopStyle(styleId: string) {
    if (!this.currentUser) return;
    if (this.currentUser.unlockedPoopStyles.includes(styleId)) {
      this.currentUser.selectedPoopStyleId = styleId;
      this.saveSession(this.currentUser);
    }
  }

  // PASS STAGE: "mỗi khi qua màn là được thêm giao diện mới... cứ mỗi khi qua được 5 màn thì lên 1 rank"
  public passCurrentStage(
    score: number,
    survivalSeconds: number,
    poopsDodged: number,
    difficulty: GameDifficulty
  ): {
    stagePassed: number;
    nextStage: number;
    newStageUnlocked: boolean;
    rankUp: boolean;
    oldRank: GameRank;
    newRank: GameRank;
    newThemeUnlocked?: string;
    newCharUnlocked?: number;
    newPoopUnlocked?: string;
    expEarned: number;
    leveledUp: boolean;
  } {
    const user = this.getCurrentUser();
    const stagePassed = user.currentStage;
    user.consecutiveLosses = 0; // Reset loss streak on pass
    user.stats.stagesCleared += 1;
    user.stats.totalGames += 1;
    user.stats.totalPoopsDodged += poopsDodged;
    user.stats.totalPlayTimeSeconds += survivalSeconds;

    // High score
    if (score > (user.highScores[difficulty] || 0)) {
      user.highScores[difficulty] = score;
    }

    // EXP
    const expEarned = Math.floor(score * 1.5 + survivalSeconds * 2.5 + 40);
    user.exp += expEarned;
    let leveledUp = false;
    while (user.exp >= user.maxExp && user.level < 50) {
      user.exp -= user.maxExp;
      user.level += 1;
      user.maxExp = getRequiredExp(user.level);
      leveledUp = true;
    }

    // Unlock next stage (up to 50)
    let newStageUnlocked = false;
    let nextStage = stagePassed;
    let newThemeUnlocked: string | undefined;
    let newCharUnlocked: number | undefined;
    let newPoopUnlocked: string | undefined;

    if (stagePassed < 50) {
      nextStage = stagePassed + 1;
      if (nextStage > user.maxStageUnlocked) {
        user.maxStageUnlocked = nextStage;
        newStageUnlocked = true;

        // "Mỗi khi qua màn là được thêm giao diện mới"
        // Unlock new theme
        const themeId = `stage${nextStage}`;
        if (!user.unlockedThemes.includes(themeId)) {
          user.unlockedThemes.push(themeId);
          newThemeUnlocked = themeId;
        }

        // Unlock new character
        if (!user.unlockedCharacters.includes(nextStage)) {
          user.unlockedCharacters.push(nextStage);
          newCharUnlocked = nextStage;
        }

        // Unlock new poop style
        const poopId = `poop${nextStage}`;
        if (!user.unlockedPoopStyles.includes(poopId)) {
          user.unlockedPoopStyles.push(poopId);
          newPoopUnlocked = poopId;
        }
      }
      user.currentStage = nextStage;
    }

    // Rank check: "cứ mỗi khi qua được 5 màn thì lên 1 rank"
    const oldTier = user.rankTier;
    const oldRank = GAME_RANKS.find(r => r.tier === oldTier) || GAME_RANKS[0];

    // Every 5 stages cleared -> 1 rank tier higher!
    // E.g. Cleared 5 stages -> Tier 2 (Silver), 10 -> Tier 3 (Gold), ..., 45 -> Tier 10 (Immortal)
    const targetTier = Math.min(10, Math.floor(user.maxStageUnlocked / 5) + 1);
    let rankUp = false;
    if (targetTier > user.rankTier) {
      user.rankTier = targetTier;
      rankUp = true;
    }
    const newRank = GAME_RANKS.find(r => r.tier === user.rankTier) || GAME_RANKS[0];

    this.saveSession(user);

    return {
      stagePassed,
      nextStage,
      newStageUnlocked,
      rankUp,
      oldRank,
      newRank,
      newThemeUnlocked,
      newCharUnlocked,
      newPoopUnlocked,
      expEarned,
      leveledUp
    };
  }

  // FAIL STAGE: "chơi thua 3 lần liên tiếp thì xuống 1 rank"
  public failCurrentStage(
    score: number,
    survivalSeconds: number,
    poopsDodged: number,
    difficulty: GameDifficulty
  ): {
    rankDown: boolean;
    consecutiveLosses: number;
    oldRank: GameRank;
    newRank: GameRank;
    expEarned: number;
    isNewHighScore: boolean;
  } {
    const user = this.getCurrentUser();
    user.stats.totalGames += 1;
    user.stats.totalPoopsDodged += poopsDodged;
    user.stats.totalPlayTimeSeconds += survivalSeconds;

    const currentHigh = user.highScores[difficulty] || 0;
    const isNewHighScore = score > currentHigh;
    if (isNewHighScore) {
      user.highScores[difficulty] = score;
    }

    const expEarned = Math.floor(score * 1.2 + survivalSeconds * 1.5);
    user.exp += expEarned;
    while (user.exp >= user.maxExp && user.level < 50) {
      user.exp -= user.maxExp;
      user.level += 1;
      user.maxExp = getRequiredExp(user.level);
    }

    // Increment loss streak
    user.consecutiveLosses += 1;
    let rankDown = false;
    const oldTier = user.rankTier;
    const oldRank = GAME_RANKS.find(r => r.tier === oldTier) || GAME_RANKS[0];

    // "chơi thua 3 lần liên tiếp thì xuống 1 rank"
    if (user.consecutiveLosses >= 3) {
      if (user.rankTier > 1) {
        user.rankTier -= 1;
        rankDown = true;
      }
      user.consecutiveLosses = 0; // Reset after dropping
    }

    const newRank = GAME_RANKS.find(r => r.tier === user.rankTier) || GAME_RANKS[0];
    this.saveSession(user);

    return {
      rankDown,
      consecutiveLosses: user.consecutiveLosses,
      oldRank,
      newRank,
      expEarned,
      isNewHighScore
    };
  }

  public getHighScore(difficulty: GameDifficulty): number {
    const user = this.getCurrentUser();
    return user.highScores[difficulty] || 0;
  }
}

export const authService = new AuthService();
