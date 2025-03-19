import {
  type Habit, type InsertHabit,
  type HabitLog, type InsertHabitLog,
  type Expense, type InsertExpense,
  type Budget, type InsertBudget,
  type ChatMessage, type InsertChatMessage
} from "@shared/schema";

export interface IStorage {
  // Habits
  getHabits(): Promise<Habit[]>;
  getHabit(id: number): Promise<Habit | undefined>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  archiveHabit(id: number): Promise<void>;

  // Habit Logs
  getHabitLogs(habitId: number): Promise<HabitLog[]>;
  createHabitLog(log: InsertHabitLog): Promise<HabitLog>;

  // Expenses
  getExpenses(): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;

  // Budgets
  getBudgets(): Promise<Budget[]>;
  createBudget(budget: InsertBudget): Promise<Budget>;

  // Chat Messages
  getChatMessages(): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private habits: Map<number, Habit>;
  private habitLogs: Map<number, HabitLog>;
  private expenses: Map<number, Expense>;
  private budgets: Map<number, Budget>;
  private chatMessages: Map<number, ChatMessage>;
  private currentIds: { [key: string]: number };

  constructor() {
    this.habits = new Map();
    this.habitLogs = new Map();
    this.expenses = new Map();
    this.budgets = new Map();
    this.chatMessages = new Map();
    this.currentIds = {
      habits: 1,
      habitLogs: 1,
      expenses: 1,
      budgets: 1,
      chatMessages: 1
    };
  }

  // Habits
  async getHabits(): Promise<Habit[]> {
    return Array.from(this.habits.values()).filter(h => !h.isArchived);
  }

  async getHabit(id: number): Promise<Habit | undefined> {
    return this.habits.get(id);
  }

  async createHabit(habit: InsertHabit): Promise<Habit> {
    const id = this.currentIds.habits++;
    const newHabit = { ...habit, id, isArchived: false };
    this.habits.set(id, newHabit);
    return newHabit;
  }

  async archiveHabit(id: number): Promise<void> {
    const habit = this.habits.get(id);
    if (habit) {
      habit.isArchived = true;
      this.habits.set(id, habit);
    }
  }

  // Habit Logs
  async getHabitLogs(habitId: number): Promise<HabitLog[]> {
    return Array.from(this.habitLogs.values())
      .filter(log => log.habitId === habitId);
  }

  async createHabitLog(log: InsertHabitLog): Promise<HabitLog> {
    const id = this.currentIds.habitLogs++;
    const newLog = { ...log, id };
    this.habitLogs.set(id, newLog);
    return newLog;
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values());
  }

  async createExpense(expense: InsertExpense): Promise<Expense> {
    const id = this.currentIds.expenses++;
    const newExpense = { ...expense, id };
    this.expenses.set(id, newExpense);
    return newExpense;
  }

  // Budgets
  async getBudgets(): Promise<Budget[]> {
    return Array.from(this.budgets.values());
  }

  async createBudget(budget: InsertBudget): Promise<Budget> {
    const id = this.currentIds.budgets++;
    const newBudget = { ...budget, id };
    this.budgets.set(id, newBudget);
    return newBudget;
  }

  // Chat Messages
  async getChatMessages(): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentIds.chatMessages++;
    const newMessage = { ...message, id };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();