import './CTABanner.css';

export default function CTABanner() {
  const scrollToAria = () =>
    document.getElementById('aria')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="cta-section">
      <div className="cta-inner">
        <div className="cta-text">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Start Now
          </div>
          <h2>The right doctor is one conversation away.</h2>
          <p>
            No referrals, no waiting rooms, no paperwork. Tell ARIA what's
            going on — she'll handle everything else.
          </p>
        </div>

        <div className="cta-actions">
          <button className="btn-primary" onClick={scrollToAria}>
            Talk to ARIA
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="cta-ghost">Or call us: +91 22 4800 4800</button>
        </div>
      </div>
    </section>
  );
}