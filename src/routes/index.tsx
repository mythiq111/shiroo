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
  "Making Ur Mom Proud", "Iconic 👑", "Forever fav 🌷",
  "Main characters 🎀", "Love her 💕", "Our vibes ✨", "Memories 🎀",
];

const REASONS = [
  { emoji: "💫", title: "Bakka Pilla", desc: "Koncham Bakka Ga untav Untav diet cheyu lavvu avdhu kani " },
  { emoji: "🤗", title: "Warmest soul ever", desc: "Makes you feel seen, heard, and completely yourself. Every single time." },
  { emoji: "😂", title: "Funniest human alive", desc: "Turns any gloomy day into a full comedy special without even trying." },
  { emoji: "💪", title: "Quietly unstoppable", desc: "Handles everything with grace and never lets anyone see the effort behind it.(Appudu Apudu Tesnion padtadi anthey 😂)" },
  { emoji: "🎀", title: "Main character energy", desc: "Lives life like the protagonist of the most beautiful story ever written." },
  { emoji: "💜", title: "Chitii Papa", desc: "Epudu Ellaney Happy ga undu Ok Chiroo..." },
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
interface PopupProps { onConfetti: (x?: number) => void; onComplete: () => void; }

function PopupSystem({ onConfetti, onComplete }: PopupProps) {
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
      onComplete();
    }
  }, [step, vp, onConfetti, onComplete]);

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

