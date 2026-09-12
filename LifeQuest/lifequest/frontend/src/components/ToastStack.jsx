import { useGame } from '../context/GameContext';

export default function ToastStack() {
  const { toasts } = useGame();
  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div className="toast" key={t.id}>
          <div className="toast-title">{t.title}</div>
          <div className="toast-body">{t.body}</div>
        </div>
      ))}
    </div>
  );
}
