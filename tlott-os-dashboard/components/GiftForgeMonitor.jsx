import React, { useState } from 'react';

const occasions = [
  { emoji: '🎄', name: 'Christmas', date: 'Dec 25', days: Math.ceil((new Date('2026-12-25') - new Date()) / 86400000) },
  { emoji: '🎂', name: 'Birthday', date: 'Ongoing', days: 0 },
  { emoji: '💕', name: "Valentine's", date: 'Feb 14', days: Math.ceil((new Date('2027-02-14') - new Date()) / 86400000) },
  { emoji: '🌸', name: "Mother's Day", date: 'May 11', days: Math.ceil((new Date('2026-05-11') - new Date()) / 86400000) },
  { emoji: '👔', name: "Father's Day", date: 'Jun 15', days: Math.ceil((new Date('2026-06-15') - new Date()) / 86400000) },
  { emoji: '🎃', name: 'Halloween', date: 'Oct 31', days: Math.ceil((new Date('2026-10-31') - new Date()) / 86400000) },
  { emoji: '🦃', name: 'Thanksgiving', date: 'Nov 26', days: Math.ceil((new Date('2026-11-26') - new Date()) / 86400000) },
  { emoji: '🎓', name: 'Graduation', date: 'May-Jun', days: Math.ceil((new Date('2026-06-01') - new Date()) / 86400000) },
  { emoji: '❤️', name: 'Get Well', date: 'Ongoing', days: 0 },
  { emoji: '👶', name: 'Baby Shower', date: 'Ongoing', days: 0 },
];

const ideas = [
  { occasion: "Mother's Day 🌸", idea: "Funny Mom Quote Art Print", type: "Art", urgency: "🔥 NOW" },
  { occasion: "Birthday 🎂", idea: "Hilarious Age Survival Guide eBook", type: "eBook", urgency: "🔥 Always" },
  { occasion: "Graduation 🎓", idea: "\"You Did It!\" Funny Diploma Art Pack", type: "Art", urgency: "⚡ 3 Weeks" },
  { occasion: "Father's Day 👔", idea: "Dad Jokes Collection Printable", type: "eBook", urgency: "⚡ 5 Weeks" },
  { occasion: "Get Well ❤️", idea: "Funny Feel Better Coloring Pages", type: "Art", urgency: "🔥 Always" },
  { occasion: "Christmas 🎄", idea: "Holiday Humor Digital Card Pack", type: "Cards", urgency: "📅 7 Months" },
];

const tools = [
  { name: "Etsy Best Sellers", url: "https://www.etsy.com/search?q=funny+gift+digital&order=most_relevant", color: "btn-warning" },
  { name: "WriteSeed", url: "https://writeseed.com", color: "btn-success" },
  { name: "ImageFX", url: "https://labs.google/fx/tools/image-fx", color: "btn-info" },
  { name: "Designrr", url: "https://app.designrr.io/dashboard/", color: "btn-primary" },
  { name: "Speechelo", url: "https://app.blasteronline.com/speechelo/", color: "btn-secondary" },
  { name: "Whop Dashboard", url: "https://whop.com/dashboard/biz_1KWUuHVLv8X1oA/products/", color: "btn-accent" },
];

