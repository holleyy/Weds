import { useNavigate } from "react-router";
import { Trophy, Vote, Users, BarChart3, Film, Sparkles, Lock, Star, Crown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CEREMONY_TIME, LOCK_TIME } from "../data/ceremony";
import { categories } from "../data/categories";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const API = `https://${projectId}.supabase.co/functions/v1/make-server-02e825ae`;
const HEADERS = { Authorization: `Bearer ${publicAnonKey}` };

// ── Confetti ────────────────────────────────────────────────────────────────

function fireConfetti(originEl: HTMLElement) {
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const rect = originEl.getBoundingClientRect();
  const ox = rect.left + rect.width / 2;
  const oy = rect.top + rect.height / 2;

  const COLORS = ["#f59e0b", "#fbbf24", "#fcd34d", "#ffffff", "#f97316", "#ec4899", "#a78bfa", "#34d399"];

  type Shape = "rect" | "circle";
  const particles = Array.from({ length: 130 }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 9;
    return {
      x: ox, y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.22,
      maxLife: 100 + Math.floor(Math.random() * 80),
      shape: (Math.random() > 0.5 ? "rect" : "circle") as Shape,
    };
  });

  let frame = 0;
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of particles) {
      p.vy += 0.18;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      const life = Math.max(0, 1 - frame / p.maxLife);
      if (life <= 0) continue;
      alive = true;
      ctx.save();
      ctx.globalAlpha = life;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    frame++;
    if (alive) requestAnimationFrame(tick);
    else canvas.remove();
  }
  requestAnimationFrame(tick);
}

// ── Countdown ───────────────────────────────────────────────────────────────

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDiff(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return diff;
}

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-3xl sm:text-4xl font-bold tabular-nums tracking-tight text-foreground">
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
        {label}
      </div>
    </div>
  );
}

function CeremonyCountdown() {
  const msUntilCeremony = useCountdown(CEREMONY_TIME);
  const msUntilLock = useCountdown(LOCK_TIME);
  const ceremonyStarted = msUntilCeremony <= 0;
  const isLocked = msUntilLock <= 0;

  const gmtString = CEREMONY_TIME.toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit", timeZone: "UTC", hour12: false,
  });
  const dateString = CEREMONY_TIME.toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });

  if (ceremonyStarted) {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 mb-8 text-center">
        <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
        <p className="text-base font-semibold text-foreground">The ceremony has begun!</p>
        <p className="text-sm text-muted-foreground mt-1">Watch the results come in on the Stats page</p>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 mb-8 text-center">
        <Lock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
        <p className="text-base font-semibold text-amber-300">Ballots are locked</p>
        <p className="text-sm text-muted-foreground mt-1">
          Ceremony starts at {gmtString} GMT — good luck!
        </p>
      </div>
    );
  }

  const totalSeconds = Math.floor(msUntilCeremony / 1000);
  const days    = Math.floor(totalSeconds / 86400);
  const hours   = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const lockSeconds = Math.floor(msUntilLock / 1000);
  const lockHours   = Math.floor(lockSeconds / 3600);
  const lockMins    = Math.floor((lockSeconds % 3600) / 60);

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-7 mb-8">
      <div className="flex items-center gap-2 mb-5">
        <Trophy className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Ceremony Countdown
        </span>
      </div>
      <div className="flex items-start justify-center gap-3 sm:gap-5 mb-5">
        {days > 0 && (
          <>
            <CountdownUnit value={pad(days)} label="days" />
            <div className="text-2xl font-light text-muted-foreground/40 mt-1">:</div>
          </>
        )}
        <CountdownUnit value={pad(hours)} label="hrs" />
        <div className="text-2xl font-light text-muted-foreground/40 mt-1">:</div>
        <CountdownUnit value={pad(minutes)} label="mins" />
        <div className="text-2xl font-light text-muted-foreground/40 mt-1">:</div>
        <CountdownUnit value={pad(seconds)} label="secs" />
      </div>
      <div className="text-center border-t border-border/50 pt-4 space-y-0.5">
        <p className="text-sm font-medium text-foreground">{dateString}</p>
        <p className="text-sm text-muted-foreground">{gmtString} GMT</p>
      </div>
      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground/70">
        <Lock className="w-3 h-3" />
        <span>
          Ballots lock in{" "}
          <span className="text-foreground font-medium">
            {lockHours > 0 ? `${lockHours}h ${pad(lockMins)}m` : `${lockMins}m`}
          </span>
        </span>
      </div>
    </div>
  );
}

// ── Types ────────────────────────────────────────────────────────────────────

interface WinnersMap { [categoryId: string]: string }
interface Ballot {
  userId: string;
  username: string;
  ballot: { [categoryId: string]: { willWin: string; shouldWin: string } };
}

function computeScore(ballot: Ballot["ballot"], winners: WinnersMap) {
  let correct = 0;
  for (const catId of Object.keys(winners)) {
    if (ballot[catId]?.willWin === winners[catId]) correct++;
  }
  return correct;
}

// ── Main ─────────────────────────────────────────────────────────────────────

