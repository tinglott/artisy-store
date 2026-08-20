import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Copy, Check, RefreshCw, Clock, PenLine, Wand2 } from "lucide-react";

const MODEL   = "grok-3-latest";

const BRAND = `
ABOUT THE CREATOR — Ting Lott / T. Lott Creative:
- Psychiatric/Behavioral Health RN (13 yrs), Elementary Teacher (5 yrs), Ordained Minister (2 yrs)
- Core truth: "I sat with people at rock bottom at 3AM — I know the way back."
- Products: Digital books, audiobooks, coloring books, wellness guides (tlott12.gumroad.com)
- Store: shop.artistrystore.com | Mascot: Lottie the owl 🦉 | Faceless creator
Write in her voice: wise, warm, rooted in lived experience. Never generic or corporate.
`;

interface Field { id: string; label: string; placeholder: string; type: "text"|"textarea"|"select"; options?: string[] }
interface Mode  { id: string; emoji: string; label: string; desc: string; prompt: string; fields: Field[] }
interface Toast { id: number; msg: string; kind: "ok"|"err" }
interface HistRow { id: number; mode_label: string; snippet: string; full_text: string; created_at: string }

const MODES: Mode[] = [
  {
    id:"hook", emoji:"🪝", label:"Hook Generator", desc:"Scroll-stopping openers for social",
    prompt:`You are ARIA, Ting Lott's AI writer. Generate 5 powerful scroll-stopping hooks — each under 15 words, impossible to ignore. Numbered list only. ${BRAND}`,
    fields:[
      {id:"topic",   label:"Topic or Book Title",  placeholder:"e.g. Stress Less, anxiety, healing", type:"text"},
      {id:"platform",label:"Platform",              placeholder:"", type:"select", options:["TikTok","Instagram","Bluesky","Pinterest","Email Subject Line"]},
    ]
  },
  {
    id:"product", emoji:"📝", label:"Product Description", desc:"Gumroad descriptions that convert",
    prompt:`You are ARIA, Ting Lott's AI writer. Write a compelling product description: lead with transformation, use emotional resonance, close with a strong CTA. Voice: wise nurse-teacher-minister who's seen people at their lowest. ${BRAND}`,
    fields:[
      {id:"title",   label:"Product Title",              placeholder:"e.g. Sacred Cycles",                    type:"text"},
      {id:"ptype",   label:"Product Type",               placeholder:"",                                      type:"select", options:["Audiobook","eBook","Coloring Book","Wellness Guide","Romance Novel","Children's Book","Finance Guide"]},
      {id:"benefit", label:"Key Transformation/Benefit", placeholder:"e.g. releases anxiety, restores peace", type:"text"},
    ]
  },
  {
    id:"email", emoji:"📧", label:"Email Copy", desc:"Welcome, nurture & sales emails",
    prompt:`You are ARIA, Ting Lott's AI writer. Write an email that feels like a letter from a wise caring friend. Include: Subject Line | Preview Text | Body. Not a sales pitch — a soul-to-soul message. ${BRAND}`,
    fields:[
      {id:"etype",  label:"Email Type",          placeholder:"",                               type:"select", options:["Welcome Email","Day 3 Nurture","Value/Story Email","Soft Pitch","Direct Sales","Re-engagement","Thank You"]},
      {id:"product",label:"Product or Topic",    placeholder:"e.g. Sacred Cycles audiobook",  type:"text"},
      {id:"pain",   label:"Reader's Pain Point", placeholder:"e.g. overwhelmed, anxious, burnout", type:"text"},
    ]
  },
  {
    id:"ad", emoji:"📣", label:"Ad Copy", desc:"Paid ads for Facebook, Pinterest & TikTok",
    prompt:`You are ARIA, a paid ad copywriter. Write 3 ad variations (Short / Medium / Long). Each: [Headline] | [Body] | [CTA]. Lead with pain → hope → urgency. Match the platform tone. ${BRAND}`,
    fields:[
      {id:"product",  label:"Product",         placeholder:"e.g. Stress Less audiobook ($17.99)",       type:"text"},
      {id:"platform", label:"Ad Platform",     placeholder:"",                                           type:"select", options:["Facebook/Instagram","Pinterest","TikTok Spark Ad","Google Display"]},
      {id:"audience", label:"Target Audience", placeholder:"e.g. women 30-55 struggling with stress",   type:"text"},
    ]
  },
  {
    id:"caption", emoji:"📱", label:"Social Caption", desc:"Captions with hashtags for every platform",
    prompt:`You are ARIA, Ting Lott's social writer. Write 3 caption variations matching the platform's native tone and culture. Include relevant hashtags at the end of each. ${BRAND}`,
    fields:[
      {id:"platform",label:"Platform",       placeholder:"",                               type:"select", options:["Instagram","TikTok","Bluesky","Facebook","Pinterest"]},
      {id:"topic",   label:"Post Content",   placeholder:"What is this post about?",       type:"textarea"},
      {id:"cta",     label:"Call to Action", placeholder:"e.g. link in bio, comment below", type:"text"},
    ]
  },
  {
    id:"blurb", emoji:"📖", label:"Book Blurb", desc:"Back-cover descriptions that sell",
    prompt:`You are ARIA, a book marketing specialist. Write a compelling back-cover blurb: hook → journey → irresistible closing question/statement. 150–200 words. No spoilers. No clichés. ${BRAND}`,
    fields:[
      {id:"title",   label:"Book Title",             placeholder:"e.g. Finding Calm",                    type:"text"},
      {id:"genre",   label:"Genre",                  placeholder:"",                                     type:"select", options:["Self-Help/Wellness","Fiction/Romance","Fantasy/Paranormal","Thriller/Suspense","Children's","Spiritual/Faith","Finance/Business"]},
      {id:"summary", label:"Brief Plot / Journey",   placeholder:"What's the story or transformation?",  type:"textarea"},
    ]
  },
  {
    id:"cta", emoji:"🎯", label:"CTA Copy", desc:"Button text, banners & urgency lines",
    prompt:`You are ARIA. Write 10 punchy CTAs (under 8 words each) — styles: urgent, value, curiosity, transformation, community. Then write 3 longer banner CTAs (1–2 sentences each). ${BRAND}`,
    fields:[
      {id:"action",  label:"Desired Action",   placeholder:"e.g. buy audiobook, download free chapter", type:"text"},
      {id:"offer",   label:"Product / Offer",  placeholder:"e.g. Sacred Cycles — $37",                  type:"text"},
      {id:"urgency", label:"Urgency / Bonus",  placeholder:"e.g. limited time, bonus coloring book",     type:"text"},
    ]
  },
  {
    id:"script", emoji:"🎙️", label:"Narration Script", desc:"TTS-ready scripts for videos & audiobooks",
    prompt:`You are ARIA, a scriptwriter for audio content. Write a narration script optimized for edge-tts: short sentences, ellipses for pauses, vivid sensory language, [pause] markers. Cinematic and emotionally resonant. ${BRAND}`,
    fields:[
      {id:"stype", label:"Script Type",    placeholder:"", type:"select", options:["Sleep Story Intro","Book Teaser (60s)","Wellness Teaching","Product Reel (30s)","YouTube Intro","Guided Meditation","Affirmation Set"]},
      {id:"topic", label:"Topic / Product",placeholder:"e.g. Finding Calm audiobook",  type:"text"},
      {id:"etone", label:"Emotional Tone", placeholder:"", type:"select", options:["Soothing & Calming","Inspiring & Uplifting","Wise & Authoritative","Warm & Nurturing","Dramatic & Cinematic","Spiritual & Sacred"]},
    ]
  },
  {
    id:"book", emoji:"📚", label:"Full Book Writing", desc:"Complete manuscripts with chapters, structure & appendices",
    prompt:`You are ARIA, Ting Lott's book writing genius. You write complete, publishable manuscripts using Ting's voice: wise, grounded in real experience, rooted in her backgrounds (psychiatric nurse, teacher, minister). Every chapter is standalone AND builds the arc. Every chapter ends with a concrete tool or worksheet. No fluff, no filler — every sentence earns its place. Structure: Title page → TOC → Introduction → All chapters → Appendices. ${BRAND}`,
    fields:[
      {id:"btitle",   label:"Book Title",            placeholder:"e.g. The Implementation Gap",                       type:"text"},
      {id:"bgenre",   label:"Genre/Category",        placeholder:"",                                                   type:"select", options:["Self-Help/Wellness","Behavioral Health","Psychology","Business/Leadership","Finance","Spirituality/Faith","Parenting","Fitness/Health"]},
      {id:"bthesis",  label:"Core Thesis/Main Idea", placeholder:"What's the big idea? (2-3 sentences)",               type:"textarea"},
      {id:"bchaps",   label:"Chapter Titles (one per line) or '# of chapters'", placeholder:"Ch 1: Title\nCh 2: Title\nOR just: 15 (for 15 chapters)", type:"textarea"},
      {id:"btarget",  label:"Target Word Count",     placeholder:"",                                                   type:"select", options:["20,000","30,000","40,000","50,000","60,000","70,000","80,000","100,000"]},
    ]
  },
];

