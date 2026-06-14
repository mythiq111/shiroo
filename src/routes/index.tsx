import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday Shiroo 👑" },
      { name: "description", content: "A beautiful birthday surprise for Shiroo, the most magical girl in every room." },
      { property: "og:title", content: "Happy Birthday Shiroo 👑" },
      { property: "og:description", content: "A beautiful birthday surprise for Shiroo." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: BirthdayApp,
});

/* ═══════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════ */
const DOB = new Date("2004-07-09T00:00:00");

function calcAge() {
  const d = Date.now() - DOB.getTime();
  return {
    days: Math.floor(d / 864e5),
    years: Math.floor(d / (864e5 * 365.25)),
    months: Math.floor(d / (864e5 * 30.4375)),
    weeks: Math.floor(d / (864e5 * 7)),
    hours: Math.floor(d / 36e5),
  };
}

const CAPTIONS = [
  "Bestie moments ✨", "Pure joy 🌸", "My fav human 💜",
  "We ate that 😂", "Iconic 👑", "Forever fav 🌷",
  "Main characters 🎀", "Love her 💕", "Our vibes ✨", "Memories 🎀",
];

const REASONS = [
  { emoji: "💫", title: "Bakka Pilla", desc: "Koncham Bakka Ga untav Untav diet cheyu lavvu avdhu kani " },
  { emoji: "🤗", title: "Warmest soul ever", desc: "Makes you feel seen, heard, and completely yourself. Every single time." },
  { emoji: "😂", title: "Funniest human alive", desc: "Turns any gloomy day into a full comedy special without even trying." },
  { emoji: "💪", title: "Quietly unstoppable", desc: "Handles everything with grace and never lets anyone see the effort behind it." },
  { emoji: "🎀", title: "Main character energy", desc: "Lives life like the protagonist of the most beautiful story ever written." },
  { emoji: "💜", title: "Loyal to the core", desc: "Once she's your person, she's your person forever. That's rare and precious." },
];

const WISHES = [
  "May every dream you've whispered to yourself come true",
  "May this year bring wild joy and beautiful surprises",
  "May you always know how deeply you are loved",
  "May life treat you exactly the way you deserve — royally",
  "May you never stop shining, even on the cloudiest days ✨",
  "May you always choose yourself first, princess 💕",
];

const POPUP_DATA = {
  1: { emoji: "🌸", title: "Will you be my best friend?", sub: "I really, really need to know 🥺", btn: "Yes, always! 💕" },
  2: { emoji: "🤞", title: "Do you promise?", sub: "Pinky swear? Like, forever and ever? 💜", btn: "I Promise! 🌸" },
} as const;

// 30 unique NO messages — drawn in random order, no repeats until all are exhausted
const NO_TEXTS = [
  "No 🙅",
  "Nijm ga? 🥺",
  "But... Kyuu?? 💔",
  "Plechhhh?? 💜",
  "Nenu Edustha Maari chuskoo 😭",
  "Last chance Istunaa Inko saari no chepthava 👀",
  "Okayyyy fine 😤",
  "Ha Inka edipinchuuu 😢",
  "Wrong button!! 😱",
  "Try the other one ⬆️",
  "Nenu Vellanu Gaka Vekkanu 🚧",
  "Pretty please 🙏",
  "Enduku niku antha Pogaru📱",
  "But we're besties! 🤝",
  "Arey Mama Nuvu na Gundeykai ra pleachh 💘",
  "Gudhutha Chusko marii 🤔",
  "Nooooo 😩",
  "Come on... 🥺",
  "You didn't mean that 💭",
  "Error: No not allowed 🔴",
  "404: Friendship not found 🤖",
  "Bestie override activated 📡",
  "No no no no no 🙋",
  "I'll wait ⏳",
  "Have you tried YES? ✨",
  "Ctrl+Z that click 🔄",
  "System error: pls say yes 💻",
  "That was clearly a mistake 💡",
  "One more try... 💐",
];

