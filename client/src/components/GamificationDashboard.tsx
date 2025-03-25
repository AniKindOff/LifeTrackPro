import React from 'react';
import { UserProgress, Challenge, Achievement, MiniGame } from '../types/gamification';

interface GamificationDashboardProps {
  userProgress: UserProgress;
  activeChallenges: Challenge[];
  achievements: Achievement[];
  availableGames: MiniGame[];
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({
  userProgress,
  activeChallenges,
  achievements,
  availableGames,
}) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Progress Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Level {userProgress.level}</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${(userProgress.currentXP / userProgress.xpToNextLevel) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-sm mt-2">
              {userProgress.currentXP} / {userProgress.xpToNextLevel} XP
            </p>
          </div>
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">LifeCoins</h3>
            <p className="text-2xl font-bold">{userProgress.lifeCoins}</p>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Streak</h3>
            <p className="text-2xl font-bold">{userProgress.streak} days</p>
          </div>
        </div>
      </div>

      {/* Active Challenges */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Active Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeChallenges.map((challenge) => (
            <div key={challenge.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">{challenge.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{challenge.description}</p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(challenge.progress.get('current') || 0) / challenge.duration * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm mt-1">
                  {challenge.progress.get('current') || 0} / {challenge.duration} days
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.slice(0, 4).map((achievement) => (
            <div key={achievement.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
              <div className={`text-3xl mb-2 ${getTierColor(achievement.tier)}`}>
                {achievement.icon}
              </div>
              <h3 className="font-semibold">{achievement.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.tier}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Available Games */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Mini Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableGames.map((game) => (
            <div key={game.name} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">{game.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{game.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm font-semibold capitalize">{game.difficulty}</span>
                {game.isPremium && (
                  <span className="text-yellow-500 text-sm">Premium</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getTierColor = (tier: string): string => {
  switch (tier) {
    case 'bronze':
      return 'text-amber-600';
    case 'silver':
      return 'text-gray-400';
    case 'gold':
      return 'text-yellow-500';
    case 'platinum':
      return 'text-cyan-400';
    default:
      return 'text-gray-600';
  }
};

export default GamificationDashboard; 