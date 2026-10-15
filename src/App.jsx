import { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { Toast } from './components/Toast';
import './index.css';
import './styles/auth.css';
import './styles/dashboard.css';

function MainAppContent() {
  const { currentUser } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <>
      {/* Dynamic ambient glowing background elements */}
      <div className="ambient-bg" aria-hidden="true">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      {currentUser ? (
        <Dashboard onShowToast={showToast} />
      ) : authView === 'login' ? (
        <Login
          onSwitchToRegister={() => setAuthView('register')}
          onShowToast={showToast}
        />
      ) : (
        <Register
          onSwitchToLogin={() => setAuthView('login')}
          onShowToast={showToast}
        />
      )}

      {/* Global Toast Stack */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
