// LifeTrackPro Fixed App Script
document.addEventListener('DOMContentLoaded', function() {
  // Sound effects
  const sounds = {
    click: new Audio('data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGl0dGxlUm9ib3Rzb3VuZFN0dWRpbwBURU5DAAAAHQAAA0xhdmY1Ni40MC4xMDEAAAAAAAAAAAAAAP/7kMQAAAAAAAAAAAAAAAAAAAAAAFhpbmcAAAAPAAAABQAABkAAgICAgICAgICAgICAgICAgIDAwMDAwMDAwMDAwMDAwMDA4ODg4ODg4ODg4ODg4ODg4OD///////////////////////////////////////////8AAAA5TEFNRTMuMTAwAZYAAAAAAAAAABQgJAawTQABmgAABkBBZXoKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAANIAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ=='),
    reward: new Audio('data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGl0dGxlUm9ib3RzVFNFAAAAFAAAAGVmZmVjdHMgc3RlcHBlZF9fX1RFTkMAAAAhAAADTGF2ZjU2LjI1LjEwMQAAAAAAAAAAAAAAA//7kMQAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAASAAAJbQAQEBAQEBoaGhoaGiQkJCQkJDQ0NDQ0NENDQ0NDQ1NTU1NTU2JiYmJiYnJycnJycn9/f39/f4+Pj4+Pj5+fn5+fn6+vr6+vr7+/v7+/v8/Pz8/Pz9/f39/f3+/v7+/v7//////AAAAHkxBTUUzLjEwMAGQAAAAAC4DAARMJAAE8QAACStiYwjtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAANIAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'),
    complete: new Audio('data:audio/mp3;base64,SUQzBAAAAAACJlRJVDIAAAAfAAADSSBMb3ZlIFlvdQAvL01QRUdPZmZpY2lhbEAgMTI4VENPTgAAABEAAAMyMDIyCFRPUEUAAAAOAAADTWFsaWF0bGluCFRZRVIAAAAOAAADMjAyMghUTEVOAAAADwAAA0VuZ2xpc2gAVFhYWAAAAC0AAANUZXN0aW5nIHVzZSBvbmx5OiBCYWRVc2VyQEJhZC5jb21URU5DAAAAHQAAAwIIBQMHEBUPFBERAwAAAAAAAAAAAAA='),
    game: new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAeAAAY/AAkJCQkJCQkJCQkODg4ODg4ODg4OEhISEhISEhISFhYWFhYWFhYWGhoaGhoaGhoaHh4eHh4eHh4eIiIiIiIiIiIiJiYmJiYmJiYmKioqKioqKioqLi4uLi4uLi4uMjIyMjIyMjIyNjY2NjY2NjY2Ojo6Ojo6Ojo6Pj4+Pj4+Pj4+P////8AAAA5TEFNRTMuMTAwA8MAAAAAAAAAABQgJAWyQQABmgAAGPzWaXu2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=')
  };

  // State variables
  let isDarkMode = false;
  let rewardPoints = 0;
  let isRewardsPanelOpen = false;
  let isGameOpen = false;

  // DOM elements
  const body = document.body;
  const rewardsPanel = document.querySelector('.rewards-panel');
  const rewardsToggle = document.querySelector('.rewards-toggle');
  const themeToggle = document.querySelector('.theme-toggle');
  const gameContainer = document.querySelector('.game-container');
  const pointsDisplay = document.getElementById('points-display');
  const notification = document.querySelector('.reward-notification');
  const tasks = document.querySelectorAll('.task:not(.completed)');
  const streakButton = document.querySelector('.stat-card button');
  const exitGameButton = document.getElementById('exit-game');
  const gameArea = document.getElementById('game-area');
  const gameScore = document.getElementById('game-score');

  // Function to play sound
  function playSound(soundName) {
    if (sounds[soundName]) {
      sounds[soundName].currentTime = 0;
      sounds[soundName].play().catch(e => console.log('Sound error:', e));
    }
  }

  // Function to toggle dark mode
  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    body.classList.toggle('dark-mode', isDarkMode);
    playSound('click');
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDarkMode);
  }

  // Function to toggle rewards panel
  function toggleRewardsPanel() {
    isRewardsPanelOpen = !isRewardsPanelOpen;
    rewardsPanel.classList.toggle('open', isRewardsPanelOpen);
    playSound('click');
  }

  // Function to award points
  function awardPoints(points) {
    rewardPoints += points;
    pointsDisplay.textContent = `${rewardPoints} points`;
    
    // Show notification
    notification.textContent = `+${points} points earned!`;
    notification.classList.add('show');
    
    // Hide notification after 2 seconds
    setTimeout(() => {
      notification.classList.remove('show');
    }, 2000);
    
    // Check for unlocked rewards
    checkRewards();
    
    // Save to localStorage
    localStorage.setItem('rewardPoints', rewardPoints);
  }

  // Function to check and update rewards
  function checkRewards() {
    const rewardItems = document.querySelectorAll('.reward-item');
    rewardItems.forEach(item => {
      const pointsNeeded = parseInt(item.getAttribute('data-points'));
      if (rewardPoints >= pointsNeeded && !item.classList.contains('unlocked')) {
        item.classList.add('unlocked');
        playSound('reward');
      }
    });
  }

  // Function to create confetti effect
  function createConfetti() {
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
      document.body.appendChild(confetti);
      
      // Remove after animation completes
      setTimeout(() => {
        confetti.remove();
      }, 4000);
    }
  }

  // Function to start mini-game
  function startGame() {
    isGameOpen = true;
    gameContainer.style.display = 'flex';
    let gamePoints = 0;
    gameScore.textContent = `${gamePoints} points`;
    gameArea.innerHTML = ''; // Clear previous game
    playSound('game');
    
    // Create game items
    for (let i = 0; i < 10; i++) {
      createGameItem();
    }
    
    function createGameItem() {
      const item = document.createElement('div');
      item.classList.add('game-item');
      
      // Random position
      const x = Math.floor(Math.random() * (gameArea.clientWidth - 40));
      const y = Math.floor(Math.random() * (gameArea.clientHeight - 40));
      
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      item.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
      
      // Click event
      item.addEventListener('click', () => {
        gamePoints += 5;
        gameScore.textContent = `${gamePoints} points`;
        item.classList.add('collected');
        playSound('click');
        
        // Create new item after a delay
        setTimeout(() => {
          if (isGameOpen) {
            createGameItem();
          }
        }, 500);
      });
      
      gameArea.appendChild(item);
    }
  }

  // Function to end mini-game
  function endGame() {
    isGameOpen = false;
    gameContainer.style.display = 'none';
    
    // Award points based on game score
    const earnedPoints = parseInt(gameScore.textContent);
    if (earnedPoints > 0) {
      awardPoints(earnedPoints);
    }
  }

  // Add CSS styles
  function addStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* Dark mode */
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
      
      .dark-mode body {
        background-color: var(--background);
        color: var(--foreground);
      }
      
      .dark-mode .sidebar {
        background: linear-gradient(180deg, #1e40af 0%, #3b82f6 100%);
      }
      
      .dark-mode .stat-card,
      .dark-mode .widget {
        background-color: var(--card);
        color: var(--foreground);
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
        color: white;
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
        background-color: var(--background, white);
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
      
      /* Rewards toggle button */
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
      
      /* Game toggle button */
      .game-toggle {
        position: fixed;
        bottom: 20px;
        right: 150px;
        background-color: #10b981;
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
      
      /* Riya chatbot */
      .riya-chatbot {
        position: fixed;
        bottom: 85px;
        right: 20px;
        width: 350px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        z-index: 80;
        display: none;
      }
      
      .chatbot-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background-color: var(--primary);
        color: white;
      }
      
      .chatbot-content {
        height: 300px;
        overflow-y: auto;
        padding: 16px;
      }
      
      .chatbot-input {
        display: flex;
        padding: 12px;
        border-top: 1px solid var(--border);
      }
      
      .chatbot-input input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid var(--border);
        border-radius: 4px;
        margin-right: 8px;
      }
      
      .chatbot-toggle {
        position: fixed;
        bottom: 20px;
        right: 215px;
        background-color: #0ea5e9;
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
      
      .dark-mode .riya-chatbot {
        background: #1e293b;
        color: white;
      }
      
      .dark-mode .chatbot-input input {
        background: #0f172a;
        color: white;
        border-color: #334155;
      }
      
      .message {
        margin-bottom: 12px;
        max-width: 80%;
        padding: 8px 12px;
        border-radius: 16px;
      }
      
      .message.user {
        background-color: var(--primary);
        color: white;
        margin-left: auto;
        border-bottom-right-radius: 4px;
      }
      
      .message.bot {
        background-color: #f1f5f9;
        color: var(--foreground);
        margin-right: auto;
        border-bottom-left-radius: 4px;
      }
      
      .dark-mode .message.bot {
        background-color: #334155;
      }
    `;
    document.head.appendChild(styleElement);
  }

  // Add the game toggle button
  function addGameButton() {
    const gameToggle = document.createElement('div');
    gameToggle.classList.add('game-toggle');
    gameToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>';
    document.body.appendChild(gameToggle);
    
    gameToggle.addEventListener('click', () => {
      playSound('click');
      startGame();
    });
  }

  // Add the Riya chatbot button and UI
  function addChatbot() {
    // Create chatbot toggle button
    const chatbotToggle = document.createElement('div');
    chatbotToggle.classList.add('chatbot-toggle');
    chatbotToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>';
    document.body.appendChild(chatbotToggle);
    
    // Create chatbot UI - using iframe to load the full Riya chatbot
    const chatbot = document.createElement('div');
    chatbot.classList.add('riya-chatbot');
    chatbot.innerHTML = `
      <div class="chatbot-header">
        <h3>Riya Assistant</h3>
        <button id="close-chatbot" style="background: none; border: none; color: white; cursor: pointer;">×</button>
      </div>
      <div class="chatbot-frame-container">
        <iframe id="riya-iframe" src="riya-chatbot.html" width="100%" height="100%" frameborder="0"></iframe>
      </div>
    `;
    document.body.appendChild(chatbot);
    
    // Add necessary styles for iframe container
    const style = document.createElement('style');
    style.textContent = `
      .chatbot-frame-container {
        width: 100%;
        height: calc(100% - 50px); /* Header height */
        overflow: hidden;
      }
      .riya-chatbot {
        width: 350px;
        height: 500px;
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--card);
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        overflow: hidden;
        display: none;
        z-index: 1000;
        border: 1px solid var(--border);
      }
      .chatbot-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: var(--primary);
        color: white;
      }
      .chatbot-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: var(--shadow-md);
        z-index: 1000;
        color: white;
        transition: transform 0.3s ease;
      }
      .chatbot-toggle:hover {
        transform: scale(1.1);
      }
      .dark-mode .riya-chatbot {
        border-color: #444;
      }
    `;
    document.head.appendChild(style);
    
    // Chatbot toggle functionality
    let isChatbotOpen = false;
    
    chatbotToggle.addEventListener('click', () => {
      isChatbotOpen = !isChatbotOpen;
      chatbot.style.display = isChatbotOpen ? 'block' : 'none';
      playSound('click');
    });
    
    // Close button functionality
    document.getElementById('close-chatbot').addEventListener('click', () => {
      isChatbotOpen = false;
      chatbot.style.display = 'none';
      playSound('click');
    });
    
    // Add cross-window communication between main app and Riya chatbot
    window.addTaskFromRiya = function(taskName, dueDate) {
      console.log(`Creating task from Riya: ${taskName}, due: ${dueDate}`);
      
      // Create a new task element
      const taskList = document.querySelector('.task-list');
      if (taskList) {
        const newTask = document.createElement('div');
        newTask.classList.add('task');
        newTask.innerHTML = `
          <div class="task-check"></div>
          <div class="task-content">
            <div class="task-name">${taskName}</div>
            <div class="task-due">Due: ${dueDate}</div>
          </div>
        `;
        
        // Add event listener to mark as complete
        newTask.addEventListener('click', function() {
          if (!this.classList.contains('completed')) {
            this.classList.add('completed');
            this.classList.add('task-complete-effect');
            playSound('complete');
            awardPoints(10);
            
            // Remove effect after animation completes
            setTimeout(() => {
              this.classList.remove('task-complete-effect');
            }, 400);
          }
        });
        
        taskList.appendChild(newTask);
        return true;
      }
      return false;
    };
    
    // Other window functions for Riya integration
    window.openMoodTracker = function() {
      console.log('Opening mood tracker');
      // Open mood tracker functionality
      return true;
    };
    
    window.startPomodoro = function() {
      console.log('Starting Pomodoro timer');
      // Start pomodoro timer functionality
      return true;
    };
    
    window.showAnalytics = function() {
      console.log('Showing analytics');
      // Show analytics functionality
      return true;
    };
  }

  // Initialize
  function init() {
    // Add styles
    addStyles();
    
    // Add game button
    addGameButton();
    
    // Add chatbot
    addChatbot();
    
    // Load saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
      isDarkMode = true;
      body.classList.add('dark-mode');
    }
    
    // Load saved reward points
    const savedPoints = localStorage.getItem('rewardPoints');
    if (savedPoints) {
      rewardPoints = parseInt(savedPoints);
      pointsDisplay.textContent = `${rewardPoints} points`;
      checkRewards();
    }
    
    // Event listeners
    themeToggle.addEventListener('click', toggleDarkMode);
    rewardsToggle.addEventListener('click', toggleRewardsPanel);
    exitGameButton.addEventListener('click', endGame);
    
    // Enhance tasks
    tasks.forEach(task => {
      task.addEventListener('click', function() {
        if (!this.classList.contains('completed')) {
          this.classList.add('completed');
          this.classList.add('task-complete-effect');
          playSound('complete');
          awardPoints(10);
          
          // Remove effect after animation completes
          setTimeout(() => {
            this.classList.remove('task-complete-effect');
          }, 400);
        }
      });
    });
    
    // Enhance streak button
    if (streakButton) {
      streakButton.addEventListener('click', function() {
        createConfetti();
        playSound('reward');
        awardPoints(25);
      });
    }
    
    // Add click sound to buttons
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', () => playSound('click'));
    });
    
    // Add click sound to nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => playSound('click'));
    });
    
    console.log('LifeTrackPro fixed app initialized!');
  }

  // Run initialization
  init();
}); 