import React, { useEffect } from 'react';
import './style.css';

const Preloader = () => {
  useEffect(() => {
    // Add preloading class on mount
    document.body.classList.add("preloading");

    // Remove preloading and add loaded class after 2.8s
    const timer = setTimeout(() => {
      document.body.classList.add("loaded");
      document.body.classList.remove("preloading");
    }, 2800);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="preloader"
      id="preloader"
      aria-live="polite"
      aria-label="Initializing Health Assistant"
    >
      <div className="preloader-content">
        <svg
          className="preloader-figure"
          viewBox="0 0 520 360"
          role="img"
          aria-label="Health assistant preloader"
        >
          <defs>
            <linearGradient id="cyanStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#74eaff" />
              <stop offset="50%" stopColor="#4bd6f6" />
              <stop offset="100%" stopColor="#1ca6cd" />
            </linearGradient>
            <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="3"
                floodColor="#74eaff"
                floodOpacity="0.85"
              />
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="8"
                floodColor="#3fd9ff"
                floodOpacity="0.55"
              />
            </filter>
          </defs>

          <g className="figure-core" filter="url(#neonGlow)">
            <circle cx="260" cy="98" r="42" fill="rgba(168, 244, 255, 0.2)" />
            <path
              d="M260 142c-56 0-96 43-96 99v32h192v-32c0-56-40-99-96-99Z"
              fill="rgba(125, 236, 255, 0.18)"
            />
          </g>

          <g
            className="figure-lines"
            filter="url(#neonGlow)"
            fill="none"
            stroke="url(#cyanStroke)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="260" cy="98" r="42" />
            <path d="M260 142c-56 0-96 43-96 99v32h192v-32c0-56-40-99-96-99Z" />
            <path d="M228 96c8-14 22-20 38-18 15 1 27 9 35 22" />
            <path d="M228 168c8 16 19 26 32 32" />
            <path d="M292 168c-8 16-19 26-32 32" />
            <path d="M200 212c13 7 24 18 31 33" />
            <path d="M320 212c-13 7-24 18-31 33" />
          </g>

          <g className="medical-badge" filter="url(#neonGlow)">
            <circle cx="355" cy="176" r="22" fill="rgba(125, 236, 255, 0.25)" />
            <path
              d="M355 164v24M343 176h24"
              stroke="url(#cyanStroke)"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>

          <g className="data-nodes" fill="#6fe9ff" filter="url(#neonGlow)">
            <circle cx="165" cy="286" r="4" />
            <circle cx="355" cy="176" r="3" />
            <circle cx="356" cy="201" r="3" />
            <circle cx="355" cy="152" r="3" />
            <circle cx="333" cy="177" r="3" />
            <circle cx="378" cy="177" r="3" />
            <circle cx="355" cy="286" r="4" />
          </g>

          <path
            className="ecg-track"
            d="M65 315H188l14-2 11-16 11 54 11-64 12 35 10-12 8 5h11l14-24 11 46 12-34 8 9h109"
            fill="none"
            stroke="url(#cyanStroke)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neonGlow)"
          />
        </svg>
        <p className="preloader-text">Initializing Health Assistant...</p>
      </div>
    </div>
  );
};

export default Preloader;