import { useState, useEffect } from 'react';
import Avatar from './Avatar';
import './HeroSection.css';

const STATE_LABEL = {
  idle:      'Ready',
  listening: 'Listening…',
  thinking:  'Thinking…',
  speaking:  'Speaking',
};

export default function HeroSection() {
  const [avatarState, setAvatarState] = useState('idle');

  // Demo cycle on mount — shows all avatar states once
  useEffect(() => {
    const seq = [
      [1200,  'idle'],
      [2400,  'listening'],
      [5400,  'thinking'],
      [7200,  'speaking'],
      [11800, 'idle'],
    ];
    const timers = seq.map(([delay, s]) => setTimeout(() => setAvatarState(s), delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  const scrollToAria = () =>
    document.getElementById('aria')?.scrollIntoView({ behavior: 'smooth' });

  const isActive = avatarState !== 'idle';

  return (
    <section className="hero">
      <div className="hero-texture" />

      <div className="hero-grid">

        {/* ── LEFT: Avatar card ── */}
        <div className="avatar-panel">
          <div className="avatar-frame">
            <Avatar state={avatarState} emotion="warm" size={280} />

            <div className={`state-badge ${avatarState === 'thinking' ? 'thinking' : isActive ? 'active' : ''}`}>
              <span className="state-dot" />
              ARIA — {STATE_LABEL[avatarState]}
            </div>

            {/* EQ bars — visible when speaking */}
            <div className={`speaking-eq ${avatarState === 'speaking' ? 'active' : ''}`}>
              {[5, 12, 18, 12, 7, 14, 9].map((h, i) => (
                <span key={i} style={{ height: `${h}px`, opacity: avatarState === 'speaking' ? 1 : 0.25 }} />
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Copy ── */}
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            24 / 7 AI Healthcare Assistant
          </div>

          <h1 className="hero-title">
            Your health,<br />
            <em>always</em> being<br />
            heard.
          </h1>

          <p className="hero-desc">
            Meet ARIA — a conversational AI who listens like a person,
            understands your symptoms, and connects you to the right doctor
            in minutes. No forms, no hold music. Just genuine care.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={scrollToAria}>
              Talk to ARIA
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="btn-secondary" onClick={scrollToAria}>
              See how it works
            </button>
          </div>

          <div className="trust-row">
            <div className="trust-faces">
              {['#B8D4E8', '#C4D8B8', '#DEC4B8', '#B8C4D8'].map((c, i) => (
                <span key={i} className="trust-face" style={{ background: c, zIndex: 4 - i }} />
              ))}
            </div>
            <p className="trust-text"><strong>4,800+</strong> patients helped this month</p>
          </div>

          <div className="stats-strip">
            {[
              ['< 2 min', 'Avg. wait time'],
              ['200+',    'Specialists'],
              ['98%',     'Satisfaction'],
            ].map(([n, l]) => (
              <div className="stat-item" key={l}>
                <span className="stat-n">{n}</span>
                <span className="stat-l">{l}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}