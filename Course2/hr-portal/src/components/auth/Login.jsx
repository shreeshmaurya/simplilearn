import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail } from '../../utils/validators';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(form.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!form.password) {
      setError('Password is required');
      return;
    }

    setSubmitting(true);
    // Simulate async
    setTimeout(() => {
      const result = login(form.email, form.password);
      if (result.success) {
        navigate(result.user.role === 'hr' ? '/hr/dashboard' : '/employee/dashboard');
      } else {
        setError(result.error);
      }
      setSubmitting(false);
    }, 300);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">HR</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your HR Portal account</p>
        </div>

        {error && <div className="alert alert-error" data-testid="login-error">{error}</div>}

        <form onSubmit={handleSubmit} data-testid="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/signup">Create Account</Link>
          </p>
        </div>

        <div className="demo-credentials">
          <p><strong>Demo Accounts:</strong></p>
          <p>HR: admin@hrportal.com / Admin@123</p>
          <p>Employee: john.doe@hrportal.com / Employee@123</p>
        </div>
      </div>
    </div>
  );
}
