import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LogIn, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  KeyRound, 
  AlertCircle, 
  Sparkles,
  Sun,
  Moon,
  ShieldCheck
} from 'lucide-react';

export function Login({ onSwitchToRegister, onShowToast }) {
  const { login, theme, toggleTheme } = useAuth();
  
  const [identifier, setIdentifier] = useState('alex@nexus.io');
  const [password, setPassword] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your email or username');
      triggerShake();
      return;
    }

    if (!password) {
      setError('Please enter your password (Hint: 1234)');
      triggerShake();
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = login(identifier, password);
      setIsSubmitting(false);

      if (result.success) {
        if (onShowToast) {
          onShowToast(`Welcome back, ${result.user.name}!`, 'success');
        }
      } else {
        setError(result.error || 'Invalid credentials.');
        triggerShake();
      }
    }, 350);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const fillDemoCredentials = () => {
    setIdentifier('alex@nexus.io');
    setPassword('1234');
    setError('');
    if (onShowToast) {
      onShowToast('Filled demo credentials with static password 1234!', 'info');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className={`auth-container animate-fade ${shake ? 'animate-shake' : ''}`}>
        <button 
          type="button" 
          className="auth-theme-toggle" 
          onClick={toggleTheme} 
          title="Toggle Light/Dark Theme"
          id="btn-auth-theme-toggle"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <header className="auth-header">
          <div className="brand-badge">
            <ShieldCheck className="brand-logo-icon" />
            <span className="brand-title">Nexus Platform</span>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Log in to access your analytics dashboard</p>
        </header>

        {/* Demo Credential Notification Box */}
        <div className="demo-credential-banner">
          <div className="demo-credential-info">
            <KeyRound size={16} color="var(--primary)" />
            <span>Static Password: <code>1234</code></span>
          </div>
          <button 
            type="button" 
            className="btn-fill-demo" 
            onClick={fillDemoCredentials}
            id="btn-quick-fill-demo"
          >
            Auto Fill
          </button>
        </div>

        {error && (
          <div className="auth-error-alert animate-pop" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-identifier">
              Email or Username
            </label>
            <div className="input-container">
              <span className="input-icon-left">
                <User size={18} />
              </span>
              <input
                id="login-identifier"
                type="text"
                className="input-field"
                placeholder="e.g. alex@nexus.io or alex"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">
              <label htmlFor="login-password">Password</label>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Static: 1234
              </span>
            </div>
            <div className="input-container">
              <span className="input-icon-left">
                <Lock size={18} />
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Enter password (1234)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="input-toggle-btn"
                onClick={() => setShowPassword(prev => !prev)}
                title={showPassword ? 'Hide password' : 'Show password'}
                id="btn-toggle-password-visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-footer-helpers">
            <label className="remember-label">
              <input
                type="checkbox"
                className="remember-checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                id="checkbox-remember-me"
              />
              <span>Remember me</span>
            </label>
            <span 
              onClick={fillDemoCredentials}
              className="auth-switch-link"
              style={{ fontSize: '0.825rem' }}
            >
              Reset to 1234
            </span>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            id="btn-login-submit"
          >
            {isSubmitting ? (
              <span>Signing In...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-switch-prompt">
          Don't have an account?{' '}
          <button
            type="button"
            className="auth-switch-link"
            onClick={onSwitchToRegister}
            id="link-to-register"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}
