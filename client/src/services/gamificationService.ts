import { UserProgress, Challenge, Achievement, MiniGame, Reward } from '../types/gamification';

class GamificationService {
  private static instance: GamificationService;
  private userProgress: UserProgress;
  private challenges: Challenge[];
  private achievements: Achievement[];
  private games: MiniGame[];

  private constructor() {
    // Initialize with default values
    this.userProgress = {
      level: 1,
      currentXP: 0,
      xpToNextLevel: 1000,
      achievements: [],
      lifeCoins: 0,
      streak: 0,
      lastActivityDate: new Date().toISOString(),
    };

    this.challenges = [];
    this.achievements = [];
    this.games = [];
  }

  public static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService();
    }
    return GamificationService.instance;
  }

  // XP and Level Management
  public addXP(amount: number): void {
    this.userProgress.currentXP += amount;
    this.checkLevelUp();
  }

  private checkLevelUp(): void {
    const xpNeeded = this.userProgress.xpToNextLevel;
    if (this.userProgress.currentXP >= xpNeeded) {
      this.levelUp();
    }
  }

  private levelUp(): void {
    this.userProgress.level += 1;
    this.userProgress.currentXP -= this.userProgress.xpToNextLevel;
    this.userProgress.xpToNextLevel = Math.floor(this.userProgress.xpToNextLevel * 1.5);
    this.addReward({
      id: `level-${this.userProgress.level}`,
      type: 'points',
      title: `Level ${this.userProgress.level} Achievement`,
      description: `Congratulations! You've reached level ${this.userProgress.level}!`,
      requirements: [],
      unlocked: true,
      value: 100,
    });
  }

  // Streak Management
  public updateStreak(): void {
    const today = new Date().toISOString().split('T')[0];
    const lastActivity = new Date(this.userProgress.lastActivityDate).toISOString().split('T')[0];
    
    if (today === lastActivity) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastActivity === yesterdayStr) {
      this.userProgress.streak += 1;
      this.checkStreakMilestones();
    } else {
      this.userProgress.streak = 1;
    }

    this.userProgress.lastActivityDate = today;
  }

  private checkStreakMilestones(): void {
    const streakMilestones = [7, 14, 30, 60, 100, 365];
    if (streakMilestones.includes(this.userProgress.streak)) {
      this.addReward({
        id: `streak-${this.userProgress.streak}`,
        type: 'badge',
        title: `${this.userProgress.streak} Day Streak!`,
        description: `Amazing! You've maintained a ${this.userProgress.streak}-day streak!`,
        requirements: [],
        unlocked: true,
        value: this.userProgress.streak * 10,
      });
    }
  }

  // Challenge Management
  public addChallenge(challenge: Challenge): void {
    this.challenges.push(challenge);
  }

  public updateChallengeProgress(challengeId: string, progress: number): void {
    const challenge = this.challenges.find(c => c.id === challengeId);
    if (challenge) {
      challenge.progress.set('current', progress);
      this.checkChallengeCompletion(challenge);
    }
  }

  private checkChallengeCompletion(challenge: Challenge): void {
    const currentProgress = challenge.progress.get('current') || 0;
    if (currentProgress >= challenge.duration) {
      this.completeChallenge(challenge);
    }
  }

  private completeChallenge(challenge: Challenge): void {
    challenge.rewards.forEach(reward => this.addReward(reward));
    this.challenges = this.challenges.filter(c => c.id !== challenge.id);
  }

  // Achievement Management
  public addAchievement(achievement: Achievement): void {
    this.achievements.push(achievement);
  }

  public updateAchievementProgress(achievementId: string, progress: number): void {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (achievement) {
      achievement.progress = progress;
      this.checkAchievementCompletion(achievement);
    }
  }

  private checkAchievementCompletion(achievement: Achievement): void {
    if (achievement.progress >= 100) {
      this.completeAchievement(achievement);
    }
  }

  private completeAchievement(achievement: Achievement): void {
    this.addReward(achievement.reward);
    achievement.progress = 100;
  }

  // Reward Management
  private addReward(reward: Reward): void {
    if (reward.type === 'points') {
      this.userProgress.lifeCoins += reward.value || 0;
    }
    // Handle other reward types here
  }

  // Game Management
  public addGame(game: MiniGame): void {
    this.games.push(game);
  }

  public getAvailableGames(): MiniGame[] {
    return this.games;
  }

  // Getters
  public getUserProgress(): UserProgress {
    return { ...this.userProgress };
  }

  public getActiveChallenges(): Challenge[] {
    return this.challenges.filter(c => new Date(c.endDate) > new Date());
  }

  public getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  public getGames(): MiniGame[] {
    return [...this.games];
  }
}

export default GamificationService; 