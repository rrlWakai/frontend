import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Role = "user" | "model";

type ChatMessage = {
  id: number;
  role: Role;
  text: string;
};

type ChatReplyPayload = {
  reply?: unknown;
  action?: unknown;
};

/* Base URL of the backend. Unset → same-origin (Vite /api proxy in dev,
   Vercel rewrite in prod); dev without the proxy falls back to localhost. */
const API_BASE =
  (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "") ||
  (import.meta.env.DEV ? "http://localhost:4000" : "");

const EMAIL = "lumborhenrhen@gmail.com";
const REQUEST_TIMEOUT_MS = 30_000;
const INPUT_MAX_LENGTH = 300;

/* Shown whenever the request itself fails — never a stack trace. */
const FALLBACK_REPLY = `Hmm, hindi nag-connect yung assistant. Email mo na lang si Rhen-Rhen sa ${EMAIL} and he'll get back to you.`;

/* Suggestions that change with the section currently in view
   (IntersectionObserver below). */
const SUGGESTIONS_BY_SECTION: Record<string, [string, string]> = {
  experience: ["What do you do?", "What’s your stack?"],
  projects: ["Tell me about KRiB", "What have you built?"],
  education: ["Where did you study?", "What’s your stack?"],
  certifications: ["Any certifications?", "Where did you study?"],
  contact: ["Are you available?", "How do I reach you?"],
  gallery: ["Tell me about KRiB", "Are you available?"],
};

const DEFAULT_SUGGESTIONS: [string, string] = ["What’s your stack?", "Are you available?"];

/* Sections a "scroll:*" action may target — mirrored from the backend. */
const SECTION_IDS = Object.keys(SUGGESTIONS_BY_SECTION);

/* Answered locally: no API call, so the common questions never touch
   the Gemini quota. */
