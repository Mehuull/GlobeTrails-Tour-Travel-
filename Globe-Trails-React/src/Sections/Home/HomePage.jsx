// src/components/Homepage.jsx
import React from "react";
import "./Homepage.css";

import video from "../../assets/07230.mp4";
import icon1 from "../../assets/icon1.jpg";
import icon2 from "../../assets/icon2.jpg";
import icon3 from "../../assets/icon3.jpg";
import icon4 from "../../assets/icon4.jpg";
import users from "../../assets/users.png";

import bg0 from "../../assets/bg0.png";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useSelector } from "react-redux";
import { ArrowRight } from 'lucide-react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CardGrid from "../../components/ui/CardGrids.jsx";
import Destinations from "../../components/ui/Destinations.jsx";
import Faq from "../../components/ui/Faq.jsx";

const features = [
  {
    icon: icon1,
    title: "Competitive Pricing",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    icon: icon2,
    title: "Worldwide Coverage",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    icon: icon3,
    title: "Fast Booking",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    icon: icon4,
    title: "Guided Tours",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];


const Homepage = () => {


  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>
      <section className="homepage">
        <div className="homepage__container">
          {/* Background Image */}
          <img src={bg0} alt="Background" className="background-img" />

          {/* Left Content Section */}
          <div className="homepage__content">
            <div className="homepage__text">
              <h1 className="homepage__title">
                Life is short
                <br />
                and the <span className="highlight">world</span>
                <br />
                is wide
              </h1>

              <div className="homepage__description">
                <p className="description-text">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Similique explicabo quia inventore atque, voluptatem eius
                  pariatur sequi, veniam totam eveniet vitae autem aliquid
                  voluptate, obcaecati iste placeat nihil unde harum.
                </p>
              </div>

              <img src={users} alt="Joined Users" className="homepage__users-img" />
            </div>
          </div>

          {/* Right Image Section */}
          <div className="homepage__image">
            <div className="home-image-container">
              {/* <img 
              src={Homegif} 
              alt="Tour the World - Travel destinations" 
              className="hero-image"
            /> */}
              <video
                src={video}
                className="hero-image"
                autoPlay
                loop
                muted
                playsInline
                alt="Tour the World - Travel destinations"
              />
              {/* <Lottie animationData={Lottie1} loop={true} /> */}
            </div>
          </div>
        </div>
      </section>

      <section>
        <SearchBar />
      </section>

      {/* Feature Details section */}
      <section>
        <div className="hero-container">
          <div className="hero-content-wrapper">


            <div className="hero-text-side">
              <h1>Why Choose GlobeTrails to Make Your Journey Truly <span>Meaningful?</span></h1>
              <p className="hero-desc">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>

              <ul className="hero-features">
                <li>Top Destinations</li>
                <li>Flexible Travel Packages</li>
                <li>Expert Travel Guides</li>
                <li>Affordable & Transparent Pricing</li>
              </ul>

              {/* <div className="btn-text">
                <span className="btn-small">Ready to explore <span className="btn-large">the world?</span></span>
              </div> */}

              <div className="searchbar-button-wrapper">
                <button className="searchbar-button">
                  Discover Now
                </button>
              </div>
            </div>


            <div className="hero-image-side">


              <div className="image-group-main">
                <div className="experience-badge">
                  <strong>25+</strong>
                  <span>Years Experienced</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
                  alt="Traveler"
                  className="tall-image"
                />
              </div>


              <div className="image-group-sub">
                <img
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
                  alt="City"
                  className="wide-image"
                />
                <div className="sub-text">
                  <h3>Gateway to Unforgettable Journeys.</h3>
                  <p>GlobeTrails is a trusted travel agency that brings the best travel experiences to exotic destinations around the world.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Brand Bar */}
          {/* <div className="brand-bar">
            <span className="brand-label">Trusted by World-Class Travel Brands</span>
            <div className="brand-logos">
             
              <span>Rora-Roots</span>
              <span>ORBIT INC.</span>
              <span>House Pixel</span>
              <span>Procifista</span>
            </div>
          </div> */}
        </div>
      </section>

      <Destinations />

      {/* why-choose-us section*/}
      <section className="why-choose-us">
        <p className="f-section-subtitle">Brilliant reasons</p>
        <h2 className="f-section-title">Why Choose Us</h2>

        <div className="features-container">
          {features.map((item, index) => (
            <div className="feature-card" key={index}>
              <img src={item.icon} alt={item.title} className="feature-icon" />
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <CardGrid />

      {/* FAQ Section */}
      <Faq />
    </>
  );
};

export default Homepage;
