import { pgTable, text, serial, integer, decimal, date, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Habit tracking
export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  frequency: text("frequency").notNull(), // daily, weekly, monthly
  target: integer("target").notNull(),
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
  description: text("description").notNull(),
  amount: decimal("amount").notNull(),
  category: text("category").notNull(),
  date: date("date").notNull(),
});

export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  amount: decimal("amount").notNull(),
  period: text("period").notNull(), // monthly, yearly
});

// Chat related schemas
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  timestamp: text("timestamp").notNull(), // Store as ISO string
  language: text("language").notNull().default('en'),
});

// Insert schemas
export const insertHabitSchema = createInsertSchema(habits).omit({ id: true, isArchived: true });
export const insertHabitLogSchema = createInsertSchema(habitLogs).omit({ id: true });
export const insertExpenseSchema = createInsertSchema(expenses).omit({ id: true });
export const insertBudgetSchema = createInsertSchema(budgets).omit({ id: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true });

// Types
export type Habit = typeof habits.$inferSelect;
export type HabitLog = typeof habitLogs.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type Budget = typeof budgets.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type InsertHabitLog = z.infer<typeof insertHabitLogSchema>;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;