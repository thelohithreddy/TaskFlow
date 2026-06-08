import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">⚡</span>
          TaskFlow Pro
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <button className="btn btn-ghost btn-sm" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <Link to="/login" className="btn btn-ghost btn-sm">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
};
