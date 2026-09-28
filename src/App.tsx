import React, { useState, useEffect } from 'react';
import { CHARACTERS, Character } from './data/characters';
import { GAME_THEMES, GameTheme } from './data/themes';
import { POOP_STYLES, PoopStyle } from './data/poopStyles';
import { GAME_RANKS, GameRank } from './data/ranks';
import { authService, GameDifficulty, UserProfile, getStageRequiredTime } from './utils/auth';
import { sound } from './utils/audio';
import { getGameLogo, syncFaviconWithLogo } from './utils/gameLogo';
import { StartScreen } from './components/StartScreen';
import { GameCanvas } from './components/GameCanvas';
import { GameOverModal } from './components/GameOverModal';
import { StageClearModal } from './components/StageClearModal';
import { StageModal } from './components/StageModal';
import { SettingsModal } from './components/SettingsModal';
import { CharacterModal } from './components/CharacterModal';
import { ThemeModal } from './components/ThemeModal';
import { AccountModal } from './components/AccountModal';

type AppScreen = 'start' | 'playing' | 'gameover' | 'stageclear';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('start');
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => authService.getCurrentUser());
  const [difficulty, setDifficulty] = useState<GameDifficulty>('normal');
  const [volume, setVolume] = useState<number>(() => sound.getVolume());
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());
  const [gameLogo, setGameLogo] = useState<string>(() => getGameLogo());

  useEffect(() => {
    syncFaviconWithLogo(gameLogo);
  }, [gameLogo]);

  // Modals
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showStageModal, setShowStageModal] = useState<boolean>(false);
  const [showCharModal, setShowCharModal] = useState<boolean>(false);
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);

  // Results for Game Over screen (Fail stage / hit by poop)
  const [gameOverResult, setGameOverResult] = useState<{
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
  }>({
    score: 0,
    survivalSeconds: 0,
    poopsDodged: 0,
    highScore: 0,
    currentStage: 1,
    isNewRecord: false,
    rankDown: false,
    consecutiveLosses: 0,
    oldRank: GAME_RANKS[0],
    newRank: GAME_RANKS[0],
    expEarned: 0,
  });

  // Results for Stage Clear screen (Survived required time)
  const [stageClearResult, setStageClearResult] = useState<{
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
  }>({
    stagePassed: 1,
    nextStage: 2,
    score: 0,
    survivalSeconds: 0,
    poopsDodged: 0,
    rankUp: false,
    oldRank: GAME_RANKS[0],
    newRank: GAME_RANKS[0],
    expEarned: 0,
  });

  // Active selections
  const selectedCharacter: Character =
    CHARACTERS.find(c => c.id === currentUser.selectedCharacterId) || CHARACTERS[0];
  const selectedTheme: GameTheme =
    GAME_THEMES.find(t => t.id === currentUser.selectedThemeId) || GAME_THEMES[0];
  const selectedPoopStyle: PoopStyle =
    POOP_STYLES.find(p => p.id === currentUser.selectedPoopStyleId) || POOP_STYLES[0];
  const currentRank: GameRank =
    GAME_RANKS.find(r => r.tier === currentUser.rankTier) || GAME_RANKS[0];

  const currentHighScore = currentUser.highScores[difficulty] || 0;
  const stageRequiredTime = getStageRequiredTime(currentUser.currentStage);

  // Smooth volume change (0 - 100)
  const handleChangeVolume = (newVol: number) => {
    sound.setVolume(newVol);
    setVolume(sound.getVolume());
    setIsMuted(sound.getMuted());
  };

  // Toggle sound mute/unmute
  const handleToggleSound = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
    setVolume(sound.getVolume());
  };

  // Global desktop keyboard shortcuts
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.key === 'r' || e.key === 'R') && (screen === 'gameover' || screen === 'playing')) {
        handleRestart();
      }
      if (e.key === 'm' || e.key === 'M') {
        handleToggleSound();
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [screen]);

  // Start game
  const handleStartGame = () => {
    sound.startBgm();
    setScreen('playing');
  };

  // Stage Cleared event (Player survived target time)
  const handleStageCleared = (finalScore: number, survivalSeconds: number, poopsDodged: number) => {
    sound.stopBgm();
    const result = authService.passCurrentStage(finalScore, survivalSeconds, poopsDodged, difficulty);
    const updatedUser = authService.getCurrentUser();
    setCurrentUser({ ...updatedUser });

    setStageClearResult({
      stagePassed: result.stagePassed,
      nextStage: result.nextStage,
      score: finalScore,
      survivalSeconds,
      poopsDodged,
      rankUp: result.rankUp,
      oldRank: result.oldRank,
      newRank: result.newRank,
      newThemeUnlocked: result.newThemeUnlocked,
      newCharUnlocked: result.newCharUnlocked,
      newPoopUnlocked: result.newPoopUnlocked,
      expEarned: result.expEarned,
    });

    setScreen('stageclear');
  };

  // Game over event (Player was hit by a poop)
  const handleGameOver = (finalScore: number, survivalSeconds: number, poopsDodged: number) => {
    sound.stopBgm();
    const result = authService.failCurrentStage(finalScore, survivalSeconds, poopsDodged, difficulty);
    const updatedUser = authService.getCurrentUser();
    setCurrentUser({ ...updatedUser });

    setGameOverResult({
      score: finalScore,
      survivalSeconds,
      poopsDodged,
      highScore: Math.max(finalScore, updatedUser.highScores[difficulty] || 0),
      currentStage: updatedUser.currentStage,
      isNewRecord: result.isNewHighScore,
      rankDown: result.rankDown,
      consecutiveLosses: result.consecutiveLosses,
      oldRank: result.oldRank,
      newRank: result.newRank,
      expEarned: result.expEarned,
    });

    setScreen('gameover');
  };

  // Restart current stage directly
  const handleRestart = () => {
    sound.startBgm();
    setScreen('playing');
  };

  // Proceed to next stage
  const handleNextStage = () => {
    sound.startBgm();
    setScreen('playing');
  };

  // Return to home start screen
  const handleExitHome = () => {
    sound.stopBgm();
    setScreen('start');
  };

  // Select a stage (1 to 50)
  const handleSelectStage = (stageNum: number) => {
    authService.selectStage(stageNum);
    setCurrentUser({ ...authService.getCurrentUser() });
    setShowStageModal(false);
  };

  // Character selection
  const handleSelectCharacter = (charId: number) => {
    authService.selectCharacter(charId);
    setCurrentUser({ ...authService.getCurrentUser() });
    setShowCharModal(false);
  };

  // Theme selection
  const handleSelectTheme = (themeId: string) => {
    authService.selectTheme(themeId);
    setCurrentUser({ ...authService.getCurrentUser() });
    setShowThemeModal(false);
  };

  // Poop style selection
  const handleSelectPoopStyle = (styleId: string) => {
    authService.selectPoopStyle(styleId);
    setCurrentUser({ ...authService.getCurrentUser() });
  };

  // User profile updated (e.g. login, register, avatar change, password change)
  const handleUserUpdated = (user: UserProfile) => {
    setCurrentUser({ ...user });
  };

  return (
    <div className="w-screen h-screen max-w-full max-h-screen overflow-hidden bg-[#2B170A] flex items-center justify-center select-none font-sans p-0 sm:p-2">
      {/* Central Game Screen Container - Always 100% fits the viewport height without scrolling */}
      <div className="w-full h-full max-w-2xl sm:max-h-[98vh] overflow-hidden flex flex-col bg-[#FFFDF9] shadow-2xl rounded-none sm:rounded-3xl border-0 sm:border-4 border-[#8B4513] relative">
        
        {/* Render Start Screen */}
        {screen === 'start' && (
          <StartScreen
            currentUser={currentUser}
            selectedCharacter={selectedCharacter}
            selectedTheme={selectedTheme}
            selectedPoopStyle={selectedPoopStyle}
            difficulty={difficulty}
            highScore={currentHighScore}
            volume={volume}
            isMuted={isMuted}
            gameLogo={gameLogo}
            onUpdateGameLogo={setGameLogo}
            onStartGame={handleStartGame}
            onOpenSettings={() => setShowSettingsModal(true)}
            onOpenStages={() => setShowStageModal(true)}
            onOpenCharacters={() => setShowCharModal(true)}
            onOpenThemes={() => setShowThemeModal(true)}
            onOpenAccount={() => setShowAccountModal(true)}
            onChangeVolume={handleChangeVolume}
            onToggleSound={handleToggleSound}
          />
        )}

        {/* Render Active Game Canvas */}
        {screen === 'playing' && (
          <GameCanvas
            character={selectedCharacter}
            theme={selectedTheme}
            poopStyle={selectedPoopStyle}
            rank={currentRank}
            currentStage={currentUser.currentStage}
            stageRequiredTime={stageRequiredTime}
            difficulty={difficulty}
            highScore={currentHighScore}
            volume={volume}
            isMuted={isMuted}
            onChangeVolume={handleChangeVolume}
            onToggleSound={handleToggleSound}
            onGameOver={handleGameOver}
            onStageCleared={handleStageCleared}
            onExitHome={handleExitHome}
            onOpenSettings={() => setShowSettingsModal(true)}
          />
        )}

        {/* Render Game Over Modal while keeping canvas scene underneath */}
        {screen === 'gameover' && (
          <>
            <GameCanvas
              character={selectedCharacter}
              theme={selectedTheme}
              poopStyle={selectedPoopStyle}
              rank={currentRank}
              currentStage={currentUser.currentStage}
              stageRequiredTime={stageRequiredTime}
              difficulty={difficulty}
              highScore={currentHighScore}
              volume={volume}
              isMuted={isMuted}
              onChangeVolume={handleChangeVolume}
              onToggleSound={handleToggleSound}
              onGameOver={() => {}}
              onStageCleared={() => {}}
              onExitHome={handleExitHome}
              onOpenSettings={() => setShowSettingsModal(true)}
            />
            <GameOverModal
              score={gameOverResult.score}
              survivalSeconds={gameOverResult.survivalSeconds}
              poopsDodged={gameOverResult.poopsDodged}
              highScore={gameOverResult.highScore}
              currentStage={gameOverResult.currentStage}
              isNewRecord={gameOverResult.isNewRecord}
              rankDown={gameOverResult.rankDown}
              consecutiveLosses={gameOverResult.consecutiveLosses}
              oldRank={gameOverResult.oldRank}
              newRank={gameOverResult.newRank}
              expEarned={gameOverResult.expEarned}
              character={selectedCharacter}
              poopStyle={selectedPoopStyle}
              onRestart={handleRestart}
              onHome={handleExitHome}
            />
          </>
        )}

        {/* Render Stage Clear Modal when user clears the stage */}
        {screen === 'stageclear' && (
          <>
            <GameCanvas
              character={selectedCharacter}
              theme={selectedTheme}
              poopStyle={selectedPoopStyle}
              rank={currentRank}
              currentStage={stageClearResult.stagePassed}
              stageRequiredTime={stageRequiredTime}
              difficulty={difficulty}
              highScore={currentHighScore}
              volume={volume}
              isMuted={isMuted}
              onChangeVolume={handleChangeVolume}
              onToggleSound={handleToggleSound}
              onGameOver={() => {}}
              onStageCleared={() => {}}
              onExitHome={handleExitHome}
              onOpenSettings={() => setShowSettingsModal(true)}
            />
            <StageClearModal
              stagePassed={stageClearResult.stagePassed}
              nextStage={stageClearResult.nextStage}
              score={stageClearResult.score}
              survivalSeconds={stageClearResult.survivalSeconds}
              poopsDodged={stageClearResult.poopsDodged}
              rankUp={stageClearResult.rankUp}
              oldRank={stageClearResult.oldRank}
              newRank={stageClearResult.newRank}
              newThemeUnlocked={stageClearResult.newThemeUnlocked}
              newCharUnlocked={stageClearResult.newCharUnlocked}
              newPoopUnlocked={stageClearResult.newPoopUnlocked}
              expEarned={stageClearResult.expEarned}
              onNextStage={handleNextStage}
              onHome={handleExitHome}
            />
          </>
        )}

        {/* UNIFIED SETTINGS MODAL */}
        {showSettingsModal && (
          <SettingsModal
            currentUser={currentUser}
            difficulty={difficulty}
            selectedCharacter={selectedCharacter}
            selectedTheme={selectedTheme}
            selectedPoopStyle={selectedPoopStyle}
            volume={volume}
            isMuted={isMuted}
            gameLogo={gameLogo}
            onUpdateGameLogo={setGameLogo}
            isInGame={screen === 'playing'}
            onSetDifficulty={setDifficulty}
            onSelectCharacter={handleSelectCharacter}
            onSelectTheme={handleSelectTheme}
            onSelectPoopStyle={handleSelectPoopStyle}
            onChangeVolume={handleChangeVolume}
            onToggleSound={handleToggleSound}
            onExitHome={handleExitHome}
            onOpenAccount={() => setShowAccountModal(true)}
            onClose={() => setShowSettingsModal(false)}
          />
        )}

        {/* 50 Stages Modal */}
        {showStageModal && (
          <StageModal
            currentStage={currentUser.currentStage}
            maxStageUnlocked={currentUser.maxStageUnlocked}
            onSelectStage={handleSelectStage}
            onClose={() => setShowStageModal(false)}
          />
        )}

        {/* 50 Characters Selection Modal */}
        {showCharModal && (
          <CharacterModal
            currentLevel={currentUser.level}
            unlockedCharacterIds={currentUser.unlockedCharacters}
            selectedCharacterId={currentUser.selectedCharacterId}
            onSelectCharacter={handleSelectCharacter}
            onClose={() => setShowCharModal(false)}
          />
        )}

        {/* 50 Game Themes Selection Modal */}
        {showThemeModal && (
          <ThemeModal
            currentLevel={currentUser.level}
            unlockedThemeIds={currentUser.unlockedThemes}
            selectedThemeId={currentUser.selectedThemeId}
            onSelectTheme={handleSelectTheme}
            onClose={() => setShowThemeModal(false)}
          />
        )}

        {/* Player Account, Gmail Login & 30 Avatars Modal */}
        {showAccountModal && (
          <AccountModal
            currentUser={currentUser}
            onUserUpdated={handleUserUpdated}
            onClose={() => setShowAccountModal(false)}
          />
        )}
      </div>
    </div>
  );
}
