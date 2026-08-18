const { useState, useEffect } = React;

const MomsDayApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [quickWins, setQuickWins] = useState([
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

  const mindfulnessSessions = [
    {
      name: '2-Minute Reset',
      duration: 2,
      category: 'Quick',
      script: 'Close your eyes. Breathe in for 4 counts. Hold for 4. Out for 4. Repeat 5 times. You\'ve got this.',
    },
    {
      name: 'Loving-Kindness for YOU',
      duration: 5,
      category: 'Heart',
      script: 'Place hand on heart. Repeat: "May I be safe. May I be healthy. May I be happy. May I be at peace."',
    },
  ];

  const addQuickWin = () => {
    if (newWin.trim()) {
      const today = new Date().toISOString().split('T')[0];
      setQuickWins([{ id: Date.now().toString(), text: newWin, date: today, completed: false }, ...quickWins]);
      setNewWin('');
    }
  };

  const toggleWin = (id) => {
    setQuickWins(quickWins.map(w => w.id === id ? { ...w, completed: !w.completed } : w));
  };

  const deleteWin = (id) => {
    setQuickWins(quickWins.filter(w => w.id !== id));
  };

  const todaysWins = quickWins.filter(w => w.date === new Date().toISOString().split('T')[0]);
  const totalWins = quickWins.length;

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => setSessionTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const styles = {
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
    winCard: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      padding: '12px',
      backgroundColor: '#fce7f3',
      borderRadius: '6px',
      marginBottom: '10px',
    },
    timerDisplay: {
      fontSize: '3em',
      fontWeight: 'bold',
      color: '#ec4899',
      margin: '10px 0',
      fontFamily: 'monospace',
    },
    footer: {
      textAlign: 'center',
      padding: '20px',
      color: '#666',
      borderTop: '1px solid #ddd',
      marginTop: '30px',
    },
  };

  const getButtonStyle = (isActive) => ({
    ...styles.navButton,
    backgroundColor: isActive ? '#ec4899' : '#fce7f3',
    color: isActive ? 'white' : '#333',
  });

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>💖 Mom's Day</h1>
        <p style={styles.subtitle}>Your Daily Wellness Companion</p>
      </header>

      <nav style={styles.nav}>
        <button onClick={() => setActiveTab('dashboard')} style={getButtonStyle(activeTab === 'dashboard')}>📊 Dashboard</button>
        <button onClick={() => setActiveTab('selfcare')} style={getButtonStyle(activeTab === 'selfcare')}>💅 Self-Care</button>
        <button onClick={() => setActiveTab('affirmations')} style={getButtonStyle(activeTab === 'affirmations')}>✨ Affirmations</button>
        <button onClick={() => setActiveTab('wins')} style={getButtonStyle(activeTab === 'wins')}>🎉 Wins</button>
        <button onClick={() => setActiveTab('mindfulness')} style={getButtonStyle(activeTab === 'mindfulness')}>🧘‍♀️ Mindfulness</button>
      </nav>

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
          </div>
          <div style={styles.affirmationDisplay}>
            <p style={styles.affirmationText}>{affirmations[affirmationIndex]}</p>
            <button onClick={() => setAffirmationIndex((affirmationIndex + 1) % affirmations.length)} style={styles.affirmationButton}>
              Next Affirmation ✨
            </button>
          </div>
        </div>
      )}

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
                <span style={{ display: 'inline-block', marginTop: '8px', padding: '4px 8px', backgroundColor: '#ec4899', color: 'white', borderRadius: '12px', fontSize: '0.8em' }}>{option.time}</span>
                <button style={{ width: '100%', padding: '10px', marginTop: '10px', backgroundColor: '#ec4899', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Do It Now!
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'affirmations' && (
        <div style={styles.tabContent}>
          <h2>Daily Affirmations for Moms</h2>
          <p style={styles.subtitle}>Read these when doubt creeps in.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '20px' }}>
            {affirmations.map((aff, idx) => (
              <div key={idx} style={{ backgroundColor: '#fce7f3', padding: '15px', borderRadius: '8px', border: '2px solid #fbcfe8' }}>
                <p>{aff}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'wins' && (
        <div style={styles.tabContent}>
          <h2>Your Quick Wins 🎉</h2>
          <p style={styles.subtitle}>Celebrate the small victories. They matter!</p>
          <div style={styles.winForm}>
            <input
              type="text"
              placeholder="What did you accomplish today?"
              value={newWin}
              onChange={(e) => setNewWin(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addQuickWin()}
              style={styles.winInput}
            />
            <button onClick={addQuickWin} style={styles.addWinButton}>
              🎉 Add Win
            </button>
          </div>
          <div style={{ marginTop: '20px' }}>
            {quickWins.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No wins yet. Start logging them! 💪</p>
            ) : (
              quickWins.map(win => (
                <div key={win.id} style={styles.winCard}>
                  <input
                    type="checkbox"
                    checked={win.completed}
                    onChange={() => toggleWin(win.id)}
                    style={{ marginTop: '4px', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ opacity: win.completed ? 0.6 : 1, textDecoration: win.completed ? 'line-through' : 'none', margin: '0' }}>
                      {win.text}
                    </p>
                    <span style={{ fontSize: '0.8em', color: '#999', display: 'block', marginTop: '4px' }}>{win.date}</span>
                  </div>
                  <button onClick={() => deleteWin(win.id)} style={{ background: 'none', border: 'none', fontSize: '1.2em', cursor: 'pointer', color: '#999' }}>
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fdf2f8', borderRadius: '8px', textAlign: 'center', border: '2px solid #fbcfe8' }}>
            <p>✨ You've logged <strong>{totalWins}</strong> wins. Be proud. ✨</p>
          </div>
        </div>
      )}

      {activeTab === 'mindfulness' && (
        <div style={styles.tabContent}>
          <h2>Mindfulness & Meditation 🧘‍♀️</h2>
          <p style={styles.subtitle}>Calm your nervous system, even for a moment.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px', marginTop: '20px' }}>
            {mindfulnessSessions.map((session, idx) => (
              <div key={idx} style={{ backgroundColor: '#fce7f3', padding: '15px', borderRadius: '8px', border: '2px solid #fbcfe8' }}>
                <h3>{session.name}</h3>
                <span style={{ display: 'inline-block', marginTop: '8px', padding: '4px 8px', backgroundColor: '#ec4899', color: 'white', borderRadius: '4px', fontSize: '0.8em' }}>
                  {session.category}
                </span>
                <span style={{ display: 'inline-block', marginLeft: '5px', padding: '4px 8px', backgroundColor: '#f472b6', color: 'white', borderRadius: '4px', fontSize: '0.8em' }}>
                  ⏱️ {session.duration} min
                </span>
                <p style={{ marginTop: '10px', fontSize: '0.9em', fontStyle: 'italic' }}>{session.script}</p>
                <button style={{ width: '100%', padding: '10px', marginTop: '10px', backgroundColor: '#ec4899', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Start Session →
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fce7f3', borderRadius: '8px', textAlign: 'center', border: '2px solid #fbcfe8' }}>
            <h3>⏱️ Personal Meditation Timer</h3>
            <p style={styles.timerDisplay}>
              {Math.floor(sessionTime / 60)}:{String(sessionTime % 60).padStart(2, '0')}
            </p>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              style={{ padding: '12px 20px', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px', backgroundColor: isTimerRunning ? '#ef4444' : '#10b981' }}
            >
              {isTimerRunning ? '⏸️ Pause' : '▶️ Start'} Timer
            </button>
            {sessionTime > 0 && (
              <button onClick={() => setSessionTime(0)} style={{ padding: '12px 20px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      <footer style={styles.footer}>
        <p>💖 Mom's Day - A moment for you, every day.</p>
        <p style={{ fontSize: '0.9em', margin: '8px 0 0 0' }}>You are enough. Your effort is enough. Your love is enough. 💕</p>
      </footer>
    </div>
  );
};

ReactDOM.render(<MomsDayApp />, document.getElementById('root'));
