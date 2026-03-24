import { useState, useEffect } from 'react';
import './Navbar.css';

const LINKS = ['Home', 'About ARIA', 'Specialities', 'Doctors', 'Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToAria = () =>
    document.getElementById('aria')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <nav className={`nav ${scrolled ? 'elevated' : ''}`}>
      <a href="#" className="nav-logo">
        <div className="nav-mark">
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3v14M3 10h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        City Hospital
      </a>

      <ul className="nav-links">
        {LINKS.map(l => (
          <li key={l}>
            <a href="#" className={l === 'Home' ? 'active' : ''}>
              {l}
            </a>
          </li>
        ))}
      </ul>

      <button className="nav-btn" onClick={scrollToAria}>
        Book Appointment
      </button>
    </nav>
  );
}