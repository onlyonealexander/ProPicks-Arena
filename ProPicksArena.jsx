import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Flame, Trophy, Target, Circle, Award, Gamepad2, Wallet, User, ShieldCheck,
  LogOut, LogIn, UserPlus, Plus, Minus, X, Check, Clock, TrendingUp, Settings,
  Ticket, ChevronRight, ChevronDown, RotateCcw, Lock, AlertCircle, CheckCircle2,
  Trash2, Ban, Sparkles, Radio, LayoutGrid, Phone, Mail, MapPin, Facebook,
  Twitter, Linkedin, HelpCircle, Info, MessageSquare, Send, ShieldAlert,
  FileText, Dice5
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/* constants + helpers                                                    */
/* ---------------------------------------------------------------------- */

const SPORTS = [
  { id: "all", label: "All Sports", icon: Flame },
  { id: "football", label: "Football", icon: Trophy },
  { id: "basketball", label: "Basketball", icon: Target },
  { id: "tennis", label: "Tennis", icon: Circle },
  { id: "cricket", label: "Cricket", icon: Award },
  { id: "esports", label: "Esports", icon: Gamepad2 },
  { id: "casino", label: "Casino", icon: Dice5 },
];

const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "upcoming", label: "Upcoming" },
  { id: "results", label: "Results" },
];