const TONES   = ["warm","bold","spiritual","playful","professional"];
const LENGTHS = ["short","medium","long"];

const TONE_MAP:   Record<string,string> = { warm:"warm, caring, nurturing", bold:"bold, direct, powerful", spiritual:"spiritual, faith-rooted, uplifting", playful:"playful, witty, fun", professional:"professional, authoritative, clear" };
const LENGTH_MAP: Record<string,string> = { short:"Keep it concise and punchy.", medium:"Standard length — thorough but not verbose.", long:"Comprehensive and detailed." };

const ARIAWriter: React.FC = () => {
  const [mode,    setMode]    = useState<Mode>(MODES[0]);
  const [vals,    setVals]    = useState<Record<string,string>>({});
  const [tone,    setTone]    = useState("warm");
  const [length,  setLength]  = useState("medium");
  const [output,  setOutput]  = useState("");
  const [loading, setLoading] = useState(false);
  const [toasts,  setToasts]  = useState<Toast[]>([]);
  const [hist,    setHist]    = useState<HistRow[]>([]);
  const [view,    setView]    = useState<"write"|"history">("write");
  const [copied,  setCopied]  = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const tid = useRef(0);

  useEffect(() => { initDB(); }, []);

  async function initDB() {
    try {
      await window.tasklet.sqlExec(
        "CREATE TABLE IF NOT EXISTS aria_hist (id INTEGER PRIMARY KEY AUTOINCREMENT, mode_label TEXT, snippet TEXT, full_text TEXT, created_at TEXT)"
      );
      setDbReady(true);
      loadHist();
    } catch(e) { console.error("DB init", e); }
  }

  async function loadHist() {
    try {
      const rows = await window.tasklet.sqlQuery("SELECT id,mode_label,snippet,full_text,created_at FROM aria_hist ORDER BY id DESC LIMIT 30");
      setHist(rows as HistRow[]);
    } catch(e) { console.error("loadHist", e); }
  }

  function toast(msg: string, kind: "ok"|"err" = "ok") {
    const id = tid.current++;
    setToasts(t => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }

  function pickMode(m: Mode) { setMode(m); setVals({}); setOutput(""); }

  async function generate() {
    const missing = mode.fields.filter(f => !vals[f.id]?.trim());
    if (missing.length) { toast(`Fill in: ${missing.map(f => f.label).join(", ")}`, "err"); return; }

    setLoading(true); setOutput("");

    const fieldCtx = mode.fields.map(f => `${f.label}: ${vals[f.id]}`).join("\n");
    const userMsg  = `${fieldCtx}\n\nTone: ${TONE_MAP[tone]}\n${LENGTH_MAP[length]}`;
    // Book writing gets 200k tokens, other modes get 1600
    const maxTokens = mode.id === "book" ? 200000 : 1600;
    const payload  = { model: MODEL, messages: [{ role:"system", content: mode.prompt }, { role:"user", content: userMsg }], temperature: 0.88, max_tokens: maxTokens };
    const tmpPath  = `/tasklet/agent/home/aria_tmp_${Date.now()}.json`;

    try {
      await window.tasklet.writeFileToDisk(tmpPath, JSON.stringify(payload));
      // Call backend script that handles Grok API securely
      const timeout = mode.id === "book" ? 120 : 45;
      const raw = await window.tasklet.runCommand(
        `bun /tasklet/agent/home/scripts/aria_grok_call.ts '${tmpPath}' ${timeout}`
      );
      const text_raw = typeof raw === "string" ? raw : JSON.stringify(raw);
      const data = JSON.parse(text_raw);
      if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
      const text = data.choices?.[0]?.message?.content || "No output.";
      setOutput(text);
      toast("✨ ARIA delivered!");
      if (dbReady) {
        const snippet  = text.slice(0, 120).replace(/'/g, "''");
        const fullEsc  = text.replace(/'/g, "''");
        const modeEsc  = mode.label.replace(/'/g, "''");
        await window.tasklet.sqlExec(
          `INSERT INTO aria_hist (mode_label,snippet,full_text,created_at) VALUES ('${modeEsc}','${snippet}','${fullEsc}','${new Date().toISOString()}')`
        );
        loadHist();
      }
    } catch(err: unknown) {
      console.error("generate error", err);
      const msg = err instanceof Error ? err.message : String(err);
      toast(`Error: ${msg.slice(0,80)}`, "err");
      setOutput("⚠️ Something went wrong. Please try again.");
    } finally { setLoading(false); }
  }

  async function copy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true); toast("📋 Copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="flex flex-col h-screen bg-base-100 overflow-hidden">
      {/* Toasts */}
      <div className="fixed top-3 right-3 z-50 flex flex-col gap-2" role="status" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`alert ${t.kind === "err" ? "alert-error" : "alert-success"} py-2 px-4 text-sm shadow-lg`}>
            {t.msg}
          </div>
        ))}
      </div>

      {/* Top Bar */}
      <header className="navbar bg-base-200 border-b border-base-300 min-h-0 py-2 px-4 flex-shrink-0">
        <div className="flex-1 flex items-center gap-2">
          <span className="text-xl">🦉</span>
          <span className="font-bold text-base text-primary tracking-widest">ARIA</span>
          <span className="text-base-content/40 text-xs tracking-wider hidden sm:block">— AI Content Writer</span>
        </div>
        <div className="flex-none">
          <button
            className={`btn btn-sm btn-ghost gap-1 ${view === "history" ? "text-primary" : ""}`}
            onClick={() => setView(v => v === "history" ? "write" : "history")}
            aria-label="Toggle history"
          >
            <Clock size={14} />
            {view === "history" ? "← Writer" : "History"}
          </button>
        </div>
      </header>

      {view === "history" ? (
        /* History View */
        <div className="flex-1 overflow-auto p-4">
          <h2 className="text-lg font-semibold text-primary mb-4">Recent Generations</h2>
          {hist.length === 0 ? (
            <div className="text-center py-12 text-base-content/40 italic">
              <div className="text-4xl mb-3">🦉</div>
              No history yet. Generate your first piece!
            </div>
          ) : hist.map(h => (
            <div
              key={h.id}
              className="card bg-base-200 border border-base-300 mb-3 cursor-pointer hover:border-primary transition-colors"
              onClick={() => { setOutput(h.full_text); setView("write"); toast("Output restored from history", "ok"); }}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === "Enter" && (setOutput(h.full_text), setView("write"))}
            >
              <div className="card-body p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="badge badge-primary badge-sm">{h.mode_label}</span>
                  <span className="text-xs text-base-content/40">{new Date(h.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-base-content/60 line-clamp-2">{h.snippet}{h.full_text.length > 120 ? "…" : ""}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Writer View */
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <nav className="w-48 bg-base-200 border-r border-base-300 overflow-y-auto flex-shrink-0 py-2" aria-label="Writing modes">
            <p className="text-xs uppercase tracking-widest text-base-content/30 px-3 pb-2">Modes</p>
            {MODES.map(m => (
              <button
                key={m.id}
                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors border-l-2 ${
                  mode.id === m.id
                    ? "border-primary text-primary bg-primary/10"
                    : "border-transparent text-base-content/60 hover:text-base-content hover:bg-base-300"
                }`}
                onClick={() => pickMode(m)}
                aria-pressed={mode.id === m.id}
              >
                <span>{m.emoji}</span>
                <span className="truncate">{m.label}</span>
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="flex flex-1 gap-3 p-3 overflow-hidden">
            {/* Input Column */}
            <div className="flex-none w-72 flex flex-col gap-3 overflow-y-auto">
              {/* Mode Card */}
              <div className="card bg-base-200 border border-base-300">
                <div className="card-body p-3 gap-3">
                  <div>
                    <p className="font-semibold text-primary text-sm">{mode.emoji} {mode.label}</p>
                    <p className="text-xs text-base-content/50 mt-0.5">{mode.desc}</p>
                  </div>
                  {mode.fields.map(f => (
                    <div key={f.id}>
                      <label className="label py-0 mb-1" htmlFor={`f-${f.id}`}>
                        <span className="label-text text-xs font-medium uppercase tracking-wider text-base-content/50">{f.label}</span>
                      </label>
                      {f.type === "textarea" ? (
                        <textarea
                          id={`f-${f.id}`}
                          className="textarea textarea-bordered w-full text-sm min-h-16 resize-y"
                          placeholder={f.placeholder}
                          value={vals[f.id] || ""}
                          onChange={e => setVals(v => ({ ...v, [f.id]: e.target.value }))}
                        />
                      ) : f.type === "select" ? (
                        <select
                          id={`f-${f.id}`}
                          className="select select-bordered w-full text-sm h-9 min-h-0"
                          value={vals[f.id] || ""}
                          onChange={e => setVals(v => ({ ...v, [f.id]: e.target.value }))}
                        >
                          <option value="">— Select —</option>
                          {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          id={`f-${f.id}`}
                          type="text"
                          className="input input-bordered w-full text-sm h-9"
                          placeholder={f.placeholder}
                          value={vals[f.id] || ""}
                          onChange={e => setVals(v => ({ ...v, [f.id]: e.target.value }))}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div className="card bg-base-200 border border-base-300">
                <div className="card-body p-3 gap-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">Tone</p>
                  <div className="flex flex-wrap gap-1">
                    {TONES.map(t => (
                      <button
                        key={t}
                        className={`btn btn-xs ${tone === t ? "btn-primary" : "btn-ghost border border-base-300"}`}
                        onClick={() => setTone(t)}
                        aria-pressed={tone === t}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Length */}
              <div className="card bg-base-200 border border-base-300">
                <div className="card-body p-3 gap-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">Length</p>
                  <div className="flex gap-1">
                    {LENGTHS.map(l => (
                      <button
                        key={l}
                        className={`btn btn-xs flex-1 ${length === l ? "btn-primary" : "btn-ghost border border-base-300"}`}
                        onClick={() => setLength(l)}
                        aria-pressed={length === l}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                className="btn btn-primary w-full gap-2"
                onClick={generate}
                disabled={loading}
                aria-label="Generate content with ARIA"
              >
                {loading ? (
                  <><span className="loading loading-spinner loading-sm" /> ARIA is writing…</>
                ) : (
                  <><Wand2 size={16} /> Generate with ARIA</>
                )}
              </button>
            </div>

            {/* Output Column */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="card bg-base-200 border border-base-300 flex-1 flex flex-col">
                <div className="card-body p-3 flex flex-col gap-2 h-full">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary flex items-center gap-1">
                      <PenLine size={14} /> Output
                    </span>
                    {output && (
                      <div className="flex gap-2">
                        <button
                          className={`btn btn-xs gap-1 ${copied ? "btn-success" : "btn-ghost border border-base-300"}`}
                          onClick={copy}
                          aria-label="Copy output"
                        >
                          {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                        </button>
                        <button
                          className="btn btn-xs btn-ghost border border-base-300 gap-1"
                          onClick={generate}
                          disabled={loading}
                          aria-label="Regenerate"
                        >
                          <RefreshCw size={12} /> Redo
                        </button>
                      </div>
                    )}
                  </div>
                  <div
                    className="flex-1 bg-base-100 rounded-lg p-3 text-sm text-base-content/80 leading-relaxed overflow-y-auto whitespace-pre-wrap min-h-48"
                    aria-live="polite"
                    aria-label="Generated content"
                  >
                    {loading ? (
                      <div className="flex flex-col items-center justify-center h-full gap-3 text-base-content/40">
                        <span className="text-3xl">🦉</span>
                        <span className="loading loading-dots loading-md text-primary" />
                        <span className="text-sm">ARIA is crafting your content…</span>
                      </div>
                    ) : output ? output : (
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-base-content/30 italic text-center">
                        <span className="text-3xl">🦉</span>
                        <span>Pick a mode, fill in the fields,</span>
                        <span>and let ARIA do the heavy lifting.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<ARIAWriter />);
