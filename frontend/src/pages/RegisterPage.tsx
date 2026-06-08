import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name, email, password });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch {
      // Error handled by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h1>Create account</h1>
      <p className="auth-subtitle">Start managing tasks like a pro</p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          required
        />
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
          placeholder="Min 8 chars, upper, lower, number"
          required
          minLength={8}
        />
        <Button type="submit" className="auth-submit" loading={loading}>
          Create Account
        </Button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
};
