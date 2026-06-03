<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>T. Lott Creative Social Marketing Agent</title>
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',sans-serif;background:#0f0f1a;color:#fff;min-height:100vh;}
  ::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:#1a1a2e;}::-webkit-scrollbar-thumb{background:#e63950;border-radius:3px;}
  .btn{padding:10px 20px;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:14px;transition:all .2s;}
  .btn:hover{transform:translateY(-1px);box-shadow:0 4px 15px rgba(0,0,0,.3);}
  .btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
  .card{background:#1a1a2e;border:1px solid #2d2d44;border-radius:12px;padding:16px;}
  .input{width:100%;padding:10px 14px;background:#0f0f1a;border:1px solid #2d2d44;border-radius:8px;color:#fff;font-size:14px;outline:none;}
  .input:focus{border-color:#e63950;}
  .badge{display:inline-block;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;}
  .tag{font-size:11px;padding:3px 8px;border-radius:12px;background:#2d2d44;color:#aaa;}
  textarea.input{resize:vertical;min-height:80px;}
  .toast{position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:10px;font-weight:600;z-index:9999;animation:slideIn .3s ease;}
  @keyframes slideIn{from{transform:translateX(100px);opacity:0;}to{transform:translateX(0);opacity:1;}}
  .spinner{width:20px;height:20px;border:3px solid #ffffff33;border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;}
  @keyframes spin{to{transform:rotate(360deg);}}
  .tab-btn{padding:8px 16px;border:none;border-bottom:2px solid transparent;background:transparent;color:#888;cursor:pointer;font-size:13px;font-weight:600;transition:all .2s;}
  .tab-btn.active{color:#e63950;border-bottom-color:#e63950;}
  .platform-chip{padding:6px 14px;border-radius:20px;border:2px solid #2d2d44;background:transparent;color:#888;cursor:pointer;font-size:12px;font-weight:600;transition:all .2s;}
  .platform-chip.active{border-color:currentColor;}
  .pin-card{background:#1a1a2e;border:1px solid #2d2d44;border-radius:10px;overflow:hidden;transition:border-color .2s;}
  .pin-card:hover{border-color:#e63950;}
  .progress-bar{height:4px;background:#2d2d44;border-radius:2px;overflow:hidden;}
  .progress-fill{height:100%;background:linear-gradient(90deg,#e63950,#ff6b6b);transition:width .5s ease;}
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
const { useState, useCallback, useEffect, useRef } = React;

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id:0, name:"Sacred Cycles",        cat:"wellness journal",  audience:"women",        link:"https://whop.com/checkout/plan_V75Nu7qlQ3YEM", color:"#9b5de5", emoji:"🌙", tags:["wellness","journal","selfcare"] },
  { id:1, name:"Aminos AI Bot Builder",cat:"AI automation",     audience:"coaches",      link:"https://whop.com/tlott12",                    color:"#00d4aa", emoji:"🤖", tags:["AI","automation","nocode"] },
  { id:2, name:"ARTISY Canva Templates",cat:"design templates", audience:"creators",     link:"https://whop.com/tlott12",                    color:"#f72585", emoji:"🎨", tags:["canva","design","templates"] },
  { id:3, name:"Embroidery Empire",    cat:"embroidery designs",audience:"crafters",     link:"https://whop.com/tlott12",                    color:"#4cc9f0", emoji:"🧵", tags:["embroidery","crafts","digital"] },
  { id:4, name:"TrustLink AI Hub",     cat:"AI platform",       audience:"entrepreneurs",link:"https://whop.com/tlott12",                   color:"#ffd60a", emoji:"🔗", tags:["AI","business","hub"] },
  { id:5, name:"Party Pal Pro",        cat:"party planner",     audience:"parents",      link:"https://whop.com/tlott12",                    color:"#ff6b6b", emoji:"🎉", tags:["party","planning","kids"] },
];

const HOOK_TEMPLATES = [
  "POV: You finally found the {name} that actually works 🔥",
  "Stop scrolling. This {name} changed everything for me 💫",
  "I tried every {cat} out there. Nothing compared to {name} ✨",
  "The {name} secret nobody's talking about in 2026 👀",
  "Why every {audience} needs {name} RIGHT NOW 🚀",
  "This {name} went viral for a reason — here's why 💥",
  "I've been keeping {name} a secret... not anymore 🤫",
  "Boom! {name} just dropped and it's everything 🎯",
  "Real talk: {name} is the only {cat} worth buying 💯",
  "Day 1 vs Day 30 using {name} — the results are wild 🌟",
  "Warning: {name} is HIGHLY addictive ⚠️",
  "If you know, you know: {name} hits different 💎",
  "The algorithm keeps hiding {name} — so I'm telling you 📢",
  "Gatekeeping {name} was wrong of me. You deserve this 🙏",
  "Everything changed when I found {name} ✨",
  "No fluff: {name} is genuinely life-changing for {audience} 💪",
  "They didn't want {audience} to know about {name}... 👁",
  "3 reasons {name} is the best {cat} you'll ever buy 🏆",
  "I spent hours researching {cat} so you don't have to — {name} wins 🥇",
  "The {cat} that has {audience} obsessed in 2026: {name} 🔑",
];

const HASHTAG_MAP = {
  wellness: "#WellnessJournal #SacredCycles #SelfCare #MentalHealth #WellnessWednesday #DailyAffirmations #HolisticHealth #MindBodySoul #WomensWellness #JournalWithMe",
  AI:       "#AITools #ChatbotBuilder #AminosAI #AutomationTools #AIForCreators #NoCode #BusinessAutomation #CreatorEconomy #TechTools2026 #WorkSmarter",
  design:   "#CanvaTemplates #GraphicDesign #ContentCreator #CanvaDesign #BrandingTips #SocialMediaTemplates #DesignerLife #CreativeTools #DigitalMarketing #ContentDesign",
  embroidery:"#EmbroideryDesign #EmbroideryPatterns #HandmadeWithLove #CraftBusiness #DigitalDownload #EmbroideryArt #CraftSupplies #SewingCommunity #MakerLife #CraftEntrepreneur",
  party:    "#PartyPlanning #KidsParty #PartyIdeas #CelebrationIdeas #PartyDecor #EventPlanning #PartyInspiration #FamilyFun #BirthdayParty #PartyTheme",
};

const PLATFORMS = [
  { id:"pinterest", label:"Pinterest", color:"#e60023", emoji:"📌" },
  { id:"instagram", label:"Instagram", color:"#e1306c", emoji:"📸" },
  { id:"tiktok",    label:"TikTok",    color:"#00f2ea", emoji:"🎵" },
  { id:"facebook",  label:"Facebook",  color:"#1877f2", emoji:"👤" },
  { id:"twitter",   label:"X/Twitter", color:"#1da1f2", emoji:"🐦" },
  { id:"bluesky",   label:"Bluesky",   color:"#0085ff", emoji:"🦋" },
  { id:"linkedin",  label:"LinkedIn",  color:"#0077b5", emoji:"💼" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function generateHook(product, templateIndex) {
  const t = HOOK_TEMPLATES[templateIndex % HOOK_TEMPLATES.length];
  return t.replace(/{name}/g, product.name).replace(/{cat}/g, product.cat).replace(/{audience}/g, product.audience);
}
function getHashtags(product) {
  if(product.tags.includes('wellness')) return HASHTAG_MAP.wellness;
  if(product.tags.includes('AI'))       return HASHTAG_MAP.AI;
  if(product.tags.includes('canva'))    return HASHTAG_MAP.design;
  if(product.tags.includes('embroidery')) return HASHTAG_MAP.embroidery;
  if(product.tags.includes('party'))    return HASHTAG_MAP.party;
  return HASHTAG_MAP.wellness;
}
function buildDescription(hook, product) {
  return `${hook}\n\n🛒 Get it now: ${product.link}\n\n${getHashtags(product)}`;
}
function buildCaption(hook, product, platform) {
  const base = `${hook}\n\n🛒 ${product.link}`;
  if(platform === 'twitter') return base.slice(0,280);
  if(platform === 'tiktok')  return `${hook}\n\n${product.link}\n\n${getHashtags(product).split(' ').slice(0,5).join(' ')}`;
  return `${base}\n\n${getHashtags(product)}`;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  if(!msg) return null;
  const bg = type === 'success' ? '#00d4aa' : type === 'error' ? '#e63950' : '#ffd60a';
  return <div className="toast" style={{background:bg,color:'#000'}}>{msg}</div>;
}

function PinCard({ pin, index, selected, onSelect, onCopy }) {
  const p = PRODUCTS.find(x=>x.name===pin.product) || PRODUCTS[0];
  return (
    <div className="pin-card" style={{cursor:'pointer',border:selected?`2px solid ${p.color}`:'1px solid #2d2d44'}}
      onClick={()=>onSelect(index)}>
      <div style={{height:6,background:p.color}}/>
      <div style={{padding:12}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
          <span style={{fontSize:20}}>{p.emoji}</span>
          <div style={{display:'flex',gap:4,alignItems:'center'}}>
            {selected && <span style={{fontSize:10,color:p.color,fontWeight:700}}>✓ SELECTED</span>}
            <button className="btn" style={{padding:'4px 8px',fontSize:11,background:'#2d2d44',color:'#fff'}}
              onClick={e=>{e.stopPropagation();onCopy(pin.hook)}}>Copy</button>
          </div>
        </div>
        <p style={{fontSize:13,fontWeight:600,marginBottom:6,lineHeight:1.4,color:'#fff'}}>{pin.hook}</p>
        <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
          {p.tags.map(t=><span key={t} className="tag">{t}</span>)}
        </div>
        <p style={{fontSize:11,color:'#666',marginTop:8}}>📌 {pin.product}</p>
      </div>
    </div>
  );
}

function App() {
  const [tab, setTab] = useState('generate');
  const [selectedProductIdx, setSelectedProductIdx] = useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['pinterest']);
  const [pins, setPins] = useState([]);
  const [selectedPins, setSelectedPins] = useState([]);
  const [bulkCount, setBulkCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [pinterestToken, setPinterestToken] = useState(localStorage.getItem('ptk')||'');
  const [boardId, setBoardId] = useState(localStorage.getItem('pbid')||'');
  const [imageUrl, setImageUrl] = useState('');
  const [postLog, setPostLog] = useState([]);
  const [progress, setProgress] = useState(0);
  const [customHook, setCustomHook] = useState('');
  const [scheduleQueue, setScheduleQueue] = useState([]);

  const showToast = (msg, type='success', dur=3000) => {
    setToast({msg,type});
    setTimeout(()=>setToast(null), dur);
  };
  const copy = (text) => { navigator.clipboard.writeText(text); showToast('Copied! 📋'); };

  const product = PRODUCTS[selectedProductIdx];

  // Generate hooks
  const generateHooks = useCallback(async (count) => {
    setLoading(true);
    setProgress(0);
    const generated = [];
    const total = Math.min(count, 25);
    for(let i=0;i<total;i++) {
      const hook = generateHook(product, i);
      generated.push({
        hook,
        product: product.name,
        description: buildDescription(hook, product),
        link: product.link,
        emoji: product.emoji,
        color: product.color,
      });
      setProgress(Math.round(((i+1)/total)*100));
      await new Promise(r=>setTimeout(r,30));
    }
    setPins(prev => [...generated, ...prev].slice(0,100));
    setSelectedPins([]);
    setLoading(false);
    showToast(`✅ Generated ${generated.length} hooks for ${product.name}!`);
  }, [product]);

  // Toggle platform
  const togglePlatform = (pid) => {
    setSelectedPlatforms(prev => prev.includes(pid) ? prev.filter(x=>x!==pid) : [...prev,pid]);
  };

  // Toggle pin selection
  const togglePin = (idx) => {
    setSelectedPins(prev => prev.includes(idx) ? prev.filter(x=>x!==idx) : [...prev,idx]);
  };

  // Select all
  const selectAll = () => setSelectedPins(pins.map((_,i)=>i));
  const clearAll = () => setSelectedPins([]);

  // Copy all selected as formatted text
  const copySelected = () => {
    const sel = selectedPins.map(i=>pins[i]);
    const text = sel.map((p,i)=>`--- PIN ${i+1} ---\nHOOK: ${p.hook}\n\nDESCRIPTION:\n${p.description}\n`).join('\n');
    copy(text);
    showToast(`📋 Copied ${sel.length} pins to clipboard!`);
  };

  // Add to schedule
  const addToSchedule = () => {
    const sel = selectedPins.map(i=>({...pins[i], platforms:selectedPlatforms, scheduledAt: new Date(Date.now()+scheduleQueue.length*30*60000).toISOString()}));
    setScheduleQueue(prev=>[...prev,...sel]);
    showToast(`🗓️ ${sel.length} posts added to schedule queue!`);
  };

  // Pinterest publish
  const publishToP = async (pin) => {
    if(!pinterestToken) { showToast('⚠️ Enter Pinterest access token first','error'); return; }
    if(!boardId)        { showToast('⚠️ Enter Pinterest Board ID first','error'); return; }
    if(!imageUrl)       { showToast('⚠️ Enter image URL for this pin','error'); return; }
    setLoading(true);
    try {
      const r = await fetch('/api/publish-pinterest', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          title: pin.hook.slice(0,100),
          description: pin.description.slice(0,500),
          link: pin.link,
          boardId, imageUrl, accessToken: pinterestToken
        })
      });
      const d = await r.json();
      if(d.success) {
        setPostLog(prev=>[{platform:'Pinterest',title:pin.hook.slice(0,50),url:d.url,time:new Date().toLocaleTimeString()},...prev].slice(0,50));
        showToast(`📌 Pin published! ${d.url}`,'success',5000);
      } else {
        showToast(`❌ ${d.error}`,'error',5000);
      }
    } catch(e) { showToast(`❌ ${e.message}`,'error'); }
    setLoading(false);
  };

  // Copy caption for a platform
  const getCaptionForPlatform = (pin, platform) => buildCaption(pin.hook, PRODUCTS.find(p=>p.name===pin.product)||PRODUCTS[0], platform);

  // Save token
  const saveToken = () => {
    localStorage.setItem('ptk', pinterestToken);
    localStorage.setItem('pbid', boardId);
    showToast('✅ Credentials saved!');
  };

  const TABS = ['generate','bulk','schedule','settings','log'];

  return (
    <div style={{maxWidth:900,margin:'0 auto',padding:'16px'}}>
      {/* HEADER */}
      <div style={{textAlign:'center',marginBottom:24,padding:'24px 0'}}>
        <div style={{fontSize:36,marginBottom:8}}>🚀</div>
        <h1 style={{fontSize:22,fontWeight:800,background:'linear-gradient(90deg,#e63950,#f72585,#9b5de5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
          T. Lott Creative Social Agent
        </h1>
        <p style={{color:'#888',fontSize:13,marginTop:4}}>AI-Powered Pinterest Bundle + Bulk Scheduler · 2026 Edition</p>
      </div>

      {/* PRODUCT SELECTOR */}
      <div className="card" style={{marginBottom:16}}>
        <p style={{fontSize:12,color:'#888',marginBottom:10,fontWeight:600}}>SELECT PRODUCT</p>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {PRODUCTS.map((p,i)=>(
            <button key={p.id} className="btn"
              style={{background:i===selectedProductIdx?p.color:'#2d2d44',color:'#fff',fontSize:13,padding:'8px 14px'}}
              onClick={()=>setSelectedProductIdx(i)}>
              {p.emoji} {p.name}
            </button>
          ))}
        </div>
        <div style={{marginTop:12,padding:'10px 14px',background:'#0f0f1a',borderRadius:8,borderLeft:`3px solid ${product.color}`}}>
          <span style={{fontSize:12,color:'#888'}}>🛒 Checkout: </span>
          <a href={product.link} target="_blank" style={{color:product.color,fontSize:12}}>{product.link}</a>
        </div>
      </div>

      {/* PLATFORM SELECTOR */}
      <div className="card" style={{marginBottom:16}}>
        <p style={{fontSize:12,color:'#888',marginBottom:10,fontWeight:600}}>TARGET PLATFORMS</p>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {PLATFORMS.map(pl=>(
            <button key={pl.id} className="platform-chip"
              style={{color:selectedPlatforms.includes(pl.id)?pl.color:'#888',
                      borderColor:selectedPlatforms.includes(pl.id)?pl.color:'#2d2d44'}}
              onClick={()=>togglePlatform(pl.id)}>
              {pl.emoji} {pl.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div style={{display:'flex',borderBottom:'1px solid #2d2d44',marginBottom:16}}>
        {TABS.map(t=>(
          <button key={t} className={`tab-btn${tab===t?' active':''}`} onClick={()=>setTab(t)}>
            {t==='generate'?'✨ Generate':t==='bulk'?'📦 Bulk (25+)':t==='schedule'?`🗓️ Queue (${scheduleQueue.length})`:t==='settings'?'⚙️ Settings':'📋 Log'}
          </button>
        ))}
      </div>

      {/* TAB: GENERATE */}
      {tab==='generate' && (
        <div>
          <div style={{display:'flex',gap:10,marginBottom:16,alignItems:'flex-end'}}>
            <div style={{flex:1}}>
              <label style={{fontSize:11,color:'#888',display:'block',marginBottom:4}}>CUSTOM HOOK (optional)</label>
              <input className="input" placeholder={`Auto: "${generateHook(product,0).slice(0,50)}..."`}
                value={customHook} onChange={e=>setCustomHook(e.target.value)}/>
            </div>
            <button className="btn" style={{background:product.color,color:'#fff',whiteSpace:'nowrap'}}
              disabled={loading} onClick={()=>generateHooks(10)}>
              {loading?<span className="spinner"/>:'⚡ Generate 10'}
            </button>
          </div>

          {loading && (
            <div style={{marginBottom:16}}>
              <div className="progress-bar"><div className="progress-fill" style={{width:`${progress}%`}}/></div>
              <p style={{fontSize:11,color:'#888',marginTop:4,textAlign:'center'}}>Generating... {progress}%</p>
            </div>
          )}

          {pins.length > 0 && (
            <>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                <p style={{fontSize:12,color:'#888'}}><b style={{color:'#fff'}}>{pins.length}</b> hooks · <b style={{color:product.color}}>{selectedPins.length}</b> selected</p>
                <div style={{display:'flex',gap:8}}>
                  <button className="btn" style={{background:'#2d2d44',color:'#aaa',padding:'6px 12px',fontSize:12}} onClick={selectAll}>Select All</button>
                  <button className="btn" style={{background:'#2d2d44',color:'#aaa',padding:'6px 12px',fontSize:12}} onClick={clearAll}>Clear</button>
                  {selectedPins.length>0 && <>
                    <button className="btn" style={{background:'#2d2d44',color:'#00d4aa',padding:'6px 12px',fontSize:12}} onClick={copySelected}>📋 Copy</button>
                    <button className="btn" style={{background:'#9b5de5',color:'#fff',padding:'6px 12px',fontSize:12}} onClick={addToSchedule}>🗓️ Schedule</button>
                  </>}
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:12}}>
                {pins.map((pin,i)=>(
                  <PinCard key={i} pin={pin} index={i} selected={selectedPins.includes(i)}
                    onSelect={togglePin} onCopy={copy}/>
                ))}
              </div>
            </>
          )}

          {pins.length===0 && !loading && (
            <div style={{textAlign:'center',padding:'48px 0',color:'#444'}}>
              <div style={{fontSize:48,marginBottom:12}}>✨</div>
              <p>Hit <b style={{color:product.color}}>⚡ Generate 10</b> to create viral hooks</p>
            </div>
          )}
        </div>
      )}

      {/* TAB: BULK */}
      {tab==='bulk' && (
        <div>
          <div className="card" style={{marginBottom:16}}>
            <h3 style={{marginBottom:12,fontSize:15}}>📦 Bulk Generate (up to 25 pins)</h3>
            <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
              <div>
                <label style={{fontSize:11,color:'#888',display:'block',marginBottom:4}}>COUNT</label>
                <select className="input" style={{width:100}} value={bulkCount} onChange={e=>setBulkCount(+e.target.value)}>
                  {[5,10,15,20,25].map(n=><option key={n} value={n}>{n} pins</option>)}
                </select>
              </div>
              <div style={{flex:1}}>
                <label style={{fontSize:11,color:'#888',display:'block',marginBottom:4}}>PRODUCT</label>
                <select className="input" value={selectedProductIdx} onChange={e=>setSelectedProductIdx(+e.target.value)}>
                  {PRODUCTS.map(p=><option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}
                </select>
              </div>
              <button className="btn" style={{background:product.color,color:'#fff',marginTop:16}}
                disabled={loading} onClick={()=>generateHooks(bulkCount)}>
                {loading?<><span className="spinner"/> Generating...</>:`🚀 Generate ${bulkCount} Pins`}
              </button>
            </div>
          </div>

          {loading && (
            <div className="card" style={{marginBottom:16}}>
              <div className="progress-bar" style={{marginBottom:8}}><div className="progress-fill" style={{width:`${progress}%`}}/></div>
              <p style={{fontSize:13,color:'#888',textAlign:'center'}}>⚡ Generating {bulkCount} hooks... {progress}%</p>
            </div>
          )}

          {pins.length > 0 && (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                <p style={{color:'#888',fontSize:13}}><b style={{color:'#fff'}}>{pins.length}</b> pins ready</p>
                <div style={{display:'flex',gap:8}}>
                  <button className="btn" style={{background:'#2d2d44',color:'#aaa',fontSize:12}} onClick={selectAll}>Select All</button>
                  <button className="btn" style={{background:'#00d4aa',color:'#000',fontSize:12}} onClick={copySelected}>📋 Copy All</button>
                  <button className="btn" style={{background:'#9b5de5',color:'#fff',fontSize:12}} onClick={()=>{selectAll();addToSchedule();}}>🗓️ Schedule All</button>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:10,maxHeight:500,overflowY:'auto'}}>
                {pins.map((pin,i)=>(
                  <PinCard key={i} pin={pin} index={i} selected={selectedPins.includes(i)}
                    onSelect={togglePin} onCopy={copy}/>
                ))}
              </div>

              {/* Platform-specific preview */}
              {selectedPins.length===1 && (
                <div className="card" style={{marginTop:16}}>
                  <h4 style={{marginBottom:12,fontSize:14}}>📄 Caption Preview — {PLATFORMS.find(p=>p.id===selectedPlatforms[0])?.label || 'All Platforms'}</h4>
                  {selectedPlatforms.map(pid => {
                    const pl = PLATFORMS.find(p=>p.id===pid);
                    const caption = getCaptionForPlatform(pins[selectedPins[0]], pid);
                    return (
                      <div key={pid} style={{marginBottom:12,padding:10,background:'#0f0f1a',borderRadius:8,borderLeft:`3px solid ${pl.color}`}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                          <span style={{fontSize:12,color:pl.color,fontWeight:700}}>{pl.emoji} {pl.label}</span>
                          <button className="btn" style={{padding:'3px 8px',fontSize:11,background:'#2d2d44',color:'#fff'}} onClick={()=>copy(caption)}>Copy</button>
                        </div>
                        <p style={{fontSize:12,color:'#ccc',lineHeight:1.5,whiteSpace:'pre-wrap'}}>{caption}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB: SCHEDULE */}
      {tab==='schedule' && (
        <div>
          <div className="card" style={{marginBottom:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h3 style={{fontSize:15}}>🗓️ Schedule Queue ({scheduleQueue.length} posts)</h3>
              {scheduleQueue.length>0 && (
                <button className="btn" style={{background:'#e63950',color:'#fff',fontSize:12}}
                  onClick={()=>setScheduleQueue([])}>Clear Queue</button>
              )}
            </div>
          </div>
          {scheduleQueue.length===0 ? (
            <div style={{textAlign:'center',padding:'48px 0',color:'#444'}}>
              <div style={{fontSize:48,marginBottom:12}}>🗓️</div>
              <p>Queue is empty — generate pins and hit <b style={{color:'#9b5de5'}}>🗓️ Schedule</b></p>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {scheduleQueue.map((item,i)=>{
                const p = PRODUCTS.find(x=>x.name===item.product)||PRODUCTS[0];
                return (
                  <div key={i} className="card" style={{borderLeft:`3px solid ${p.color}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <p style={{fontSize:13,fontWeight:600,marginBottom:4}}>{p.emoji} {item.hook?.slice(0,70)}...</p>
                      <div style={{display:'flex',gap:6,alignItems:'center'}}>
                        {item.platforms?.map(pid=>{ const pl=PLATFORMS.find(x=>x.id===pid); return pl?<span key={pid} style={{fontSize:11,color:pl.color}}>{pl.emoji}</span>:null; })}
                        <span style={{fontSize:11,color:'#666'}}>· {new Date(item.scheduledAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <button className="btn" style={{padding:'4px 10px',fontSize:11,background:'#e63950',color:'#fff'}}
                      onClick={()=>setScheduleQueue(q=>q.filter((_,j)=>j!==i))}>Remove</button>
                  </div>
                );
              })}
              <div className="card" style={{background:'#0f0f1a',padding:12}}>
                <p style={{fontSize:12,color:'#888'}}>💡 <b style={{color:'#fff'}}>To post:</b> Copy captions → paste into <a href="https://app.onlysocial.io" target="_blank" style={{color:'#00d4aa'}}>OnlySocial</a> bulk scheduler or use Pinterest direct publish below.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: SETTINGS (Pinterest API) */}
      {tab==='settings' && (
        <div>
          <div className="card" style={{marginBottom:16}}>
            <h3 style={{fontSize:15,marginBottom:14}}>📌 Pinterest v5 Direct Publish</h3>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <div>
                <label style={{fontSize:11,color:'#888',display:'block',marginBottom:4}}>PINTEREST ACCESS TOKEN</label>
                <input className="input" type="password" placeholder="paste Pinterest OAuth2 access token here"
                  value={pinterestToken} onChange={e=>setPinterestToken(e.target.value)}/>
                <p style={{fontSize:11,color:'#666',marginTop:4}}>Get from: <a href="https://developers.pinterest.com" target="_blank" style={{color:'#e60023'}}>developers.pinterest.com</a> → Your App → Access Token</p>
              </div>
              <div>
                <label style={{fontSize:11,color:'#888',display:'block',marginBottom:4}}>BOARD ID</label>
                <input className="input" placeholder="e.g. 012345678901234567"
                  value={boardId} onChange={e=>setBoardId(e.target.value)}/>
                <p style={{fontSize:11,color:'#666',marginTop:4}}>Find in Pinterest board URL: pinterest.com/username/<b>board-name</b></p>
              </div>
              <div>
                <label style={{fontSize:11,color:'#888',display:'block',marginBottom:4}}>IMAGE URL FOR NEXT PIN</label>
                <input className="input" placeholder="https://shop.artistrystore.com/bogo-pins/pin1.png"
                  value={imageUrl} onChange={e=>setImageUrl(e.target.value)}/>
                <p style={{fontSize:11,color:'#666',marginTop:4}}>Use GitHub Pages public URLs for images</p>
              </div>
              <button className="btn" style={{background:'#e60023',color:'#fff',width:'fit-content'}} onClick={saveToken}>
                💾 Save Credentials
              </button>
            </div>
          </div>

          {pins.length > 0 && selectedPins.length > 0 && (
            <div className="card">
              <h4 style={{marginBottom:12,fontSize:14}}>📌 Publish Selected Pin to Pinterest</h4>
              <div style={{marginBottom:12,padding:10,background:'#0f0f1a',borderRadius:8}}>
                <p style={{fontSize:13,color:'#ccc'}}>{pins[selectedPins[0]]?.hook}</p>
              </div>
              <button className="btn" style={{background:'#e60023',color:'#fff'}} disabled={loading}
                onClick={()=>publishToP(pins[selectedPins[0]])}>
                {loading?<><span className="spinner"/> Publishing...</>:'📌 Publish to Pinterest'}
              </button>
            </div>
          )}

          <div className="card" style={{marginTop:16,background:'#0f0f1a'}}>
            <h4 style={{fontSize:13,marginBottom:10,color:'#888'}}>⚡ QUICK POSTING GUIDES</h4>
            {[
              {platform:'Pinterest',color:'#e60023',method:'Direct Publish tab above (requires token) OR push to gh-pages → OnlySocial browser'},
              {platform:'Instagram',color:'#e1306c',method:'OnlySocial browser → Create Post → select account tlott12songs2026'},
              {platform:'TikTok',color:'#00f2ea',method:'OnlySocial browser → Create Post → Educational Treasures AI'},
              {platform:'Bluesky',color:'#0085ff',method:'OnlySocial browser (account ID 75557)'},
              {platform:'LinkedIn',color:'#0077b5',method:'OnlySocial browser (account ID 22626)'},
              {platform:'X/Twitter',color:'#1da1f2',method:'Chrome browser automation (computer tool) at twitter.com/@Ziggylott1'},
              {platform:'Facebook',color:'#1877f2',method:'OnlySocial browser (account Tlott12)'},
            ].map(g=>(
              <div key={g.platform} style={{marginBottom:8,paddingBottom:8,borderBottom:'1px solid #2d2d44',display:'flex',gap:10}}>
                <span style={{color:g.color,fontSize:13,minWidth:80,fontWeight:600}}>{g.platform}</span>
                <span style={{fontSize:12,color:'#888'}}>{g.method}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: LOG */}
      {tab==='log' && (
        <div>
          {postLog.length===0 ? (
            <div style={{textAlign:'center',padding:'48px 0',color:'#444'}}>
              <div style={{fontSize:48,marginBottom:12}}>📋</div>
              <p>No posts yet — publish pins to see the log here</p>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {postLog.map((entry,i)=>(
                <div key={i} className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <p style={{fontSize:13,fontWeight:600,color:'#00d4aa'}}>✅ {entry.platform}</p>
                    <p style={{fontSize:12,color:'#888'}}>{entry.title}</p>
                    {entry.url && <a href={entry.url} target="_blank" style={{fontSize:11,color:'#9b5de5'}}>{entry.url}</a>}
                  </div>
                  <span style={{fontSize:11,color:'#555'}}>{entry.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TOAST */}
      {toast && <Toast msg={toast.msg} type={toast.type}/>}

      {/* FOOTER */}
      <div style={{textAlign:'center',marginTop:32,padding:'16px 0',borderTop:'1px solid #2d2d44'}}>
        <p style={{fontSize:11,color:'#444'}}>T. Lott Creative Social Agent · Powered by Tasklet · Zero ongoing cost 🚀</p>
        <p style={{fontSize:11,color:'#333',marginTop:4}}>Store: <a href="https://whop.com/tlott12" target="_blank" style={{color:'#666'}}>whop.com/tlott12</a></p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
</script>
</body>
</html>
