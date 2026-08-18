// STATE
let currentTopic = null;
let currentQuestion = 0;
let currentScore = 0;
let currentStreak = 0;
let totalScore = localStorage.getItem('totalScore') || 0;
let totalStreak = localStorage.getItem('totalStreak') || 0;
let topicProgress = JSON.parse(localStorage.getItem('topicProgress')) || {};

// Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
}

// INITIALIZATION
window.onload = () => {
  renderTopics();
  updateStats();
  renderOwl('home');
};

function renderOwl(type) {
  const owl = type === 'home' ? document.getElementById('lottie-owl') : 
              type === 'lesson' ? document.getElementById('lottie-lesson') :
              document.getElementById('lottie-result');
  
  if (owl) {
    owl.innerHTML = lottieAnimations[type] || '🦉';
  }
}

function renderTopics() {
  const grid = document.getElementById('topics-grid');
  grid.innerHTML = grammarTopics.map(topic => `
    <button class="topic-btn" onclick="selectTopic(${topic.id})">
      <span class="emoji">${topic.emoji}</span>
      ${topic.name}
    </button>
  `).join('');
}

function updateStats() {
  document.getElementById('total-score').textContent = totalScore;
  document.getElementById('total-streak').textContent = totalStreak;
}

function selectTopic(topicId) {
  currentTopic = grammarTopics.find(t => t.id === topicId);
  currentQuestion = 0;
  currentScore = 0;
  currentStreak = 0;
  
  if (!topicProgress[currentTopic.id]) {
    topicProgress[currentTopic.id] = { attempts: 0, bestScore: 0 };
  }
  
  showScreen('lesson');
  renderLesson();
}

function renderLesson() {
  document.getElementById('lesson-title').textContent = `📖 ${currentTopic.name}`;
  document.getElementById('rule-text').textContent = currentTopic.rule;
  document.getElementById('rule-source').textContent = `— ${currentTopic.source}`;
  document.getElementById('coach-text').textContent = currentTopic.coach;
  renderOwl('lesson');
}

function startPractice() {
  currentQuestion = 0;
  currentScore = 0;
  currentStreak = 0;
  showScreen('practice');
  renderQuestion();
}

function renderQuestion() {
  if (currentQuestion >= currentTopic.questions.length) {
    showResult();
    return;
  }
  
  const question = currentTopic.questions[currentQuestion];
  document.getElementById('question-text').textContent = question.text;
  document.getElementById('round-num').textContent = currentQuestion + 1;
  document.getElementById('practice-score').textContent = currentScore;
  document.getElementById('practice-streak').textContent = currentStreak;
  
  // Update progress bar
  const progress = ((currentQuestion) / currentTopic.questions.length) * 100;
  document.getElementById('progress-fill').style.width = progress + '%';
  
  // Clear previous answer
  document.getElementById('answer-input').value = '';
  document.getElementById('feedback').classList.add('hidden');
  
  const optionsArea = document.getElementById('options-area');
  const textInputArea = document.getElementById('text-input-area');
  
  if (question.type === 'multiple-choice') {
    optionsArea.classList.remove('hidden');
    textInputArea.classList.add('hidden');
    optionsArea.innerHTML = question.options.map(option => `
      <button class="option-btn" onclick="checkMultipleChoice('${option}')">${option}</button>
    `).join('');
  } else {
    optionsArea.classList.add('hidden');
    textInputArea.classList.remove('hidden');
    document.getElementById('answer-input').focus();
  }
}

function checkMultipleChoice(answer) {
  const question = currentTopic.questions[currentQuestion];
  const isCorrect = answer === question.correct;
  checkAnswerResult(isCorrect);
}

function checkAnswer() {
  const answer = document.getElementById('answer-input').value.trim().toLowerCase();
  if (!answer) {
    alert('Please type an answer!');
    return;
  }
  
  const question = currentTopic.questions[currentQuestion];
  const isCorrect = question.acceptAnswers.some(acc => 
    answer === acc.toLowerCase()
  );
  checkAnswerResult(isCorrect);
}