const COUNTRIES = [
  { code: "NG", name: "Nigeria", dial: "+234" }, { code: "US", name: "United States", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" }, { code: "CA", name: "Canada", dial: "+1" },
  { code: "GH", name: "Ghana", dial: "+233" }, { code: "KE", name: "Kenya", dial: "+254" },
  { code: "ZA", name: "South Africa", dial: "+27" }, { code: "EG", name: "Egypt", dial: "+20" },
  { code: "IN", name: "India", dial: "+91" }, { code: "PK", name: "Pakistan", dial: "+92" },
  { code: "BD", name: "Bangladesh", dial: "+880" }, { code: "AE", name: "United Arab Emirates", dial: "+971" },
  { code: "SA", name: "Saudi Arabia", dial: "+966" }, { code: "DE", name: "Germany", dial: "+49" },
  { code: "FR", name: "France", dial: "+33" }, { code: "IT", name: "Italy", dial: "+39" },
  { code: "ES", name: "Spain", dial: "+34" }, { code: "PT", name: "Portugal", dial: "+351" },
  { code: "NL", name: "Netherlands", dial: "+31" }, { code: "BE", name: "Belgium", dial: "+32" },
  { code: "SE", name: "Sweden", dial: "+46" }, { code: "NO", name: "Norway", dial: "+47" },
  { code: "DK", name: "Denmark", dial: "+45" }, { code: "FI", name: "Finland", dial: "+358" },
  { code: "PL", name: "Poland", dial: "+48" }, { code: "IE", name: "Ireland", dial: "+353" },
  { code: "CH", name: "Switzerland", dial: "+41" }, { code: "AT", name: "Austria", dial: "+43" },
  { code: "GR", name: "Greece", dial: "+30" }, { code: "TR", name: "Turkey", dial: "+90" },
  { code: "RU", name: "Russia", dial: "+7" }, { code: "UA", name: "Ukraine", dial: "+380" },
  { code: "CN", name: "China", dial: "+86" }, { code: "JP", name: "Japan", dial: "+81" },
  { code: "KR", name: "South Korea", dial: "+82" }, { code: "SG", name: "Singapore", dial: "+65" },
  { code: "MY", name: "Malaysia", dial: "+60" }, { code: "ID", name: "Indonesia", dial: "+62" },
  { code: "PH", name: "Philippines", dial: "+63" }, { code: "TH", name: "Thailand", dial: "+66" },
  { code: "VN", name: "Vietnam", dial: "+84" }, { code: "AU", name: "Australia", dial: "+61" },
  { code: "NZ", name: "New Zealand", dial: "+64" }, { code: "BR", name: "Brazil", dial: "+55" },
  { code: "AR", name: "Argentina", dial: "+54" }, { code: "MX", name: "Mexico", dial: "+52" },
  { code: "CO", name: "Colombia", dial: "+57" }, { code: "CL", name: "Chile", dial: "+56" },
  { code: "JM", name: "Jamaica", dial: "+1" }, { code: "MA", name: "Morocco", dial: "+212" },
  { code: "DZ", name: "Algeria", dial: "+213" }, { code: "ET", name: "Ethiopia", dial: "+251" },
  { code: "TZ", name: "Tanzania", dial: "+255" }, { code: "UG", name: "Uganda", dial: "+256" },
  { code: "CI", name: "Cote d'Ivoire", dial: "+225" }, { code: "SN", name: "Senegal", dial: "+221" },
];

const WHEEL_SEGMENTS = [
  { mult: 0, label: "0x" }, { mult: 1.5, label: "1.5x" }, { mult: 0, label: "0x" }, { mult: 2, label: "2x" },
  { mult: 1, label: "1x" }, { mult: 0, label: "0x" }, { mult: 3, label: "3x" }, { mult: 5, label: "5x" },
];

const LEGAL_DOCS = {
  terms: {
    title: "Terms & Conditions", icon: FileText, body: [
      "By creating an account on ProPicks Arena you agree to use the platform for its intended purpose: browsing fixtures, building slips, and tracking outcomes using Arena Credits.",
      "Accounts are personal and non-transferable. You are responsible for the activity that happens under your username and password.",
      "The platform administrator sets and updates odds, settles event results, and may adjust, suspend, or reinstate accounts at their discretion.",
      "These terms may be updated from time to time. Continued use of the platform after a change means you accept the updated terms.",
    ],
  },
  privacy: {
    title: "Privacy Policy", icon: FileText, body: [
      "ProPicks Arena stores the account details you provide at registration — username, password, and phone number — along with your wallet balance and betting activity.",
      "This information is used only to operate your account: signing you in, showing your balance, and settling your bets.",
      "We do not sell account information to third parties. Site administrators can view player activity in order to manage the platform.",
      "You can ask to have your account data reset at any time through support.",
    ],
  },
  responsible: {
    title: "Responsible Gaming", icon: ShieldAlert, body: [
      "ProPicks Arena runs on Arena Credits, and every account starts with a fixed balance you can top up from the wallet page.",
      "Set yourself limits on how much time and how many credits you commit to a session, the same way you would with any game.",
      "You must be 18 or older to hold an account.",
      "If a pattern of play stops feeling fun, step away and come back later — the fixtures and odds will still be here.",
    ],
  },
};

const sportMeta = (id) => SPORTS.find((s) => s.id === id) || SPORTS[0];

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function money(n) {
  const v = Number(n) || 0;
  return v.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function randomPassword() {
  return Math.random().toString(36).slice(2, 10);
}

function marketsFor(sport, teamA, teamB) {
  if (sport === "football") {
    return [{ key: "A", label: teamA }, { key: "DRAW", label: "Draw" }, { key: "B", label: teamB }];
  }
  return [{ key: "A", label: teamA }, { key: "B", label: teamB }];
}

function wheelBackground() {
  const seg = 100 / WHEEL_SEGMENTS.length;
  const stops = WHEEL_SEGMENTS.map((s, i) => `${i % 2 === 0 ? "#123028" : "#173d32"} ${i * seg}% ${(i + 1) * seg}%`);
  return `conic-gradient(${stops.join(",")})`;
}

function seedUsers() {
  return [
    { id: "admin", username: "admin", password: "admin123", role: "admin", phone: "", balance: 0, status: "active", createdAt: Date.now() },
  ];
}

function seedEvents() {
  const now = Date.now();
  return [
    { id: "e1", sport: "football", league: "Emberline Premier League", teamA: "Ironclad FC", teamB: "Meridian United", kickoff: "Today, 19:30", status: "upcoming", odds: { A: 2.1, DRAW: 3.25, B: 3.4 }, score: null, result: null },
    { id: "e2", sport: "football", league: "Emberline Premier League", teamA: "Solheim Rangers", teamB: "Vulcan City", kickoff: "Live now", status: "live", odds: { A: 1.95, DRAW: 3.5, B: 3.9 }, score: { a: 1, b: 0, clock: "63'" }, result: null },
    { id: "e3", sport: "football", league: "Continental Cup", teamA: "Northgate Athletic", teamB: "Obsidian FC", kickoff: "Tomorrow, 15:00", status: "upcoming", odds: { A: 2.6, DRAW: 3.1, B: 2.7 }, score: null, result: null },
    { id: "e4", sport: "basketball", league: "Metro Hoops League", teamA: "Skyline Hawks", teamB: "Granite Bears", kickoff: "Live now", status: "live", odds: { A: 1.7, B: 2.15 }, score: { a: 58, b: 54, clock: "Q3" }, result: null },
    { id: "e5", sport: "basketball", league: "Metro Hoops League", teamA: "Foundry Sparks", teamB: "Harbor Kings", kickoff: "Today, 21:00", status: "upcoming", odds: { A: 1.9, B: 1.95 }, score: null, result: null },
    { id: "e6", sport: "tennis", league: "Aurelia Open", teamA: "A. Marlowe", teamB: "D. Petrov", kickoff: "Today, 13:00", status: "upcoming", odds: { A: 1.55, B: 2.45 }, score: null, result: null },
    { id: "e7", sport: "tennis", league: "Aurelia Open", teamA: "L. Voss", teamB: "R. Aoki", kickoff: "Today, 16:30", status: "upcoming", odds: { A: 2.05, B: 1.8 }, score: null, result: null },
    { id: "e8", sport: "cricket", league: "Coastal T20 Trophy", teamA: "Coastal Strikers", teamB: "Highland Titans", kickoff: "Tomorrow, 09:30", status: "upcoming", odds: { A: 1.85, B: 1.95 }, score: null, result: null },
    { id: "e9", sport: "esports", league: "Nova Circuit", teamA: "Nova Dragons", teamB: "Iron Sentinels", kickoff: "Today, 22:00", status: "upcoming", odds: { A: 1.6, B: 2.3 }, score: null, result: null },
    { id: "e10", sport: "esports", league: "Nova Circuit", teamA: "Phantom Vipers", teamB: "Crimson Circuit", kickoff: "Live now", status: "live", odds: { A: 2.4, B: 1.55 }, score: { a: 1, b: 1, clock: "Map 3" }, result: null },
  ].map((e) => ({ ...e, createdAt: now }));
}

function seedSiteContent() {
  return {
    about:
      "ProPicks Arena is a sportsbook built around clear fixtures, live odds, and a slip you can build in a couple of taps. Every match is grouped by league so you can move from browsing to betting without digging through menus.\n\nOdds update the moment the admin console changes them, and live matches carry a running score so you can follow the action without leaving the page.\n\nPast fixtures move into Results once they're settled, so you always have a record of how a match closed and how your slip landed on it.",
    contact: { email: "support@propicksarena.com", phone: "+1 (555) 019-2842", address: "14 Meridian Row, Remote-First" },
    banners: [
      { sport: "football", title: "Football", subtitle: "Every major kickoff, priced and ready." },
      { sport: "cricket", title: "Cricket", subtitle: "T20 slates with live-updating odds." },
      { sport: "casino", title: "Casino", subtitle: "Spin the Lucky Wheel between matches." },
    ],
    faqItems: [
      { id: "f1", q: "Does it cost anything to register?", a: "No. Creating an account is free and starts you off with an Arena Credits balance." },
      { id: "f2", q: "How do I build a bet slip?", a: "Tap any odds button on a fixture to add it to your slip, set a stake, then place the bet from the slip panel." },
      { id: "f3", q: "How do I recover my account?", a: "Use \"Forgot password?\" on the login form and enter your username to get a new password." },
      { id: "f4", q: "What's the minimum age to hold an account?", a: "You must be 18 or older to register and use the platform." },
      { id: "f5", q: "Why did my bet settle as lost when the odds looked right?", a: "Bets settle against the final result the admin console records for that fixture. Check the Results tab for the confirmed outcome." },
    ],
  };
}

async function safeGet(key, shared) {
  try {
    return await window.storage.get(key, shared);
  } catch (e) {
    return null;
  }
}

/* ---------------------------------------------------------------------- */
/* small shared bits                                                      */
/* ---------------------------------------------------------------------- */

function Logo() {
  return (
    <div className="brand">
      <span className="brand-mark"><Target size={18} /></span>
      <span className="brand-word">Pro<em>Picks</em> Arena</span>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === "live") return <span className="badge badge-live"><Radio size={11} /> LIVE</span>;
  if (status === "finished") return <span className="badge badge-final">FINAL</span>;
  return <span className="badge badge-upcoming"><Clock size={11} /> Upcoming</span>;
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`toast ${toast.type === "error" ? "toast-error" : "toast-ok"}`}>
      {toast.type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
      <span>{toast.msg}</span>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* score ticker                                                           */
/* ---------------------------------------------------------------------- */

function ScoreTicker({ events }) {
  const live = events.filter((e) => e.status === "live");
  const items = live.length ? live : events.slice(0, 6);
  const doubled = [...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {doubled.map((e, i) => (
          <div className="ticker-item" key={i}>
            <span className="ticker-dot" />
            <span className="ticker-teams">{e.teamA} <em>vs</em> {e.teamB}</span>
            {e.score ? (
              <span className="ticker-score">
                <span className="flap">{e.score.a}</span>
                <span className="flap-sep">:</span>
                <span className="flap">{e.score.b}</span>
                <span className="ticker-clock">{e.score.clock}</span>
              </span>
            ) : (
              <span className="ticker-score ticker-time">{e.kickoff}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* event card                                                             */
/* ---------------------------------------------------------------------- */

function EventCard({ event, slip, onToggle }) {
  const markets = marketsFor(event.sport, event.teamA, event.teamB);
  const meta = sportMeta(event.sport);
  const closed = event.status === "finished";
  const selectedKey = slip.find((s) => s.eventId === event.id)?.market;

  return (
    <div className={`event-card ${closed ? "event-closed" : ""}`}>
      <div className="event-top">
        <span className="event-eyebrow"><meta.icon size={12} /> {event.league}</span>
        <StatusBadge status={event.status} />
      </div>
      <div className="event-mid">
        <div className="event-teams">
          <span className="team-name">{event.teamA}</span>
          <span className="event-vs">vs</span>
          <span className="team-name">{event.teamB}</span>
        </div>
        <div className="event-when">
          {event.status === "live" && event.score
            ? <span className="live-score">{event.score.a} – {event.score.b} <em>{event.score.clock}</em></span>
            : event.status === "finished"
              ? <span className="final-result">Result: {event.result === "DRAW" ? "Draw" : event.result === "A" ? event.teamA : event.teamB}</span>
              : <span>{event.kickoff}</span>}
        </div>
      </div>
      <div className="odds-row">
        {markets.map((m) => (
          <button
            key={m.key}
            disabled={closed}
            className={`odds-btn ${selectedKey === m.key ? "odds-btn-active" : ""}`}
            onClick={() => onToggle(event, m.key, m.label)}
          >
            <span className="odds-label">{m.label}</span>
            <span className="odds-value">{event.odds[m.key]?.toFixed(2)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* bet slip                                                               */
/* ---------------------------------------------------------------------- */

function BetSlip({ slip, onRemove, onStake, onClear, onPlace, open, onCloseMobile, loggedIn }) {
  const total = slip.reduce((a, s) => a + (Number(s.stake) || 0), 0);
  const potential = slip.reduce((a, s) => a + (Number(s.stake) || 0) * s.odds, 0);

  return (
    <aside className={`betslip ${open ? "betslip-open" : ""}`}>
      <div className="betslip-head">
        <span><Ticket size={16} /> Bet Slip <span className="betslip-count">{slip.length}</span></span>
        <button className="icon-btn mobile-only" onClick={onCloseMobile}><X size={16} /></button>
      </div>

      {slip.length === 0 ? (
        <div className="betslip-empty">
          <Ticket size={26} />
          <p>Tap any odds to start a slip.</p>
        </div>
      ) : (
        <>
          <div className="betslip-list">
            {slip.map((s) => (
              <div className="slip-item" key={s.id}>
                <div className="slip-item-top">
                  <div>
                    <div className="slip-event">{s.eventLabel}</div>
                    <div className="slip-pick">{s.label} <span className="slip-odds">@ {s.odds.toFixed(2)}</span></div>
                  </div>
                  <button className="icon-btn" onClick={() => onRemove(s.id)}><X size={14} /></button>
                </div>
                <div className="slip-stake-row">
                  <span className="slip-currency">AC</span>
                  <input type="number" min="1" className="slip-stake-input" value={s.stake} onChange={(e) => onStake(s.id, e.target.value)} />
                  <span className="slip-to-win">wins {money((Number(s.stake) || 0) * s.odds)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="ticket-perf" />

          <div className="betslip-foot">
            <div className="betslip-row"><span>Total stake</span><strong>{money(total)} AC</strong></div>
            <div className="betslip-row"><span>Potential payout</span><strong className="gold-text">{money(potential)} AC</strong></div>
            <button className="btn btn-gold btn-block" onClick={onPlace}>{loggedIn ? "Place bet" : "Log in to place bet"}</button>
            <button className="btn-link" onClick={onClear}>Clear slip</button>
          </div>
        </>
      )}
    </aside>
  );
}

/* ---------------------------------------------------------------------- */
/* auth modal                                                             */
/* ---------------------------------------------------------------------- */

function AuthModal({ open, mode, setMode, onClose, onLogin, onRegister, onForgotPassword, error, clearError, rememberedUsername }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("NG");
  const [phone, setPhone] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [resetOutput, setResetOutput] = useState(null);

  useEffect(() => {
    if (open) {
      setPassword(""); setResetOutput(null); clearError();
      setUsername(mode === "login" ? (rememberedUsername || "") : "");
    }
  }, [open, mode]);

  if (!open) return null;

  function submit(e) {
    e.preventDefault();
    if (mode === "login") onLogin(username, password, rememberMe);
    else if (mode === "register") {
      const dial = COUNTRIES.find((c) => c.code === countryCode)?.dial || "";
      onRegister(username, password, `${dial} ${phone}`.trim());
    } else if (mode === "forgot") {
      const result = onForgotPassword(username);
      if (result) setResetOutput(result);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <button type="button" className="icon-btn modal-close" onClick={onClose}><X size={16} /></button>
        <div className="modal-head">
          <span className="brand-mark"><Target size={16} /></span>
          <h2>{mode === "login" ? "Log in" : mode === "register" ? "Create your account" : "Reset password"}</h2>
          <p className="muted">
            {mode === "login" ? "Pick up where you left off." : mode === "register" ? "Starts you off with 1,000 Arena Credits." : "Enter your username and we'll issue a new password."}
          </p>
        </div>

        {resetOutput ? (
          <div className="reset-output">
            <p className="muted small">Your new password:</p>
            <div className="reset-code">{resetOutput}</div>
            <button type="button" className="btn btn-gold btn-block" onClick={() => { setMode("login"); }}>Back to log in</button>
          </div>
        ) : (
          <>
            <label className="field-label">Username</label>
            <input className="field" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. courtside_jay" autoFocus />

            {mode === "register" && (
              <>
                <label className="field-label">Phone number</label>
                <div className="phone-row">
                  <select className="field field-country" value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
                    {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name} ({c.dial})</option>)}
                  </select>
                  <input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
                </div>
              </>
            )}

            {mode !== "forgot" && (
              <>
                <label className="field-label">Password</label>
                <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </>
            )}

            {mode === "login" && (
              <div className="remember-row">
                <label className="remember-check">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  Remember me
                </label>
                <button type="button" className="forgot-link" onClick={() => setMode("forgot")}>Forgot password?</button>
              </div>
            )}

            {error && <div className="form-error"><AlertCircle size={14} /> {error}</div>}

            <button className="btn btn-gold btn-block" type="submit">
              {mode === "login" ? <><LogIn size={15} /> Log in</> : mode === "register" ? <><UserPlus size={15} /> Create account</> : <><Lock size={15} /> Reset password</>}
            </button>

            <p className="modal-switch">
              {mode === "login" && <>Don't have an account? <button type="button" onClick={() => setMode("register")}>Create one</button></>}
              {mode === "register" && <>Already playing? <button type="button" onClick={() => setMode("login")}>Log in</button></>}
              {mode === "forgot" && <>Remembered it? <button type="button" onClick={() => setMode("login")}>Log in</button></>}
            </p>
          </>
        )}
      </form>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* wallet                                                                 */
/* ---------------------------------------------------------------------- */

function WalletView({ user, onTopUp }) {
  const [amount, setAmount] = useState("100");
  const presets = [100, 500, 1000, 2500];

  return (
    <div className="page">
      <h1 className="page-title">Wallet</h1>
      <p className="muted">Manage your Arena Credits balance below.</p>

      <div className="wallet-balance-card">
        <span className="wallet-label">Current balance</span>
        <span className="wallet-amount">{money(user.balance)} <em>AC</em></span>
      </div>

      <div className="card">
        <h3><Sparkles size={15} /> Add credits</h3>
        <div className="preset-row">
          {presets.map((p) => <button key={p} className="chip" onClick={() => onTopUp(p)}>+{p} AC</button>)}
        </div>
        <div className="topup-custom">
          <input className="field" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <button className="btn btn-ghost" onClick={() => onTopUp(Number(amount) || 0)}>Add custom amount</button>
        </div>
        <div className="fake-card">
          <div className="fake-card-row"><span>Card number</span><span className="fake-card-input">•••• •••• •••• 4242</span></div>
          <div className="fake-card-row"><span>Expiry / CVV</span><span className="fake-card-input">12/29 &nbsp; •••</span></div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* my bets                                                                */
/* ---------------------------------------------------------------------- */

function MyBetsView({ bets }) {
  const sorted = [...bets].sort((a, b) => b.placedAt - a.placedAt);
  return (
    <div className="page">
      <h1 className="page-title">My Bets</h1>
      {sorted.length === 0 ? (
        <div className="empty-block"><Ticket size={28} /><p>No bets placed yet. Head to the sportsbook and build a slip.</p></div>
      ) : (
        <div className="bets-list">
          {sorted.map((b) => (
            <div className="bet-row" key={b.id}>
              <div>
                <div className="bet-event">{b.eventLabel}</div>
                <div className="bet-pick muted small">{b.label} @ {b.odds.toFixed(2)} · {new Date(b.placedAt).toLocaleString()}</div>
              </div>
              <div className="bet-figures">
                <span className="muted small">Stake {money(b.stake)} AC</span>
                <span className={`badge badge-${b.status}`}>
                  {b.status === "pending" ? "Pending" : b.status === "won" ? `Won ${money(b.potentialWin)} AC` : "Lost"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* casino                                                                 */
/* ---------------------------------------------------------------------- */

function CasinoView({ currentUser, onSpin, showAuth }) {
  const [stake, setStake] = useState("25");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  function handleSpin() {
    if (!currentUser) { showAuth(); return; }
    const amt = Number(stake) || 0;
    if (amt <= 0 || spinning) return;
    if (amt > currentUser.balance) { onSpin(null, amt, "insufficient"); return; }

    const idx = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const segAngle = 360 / WHEEL_SEGMENTS.length;
    const targetCenter = idx * segAngle + segAngle / 2;
    const spins = 5;
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta = (360 - targetCenter) - currentMod + spins * 360;

    setSpinning(true);
    setRotation(rotation + delta);
    setTimeout(() => { onSpin(WHEEL_SEGMENTS[idx], amt, "ok"); setSpinning(false); }, 3200);
  }

  return (
    <div className="page">
      <h1 className="page-title"><Dice5 size={20} className="gold-text" /> Casino</h1>
      <p className="muted">Quick-play games on the same Arena Credits balance as your sportsbook.</p>

      <div className="casino-grid">
        <div className="card wheel-card">
          <h3>Lucky Wheel</h3>
          <div className="wheel-wrap">
            <div className="wheel-pointer" />
            <div className="wheel" style={{ background: wheelBackground(), transform: `rotate(${rotation}deg)` }}>
              {WHEEL_SEGMENTS.map((s, i) => {
                const segAngle = 360 / WHEEL_SEGMENTS.length;
                const angle = i * segAngle + segAngle / 2;
                return (
                  <span className="wheel-label" key={i} style={{ transform: `rotate(${angle}deg) translate(0, -84px) rotate(${-angle}deg)` }}>
                    {s.label}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="wheel-controls">
            <span className="slip-currency">AC</span>
            <input className="field field-sm" type="number" min="1" value={stake} onChange={(e) => setStake(e.target.value)} />
            <button className="btn btn-gold" disabled={spinning} onClick={handleSpin}>{spinning ? "Spinning…" : "Spin"}</button>
          </div>
        </div>

        {["Blackjack", "Roulette", "Slots"].map((g) => (
          <div className="card game-card-soon" key={g}>
            <h3>{g}</h3>
            <span className="badge badge-upcoming">Coming soon</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* about / faq / contact / legal                                         */
/* ---------------------------------------------------------------------- */

function AboutPage({ about }) {
  const paragraphs = about.split("\n\n");
  const testimonials = [
    { name: "Marcus Odei", role: "Regular player", quote: "Odds update fast and my slips settle right after the final whistle." },
    { name: "Priya Nandan", role: "Weekend bettor", quote: "The layout keeps every match easy to scan, even during a busy live slate." },
    { name: "Theo Vance", role: "Esports fan", quote: "Support answers quickly whenever I have a question about a settled bet." },
  ];
  return (
    <div className="page">
      <h1 className="page-title"><Info size={20} className="gold-text" /> About Us</h1>
      {paragraphs.map((p, i) => <p className="about-p" key={i}>{p}</p>)}
      <h2 className="section-heading">What players say</h2>
      <div className="testimonial-grid">
        {testimonials.map((t) => (
          <div className="testimonial-card" key={t.name}>
            <p>"{t.quote}"</p>
            <strong>{t.name}</strong>
            <span className="muted small">{t.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqPage({ items }) {
  const [openId, setOpenId] = useState(items[0]?.id || null);
  return (
    <div className="page">
      <h1 className="page-title"><HelpCircle size={20} className="gold-text" /> Frequently Asked Questions</h1>
      <div className="faq-list">
        {items.map((it) => (
          <div className="faq-item" key={it.id}>
            <button className="faq-q" onClick={() => setOpenId(openId === it.id ? null : it.id)}>
              {it.q}
              <ChevronDown size={16} className={openId === it.id ? "chevron-open" : ""} />
            </button>
            {openId === it.id && <div className="faq-a">{it.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactPage({ contact, onSend }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    onSend();
    setForm({ name: "", email: "", message: "" });
  }
  return (
    <div className="page">
      <h1 className="page-title"><MessageSquare size={20} className="gold-text" /> Contact</h1>
      <div className="contact-grid">
        <div className="card">
          <h3><Mail size={15} /> Reach us</h3>
          <p className="contact-line"><Mail size={14} /> {contact.email}</p>
          <p className="contact-line"><Phone size={14} /> {contact.phone}</p>
          <p className="contact-line"><MapPin size={14} /> {contact.address}</p>
        </div>
        <form className="card" onSubmit={submit}>
          <h3>Send a message</h3>
          <input className="field" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="field" placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <textarea className="field textarea" placeholder="How can we help?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button className="btn btn-gold" type="submit"><Send size={14} /> Send message</button>
        </form>
      </div>
    </div>
  );
}

function LegalPage({ docId }) {
  const doc = LEGAL_DOCS[docId] || LEGAL_DOCS.terms;
  return (
    <div className="page">
      <h1 className="page-title"><doc.icon size={20} className="gold-text" /> {doc.title}</h1>
      {doc.body.map((p, i) => <p className="about-p" key={i}>{p}</p>)}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* footer                                                                 */
/* ---------------------------------------------------------------------- */

function Footer({ onNavigate, onSubscribe }) {
  const [email, setEmail] = useState("");
  function submit(e) {
    e.preventDefault();
    if (!email) return;
    onSubscribe();
    setEmail("");
  }
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Logo />
          <p className="muted small">A sportsbook for football, basketball, tennis, cricket, esports, and casino games.</p>
          <div className="footer-socials"><Facebook size={16} /><Twitter size={16} /><Linkedin size={16} /></div>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <button onClick={() => onNavigate("home")}>Sportsbook</button>
          <button onClick={() => onNavigate("about")}>About</button>
          <button onClick={() => onNavigate("faq")}>FAQ</button>
          <button onClick={() => onNavigate("contact")}>Contact</button>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <button onClick={() => onNavigate("legal", "terms")}>Terms & Conditions</button>
          <button onClick={() => onNavigate("legal", "privacy")}>Privacy Policy</button>
          <button onClick={() => onNavigate("legal", "responsible")}>Responsible Gaming</button>
        </div>
        <div className="footer-col">
          <h4>Stay updated</h4>
          <form className="newsletter-row" onSubmit={submit}>
            <input className="field field-sm newsletter-input" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="icon-btn" type="submit"><Send size={14} /></button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} ProPicks Arena. All rights reserved.</div>
    </footer>
  );
}

/* ---------------------------------------------------------------------- */
/* admin                                                                  */
/* ---------------------------------------------------------------------- */

function AdminOverview({ users, events, bets, onReset }) {
  const players = users.filter((u) => u.role !== "admin");
  const totalStaked = bets.reduce((a, b) => a + b.stake, 0);
  const liability = bets.filter((b) => b.status === "pending").reduce((a, b) => a + b.potentialWin, 0);
  const paidOut = bets.filter((b) => b.status === "won").reduce((a, b) => a + b.potentialWin, 0);
  const openEvents = events.filter((e) => e.status !== "finished").length;

  const stats = [
    { label: "Players", value: players.length, icon: User },
    { label: "Bets placed", value: bets.length, icon: Ticket },
    { label: "Total staked", value: `${money(totalStaked)} AC`, icon: TrendingUp },
    { label: "Open liability", value: `${money(liability)} AC`, icon: AlertCircle },
    { label: "Paid out", value: `${money(paidOut)} AC`, icon: CheckCircle2 },
    { label: "Open events", value: openEvents, icon: LayoutGrid },
  ];

  return (
    <div>
      <div className="admin-stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <s.icon size={16} className="gold-text" />
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="card danger-zone">
        <h3><RotateCcw size={15} /> Reset platform data</h3>
        <p className="muted small">Wipes every account, event, bet, and page of site content, then reseeds fresh sample data. Cannot be undone.</p>
        <button className="btn btn-danger" onClick={onReset}>Reset everything</button>
      </div>
    </div>
  );
}

function AdminEvents({ events, bets, onCreate, onUpdateOdds, onSettle, onDelete }) {
  const [form, setForm] = useState({ sport: "football", league: "", teamA: "", teamB: "", kickoff: "", oddsA: "2.00", oddsDraw: "3.20", oddsB: "2.00" });

  function submit(e) {
    e.preventDefault();
    if (!form.league || !form.teamA || !form.teamB || !form.kickoff) return;
    const odds = form.sport === "football"
      ? { A: Number(form.oddsA), DRAW: Number(form.oddsDraw), B: Number(form.oddsB) }
      : { A: Number(form.oddsA), B: Number(form.oddsB) };
    onCreate({ sport: form.sport, league: form.league, teamA: form.teamA, teamB: form.teamB, kickoff: form.kickoff, odds });
    setForm({ ...form, league: "", teamA: "", teamB: "" });
  }

  return (
    <div>
      <div className="card">
        <h3><Plus size={15} /> Create event</h3>
        <form onSubmit={submit} className="admin-form-grid">
          <select className="field" value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })}>
            {SPORTS.filter((s) => s.id !== "all" && s.id !== "casino").map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <input className="field" placeholder="League / tournament" value={form.league} onChange={(e) => setForm({ ...form, league: e.target.value })} />
          <input className="field" placeholder="Team / player A" value={form.teamA} onChange={(e) => setForm({ ...form, teamA: e.target.value })} />
          <input className="field" placeholder="Team / player B" value={form.teamB} onChange={(e) => setForm({ ...form, teamB: e.target.value })} />
          <input className="field" placeholder="Kickoff, e.g. Sat, 19:30" value={form.kickoff} onChange={(e) => setForm({ ...form, kickoff: e.target.value })} />
          <input className="field" type="number" step="0.01" placeholder="Odds A" value={form.oddsA} onChange={(e) => setForm({ ...form, oddsA: e.target.value })} />
          {form.sport === "football" && <input className="field" type="number" step="0.01" placeholder="Odds Draw" value={form.oddsDraw} onChange={(e) => setForm({ ...form, oddsDraw: e.target.value })} />}
          <input className="field" type="number" step="0.01" placeholder="Odds B" value={form.oddsB} onChange={(e) => setForm({ ...form, oddsB: e.target.value })} />
          <button className="btn btn-gold" type="submit">Add event</button>
        </form>
      </div>

      <h3 className="section-heading">All events</h3>
      <div className="admin-events-list">
        {events.map((ev) => {
          const hasBets = bets.some((b) => b.eventId === ev.id);
          const markets = marketsFor(ev.sport, ev.teamA, ev.teamB);
          return (
            <div className="admin-event-row" key={ev.id}>
              <div className="admin-event-info">
                <span className="event-eyebrow">{ev.league}</span>
                <strong>{ev.teamA} vs {ev.teamB}</strong>
                <StatusBadge status={ev.status} />
              </div>
              <div className="admin-event-odds">
                {markets.map((m) => (
                  <label key={m.key} className="odds-edit">
                    {m.label}
                    <input type="number" step="0.01" disabled={ev.status === "finished"} value={ev.odds[m.key]} onChange={(e) => onUpdateOdds(ev.id, m.key, e.target.value)} />
                  </label>
                ))}
              </div>
              <div className="admin-event-actions">
                {ev.status !== "finished" ? (
                  markets.map((m) => <button key={m.key} className="btn btn-ghost btn-sm" onClick={() => onSettle(ev.id, m.key)}>Settle: {m.label}</button>)
                ) : (
                  <span className="muted small">Settled — {ev.result === "DRAW" ? "Draw" : ev.result === "A" ? ev.teamA : ev.teamB}</span>
                )}
                <button className="icon-btn" title={hasBets ? "Can't delete — bets exist" : "Delete event"} disabled={hasBets} onClick={() => onDelete(ev.id)}><Trash2 size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminUsers({ users, onAdjust, onToggleSuspend }) {
  const [amounts, setAmounts] = useState({});
  return (
    <div>
      <h3 className="section-heading">Players</h3>
      <div className="admin-users-list">
        {users.filter((u) => u.role !== "admin").map((u) => (
          <div className="admin-user-row" key={u.id}>
            <div className="admin-user-info">
              <strong>{u.username}</strong>
              <span className={`badge ${u.status === "active" ? "badge-upcoming" : "badge-final"}`}>{u.status}</span>
            </div>
            <div className="admin-user-balance">{money(u.balance)} AC</div>
            <div className="admin-user-actions">
              <input className="field field-sm" type="number" placeholder="Amount" value={amounts[u.id] ?? ""} onChange={(e) => setAmounts({ ...amounts, [u.id]: e.target.value })} />
              <button className="icon-btn" onClick={() => onAdjust(u.id, Number(amounts[u.id]) || 0)}><Plus size={13} /></button>
              <button className="icon-btn" onClick={() => onAdjust(u.id, -(Number(amounts[u.id]) || 0))}><Minus size={13} /></button>
              <button className="btn btn-ghost btn-sm" onClick={() => onToggleSuspend(u.id)}><Ban size={13} /> {u.status === "active" ? "Suspend" : "Reinstate"}</button>
            </div>
          </div>
        ))}
        {users.filter((u) => u.role !== "admin").length === 0 && (
          <div className="empty-block"><User size={26} /><p>No players have registered yet.</p></div>
        )}
      </div>
    </div>
  );
}

function AdminSiteContent({ siteContent, onSave }) {
  const [about, setAbout] = useState(siteContent.about);
  const [contact, setContact] = useState(siteContent.contact);
  const [banners, setBanners] = useState(siteContent.banners);
  const [faqItems, setFaqItems] = useState(siteContent.faqItems);

  function updateBanner(i, field, value) { setBanners(banners.map((b, idx) => (idx === i ? { ...b, [field]: value } : b))); }
  function updateFaq(i, field, value) { setFaqItems(faqItems.map((f, idx) => (idx === i ? { ...f, [field]: value } : f))); }
  function addFaq() { setFaqItems([...faqItems, { id: uid("faq"), q: "New question", a: "New answer" }]); }
  function removeFaq(id) { setFaqItems(faqItems.filter((f) => f.id !== id)); }
  function saveAll() { onSave({ about, contact, banners, faqItems }); }

  return (
    <div>
      <div className="card">
        <h3>About page</h3>
        <textarea className="field textarea-lg" value={about} onChange={(e) => setAbout(e.target.value)} />
      </div>
      <div className="card">
        <h3>Contact details</h3>
        <input className="field" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="Support email" />
        <input className="field" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="Support phone" />
        <input className="field" value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} placeholder="Address" />
      </div>
      <div className="card">
        <h3>Home page banners</h3>
        {banners.map((b, i) => (
          <div className="banner-edit-row" key={i}>
            <select className="field field-sm" value={b.sport} onChange={(e) => updateBanner(i, "sport", e.target.value)}>
              {SPORTS.filter((s) => s.id !== "all").map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <input className="field" value={b.title} onChange={(e) => updateBanner(i, "title", e.target.value)} placeholder="Title" />
            <input className="field" value={b.subtitle} onChange={(e) => updateBanner(i, "subtitle", e.target.value)} placeholder="Subtitle" />
          </div>
        ))}
      </div>
      <div className="card">
        <h3>FAQ</h3>
        {faqItems.map((f, i) => (
          <div className="faq-edit-row" key={f.id}>
            <input className="field" value={f.q} onChange={(e) => updateFaq(i, "q", e.target.value)} placeholder="Question" />
            <textarea className="field" value={f.a} onChange={(e) => updateFaq(i, "a", e.target.value)} placeholder="Answer" />
            <button className="icon-btn" onClick={() => removeFaq(f.id)}><Trash2 size={14} /></button>
          </div>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={addFaq}><Plus size={13} /> Add question</button>
      </div>
      <button className="btn btn-gold" onClick={saveAll}>Save site content</button>
    </div>
  );
}

function AdminPanel({ users, events, bets, siteContent, adminTab, setAdminTab, actions }) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "events", label: "Events & Odds" },
    { id: "users", label: "Players" },
    { id: "content", label: "Site Content" },
  ];
  return (
    <div className="page">
      <h1 className="page-title"><ShieldCheck size={20} className="gold-text" /> Admin Console</h1>
      <div className="admin-tabs">
        {tabs.map((t) => (
          <button key={t.id} className={`admin-tab ${adminTab === t.id ? "admin-tab-active" : ""}`} onClick={() => setAdminTab(t.id)}>{t.label}</button>
        ))}
      </div>
      {adminTab === "overview" && <AdminOverview users={users} events={events} bets={bets} onReset={actions.reset} />}
      {adminTab === "events" && <AdminEvents events={events} bets={bets} onCreate={actions.createEvent} onUpdateOdds={actions.updateOdds} onSettle={actions.settle} onDelete={actions.deleteEvent} />}
      {adminTab === "users" && <AdminUsers users={users} onAdjust={actions.adjustBalance} onToggleSuspend={actions.toggleSuspend} />}
      {adminTab === "content" && <AdminSiteContent siteContent={siteContent} onSave={actions.saveSiteContent} />}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* main app                                                               */
/* ---------------------------------------------------------------------- */

export default function App() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [bets, setBets] = useState([]);
  const [siteContent, setSiteContent] = useState(seedSiteContent());
  const [rememberedUsername, setRememberedUsername] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  const [view, setView] = useState("home");
  const [legalDoc, setLegalDoc] = useState("terms");
  const [activeSport, setActiveSport] = useState("all");
  const [activeLeague, setActiveLeague] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [slip, setSlip] = useState([]);
  const [slipOpen, setSlipOpen] = useState(false);
  const [adminTab, setAdminTab] = useState("overview");

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const currentUser = useMemo(() => users.find((u) => u.id === currentUserId) || null, [users, currentUserId]);

  function showToast(msg, type = "ok") {
    setToast({ msg, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [u, ev, b, sc, remembered] = await Promise.all([
          safeGet("users", true), safeGet("events", true), safeGet("bets", true), safeGet("siteContent", true), safeGet("rememberedUsername", false),
        ]);
        let uu = u ? JSON.parse(u.value) : seedUsers();
        let evv = ev ? JSON.parse(ev.value) : seedEvents();
        let bb = b ? JSON.parse(b.value) : [];
        let scc = sc ? JSON.parse(sc.value) : seedSiteContent();
        if (!u) await window.storage.set("users", JSON.stringify(uu), true);
        if (!ev) await window.storage.set("events", JSON.stringify(evv), true);
        if (!b) await window.storage.set("bets", JSON.stringify(bb), true);
        if (!sc) await window.storage.set("siteContent", JSON.stringify(scc), true);
        if (mounted) {
          setUsers(uu); setEvents(evv); setBets(bb); setSiteContent(scc);
          setRememberedUsername(remembered ? remembered.value : "");
        }
      } catch (e) {
        console.error(e);
        showToast("Could not load platform data.", "error");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function persistUsers(next) {
    setUsers(next);
    try { await window.storage.set("users", JSON.stringify(next), true); } catch (e) { console.error(e); }
  }
  async function persistEvents(next) {
    setEvents(next);
    try { await window.storage.set("events", JSON.stringify(next), true); } catch (e) { console.error(e); }
  }
  async function persistBets(next) {
    setBets(next);
    try { await window.storage.set("bets", JSON.stringify(next), true); } catch (e) { console.error(e); }
  }
  async function persistSiteContent(next) {
    setSiteContent(next);
    try { await window.storage.set("siteContent", JSON.stringify(next), true); } catch (e) { console.error(e); }
    showToast("Site content updated.");
  }

  /* ---- navigation ---- */

  function navigate(nextView, sub) {
    setView(nextView);
    if (nextView === "legal" && sub) setLegalDoc(sub);
  }

  /* ---- auth ---- */

  function handleRegister(username, password, phone) {
    const uname = (username || "").trim();
    if (!uname || !password) return setAuthError("Enter a username and password.");
    if (uname.length < 3) return setAuthError("Username must be at least 3 characters.");
    if (users.some((u) => u.username.toLowerCase() === uname.toLowerCase())) return setAuthError("That username is taken.");
    const newUser = { id: uid("u"), username: uname, password, phone: phone || "", role: "user", balance: 1000, status: "active", createdAt: Date.now() };
    persistUsers([...users, newUser]);
    setCurrentUserId(newUser.id);
    setAuthOpen(false);
    showToast(`Welcome, ${uname}. 1,000 AC credited to your account.`);
  }

  function handleLogin(username, password, rememberMe) {
    const uname = (username || "").trim();
    const found = users.find((u) => u.username.toLowerCase() === uname.toLowerCase() && u.password === password);
    if (!found) return setAuthError("Incorrect username or password.");
    if (found.status === "suspended") return setAuthError("This account has been suspended.");
    setCurrentUserId(found.id);
    setAuthOpen(false);
    setView(found.role === "admin" ? "admin" : "home");
    if (rememberMe) {
      setRememberedUsername(found.username);
      window.storage.set("rememberedUsername", found.username, false).catch((e) => console.error(e));
    }
    showToast(`Welcome back, ${found.username}.`);
  }

  function handleForgotPassword(username) {
    const uname = (username || "").trim();
    const found = users.find((u) => u.username.toLowerCase() === uname.toLowerCase());
    if (!found) { setAuthError("No account with that username."); return null; }
    const newPass = randomPassword();
    persistUsers(users.map((u) => (u.id === found.id ? { ...u, password: newPass } : u)));
    setAuthError("");
    return newPass;
  }

  function handleLogout() {
    setCurrentUserId(null);
    setView("home");
    setSlip([]);
    showToast("Logged out.");
  }

  /* ---- bet slip ---- */

  function toggleSelection(event, marketKey, label) {
    const selId = `${event.id}_${marketKey}`;
    const eventLabel = `${event.teamA} vs ${event.teamB}`;
    setSlip((prev) => {
      const existing = prev.find((s) => s.id === selId);
      if (existing) return prev.filter((s) => s.id !== selId);
      const withoutSameEvent = prev.filter((s) => s.eventId !== event.id);
      return [...withoutSameEvent, { id: selId, eventId: event.id, eventLabel, market: marketKey, label, odds: event.odds[marketKey], stake: "25" }];
    });
    setSlipOpen(true);
  }

  function removeSelection(id) { setSlip((prev) => prev.filter((s) => s.id !== id)); }
  function updateStake(id, value) { setSlip((prev) => prev.map((s) => (s.id === id ? { ...s, stake: value } : s))); }
  function clearSlip() { setSlip([]); }

  function placeBets() {
    if (!currentUser) { setAuthMode("login"); setAuthOpen(true); return; }
    if (slip.length === 0) return;
    const total = slip.reduce((a, s) => a + (Number(s.stake) || 0), 0);
    if (slip.some((s) => !(Number(s.stake) > 0))) return showToast("Enter a stake for every selection.", "error");
    if (total > currentUser.balance) return showToast("Insufficient balance for this stake.", "error");
    const closed = slip.some((s) => { const ev = events.find((e) => e.id === s.eventId); return !ev || ev.status === "finished"; });
    if (closed) return showToast("One of your selections has closed.", "error");

    const newBets = slip.map((s) => ({
      id: uid("bet"), userId: currentUser.id, eventId: s.eventId, eventLabel: s.eventLabel,
      market: s.market, label: s.label, odds: s.odds, stake: Number(s.stake),
      potentialWin: Math.round(Number(s.stake) * s.odds * 100) / 100,
      status: "pending", placedAt: Date.now(),
    }));

    persistBets([...bets, ...newBets]);
    persistUsers(users.map((u) => (u.id === currentUser.id ? { ...u, balance: Math.round((u.balance - total) * 100) / 100 } : u)));
    setSlip([]);
    setSlipOpen(false);
    showToast(`Placed ${newBets.length} bet${newBets.length > 1 ? "s" : ""} for ${money(total)} AC.`);
  }

  /* ---- wallet / casino ---- */

  function adjustBalance(userId, amount) {
    persistUsers(users.map((u) => (u.id === userId ? { ...u, balance: Math.round((u.balance + amount) * 100) / 100 } : u)));
  }
  function handleTopUp(amount) {
    if (!currentUser || !amount) return;
    adjustBalance(currentUser.id, amount);
    showToast(`${money(amount)} AC added to your wallet.`);
  }
  function handleWheelSpin(segment, amt, statusFlag) {
    if (statusFlag === "insufficient") return showToast("Insufficient balance for this stake.", "error");
    if (!currentUser || !segment) return;
    const payout = Math.round(amt * segment.mult * 100) / 100;
    const net = Math.round((payout - amt) * 100) / 100;
    adjustBalance(currentUser.id, net);
    showToast(payout > 0 ? `Wheel landed on ${segment.label} — you win ${money(payout)} AC.` : `Wheel landed on ${segment.label} — no win this spin.`, payout > 0 ? "ok" : "error");
  }

  /* ---- admin actions ---- */

  function createEvent(data) {
    persistEvents([...events, { id: uid("e"), ...data, status: "upcoming", score: null, result: null, createdAt: Date.now() }]);
    showToast("Event created.");
  }
  function updateOdds(eventId, marketKey, value) {
    persistEvents(events.map((e) => (e.id === eventId ? { ...e, odds: { ...e.odds, [marketKey]: Number(value) } } : e)));
  }
  function deleteEvent(eventId) {
    if (bets.some((b) => b.eventId === eventId)) return showToast("Can't delete an event with bets placed.", "error");
    persistEvents(events.filter((e) => e.id !== eventId));
  }
  function settleEvent(eventId, result) {
    const ev = events.find((e) => e.id === eventId);
    if (!ev) return;
    let nextUsers = [...users];
    const nextBets = bets.map((b) => {
      if (b.eventId !== eventId || b.status !== "pending") return b;
      if (b.market === result) {
        nextUsers = nextUsers.map((u) => (u.id === b.userId ? { ...u, balance: Math.round((u.balance + b.potentialWin) * 100) / 100 } : u));
        return { ...b, status: "won" };
      }
      return { ...b, status: "lost" };
    });
    persistEvents(events.map((e) => (e.id === eventId ? { ...e, status: "finished", result } : e)));
    persistBets(nextBets);
    persistUsers(nextUsers);
    showToast(`${ev.teamA} vs ${ev.teamB} settled.`);
  }
  function toggleSuspend(userId) {
    persistUsers(users.map((u) => (u.id === userId ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u)));
  }
  async function resetDemo() {
    const u = seedUsers(), ev = seedEvents(), b = [], sc = seedSiteContent();
    await persistUsers(u); await persistEvents(ev); await persistBets(b); await persistSiteContent(sc);
    setCurrentUserId(null);
    setSlip([]);
    setView("home");
    showToast("Platform data reset.");
  }

  /* ---- derived ---- */

  useEffect(() => { setActiveLeague(null); }, [activeSport]);

  const sportCounts = useMemo(() => {
    const counts = {};
    events.forEach((e) => { if (e.status !== "finished") counts[e.sport] = (counts[e.sport] || 0) + 1; });
    return counts;
  }, [events]);

  const leaguesForSport = useMemo(() => {
    if (activeSport === "all" || activeSport === "casino") return [];
    return [...new Set(events.filter((e) => e.sport === activeSport).map((e) => e.league))];
  }, [events, activeSport]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (activeSport !== "all" && activeSport !== "casino" && e.sport !== activeSport) return false;
      if (activeLeague && e.league !== activeLeague) return false;
      if (statusFilter === "results") return e.status === "finished";
      if (statusFilter === "live") return e.status === "live";
      if (statusFilter === "upcoming") return e.status === "upcoming";
      return e.status !== "finished";
    });
  }, [events, activeSport, activeLeague, statusFilter]);

  const myBets = currentUser ? bets.filter((b) => b.userId === currentUser.id) : [];
  const isAdmin = currentUser?.role === "admin";

  if (loading) {
    return (
      <div className="app-shell">
        <StyleBlock />
        <div className="loading-screen"><Target size={22} className="gold-text spin" /> Loading ProPicks Arena…</div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <StyleBlock />
      <Toast toast={toast} />

      <header className="header">
        <Logo />
        <nav className="header-nav">
          <button className={`nav-link ${view === "home" ? "nav-link-active" : ""}`} onClick={() => setView("home")}>Sportsbook</button>
          <button className={`nav-link ${view === "about" ? "nav-link-active" : ""}`} onClick={() => setView("about")}>About</button>
          <button className={`nav-link ${view === "faq" ? "nav-link-active" : ""}`} onClick={() => setView("faq")}>FAQ</button>
          <button className={`nav-link ${view === "contact" ? "nav-link-active" : ""}`} onClick={() => setView("contact")}>Contact</button>
          {currentUser && !isAdmin && (
            <>
              <button className={`nav-link ${view === "wallet" ? "nav-link-active" : ""}`} onClick={() => setView("wallet")}><Wallet size={14} /> Wallet</button>
              <button className={`nav-link ${view === "mybets" ? "nav-link-active" : ""}`} onClick={() => setView("mybets")}><Ticket size={14} /> My Bets</button>
            </>
          )}
          {isAdmin && <button className={`nav-link ${view === "admin" ? "nav-link-active" : ""}`} onClick={() => setView("admin")}><ShieldCheck size={14} /> Admin Console</button>}
        </nav>
        <div className="header-right">
          {currentUser ? (
            <>
              {!isAdmin && <span className="balance-chip"><Wallet size={13} /> {money(currentUser.balance)} AC</span>}
              <span className="username-chip"><User size={13} /> {currentUser.username}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}><LogOut size={13} /> Log out</button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => { setAuthMode("login"); setAuthOpen(true); }}>Log in</button>
              <button className="btn btn-gold btn-sm" onClick={() => { setAuthMode("register"); setAuthOpen(true); }}>Join</button>
            </>
          )}
        </div>
      </header>

      {view === "home" && (
        <>
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow gold-text"><Sparkles size={13} /> Powered by Arena Credits</span>
              <h1>Where every pick<br />becomes a play.</h1>
              <p>Browse live and upcoming fixtures across five sports, spin the Lucky Wheel, build a slip, and track it through to the final whistle.</p>
            </div>
          </section>
          <ScoreTicker events={events} />

          <div className="promo-row">
            {siteContent.banners.map((b, i) => {
              const meta = sportMeta(b.sport);
              return (
                <button key={i} className="promo-card" onClick={() => setActiveSport(b.sport)}>
                  <meta.icon size={20} className="gold-text" />
                  <span className="promo-copy">
                    <strong>{b.title}</strong>
                    <span className="muted small">{b.subtitle}</span>
                  </span>
                  <ChevronRight size={16} className="muted" />
                </button>
              );
            })}
          </div>

          <div className="content-grid">
            <main className="main-col">
              <div className="sport-tabs">
                {SPORTS.map((s) => (
                  <button key={s.id} className={`sport-tab ${activeSport === s.id ? "sport-tab-active" : ""}`} onClick={() => setActiveSport(s.id)}>
                    <s.icon size={14} /> {s.label}{s.id !== "all" && s.id !== "casino" ? ` (${sportCounts[s.id] || 0})` : ""}
                  </button>
                ))}
              </div>

              {activeSport === "casino" ? (
                <CasinoView currentUser={currentUser} onSpin={handleWheelSpin} showAuth={() => { setAuthMode("login"); setAuthOpen(true); }} />
              ) : (
                <>
                  <div className="status-pills">
                    {STATUS_FILTERS.map((f) => (
                      <button key={f.id} className={`status-pill ${statusFilter === f.id ? "status-pill-active" : ""}`} onClick={() => setStatusFilter(f.id)}>{f.label}</button>
                    ))}
                  </div>
                  {leaguesForSport.length > 0 && (
                    <div className="league-row">
                      <button className={`league-chip ${!activeLeague ? "league-chip-active" : ""}`} onClick={() => setActiveLeague(null)}>All leagues</button>
                      {leaguesForSport.map((l) => (
                        <button key={l} className={`league-chip ${activeLeague === l ? "league-chip-active" : ""}`} onClick={() => setActiveLeague(l)}>{l}</button>
                      ))}
                    </div>
                  )}
                  <div className="event-list">
                    {filteredEvents.length === 0 && <div className="empty-block"><LayoutGrid size={26} /><p>No fixtures match these filters right now.</p></div>}
                    {filteredEvents.map((ev) => <EventCard key={ev.id} event={ev} slip={slip} onToggle={toggleSelection} />)}
                  </div>
                </>
              )}
            </main>

            {activeSport !== "casino" && (
              <BetSlip
                slip={slip} open={slipOpen} loggedIn={!!currentUser}
                onRemove={removeSelection} onStake={updateStake} onClear={clearSlip}
                onPlace={placeBets} onCloseMobile={() => setSlipOpen(false)}
              />
            )}
          </div>

          {activeSport !== "casino" && slip.length > 0 && !slipOpen && (
            <button className="mobile-slip-fab mobile-only" onClick={() => setSlipOpen(true)}><Ticket size={15} /> Bet Slip · {slip.length}</button>
          )}
        </>
      )}

      {view === "about" && <AboutPage about={siteContent.about} />}
      {view === "faq" && <FaqPage items={siteContent.faqItems} />}
      {view === "contact" && <ContactPage contact={siteContent.contact} onSend={() => showToast("Message sent.")} />}
      {view === "legal" && <LegalPage docId={legalDoc} />}
      {view === "wallet" && currentUser && <WalletView user={currentUser} onTopUp={handleTopUp} />}
      {view === "mybets" && currentUser && <MyBetsView bets={myBets} />}
      {view === "admin" && isAdmin && (
        <AdminPanel
          users={users} events={events} bets={bets} siteContent={siteContent} adminTab={adminTab} setAdminTab={setAdminTab}
          actions={{ createEvent, updateOdds, settle: settleEvent, deleteEvent, adjustBalance, toggleSuspend, reset: resetDemo, saveSiteContent: persistSiteContent }}
        />
      )}

      <Footer onNavigate={navigate} onSubscribe={() => showToast("Subscribed.")} />

      <AuthModal
        open={authOpen} mode={authMode} setMode={setAuthMode} onClose={() => setAuthOpen(false)}
        onLogin={handleLogin} onRegister={handleRegister} onForgotPassword={handleForgotPassword}
        error={authError} clearError={() => setAuthError("")} rememberedUsername={rememberedUsername}
      />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* styles                                                                 */
/* ---------------------------------------------------------------------- */

function StyleBlock() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

      :root{
        --bg:#0A1D19; --bg-soft:#0E241F; --surface:#123028; --surface-2:#163a30;
        --line: rgba(243,238,226,0.09); --ivory:#F3EEE2; --muted:#8FA79C;
        --gold:#D4AF6A; --gold-bright:#E9CD93; --red:#C1443C; --green:#4CA875;
        --font-display:'Fraunces', serif; --font-num:'Space Grotesk', sans-serif; --font-body:'Inter', sans-serif;
      }
      *{ box-sizing:border-box; }
      .app-shell{
        background:
          radial-gradient(1200px 600px at 15% -10%, rgba(212,175,106,0.07), transparent 60%),
          linear-gradient(180deg, var(--bg) 0%, var(--bg-soft) 100%);
        color:var(--ivory); font-family:var(--font-body); min-height:100%; width:100%;
        display:flex; flex-direction:column; position:relative;
      }
      .loading-screen{ display:flex; align-items:center; gap:10px; justify-content:center; padding:80px 0; font-family:var(--font-num); color:var(--muted); }
      .spin{ animation:spin 1.6s linear infinite; }
      @keyframes spin{ to{ transform:rotate(360deg); } }
      .gold-text{ color:var(--gold-bright); }
      .muted{ color:var(--muted); }
      .small{ font-size:12.5px; }

      /* header */
      .header{ display:flex; align-items:center; justify-content:space-between; gap:16px; padding:14px 26px;
        border-bottom:1px solid var(--line); position:sticky; top:0; z-index:30; background:rgba(10,29,25,0.92); backdrop-filter:blur(8px); flex-wrap:wrap; }
      .brand{ display:flex; align-items:center; gap:9px; font-family:var(--font-display); font-size:19px; letter-spacing:0.2px; }
      .brand-mark{ width:30px; height:30px; border-radius:9px; display:flex; align-items:center; justify-content:center;
        background:linear-gradient(145deg, var(--gold), #a9803f); color:#0A1D19; flex:none; }
      .brand-word em{ font-style:italic; color:var(--gold-bright); }
      .header-nav{ display:flex; gap:6px; flex-wrap:wrap; }
      .nav-link{ background:none; border:none; color:var(--muted); font-family:var(--font-body); font-weight:600; font-size:13.5px;
        padding:8px 12px; border-radius:8px; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all .15s; }
      .nav-link:hover{ color:var(--ivory); background:var(--surface); }
      .nav-link-active{ color:var(--gold-bright); background:var(--surface); }
      .header-right{ display:flex; align-items:center; gap:8px; }
      .balance-chip, .username-chip{ display:flex; align-items:center; gap:6px; font-family:var(--font-num); font-size:12.5px; font-weight:600;
        background:var(--surface); border:1px solid var(--line); padding:7px 11px; border-radius:20px; color:var(--ivory); }

      /* buttons */
      .btn{ font-family:var(--font-body); font-weight:700; font-size:13.5px; border-radius:9px; padding:10px 16px; border:none; cursor:pointer;
        display:inline-flex; align-items:center; justify-content:center; gap:7px; transition:transform .12s, filter .12s; }
      .btn:hover{ filter:brightness(1.08); }
      .btn:active{ transform:scale(0.98); }
      .btn-block{ width:100%; }
      .btn-sm{ padding:7px 12px; font-size:12.5px; }
      .btn-gold{ background:linear-gradient(145deg, var(--gold-bright), var(--gold)); color:#0A1D19; }
      .btn-ghost{ background:var(--surface); color:var(--ivory); border:1px solid var(--line); }
      .btn-danger{ background:rgba(193,68,60,0.15); color:#e8887f; border:1px solid rgba(193,68,60,0.4); }
      .btn-link{ background:none; border:none; color:var(--muted); text-decoration:underline; font-size:12.5px; cursor:pointer; width:100%; margin-top:8px; }
      .btn:disabled{ opacity:0.5; cursor:not-allowed; }
      .icon-btn{ background:none; border:none; color:var(--muted); cursor:pointer; padding:5px; border-radius:6px; display:flex; align-items:center; }
      .icon-btn:hover{ color:var(--ivory); background:var(--surface-2); }
      .icon-btn:disabled{ opacity:0.3; cursor:not-allowed; }

      /* hero */
      .hero{ padding:56px 26px 30px; max-width:1180px; margin:0 auto; width:100%; animation:fadeUp .6s ease both; }
      @keyframes fadeUp{ from{ opacity:0; transform:translateY(10px); } to{ opacity:1; transform:none; } }
      .hero-copy{ max-width:640px; }
      .eyebrow{ display:inline-flex; align-items:center; gap:6px; font-family:var(--font-num); font-size:12px; font-weight:600;
        letter-spacing:0.06em; text-transform:uppercase; margin-bottom:16px; }
      .hero h1{ font-family:var(--font-display); font-weight:600; font-size:clamp(32px,5vw,54px); line-height:1.05; margin:0 0 16px; }
      .hero p{ color:var(--muted); font-size:15.5px; line-height:1.6; max-width:520px; }

      /* ticker */
      .ticker{ border-top:1px solid var(--line); border-bottom:1px solid var(--line); background:var(--bg-soft); overflow:hidden; }
      .ticker-track{ display:flex; width:max-content; animation:tickerScroll 34s linear infinite; }
      @media (prefers-reduced-motion:reduce){ .ticker-track{ animation:none; } }
      @keyframes tickerScroll{ from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
      .ticker-item{ display:flex; align-items:center; gap:10px; padding:11px 26px; border-right:1px solid var(--line); white-space:nowrap; }
      .ticker-dot{ width:6px; height:6px; border-radius:50%; background:var(--red); box-shadow:0 0 0 3px rgba(193,68,60,0.2); }
      .ticker-teams{ font-size:13px; color:var(--ivory); font-weight:500; }
      .ticker-teams em{ color:var(--muted); font-style:normal; margin:0 3px; }
      .ticker-score{ display:flex; align-items:center; gap:5px; font-family:var(--font-num); font-weight:700; font-size:13px; }
      .flap{ background:#0d241f; border:1px solid var(--line); border-radius:4px; padding:2px 6px; color:var(--gold-bright); min-width:20px; text-align:center; }
      .flap-sep{ color:var(--muted); }
      .ticker-clock, .ticker-time{ color:var(--muted); font-weight:500; margin-left:4px; }

      /* promo banners */
      .promo-row{ max-width:1180px; margin:20px auto 0; padding:0 26px; display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
      .promo-card{ display:flex; align-items:center; gap:12px; background:var(--surface); border:1px solid var(--line); border-radius:14px;
        padding:14px 16px; cursor:pointer; text-align:left; transition:border-color .15s, transform .12s; }
      .promo-card:hover{ border-color:rgba(212,175,106,0.4); transform:translateY(-1px); }
      .promo-copy{ display:flex; flex-direction:column; gap:2px; flex:1; }
      .promo-copy strong{ font-family:var(--font-display); font-size:15px; }

      /* layout */
      .content-grid{ max-width:1180px; margin:0 auto; width:100%; padding:26px; display:grid; grid-template-columns:1fr 340px; gap:22px; flex:1; }
      .main-col{ min-width:0; }
      .page{ max-width:900px; margin:0 auto; width:100%; padding:36px 26px 70px; }
      .page-title{ font-family:var(--font-display); font-size:28px; font-weight:600; display:flex; align-items:center; gap:10px; margin:0 0 6px; }

      /* sport tabs / status pills / league chips */
      .sport-tabs{ display:flex; gap:8px; margin-bottom:12px; overflow-x:auto; padding-bottom:2px; }
      .sport-tab{ display:flex; align-items:center; gap:6px; padding:9px 14px; border-radius:20px; border:1px solid var(--line);
        background:var(--surface); color:var(--muted); font-size:13px; font-weight:600; cursor:pointer; white-space:nowrap; transition:all .15s; }
      .sport-tab:hover{ color:var(--ivory); }
      .sport-tab-active{ background:linear-gradient(145deg, var(--gold-bright), var(--gold)); color:#0A1D19; border-color:transparent; }
      .status-pills{ display:flex; gap:8px; margin-bottom:10px; }
      .status-pill{ background:none; border:1px solid var(--line); color:var(--muted); font-size:12.5px; font-weight:600; padding:6px 12px; border-radius:20px; cursor:pointer; }
      .status-pill-active{ border-color:var(--gold); color:var(--gold-bright); }
      .league-row{ display:flex; gap:8px; margin-bottom:14px; overflow-x:auto; padding-bottom:2px; }
      .league-chip{ background:var(--bg-soft); border:1px solid var(--line); color:var(--muted); font-size:12px; padding:6px 11px; border-radius:16px; cursor:pointer; white-space:nowrap; }
      .league-chip-active{ color:var(--ivory); border-color:var(--gold); }

      /* event card */
      .event-list{ display:flex; flex-direction:column; gap:10px; }
      .event-card{ background:var(--surface); border:1px solid var(--line); border-radius:14px; padding:16px 18px; transition:border-color .15s; }
      .event-card:hover{ border-color:rgba(212,175,106,0.35); }
      .event-closed{ opacity:0.6; }
      .event-top{ display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
      .event-eyebrow{ display:flex; align-items:center; gap:6px; font-size:11.5px; color:var(--muted); font-weight:600; text-transform:uppercase; letter-spacing:0.04em; }
      .badge{ display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:700; padding:3px 8px; border-radius:20px; }
      .badge-live{ background:rgba(193,68,60,0.18); color:#e8887f; }
      .badge-upcoming{ background:rgba(212,175,106,0.14); color:var(--gold-bright); }
      .badge-final{ background:rgba(143,167,156,0.15); color:var(--muted); }
      .badge-won{ background:rgba(76,168,117,0.18); color:#8fd6ac; }
      .badge-lost{ background:rgba(193,68,60,0.18); color:#e8887f; }
      .badge-pending{ background:rgba(212,175,106,0.14); color:var(--gold-bright); }
      .event-mid{ display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; flex-wrap:wrap; gap:6px; }
      .event-teams{ display:flex; align-items:center; gap:9px; font-family:var(--font-display); font-size:17px; }
      .event-vs{ color:var(--muted); font-family:var(--font-body); font-size:12px; }
      .event-when{ font-size:12.5px; color:var(--muted); font-family:var(--font-num); }
      .live-score{ color:var(--gold-bright); font-weight:700; }
      .live-score em{ color:var(--muted); font-style:normal; margin-left:4px; }
      .final-result{ color:var(--muted); }
      .odds-row{ display:grid; grid-template-columns:repeat(auto-fit, minmax(90px,1fr)); gap:8px; }
      .odds-btn{ background:var(--bg-soft); border:1px solid var(--line); border-radius:10px; padding:9px 6px; cursor:pointer; text-align:center;
        display:flex; flex-direction:column; gap:4px; transition:all .13s; }
      .odds-btn:hover:not(:disabled){ border-color:var(--gold); transform:translateY(-1px); }
      .odds-btn:disabled{ opacity:0.4; cursor:not-allowed; }
      .odds-btn-active{ background:linear-gradient(145deg, var(--gold-bright), var(--gold)); border-color:transparent; }
      .odds-btn-active .odds-label, .odds-btn-active .odds-value{ color:#0A1D19; }
      .odds-label{ font-size:11.5px; color:var(--muted); font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .odds-value{ font-family:var(--font-num); font-weight:700; font-size:15px; color:var(--ivory); }

      /* bet slip */
      .betslip{ background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:16px; align-self:start;
        position:sticky; top:86px; display:flex; flex-direction:column; max-height:calc(100vh - 110px); }
      .betslip-head{ display:flex; align-items:center; justify-content:space-between; font-weight:700; font-size:14px; margin-bottom:10px; }
      .betslip-head > span{ display:flex; align-items:center; gap:7px; }
      .betslip-count{ background:var(--gold); color:#0A1D19; font-size:11px; padding:1px 7px; border-radius:10px; font-family:var(--font-num); }
      .betslip-empty{ display:flex; flex-direction:column; align-items:center; gap:10px; color:var(--muted); padding:40px 10px; text-align:center; font-size:13px; }
      .betslip-list{ display:flex; flex-direction:column; gap:10px; overflow-y:auto; }
      .slip-item{ background:var(--bg-soft); border:1px solid var(--line); border-radius:10px; padding:10px 12px; }
      .slip-item-top{ display:flex; justify-content:space-between; align-items:flex-start; gap:6px; }
      .slip-event{ font-size:12px; color:var(--muted); }
      .slip-pick{ font-weight:700; font-size:13.5px; margin-top:2px; }
      .slip-odds{ color:var(--gold-bright); font-family:var(--font-num); font-weight:600; }
      .slip-stake-row{ display:flex; align-items:center; gap:6px; margin-top:8px; }
      .slip-currency{ font-size:11.5px; color:var(--muted); font-weight:600; }
      .slip-stake-input{ width:70px; background:var(--surface); border:1px solid var(--line); border-radius:6px; color:var(--ivory);
        padding:5px 7px; font-family:var(--font-num); font-size:13px; }
      .slip-to-win{ font-size:11.5px; color:var(--muted); margin-left:auto; }
      .ticket-perf{ height:1px; margin:14px 0; background-image:radial-gradient(circle, var(--line) 1.5px, transparent 1.5px);
        background-size:9px 1px; background-repeat:repeat-x; }
      .betslip-foot{ margin-top:auto; }
      .betslip-row{ display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px; }
      .betslip-row strong{ font-family:var(--font-num); }

      /* misc cards */
      .card{ background:var(--surface); border:1px solid var(--line); border-radius:14px; padding:20px; margin-bottom:18px; }
      .card h3{ display:flex; align-items:center; gap:8px; font-family:var(--font-display); font-size:17px; margin:0 0 6px; }
      .empty-block{ display:flex; flex-direction:column; align-items:center; gap:10px; color:var(--muted); padding:60px 20px; text-align:center; }
      .section-heading{ font-family:var(--font-display); font-size:17px; margin:8px 0 12px; }

      /* wallet */
      .wallet-balance-card{ background:linear-gradient(145deg, var(--surface-2), var(--surface)); border:1px solid var(--line); border-radius:16px;
        padding:24px; margin-bottom:20px; display:flex; flex-direction:column; gap:6px; }
      .wallet-label{ font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:0.05em; }
      .wallet-amount{ font-family:var(--font-num); font-size:34px; font-weight:700; }
      .wallet-amount em{ font-style:normal; font-size:16px; color:var(--gold-bright); }
      .preset-row{ display:flex; gap:8px; margin:14px 0; flex-wrap:wrap; }
      .chip{ background:var(--bg-soft); border:1px solid var(--line); color:var(--ivory); border-radius:20px; padding:8px 14px; font-size:13px; font-weight:600; cursor:pointer; }
      .chip:hover{ border-color:var(--gold); }
      .topup-custom{ display:flex; gap:8px; margin-bottom:16px; }
      .fake-card{ background:var(--bg-soft); border:1px dashed var(--line); border-radius:10px; padding:12px 14px; display:flex; flex-direction:column; gap:8px; }
      .fake-card-row{ display:flex; justify-content:space-between; font-size:12.5px; color:var(--muted); }
      .fake-card-input{ font-family:var(--font-num); color:var(--ivory); }

      /* my bets */
      .bets-list{ display:flex; flex-direction:column; gap:10px; }
      .bet-row{ background:var(--surface); border:1px solid var(--line); border-radius:12px; padding:14px 16px; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; }
      .bet-event{ font-weight:700; font-size:14px; }
      .bet-figures{ display:flex; flex-direction:column; align-items:flex-end; gap:6px; }

      /* casino */
      .casino-grid{ display:grid; grid-template-columns:repeat(auto-fit, minmax(220px,1fr)); gap:14px; }
      .wheel-card{ display:flex; flex-direction:column; align-items:center; text-align:center; }
      .wheel-wrap{ position:relative; width:190px; height:190px; margin:14px auto; }
      .wheel-pointer{ position:absolute; top:-6px; left:50%; transform:translateX(-50%); width:0; height:0;
        border-left:9px solid transparent; border-right:9px solid transparent; border-top:14px solid var(--gold-bright); z-index:2; }
      .wheel{ width:190px; height:190px; border-radius:50%; border:4px solid var(--gold); position:relative;
        transition:transform 3.2s cubic-bezier(.12,.67,.1,1); }
      .wheel-label{ position:absolute; top:50%; left:50%; font-family:var(--font-num); font-weight:700; font-size:12px; color:var(--gold-bright); transform-origin:0 0; }
      .wheel-controls{ display:flex; align-items:center; gap:8px; margin-top:8px; }
      .game-card-soon{ display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; text-align:center; opacity:0.7; }

      /* about / faq / contact / legal */
      .about-p{ color:var(--muted); line-height:1.7; margin-bottom:14px; font-size:14.5px; }
      .testimonial-grid{ display:grid; grid-template-columns:repeat(auto-fit, minmax(220px,1fr)); gap:12px; }
      .testimonial-card{ background:var(--surface); border:1px solid var(--line); border-radius:14px; padding:18px; display:flex; flex-direction:column; gap:8px; }
      .testimonial-card p{ font-style:italic; color:var(--ivory); font-size:14px; line-height:1.5; }
      .faq-list{ display:flex; flex-direction:column; gap:8px; }
      .faq-item{ background:var(--surface); border:1px solid var(--line); border-radius:12px; overflow:hidden; }
      .faq-q{ width:100%; background:none; border:none; color:var(--ivory); font-weight:600; font-size:14px; padding:14px 16px;
        display:flex; align-items:center; justify-content:space-between; cursor:pointer; text-align:left; }
      .chevron-open{ transform:rotate(180deg); transition:transform .2s; }
      .faq-a{ padding:0 16px 16px; color:var(--muted); font-size:13.5px; line-height:1.6; }
      .contact-grid{ display:grid; grid-template-columns:1fr 1.2fr; gap:14px; }
      .contact-line{ display:flex; align-items:center; gap:8px; color:var(--muted); font-size:13.5px; margin:10px 0; }
      .textarea{ min-height:100px; resize:vertical; font-family:var(--font-body); }

      /* forms / fields */
      .field{ width:100%; background:var(--bg-soft); border:1px solid var(--line); border-radius:8px; color:var(--ivory);
        padding:10px 12px; font-family:var(--font-body); font-size:13.5px; margin-bottom:12px; }
      .field:focus{ outline:none; border-color:var(--gold); }
      .field-sm{ width:90px; margin-bottom:0; padding:7px 9px; }
      .field-label{ font-size:12px; color:var(--muted); font-weight:600; margin-bottom:6px; display:block; }
      .field-country{ max-width:170px; margin-bottom:0; }
      .phone-row{ display:flex; gap:8px; margin-bottom:12px; }
      .phone-row .field{ margin-bottom:0; }
      .remember-row{ display:flex; align-items:center; justify-content:space-between; margin:-4px 0 14px; }
      .remember-check{ display:flex; align-items:center; gap:6px; font-size:12.5px; color:var(--muted); cursor:pointer; }
      .forgot-link{ background:none; border:none; color:var(--gold-bright); font-size:12.5px; font-weight:600; cursor:pointer; }
      .reset-output{ text-align:center; }
      .reset-code{ font-family:var(--font-num); font-size:22px; font-weight:700; color:var(--gold-bright); background:var(--bg-soft);
        border:1px dashed var(--line); border-radius:10px; padding:14px; margin:10px 0 16px; letter-spacing:0.05em; }

      /* modal */
      .modal-backdrop{ position:fixed; inset:0; background:rgba(6,16,14,0.7); backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; z-index:100; padding:16px; }
      .modal{ background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:28px; width:100%; max-width:400px; position:relative; max-height:90vh; overflow-y:auto; }
      .modal-close{ position:absolute; top:14px; right:14px; }
      .modal-head{ margin-bottom:18px; }
      .modal-head h2{ font-family:var(--font-display); font-size:22px; margin:10px 0 6px; }
      .modal-switch{ text-align:center; font-size:13px; color:var(--muted); margin-top:14px; }
      .modal-switch button{ background:none; border:none; color:var(--gold-bright); font-weight:700; cursor:pointer; }
      .form-error{ display:flex; align-items:center; gap:6px; color:#e8887f; font-size:12.5px; margin:-2px 0 12px; }

      /* admin */
      .admin-tabs{ display:flex; gap:8px; margin-bottom:20px; border-bottom:1px solid var(--line); flex-wrap:wrap; }
      .admin-tab{ background:none; border:none; color:var(--muted); font-weight:700; font-size:13.5px; padding:10px 4px; cursor:pointer; border-bottom:2px solid transparent; margin-right:14px; }
      .admin-tab-active{ color:var(--gold-bright); border-color:var(--gold); }
      .admin-stats-grid{ display:grid; grid-template-columns:repeat(auto-fit, minmax(130px,1fr)); gap:12px; margin-bottom:20px; }
      .stat-card{ background:var(--surface); border:1px solid var(--line); border-radius:12px; padding:16px; display:flex; flex-direction:column; gap:6px; }
      .stat-value{ font-family:var(--font-num); font-size:20px; font-weight:700; }
      .stat-label{ font-size:12px; color:var(--muted); }
      .danger-zone{ border-color:rgba(193,68,60,0.3); }
      .admin-form-grid{ display:grid; grid-template-columns:repeat(auto-fit, minmax(140px,1fr)); gap:10px; align-items:start; }
      .admin-form-grid .btn{ grid-column:1 / -1; justify-self:start; }
      .admin-events-list, .admin-users-list{ display:flex; flex-direction:column; gap:10px; }
      .admin-event-row{ background:var(--surface); border:1px solid var(--line); border-radius:12px; padding:14px 16px; display:flex; flex-wrap:wrap; gap:14px; align-items:center; justify-content:space-between; }
      .admin-event-info{ display:flex; flex-direction:column; gap:4px; min-width:160px; }
      .admin-event-odds{ display:flex; gap:10px; flex-wrap:wrap; }
      .odds-edit{ display:flex; flex-direction:column; gap:4px; font-size:11px; color:var(--muted); }
      .odds-edit input{ width:70px; background:var(--bg-soft); border:1px solid var(--line); border-radius:6px; color:var(--ivory); padding:5px 7px; font-family:var(--font-num); }
      .admin-event-actions{ display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
      .admin-user-row{ background:var(--surface); border:1px solid var(--line); border-radius:12px; padding:14px 16px; display:flex; flex-wrap:wrap; gap:14px; align-items:center; justify-content:space-between; }
      .admin-user-info{ display:flex; align-items:center; gap:10px; min-width:140px; }
      .admin-user-balance{ font-family:var(--font-num); font-weight:700; }
      .admin-user-actions{ display:flex; align-items:center; gap:6px; }
      .textarea-lg{ min-height:150px; resize:vertical; }
      .banner-edit-row, .faq-edit-row{ display:grid; grid-template-columns:1fr 1fr 1fr auto; gap:8px; align-items:start; margin-bottom:10px; }
      .faq-edit-row textarea{ min-height:44px; resize:vertical; }

      /* footer */
      .site-footer{ border-top:1px solid var(--line); background:var(--bg-soft); margin-top:auto; padding:36px 26px 20px; }
      .footer-grid{ max-width:1180px; margin:0 auto; display:grid; grid-template-columns:1.4fr 1fr 1fr 1fr; gap:24px; }
      .footer-brand p{ margin:10px 0 12px; max-width:260px; }
      .footer-socials{ display:flex; gap:10px; color:var(--muted); }
      .footer-col h4{ font-family:var(--font-display); font-size:14px; margin:0 0 12px; color:var(--ivory); }
      .footer-col{ display:flex; flex-direction:column; gap:8px; }
      .footer-col button{ background:none; border:none; color:var(--muted); font-size:13px; cursor:pointer; text-align:left; padding:0; }
      .footer-col button:hover{ color:var(--gold-bright); }
      .newsletter-row{ display:flex; gap:6px; }
      .newsletter-input{ flex:1; }
      .footer-bottom{ max-width:1180px; margin:28px auto 0; padding-top:18px; border-top:1px solid var(--line); color:var(--muted); font-size:12px; text-align:center; }

      /* toast */
      .toast{ position:fixed; bottom:22px; left:50%; transform:translateX(-50%); z-index:200; display:flex; align-items:center; gap:8px;
        padding:11px 18px; border-radius:10px; font-size:13.5px; font-weight:600; box-shadow:0 10px 30px rgba(0,0,0,0.35); animation:toastIn .2s ease; }
      @keyframes toastIn{ from{ opacity:0; transform:translate(-50%,8px); } to{ opacity:1; transform:translate(-50%,0); } }
      .toast-ok{ background:#173a2c; color:#a9e2c1; border:1px solid rgba(76,168,117,0.4); }
      .toast-error{ background:#3a1a17; color:#f0aba3; border:1px solid rgba(193,68,60,0.4); }

      .mobile-only{ display:none; }
      .mobile-slip-fab{ display:none; }

      @media (max-width: 880px){
        .content-grid{ grid-template-columns:1fr; }
        .promo-row{ grid-template-columns:1fr; }
        .contact-grid{ grid-template-columns:1fr; }
        .footer-grid{ grid-template-columns:1fr 1fr; }
        .betslip{ position:fixed; left:0; right:0; bottom:0; top:auto; max-height:75vh; border-radius:18px 18px 0 0;
          transform:translateY(100%); transition:transform .25s ease; z-index:90; box-shadow:0 -10px 40px rgba(0,0,0,0.4); }
        .betslip-open{ transform:translateY(0); }
        .mobile-only{ display:inline-flex; }
        .mobile-slip-fab{ display:flex; align-items:center; gap:8px; position:fixed; bottom:18px; left:50%; transform:translateX(-50%);
          background:linear-gradient(145deg, var(--gold-bright), var(--gold)); color:#0A1D19; border:none; border-radius:24px;
          padding:12px 20px; font-weight:700; font-size:13.5px; z-index:80; box-shadow:0 8px 24px rgba(0,0,0,0.4); }
        .header{ padding:12px 16px; }
        .header-nav{ order:3; width:100%; justify-content:center; }
      }
      @media (max-width: 560px){
        .footer-grid{ grid-template-columns:1fr; }
        .banner-edit-row, .faq-edit-row{ grid-template-columns:1fr; }
      }
    `}</style>
  );
}
