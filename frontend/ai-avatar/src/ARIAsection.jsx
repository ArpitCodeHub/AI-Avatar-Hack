import { useState, useRef, useEffect, useCallback } from 'react';
import Avatar from './Avatar';
import './ARIASection.css';

/* ─── Data ───────────────────────────────────────────────────────── */
const QUICK_CHIPS = [
  'I have chest pain', 'Need a check-up', 'Fever for 2 days',
  'Book an appointment', 'Severe headaches', 'Looking for a paediatrician',
];

const AI_REPLIES = {
  default: [
    "I understand. Could you tell me a little more — how long have you been feeling this way, and does anything make it better or worse?",
    "Thank you for sharing that. Based on what you've described, I'd suggest speaking with one of our specialists. Would you like me to find the earliest available slot?",
    "I hear you — that sounds quite uncomfortable. Let me check our availability. Do you prefer morning or afternoon appointments?",
  ],
  chest:    { text: "That's important to address right away. Chest pain can have several causes. I'd like to connect you with our Cardiology team — Dr. Mehra has an opening tomorrow at 10 AM. Shall I reserve that for you?", book: { doctor: 'Dr. Priya Mehra', specialty: 'Cardiology', date: 'Tomorrow', time: '10:00 AM', type: 'In-person' } },
  headache: { text: "Persistent headaches deserve proper attention. I'll prioritise a Neurology consultation — Dr. Kapoor is available this Friday at 2 PM. Should I go ahead and book?", book: { doctor: 'Dr. Arjun Kapoor', specialty: 'Neurology', date: 'This Friday', time: '2:00 PM', type: 'Video' } },
  fever:    { text: "A fever lasting two days needs evaluation. Our General Medicine team has slots today — Dr. Sharma is available at 4 PM. Would that work for you?", book: { doctor: 'Dr. Sunita Sharma', specialty: 'General Medicine', date: 'Today', time: '4:00 PM', type: 'In-person' } },
  book:     { text: "Of course! Which specialty are you looking for, and would you prefer an in-person visit or a video consultation?", book: null },
  check:    { text: "A general check-up is a great idea. Dr. Sharma from Internal Medicine is available tomorrow morning. Shall I book a slot?", book: { doctor: 'Dr. Sunita Sharma', specialty: 'Internal Medicine', date: 'Tomorrow', time: '9:30 AM', type: 'In-person' } },
  paed:     { text: "Our Paediatrics department is excellent. Dr. Iyer is highly recommended and has slots this week. What is the child's age?", book: { doctor: 'Dr. Rekha Iyer', specialty: 'Paediatrics', date: 'This Thursday', time: '11:00 AM', type: 'In-person' } },
};

function getReply(text) {
  const t = text.toLowerCase();
  if (t.includes('chest') || t.includes('heart'))                      return AI_REPLIES.chest;
  if (t.includes('head') || t.includes('migraine'))                    return AI_REPLIES.headache;
  if (t.includes('fever') || t.includes('temperature'))                return AI_REPLIES.fever;
  if (t.includes('book') || t.includes('appointment'))                 return AI_REPLIES.book;
  if (t.includes('check') || t.includes('general'))                    return AI_REPLIES.check;
  if (t.includes('paed') || t.includes('child') || t.includes('kid')) return AI_REPLIES.paed;
  const d = AI_REPLIES.default[Math.floor(Math.random() * 3)];
  return { text: d, book: null };
}

const BOOKING_STEPS = [
  { label: 'Analysing your symptoms',       sub: 'Cross-referencing with clinical database…' },
  { label: 'Finding available specialists', sub: 'Searching 200+ doctors in your area…' },
  { label: 'Checking appointment slots',    sub: 'Real-time calendar access…' },
  { label: 'Preparing your booking',        sub: 'Confirming doctor availability…' },
];

/* ─── Call timer hook ────────────────────────────────────────────── */
function useCallTimer(running) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) { setSeconds(0); return; }
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

