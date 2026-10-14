import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sparkles, History as HistoryIcon, Mail } from 'lucide-react';

/**
 * Navigation header component
 */
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <Sparkles size={22} color="#ffffff" />
          </div>
          <span className="brand-title">AI Email Analyzer</span>
        </Link>

        <ul className="nav-links">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              end
            >
              <Mail size={18} />
              <span>Analyze Email</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/history"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <HistoryIcon size={18} />
              <span>History</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
