// State management
let currentTopic = null;
let currentLessonIndex = 0;
let currentRound = 0;
let roundScore = 0;
let totalScore = 0;
let streak = 0;
let bestStreak = 0;
let topicProgress = {};

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadProgress();
  renderHome();
  loadLottieAnimation();
});

// Load Lottie owl animation
function loadLottieAnimation() {
  const container = document.getElementById("lottie-owl");
  if (container) {
    lottie.loadAnimation({
      container: container,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "https://assets10.lottiefiles.com/packages/lf20_u71zzopi.json"
    });
  }
}

// Render home screen with topic cards
function renderHome() {
  const grid = document.getElementById("topics-grid");
  grid.innerHTML = "";

  grammarTopics.forEach(topic => {
    const topicData = topicProgress[topic.id] || { score: 0, completed: false };
    const card = document.createElement("div");
    card.className = "topic-card";
    card.onclick = () => openTopic(topic.id);
    
    const completedClass = topicData.completed ? "completed" : "";
    card.innerHTML = `
      <div class="topic-emoji">${topic.emoji}</div>
      <h3>${topic.name}</h3>
      <p>${topic.description}</p>
      <div class="topic-stats">
        <span>${topicData.score || 0} points</span>
        ${topicData.completed ? '<span class="badge">✓ Completed</span>' : ''}
      </div>
    `;
    grid.appendChild(card);
  });

  updateHomeStats();
  showScreen("home");
}

function updateHomeStats() {
  document.getElementById("total-score").textContent = totalScore;
  document.getElementById("total-streak").textContent = streak;
}

// Open topic lesson
function openTopic(topicId) {
  currentTopic = grammarTopics.find(t => t.id === topicId);
  currentLessonIndex = 0;
  currentRound = 0;
  roundScore = 0;
  
  const titleEl = document.getElementById("lesson-title");
  const ruleEl = document.getElementById("rule-text");
  const sourceEl = document.getElementById("rule-source");
  const coachEl = document.getElementById("coach-text");

  titleEl.textContent = currentTopic.name;
  ruleEl.textContent = currentTopic.rule;
  sourceEl.textContent = `💡 Grammar rule`;
  coachEl.textContent = currentTopic.coachTip;

  showScreen("lesson");
}

// Start practice mode
function startPractice() {
  if (!currentTopic) return;
  currentLessonIndex = 0;
  currentRound = 1;
  roundScore = 0;
  loadPracticeQuestion();
  showScreen("practice");
}

// Load next practice question
function loadPracticeQuestion() {
  const lessons = currentTopic.lessons;
  
  if (currentLessonIndex >= lessons.length) {
    endPractice();
    return;
  }

  const lesson = lessons[currentLessonIndex];
  document.getElementById("question-text").textContent = lesson.question;
  document.getElementById("practice-score").textContent = roundScore;
  document.getElementById("practice-streak").textContent = streak;
  document.getElementById("round-num").textContent = currentRound;

  const optionsArea = document.getElementById("options-area");
  const textArea = document.getElementById("text-input-area");

  // Clear feedback
  const feedback = document.getElementById("feedback");
  feedback.classList.add("hidden");
  feedback.innerHTML = "";

  if (lesson.type === "multiple-choice") {
    optionsArea.classList.remove("hidden");
    textArea.classList.add("hidden");
    renderMultipleChoice(lesson);
  } else {
    optionsArea.classList.add("hidden");
    textArea.classList.remove("hidden");
    document.getElementById("answer-input").value = "";
    document.getElementById("answer-input").focus();
  }

  updateProgressBar();
}

// Render multiple choice options
function renderMultipleChoice(lesson) {
  const area = document.getElementById("options-area");
  area.innerHTML = "";

  lesson.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = answer;
    btn.onclick = () => selectAnswer(answer);
    area.appendChild(btn);
  });
}

// Select answer (for multiple choice)
function selectAnswer(answer) {
  const lesson = currentTopic.lessons[currentLessonIndex];
  const isCorrect = answer === lesson.correct;
  showFeedback(isCorrect, lesson);
}

// Check answer (for text input)
function checkAnswer() {
  const lesson = currentTopic.lessons[currentLessonIndex];
  const userAnswer = document.getElementById("answer-input").value.toLowerCase().trim();
  
  // Handle multiple acceptable answers
  const correctAnswers = Array.isArray(lesson.correct) ? lesson.correct : [lesson.correct];
  const acceptableAnswers = Array.isArray(lesson.answers) ? lesson.answers : [lesson.answers];
  
  let isCorrect = false;
  
  // Check against correct answer(s)
  if (correctAnswers.some(ans => ans.toLowerCase() === userAnswer)) {
    isCorrect = true;
  }
  
  // Also check against acceptable answers for free-form questions
  if (!isCorrect && acceptableAnswers.length > 0) {
    isCorrect = acceptableAnswers.some(ans => ans.toLowerCase() === userAnswer);
  }

  showFeedback(isCorrect, lesson);
}

