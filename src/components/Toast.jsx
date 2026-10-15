import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast-item ${t.type || 'info'}`}>
          {t.type === 'success' && <CheckCircle2 size={18} color="var(--accent-emerald)" />}
          {t.type === 'warning' && <AlertTriangle size={18} color="var(--accent-amber)" />}
          {(!t.type || t.type === 'info') && <Info size={18} color="var(--primary)" />}
          
          <span>{t.message}</span>

          <button
            type="button"
            className="toast-close-btn"
            onClick={() => onDismiss(t.id)}
            aria-label="Close notification"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
