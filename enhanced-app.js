// LifeTrackPro Enhancement Script
// This script adds sound effects, dark mode, rewards, and a mini-game

// Sound effects
const sounds = {
  click: new Audio('data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGl0dGxlUm9ib3Rzb3VuZFN0dWRpbwBURU5DAAAAHQAAA0xhdmY1Ni40MC4xMDEAAAAAAAAAAAAAAP/7kMQAAAAAAAAAAAAAAAAAAAAAAFhpbmcAAAAPAAAABQAABkAAgICAgICAgICAgICAgICAgIDAwMDAwMDAwMDAwMDAwMDA4ODg4ODg4ODg4ODg4ODg4OD///////////////////////////////////////////8AAAA5TEFNRTMuMTAwAZYAAAAAAAAAABQgJAawTQABmgAABkBBZXoKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7sMQAAASwP19U8AABrKBqOz04ACHZVzeYiQAEZh3vznjAAAAIzEgBJlEMmekAYBgWfCDAEHCF3efwEx4cOeCckDi8OVCYjLNEzNJxBDEjwIEIfRIQlx+CEc2R3uo0tNy31la/SP5xc2ARJ5V7iIScYGXmMQYIAV4ePcgEnQggYMln8E2/vCU7jDw/9Xv+r9P///+r/+9b66jlFSKe6iOqA1EF7ACERZUQogOUjBCBrirJHAayRJFUhcViUAB0DQZl2GII2Siw5/R/5/qmIzAkMgkBAyg4DKFh4ICaBIGxkEuV8KRxACXh4dDxkyu9Zs6qzoeoDoGEIVhhChhHQs5ULhbyjv4oI5nKhbSgXzigWko9u8LfE+lMdFYrUCIKecCPptWZf2qjqZb6s/7/9Xv4Pv///+////////+bsgEQAAAAAA3LlICAoMAYMAQOB4PDwXD4qKipOJxUVFTicarVar0qlWq1QH9arlara/9X71iYQAIoB1Wo3q1G9XUdR1G9ra2tra'),
  reward: new Audio('data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGl0dGxlUm9ib3RzVFNFAAAAFAAAAGVmZmVjdHMgc3RlcHBlZF9fX1RFTkMAAAAhAAADTGF2ZjU2LjI1LjEwMQAAAAAAAAAAAAAAA//7kMQAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAASAAAJbQAQEBAQEBoaGhoaGiQkJCQkJDQ0NDQ0NENDQ0NDQ1NTU1NTU2JiYmJiYnJycnJycn9/f39/f4+Pj4+Pj5+fn5+fn6+vr6+vr7+/v7+/v8/Pz8/Pz9/f39/f3+/v7+/v7//////AAAAHkxBTUUzLjEwMAGQAAAAAC4DAARMJAAE8QAACStiYwjtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAANIAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'),
  complete: new Audio('data:audio/mp3;base64,SUQzBAAAAAACJlRJVDIAAAAfAAADSSBMb3ZlIFlvdQAvL01QRUdPZmZpY2lhbEAgMTI4VENPTgAAABEAAAMyMDIyCFRPUEUAAAAOAAADTWFsaWF0bGluCFRZRVIAAAAOAAADMjAyMghUTEVOAAAADwAAA0VuZ2xpc2gAVFhYWAAAAC0AAANUZXN0aW5nIHVzZSBvbmx5OiBCYWRVc2VyQEJhZC5jb21URU5DAAAAHQAAAwIIBQMHEBUPFBERAwAAAAAAAAAAAAA='),
  game: new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAeAAAY/AAkJCQkJCQkJCQkODg4ODg4ODg4OEhISEhISEhISFhYWFhYWFhYWGhoaGhoaGhoaHh4eHh4eHh4eIiIiIiIiIiIiJiYmJiYmJiYmKioqKioqKioqLi4uLi4uLi4uMjIyMjIyMjIyNjY2NjY2NjY2Ojo6Ojo6Ojo6Pj4+Pj4+Pj4+P////8AAAA5TEFNRTMuMTAwAZYAAAAAAAAAABQgJAWyQQABmgAAGPzWaXu2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//vAxAAAB9xBU/2IgAC/iak7sQgAF/4XAICAAYHidCYkCiAgKS8QELlzGb+ZMV1YXz08R0G2BRMbS4K4vl9//5v6XxcFwXCwWC4dDOb/+aMdAIBAICETF8XxcL4uC4JA4OjGdGMoK4uC4XxcEgcDhyJ8okCiJgoCATCYUE0TRM00TTCQTBQFAWDaYhAgIBAIBJLUEwTBMFAUE0TM00TgxMQ9XTl3d3d4YONMGhMExQFC6JpommEgmEgKAgEwgxMJgoJ84oaS//cQ8MWYMCYKCaTBMFBNE0wkBxIBw0FzDRBnkHMEGcExINBRMExQHYaEMY8zs3//5A6GG/KM0Hgw0ZIwZAhhiHG7gZ4BhoEGHZBs1///3kQ4YcmBhQJhgCTDMBMHhQNJzTBVFzEY0TJbmfN/9U5IwsYQw0E4w1IAwwCJhOEBhKHhkCLJlcjf3///m1P0MBiEMGRQMRQ6MMQwMAQUMAgXHH/MLKTlf1NWXtXSgAhBAEzBSRsoE+MByWMLRKTDRoMYWVS0qv///+7mBgSGJoSBgYMhgyABgcChgiCBhMEhiCEhoqFpi3/qZJn9C6RnQbMLRcMBwWCgoAghBl1cT+ELwwLF8xHHUutZJP////7FMwPCEwRCwMCxJMAwVMA1uGGswmRJr4X///+o4Iy2mWJMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'),
  toggle: new Audio('data:audio/mp3;base64,SUQzBAAAAAAABlRJVDIAAAAZAAADRGFyayBtb2RlIHRvZ2dsZVRTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAALAAAJdQAHCAkKCwwMDQ8QEhITFRUVKikpRURERmhoaGuOjY2Psbm5ur29vb/JycnL2dra3Nzc3eb6+vr9/f3///8AAAA5TEFNRTMuMTAwA34AAAAAAAAAABQgJAL0QQABzAAAJA8EPi0FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAANIAAAAEVEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV')
};