const GALLERY_ROTATIONS = [-3, 2, -2, 3, -1.5, 2.5];

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function GallerySection() {
  const [slots, setSlots] = useState<Slot[]>(() => shuffle([
    { id: 0, imgSrc: "https://res.cloudinary.com/dvf0ugwrr/image/upload/v1782608878/Shiroo-1_w3ojbf.jpg", caption: CAPTIONS[0] },
    { id: 1, imgSrc: "https://res.cloudinary.com/dvf0ugwrr/image/upload/v1782610160/shiroo2_idas2v.jpg", caption: CAPTIONS[1] },
    { id: 2, imgSrc: "https://res.cloudinary.com/dvf0ugwrr/image/upload/v1782610195/shiroo3_sezmow.jpg", caption: CAPTIONS[2] },
    { id: 3, imgSrc: "https://res.cloudinary.com/dvf0ugwrr/image/upload/v1782610222/shiroo4_wph4ot.jpg", caption: CAPTIONS[3] },
    { id: 4, imgSrc: "https://res.cloudinary.com/dvf0ugwrr/image/upload/v1782610275/shiroo5_wisfxi.jpg", caption: CAPTIONS[4] },
    { id: 5, imgSrc: "https://res.cloudinary.com/dvf0ugwrr/image/upload/v1782610323/shiroo6_fmwgkm.jpg", caption: CAPTIONS[5] },
  ]));
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

  return (
    <section className="sec">
      <span className="sec-label reveal">memories &amp; moments</span>
      <h2 className="sec-title reveal">Our beautiful pictures 📸(Antha Manchi vi levu anuko)</h2>

      <div className="gallery-grid reveal">
        {slots.map((slot, i) => (
          <div
            key={slot.id}
            className={`photo-card${slot.imgSrc ? " has-img" : ""}`}
            style={{ "--tilt": `${GALLERY_ROTATIONS[i % GALLERY_ROTATIONS.length]}deg` } as React.CSSProperties}
            onClick={() => !slot.imgSrc && openPicker(slot.id)}
          >
            {slot.imgSrc ? (
              <>
                <img src={slot.imgSrc} alt={slot.caption} />
                <div className="photo-overlay">
                  <span className="photo-overlay-caption">{slot.caption}</span>
                </div>
              </>
            ) : (
              <>
                <div className="upload-icon-wrap">
                  <span className="upload-icon">📷</span>
                </div>
                <div className="photo-label">{slot.caption}</div>
              </>
            )}
          </div>
        ))}
      </div>

      <input type="file" ref={fileRef} accept="image/*" style={{ display: "none" }} onChange={handleChange} />
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════ */
function BirthdayApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const polaroidCanvasRef = useRef<HTMLCanvasElement>(null);
  const launch = useLaunchConfetti(canvasRef);
  const launchPolaroid = useLaunchConfetti(polaroidCanvasRef);
  const [wishes] = useState(() => shuffle(WISHES));
  const [popupDone, setPopupDone] = useState(false);
  const [polaroidSrc, setPolaroidSrc] = useState<string | null>(
    "https://res.cloudinary.com/dvf0ugwrr/image/upload/v1782608878/Shiroo-1_w3ojbf.jpg"
  );
  const polaroidRef = useRef<HTMLInputElement>(null);

  const handlePolaroidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPolaroidSrc(ev.target?.result as string);
      if (polaroidRef.current) polaroidRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

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

  // ── Scroll-reveal observer — always active ────────────────────────────────
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("on"); }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // ── Force-reveal everything in / above the viewport the moment popup ends ─
  useEffect(() => {
    if (!popupDone) return;
    // Tiny delay so the opacity-1 transition has started before we measure
    const t = setTimeout(() => {
      document.querySelectorAll<Element>(".reveal").forEach((el) => {
        const { top, bottom } = el.getBoundingClientRect();
        if (bottom > 0 && top < window.innerHeight) el.classList.add("on");
      });
    }, 80);
    return () => clearTimeout(t);
  }, [popupDone]);

  return (
    <>
      {/* Confetti canvas */}
      <canvas ref={canvasRef} id="confetti-canvas" />

      {/* Best-friend popup chain */}
      <PopupSystem onConfetti={launch} onComplete={() => {
        setPopupDone(true);
        setTimeout(() => {
          const cv = polaroidCanvasRef.current;
          if (cv) { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; }
          launchPolaroid(undefined, 140);
        }, 1600);
      }} />

      {/* Everything below is invisible until both confirmations are done */}
      <div style={{ opacity: popupDone ? 1 : 0, pointerEvents: popupDone ? "auto" : "none", transition: "opacity 1.2s ease", userSelect: popupDone ? "auto" : "none" }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <div className="hero">
          {/* Left — existing content */}
          <div className="hero-left">
            <p className="hero-eyebrow">a very special day for a very special soul (Athma)</p>
            <span className="crown">👑</span>
            <p className="hero-small">Happy Birthday</p>
            <div className="hero-name">Shiroo</div>
            <p className="hero-sub">Janamadina Subhakanshalu 🐷</p>
            <div className="hero-stats">
              <span className="hero-stat">21 years</span>
              <span className="hero-stat">best friends</span>
              <span className="hero-stat">forever ♾</span>
            </div>
            <div className="scroll-hint">
              <span>scroll</span>
              <div className="scroll-bar" />
            </div>
          </div>

          {/* Right — photo collage + balloons */}
          <div className="hero-right">
            <canvas ref={polaroidCanvasRef} className="polaroid-confetti-canvas" aria-hidden="true" />
            <div className="hero-balloons" aria-hidden="true">
              <div className="balloon-wrap hb-b1">
                <div className="balloon b-lav-a b-md" />
                <svg className="b-string" viewBox="0 0 20 68" fill="none"><path d="M10 0 C17 22 3 44 10 68" stroke="rgba(122,99,168,.28)" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
              <div className="balloon-wrap hb-b2">
                <div className="balloon b-lav b-lg" />
                <svg className="b-string" viewBox="0 0 20 68" fill="none"><path d="M10 0 C3 24 17 44 10 68" stroke="rgba(106,82,156,.28)" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
            </div>

            <span className="hero-sparkle spk-1" aria-hidden="true">✦</span>
            <span className="hero-sparkle spk-2" aria-hidden="true">✧</span>
            <span className="hero-sparkle spk-3" aria-hidden="true">✦</span>

            <div className="photo-stack">
              <div className="deco-photo deco-photo-1" aria-hidden="true">
                <img src="https://res.cloudinary.com/dvf0ugwrr/image/upload/v1782610160/shiroo2_idas2v.jpg" alt="" />
              </div>
              <div className="deco-photo deco-photo-2" aria-hidden="true">
                <img src="https://res.cloudinary.com/dvf0ugwrr/image/upload/v1782610195/shiroo3_sezmow.jpg" alt="" />
              </div>

              <div className="polaroid-card">
                <p className="polaroid-heading">Happy Birthday 🐱</p>
                <div
                  className="polaroid-frame"
                  role="button"
                  tabIndex={0}
                  aria-label="Click to add a photo"
                  onClick={() => polaroidRef.current?.click()}
                  onKeyDown={(e) => e.key === "Enter" && polaroidRef.current?.click()}
                >
                  {polaroidSrc ? (
                    <img src={polaroidSrc} alt="Birthday photo" className="polaroid-img" />
                  ) : (
                    <div className="polaroid-empty">
                      <span>📸</span>
                      <span>tap to add a photo</span>
                    </div>
                  )}
                </div>
                <p className="polaroid-caption">To the best human ik... 💙</p>
              </div>
            </div>

            <input
              ref={polaroidRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePolaroidChange}
            />
          </div>
        </div>

        <div className="divider" />

        {/* ── AGE COUNTER ──────────────────────────────────────────────────── */}
        <AgeSection />

        <div className="divider" />

        {/* ── HEARTFELT MESSAGE ────────────────────────────────────────────── */}
        <section className="sec">
          <span className="sec-label reveal">a little note for you</span>
          <h2 className="sec-title reveal">From Chinii Babu to her Best Friend 💌</h2>
          <div className="msg-card reveal">
            <p className="msg-text">First Of All Janmadina subhakankshalu Chitti. Epudu Ellaney Happy ga undu Mummy Daddy Chelli ki Baga chusko ❤️
              Manchi ga job kottavga pacakge chinnadey kani manam kuda inka chinna pillalam ae 22.so ostadi ley kangaru padaku inkoti anukuntav naku peeli aipotadi mari daniki mundhu ae bega setttle avvali ani avtav
              kanagru em padaku avatv niku manchi  husband ostadu (manchi best friend ellago unnadu ley ) 😅.Antha manchi ga avtadi so don't worry about it.
            </p>
            <p className="msg-text">
              Shiroo Nijm ga chala antey chala thanks raa. Chala baaga support chesthavu. Nuvvu nijm ga chala antey chala manchi pandi vi 🐼
              . 10th lo kani nuvu help cheyakapoi untey nenu pass aya vadini kadhu . 10th ae kadhu dani taravta kuda chala antey chala help chesavu naku
              . Andukey nijamga thanks.
            </p>
            <p className="msg-text">
              Manam epudu ki Ellaney undali Best friends laga support cheskovali idariki idarum. Ha Opukunta kullipothanu ani kani
              nijm ga adi nuvu ekkada durham aipothav ani ae kani vera reason emi ledhu..
            </p>
            <p className="msg-text">
              Epudu Em problem ochina nenu neku support gaa untanu .Naku ma parents Entho me parents kuda anthey vallani kuda epudu ma mummy dollu lagey equal ga chusa .
              And Yes inko chinna thing manam enni godavalu ayna
              please ellaney best friends laga kalisi undali anthey naku inka emi odhu.
            </p>
            <p className="msg-sign">— your Chinni Babu, always and forever 💕</p>
          </div>
        </section>

        <div className="divider" />

        {/* ── PHOTO GALLERY ────────────────────────────────────────────────── */}
        <GallerySection />

        <div className="divider" />

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

        <div className="divider" />

        {/* ── BIRTHDAY WISHES ──────────────────────────────────────────────── */}
        <section className="sec">
          <span className="sec-label reveal" style={{ textAlign: "center", display: "block" }}>birthday wishes</span>
          <h2 className="sec-title reveal" style={{ textAlign: "center" }}>For our princess 👑</h2>
          <div className="wish-box reveal">
            <ul className="wish-list">
              {wishes.map((w, i) => (
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
      </div>{/* /page-content wrapper */}
    </>
  );
}
