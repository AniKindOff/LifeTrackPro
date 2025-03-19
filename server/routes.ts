import { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertHabitSchema, insertHabitLogSchema, insertExpenseSchema, insertBudgetSchema } from "@shared/schema";
import { detectLanguage, generateChatResponse } from './services/chatbot';

export async function registerRoutes(app: Express) {
  // Habits
  app.get("/api/habits", async (_req, res) => {
    const habits = await storage.getHabits();
    res.json(habits);
  });

  app.post("/api/habits", async (req, res) => {
    const result = insertHabitSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid habit data" });
      return;
    }
    const habit = await storage.createHabit(result.data);
    res.json(habit);
  });

  app.post("/api/habits/:id/archive", async (req, res) => {
    await storage.archiveHabit(Number(req.params.id));
    res.json({ success: true });
  });

  // Habit Logs
  app.get("/api/habits/:id/logs", async (req, res) => {
    const logs = await storage.getHabitLogs(Number(req.params.id));
    res.json(logs);
  });

  app.post("/api/habits/:id/logs", async (req, res) => {
    const result = insertHabitLogSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid log data" });
      return;
    }
    const log = await storage.createHabitLog(result.data);
    res.json(log);
  });

  // Expenses
  app.get("/api/expenses", async (_req, res) => {
    const expenses = await storage.getExpenses();
    res.json(expenses);
  });

  app.post("/api/expenses", async (req, res) => {
    const result = insertExpenseSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid expense data" });
      return;
    }
    const expense = await storage.createExpense(result.data);
    res.json(expense);
  });

  // Budgets
  app.get("/api/budgets", async (_req, res) => {
    const budgets = await storage.getBudgets();
    res.json(budgets);
  });

  app.post("/api/budgets", async (req, res) => {
    const result = insertBudgetSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: "Invalid budget data" });
      return;
    }
    const budget = await storage.createBudget(result.data);
    res.json(budget);
  });

  // Chat routes
  app.get("/api/chat/messages", async (_req, res) => {
    const messages = await storage.getChatMessages();
    res.json(messages);
  });

  app.post("/api/chat/messages", async (req, res) => {
    const { content } = req.body;

    // Detect language
    const language = await detectLanguage(content);

    // Save user message
    const userMessage = await storage.createChatMessage({
      role: 'user',
      content,
      language,
      timestamp: new Date().toISOString()
    });

    // Generate response
    const messages = await storage.getChatMessages();
    const response = await generateChatResponse(messages, language);

    // Save assistant response
    const assistantMessage = await storage.createChatMessage({
      role: 'assistant',
      content: response,
      language,
      timestamp: new Date().toISOString()
    });

    res.json([userMessage, assistantMessage]);
  });

  const httpServer = createServer(app);
  return httpServer;
}