const CONFETTI_COLS = ["#d4687c", "#9b84c4", "#c49a3c", "#f5c6d0", "#cfc0e8", "#e8cc8a", "#b84f63", "#7a63a8"];
const SPARKLE_CHARS = ["✦", "✧", "⋆", "◇", "✿", "·", "*"];
const SPARKLE_COLS = ["#d4687c", "#9b84c4", "#c49a3c", "rgba(155,132,196,.7)"];
const FLOATIE_CHARS = ["🌸", "🌷", "✨", "💜", "🩷", "⋆", "·"];

/* ═══════════════════════════════════════════════════
   CONFETTI HOOK
═══════════════════════════════════════════════════ */
interface Piece {
  x: number; y: number; r: number; col: string;
  vx: number; vy: number; spin: number; rot: number;
  shape: "rect" | "circ"; w: number;
}

function useLaunchConfetti(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const stateRef = useRef<{ pieces: Piece[]; active: boolean; rafId: number | null }>({
    pieces: [], active: false, rafId: null,
  });

  const launch = useCallback((x0?: number, count = 200) => {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext("2d");
    if (!cx) return;

    const state = stateRef.current;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const W = cv.width;
        state.pieces.push({
          x: x0 !== undefined ? x0 + (Math.random() - 0.5) * 200 : Math.random() * W,
          y: -15,
          r: 3 + Math.random() * 6,
          col: CONFETTI_COLS[Math.floor(Math.random() * CONFETTI_COLS.length)],
          vx: (Math.random() - 0.5) * 3.5,
          vy: 1.8 + Math.random() * 4,
          spin: (Math.random() - 0.5) * 0.22,
          rot: Math.random() * Math.PI * 2,
          shape: Math.random() > 0.4 ? "rect" : "circ",
          w: Math.random() * Math.PI * 2,
        });
      }, i * 12);
    }

    state.active = true;
    setTimeout(() => { state.active = false; }, count * 12 + 3500);

    if (state.rafId !== null) return; // loop already running

    function loop() {
      const W = cv!.width;
      const H = cv!.height;
      cx!.clearRect(0, 0, W, H);
      for (const p of state.pieces) {
        p.x += p.vx + Math.sin(p.w) * 0.4;
        p.y += p.vy;
        p.rot += p.spin;
        p.w += 0.04;
        cx!.save();
        cx!.translate(p.x, p.y);
        cx!.rotate(p.rot);
        cx!.fillStyle = p.col;
        if (p.shape === "rect") {
          cx!.fillRect(-p.r, -p.r * 0.4, p.r * 2, p.r * 0.8);
        } else {
          cx!.beginPath();
          cx!.arc(0, 0, p.r * 0.45, 0, Math.PI * 2);
          cx!.fill();
        }
        cx!.restore();
      }
      // remove off-screen pieces
      for (let i = state.pieces.length - 1; i >= 0; i--) {
        if (state.pieces[i].y > H + 30) state.pieces.splice(i, 1);
      }
      if (state.pieces.length > 0 || state.active) {
        state.rafId = requestAnimationFrame(loop);
      } else {
        cx!.clearRect(0, 0, W, H);
        state.rafId = null;
      }
    }
    loop();
  }, [canvasRef]);

  return launch;
}

/* ═══════════════════════════════════════════════════
   POPUP SYSTEM
═══════════════════════════════════════════════════ */
interface PopupProps { onConfetti: (x?: number) => void; }

