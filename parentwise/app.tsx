import React, { useState, useEffect } from 'react';

interface DailyRoutine {
  id: string;
  task: string;
  completed: boolean;
  time?: string;
}

interface MoodEntry {
  date: string;
  mood: number; // 1-5
  energy: number; // 1-5
  notes: string;
}

interface ADHDTip {
  title: string;
  description: string;
  category: string;
}

const ParentWise: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'routine' | 'stress' | 'education' | 'mood' | 'sos'>('routine');
  const [routines, setRoutines] = useState<DailyRoutine[]>([
    { id: '1', task: 'Morning coffee break (5 min)', completed: false, time: '7:00 AM' },
    { id: '2', task: 'Kids breakfast routine', completed: false, time: '7:30 AM' },
    { id: '3', task: 'One deep breath before school run', completed: false, time: '8:00 AM' },
  ]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [currentMood, setCurrentMood] = useState(3);
  const [currentEnergy, setCurrentEnergy] = useState(3);
  const [moodNotes, setMoodNotes] = useState('');

  const adhdTips: ADHDTip[] = [
    { title: 'Time Blindness', description: 'Set phone alarms for transitions. Visual timers help kids and parents!', category: 'Time Management' },
    { title: 'Executive Dysfunction', description: 'Break tasks into 3-5 minute chunks. Celebrate small wins!', category: 'Task Management' },
    { title: 'Emotional Dysregulation', description: 'Create a safe space with sensory items (fidgets, weighted blanket)', category: 'Emotional Support' },
    { title: 'Parallel Play Works', description: 'You don\'t need to entertain constantly. Sit nearby and do your own task.', category: 'Parenting Tips' },
    { title: 'Medication Timing', description: 'Note when medication works best - same time daily works best for many kids', category: 'Medical' },
    { title: 'Reduce Decisions', description: 'Too many choices = overwhelm. Limit to 2 options for kids with ADHD', category: 'Daily Life' },
  ];

  const stressReliefTools = [
    { name: '4-7-8 Breathing', time: '2 min', steps: ['Breathe in for 4', 'Hold for 7', 'Exhale for 8'] },
    { name: 'Progressive Muscle Relax', time: '5 min', steps: ['Tense legs (5s)', 'Release', 'Tense arms (5s)', 'Release', 'Tense face (5s)', 'Release'] },
    { name: 'Body Scan', time: '3 min', steps: ['Close eyes', 'Notice feet → legs → torso → arms', 'Release tension as you notice it'] },
    { name: '5 Senses Check', time: '2 min', steps: ['5 things you see', '4 things you hear', '3 things you touch', '2 things you smell', '1 thing you taste'] },
  ];

  const toggleRoutine = (id: string) => {
    setRoutines(routines.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const addMoodEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: MoodEntry = { date: today, mood: currentMood, energy: currentEnergy, notes: moodNotes };
    setMoodEntries([newEntry, ...moodEntries]);
    setCurrentMood(3);
    setCurrentEnergy(3);
    setMoodNotes('');
  };

  const completedCount = routines.filter(r => r.completed).length;
  const completionPercent = Math.round((completedCount / routines.length) * 100);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>💜 ParentWise</h1>
        <p style={styles.subtitle}>ADHD Support for Parents Raising ADHD Kids</p>
      </header>

      <nav style={styles.nav}>
        {['routine', 'stress', 'education', 'mood', 'sos'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              ...styles.navButton,
              backgroundColor: activeTab === tab ? '#8b5cf6' : '#e9d5ff',
              color: activeTab === tab ? 'white' : '#333',
            }}
          >
            {tab === 'routine' && '📋'} {tab === 'stress' && '🧘'} {tab === 'education' && '📚'}
            {tab === 'mood' && '💭'} {tab === 'sos' && '🆘'} {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* DAILY ROUTINE TAB */}
      {activeTab === 'routine' && (
        <div style={styles.tabContent}>
          <h2>Your Daily Routine</h2>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${completionPercent}%` }} />
          </div>
          <p style={styles.progressText}>{completedCount}/{routines.length} completed ({completionPercent}%)</p>
          
          <div style={styles.list}>
            {routines.map(routine => (
              <div key={routine.id} style={styles.listItem}>
                <input
                  type="checkbox"
                  checked={routine.completed}
                  onChange={() => toggleRoutine(routine.id)}
                  style={styles.checkbox}
                />
                <div style={styles.taskInfo}>
                  <span style={{ textDecoration: routine.completed ? 'line-through' : 'none', opacity: routine.completed ? 0.6 : 1 }}>
                    {routine.task}
                  </span>
                  {routine.time && <span style={styles.time}>{routine.time}</span>}
                </div>
              </div>
            ))}
          </div>
          <button style={styles.addButton}>+ Add Your Own Routine</button>
        </div>
      )}

      {/* STRESS RELIEF TAB */}
      {activeTab === 'stress' && (
        <div style={styles.tabContent}>
          <h2>Quick Stress Relief Tools</h2>
          <p style={styles.subtitle}>Use any time you feel overwhelmed (2-5 minutes)</p>
          
          <div style={styles.toolsGrid}>
            {stressReliefTools.map(tool => (
              <div key={tool.name} style={styles.toolCard}>
                <h3>{tool.name}</h3>
                <span style={styles.timeLabel}>⏱️ {tool.time}</span>
                <ol style={styles.stepsList}>
                  {tool.steps.map((step, idx) => (
                    <li key={idx} style={styles.step}>{step}</li>
                  ))}
                </ol>
                <button style={styles.actionButton}>Start Now →</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDUCATION TAB */}
      {activeTab === 'education' && (
        <div style={styles.tabContent}>
          <h2>Understanding ADHD in Kids</h2>
          <p style={styles.subtitle}>These aren't bad behaviors—they're ADHD symptoms.</p>
          
          <div style={styles.tipsGrid}>
            {adhdTips.map((tip, idx) => (
              <div key={idx} style={styles.tipCard}>
                <h3>{tip.title}</h3>
                <span style={styles.category}>{tip.category}</span>
                <p>{tip.description}</p>
              </div>
            ))}
          </div>

          <div style={styles.resourcesBox}>
            <h3>📖 Trusted Resources</h3>
            <ul style={styles.resourcesList}>
              <li><strong>ADHD Parenting Coach</strong> - Coaching and real strategies</li>
              <li><strong>r/ADHDparenting</strong> - Reddit community support</li>
              <li><strong>Leantime.io</strong> - ADHD-designed project management</li>
              <li><strong>How to ADHD</strong> - YouTube education channel</li>
            </ul>
          </div>
        </div>
      )}

      {/* MOOD TRACKER TAB */}
      {activeTab === 'mood' && (
        <div style={styles.tabContent}>
          <h2>How Are YOU Today?</h2>
          <p style={styles.subtitle}>Tracking your mood helps you notice patterns and self-care needs.</p>
          
          <div style={styles.trackerForm}>
            <div style={styles.sliderGroup}>
              <label>Mood: {['😢', '😞', '😐', '😊', '😄'][currentMood - 1]}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={currentMood}
                onChange={(e) => setCurrentMood(parseInt(e.target.value))}
                style={styles.slider}
              />
            </div>

            <div style={styles.sliderGroup}>
              <label>Energy Level: {['🔋', '🔋🔋', '🔋🔋🔋', '🔋🔋🔋🔋', '⚡⚡⚡⚡'][currentEnergy - 1]}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={currentEnergy}
                onChange={(e) => setCurrentEnergy(parseInt(e.target.value))}
                style={styles.slider}
              />
            </div>

            <textarea
              placeholder="What's on your mind? Any wins today? Struggles?"
              value={moodNotes}
              onChange={(e) => setMoodNotes(e.target.value)}
              style={styles.textarea}
            />

            <button onClick={addMoodEntry} style={styles.submitButton}>Save Entry</button>
          </div>

          {moodEntries.length > 0 && (
            <div style={styles.entriesBox}>
              <h3>Recent Entries</h3>
              {moodEntries.slice(0, 7).map((entry, idx) => (
                <div key={idx} style={styles.entryCard}>
                  <strong>{entry.date}</strong> - Mood: {entry.mood}/5, Energy: {entry.energy}/5
                  {entry.notes && <p style={styles.entryNote}>{entry.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SOS CALM-DOWN KIT TAB */}
      {activeTab === 'sos' && (
        <div style={styles.tabContent}>
          <h2>🆘 Overwhelm SOS Kit</h2>
          <p style={styles.subtitle}>Use this when you're about to lose it.</p>
          
          <div style={styles.sosGrid}>
            <div style={styles.sosCard}>
              <h3>🚀 In 30 Seconds</h3>
              <ul>
                <li>Step away from the situation</li>
                <li>Splash cold water on face</li>
                <li>Do 5 jumping jacks</li>
                <li>Drink water</li>
              </ul>
            </div>

            <div style={styles.sosCard}>
              <h3>☎️ Who Can Help?</h3>
              <ul>
                <li>Call a friend</li>
                <li>Text your partner/spouse</li>
                <li>Reach out to family</li>
                <li>ADHD support group chat</li>
              </ul>
            </div>

            <div style={styles.sosCard}>
              <h3>✋ Pause Plan</h3>
              <ul>
                <li>Pause all demands on yourself</li>
                <li>Screen time is OK right now</li>
                <li>Order takeout instead of cooking</li>
                <li>This moment will pass</li>
              </ul>
            </div>

            <div style={styles.sosCard}>
              <h3>🧸 Sensory Reset</h3>
              <ul>
                <li>Squeeze a stress ball (10s)</li>
                <li>Listen to one song you love</li>
                <li>Hold ice cubes in hands</li>
                <li>Wrap in a blanket</li>
              </ul>
            </div>
          </div>

          <div style={styles.affirmationBox}>
            <p style={styles.affirmation}>
              ✨ <strong>You are doing your best.</strong> ADHD parenting is hard. You are not failing. Your kids are lucky to have you. ✨
            </p>
          </div>
        </div>
      )}

      <footer style={styles.footer}>
        <p>💜 ParentWise - Made with care for parents just like you.</p>
        <p style={styles.footerSmall}>All data stays on your device. No tracking. No ads.</p>
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
    backgroundColor: '#faf5ff',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '3px solid #8b5cf6',
  },
  title: {
    fontSize: '2.5em',
    color: '#7c3aed',
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
  list: {
    marginTop: '20px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    marginBottom: '10px',
    backgroundColor: '#f3f0ff',
    borderRadius: '8px',
    gap: '12px',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  taskInfo: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: '0.85em',
    color: '#999',
    marginLeft: '10px',
  },
  progressBar: {
    width: '100%',
    height: '24px',
    backgroundColor: '#e9d5ff',
    borderRadius: '12px',
    overflow: 'hidden',
    marginTop: '15px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    transition: 'width 0.3s ease',
  },
  progressText: {
    marginTop: '8px',
    fontSize: '0.9em',
    color: '#666',
  },
  addButton: {
    width: '100%',
    padding: '12px',
    marginTop: '20px',
    backgroundColor: '#8b5cf6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  toolsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    marginTop: '20px',
  },
  toolCard: {
    backgroundColor: '#f3f0ff',
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid #ddd5fe',
  },
  timeLabel: {
    display: 'inline-block',
    marginTop: '8px',
    fontSize: '0.9em',
    color: '#8b5cf6',
  },
  stepsList: {
    marginTop: '12px',
    paddingLeft: '20px',
  },
  step: {
    marginBottom: '6px',
    fontSize: '0.95em',
  },
  actionButton: {
    width: '100%',
    padding: '10px',
    marginTop: '12px',
    backgroundColor: '#8b5cf6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  tipsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '15px',
    marginTop: '20px',
  },
  tipCard: {
    backgroundColor: '#fef3c7',
    padding: '15px',
    borderRadius: '8px',
    borderLeft: '4px solid #f59e0b',
  },
  category: {
    display: 'inline-block',
    marginTop: '6px',
    padding: '4px 8px',
    backgroundColor: '#f59e0b',
    color: 'white',
    borderRadius: '4px',
    fontSize: '0.8em',
  },
  resourcesBox: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#ecfdf5',
    borderRadius: '8px',
    borderLeft: '4px solid #10b981',
  },
  resourcesList: {
    marginTop: '12px',
    paddingLeft: '20px',
  },
  trackerForm: {
    backgroundColor: '#f3f0ff',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '20px',
  },
  sliderGroup: {
    marginBottom: '20px',
  },
  slider: {
    width: '100%',
    marginTop: '8px',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontFamily: 'inherit',
    fontSize: '0.95em',
    marginTop: '15px',
    minHeight: '80px',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    marginTop: '15px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  entriesBox: {
    marginTop: '30px',
  },
  entryCard: {
    backgroundColor: '#f3f0ff',
    padding: '12px',
    borderRadius: '6px',
    marginTop: '10px',
  },
  entryNote: {
    marginTop: '6px',
    fontStyle: 'italic',
    color: '#555',
  },
  sosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '15px',
    marginTop: '20px',
  },
  sosCard: {
    backgroundColor: '#fee2e2',
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid #fca5a5',
  },
  affirmationBox: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#fce7f3',
    borderRadius: '8px',
    textAlign: 'center',
    border: '2px solid #fbcfe8',
  },
  affirmation: {
    fontSize: '1.1em',
    color: '#be185d',
    margin: '0',
    lineHeight: '1.6',
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
    borderTop: '1px solid #ddd',
    marginTop: '30px',
  },
  footerSmall: {
    fontSize: '0.85em',
    margin: '8px 0 0 0',
  },
};

export default ParentWise;
