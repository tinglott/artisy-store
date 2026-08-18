// State Management
const STATE = {
  currentTopic: null,
  currentLesson: null,
  currentQuestion: 0,
  sessionScore: 0,
  sessionStreak: 0,
  progress: JSON.parse(localStorage.getItem('lottie-progress')) || {}
};

// Initialize localStorage
function initProgress() {
  GRAMMAR_DATA.topics.forEach(topic => {
    if (!STATE.progress[topic.id]) {
      STATE.progress[topic.id] = {
        completed: [],
        score: 0,
        streak: 0
      };
    }
  });
  saveProgress();
}

function saveProgress() {
  localStorage.setItem('lottie-progress', JSON.stringify(STATE.progress));
  localStorage.setItem('lottie-score', JSON.stringify({
    totalScore: getTotalScore(),
    bestStreak: getBestStreak()
  }));
}

// Initialize on page load
window.addEventListener('load', () => {
  initProgress();
  renderHome();
  loadOwlAnimation();
});

// Owl Animation (placeholder - uses emoji)
function loadOwlAnimation() {
  const containers = document.querySelectorAll('.owl-container, .owl-small');
  containers.forEach(c => {
    c.innerHTML = '🦉';
    c.style.fontSize = '3rem';
    c.style.display = 'flex';
    c.style.alignItems = 'center';
    c.style.justifyContent = 'center';
  });
}

// Calculate totals
function getTotalScore() {
  return Object.values(STATE.progress).reduce((sum, topic) => sum + topic.score, 0);
}

function getBestStreak() {
  return Math.max(...Object.values(STATE.progress).map(t => t.streak || 0), 0);
}

// SCREEN NAVIGATION
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

function goHome() {
  STATE.currentTopic = null;
  STATE.currentLesson = null;
  STATE.currentQuestion = 0;
  STATE.sessionScore = 0;
  STATE.sessionStreak = 0;
  renderHome();
  showScreen('home');
}

// HOME SCREEN
function renderHome() {
  const grid = document.getElementById('topics-grid');
  grid.innerHTML = '';
  document.getElementById('total-score').textContent = getTotalScore();
  document.getElementById('total-streak').textContent = getBestStreak();

  GRAMMAR_DATA.topics.forEach(topic => {
    const progress = STATE.progress[topic.id] || { completed: [], score: 0 };
    const card = document.createElement('div');
    card.className = 'topic-card';
    card.innerHTML = `
      <div class="topic-icon">${topic.icon}</div>
      <div class="topic-name">${topic.name}</div>
      <div class="topic-progress">${progress.completed.length}/${topic.lessons.length} done</div>
      <div class="progress-bar-small">
        <div class="fill" style="width: ${(progress.completed.length / topic.lessons.length) * 100}%"></div>
      </div>
    `;
    card.onclick = () => showTopic(topic.id);
    grid.appendChild(card);
  });
}

// TOPIC & LESSON SELECTION
function showTopic(topicId) {
  const topic = GRAMMAR_DATA.getTopic(topicId);
  STATE.currentTopic = topicId;

  const grid = document.getElementById('topics-grid');
  grid.innerHTML = `<button class="back-btn" onclick="goHome()" style="grid-column: 1/-1; margin-bottom: 20px;">← Back</button>`;

  topic.lessons.forEach(lesson => {
    const isCompleted = STATE.progress[topicId].completed.includes(lesson.id);
    const card = document.createElement('div');
    card.className = 'topic-card';
    card.style.opacity = isCompleted ? '0.7' : '1';
    card.innerHTML = `
      <div class="topic-icon">${isCompleted ? '✅' : '📖'}</div>
      <div class="topic-name">${lesson.title}</div>
      <div class="topic-progress">${isCompleted ? 'Completed' : 'Ready to Learn'}</div>
    `;
    card.onclick = () => showLesson(topicId, lesson.id);
    grid.appendChild(card);
  });
}

function showLesson(topicId, lessonId) {
  STATE.currentTopic = topicId;
  STATE.currentLesson = lessonId;
  STATE.currentQuestion = 0;
  STATE.sessionScore = 0;
  STATE.sessionStreak = 0;

  const lesson = GRAMMAR_DATA.getLesson(topicId, lessonId);

  document.getElementById('lesson-title').textContent = lesson.title;
  document.getElementById('rule-text').textContent = lesson.rule;
  document.getElementById('coach-text').textContent = lesson.coach;
  document.getElementById('rule-source').textContent = '💡 Tip from Lottie';

  showScreen('lesson');
  loadOwlAnimation();
}

// PRACTICE MODE
function startPractice() {
  STATE.currentQuestion = 0;
  STATE.sessionScore = 0;
  STATE.sessionStreak = 0;
  showScreen('practice');
  loadQuestion();
}

