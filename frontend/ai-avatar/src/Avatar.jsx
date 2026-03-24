import { useEffect, useRef, useState } from 'react';

/*
  Avatar — animated SVG medical assistant face.
  Props:
    state   : 'idle' | 'listening' | 'thinking' | 'speaking'
    emotion : 'neutral' | 'warm' | 'concerned' | 'happy'
    size    : number (width px, height scales 430/320)

  FIX NOTES:
  - All lashes are now drawn as SVG <path> curves (no <line> with scaleY transforms).
    The previous <line> + scaleY(0.04) approach caused a cross-browser rendering bug
    where the transform-origin was misapplied, making lashes appear as a thick black mask.
  - Blink is handled by scaling only the eyelid <path> shapes, not individual lash elements.
  - No speech synthesis — voice reply is handled by the parent/backend.
*/
export default function Avatar({ state = 'idle', emotion = 'warm', size = 340 }) {
  const [blink, setBlink]             = useState(false);
  const [mouthOpen, setMouthOpen]     = useState(0);
  const [breathY, setBreathY]         = useState(0);
  const [eyebrowRaise, setEyebrowRaise] = useState(0);
  const blinkRef  = useRef(null);
  const talkRef   = useRef(null);
  const breathRef = useRef(null);

  // ── Blink loop ─────────────────────────────────────────────────────
  useEffect(() => {
    const schedule = () => {
      blinkRef.current = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 130);
        schedule();
      }, 2600 + Math.random() * 3400);
    };
    schedule();
    return () => clearTimeout(blinkRef.current);
  }, []);

  // ── Breathing ──────────────────────────────────────────────────────
  useEffect(() => {
    let t = 0;
    const tick = () => {
      t += 0.016;
      setBreathY(Math.sin(t * (state === 'speaking' ? 1.8 : 0.65)) * 2.2);
      breathRef.current = requestAnimationFrame(tick);
    };
    breathRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(breathRef.current);
  }, [state]);

  // ── Lip sync ───────────────────────────────────────────────────────
  useEffect(() => {
    if (state === 'speaking') {
      let t = 0;
      talkRef.current = setInterval(() => {
        t += 0.11;
        setMouthOpen(Math.max(0, Math.sin(t * 7) * 0.55 + Math.sin(t * 13) * 0.22 + 0.12));
      }, 58);
    } else {
      clearInterval(talkRef.current);
      setMouthOpen(state === 'listening' ? 0.05 : 0);
    }
    return () => clearInterval(talkRef.current);
  }, [state]);

  // ── Eyebrow raise ─────────────────────────────────────────────────
  useEffect(() => {
    if      (state === 'thinking')            setEyebrowRaise(0.7);
    else if (state === 'listening')           setEyebrowRaise(0.4);
    else if (emotion === 'warm' || emotion === 'happy') setEyebrowRaise(0.18);
    else                                      setEyebrowRaise(0);
  }, [state, emotion]);

  // ── Derived values ─────────────────────────────────────────────────
  // Blink: lid covers the eye by moving down
  const lidY  = blink ? 15 : 0;   // how many px the upper lid drops
  const lidOp = blink ? 1 : 0;    // closed-lid fill opacity

  const mc     = emotion === 'warm' ? 8 + mouthOpen * 4 : mouthOpen * 2;
  const ebOff  = -eyebrowRaise * 5;
  const ebTilt =  eyebrowRaise * 2.5;

  const irisCol =
    state === 'thinking'    ? '#5a8fb8' :
    emotion === 'concerned' ? '#5b8fa8' : '#4a90c4';

  // Pupil dilates slightly when active
  const pupilR = state === 'speaking' || state === 'listening' ? 5.8 : 4.8;

  return (
    <svg
      viewBox="0 0 320 430"
      width={size}
      height={Math.round(size * 430 / 320)}
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `translateY(${breathY}px)`, display: 'block' }}
    >
      <defs>
        {/* ── Skin tones ── */}
        <radialGradient id="av-skin" cx="50%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#FDECD8" />
          <stop offset="50%"  stopColor="#F5C8A2" />
          <stop offset="100%" stopColor="#E8A87C" />
        </radialGradient>
        <radialGradient id="av-neck" cx="50%" cy="15%" r="75%">
          <stop offset="0%"   stopColor="#F0CCA8" />
          <stop offset="100%" stopColor="#D49470" />
        </radialGradient>
        {/* ── Eyes ── */}
        <radialGradient id="av-white" cx="38%" cy="30%" r="68%">
          <stop offset="0%"   stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F5F2EE" />
        </radialGradient>
        <radialGradient id="av-iris" cx="30%" cy="25%" r="68%">
          <stop offset="0%"   stopColor="#8EC8F0" />
          <stop offset="40%"  stopColor={irisCol} />
          <stop offset="100%" stopColor="#1C4A78" />
        </radialGradient>
        <radialGradient id="av-shine" cx="28%" cy="22%" r="45%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.75" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        {/* ── Hair ── */}
        <linearGradient id="av-hair" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%"   stopColor="#2A1205" />
          <stop offset="40%"  stopColor="#3D1C08" />
          <stop offset="100%" stopColor="#150902" />
        </linearGradient>
        {/* ── Lips ── */}
        <linearGradient id="av-lip-top" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#D9735C" />
          <stop offset="100%" stopColor="#BC4C38" />
        </linearGradient>
        <linearGradient id="av-lip-bot" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#C85848" />
          <stop offset="100%" stopColor="#A83830" />
        </linearGradient>
        {/* ── Blush ── */}
        <radialGradient id="av-blush" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#EE8888"
            stopOpacity={emotion === 'warm' || emotion === 'happy' ? '0.28' : '0.1'} />
          <stop offset="100%" stopColor="#EE8888" stopOpacity="0" />
        </radialGradient>
        {/* ── Scrubs ── */}
        <linearGradient id="av-scrubs" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#0F7C6B" />
          <stop offset="100%" stopColor="#0A5E52" />
        </linearGradient>
        {/* ── Filters ── */}
        <filter id="av-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#00000015" />
        </filter>
        <filter id="av-blur">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        {/* ── Eye clip paths ── */}
        <clipPath id="av-clip-l">
          <ellipse cx="112" cy="181" rx="21" ry="14" />
        </clipPath>
        <clipPath id="av-clip-r">
          <ellipse cx="208" cy="181" rx="21" ry="14" />
        </clipPath>
      </defs>

      {/* ════════════════════════════════════════
          UNIFORM / SCRUBS
      ════════════════════════════════════════ */}
      {/* Torso */}
      <path d="M 55 430 Q 72 368 92 345 Q 114 328 160 328 Q 206 328 228 345 Q 248 368 265 430 Z"
        fill="url(#av-scrubs)" />
      {/* V-neck lapel */}
      <path d="M 136 330 L 152 356 L 160 346 L 168 356 L 184 330 Q 160 340 136 330 Z"
        fill="rgba(255,255,255,0.18)" />
      <path d="M 134 332 L 150 360 L 160 348 L 170 360 L 186 332"
        fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Shoulders */}
      <path d="M 55 430 Q 64 372 94 348 Q 108 340 124 338 L 120 352 Q 96 360 82 398 Z"
        fill="url(#av-scrubs)" opacity="0.65" />
      <path d="M 265 430 Q 256 372 226 348 Q 212 340 196 338 L 200 352 Q 224 360 238 398 Z"
        fill="url(#av-scrubs)" opacity="0.65" />
      {/* ID Badge */}
      <rect x="97" y="358" width="30" height="20" rx="3" fill="white" opacity="0.92" />
      <rect x="100" y="361" width="24" height="3.5" rx="1.5" fill="#0F7C6B" opacity="0.85" />
      <rect x="100" y="367" width="18" height="2.5" rx="1"   fill="#B0A898" opacity="0.7" />
      <rect x="100" y="372" width="21" height="2.5" rx="1"   fill="#B0A898" opacity="0.5" />

      {/* ════════════════════════════════════════
          NECK
      ════════════════════════════════════════ */}
      <path d="M 138 326 Q 132 356 132 376 Q 160 388 188 376 Q 188 356 182 326 Z"
        fill="url(#av-neck)" />
      {/* Neck shadows */}
      <path d="M 138 326 Q 130 354 132 372 Q 142 364 146 346 Z" fill="rgba(180,120,80,0.35)" />
      <path d="M 182 326 Q 190 354 188 372 Q 178 364 174 346 Z" fill="rgba(180,120,80,0.35)" />

      {/* ════════════════════════════════════════
          HEAD
      ════════════════════════════════════════ */}
      <ellipse cx="160" cy="198" rx="114" ry="126" fill="url(#av-skin)" filter="url(#av-shadow)" />
      {/* Jaw / chin extension */}
      <path d="M 68 220 Q 54 282 82 322 Q 114 358 160 366 Q 206 358 238 322 Q 266 282 252 220"
        fill="url(#av-skin)" />

      {/* ════════════════════════════════════════
          EARS + EARRINGS
      ════════════════════════════════════════ */}
      <ellipse cx="48"  cy="210" rx="13" ry="19" fill="#EBBF92" />
      <path d="M 51 201 Q 44 210 51 219" stroke="#D4906A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="272" cy="210" rx="13" ry="19" fill="#EBBF92" />
      <path d="M 269 201 Q 276 210 269 219" stroke="#D4906A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Gold stud earrings */}
      <circle cx="49"  cy="207" r="4.5" fill="#C9973A" />
      <circle cx="50"  cy="206" r="1.8" fill="rgba(255,255,255,0.65)" />
      <circle cx="271" cy="207" r="4.5" fill="#C9973A" />
      <circle cx="272" cy="206" r="1.8" fill="rgba(255,255,255,0.65)" />

      {/* ════════════════════════════════════════
          HAIR
      ════════════════════════════════════════ */}
      {/* Main hair mass */}
      <ellipse cx="160" cy="128" rx="118" ry="94" fill="url(#av-hair)" />
      {/* Top flow */}
      <path d="M 47 162 Q 39 76 102 50 Q 132 38 160 37 Q 188 38 218 50 Q 281 76 273 162"
        fill="url(#av-hair)" />
      {/* Soft side pieces framing face */}
      <path d="M 49 168 Q 40 196 43 232 Q 51 218 57 196 Z" fill="#1C0B02" opacity="0.85" />
      <path d="M 271 168 Q 280 196 277 232 Q 269 218 263 196 Z" fill="#1C0B02" opacity="0.85" />
      {/* Hairline fade */}
      <path d="M 76 126 Q 100 106 132 96 Q 160 90 188 96 Q 220 106 244 126"
        fill="none" stroke="#FDECD8" strokeWidth="24" strokeLinecap="round" opacity="0.22" />
      {/* Hair highlight streaks */}
      <path d="M 116 48 Q 152 40 184 50"
        fill="none" stroke="#5C2E10" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
      <path d="M 98 78 Q 128 63 160 60 Q 192 63 216 74"
        fill="none" stroke="#3E1A08" strokeWidth="3" strokeLinecap="round" opacity="0.38" />

      {/* Forehead shadow */}
      <ellipse cx="160" cy="148" rx="94" ry="28" fill="rgba(220,140,90,0.18)" filter="url(#av-blur)" />

      {/* ════════════════════════════════════════
          EYEBROWS  (drawn as smooth paths, no transforms)
      ════════════════════════════════════════ */}
      {/* Left brow */}
      <path
        d={`M 87 ${152+ebOff+ebTilt} Q 110 ${143+ebOff} 133 ${149+ebOff-ebTilt}`}
        fill="none" stroke="#2C1306" strokeWidth="5.5" strokeLinecap="round" opacity="0.88"
      />
      {/* Right brow */}
      <path
        d={`M 187 ${149+ebOff-ebTilt} Q 210 ${143+ebOff} 233 ${152+ebOff+ebTilt}`}
        fill="none" stroke="#2C1306" strokeWidth="5.5" strokeLinecap="round" opacity="0.88"
      />

      {/* ════════════════════════════════════════
          EYES
          Strategy: draw whites + iris normally.
          Blink = a solid filled arc (eyelid) that slides down over the eye.
          NO scaleY transforms on individual elements.
      ════════════════════════════════════════ */}

      {/* ── LEFT EYE ── */}
      {/* Under-eye shadow */}
      <ellipse cx="112" cy="186" rx="20" ry="6" fill="rgba(200,130,80,0.22)" filter="url(#av-blur)" />
      {/* Eye white */}
      <ellipse cx="112" cy="181" rx="21" ry="14" fill="url(#av-white)" />
      {/* Iris + pupil clipped to white */}
      <g clipPath="url(#av-clip-l)">
        <circle cx="112" cy="182" r="11.5" fill="url(#av-iris)" />
        <circle cx="112" cy="182" r={pupilR} fill="#080402" />
        {/* Iris texture ring */}
        <circle cx="112" cy="182" r="9" fill="none" stroke="rgba(100,160,220,0.25)" strokeWidth="2" />
        {/* Catchlight */}
        <circle cx="108" cy="178" r="3.8" fill="url(#av-shine)" />
        <circle cx="116" cy="185" r="1.6" fill="white" opacity="0.3" />
      </g>
      {/* Upper lid line */}
      <path d="M 91 175 Q 112 165 133 175"
        fill="none" stroke="#2C1306" strokeWidth="2.5" strokeLinecap="round" />
      {/* LASHES — drawn as a curved path above the lid, no transforms needed */}
      <path d="M 92 173 C 95 167 99 165 103 168 C 106 163 110 162 113 165 C 116 161 120 162 123 166 C 126 163 129 165 131 170"
        fill="none" stroke="#1A0802" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Lower lash line — subtle, just a path */}
      <path d="M 92 187 Q 112 194 132 187"
        fill="none" stroke="rgba(200,140,90,0.5)" strokeWidth="1.2" strokeLinecap="round" />
      {/* BLINK overlay — eyelid path that slides in from top */}
      {blink && (
        <path
          d={`M 91 175 Q 112 165 133 175 Q 120 ${175+lidY+8} 112 ${175+lidY+10} Q 104 ${175+lidY+8} 91 175 Z`}
          fill="url(#av-skin)"
          opacity={lidOp}
        />
      )}

      {/* ── RIGHT EYE ── */}
      <ellipse cx="208" cy="186" rx="20" ry="6" fill="rgba(200,130,80,0.22)" filter="url(#av-blur)" />
      <ellipse cx="208" cy="181" rx="21" ry="14" fill="url(#av-white)" />
      <g clipPath="url(#av-clip-r)">
        <circle cx="208" cy="182" r="11.5" fill="url(#av-iris)" />
        <circle cx="208" cy="182" r={pupilR} fill="#080402" />
        <circle cx="208" cy="182" r="9" fill="none" stroke="rgba(100,160,220,0.25)" strokeWidth="2" />
        <circle cx="204" cy="178" r="3.8" fill="url(#av-shine)" />
        <circle cx="212" cy="185" r="1.6" fill="white" opacity="0.3" />
      </g>
      <path d="M 187 175 Q 208 165 229 175"
        fill="none" stroke="#2C1306" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 189 173 C 192 167 196 165 200 168 C 203 163 206 162 209 165 C 212 161 216 162 219 166 C 222 163 225 165 227 170"
        fill="none" stroke="#1A0802" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 188 187 Q 208 194 228 187"
        fill="none" stroke="rgba(200,140,90,0.5)" strokeWidth="1.2" strokeLinecap="round" />
      {blink && (
        <path
          d={`M 187 175 Q 208 165 229 175 Q 216 ${175+lidY+8} 208 ${175+lidY+10} Q 200 ${175+lidY+8} 187 175 Z`}
          fill="url(#av-skin)"
          opacity={lidOp}
        />
      )}

      {/* ════════════════════════════════════════
          NOSE
      ════════════════════════════════════════ */}
      {/* Bridge */}
      <path d="M 153 190 Q 148 220 147 237 Q 153 248 160 249 Q 167 248 173 237 Q 172 220 167 190"
        fill="none" stroke="rgba(200,130,80,0.38)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Nostrils */}
      <ellipse cx="150" cy="246" rx="10" ry="6" fill="rgba(200,120,75,0.28)" />
      <ellipse cx="170" cy="246" rx="10" ry="6" fill="rgba(200,120,75,0.28)" />
      {/* Nose tip highlight */}
      <ellipse cx="160" cy="241" rx="8" ry="5" fill="rgba(255,255,255,0.2)" />
      {/* Nostril definition */}
      <path d="M 144 246 Q 150 251 157 247" fill="none" stroke="rgba(160,90,55,0.38)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 176 246 Q 170 251 163 247" fill="none" stroke="rgba(160,90,55,0.38)" strokeWidth="1.5" strokeLinecap="round" />

      {/* ════════════════════════════════════════
          CHEEK BLUSH
      ════════════════════════════════════════ */}
      <ellipse cx="82"  cy="226" rx="33" ry="20" fill="url(#av-blush)" />
      <ellipse cx="238" cy="226" rx="33" ry="20" fill="url(#av-blush)" />

      {/* ════════════════════════════════════════
          NASOLABIAL FOLDS (subtle)
      ════════════════════════════════════════ */}
      <path d="M 129 242 Q 123 264 129 280" fill="none" stroke="rgba(190,120,75,0.32)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 191 242 Q 197 264 191 280" fill="none" stroke="rgba(190,120,75,0.32)" strokeWidth="1.2" strokeLinecap="round" />

      {/* ════════════════════════════════════════
          MOUTH
      ════════════════════════════════════════ */}
      {/* Upper lip */}
      <path
        d={`M 131 ${287 - mouthOpen*2}
            Q 148 ${281 - mouthOpen*3 - mc*0.5} 160 ${285 - mouthOpen*2}
            Q 172 ${281 - mouthOpen*3 - mc*0.5} 189 ${287 - mouthOpen*2}
            Q 175 ${297 + mouthOpen*2} 160 ${295 + mouthOpen*2}
            Q 145 ${297 + mouthOpen*2} 131 ${287 - mouthOpen*2} Z`}
        fill="url(#av-lip-top)" opacity="0.94"
      />
      {/* Lower lip */}
      <path
        d={`M 133 ${294 + mouthOpen*3}
            Q 160 ${306 + mouthOpen*4 + mc} 187 ${294 + mouthOpen*3}
            Q 175 ${314 + mouthOpen*5 + mc} 160 ${316 + mouthOpen*5 + mc}
            Q 145 ${314 + mouthOpen*5 + mc} 133 ${294 + mouthOpen*3} Z`}
        fill="url(#av-lip-bot)" opacity="0.88"
      />
      {/* Mouth opening */}
      {mouthOpen > 0.06 && (
        <ellipse
          cx="160"
          cy={292 + mouthOpen*5}
          rx={21 * mouthOpen}
          ry={Math.max(1, (7 + mouthOpen*16) * 0.5 * mouthOpen)}
          fill="#3A0D08"
        />
      )}
      {/* Lip shine */}
      <ellipse cx="156" cy="302" rx="13" ry="4" fill="rgba(255,160,140,0.3)" />
      {/* Philtrum */}
      <path d="M 154 279 Q 160 283 166 279"
        fill="none" stroke="rgba(210,120,90,0.42)" strokeWidth="1.2" strokeLinecap="round" />

      {/* ════════════════════════════════════════
          FACE HIGHLIGHTS
      ════════════════════════════════════════ */}
      {/* Chin */}
      <ellipse cx="160" cy="340" rx="17" ry="9" fill="rgba(255,255,255,0.12)" />
      {/* Cheekbone catches */}
      <ellipse cx="88"  cy="206" rx="22" ry="13" fill="rgba(255,255,255,0.14)" transform="rotate(-15 88 206)" />
      <ellipse cx="232" cy="206" rx="22" ry="13" fill="rgba(255,255,255,0.14)" transform="rotate(15 232 206)" />
    </svg>
  );
}