export default function GiftForgeMonitor() {
  const [pipeline, setPipeline] = useState([
    { id: 1, title: "Funny Mom Quote Art Print", occasion: "Mother's Day", status: "idea", type: "Art" },
    { id: 2, title: "Birthday Survival Guide eBook", occasion: "Birthday", status: "idea", type: "eBook" },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newOccasion, setNewOccasion] = useState('Birthday');
  const [newType, setNewType] = useState('eBook');

  const statusColors = { idea: 'badge-ghost', creating: 'badge-warning', ready: 'badge-info', published: 'badge-success' };
  const statusLabels = { idea: '💡 Idea', creating: '🛠️ Creating', ready: '✅ Ready', published: '🚀 Published' };

  const nextStatus = { idea: 'creating', creating: 'ready', ready: 'published', published: 'published' };

  const advance = (id) => setPipeline(p => p.map(item => item.id === id ? { ...item, status: nextStatus[item.status] } : item));
  const remove = (id) => setPipeline(p => p.filter(item => item.id !== id));
  const addProduct = () => {
    if (!newTitle.trim()) return;
    setPipeline(p => [...p, { id: Date.now(), title: newTitle, occasion: newOccasion, type: newType, status: 'idea' }]);
    setNewTitle(''); setShowAdd(false);
  };

  const counts = { idea: 0, creating: 0, ready: 0, published: 0 };
  pipeline.forEach(p => counts[p.status]++);

  // Sort occasions by urgency (soonest first, ongoing at bottom)
  const sorted = [...occasions].sort((a, b) => {
    if (a.days === 0 && b.days === 0) return 0;
    if (a.days === 0) return 1;
    if (b.days === 0) return -1;
    return a.days - b.days;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">🎁</span>
        <div>
          <h2 className="text-2xl font-bold text-white">GiftForge AI Employee</h2>
          <p className="text-sm opacity-60">Art + Humor Gift Products • Holiday & Occasion Focused</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(counts).map(([status, count]) => (
          <div key={status} className="bg-base-200 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-white">{count}</div>
            <div className="text-xs opacity-60">{statusLabels[status]}</div>
          </div>
        ))}
      </div>

      {/* Upcoming Occasions */}
      <div className="bg-base-200 rounded-xl p-4">
        <h3 className="font-bold text-white mb-3">📅 Upcoming Gift Occasions</h3>
        <div className="grid grid-cols-2 gap-2">
          {sorted.map((o, i) => (
            <div key={i} className="flex items-center justify-between bg-base-300 rounded-lg px-3 py-2">
              <span className="text-sm">{o.emoji} {o.name}</span>
              <span className={`text-xs font-bold ${o.days > 0 && o.days <= 30 ? 'text-red-400' : o.days > 0 && o.days <= 90 ? 'text-yellow-400' : 'text-green-400'}`}>
                {o.days > 0 ? `${o.days}d` : '🔄'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hot Ideas */}
      <div className="bg-base-200 rounded-xl p-4">
        <h3 className="font-bold text-white mb-3">🔥 Hot Ideas Right Now</h3>
        <div className="space-y-2">
          {ideas.map((idea, i) => (
            <div key={i} className="flex items-center justify-between bg-base-300 rounded-lg px-3 py-2">
              <div>
                <div className="text-sm text-white font-medium">{idea.idea}</div>
                <div className="text-xs opacity-50">{idea.occasion} • {idea.type}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">{idea.urgency}</span>
                <button
                  onClick={() => setPipeline(p => [...p, { id: Date.now(), title: idea.idea, occasion: idea.occasion.split(' ')[0], type: idea.type, status: 'idea' }])}
                  className="btn btn-xs btn-primary"
                >+ Add</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline */}
      <div className="bg-base-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-white">📦 Product Pipeline</h3>
          <button onClick={() => setShowAdd(!showAdd)} className="btn btn-xs btn-primary">+ New Product</button>
        </div>

        {showAdd && (
          <div className="bg-base-300 rounded-lg p-3 mb-3 space-y-2">
            <input
              className="input input-sm input-bordered w-full bg-base-100 text-white"
              placeholder="Product title..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <div className="flex gap-2">
              <select className="select select-sm select-bordered bg-base-100 text-white flex-1" value={newOccasion} onChange={e => setNewOccasion(e.target.value)}>
                {occasions.map(o => <option key={o.name}>{o.name}</option>)}
              </select>
              <select className="select select-sm select-bordered bg-base-100 text-white flex-1" value={newType} onChange={e => setNewType(e.target.value)}>
                {['eBook','Art Print','Card Pack','Coloring Pages','Audiobook','Quote Pack','Journal'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={addProduct} className="btn btn-sm btn-success flex-1">Add to Pipeline</button>
              <button onClick={() => setShowAdd(false)} className="btn btn-sm btn-ghost flex-1">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {pipeline.length === 0 && <p className="text-center opacity-40 py-4">No products yet — add one above!</p>}
          {pipeline.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-base-300 rounded-lg px-3 py-2">
              <div>
                <div className="text-sm text-white font-medium">{item.title}</div>
                <div className="text-xs opacity-50">{item.occasion} • {item.type}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge badge-sm ${statusColors[item.status]}`}>{statusLabels[item.status]}</span>
                {item.status !== 'published' && (
                  <button onClick={() => advance(item.id)} className="btn btn-xs btn-outline btn-success">→</button>
                )}
                <button onClick={() => remove(item.id)} className="btn btn-xs btn-outline btn-error">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Free Tools */}
      <div className="bg-base-200 rounded-xl p-4">
        <h3 className="font-bold text-white mb-3">🛠️ Your Free Creation Tools</h3>
        <div className="flex flex-wrap gap-2">
          {tools.map((t, i) => (
            <a key={i} href={t.url} target="_blank" rel="noreferrer" className={`btn btn-sm ${t.color}`}>{t.name}</a>
          ))}
        </div>
      </div>

      {/* WriteSeed Prompt Generator */}
      <div className="bg-base-200 rounded-xl p-4">
        <h3 className="font-bold text-white mb-3">✍️ Quick WriteSeed Prompt</h3>
        <p className="text-xs opacity-60 mb-3">Copy this into WriteSeed to generate your next product:</p>
        <div className="bg-base-300 rounded-lg p-3 text-sm text-green-300 font-mono">
          Write a funny, warm, and heartfelt digital gift product for [OCCASION]. Include humor that makes people laugh out loud but also feel loved. Format: [PRODUCT TYPE]. Target audience: adults buying gifts for someone they care about. Tone: playful, witty, uplifting. Include a memorable title, subtitle, and 5-7 core sections.
        </div>
        <p className="text-xs opacity-40 mt-2">Replace [OCCASION] and [PRODUCT TYPE] with your target</p>
      </div>
    </div>
  );
}
