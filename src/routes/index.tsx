import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import heroImage from "../assets/shirooo-hero.jpg";
import friendsImage from "../assets/memory-friends.jpg";
import coffeeImage from "../assets/memory-coffee.jpg";
import sunsetImage from "../assets/memory-sunset.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday Shirooo — A Film by Friendship" },
      { name: "description", content: "A cinematic birthday keepsake celebrating Shirooo and a beautiful friendship." },
      { property: "og:title", content: "Happy Birthday Shirooo" },
      { property: "og:description", content: "A cinematic birthday keepsake made with love." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Happy Birthday Shirooo" },
      { name: "twitter:description", content: "A cinematic birthday keepsake made with love." },
    ],
  }),
  component: BirthdayFilm,
});

const sparks = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  x: `${8 + ((index * 37) % 84)}%`,
  delay: `${(index % 9) * 0.08}s`,
  turn: `${(index * 47) % 360}deg`,
}));

function MemoryFrame({ src, alt, label, className, width, height }: { src: string; alt: string; label: string; className: string; width: number; height: number }) {
  return (
    <figure className={`memory-frame group relative overflow-hidden ${className}`}>
      <img src={src} alt={alt} width={width} height={height} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-midnight/90 to-transparent px-4 pb-4 pt-16 text-[0.58rem] uppercase tracking-[0.22em] text-gold/70">
        <span>{label}</span><span>Replace with your photo</span>
      </figcaption>
    </figure>
  );
}

function BirthdayFilm() {
  const [celebrating, setCelebrating] = useState(false);
  const galleryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.16 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="overflow-hidden bg-midnight font-sans text-silk selection:bg-gold selection:text-midnight">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Golden silhouette representing Shirooo" width={1920} height={1080} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        <div className="hero-vignette absolute inset-0" />
        <div className="film-grain absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 space-y-5 px-6 text-center">
          <span className="animate-cinematic block text-xs uppercase tracking-[0.42em] text-gold sm:text-sm">A film by friendship</span>
          <h1 className="animate-cinematic animation-delay-1 font-serif text-7xl italic leading-none tracking-tight sm:text-8xl md:text-9xl">Shirooo</h1>
          <p className="animate-cinematic animation-delay-2 font-serif text-xl italic text-gold/85 sm:text-2xl">Happy birthday to a truly brilliant soul.</p>
        </div>
        <button type="button" aria-label="Scroll to memories" onClick={() => galleryRef.current?.scrollIntoView({ behavior: "smooth" })} className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 cursor-pointer p-4 text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
          <span className="mx-auto block h-16 w-px animate-scroll-line bg-gradient-to-b from-gold/0 via-gold to-gold/0" />
        </button>
      </section>

      <section ref={galleryRef} className="mx-auto max-w-6xl px-6 py-28 sm:py-36">
        <div className="grid items-center gap-16 md:grid-cols-12 md:gap-8">
          <div data-reveal className="reveal space-y-8 md:col-span-5">
            <p className="text-xs uppercase tracking-[0.28em] text-gold">Chapter I · The muse</p>
            <h2 className="font-serif text-5xl leading-[1.06] sm:text-6xl">Capturing the moments that define us.</h2>
            <p className="max-w-sm leading-relaxed text-silk/60">From unplanned adventures to conversations that lasted until sunrise, every frame with you becomes a story worth keeping.</p>
            <div className="h-px w-20 bg-gold/60" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:col-span-7">
            <div className="space-y-3 sm:space-y-5">
              <div data-reveal className="reveal -rotate-2"><MemoryFrame src={friendsImage} alt="Two best friends laughing in warm sunlight" label="Memory 01" width={1024} height={1024} className="aspect-[4/5]" /></div>
              <div data-reveal className="reveal rotate-1"><MemoryFrame src={coffeeImage} alt="Two coffee cups in morning light" label="Memory 02" width={800} height={800} className="aspect-square" /></div>
            </div>
            <div data-reveal className="reveal mt-12 rotate-2 sm:mt-16">
              <MemoryFrame src={sunsetImage} alt="A nostalgic sunset over the city" label="Memory 03" width={1024} height={1024} className="aspect-[2/3]" />
              <p className="mt-5 text-right font-serif text-lg italic text-gold/70">and a thousand more to come…</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-plum/35 px-6 py-36 text-center sm:py-44">
        <div className="film-grain absolute inset-0 opacity-30" aria-hidden="true" />
        <div data-reveal className="reveal relative mx-auto max-w-3xl space-y-10">
          <div className="font-serif text-6xl text-gold/50">“</div>
          <p className="font-serif text-3xl italic leading-relaxed text-silk/90 sm:text-4xl">To my person, my confidante, and the world’s most beautiful soul. May your day be as radiant as the light you bring into every room. Shirooo, you are loved beyond measure.</p>
          <div className="mx-auto h-px w-24 bg-gold/30" />
          <p className="text-xs uppercase tracking-[0.35em] text-gold">Forever &amp; always</p>
        </div>
      </section>

      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.055]" aria-hidden="true"><p className="font-serif text-[20vw] whitespace-nowrap">BIRTHDAY</p></div>
        {celebrating && <div className="pointer-events-none absolute inset-0" aria-hidden="true">{sparks.map((spark) => <i key={spark.id} className="spark" style={{ left: spark.x, animationDelay: spark.delay, rotate: spark.turn }} />)}</div>}
        <div data-reveal className="reveal relative z-10 space-y-8">
          <p className="text-sm font-light uppercase tracking-[0.48em] text-gold">Happy birthday</p>
          <div><p className="font-serif text-6xl italic sm:text-7xl md:text-8xl">Stay magic,</p><p className="font-serif text-6xl italic text-gold sm:text-7xl md:text-8xl">Shirooo.</p></div>
          <div className="pt-10"><button type="button" onClick={() => setCelebrating(true)} className="border border-gold/40 px-10 py-4 text-xs uppercase tracking-[0.24em] text-gold transition duration-500 hover:bg-gold hover:text-midnight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">Make a wish</button></div>
        </div>
        <footer className="absolute inset-x-0 bottom-8 text-center"><p className="text-[0.6rem] uppercase tracking-[0.24em] text-silk/30">Handcrafted with love · 2026</p></footer>
      </section>
    </main>
  );
}