// Play sound function
function playSound(soundName) {
  sounds[soundName].currentTime = 0;
  sounds[soundName].play().catch(e => console.log('Sound play error:', e));
}

// Dark mode variables
let isDarkMode = false;
let rewardPoints = 0;

// Add dark mode CSS
const darkModeCSS = `
  .dark-mode {
    --primary: #60a5fa;
    --secondary: #3b82f6;
    --accent: #8b5cf6;
    --background: #0f172a;
    --foreground: #f8fafc;
    --muted: #94a3b8;
    --card: #1e293b;
    --border: #334155;
  }
  
  .dark-mode .sidebar {
    background: linear-gradient(180deg, #1e40af 0%, #3b82f6 100%);
  }
  
  .dark-mode .task-checkbox {
    border-color: #475569;
  }
  
  /* Rewards panel */
  .rewards-panel {
    position: fixed;
    top: 70px;
    right: -350px;
    width: 320px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease;
    z-index: 100;
    overflow: hidden;
  }
  
  .dark-mode .rewards-panel {
    background: #1e293b;
  }
  
  .rewards-panel.open {
    right: 20px;
  }
  
  .rewards-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid var(--border);
  }
  
  .rewards-content {
    padding: 16px;
  }
  
  .reward-item {
    margin-bottom: 12px;
    padding: 12px;
    border-radius: 6px;
    border: 1px solid var(--border);
    transition: all 0.2s;
  }
  
  .reward-item.unlocked {
    background-color: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.3);
  }
  
  .reward-title {
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .reward-status {
    font-size: 12px;
    color: var(--muted);
  }
  
  .reward-item.unlocked .reward-status {
    color: #10b981;
  }
  
  /* Game container */
  .game-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .game-window {
    width: 80%;
    max-width: 600px;
    height: 500px;
    background-color: var(--background);
    border-radius: 12px;
    position: relative;
    overflow: hidden;
  }
  
  .game-header {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    background-color: var(--primary);
    color: white;
  }
  
  .game-content {
    height: calc(100% - 120px);
    position: relative;
  }
  
  .game-item {
    position: absolute;
    width: 40px;
    height: 40px;
    background-color: var(--accent);
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.1s;
  }
  
  .game-item:hover {
    transform: scale(1.1);
  }
  
  .game-item.collected {
    transform: scale(0);
    opacity: 0;
  }
  
  .game-footer {
    padding: 16px;
    text-align: center;
  }
  
  /* Notification */
  .reward-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: var(--primary);
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    transform: translateY(-100px);
    opacity: 0;
    transition: all 0.3s;
    z-index: 1000;
  }
  
  .reward-notification.show {
    transform: translateY(0);
    opacity: 1;
  }
  
  /* Task completion effects */
  .task-complete-effect {
    animation: pulse 0.4s ease;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  /* Confetti */
  .confetti {
    position: fixed;
    width: 10px;
    height: 10px;
    background-color: #f00;
    border-radius: 2px;
    animation: fall 3s linear forwards;
    z-index: 1000;
    pointer-events: none;
  }
  
  @keyframes fall {
    0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(calc(100vh + 100px)) rotate(360deg); opacity: 0; }
  }
  
  /* Theme toggle button */
  .theme-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: var(--primary);
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 90;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  /* Rewards button */
  .rewards-toggle {
    position: fixed;
    bottom: 20px;
    right: 85px;
    background-color: var(--accent);
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 90;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

// Function to inject CSS
function injectCSS(css) {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}

// Function to initialize dark mode
function initDarkMode() {
  // Add theme toggle button
  const themeToggle = document.createElement('div');
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = '<span id="theme-toggle-icon">🌙</span>';
  themeToggle.title = 'Toggle dark mode';
  themeToggle.onclick = toggleDarkMode;
  document.body.appendChild(themeToggle);
}

// Function to toggle dark mode
function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  playSound('toggle');
  
  if (isDarkMode) {
    document.documentElement.classList.add('dark-mode');
    document.getElementById('theme-toggle-icon').textContent = '☀️';
  } else {
    document.documentElement.classList.remove('dark-mode');
    document.getElementById('theme-toggle-icon').textContent = '🌙';
  }
}

// Function to initialize rewards system
function initRewards() {
  // Create rewards toggle
  const rewardsToggle = document.createElement('div');
  rewardsToggle.className = 'rewards-toggle';
  rewardsToggle.innerHTML = '🏆';
  rewardsToggle.title = 'View rewards';
  rewardsToggle.onclick = toggleRewardsPanel;
  document.body.appendChild(rewardsToggle);
  
  // Create rewards panel
  const rewardsPanel = document.createElement('div');
  rewardsPanel.className = 'rewards-panel';
  rewardsPanel.innerHTML = `
    <div class="rewards-header">
      <h3>Rewards</h3>
      <div>Points: <span id="reward-points">0</span></div>
    </div>
    <div class="rewards-content">
      <div id="reward-1" class="reward-item">
        <div class="reward-title">Custom Theme</div>
        <div class="reward-status">50 points away</div>
      </div>
      <div id="reward-2" class="reward-item">
        <div class="reward-title">Productivity Game</div>
        <div class="reward-status">100 points away</div>
      </div>
      <div id="reward-3" class="reward-item">
        <div class="reward-title">Advanced Analytics</div>
        <div class="reward-status">200 points away</div>
      </div>
    </div>
  `;
  document.body.appendChild(rewardsPanel);
  
  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'reward-notification';
  notification.className = 'reward-notification';
  document.body.appendChild(notification);
}

// Function to toggle rewards panel
function toggleRewardsPanel() {
  const panel = document.querySelector('.rewards-panel');
  panel.classList.toggle('open');
  playSound('click');
}

// Function to award points
function awardPoints(amount) {
  rewardPoints += amount;
  document.getElementById('reward-points').innerText = rewardPoints;
  playSound('reward');
  
  // Show notification
  const notification = document.getElementById('reward-notification');
  notification.innerHTML = `<div>+${amount} points!</div>`;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
  
  // Update unlockable rewards
  updateRewards();
}

// Function to update rewards based on points
function updateRewards() {
  const rewards = [
    { id: 'reward-1', points: 50, name: 'Custom Theme' },
    { id: 'reward-2', points: 100, name: 'Productivity Game' },
    { id: 'reward-3', points: 200, name: 'Advanced Analytics' }
  ];
  
  rewards.forEach(reward => {
    const element = document.getElementById(reward.id);
    if (rewardPoints >= reward.points) {
      element.classList.add('unlocked');
      element.querySelector('.reward-status').innerText = 'UNLOCKED';
      element.onclick = () => {
        if (reward.id === 'reward-2') {
          launchGame();
        } else {
          alert(`${reward.name} activated!`);
        }
      };
    } else {
      element.classList.remove('unlocked');
      element.querySelector('.reward-status').innerText = `${reward.points - rewardPoints} points away`;
    }
  });
}

// Initialize game elements
function initGame() {
  // Create game container
  const gameContainer = document.createElement('div');
  gameContainer.id = 'game-container';
  gameContainer.className = 'game-container';
  
  gameContainer.innerHTML = `
    <div class="game-window">
      <div class="game-header">
        <h3>Productivity Game</h3>
        <div>Score: <span id="game-score">0</span></div>
      </div>
      <div class="game-content" id="game-items"></div>
      <div class="game-footer">
        <button class="btn btn-primary" id="game-exit">Exit Game</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(gameContainer);
  
  // Set up exit button
  document.getElementById('game-exit').addEventListener('click', exitGame);
}