/* ─── Shared AI logic hook ───────────────────────────────────────── */
function useARIA() {
  const [avState, setAvState]             = useState('idle');
  const [emotion, setEmotion]             = useState('warm');
  const [bookingInfo, setBookingInfo]     = useState(null);
  const [bookStepIdx, setBookStepIdx]     = useState(-1);
  const [bookConfirmed, setBookConfirmed] = useState(false);

  const runBookingFlow = useCallback((bookData) => {
    if (!bookData) return;
    setBookingInfo({ data: bookData });
    setBookStepIdx(0);
    setBookConfirmed(false);
    let i = 0;
    const next = () => {
      if (i < BOOKING_STEPS.length) {
        setBookStepIdx(i);
        i++;
        setTimeout(next, 900 + Math.random() * 400);
      } else {
        setTimeout(() => setBookConfirmed(true), 600);
      }
    };
    setTimeout(next, 400);
  }, []);

  const processInput = useCallback((text, onReply) => {
    const t = text.trim();
    if (!t) return;
    setAvState('listening');
    setEmotion('neutral');
    setTimeout(() => {
      setAvState('thinking');
      setTimeout(() => {
        const reply     = getReply(t);
        const replyText = typeof reply === 'string' ? reply : reply.text;
        const bookData  = typeof reply === 'object'  ? reply.book  : null;
        setEmotion('warm');
        setAvState('speaking');
        const readTime = Math.max(2000, replyText.length * 28);
        setTimeout(() => setAvState('idle'), readTime);
        if (bookData) setTimeout(() => runBookingFlow(bookData), 1200);
        onReply?.(replyText, bookData);
      }, 1100);
    }, 700);
  }, [runBookingFlow]);

  return { avState, emotion, bookingInfo, bookStepIdx, bookConfirmed, processInput, setAvState, setEmotion };
}

