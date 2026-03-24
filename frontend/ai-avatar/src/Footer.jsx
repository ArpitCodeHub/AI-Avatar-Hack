import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-logo">✦ MediCore</span>

        <p className="footer-copy">
          © 2025 MediCore Health Systems. Powered by ARIA AI.
        </p>

        <div className="footer-links">
          {['Privacy', 'Terms', 'Accessibility', 'Contact'].map(l => (
            <a href="#" key={l}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}