// Game state
const gameState = {
  isActive: false,
  score: 0
};

// Launch game function
function launchGame() {
  if (rewardPoints < 100) {
    alert('You need 100 points to unlock this game!');
    return;
  }
  
  playSound('game');
  
  // Show game container
  const gameContainer = document.getElementById('game-container');
  gameContainer.style.display = 'flex';
  
  // Initialize the game
  gameState.isActive = true;
  gameState.score = 0;
  updateGameScore();
  
  // Set up game items
  setupGameItems();
}

// Function to set up game items
function setupGameItems() {
  const gameItems = document.getElementById('game-items');
  gameItems.innerHTML = '';
  
  for (let i = 0; i < 5; i++) {
    const item = document.createElement('div');
    item.className = 'game-item';
    item.style.left = `${Math.random() * 80 + 10}%`;
    item.style.top = `${Math.random() * 60 + 20}%`;
    
    item.addEventListener('click', function() {
      if (gameState.isActive) {
        gameState.score += 10;
        updateGameScore();
        playSound('click');
        this.classList.add('collected');
        
        // Remove after animation
        setTimeout(() => {
          this.remove();
          
          // Check if all items are collected
          if (document.getElementsByClassName('game-item').length === 0) {
            setupGameItems();
          }
        }, 500);
      }
    });
    
    gameItems.appendChild(item);
  }
}

