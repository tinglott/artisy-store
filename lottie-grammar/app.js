// State
let currentTopic = null;
let currentQuestion = 0;
let score = 0;
let streak = 0;
let totalScore = parseInt(localStorage.getItem('totalScore') || 0);
let bestStreak = parseInt(localStorage.getItem('bestStreak') || 0);
let topicScores = JSON.parse(localStorage.getItem('topicScores') || '{}');

// Load Lottie owl
function loadLottie(id) {
  lottie.destroy();
  lottie.render({
    container: document.getElementById(id),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'data:application/json;base64,eyJpIjowLCJzIjp7ImN0YSI6MH0sInYiOiJcL1RoaXMgaXMgYSBzaW1wbGUgYmFzZTY0IGVuY29kZWQgYW5pbWF0aW9uIFwvIn19'
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderTopics();
  updateStats();
});

function renderTopics() {
  const grid = document.getElementById('topics-grid');
  grid.innerHTML = grammarTopics.map(topic => `
    <button class="topic-btn" onclick="selectTopic(${topic.id})">
      ${topic.emoji} ${topic.name}
    </button>
  `).join('');
}

function selectTopic(id) {
  currentTopic = grammarTopics.find(t => t.id === id);
  showScreen('lesson');
  renderLesson();
}

function renderLesson() {
  document.getElementById('lesson-title').textContent = currentTopic.name;
  document.getElementById('rule-text').textContent = currentTopic.rule;
  document.getElementById('rule-source').textContent = `(${currentTopic.source})`;
  document.getElementById('coach-text').textContent = currentTopic.coach;
}

function startPractice() {
  score = 0;
  streak = 0;
  currentQuestion = 0;
  showScreen('practice');
  renderQuestion();
}

function renderQuestion() {
  if (currentQuestion >= currentTopic.questions.length) {
    showResults();
    return;
  }

  const q = currentTopic.questions[currentQuestion];
  document.getElementById('question-text').textContent = q.q;
  document.getElementById('round-num').textContent = currentQuestion + 1;
  document.getElementById('practice-score').textContent = score;
  document.getElementById('practice-streak').textContent = streak;
  
  // Clear feedback
  const feedback = document.getElementById('feedback');
  feedback.classList.add('hidden');
  document.getElementById('answer-input').value = '';

  if (q.type === 'text') {
    document.getElementById('text-input-area').classList.remove('hidden');
    document.getElementById('options-area').classList.add('hidden');
  } else if (q.type === 'mc') {
    document.getElementById('text-input-area').classList.add('hidden');
    renderOptions(q);
  }

  updateProgressBar();
}

function renderOptions(q) {
  const area = document.getElementById('options-area');
  area.classList.remove('hidden');
  area.innerHTML = q.opts.map((opt, i) => `
    <button class="option-btn" onclick="selectOption('${opt}', '${q.a}')">
      ${opt}
    </button>
  `).join('');
}

function selectOption(selected, correct) {
  const isCorrect = selected === correct;
  updateScore(isCorrect, selected);
  
  const btns = document.querySelectorAll('.option-btn');
  btns.forEach(btn => {
    if (btn.textContent.trim() === selected) {
      btn.classList.add(isCorrect ? 'correct' : 'incorrect');
    } else if (btn.textContent.trim() === correct) {
      btn.classList.add('correct');
    }
    btn.disabled = true;
  });

  setTimeout(() => nextQuestion(), 1500);
}

function checkAnswer() {
  const input = document.getElementById('answer-input').value.toLowerCase().trim();
  const q = currentTopic.questions[currentQuestion];
  
  let isCorrect = false;
  if (typeof q.a === 'string') {
    isCorrect = input === q.a.toLowerCase();
  } else if (Array.isArray(q.a)) {
    isCorrect = q.a.some(ans => input === ans.toLowerCase());
  }

  updateScore(isCorrect, input);
  showFeedback(isCorrect, q.explanation);
  
  setTimeout(() => nextQuestion(), 2000);
}

function updateScore(isCorrect, userAnswer) {
  if (isCorrect) {
    score += 10;
    streak += 1;
    totalScore += 10;
    bestStreak = Math.max(bestStreak, streak);
  } else {
    streak = 0;
  }
  document.getElementById('practice-score').textContent = score;
  document.getElementById('practice-streak').textContent = streak;
}

function showFeedback(isCorrect, explanation) {
  const feedback = document.getElementById('feedback');
  feedback.classList.remove('hidden');
  feedback.classList.toggle('error', !isCorrect);
  
  const msg = isCorrect ? '✅ Correct!' : '❌ Try again!';
  feedback.innerHTML = `
    <p><strong>${msg}</strong></p>
    <p>${explanation}</p>
    <button class="feedback-btn" onclick="nextQuestion()">Continue</button>
  `;
}

function nextQuestion() {
  currentQuestion++;
  renderQuestion();
}

function showResults() {
  showScreen('result');
  document.getElementById('result-title').textContent = 
    score >= 40 ? '🎉 Excellent!' : score >= 20 ? '👍 Good job!' : '💪 Keep practicing!';
  document.getElementById('final-score').textContent = score;
  document.getElementById('final-streak').textContent = streak;
  
  topicScores[currentTopic.name] = Math.max((topicScores[currentTopic.name] || 0), score);
  localStorage.setItem('topicScores', JSON.stringify(topicScores));
  localStorage.setItem('totalScore', totalScore);
  localStorage.setItem('bestStreak', bestStreak);
  updateStats();
}

function restartPractice() {
  startPractice();
}

function goHome() {
  showScreen('home');
}

function openDashboard() {
  showScreen('dashboard');
  renderDashboard();
}

function renderDashboard() {
  document.getElementById('dash-score').textContent = totalScore;
  document.getElementById('dash-streak').textContent = bestStreak;
  document.getElementById('dash-topics').textContent = Object.keys(topicScores).length;
  
  const list = document.getElementById('topic-progress-list');
  list.innerHTML = grammarTopics.map(t => {
    const topicScore = topicScores[t.name] || 0;
    return `
      <div class="topic-progress">
        <span class="topic-progress-name">${t.emoji} ${t.name}</span>
        <span class="topic-progress-score">${topicScore}</span>
      </div>
    `;
  }).join('');
}

function resetProgress() {
  if (confirm('Reset all progress? This cannot be undone.')) {
    totalScore = 0;
    bestStreak = 0;
    topicScores = {};
    localStorage.clear();
    updateStats();
    renderDashboard();
    goHome();
  }
}

function updateStats() {
  document.getElementById('total-score').textContent = totalScore;
  document.getElementById('total-streak').textContent = bestStreak;
}

function updateProgressBar() {
  const pct = (currentQuestion / currentTopic.questions.length) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
}

function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.start();
  document.getElementById('voice-btn').textContent = '🎤 Listening...';
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    document.getElementById('answer-input').value = transcript;
    document.getElementById('voice-btn').textContent = '🎤 Speak';
  };
  
  recognition.onerror = () => {
    document.getElementById('voice-btn').textContent = '🎤 Speak';
  };
}

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(name).classList.add('active');
}

// Mobile nav
document.getElementById('mobileNavBtn')?.addEventListener('click', () => {
  const nav = document.getElementById('navLinks');
  nav?.classList.toggle('open');
});
