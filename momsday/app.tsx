import React, { useState, useEffect } from 'react';

interface QuickWin {
  id: string;
  text: string;
  date: string;
  completed: boolean;
}

interface MindfulnessSession {
  name: string;
  duration: number;
  category: string;
  script: string;
}

const MomsDayApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'selfcare' | 'affirmations' | 'wins' | 'mindfulness'>('dashboard');
  const [quickWins, setQuickWins] = useState<QuickWin[]>([
    { id: '1', text: 'Made it through bedtime without yelling', date: new Date().toISOString().split('T')[0], completed: true },
    { id: '2', text: 'Took a 5-minute break for myself', date: new Date().toISOString().split('T')[0], completed: true },
  ]);
  const [newWin, setNewWin] = useState('');
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const affirmations = [
    '✨ You are doing an amazing job.',
    '💪 You are strong enough for today.',
    '🌟 Your love for your family shows in everything you do.',
    '🎯 You deserve rest and care too.',
    '💝 You are not alone in this.',
    '🌈 Tomorrow is a fresh start.',
    '👑 You are breaking generational cycles.',
    '🔥 Your patience is a superpower.',
    '🌱 You are growing every single day.',
    '💖 Your kids are so lucky to have you.',
  ];

  const selfCareOptions = [
    { icon: '☕', title: 'Coffee Break', desc: 'Sit alone with coffee/tea for 5 min', time: '5 min' },
    { icon: '🚿', title: 'Hot Shower', desc: 'Let the water reset your nervous system', time: '10 min' },
    { icon: '🚶‍♀️', title: 'Walk Outside', desc: 'Fresh air and movement clear your head', time: '10-15 min' },
    { icon: '🎵', title: 'Dance Break', desc: 'Play your favorite song loud', time: '3 min' },
    { icon: '📚', title: 'Read', desc: 'Escape into a book, even 5 pages helps', time: '5-10 min' },
    { icon: '💅', title: 'Nails/Skincare', desc: 'Treat yourself like you\'d treat someone you love', time: '5-10 min' },
    { icon: '🧘‍♀️', title: 'Stretch', desc: 'Release physical tension from your body', time: '5 min' },
    { icon: '🍫', title: 'Chocolate Moment', desc: 'Pause to really taste something good', time: '2 min' },
  ];

  const mindfulnessSessions: MindfulnessSession[] = [
    {
      name: '2-Minute Reset',
      duration: 2,
      category: 'Quick',
      script: 'Close your eyes. Breathe in through your nose for 4 counts. Hold for 4. Out for 4. Repeat 5 times. Notice how your body feels. You\'ve got this.',
    },
    {
      name: 'Loving-Kindness for YOU',
      duration: 5,
      category: 'Heart',
      script: 'Sit comfortably. Place hand on heart. Repeat: "May I be safe. May I be healthy. May I be happy. May I be at peace." Say it like you\'d say it to your child.',
    },
    {
      name: 'Body Scan Relaxation',
      duration: 10,
      category: 'Body',
      script: 'Lie down. Starting at your toes, tense each part of your body for 2 seconds, then release. Move slowly up: feet, calves, thighs, belly, chest, arms, hands, neck, face.',
    },
    {
      name: 'Anxiety Release',
      duration: 5,
      category: 'Anxiety',
      script: 'Notice your anxiety without judgment. Breathe in: "I see you, anxiety." Breathe out: "You are not my truth." Repeat. Anxiety is just a visitor passing through.',
    },
  ];

  const addQuickWin = () => {
    if (newWin.trim()) {
      const today = new Date().toISOString().split('T')[0];
      setQuickWins([{ id: Date.now().toString(), text: newWin, date: today, completed: false }, ...quickWins]);
      setNewWin('');
    }
  };

  const toggleWin = (id: string) => {
    setQuickWins(quickWins.map(w => w.id === id ? { ...w, completed: !w.completed } : w));
  };

  const deleteWin = (id: string) => {
    setQuickWins(quickWins.filter(w => w.id !== id));
  };

  const todaysWins = quickWins.filter(w => w.date === new Date().toISOString().split('T')[0]);
  const totalWins = quickWins.length;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => setSessionTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>💖 Mom's Day</h1>
        <p style={styles.subtitle}>Your Daily Wellness Companion</p>
      </header>

      <nav style={styles.nav}>
        {['dashboard', 'selfcare', 'affirmations', 'wins', 'mindfulness'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              ...styles.navButton,
              backgroundColor: activeTab === tab ? '#ec4899' : '#fce7f3',
              color: activeTab === tab ? 'white' : '#333',
            }}
          >
            {tab === 'dashboard' && '📊'} {tab === 'selfcare' && '💅'} {tab === 'affirmations' && '✨'}
            {tab === 'wins' && '🎉'} {tab === 'mindfulness' && '🧘‍♀️'} {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
          </button>
        ))}
      </nav>

      {/* DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div style={styles.tabContent}>
          <h2>Welcome to Your Day 💕</h2>
          
          <div style={styles.dashboardGrid}>
            <div style={styles.statCard}>
              <span style={styles.statIcon}>🎉</span>
              <div>
                <p style={styles.statLabel}>Quick Wins Today</p>
                <p style={styles.statValue}>{todaysWins.length}</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <span style={styles.statIcon}>⭐</span>
              <div>
                <p style={styles.statLabel}>Total Celebrations</p>
                <p style={styles.statValue}>{totalWins}</p>
              </div>
            </div>

            <div style={styles.statCard}>
              <span style={styles.statIcon}>💭</span>
              <div>
                <p style={styles.statLabel}>Mindfulness Minutes</p>
                <p style={styles.statValue}>~{Math.floor(sessionTime / 60)}</p>
              </div>
            </div>
          </div>

          <div style={styles.affirmationDisplay}>
            <p style={styles.affirmationText}>{affirmations[affirmationIndex]}</p>
            <button
              onClick={() => setAffirmationIndex((affirmationIndex + 1) % affirmations.length)}
              style={styles.affirmationButton}
            >
              Next Affirmation ✨
            </button>
          </div>

          <div style={styles.quickAccessGrid}>
            <div style={styles.quickAccessCard}>
              <h3>🚨 Feeling Overwhelmed?</h3>
              <p>Take a 2-minute mindfulness break. Your nervous system needs a reset.</p>
              <button style={styles.quickActionButton} onClick={() => setActiveTab('mindfulness')}>
                Start Now →
              </button>
            </div>

            <div style={styles.quickAccessCard}>
              <h3>💪 Small Wins Matter</h3>
              <p>Did you make it through the day? That's a win. Did you drink water? That's a win too.</p>
              <button style={styles.quickActionButton} onClick={() => setActiveTab('wins')}>
                Log a Win →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SELF-CARE OPTIONS */}
      {activeTab === 'selfcare' && (
        <div style={styles.tabContent}>
          <h2>Quick Self-Care Ideas</h2>
          <p style={styles.subtitle}>Choose one right now. You deserve it. 💕</p>

          <div style={styles.selfCareGrid}>
            {selfCareOptions.map((option, idx) => (
              <div key={idx} style={styles.selfCareCard}>
                <span style={styles.selfCareIcon}>{option.icon}</span>
                <h3>{option.title}</h3>
                <p>{option.desc}</p>
                <span style={styles.timeTag}>{option.time}</span>
                <button style={styles.doItButton}>Do It Now!</button>
              </div>
            ))}
          </div>

          <div style={styles.tipsBox}>
            <h3>💡 Self-Care is Not Selfish</h3>
            <p>Taking care of yourself IS taking care of your family. You can't pour from an empty cup. Even 5 minutes counts. Start small.</p>
          </div>
        </div>
      )}

      {/* AFFIRMATIONS */}
      {activeTab === 'affirmations' && (
        <div style={styles.tabContent}>
          <h2>Daily Affirmations for Moms</h2>
          <p style={styles.subtitle}>Read these when doubt creeps in.</p>

          <div style={styles.affirmationsContainer}>
            {affirmations.map((aff, idx) => (
              <div key={idx} style={styles.affirmationCard}>
                <p>{aff}</p>
              </div>
            ))}
          </div>

          <div style={styles.practiceBox}>
            <h3>🎯 How to Use Affirmations</h3>
            <ol>
              <li>Pick one that resonates</li>
              <li>Say it out loud 3 times (yes, really out loud!)</li>
              <li>Feel it in your chest</li>
              <li>Write it on a sticky note for your mirror</li>
            </ol>
          </div>
        </div>
      )}

      {/* QUICK WINS */}
      {activeTab === 'wins' && (
        <div style={styles.tabContent}>
          <h2>Your Quick Wins 🎉</h2>
          <p style={styles.subtitle}>Celebrate the small victories. They matter!</p>

          <div style={styles.winForm}>
            <input
              type="text"
              placeholder="What did you accomplish today? (Any size win counts!)"
              value={newWin}
              onChange={(e) => setNewWin(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addQuickWin()}
              style={styles.winInput}
            />
            <button onClick={addQuickWin} style={styles.addWinButton}>
              🎉 Add Win
            </button>
          </div>

          <div style={styles.winsList}>
            {quickWins.length === 0 ? (
              <p style={styles.emptyState}>No wins yet today. Start logging them! 💪</p>
            ) : (
              quickWins.map(win => (
                <div key={win.id} style={styles.winCard}>
                  <input
                    type="checkbox"
                    checked={win.completed}
                    onChange={() => toggleWin(win.id)}
                    style={styles.winCheckbox}
                  />
                  <div style={styles.winText}>
                    <p style={{ opacity: win.completed ? 0.6 : 1, textDecoration: win.completed ? 'line-through' : 'none' }}>
                      {win.text}
                    </p>
                    <span style={styles.winDate}>{win.date}</span>
                  </div>
                  <button
                    onClick={() => deleteWin(win.id)}
                    style={styles.deleteButton}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          <div style={styles.winsMessageBox}>
            <p>✨ You've logged <strong>{totalWins}</strong> wins. That's {totalWins} things you showed up for yourself and your family. Be proud. ✨</p>
          </div>
        </div>
      )}

      {/* MINDFULNESS */}
      {activeTab === 'mindfulness' && (
        <div style={styles.tabContent}>
          <h2>Mindfulness & Meditation 🧘‍♀️</h2>
          <p style={styles.subtitle}>Calm your nervous system, even for a moment.</p>

          <div style={styles.sessionsGrid}>
            {mindfulnessSessions.map((session, idx) => (
              <div key={idx} style={styles.sessionCard}>
                <h3>{session.name}</h3>
                <span style={styles.categoryTag}>{session.category}</span>
                <span style={styles.durationTag}>⏱️ {session.duration} min</span>
                
                <div style={styles.scriptPreview}>
                  <p>{session.script}</p>
                </div>

                <button
                  onClick={() => alert(`Starting "${session.name}" - ${session.duration} minutes. Find a quiet spot, sit comfortably, and press play on a timer.`)}
                  style={styles.startButton}
                >
                  Start Session →
                </button>
              </div>
            ))}
          </div>

          <div style={styles.timerBox}>
            <h3>⏱️ Personal Meditation Timer</h3>
            <p style={styles.timerDisplay}>
              {Math.floor(sessionTime / 60)}:{String(sessionTime % 60).padStart(2, '0')}
            </p>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              style={{...styles.timerButton, backgroundColor: isTimerRunning ? '#ef4444' : '#10b981'}}
            >
              {isTimerRunning ? '⏸️ Pause' : '▶️ Start'} Timer
            </button>
            {sessionTime > 0 && (
              <button
                onClick={() => setSessionTime(0)}
                style={styles.resetButton}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      <footer style={styles.footer}>
        <p>💖 Mom's Day - A moment for you, every day.</p>
        <p style={styles.footerSmall}>You are enough. Your effort is enough. Your love is enough. 💕</p>
      </footer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#fdf2f8',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '3px solid #ec4899',
  },
  title: {
    fontSize: '2.5em',
    color: '#be185d',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '1em',
    color: '#666',
    margin: '0',
  },
  nav: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  navButton: {
    padding: '12px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.95em',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  tabContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '30px',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '15px',
    marginTop: '20px',
  },
  statCard: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
    backgroundColor: '#fdf2f8',
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid #fbcfe8',
  },
  statIcon: {
    fontSize: '2em',
  },
  statLabel: {
    margin: '0',
    fontSize: '0.9em',
    color: '#666',
  },
  statValue: {
    margin: '0',
    fontSize: '2em',
    fontWeight: 'bold',
    color: '#be185d',
  },
  affirmationDisplay: {
    backgroundColor: '#fce7f3',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    marginTop: '30px',
    border: '2px solid #f472b6',
  },
  affirmationText: {
    fontSize: '1.3em',
    fontWeight: 'bold',
    color: '#be185d',
    margin: '0 0 15px 0',
    lineHeight: '1.5',
  },
  affirmationButton: {
    padding: '10px 20px',
    backgroundColor: '#ec4899',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  quickAccessGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '15px',
    marginTop: '30px',
  },
  quickAccessCard: {
    backgroundColor: '#fef2f2',
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid #fecaca',
  },
  quickActionButton: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#f43f5e',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  selfCareGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginTop: '20px',
  },
  selfCareCard: {
    backgroundColor: '#fce7f3',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '2px solid #fbcfe8',
  },
  selfCareIcon: {
    fontSize: '2.5em',
    display: 'block',
    marginBottom: '8px',
  },
  timeTag: {
    display: 'inline-block',
    marginTop: '8px',
    padding: '4px 8px',
    backgroundColor: '#ec4899',
    color: 'white',
    borderRadius: '12px',
    fontSize: '0.8em',
  },
  doItButton: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#ec4899',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  tipsBox: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    borderLeft: '4px solid #f59e0b',
  },
  affirmationsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    marginTop: '20px',
  },
  affirmationCard: {
    backgroundColor: '#fce7f3',
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid #fbcfe8',
  },
  practiceBox: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#ecfdf5',
    borderRadius: '8px',
    borderLeft: '4px solid #10b981',
  },
  winForm: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  winInput: {
    flex: 1,
    padding: '12px',
    border: '2px solid #fbcfe8',
    borderRadius: '6px',
    fontSize: '1em',
  },
  addWinButton: {
    padding: '12px 20px',
    backgroundColor: '#ec4899',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  winsList: {
    marginTop: '20px',
  },
  winCard: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    padding: '12px',
    backgroundColor: '#fce7f3',
    borderRadius: '6px',
    marginBottom: '10px',
  },
  winCheckbox: {
    marginTop: '4px',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  winText: {
    flex: 1,
  },
  winDate: {
    fontSize: '0.8em',
    color: '#999',
    display: 'block',
    marginTop: '4px',
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.2em',
    cursor: 'pointer',
    color: '#999',
  },
  emptyState: {
    textAlign: 'center',
    color: '#999',
    padding: '20px',
  },
  winsMessageBox: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#fdf2f8',
    borderRadius: '8px',
    textAlign: 'center',
    border: '2px solid #fbcfe8',
  },
  sessionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '15px',
    marginTop: '20px',
  },
  sessionCard: {
    backgroundColor: '#fce7f3',
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid #fbcfe8',
  },
  categoryTag: {
    display: 'inline-block',
    marginTop: '8px',
    padding: '4px 8px',
    backgroundColor: '#ec4899',
    color: 'white',
    borderRadius: '4px',
    fontSize: '0.8em',
    marginRight: '5px',
  },
  durationTag: {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: '#f472b6',
    color: 'white',
    borderRadius: '4px',
    fontSize: '0.8em',
  },
  scriptPreview: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#white',
    borderRadius: '4px',
    fontSize: '0.9em',
    fontStyle: 'italic',
  },
  startButton: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    backgroundColor: '#ec4899',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  timerBox: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#fce7f3',
    borderRadius: '8px',
    textAlign: 'center',
    border: '2px solid #fbcfe8',
  },
  timerDisplay: {
    fontSize: '3em',
    fontWeight: 'bold',
    color: '#ec4899',
    margin: '10px 0',
    fontFamily: 'monospace',
  },
  timerButton: {
    padding: '12px 20px',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginRight: '10px',
  },
  resetButton: {
    padding: '12px 20px',
    backgroundColor: '#999',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
    borderTop: '1px solid #ddd',
    marginTop: '30px',
  },
  footerSmall: {
    fontSize: '0.9em',
    margin: '8px 0 0 0',
  },
};

export default MomsDayApp;