// Update game score
function updateGameScore() {
  document.getElementById('game-score').innerText = gameState.score;
}

// Exit game function
function exitGame() {
  gameState.isActive = false;
  document.getElementById('game-container').style.display = 'none';
  
  // Award points based on score
  if (gameState.score > 0) {
    awardPoints(Math.floor(gameState.score / 10));
  }
  
  playSound('toggle');
}

// Create confetti effect
function createConfetti() {
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = `${Math.random() * 2}s`;
    
    document.body.appendChild(confetti);
    
    // Remove after animation
    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }
}

// Enhance existing tasks with sound effects
function enhanceTasks() {
  document.querySelectorAll('.task:not(.completed)').forEach(task => {
    task.addEventListener('click', function() {
      if (!this.classList.contains('completed')) {
        playSound('complete');
        awardPoints(10);
        this.classList.add('task-complete-effect');
      }
    });
  });
  
  // Enhance streak button
  document.querySelector('.stat-card button').addEventListener('click', function() {
    createConfetti();
    playSound('reward');
    awardPoints(25);
  });
  
  // Add click sounds to buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => playSound('click'));
  });
  
  // Add click sounds to navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => playSound('click'));
  });
}

// Main initialization function
function initEnhancements() {
  // Inject CSS
  injectCSS(darkModeCSS);
  
  // Initialize features
  initDarkMode();
  initRewards();
  initGame();
  enhanceTasks();
  
  console.log('LifeTrackPro enhancements initialized!');
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initEnhancements); 