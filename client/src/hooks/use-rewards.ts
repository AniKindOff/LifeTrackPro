import { useState, useEffect } from "react";
import { useAuth } from "./use-auth";

const DAILY_REWARD = 10;
const WITHDRAWAL_THRESHOLD = 500;
const STORAGE_KEY = "rewards_data";

interface RewardsData {
  balance: number;
  lastLoginDate: string;
  totalEarned: number;
  totalWithdrawn: number;
}

export function useRewards() {
  const { user } = useAuth();
  const [rewardsData, setRewardsData] = useState<RewardsData>({
    balance: 0,
    lastLoginDate: "",
    totalEarned: 0,
    totalWithdrawn: 0,
  });
  const [showRewardPopup, setShowRewardPopup] = useState(false);

  useEffect(() => {
    if (user) {
      loadRewardsData();
      checkAndAwardDailyReward();
    }
  }, [user]);

  const loadRewardsData = () => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      setRewardsData(JSON.parse(storedData));
    }
  };

  const saveRewardsData = (data: RewardsData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setRewardsData(data);
  };

  const checkAndAwardDailyReward = () => {
    const today = new Date().toDateString();
    if (rewardsData.lastLoginDate !== today) {
      const newBalance = rewardsData.balance + DAILY_REWARD;
      const newData = {
        ...rewardsData,
        balance: newBalance,
        lastLoginDate: today,
        totalEarned: rewardsData.totalEarned + DAILY_REWARD,
      };
      saveRewardsData(newData);
      setShowRewardPopup(true);
    }
  };

  const withdrawBalance = () => {
    if (rewardsData.balance >= WITHDRAWAL_THRESHOLD) {
      const newData = {
        ...rewardsData,
        balance: 0,
        totalWithdrawn: rewardsData.totalWithdrawn + rewardsData.balance,
      };
      saveRewardsData(newData);
      setShowRewardPopup(false);
      // Here you would typically make an API call to process the withdrawal
      alert("Withdrawal request submitted successfully!");
    }
  };

  return {
    balance: rewardsData.balance,
    dailyReward: DAILY_REWARD,
    withdrawalThreshold: WITHDRAWAL_THRESHOLD,
    showRewardPopup,
    setShowRewardPopup,
    withdrawBalance,
    totalEarned: rewardsData.totalEarned,
    totalWithdrawn: rewardsData.totalWithdrawn,
  };
} 