function loadQuestion() {
  const lesson = GRAMMAR_DATA.getLesson(STATE.currentTopic, STATE.currentLesson);
  const questions = lesson.questions;
  const q = questions[STATE.currentQuestion];

  document.getElementById('round-num').textContent = STATE.currentQuestion + 1;
  document.getElementById('practice-score').textContent = STATE.sessionScore;
  document.getElementById('practice-streak').textContent = STATE.sessionStreak;
  document.getElementById('question-text').textContent = q.question;

  // Clear previous feedback
  const feedback = document.getElementById('feedback');
  feedback.classList.add('hidden');
  feedback.classList.remove('correct', 'incorrect');

  // Reset input
  document.getElementById('answer-input').value = '';

  // Show appropriate input method
  const optionsArea = document.getElementById('options-area');
  const textArea = document.getElementById('text-input-area');

  if (q.type === 'multiple-choice') {
    optionsArea.classList.remove('hidden');
    optionsArea.innerHTML = '';
    textArea.style.display = 'none';

    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.onclick = () => selectOption(btn, opt, q.answer);
      optionsArea.appendChild(btn);
    });
  } else {
    optionsArea.classList.add('hidden');
    textArea.style.display = 'flex';
  }

  // Update progress bar
  const progress = ((STATE.currentQuestion + 1) / lesson.questions.length) * 100;
  document.getElementById('progress-fill').style.width = progress + '%';
}

function selectOption(btn, selected, correct) {
  const btns = document.querySelectorAll('.option-btn');
  btns.forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  
  // Auto-check after selection
  setTimeout(() => checkAnswer(selected, correct), 300);
}

// VOICE RECOGNITION
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

function startVoice() {
  const btn = document.getElementById('voice-btn');
  btn.textContent = '🎤 Listening...';
  btn.style.background = '#FF6B6B';
  recognition.start();
}

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript.toLowerCase().trim();
  document.getElementById('answer-input').value = transcript;
  const btn = document.getElementById('voice-btn');
  btn.textContent = '🎤 Speak';
  btn.style.background = '#4ECDC4';
};

recognition.onerror = (event) => {
  console.error('Speech error', event.error);
  const btn = document.getElementById('voice-btn');
  btn.textContent = '🎤 Speak';
};

// CHECK ANSWER
function checkAnswer(selectedAnswer = null, correctAnswer = null) {
  const lesson = GRAMMAR_DATA.getLesson(STATE.currentTopic, STATE.currentLesson);
  const questions = lesson.questions;
  const q = questions[STATE.currentQuestion];

  let userAnswer = selectedAnswer || document.getElementById('answer-input').value.toLowerCase().trim();
  let correct = false;

  if (q.flexible) {
    // For flexible answers (e.g., any proper noun is acceptable)
    correct = userAnswer.length > 0 && /^[A-Z]/.test(userAnswer);
  } else {
    // Normalize comparison
    const normalizedCorrect = (correctAnswer || q.answer).toLowerCase().trim();
    correct = userAnswer === normalizedCorrect || levenshteinDistance(userAnswer, normalizedCorrect) <= 2;
  }

  showFeedback(correct, q.explanation);

  if (correct) {
    STATE.sessionScore += 10;
    STATE.sessionStreak += 1;
  } else {
    STATE.sessionStreak = 0;
  }

  setTimeout(() => nextQuestion(), 2000);
}

function showFeedback(isCorrect, explanation) {
  const feedback = document.getElementById('feedback');
  feedback.classList.remove('hidden');
  feedback.classList.toggle('correct', isCorrect);
  feedback.classList.toggle('incorrect', !isCorrect);
  feedback.textContent = isCorrect ? '✅ Correct! ' + explanation : '❌ Not quite. ' + explanation;
}

function nextQuestion() {
  const lesson = GRAMMAR_DATA.getLesson(STATE.currentTopic, STATE.currentLesson);
  STATE.currentQuestion++;

  if (STATE.currentQuestion >= lesson.questions.length) {
    endLesson();
  } else {
    loadQuestion();
  }
}

// LESSON COMPLETE
function endLesson() {
  const topicId = STATE.currentTopic;
  const lessonId = STATE.currentLesson;

  // Update progress
  if (!STATE.progress[topicId].completed.includes(lessonId)) {
    STATE.progress[topicId].completed.push(lessonId);
  }
  STATE.progress[topicId].score += STATE.sessionScore;
  STATE.progress[topicId].streak = Math.max(STATE.progress[topicId].streak || 0, STATE.sessionStreak);
  saveProgress();

  // Show results
  document.getElementById('result-title').textContent = STATE.sessionScore > 20 ? '🌟 Excellent!' : '👏 Good Job!';
  document.getElementById('result-message').textContent = `You earned ${STATE.sessionScore} points!`;
  document.getElementById('final-score').textContent = STATE.sessionScore;
  document.getElementById('final-streak').textContent = STATE.sessionStreak;

  showScreen('result');
  loadOwlAnimation();
}

function restartPractice() {
  startPractice();
}

// PARENT DASHBOARD
function openDashboard() {
  const list = document.getElementById('topic-progress-list');
  list.innerHTML = '';

  GRAMMAR_DATA.topics.forEach(topic => {
    const topicProgress = STATE.progress[topic.id];
    const item = document.createElement('div');
    item.className = 'topic-item';
    item.innerHTML = `
      <span class="topic-item-name">${topic.name}</span>
      <span class="topic-item-score">${topicProgress.score} pts</span>
    `;
    list.appendChild(item);
  });

  document.getElementById('dash-score').textContent = getTotalScore();
  document.getElementById('dash-streak').textContent = getBestStreak();
  document.getElementById('dash-topics').textContent = Object.values(STATE.progress).filter(t => t.completed.length > 0).length;

  showScreen('dashboard');
}

function resetProgress() {
  if (confirm('Are you sure? This will erase all progress.')) {
    STATE.progress = {};
    initProgress();
    openDashboard();
    renderHome();
  }
}

// HELPER: Levenshtein distance for fuzzy matching
function levenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}
