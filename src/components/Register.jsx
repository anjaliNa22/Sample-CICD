import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  UserPlus, 
  Lock, 
  User, 
  Mail, 
  Briefcase, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Sun, 
  Moon, 
  CheckCircle2,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

export function Register({ onSwitchToLogin, onShowToast }) {
  const { register, theme, toggleTheme } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    department: 'Engineering',
    role: 'Product Engineer',
    password: '1111',
    confirmPassword: '1111',
    agreeTerms: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPasswordStrength = () => {
    const pass = formData.password;
    if (!pass) return 0;
    if (pass === '1111') return 2; // standard static
    let score = 0;
    if (pass.length >= 4) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score++;
    return Math.min(score, 3);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please provide your full name.');
      triggerShake();
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid work email.');
      triggerShake();
      return;
    }

    if (!formData.username.trim()) {
      setError('Please choose a username.');
      triggerShake();
      return;
    }

    if (!formData.password) {
      setError('Please specify a password (or use default 1111).');
      triggerShake();
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      triggerShake();
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the Terms of Service to register.');
      triggerShake();
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = register({
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        department: formData.department,
        role: formData.role
      });

      setIsSubmitting(false);

      if (result.success) {
        if (onShowToast) {
          onShowToast(`Account created for ${result.user.name}! Static login password: 1111 is active.`, 'success');
        }
      } else {
        setError(result.error || 'Registration failed.');
        triggerShake();
      }
    }, 400);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const strength = getPasswordStrength();

  return (
    <div className="auth-wrapper">
      <div className={`auth-container animate-fade ${shake ? 'animate-shake' : ''}`}>
        <button 
          type="button" 
          className="auth-theme-toggle" 
          onClick={toggleTheme} 
          title="Toggle Theme"
          id="btn-register-theme-toggle"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <header className="auth-header">
          <div className="brand-badge">
            <ShieldCheck className="brand-logo-icon" />
            <span className="brand-title">ERP Portal</span>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join your team on the ERP dashboard</p>
        </header>

        <div className="demo-credential-banner">
          <div className="demo-credential-info">
            <KeyRound size={16} color="var(--primary)" />
            <span>Static password <code>1111</code> will also work for any created account!</span>
          </div>
        </div>

        {error && (
          <div className="auth-error-alert animate-pop" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name</label>
            <div className="input-container">
              <span className="input-icon-left">
                <User size={18} />
              </span>
              <input
                id="reg-name"
                type="text"
                className="input-field"
                placeholder="e.g. Jordan Blake"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Work Email</label>
              <div className="input-container">
                <span className="input-icon-left">
                  <Mail size={18} />
                </span>
                <input
                  id="reg-email"
                  type="email"
                  className="input-field"
                  placeholder="jordan@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-username">Username</label>
              <div className="input-container">
                <span className="input-icon-left">
                  <User size={18} />
                </span>
                <input
                  id="reg-username"
                  type="text"
                  className="input-field"
                  placeholder="jordanb"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-dept">Department</label>
              <div className="input-container">
                <span className="input-icon-left">
                  <Briefcase size={18} />
                </span>
                <input
                  id="reg-dept"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Engineering"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-role">Role Title</label>
              <div className="input-container">
                <span className="input-icon-left">
                  <Briefcase size={18} />
                </span>
                <input
                  id="reg-role"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Product Lead"
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">
              <label htmlFor="reg-password">Password</label>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Pre-filled with 1111
              </span>
            </div>
            <div className="input-container">
              <span className="input-icon-left">
                <Lock size={18} />
              </span>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Set password (1111)"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
              <button
                type="button"
                className="input-toggle-btn"
                onClick={() => setShowPassword(prev => !prev)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Strength meter */}
            <div className="strength-bar-container">
              <div className={`strength-segment ${strength >= 1 ? 'active-weak' : ''}`} />
              <div className={`strength-segment ${strength >= 2 ? 'active-medium' : ''}`} />
              <div className={`strength-segment ${strength >= 3 ? 'active-strong' : ''}`} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm-password">Confirm Password</label>
            <div className="input-container">
              <span className="input-icon-left">
                <Lock size={18} />
              </span>
              <input
                id="reg-confirm-password"
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Confirm password (1111)"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-footer-helpers">
            <label className="remember-label">
              <input
                type="checkbox"
                className="remember-checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                id="checkbox-terms"
              />
              <span>I accept platform terms & security protocols</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            id="btn-register-submit"
          >
            {isSubmitting ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Complete Registration</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-switch-prompt">
          Already registered?{' '}
          <button
            type="button"
            className="auth-switch-link"
            onClick={onSwitchToLogin}
            id="link-to-login"
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
}
