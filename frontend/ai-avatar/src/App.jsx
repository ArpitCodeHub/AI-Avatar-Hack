import Navbar from './Navbar';
import HeroSection from './HeroSection';
import ARIASection from './ARIASection';
import SpecialitiesSection from './SpecialitiesSection';
import CTABanner from './CTABanner';
import Footer from './Footer';
import './styles/global.css';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <HeroSection />
      <ARIASection />
      <SpecialitiesSection />
      <CTABanner />
      <Footer />
    </div>
  );
}