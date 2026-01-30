import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <h2>GlobeTrails</h2>
                    <p>
                        We are a leading travel agency dedicated to providing
                        the best and most memorable travel experiences around the world.
                        Let's plan your next adventure together!
                    </p>
                    <div className="social-links">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">
                            <Facebook size={20} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon">
                            <Twitter size={20} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon">
                            <Instagram size={20} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon">
                            <Linkedin size={20} />
                        </a>
                    </div>
                </div>

                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/tours">All Tours</Link></li>
                        <li><Link to="/profile">My Profile</Link></li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h3>Legal</h3>
                    <ul>
                        <li><Link to="/terms">Terms & Conditions</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/contact">Contact Support</Link></li>
                    </ul>
                </div>

                <div className="footer-newsletter">
                    <h3>Our Newsletter</h3>
                    <p>Subscribe to get travel tips and exclusive discounts.</p>
                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Enter your email" required />
                        <button type="submit">
                            Subscribe Now <Send size={16} style={{ marginLeft: '8px', display: 'inline' }} />
                        </button>
                    </form>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} GlobeTrails. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
