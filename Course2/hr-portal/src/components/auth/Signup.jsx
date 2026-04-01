import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, validatePassword, validatePhone, getPasswordStrength } from '../../utils/validators';
import { v4 as uuidv4 } from 'uuid';

export default function Signup() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const departments = ['Engineering', 'Marketing', 'Finance', 'Human Resources', 'Operations', 'Sales', 'Support'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!validateEmail(form.email)) newErrors.email = 'Valid email is required';
    if (!validatePhone(form.phone) && form.phone) newErrors.phone = 'Valid phone number is required';
    if (!form.department) newErrors.department = 'Department is required';
    if (!form.position.trim()) newErrors.position = 'Position is required';
    if (!validatePassword(form.password)) {
      newErrors.password = 'Min 8 chars with uppercase, lowercase, number, and special character';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const userData = {
        id: `usr-${uuidv4().slice(0, 8)}`,
        email: form.email,
        password: form.password,
        role: 'employee',
        firstName: form.firstName,
        lastName: form.lastName,
        department: form.department,
        position: form.position,
        phone: form.phone,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
      };

      const result = signup(userData);
      if (result.success) {
        navigate('/employee/dashboard');
      } else {
        setErrors({ submit: result.error });
      }
      setSubmitting(false);
    }, 300);
  };

  const passwordStrength = form.password ? getPasswordStrength(form.password) : null;

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">HR</span>
          </div>
          <h1>Create Account</h1>
          <p>Register as a new employee</p>
        </div>

        {errors.submit && <div className="alert alert-error" data-testid="signup-error">{errors.submit}</div>}

        <form onSubmit={handleSubmit} data-testid="signup-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <span className="field-error">{errors.firstName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <span className="field-error">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="signup-email">Email Address *</label>
              <input
                id="signup-email"
                name="email"
                type="email"
                placeholder="your.email@company.com"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1-555-0100"
                value={form.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <select id="department" name="department" value={form.department} onChange={handleChange}>
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.department && <span className="field-error">{errors.department}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="position">Position *</label>
              <input
                id="position"
                name="position"
                type="text"
                placeholder="Job title"
                value={form.position}
                onChange={handleChange}
              />
              {errors.position && <span className="field-error">{errors.position}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="signup-password">Password *</label>
              <input
                id="signup-password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
              />
              {passwordStrength && (
                <div className={`password-strength strength-${passwordStrength}`}>
                  Strength: {passwordStrength}
                </div>
              )}
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
