import {
  type User, type InsertUser,
  type Habit, type InsertHabit,
  type HabitLog, type InsertHabitLog,
  type Expense, type InsertExpense,
  type Budget, type InsertBudget,
  type ChatMessage, type InsertChatMessage,
  type Notification, type InsertNotification
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStreak(id: number, streak: number): Promise<void>;
  updateUserTheme(id: number, theme: string): Promise<void>;

  // Habits
  getHabits(userId: number): Promise<Habit[]>;
  getHabit(id: number): Promise<Habit | undefined>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  archiveHabit(id: number): Promise<void>;

  // Habit Logs
  getHabitLogs(habitId: number): Promise<HabitLog[]>;
  createHabitLog(log: InsertHabitLog): Promise<HabitLog>;

  // Expenses
  getExpenses(userId: number): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;

  // Budgets
  getBudgets(userId: number): Promise<Budget[]>;
  createBudget(budget: InsertBudget): Promise<Budget>;

  // Chat Messages
  getChatMessages(userId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Notifications
  getNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private habits: Map<number, Habit>;
  private habitLogs: Map<number, HabitLog>;
  private expenses: Map<number, Expense>;
  private budgets: Map<number, Budget>;
  private chatMessages: Map<number, ChatMessage>;
  private notifications: Map<number, Notification>;
  private currentIds: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.habits = new Map();
    this.habitLogs = new Map();
    this.expenses = new Map();
    this.budgets = new Map();
    this.chatMessages = new Map();
    this.notifications = new Map();
    this.currentIds = {
      users: 1,
      habits: 1,
      habitLogs: 1,
      expenses: 1,
      budgets: 1,
      chatMessages: 1,
      notifications: 1
    };
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const now = new Date().toISOString();
    const newUser = {
      ...user,
      id,
      avatar: null,
      theme: "system",
      streak: 0,
      lastLogin: now,
      createdAt: now
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUserStreak(id: number, streak: number): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.streak = streak;
      this.users.set(id, user);
    }
  }

  async updateUserTheme(id: number, theme: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.theme = theme;
      this.users.set(id, user);
    }
  }

  // Habits
  async getHabits(userId: number): Promise<Habit[]> {
    return Array.from(this.habits.values())
      .filter(h => h.userId === userId && !h.isArchived);
  }

  async getHabit(id: number): Promise<Habit | undefined> {
    return this.habits.get(id);
  }

  async createHabit(habit: InsertHabit): Promise<Habit> {
    const id = this.currentIds.habits++;
    const newHabit = {
      ...habit,
      id,
      streak: 0,
      isArchived: false,
      description: habit.description || null
    };
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
  async getExpenses(userId: number): Promise<Expense[]> {
    return Array.from(this.expenses.values())
      .filter(e => e.userId === userId);
  }

  async createExpense(expense: InsertExpense): Promise<Expense> {
    const id = this.currentIds.expenses++;
    const newExpense = { ...expense, id };
    this.expenses.set(id, newExpense);
    return newExpense;
  }

  // Budgets
  async getBudgets(userId: number): Promise<Budget[]> {
    return Array.from(this.budgets.values())
      .filter(b => b.userId === userId);
  }

  async createBudget(budget: InsertBudget): Promise<Budget> {
    const id = this.currentIds.budgets++;
    const newBudget = { ...budget, id };
    this.budgets.set(id, newBudget);
    return newBudget;
  }

  // Chat Messages
  async getChatMessages(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(m => m.userId === userId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentIds.chatMessages++;
    const newMessage = {
      ...message,
      id,
      language: message.language || 'en'
    };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }

  // Notifications
  async getNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = this.currentIds.notifications++;
    const newNotification = {
      ...notification,
      id,
      isRead: false
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  async markNotificationRead(id: number): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.isRead = true;
      this.notifications.set(id, notification);
    }
  }

  // Load dummy data from a file
  loadDummyData(data: any): void {
    console.log('Loading dummy data into storage...');
    
    // Reset storage
    this.users = new Map();
    this.habits = new Map();
    this.habitLogs = new Map();
    this.expenses = new Map();
    this.budgets = new Map();
    this.chatMessages = new Map();
    this.notifications = new Map();
    
    // Load users
    if (data.users && Array.isArray(data.users)) {
      data.users.forEach(user => {
        this.users.set(user.id, user);
        // Update currentIds
        this.currentIds.users = Math.max(this.currentIds.users, user.id + 1);
      });
      console.log(`Loaded ${data.users.length} users`);
    }
    
    // Load habits
    if (data.habits && Array.isArray(data.habits)) {
      data.habits.forEach(habit => {
        this.habits.set(habit.id, habit);
        // Update currentIds
        this.currentIds.habits = Math.max(this.currentIds.habits, habit.id + 1);
      });
      console.log(`Loaded ${data.habits.length} habits`);
    }
    
    // Load habit logs
    if (data.habitLogs && Array.isArray(data.habitLogs)) {
      data.habitLogs.forEach(log => {
        this.habitLogs.set(log.id, log);
        // Update currentIds
        this.currentIds.habitLogs = Math.max(this.currentIds.habitLogs, log.id + 1);
      });
      console.log(`Loaded ${data.habitLogs.length} habit logs`);
    }
    
    // Load expenses
    if (data.expenses && Array.isArray(data.expenses)) {
      data.expenses.forEach(expense => {
        this.expenses.set(expense.id, expense);
        // Update currentIds
        this.currentIds.expenses = Math.max(this.currentIds.expenses, expense.id + 1);
      });
      console.log(`Loaded ${data.expenses.length} expenses`);
    }
    
    // Load budgets
    if (data.budgets && Array.isArray(data.budgets)) {
      data.budgets.forEach(budget => {
        this.budgets.set(budget.id, budget);
        // Update currentIds
        this.currentIds.budgets = Math.max(this.currentIds.budgets, budget.id + 1);
      });
      console.log(`Loaded ${data.budgets.length} budgets`);
    }
    
    // Load chat messages
    if (data.chatMessages && Array.isArray(data.chatMessages)) {
      data.chatMessages.forEach(message => {
        this.chatMessages.set(message.id, message);
        // Update currentIds
        this.currentIds.chatMessages = Math.max(this.currentIds.chatMessages, message.id + 1);
      });
      console.log(`Loaded ${data.chatMessages.length} chat messages`);
    }
    
    // Load notifications
    if (data.notifications && Array.isArray(data.notifications)) {
      data.notifications.forEach(notification => {
        this.notifications.set(notification.id, notification);
        // Update currentIds
        this.currentIds.notifications = Math.max(this.currentIds.notifications, notification.id + 1);
      });
      console.log(`Loaded ${data.notifications.length} notifications`);
    }
    
    console.log('Dummy data loaded successfully');
  }
}

export const storage = new MemStorage();