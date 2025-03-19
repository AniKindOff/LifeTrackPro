import { pgTable, text, serial, integer, decimal, date, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  theme: text("theme").default("system"),
  streak: integer("streak").default(0),
  lastLogin: text("last_login").notNull(),
  createdAt: text("created_at").notNull(),
});

// Habit tracking
export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  frequency: text("frequency").notNull(), // daily, weekly, monthly
  target: integer("target").notNull(),
  streak: integer("streak").default(0),
  isArchived: boolean("is_archived").default(false),
});

export const habitLogs = pgTable("habit_logs", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id").notNull(),
  date: date("date").notNull(),
  value: integer("value").notNull(),
});

// Finance tracking
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  description: text("description").notNull(),
  amount: decimal("amount").notNull(),
  category: text("category").notNull(),
  date: date("date").notNull(),
});

export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  category: text("category").notNull(),
  amount: decimal("amount").notNull(),
  period: text("period").notNull(), // monthly, yearly
});

// Chat related schemas
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  timestamp: text("timestamp").notNull(), // Store as ISO string
  language: text("language").notNull().default('en'),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // 'habit', 'expense', 'system'
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: text("created_at").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  avatar: true, 
  streak: true,
  theme: true
});
export const insertHabitSchema = createInsertSchema(habits).omit({ id: true, isArchived: true, streak: true });
export const insertHabitLogSchema = createInsertSchema(habitLogs).omit({ id: true });
export const insertExpenseSchema = createInsertSchema(expenses).omit({ id: true });
export const insertBudgetSchema = createInsertSchema(budgets).omit({ id: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, isRead: true });

// Types
export type User = typeof users.$inferSelect;
export type Habit = typeof habits.$inferSelect;
export type HabitLog = typeof habitLogs.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type Budget = typeof budgets.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type InsertHabitLog = z.infer<typeof insertHabitLogSchema>;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;