function PopupSystem({ onConfetti }: PopupProps) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [animated, setAnimated] = useState(false);
  const [noText, setNoText] = useState(NO_TEXTS[0]);
  const [boxKey, setBoxKey] = useState(0);
  const btnRef = useRef<HTMLButtonElement>(null);
  // Shuffle pool: pick each message once before repeating
  const poolRef = useRef<string[]>([]);

  function pickNextNo(): string {
    if (poolRef.current.length === 0) {
      // Refill and Fisher-Yates shuffle
      const arr = [...NO_TEXTS];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      poolRef.current = arr;
    }
    return poolRef.current.pop()!;
  }

  const BOX_W = 340, BOX_H = 270;
  const vp = useCallback(() => ({
    x: 24 + Math.random() * (window.innerWidth - BOX_W - 48),
    y: 24 + Math.random() * (window.innerHeight - BOX_H - 48),
  }), []);

  // ── Lock scroll while popup is active ───────────────────────────────
  useEffect(() => {
    const isActive = visible && step !== 0;
    if (isActive) {
      // Store current scrollbar width to avoid layout shift
      const sbw = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = sbw + "px"; // compensate for hidden scrollbar
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [visible, step]);

  // ── Show step-1 popup after 1.5 s, centered ──────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setStep(1);
      setPos({ x: (window.innerWidth - BOX_W) / 2, y: (window.innerHeight - BOX_H) / 2 });
      setVisible(true);
    }, 1500);
    return () => clearTimeout(t);
  }, [vp]);




  // ── NO handler: unique message + teleport + bounce ─────────────────
  const handleNo = useCallback(() => {
    setNoText(pickNextNo());
    setBoxKey((k) => k + 1); // forces popIn animation to replay
    setAnimated(false);
    setPos(vp());
  }, [vp]);

  // ── YES handler ─────────────────────────────────────────────
  const handleYes = useCallback(() => {
    const rect = btnRef.current?.getBoundingClientRect();
    onConfetti(rect ? rect.left + rect.width / 2 : undefined);
    if (step === 1) {
      setVisible(false);
      setTimeout(() => { setAnimated(false); setStep(2); setPos(vp()); setVisible(true); }, 900);
    } else {
      setStep(0);
      setVisible(false);
    }
  }, [step, vp, onConfetti]);

  if (!visible || step === 0) return null;
  const data = POPUP_DATA[step];

  return (
    <div className="popup-overlay">
      <div
        key={boxKey}
        className="popup-box"
        style={{
          left: pos.x,
          top: pos.y,
          transition: animated
            ? "left .6s cubic-bezier(.34,1.56,.64,1), top .6s cubic-bezier(.34,1.56,.64,1)"
            : "none",
        }}
      >
        <div className="popup-sparkle">✦</div>
        <span className="popup-emoji">{data.emoji}</span>
        <div className="popup-title">{data.title}</div>
        <div className="popup-sub">{data.sub}</div>
        <div className="popup-btns">
          <button ref={btnRef} className="popup-yes" onClick={handleYes}>{data.btn}</button>
          <button className="popup-no" onClick={handleNo}>{noText}</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   AGE SECTION
═══════════════════════════════════════════════════ */
function AgeSection() {
  const [stats, setStats] = useState(calcAge);

  useEffect(() => {
    const id = setInterval(() => setStats(calcAge()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="sec reveal" style={{ textAlign: "center" }}>
      <span className="sec-label" style={{ display: "block", textAlign: "center" }}>
        she has been a blessing for
      </span>
      <div className="age-center">
        <div>
          <div className="age-number">{stats.days.toLocaleString()}</div>
          <div className="age-unit">days of pure magic</div>
        </div>
        <p className="age-caption">
          Born 9th July 2004 — every single one of those days made the world a little brighter(Idi Ai ichina Sollu bagundi ani peta anthey ) 🌸
        </p>
        <div className="age-pills">
          <div className="pill"><span className="pill-val">{stats.years}</span>years</div>
          <div className="pill"><span className="pill-val">{stats.months.toLocaleString()}</span>months</div>
          <div className="pill"><span className="pill-val">{stats.weeks.toLocaleString()}</span>weeks</div>
          <div className="pill"><span className="pill-val">{stats.hours.toLocaleString()}</span>hours</div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   GALLERY SECTION
═══════════════════════════════════════════════════ */
type Slot = { id: number; imgSrc: string | null; caption: string };

function GallerySection() {
  const [slots, setSlots] = useState<Slot[]>(() =>
    Array.from({ length: 6 }, (_, i) => ({ id: i, imgSrc: null, caption: CAPTIONS[i % CAPTIONS.length] })),
  );
  const [nextId, setNextId] = useState(6);
  const [activeId, setActiveId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const openPicker = (id: number) => { setActiveId(id); fileRef.current?.click(); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeId === null) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setSlots((prev) => prev.map((s) => (s.id === activeId ? { ...s, imgSrc: src } : s)));
      setActiveId(null);
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const removeImg = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, imgSrc: null } : s)));
  };

  const addSlot = () => {
    const id = nextId;
    setSlots((prev) => [...prev, { id, imgSrc: null, caption: CAPTIONS[id % CAPTIONS.length] }]);
    setNextId((n) => n + 1);
  };

  return (
    <section className="sec">
      <span className="sec-label reveal">memories &amp; moments</span>
      <h2 className="sec-title reveal">Our beautiful pictures 📸(Antha Manchi vi levu anuko)</h2>
      <p className="gallery-note reveal">Click any frame to upload her photo — make it personal 🌷</p>

      <div className="gallery-grid reveal">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`photo-slot${slot.imgSrc ? " has-img" : ""}`}
            onClick={() => !slot.imgSrc && openPicker(slot.id)}
          >
            {slot.imgSrc ? (
              <>
                <img src={slot.imgSrc} alt={slot.caption} />
                <button className="remove-btn" onClick={(e) => removeImg(slot.id, e)} aria-label="Remove photo">✕</button>
              </>
            ) : (
              <>
                <div className="plus-icon">＋</div>
                <div className="slot-label">{slot.caption}</div>
              </>
            )}
          </div>
        ))}
      </div>

      <button className="add-slot-btn" onClick={addSlot}>＋ Add another photo frame</button>
      <input type="file" ref={fileRef} accept="image/*" style={{ display: "none" }} onChange={handleChange} />
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════ */
function BirthdayApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const launch = useLaunchConfetti(canvasRef);

  // ── Canvas sizing ──────────────────────────────────────────────────────────
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    // tiny welcome burst after 0.8 s
    const t = setTimeout(() => launch(undefined, 70), 800);
    return () => { window.removeEventListener("resize", resize); clearTimeout(t); };
  }, [launch]);

  // ── Scroll-reveal observer ─────────────────────────────────────────────────
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("on"); }),
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ── Sparkle cursor ─────────────────────────────────────────────────────────
  useEffect(() => {
    let lastSp = 0;
    const handleMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSp < 95) return;
      lastSp = now;
      const el = document.createElement("div");
      el.className = "sparkle";
      el.textContent = SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];
      el.style.cssText = `left:${e.clientX + (Math.random() * 16 - 8)}px;top:${e.clientY + (Math.random() * 16 - 8)}px;color:${SPARKLE_COLS[Math.floor(Math.random() * SPARKLE_COLS.length)]};`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 700);
    };
    document.addEventListener("mousemove", handleMove);
    return () => document.removeEventListener("mousemove", handleMove);
  }, []);

  // ── Floating emoji particles ───────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      const f = document.createElement("div");
      f.className = "floatie";
      f.textContent = FLOATIE_CHARS[Math.floor(Math.random() * FLOATIE_CHARS.length)];
      f.style.cssText = `left:${Math.random() * 94}%;font-size:${0.65 + Math.random() * 0.9}rem;animation-duration:${5 + Math.random() * 4}s`;
      document.body.appendChild(f);
      setTimeout(() => f.remove(), 9000);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Confetti canvas */}
      <canvas ref={canvasRef} id="confetti-canvas" />

      {/* Best-friend popup chain */}
      <PopupSystem onConfetti={launch} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="hero">
        <p className="hero-eyebrow">✦ a very special day for a very special soul (Athma)✦</p>
        <span className="crown">👑</span>
        <p className="hero-small">Happy Birthday</p>
        <div className="hero-name">Shiroo</div>
        <p className="hero-sub" >Janamadina Subhakanshalu 🐷</p>
        <div className="petal-row">🌸 🌷 💜 ✨ 💜 🌷 🌸</div>
        <div className="scroll-hint">
          <span>scroll</span>
          <div className="scroll-bar" />
        </div>
      </div>

      <div className="divider"><span className="divider-star">✦</span></div>

      {/* ── AGE COUNTER ──────────────────────────────────────────────────── */}
      <AgeSection />

      <div className="divider"><span className="divider-star">✦</span></div>

      {/* ── HEARTFELT MESSAGE ────────────────────────────────────────────── */}
      <section className="sec">
        <span className="sec-label reveal">a little note for you</span>
        <h2 className="sec-title reveal">From Chinii Babu to her Best Friend 💌</h2>
        <div className="msg-card reveal">
          <p className="msg-text">
            Shiroo Nijm ga chala antey chala thanks raa. Chala baaga support chesthavu. Nuvvu nijm ga chala antey chala manchi pandi vi 🐼
            . 10th lo kani nuvu help cheyakapoi untey nenu pass aya vadini kadhu . 10th ae kadhu dani taravta kuda chala antey chala help chesavu naku
            . Andukey nijamga thanks.
          </p>
          <p className="msg-text">
            Manam epudu ki Ellaney undali Best friends laga support cheksovali idariki idarum. Ha Opukunta kullipothanu ani kani
            nijm ga adi nuvu ekkada durham aipothav ani ae kani vera reason emi ledhu..
          </p>
          <p className="msg-text">
            Epudu Em problem ochina nenu neku support gaa unta . And Yes inko chinna thing manam ni godavalu ayna
            please ellaney best friends laga kalisi undali anthey naku inka emi odhu
          </p>
          <p className="msg-text">
            I promise to always be there for you, through thick and thin, laughter and tears, highs and lows. May your life be filled with
            joy, success, and endless happiness. You deserve the world, my dear friend. 🌸✨
          </p>
          <p className="msg-sign">— your Chinni Babu, always and forever 💕</p>
        </div>
      </section>

      <div className="divider"><span className="divider-star">✦</span></div>

      {/* ── PHOTO GALLERY ────────────────────────────────────────────────── */}
      <GallerySection />

      <div className="divider"><span className="divider-star">✦</span></div>

      {/* ── REASONS WE LOVE HER ──────────────────────────────────────────── */}
      <section className="sec">
        <span className="sec-label reveal">why she's legendary</span>
        <h2 className="sec-title reveal">Reasons we love Shiroo 🌷</h2>
        <div className="reasons-grid">
          {REASONS.map((r) => (
            <div key={r.title} className="r-card reveal">
              <span className="r-emoji">{r.emoji}</span>
              <div className="r-title">{r.title}</div>
              <p className="r-desc">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="divider"><span className="divider-star">✦</span></div>

      {/* ── BIRTHDAY WISHES ──────────────────────────────────────────────── */}
      <section className="sec">
        <span className="sec-label reveal" style={{ textAlign: "center", display: "block" }}>birthday wishes</span>
        <h2 className="sec-title reveal" style={{ textAlign: "center" }}>For our princess 👑</h2>
        <div className="wish-box reveal">
          <ul className="wish-list">
            {WISHES.map((w, i) => (
              <li key={i}><span className="dot" />{w}</li>
            ))}
          </ul>
          <div className="btn-wrap">
            <div className="btn-ring" />
            <div className="btn-ring" />
            <button id="celebrate-btn" className="btn" onClick={() => launch()}>
              🎉 Celebrate with confetti!
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="site-footer">
        Made with <strong>💕</strong> for <strong>Shiroo</strong> — the most magical girl in every room, always.
        <br />
        <span style={{ fontSize: "1.2rem", marginTop: ".75rem", display: "block", letterSpacing: ".25rem", opacity: 0.5 }}>
          🌸 🌷 💜 ✨ 💜 🌷 🌸
        </span>
      </footer>
    </>
  );
}