// Show feedback and move to next question
function showFeedback(isCorrect, lesson) {
  const feedback = document.getElementById("feedback");
  feedback.classList.remove("hidden");

  if (isCorrect) {
    roundScore += 10;
    streak++;
    if (streak > bestStreak) bestStreak = streak;
    totalScore += 10;

    feedback.innerHTML = `
      <div class="feedback-box correct">
        <h3>✅ Correct!</h3>
        <p>${lesson.explanation}</p>
        <button class="primary-btn" onclick="nextQuestion()">Next Question →</button>
      </div>
    `;
  } else {
    streak = 0;
    feedback.innerHTML = `
      <div class="feedback-box incorrect">
        <h3>❌ Not quite.</h3>
        <p><strong>Correct answer:</strong> ${lesson.correct}</p>
        <p>${lesson.explanation}</p>
        <button class="primary-btn" onclick="nextQuestion()">Next Question →</button>
      </div>
    `;
  }

  document.getElementById("practice-score").textContent = roundScore;
  document.getElementById("practice-streak").textContent = streak;
}

// Move to next question
function nextQuestion() {
  currentLessonIndex++;
  currentRound++;
  loadPracticeQuestion();
}

// End practice session
function endPractice() {
  // Update topic progress
  if (!topicProgress[currentTopic.id]) {
    topicProgress[currentTopic.id] = { score: 0, completed: false };
  }
  topicProgress[currentTopic.id].score += roundScore;
  topicProgress[currentTopic.id].completed = true;

  saveProgress();

  // Show results
  const resultTitle = document.getElementById("result-title");
  const resultMessage = document.getElementById("result-message");

  if (roundScore >= 40) {
    resultTitle.textContent = "🎉 Fantastic!";
    resultMessage.textContent = `You scored ${roundScore} points! Keep practicing to master ${currentTopic.name}.`;
  } else if (roundScore >= 20) {
    resultTitle.textContent = "👏 Great effort!";
    resultMessage.textContent = `You scored ${roundScore} points. Try the lesson again to improve!`;
  } else {
    resultTitle.textContent = "💪 Keep trying!";
    resultMessage.textContent = `You scored ${roundScore} points. Review the lesson and try again!`;
  }

  document.getElementById("final-score").textContent = totalScore;
  document.getElementById("final-streak").textContent = bestStreak;

  showScreen("result");
}

// Restart practice for same topic
function restartPractice() {
  currentLessonIndex = 0;
  startPractice();
}

// Open parent dashboard
function openDashboard() {
  document.getElementById("dash-score").textContent = totalScore;
  document.getElementById("dash-streak").textContent = bestStreak;
  
  const topicsList = document.getElementById("topic-progress-list");
  topicsList.innerHTML = "";

  grammarTopics.forEach(topic => {
    const topicData = topicProgress[topic.id] || { score: 0, completed: false };
    const item = document.createElement("div");
    item.className = "progress-item";
    item.innerHTML = `
      <span>${topic.emoji} ${topic.name}</span>
      <div class="progress-info">
        <span>${topicData.score} pts</span>
        ${topicData.completed ? '<span class="completed-badge">✓</span>' : ''}
      </div>
    `;
    topicsList.appendChild(item);
  });

  showScreen("dashboard");
}

// Voice input (if browser supports it)
function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  const btn = document.getElementById("voice-btn");
  
  btn.textContent = "🎤 Listening...";
  btn.disabled = true;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("answer-input").value = transcript;
    btn.textContent = "🎤 Speak";
    btn.disabled = false;
  };

  recognition.onerror = () => {
    btn.textContent = "🎤 Speak";
    btn.disabled = false;
    alert("Speech recognition failed. Please type your answer.");
  };

  recognition.start();
}

// Reset progress
function resetProgress() {
  if (confirm("Are you sure? This will erase all progress.")) {
    totalScore = 0;
    streak = 0;
    bestStreak = 0;
    topicProgress = {};
    saveProgress();
    goHome();
  }
}

// Navigation
function goHome() {
  renderHome();
}

function showScreen(screenName) {
  document.querySelectorAll(".screen").forEach(el => {
    el.classList.remove("active");
  });
  document.getElementById(screenName).classList.add("active");
}

// Progress bar
function updateProgressBar() {
  const total = currentTopic.lessons.length;
  const current = currentLessonIndex;
  const percentage = (current / total) * 100;
  document.getElementById("progress-fill").style.width = percentage + "%";
}

// Persist progress to localStorage
function saveProgress() {
  localStorage.setItem("grammarProgress", JSON.stringify({
    totalScore,
    streak,
    bestStreak,
    topicProgress
  }));
}

function loadProgress() {
  const saved = localStorage.getItem("grammarProgress");
  if (saved) {
    const data = JSON.parse(saved);
    totalScore = data.totalScore || 0;
    streak = data.streak || 0;
    bestStreak = data.bestStreak || 0;
    topicProgress = data.topicProgress || {};
  }
}
