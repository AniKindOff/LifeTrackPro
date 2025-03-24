/**
 * @typedef {Object} ChatMessage
 * @property {number} [id] - Optional message ID
 * @property {'user' | 'assistant' | 'system'} role - Role of the message sender
 * @property {string} content - Content of the message
 * @property {string} [timestamp] - Optional timestamp
 * @property {string} [language] - Optional language code
 */

/**
 * @typedef {Object} Task
 * @property {number} id - Task ID
 * @property {string} title - Task title
 * @property {string} description - Task description
 * @property {boolean} completed - Task completion status
 * @property {Date} dueDate - Task due date
 */

/**
 * @typedef {Object} Habit
 * @property {number} id - Habit ID
 * @property {string} name - Habit name
 * @property {string} description - Habit description
 * @property {number} currentStreak - Current streak count
 * @property {number} bestStreak - Best streak count
 * @property {string} frequency - Habit frequency (daily, weekly, etc.)
 */

module.exports = {
  // This file is for documentation purposes only
}; 