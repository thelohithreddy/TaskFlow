import { Link } from 'react-router-dom';
import { HeroDashboardPreview } from '../components/landing/HeroDashboardPreview';

export const LandingPage = () => (
  <div className="landing">
    <section className="hero">
      <div className="hero-content">
        <span className="hero-badge">Enterprise Task Management</span>
        <h1>Ship faster with <span className="text-gradient">TaskFlow Pro</span></h1>
        <p className="hero-subtitle">
          The modern SaaS platform for teams who demand clarity, speed, and control.
          Manage tasks, track progress, and scale with confidence.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg">
            Start Free Trial
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Sign In
          </Link>
        </div>
      </div>
      <div className="hero-visual">
        <HeroDashboardPreview />
      </div>
    </section>

    <section id="features" className="features">
      <h2>Built for modern teams</h2>
      <div className="features-grid">
        {[
          { icon: '🔐', title: 'Secure Auth', desc: 'JWT with refresh tokens, RBAC, and bcrypt hashing' },
          { icon: '📊', title: 'Analytics', desc: 'Real-time dashboards with task and user metrics' },
          { icon: '🔍', title: 'Smart Search', desc: 'Filter, sort, and paginate tasks effortlessly' },
          { icon: '📝', title: 'Audit Logs', desc: 'Full activity tracking for compliance' },
          { icon: '⚡', title: 'API First', desc: 'RESTful API with Swagger documentation' },
          { icon: '🐳', title: 'Docker Ready', desc: 'One command to run the entire stack' },
        ].map((f) => (
          <div key={f.title} className="feature-card">
            <span className="feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <section id="pricing" className="cta-section">
      <h2>Ready to streamline your workflow?</h2>
      <p>Join teams already using TaskFlow Pro to deliver on time, every time.</p>
      <Link to="/register" className="btn btn-primary btn-lg">
        Get Started Free
      </Link>
    </section>

    <footer className="landing-footer">
      <p>&copy; 2026 TaskFlow Pro. Built with production-grade architecture.</p>
    </footer>
  </div>
);
