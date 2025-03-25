import { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertHabitSchema, insertHabitLogSchema, insertExpenseSchema, insertBudgetSchema } from "@shared/schema";
import { detectLanguage, generateChatResponse } from './services/chatbot';
import { generateHabitInsights, generateFinanceInsights } from './services/insights';
import { generateActivityData } from './services/activity';

export async function registerRoutes(app: Express) {
  // Habits
  app.get("/api/habits", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    try {
      const habits = await storage.getHabits(req.user.id);
      res.json(habits);
    } catch (error) {
      console.error('Error fetching habits:', error);
      res.status(500).json({ message: "Failed to fetch habits" });
    }
  });

  app.post("/api/habits", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    try {
      const result = insertHabitSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid habit data", errors: result.error.errors });
      }
      const habit = await storage.createHabit({ ...result.data, userId: req.user.id });
      res.json(habit);
    } catch (error) {
      console.error('Error creating habit:', error);
      res.status(500).json({ message: "Failed to create habit" });
    }
  });

  app.post("/api/habits/:id/archive", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    try {
      await storage.archiveHabit(Number(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error('Error archiving habit:', error);
      res.status(500).json({ message: "Failed to archive habit" });
    }
  });

  // Habit Logs
  app.get("/api/habits/:id/logs", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    try {
      const logs = await storage.getHabitLogs(Number(req.params.id));
      res.json(logs);
    } catch (error) {
      console.error('Error fetching habit logs:', error);
      res.status(500).json({ message: "Failed to fetch habit logs" });
    }
  });

  app.post("/api/habits/:id/logs", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    try {
      const result = insertHabitLogSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid log data", errors: result.error.errors });
      }
      const log = await storage.createHabitLog(result.data);
      res.json(log);
    } catch (error) {
      console.error('Error creating habit log:', error);
      res.status(500).json({ message: "Failed to create habit log" });
    }
  });

  // Expenses
  app.get("/api/expenses", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    try {
      const expenses = await storage.getExpenses(req.user.id);
      res.json(expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    try {
      const result = insertExpenseSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid expense data", errors: result.error.errors });
      }
      const expense = await storage.createExpense({ ...result.data, userId: req.user.id });
      res.json(expense);
    } catch (error) {
      console.error('Error creating expense:', error);
      res.status(500).json({ message: "Failed to create expense" });
    }
  });

  // Budgets
  app.get("/api/budgets", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    try {
      const budgets = await storage.getBudgets(req.user.id);
      res.json(budgets);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      res.status(500).json({ message: "Failed to fetch budgets" });
    }
  });

  app.post("/api/budgets", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    try {
      const result = insertBudgetSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid budget data", errors: result.error.errors });
      }
      const budget = await storage.createBudget({ ...result.data, userId: req.user.id });
      res.json(budget);
    } catch (error) {
      console.error('Error creating budget:', error);
      res.status(500).json({ message: "Failed to create budget" });
    }
  });

  // Chat routes
  app.get("/api/chat/messages", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    try {
      const messages = await storage.getChatMessages(req.user.id);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat/messages", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { content } = req.body;

    try {
      const language = await detectLanguage(content);

      const userMessage = await storage.createChatMessage({
        userId: req.user.id,
        role: 'user',
        content,
        language,
        timestamp: new Date().toISOString()
      });

      const messages = await storage.getChatMessages(req.user.id);
      const response = await generateChatResponse(messages, language);

      const assistantMessage = await storage.createChatMessage({
        userId: req.user.id,
        role: 'assistant',
        content: response,
        language,
        timestamp: new Date().toISOString()
      });

      res.json([userMessage, assistantMessage]);
    } catch (error) {
      console.error('Error in chat processing:', error);
      res.status(500).json({
        message: "Could not process chat message",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Insights routes
  app.get("/api/insights/habits", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    try {
      const habits = await storage.getHabits(req.user.id);
      const insights = await generateHabitInsights(habits);
      res.json(insights);
    } catch (error) {
      console.error('Error generating habit insights:', error);
      res.status(500).json({
        message: "Could not generate habit insights",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/insights/finances", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    try {
      const expenses = await storage.getExpenses(req.user.id);
      const insights = await generateFinanceInsights(expenses);
      res.json(insights);
    } catch (error) {
      console.error('Error generating finance insights:', error);
      res.status(500).json({
        message: "Could not generate finance insights",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Activity Charts Data
  app.get("/api/user/activity", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    try {
      const habits = await storage.getHabits(req.user.id);
      const habitLogs = [];
      
      // Get logs for each habit
      for (const habit of habits) {
        const logs = await storage.getHabitLogs(habit.id);
        habitLogs.push(...logs);
      }
      
      const expenses = await storage.getExpenses(req.user.id);
      const activityData = generateActivityData(habits, habitLogs, expenses);
      
      res.json(activityData);
    } catch (error) {
      console.error('Error generating activity data:', error);
      res.status(500).json({
        message: "Could not generate activity data",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Daily Reward & Streak Endpoint
  app.post("/api/user/claim-daily-reward", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    try {
      // Get current user streak
      const currentStreak = req.user.streak || 0;
      
      // Update user streak
      await storage.updateUserStreak(req.user.id, currentStreak + 1);
      
      // Create a notification for the streak
      const streakMilestones = [1, 3, 7, 30, 90, 180, 365];
      const newStreak = currentStreak + 1;
      
      if (streakMilestones.includes(newStreak)) {
        await storage.createNotification({
          userId: req.user.id,
          type: 'streak',
          title: `${newStreak} Day Streak!`,
          message: `Congratulations! You've maintained your streak for ${newStreak} days. Keep up the great work!`,
          createdAt: new Date().toISOString()
        });
      }
      
      // Return updated user info
      const updatedUser = await storage.getUser(req.user.id);
      res.json(updatedUser);
    } catch (error) {
      console.error('Error claiming daily reward:', error);
      res.status(500).json({ 
        message: "Failed to claim daily reward",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Notifications Endpoint
  app.get("/api/notifications", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    try {
      const notifications = await storage.getNotifications(req.user.id);
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ 
        message: "Failed to fetch notifications",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  app.post("/api/notifications/:id/read", async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    try {
      await storage.markNotificationRead(Number(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ 
        message: "Failed to mark notification as read",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}