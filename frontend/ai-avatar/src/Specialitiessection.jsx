import './SpecialitiesSection.css';

const SPECS = [
  { icon: '🫀', name: 'Cardiology',    desc: 'Heart & vascular care' },
  { icon: '🧠', name: 'Neurology',     desc: 'Brain & nervous system' },
  { icon: '🦴', name: 'Orthopedics',   desc: 'Bones, joints & spine' },
  { icon: '👁️', name: 'Ophthalmology', desc: 'Eyes & vision' },
  { icon: '🫁', name: 'Pulmonology',   desc: 'Lungs & respiratory' },
  { icon: '🧬', name: 'Oncology',      desc: 'Cancer care & treatment' },
  { icon: '🧒', name: 'Paediatrics',   desc: "Children's health" },
  { icon: '🦷', name: 'Dentistry',     desc: 'Oral health & care' },
];

export default function SpecialitiesSection() {
  const scrollToAria = () =>
    document.getElementById('aria')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="spec-section">
      <div className="spec-inner">
        <div className="spec-head">
          <p className="section-eyebrow">What We Treat</p>
          <h2 className="section-title">Our Specialities</h2>
          <p className="section-desc" style={{ margin: '0 auto', textAlign: 'center' }}>
            ARIA understands all of the below — just describe your symptoms in plain language.
          </p>
        </div>

        <div className="spec-grid">
          {SPECS.map(s => (
            <div
              className="spec-card"
              key={s.name}
              onClick={scrollToAria}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && scrollToAria()}
            >
              <span className="spec-em">{s.icon}</span>
              <p className="spec-name">{s.name}</p>
              <p className="spec-desc">{s.desc}</p>
              <span className="spec-arrow">→</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}