function checkAnswerResult(isCorrect) {
  const feedback = document.getElementById('feedback');
  const question = currentTopic.questions[currentQuestion];
  
  if (isCorrect) {
    currentScore++;
    currentStreak++;
    feedback.textContent = '✓ Correct! Great job! 🎉';
    feedback.classList.remove('hidden', 'incorrect');
    feedback.classList.add('correct');
  } else {
    currentStreak = 0;
    const correct = question.type === 'multiple-choice' ? question.correct : question.acceptAnswers[0];
    feedback.textContent = `✗ Not quite. The answer is: ${correct}`;
    feedback.classList.remove('hidden', 'correct');
    feedback.classList.add('incorrect');
  }
  
  document.getElementById('practice-score').textContent = currentScore;
  document.getElementById('practice-streak').textContent = currentStreak;
  
  setTimeout(() => {
    currentQuestion++;
    setTimeout(renderQuestion, 1000);
  }, 2000);
}

function startVoice() {
  if (!recognition) {
    alert('Speech recognition not available in your browser');
    return;
  }
  
  document.getElementById('voice-btn').textContent = '🎤 Listening...';
  recognition.start();
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById('answer-input').value = transcript;
    document.getElementById('voice-btn').textContent = '🎤 Speak';
  };
  
  recognition.onerror = () => {
    document.getElementById('voice-btn').textContent = '🎤 Speak';
  };
}

function showResult() {
  topicProgress[currentTopic.id].attempts++;
  if (currentScore > (topicProgress[currentTopic.id].bestScore || 0)) {
    topicProgress[currentTopic.id].bestScore = currentScore;
  }
  
  totalScore = parseInt(totalScore) + currentScore;
  if (currentStreak > parseInt(totalStreak)) {
    totalStreak = currentStreak;
  }
  
  localStorage.setItem('totalScore', totalScore);
  localStorage.setItem('totalStreak', totalStreak);
  localStorage.setItem('topicProgress', JSON.stringify(topicProgress));
  
  document.getElementById('final-score').textContent = currentScore;
  document.getElementById('final-streak').textContent = currentStreak;
  
  const total = currentTopic.questions.length;
  const percentage = Math.round((currentScore / total) * 100);
  
  let message = '';
  if (percentage === 100) {
    message = 'Perfect score! You\'re a grammar champion! 🏆';
  } else if (percentage >= 80) {
    message = 'Excellent work! You really know your grammar! 🌟';
  } else if (percentage >= 60) {
    message = 'Good effort! Keep practicing! 💪';
  } else {
    message = 'Keep trying! You\'ll get better! 📚';
  }
  
  document.getElementById('result-title').textContent = `${currentScore}/${total} Correct!`;
  document.getElementById('result-message').textContent = message;
  renderOwl('success');
  showScreen('result');
}

function restartPractice() {
  startPractice();
}

function openDashboard() {
  document.getElementById('dash-score').textContent = totalScore;
  document.getElementById('dash-streak').textContent = totalStreak;
  document.getElementById('dash-topics').textContent = Object.keys(topicProgress).length;
  
  const list = document.getElementById('topic-progress-list');
  list.innerHTML = Object.entries(topicProgress).map(([topicId, progress]) => {
    const topic = grammarTopics.find(t => t.id === parseInt(topicId));
    return `
      <div class="topic-progress">
        <span class="topic-progress-name">${topic.name}</span>
        <span class="topic-progress-score">Best: ${progress.bestScore}/5 (${progress.attempts} attempt${progress.attempts !== 1 ? 's' : ''})</span>
      </div>
    `;
  }).join('');
  
  showScreen('dashboard');
}

function resetProgress() {
  if (confirm('Are you sure? This will reset all progress.')) {
    totalScore = 0;
    totalStreak = 0;
    topicProgress = {};
    localStorage.clear();
    alert('Progress reset!');
    goHome();
  }
}

function goHome() {
  showScreen('home');
  updateStats();
  renderTopics();
}

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(name).classList.add('active');
}
