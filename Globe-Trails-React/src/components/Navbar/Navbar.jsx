// src/components/Navbar.jsx
import React, { useState } from 'react';
import './Navbar.css';
import logo from '../../assets/GlobeTrails-logo.png';
import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, LayoutDashboard } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { getData } from '@/context/userContext'
import { toast } from 'sonner'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = getData();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const logoutHandler = () => {
    try {
      localStorage.removeItem("accessToken")
      setUser(null)
      toast.success("Logout successfull")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <img src={logo} alt="GlobeTrails Logo" className="navbar__logo-image" />
      </div>

      {/* Mobile menu toggle button */}
      <div className="navbar__toggle" onClick={toggleMenu}>
        <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
      </div>

      {/* Desktop navigation links */}
      <ul className="navbar__links desktop-links">
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/about" onClick={closeMenu}>About</Link></li>
        <li><Link to="/tours" onClick={closeMenu}>Tours & Packages</Link></li>
      </ul>

      {/* Desktop auth buttons */}
      <div className="navbar__auth desktop-auth">
        {
          user ? <DropdownMenu>
            <DropdownMenuTrigger style={{ outline: 'none' }}>
              <Avatar style={{ cursor: 'pointer' }}>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user.username === "Admin" ? (
                <DropdownMenuItem onClick={() => navigate('/adminpanel')} style={{ cursor: 'pointer' }}>
                  <LayoutDashboard size={16} style={{ marginRight: '8px' }} />Admin Panel
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                  <User size={16} style={{ marginRight: '8px' }} />Profile
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logoutHandler} style={{ cursor: 'pointer', color: 'red' }} ><LogOut size={16} style={{ marginRight: '8px' }} />Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> : <div className="auth-buttons">
            <Link to="/signin" className="signin-link"><button className="signin"> Login</button></Link>
            <Link to="/signup" className="signup-link"><button className="signup">Sign Up</button></Link>
          </div>
        }
      </div>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>

      {/* Mobile navigation menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu__header">
          <div className="mobile-menu__logo">
            <img src={logo} alt="Logo" />
          </div>
          <button className="mobile-menu__close" onClick={closeMenu}>
            <span>&times;</span>
          </button>
        </div>
        <ul className="mobile-menu__links">
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/about" onClick={closeMenu}>About</Link></li>
          <li><Link to="/tours" onClick={closeMenu}>Tours & Packages</Link></li>
        </ul>

        <div className="mobile-menu__auth">
          {
            user ? (
              <div className="mobile-user-profile" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <Avatar style={{ width: '50px', height: '50px' }}>
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                {user.username === "Admin" ? (
                  <Link to="/adminpanel" onClick={closeMenu}>Admin Panel</Link>
                ) : (
                  <Link to="/profile" onClick={closeMenu}>Profile</Link>
                )}
                <button onClick={() => { logoutHandler(); closeMenu(); }} style={{ color: 'red', border: 'none', background: 'none' }}>Logout</button>
              </div>
            ) : (
              <>
                <Link to="/signin" onClick={closeMenu}><button className="signin">Login</button></Link>
                <Link to="/signup" onClick={closeMenu}><button className="signup">Sign Up</button></Link>
              </>
            )
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;