export function HomePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [winners, setWinners] = useState<WinnersMap>({});
  const [ballots, setBallots] = useState<Ballot[]>([]);
  const poolBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("oscarUser");
    if (storedUser) setUsername(JSON.parse(storedUser).username);
  }, []);

  useEffect(() => {
    Promise.allSettled([
      fetch(`${API}/winners`, { headers: HEADERS }).then((r) => r.json()),
      fetch(`${API}/ballots/submitted`, { headers: HEADERS }).then((r) => r.json()),
    ]).then(([winnersResult, ballotsResult]) => {
      if (winnersResult.status === "fulfilled" && winnersResult.value.winners)
        setWinners(winnersResult.value.winners);
      if (ballotsResult.status === "fulfilled" && ballotsResult.value.ballots)
        setBallots(ballotsResult.value.ballots);
    });
  }, []);

  const decidedCount = Object.keys(winners).length;
  const allDecided = decidedCount === categories.length;
  const announcedWinners = categories.filter((c) => winners[c.id]);

  // Pool leaders / winners
  const poolLeaders = (() => {
    if (decidedCount === 0 || ballots.length === 0) return [];
    const scored = ballots.map((b) => ({ username: b.username, score: computeScore(b.ballot, winners) }));
    const best = Math.max(...scored.map((s) => s.score));
    return scored.filter((s) => s.score === best).map((s) => ({ ...s, total: decidedCount }));
  })();

  const actions = [
    { title: "Your Ballot", description: "Create or edit your Oscar predictions", icon: Vote, path: "/ballot", accent: true, requiresAuth: true },
    { title: "Film Log", description: "Track which nominated films you've watched", icon: Film, path: "/film-log", accent: true, requiresAuth: true },
    { title: "View Ballots", description: "See predictions from other participants", icon: Users, path: "/view-ballots", accent: false, requiresAuth: false },
    { title: "Statistics", description: "See how everyone is voting across categories", icon: BarChart3, path: "/stats", accent: false, requiresAuth: false },
  ];

  return (
    <div className="max-w-3xl mx-auto pb-24 sm:pb-8">
      {/* Welcome */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-primary mb-2 font-medium">
          98th Academy Awards
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          {username ? `Welcome, ${username}` : "Oscars Sweepstakes"}
        </h1>
      </div>

      {/* Countdown */}
      <CeremonyCountdown />

      {/* Pool leaders / winners */}
      {poolLeaders.length > 0 && (
        <div
          ref={poolBoxRef}
          onClick={() => poolBoxRef.current && fireConfetti(poolBoxRef.current)}
          className="mb-8 rounded-xl border-2 border-amber-400/60 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-amber-500/10 p-5 cursor-pointer select-none transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-amber-400">
              {allDecided ? "Pool Winner" : "Leading the Pool"}
              {poolLeaders.length > 1 ? "s" : ""}
            </h2>
            <span className="ml-auto text-xs text-amber-400/60 font-medium">
              {poolLeaders[0].score} / {decidedCount} correct
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {poolLeaders.map(({ username: name }) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-100 font-semibold text-sm"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                {name}
              </span>
            ))}
          </div>

          <p className="mt-3 text-[11px] text-amber-400/40 text-center">
            tap for a surprise ✨
          </p>
        </div>
      )}

      {/* Category winners */}
      {announcedWinners.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-400">
              Winners Announced
            </h2>
            <span className="text-xs text-muted-foreground ml-auto">
              {announcedWinners.length} / {categories.length}
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {announcedWinners.map((cat) => {
              const nominee = cat.nominees.find((n) => n.id === winners[cat.id]);
              if (!nominee) return null;
              return (
                <div
                  key={cat.id}
                  className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 flex items-start gap-3"
                >
                  <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs text-amber-400/70 font-medium uppercase tracking-wide truncate">
                      {cat.name}
                    </p>
                    <p className="text-sm font-semibold text-amber-100 leading-snug">
                      {nominee.name}
                    </p>
                    {nominee.film !== nominee.name && (
                      <p className="text-xs text-muted-foreground truncate">{nominee.film}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Grid */}
      <div className="grid gap-3 sm:grid-cols-2 mb-10">
        {actions.map(({ title, description, icon: Icon, path, accent, requiresAuth }) => {
          const locked = requiresAuth && !username;
          return (
            <button
              key={path}
              onClick={() => navigate(locked ? "/login" : path)}
              className="group text-left rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:bg-card/80"
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  accent && !locked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {locked ? <Lock className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {locked ? "Sign in to access" : description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* How it works */}
      <div className="rounded-xl border border-border bg-card/50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">How it works</h3>
        </div>
        <ul className="text-sm text-muted-foreground space-y-1.5 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-primary/60 mt-0.5">1.</span>
            Pick your predictions for each category
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary/60 mt-0.5">2.</span>
            Choose who you think <span className="text-foreground font-medium">will win</span> and who <span className="text-foreground font-medium">should win</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary/60 mt-0.5">3.</span>
            Save your progress anytime, submit when ready
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary/60 mt-0.5">4.</span>
            Compare your picks with friends and see live stats
          </li>
        </ul>
      </div>
    </div>
  );
}