const LOCAL_ANSWERS: { pattern: RegExp; reply: string }[] = [
  {
    pattern: /\b(stack|tech|technologies|technology|tools|languages|frameworks)\b/i,
    reply:
      "React, TypeScript, JavaScript, Node.js, Express, Supabase, MongoDB, MySQL, PostgreSQL, Tailwind, Framer Motion, Flutter, Dart, Git, Vite, Figma, Postman and Vercel — mostly React + TypeScript up front, Node/Express with Supabase or SQL at the back.",
  },
  {
    pattern: /\b(available|availability|hire|hiring|open for|take on)\b/i,
    reply: `Yes — Rhen-Rhen is open for business websites, web applications, reservation systems and custom business systems. Email ${EMAIL} and let’s talk about your project.`,
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function scrollToSection(id: string, smooth: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
}

function ChatWidget() {
  const reduced = Boolean(useReducedMotion());

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typing, setTyping] = useState<{ id: number; full: string; shown: number } | null>(
    null,
  );
  const [section, setSection] = useState("default");

  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const everOpenedRef = useRef(false);

  /* ── Typewriter — advances only from timers, never synchronously ── */
  useEffect(() => {
    if (!typing || typing.shown >= typing.full.length) return;
    const step = Math.max(1, Math.ceil(typing.full.length / 110));
    const timer = window.setTimeout(() => {
      setTyping((prev) =>
        prev ? { ...prev, shown: Math.min(prev.full.length, prev.shown + step) } : prev,
      );
    }, 16);
    return () => window.clearTimeout(timer);
  }, [typing]);

  /* ── Focus: input on open, launcher on close (never on first load) ── */
  useEffect(() => {
    if (open) {
      everOpenedRef.current = true;
      inputRef.current?.focus();
      return;
    }
    if (!everOpenedRef.current) return;
    const frame = window.requestAnimationFrame(() => launcherRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  /* ── "/" opens, Esc closes ── */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        return;
      }
      if (e.key !== "/" || open || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      setOpen(true);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  /* ── Which section sits in the viewport's middle band ── */
  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setSection(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ── Keep the transcript pinned to the bottom ── */
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, isLoading, open]);

  function startTypewriter(id: number, full: string) {
    if (reduced) return;
    setTyping({ id, full, shown: 0 });
  }

  function pushReply(reply: string) {
    idRef.current += 1;
    const id = idRef.current;
    setMessages((prev) => [...prev, { id, role: "model", text: reply }]);
    startTypewriter(id, reply);
  }

  async function send(raw: string) {
    const text = raw.trim().slice(0, INPUT_MAX_LENGTH);
    if (!text || isLoading) return;

    setInput("");
    idRef.current += 1;
    const nextMessages: ChatMessage[] = [
      ...messages,
      { id: idRef.current, role: "user", text },
    ];
    setMessages(nextMessages);
    setIsLoading(true);

    const local = LOCAL_ANSWERS.find((entry) => entry.pattern.test(text));
    if (local) {
      setIsLoading(false);
      pushReply(local.reply);
      return;
    }

    let reply = FALLBACK_REPLY;
    let action: string | null = null;

    try {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        const res = await fetch(`${API_BASE}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages.map(({ role, text: t }) => ({ role, text: t })),
          }),
          signal: controller.signal,
        });
        const data = (await res.json()) as ChatReplyPayload | null;
        if (data && typeof data.reply === "string" && data.reply.trim()) {
          reply = data.reply.trim();
          action = typeof data.action === "string" ? data.action : null;
        }
      } finally {
        window.clearTimeout(timer);
      }
    } catch {
      /* offline / timeout / non-JSON body → friendly fallback reply */
    }

    setIsLoading(false);
    pushReply(reply);

    if (action && action.startsWith("scroll:")) {
      const id = action.slice("scroll:".length);
      if (SECTION_IDS.includes(id)) scrollToSection(id, !reduced);
    }
  }

  const suggestions = SUGGESTIONS_BY_SECTION[section] ?? DEFAULT_SUGGESTIONS;

  return (
    <div className="chat-root">
      {/* Surface that morphs between launcher bubble and panel */}
      <motion.div
        className={`chat-surface ${open ? "chat-surface--panel" : "chat-surface--bubble"}`}
        layoutId="chat-surface"
        transition={reduced ? { duration: 0 } : { duration: 0.4, ease: EASE }}
        aria-hidden="true"
      />

      <AnimatePresence>
        {open ? (
          <motion.div
            key="panel"
            className="chat-panel"
            role="dialog"
            aria-label="Ask about my work"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: reduced ? { duration: 0 } : { delay: 0.16, duration: 0.18 },
            }}
            exit={{ opacity: 0, transition: reduced ? { duration: 0 } : { duration: 0.12 } }}
          >
            <header className="chat-masthead">
              <div className="chat-masthead-text">
                <h2 className="chat-title">Ask about my work</h2>
                <p className="chat-sub">Projects, stack and availability. Taglish is fine.</p>
              </div>
              <button
                type="button"
                className="chat-close"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                ✕
              </button>
            </header>

            <div
              className="chat-log"
              ref={logRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
            >
              {messages.length === 0 && !isLoading && (
                <p className="chat-empty">
                  Hi — ask me about Rhen-Rhen’s projects, stack or availability.
                </p>
              )}

              {messages.map((m) => {
                if (m.role === "user") {
                  return (
                    <p key={m.id} className="chat-msg chat-msg--user">
                      {m.text}
                    </p>
                  );
                }
                const isTyping =
                  typing !== null && typing.id === m.id && typing.shown < typing.full.length;
                const shown =
                  typing !== null && typing.id === m.id
                    ? typing.full.slice(0, typing.shown)
                    : m.text;
                return (
                  <p key={m.id} className="chat-msg chat-msg--model">
                    {shown}
                    {isTyping && <span className="chat-caret" aria-hidden="true" />}
                  </p>
                );
              })}

              {isLoading && (
                <div className="chat-dots" role="status" aria-label="Assistant is typing">
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </div>

            <div className="chat-foot">
              <div className="chat-suggestions">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="chat-suggest"
                    onClick={() => send(s)}
                    disabled={isLoading}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <form
                className="chat-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
              >
                <label className="chat-visually-hidden" htmlFor="chat-input">
                  Type your question
                </label>
                <input
                  id="chat-input"
                  ref={inputRef}
                  className="chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={INPUT_MAX_LENGTH}
                  placeholder="Type a question…"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="submit"
                  className="chat-send"
                  disabled={isLoading || input.trim() === ""}
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="launcher"
            className="chat-launcher"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: reduced ? { duration: 0 } : { delay: 0.18, duration: 0.18 },
            }}
            exit={{ opacity: 0, transition: reduced ? { duration: 0 } : { duration: 0.12 } }}
          >
            <button
              type="button"
              ref={launcherRef}
              className="chat-launcher-btn"
              onClick={() => setOpen(true)}
              aria-label="Open the chat assistant — ask me anything"
              aria-haspopup="dialog"
            >
              <img className="chat-launcher-photo" src="/profile.png" alt="" draggable={false} />
              <span className="chat-status-dot" aria-hidden="true" />

              <span className="chat-badge" aria-hidden="true">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="currentColor"
                  focusable="false"
                >
                  <circle cx="3.6" cy="7" r="1.2" />
                  <circle cx="7" cy="7" r="1.2" />
                  <circle cx="10.4" cy="7" r="1.2" />
                </svg>
              </span>

              <span className="chat-hint" aria-hidden="true">
                Ask me anything
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatWidget;
