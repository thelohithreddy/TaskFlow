import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch {
      // Error handled by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h1>Welcome back</h1>
      <p className="auth-subtitle">Sign in to your TaskFlow Pro account</p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        <Button type="submit" className="auth-submit" loading={loading}>
          Sign In
        </Button>
      </form>

      <p className="auth-footer">
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
};
