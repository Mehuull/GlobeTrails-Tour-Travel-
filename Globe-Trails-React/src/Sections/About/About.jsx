import React, { useEffect } from 'react';
import './About.css';
import aboutIcon1 from '../../assets/about-1.svg';
import aboutIcon2 from '../../assets/about-2.svg';
import aboutIcon3 from '../../assets/about-3.svg';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <h1>Our Story</h1>
        <p>Turning Travelers into Storytellers</p>
      </section>

      {/* Info Section 1 */}
      <section className="about-info-section">
        <div className="info-image-container">
          <img 
            src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2070&auto=format&fit=crop" 
            alt="Travel Adventure" 
            className="info-image" 
          />
          <div className="info-experience-badge">
            <span>12+</span>
            <p>Years of <br/> Experience</p>
          </div>
        </div>
        <div className="info-content">
          <h2>Let's Plan Your Next Vacation!</h2>
          <p>
            At GlobeTrails, we believe that travel is more than just a destination; it's a transformative experience. 
            Since 2012, we have been dedicated to curating unforgettable journeys that connect people with the cultures, 
            landscapes, and hidden gems of our beautiful planet.
          </p>
          <p>
            We work hard so you can relax. Our mission is to handle all the logistics while you focus on making 
            memories. Whether it's a serene retreat in the backwaters of Kerala or an adventurous trek in the 
            Himalayas, we are here to make your travel dreams a reality.
          </p>
        </div>
      </section>

      {/* Info Section 2: Overlapping Style */}
      <section className="about-info-section" style={{ background: '#fff' }}>
        <div className="info-content" style={{ order: window.innerWidth > 992 ? 1 : 2 }}>
          <h2>Your Luxury Vacation</h2>
          <p>
            We provide best-in-class travel experiences, from boutique stays to luxury resorts. 
            Trust reaching your chosen destination safely and comfortably, so you return 
            home feeling healthier, happier, and energized for what's ahead.
          </p>
          <p>
            Our team of passionate travel experts is one click away. We are committed to 
            responsive service, ensuring your inquiries are answered promptly and your 
            itineraries are crafted with precision. Give us a destination, and let us 
            give you the perfect plan.
          </p>
        </div>
        <div className="info-image-container" style={{ order: window.innerWidth > 992 ? 2 : 1 }}>
          <img 
            src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop" 
            alt="Luxury Resort" 
            className="info-image" 
          />
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <p className="f-section-subtitle">Why journey with us</p>
        <h2 className="f-section-title">Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">
              <img src={aboutIcon1} alt="Expert Guidance" />
            </div>
            <h3>Expert Guidance</h3>
            <p>Local insights and professional guides to show you the heart of every location.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <img src={aboutIcon2} alt="Safety First" />
            </div>
            <h3>Safety First</h3>
            <p>Your well-being is our priority. We monitor all destinations for a worry-free trip.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <img src={aboutIcon3} alt="Unique Experiences" />
            </div>
            <h3>Unique Experiences</h3>
            <p>Go beyond the tourist trails with off-beat destinations and authentic cultural stays.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;