/* ══════════════════════════════════════════════════════════════════
   BOOKING PANEL (shared between Chat & Call)
══════════════════════════════════════════════════════════════════ */
function BookingPanel({ bookingInfo, bookStepIdx, bookConfirmed }) {
  if (!bookingInfo) return null;
  return (
    <div className="booking-panel">
      <div className="booking-header">
        <div className="booking-icon">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="4" width="14" height="12" rx="2" stroke="#0F7C6B" strokeWidth="1.5" />
            <path d="M6 2v4M12 2v4M2 8h14" stroke="#0F7C6B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h3>Booking Your Appointment</h3>
          <p>ARIA is arranging everything for you</p>
        </div>
      </div>
      <div className="booking-body">
        {!bookConfirmed ? (
          <div className="thinking-steps">
            {BOOKING_STEPS.map((s, i) => (
              <div key={i} className={`step ${i < bookStepIdx ? 'done' : i === bookStepIdx ? 'active' : ''}`}>
                <div className="step-icon">
                  {i < bookStepIdx ? (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : i === bookStepIdx ? (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                    </svg>
                  ) : (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="step-text">{s.label}</p>
                  {(i === bookStepIdx || i < bookStepIdx) && (
                    <p className="step-sub">{i < bookStepIdx ? 'Complete' : s.sub}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="confirm-card">
            <div className="confirm-header">
              <div className="confirm-check">
                <svg viewBox="0 0 18 18" fill="none">
                  <path d="M3 9l5 5 7-8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="confirm-title">Appointment Confirmed!</p>
                <p className="confirm-sub">A confirmation has been sent to your email</p>
              </div>
            </div>
            <div className="confirm-details">
              {[
                ['Doctor',    bookingInfo.data.doctor],
                ['Specialty', bookingInfo.data.specialty],
                ['Date',      bookingInfo.data.date],
                ['Time',      bookingInfo.data.time],
                ['Type',      bookingInfo.data.type],
                ['Ref #',     `MC-${Math.floor(10000 + Math.random() * 90000)}`],
              ].map(([label, value]) => (
                <div className="confirm-row" key={label}>
                  <span className="confirm-label">{label}</span>
                  <span className="confirm-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CHAT MODE
══════════════════════════════════════════════════════════════════ */
function ChatMode({ avState, processInput, bookingInfo, bookStepIdx, bookConfirmed }) {
  const [msgs, setMsgs]       = useState([{ from: 'ai', text: "Hello — I'm ARIA, your MediCore care assistant. Tell me how you're feeling today, and I'll make sure you get to the right doctor." }]);
  const [input, setInput]     = useState('');
  const [recording, setRecording] = useState(false);
  const endRef     = useRef(null);
  const inputRef   = useRef(null);
  const recognRef  = useRef(null);
  const prevCount  = useRef(1);

  // Only scroll when new message added
  useEffect(() => {
    if (msgs.length > prevCount.current) {
      prevCount.current = msgs.length;
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60);
    }
  }, [msgs]);

  const send = useCallback((text) => {
    const t = (text || input).trim();
    if (!t) return;
    setInput('');
    setMsgs(m => [...m, { from: 'user', text: t }]);
    processInput(t, (replyText) => {
      setMsgs(m => [...m, { from: 'ai', text: replyText }]);
    });
  }, [input, processInput]);

  const startVoice = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice input requires Chrome or Edge.'); return; }
    if (recording) { recognRef.current?.stop(); setRecording(false); return; }
    const rec = new SR();
    recognRef.current  = rec;
    rec.continuous     = false;
    rec.interimResults = false;
    rec.lang           = 'en-IN';
    rec.onstart  = () => setRecording(true);
    rec.onresult = (e) => { setRecording(false); send(e.results[0][0].transcript); };
    rec.onerror  = () => setRecording(false);
    rec.onend    = () => setRecording(false);
    rec.start();
  }, [recording, send]);

  const statusText = avState === 'idle' ? 'Online' : avState === 'listening' ? 'Listening…' : avState === 'thinking' ? 'Thinking…' : 'Speaking…';

  return (
    <>
      {/* Voice input trigger */}
      <div className="voice-trigger">
        <p className="vt-label">Voice Input</p>
        <div className={`mic-wave ${recording ? 'active' : ''}`}>
          <span /><span /><span /><span /><span />
        </div>
        <button className={`vt-btn ${recording ? 'recording' : ''}`} onClick={startVoice} aria-label="Voice input">
          {recording ? (
            <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10a7 7 0 0014 0" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          )}
        </button>
        <p className="vt-sub">{recording ? 'Listening — tap to stop' : 'Tap to speak your symptoms'}</p>
      </div>

      {/* Chat panel */}
      <div className="chat-panel">
        <div className="chat-topbar">
          <div className="chat-topbar-left">
            <div className="topbar-av">A</div>
            <div>
              <p className="topbar-name">ARIA — MediCore AI</p>
              <p className={`topbar-status ${avState !== 'idle' ? 'active' : ''}`}>{statusText}</p>
            </div>
          </div>
          <div className="live-indicator"><div className="live-dot" />Live</div>
        </div>

        <div className="chat-feed">
          {msgs.map((m, i) => (
            <div key={i} className={`msg-row ${m.from}`}>
              {m.from === 'ai' && <div className="msg-av">A</div>}
              <div className={`msg-bubble bubble-${m.from}`}>{m.text}</div>
            </div>
          ))}
          {avState === 'thinking' && (
            <div className="msg-row ai">
              <div className="msg-av">A</div>
              <div className="msg-bubble bubble-ai typing-bubble">
                <div className="typing-dots"><span /><span /><span /></div>
              </div>
            </div>
          )}
          <div ref={endRef} style={{ height: 0 }} />
        </div>

        <div className="quick-chips">
          {QUICK_CHIPS.map(q => <button key={q} className="chip" onClick={() => send(q)}>{q}</button>)}
        </div>

        <div className="chat-input">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Tell ARIA how you're feeling…"
            disabled={avState === 'thinking'}
          />
          <button className="send-btn" onClick={() => send()} disabled={!input.trim() || avState === 'thinking'} aria-label="Send">
            <svg viewBox="0 0 18 18" fill="none"><path d="M16 2L2 9l5 2 2 5 7-14z" fill="currentColor" /></svg>
          </button>
        </div>
      </div>

      <BookingPanel bookingInfo={bookingInfo} bookStepIdx={bookStepIdx} bookConfirmed={bookConfirmed} />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CALL MODE
══════════════════════════════════════════════════════════════════ */
function CallMode({ avState, setAvState, emotion, processInput, bookingInfo, bookStepIdx, bookConfirmed }) {
  // callStatus: 'idle' | 'ringing' | 'active' | 'ended'
  const [callStatus, setCallStatus] = useState('idle');
  const [muted, setMuted]           = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recording, setRecording]   = useState(false);
  const timer  = useCallTimer(callStatus === 'active');
  const recognRef = useRef(null);

  const startCall = () => {
    setCallStatus('ringing');
    setTranscript('');
    // ARIA "picks up" after 2s
    setTimeout(() => {
      setCallStatus('active');
      setAvState('speaking');
      setTranscript("Hello, this is ARIA. I'm here for you — how can I help you today?");
      setTimeout(() => setAvState('idle'), 3200);
    }, 2000);
  };

  const endCall = () => {
    setCallStatus('ended');
    setAvState('idle');
    recognRef.current?.stop();
    setRecording(false);
    setTranscript('Call ended. Your conversation has been saved.');
    setTimeout(() => { setCallStatus('idle'); setTranscript(''); }, 3000);
  };

  // Hold-to-speak during call
  const startVoice = useCallback(() => {
    if (callStatus !== 'active' || muted) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    if (recording) { recognRef.current?.stop(); setRecording(false); return; }
    const rec = new SR();
    recognRef.current  = rec;
    rec.continuous     = false;
    rec.interimResults = false;
    rec.lang           = 'en-IN';
    rec.onstart  = () => { setRecording(true); setAvState('listening'); setTranscript(''); };
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setRecording(false);
      setTranscript(`You: "${text}"`);
      processInput(text, (replyText) => {
        setTranscript(`ARIA: "${replyText}"`);
      });
    };
    rec.onerror = () => { setRecording(false); setAvState('idle'); };
    rec.onend   = () => setRecording(false);
    rec.start();
  }, [callStatus, muted, recording, processInput, setAvState]);

  const waveClass =
    avState === 'speaking'  ? 'speaking' :
    avState === 'listening' ? 'listening' : '';

  const callStatusLabel =
    callStatus === 'ringing' ? 'Calling ARIA…' :
    callStatus === 'active'  ? 'Connected' :
    callStatus === 'ended'   ? 'Call Ended' : '';

  const callStatusCls =
    callStatus === 'ringing' ? 'ringing' :
    callStatus === 'active'  ? 'active'  :
    callStatus === 'ended'   ? 'ended'   : '';

  return (
    <>
      <div className="call-panel">
        {/* Topbar */}
        <div className="call-topbar">
          <div className="call-topbar-left">
            <div className="topbar-av">A</div>
            <div>
              <p className="topbar-name">ARIA — Voice Call</p>
              <p className="topbar-status">AI Medical Assistant</p>
            </div>
          </div>
          {callStatus !== 'idle' && (
            <div className={`call-status-badge ${callStatusCls}`}>
              <span className="cs-dot" />
              {callStatusLabel}
            </div>
          )}
        </div>

        {/* Stage */}
        <div className="call-stage">
          {/* Ambient rings */}
          {callStatus !== 'idle' && (
            <div className="call-glow">
              <div className={`call-ring cr1 ${callStatus === 'ringing' ? 'ringing' : ''}`} />
              <div className={`call-ring cr2 ${callStatus === 'ringing' ? 'ringing' : ''}`} />
              <div className={`call-ring cr3 ${callStatus === 'ringing' ? 'ringing' : ''}`} />
            </div>
          )}

          {/* Avatar */}
          <div className="call-avatar-wrap">
            <Avatar state={callStatus === 'active' ? avState : 'idle'} emotion={emotion} size={220} />
          </div>

          <p className="call-name">ARIA</p>
          <p className="call-subtitle">MediCore AI Assistant</p>

          {/* Timer / status */}
          {callStatus === 'idle' && (
            <p className="call-timer" style={{ fontSize: '0.9rem', color: 'rgba(240,237,232,0.35)', letterSpacing: '0.06em' }}>
              Start a voice call with ARIA
            </p>
          )}
          {callStatus === 'ringing' && <p className="call-timer ringing">Connecting…</p>}
          {callStatus === 'active'  && <p className="call-timer">{timer}</p>}
          {callStatus === 'ended'   && <p className="call-timer" style={{ fontSize: '0.9rem', color: 'rgba(240,237,232,0.4)' }}>Call ended</p>}

          {/* Sound wave */}
          {callStatus === 'active' && (
            <div className={`call-wave ${waveClass}`}>
              {Array.from({ length: 15 }).map((_, i) => <span key={i} />)}
            </div>
          )}

          {/* Transcript bubble */}
          {(callStatus === 'active' || callStatus === 'ended') && transcript && (
            <div className="call-transcript">{transcript}</div>
          )}
        </div>

        {/* Controls */}
        <div className="call-controls">
          {callStatus === 'idle' && (
            /* Single dial button */
            <button className="call-ctrl" onClick={startCall}>
              <div className="call-ctrl-btn ctrl-dial">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
                </svg>
              </div>
              <span className="ctrl-label">Call ARIA</span>
            </button>
          )}

          {callStatus === 'ringing' && (
            <button className="call-ctrl" onClick={endCall}>
              <div className="call-ctrl-btn ctrl-end">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.1 6.3L6.3 2.1a1 1 0 011.4 0l3.4 3.4a1 1 0 010 1.4L9.2 8.8c-.4.4-.4 1 0 1.4l4.6 4.6c.4.4 1 .4 1.4 0l1.9-1.9a1 1 0 011.4 0l3.4 3.4a1 1 0 010 1.4l-4.2 4.2a2 2 0 01-2.8 0L2.1 9.1a2 2 0 010-2.8z" />
                </svg>
              </div>
              <span className="ctrl-label">Cancel</span>
            </button>
          )}

          {callStatus === 'active' && (
            <>
              {/* Mute */}
              <button className="call-ctrl" onClick={() => setMuted(m => !m)}>
                <div className={`call-ctrl-btn ctrl-mute ${muted ? 'muted' : ''}`}>
                  {muted ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="1" y1="1" x2="23" y2="23" />
                      <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
                      <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v3M8 23h8" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                      <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v3M8 23h8" />
                    </svg>
                  )}
                </div>
                <span className="ctrl-label">{muted ? 'Unmute' : 'Mute'}</span>
              </button>

              {/* Speak / listen button */}
              <button className="call-ctrl" onClick={startVoice} disabled={muted}>
                <div className={`call-ctrl-btn ctrl-spk ${recording ? 'muted' : ''}`} style={{ opacity: muted ? 0.4 : 1 }}>
                  {recording ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                      <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v3M8 23h8" />
                    </svg>
                  )}
                </div>
                <span className="ctrl-label">{recording ? 'Stop' : 'Speak'}</span>
              </button>

              {/* End call */}
              <button className="call-ctrl" onClick={endCall}>
                <div className="call-ctrl-btn ctrl-end">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.1 6.3L6.3 2.1a1 1 0 011.4 0l3.4 3.4a1 1 0 010 1.4L9.2 8.8c-.4.4-.4 1 0 1.4l4.6 4.6c.4.4 1 .4 1.4 0l1.9-1.9a1 1 0 011.4 0l3.4 3.4a1 1 0 010 1.4l-4.2 4.2a2 2 0 01-2.8 0L2.1 9.1a2 2 0 010-2.8z" />
                  </svg>
                </div>
                <span className="ctrl-label">End</span>
              </button>
            </>
          )}
        </div>
      </div>

      <BookingPanel bookingInfo={bookingInfo} bookStepIdx={bookStepIdx} bookConfirmed={bookConfirmed} />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN SECTION
══════════════════════════════════════════════════════════════════ */
export default function ARIASection() {
  const [mode, setMode] = useState('chat'); // 'chat' | 'call'
  const aria = useARIA();

  return (
    <section className="aria-section" id="aria">
      <div className="aria-inner">

        {/* ── LEFT: Avatar + mode switcher ── */}
        <div className="aria-left">

          {/* Avatar identity card */}
          <div className="aria-card">
            <Avatar state={aria.avState} emotion={aria.emotion} size={220} />
            <p className="aria-name">ARIA</p>
            <p className="aria-role">AI MEDICAL ASSISTANT · MEDICORE</p>
            <div className="aria-tags">
              {['🔒 HIPAA Compliant', '🌐 12 Languages', '⚡ Instant Triage', '📅 Live Scheduling'].map(tag => (
                <span className="aria-tag" key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Mode switcher */}
          <div className="mode-card">
            <p className="mode-card-label">Choose how to talk to ARIA</p>
            <div className="mode-tabs">

              <button className={`mode-tab ${mode === 'chat' ? 'active' : ''}`} onClick={() => setMode('chat')}>
                <div className="mode-tab-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ color: mode === 'chat' ? 'white' : 'var(--ink-3)' }}>
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </div>
                <span className="mode-tab-name">Chat</span>
                <span className="mode-tab-sub">Type or voice</span>
              </button>

              <button className={`mode-tab ${mode === 'call' ? 'active' : ''}`} onClick={() => setMode('call')}>
                <div className="mode-tab-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    style={{ color: mode === 'call' ? 'white' : 'var(--ink-3)' }}>
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
                  </svg>
                </div>
                <span className="mode-tab-name">Call</span>
                <span className="mode-tab-sub">Voice only</span>
              </button>

            </div>
          </div>

        </div>

        {/* ── RIGHT: Active mode panel ── */}
        <div className="aria-right">
          <div className="section-header">
            <p className="section-eyebrow">{mode === 'chat' ? 'Live Conversation' : 'Voice Call'}</p>
            <h2 className="section-title">{mode === 'chat' ? 'Chat with ARIA' : 'Call ARIA'}</h2>
            <p className="section-desc">
              {mode === 'chat'
                ? 'Describe what you\'re feeling in plain words. ARIA understands context and arranges your care — all in one conversation.'
                : 'Talk to ARIA just like a real call. She listens, responds in real-time, and books your appointment while you speak.'}
            </p>
          </div>

          {mode === 'chat' ? (
            <ChatMode
              avState={aria.avState}
              processInput={aria.processInput}
              bookingInfo={aria.bookingInfo}
              bookStepIdx={aria.bookStepIdx}
              bookConfirmed={aria.bookConfirmed}
            />
          ) : (
            <CallMode
              avState={aria.avState}
              setAvState={aria.setAvState}
              emotion={aria.emotion}
              processInput={aria.processInput}
              bookingInfo={aria.bookingInfo}
              bookStepIdx={aria.bookStepIdx}
              bookConfirmed={aria.bookConfirmed}
            />
          )}
        </div>

      </div>
    </section>
  );
}