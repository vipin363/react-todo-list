
function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="toast error-toast">
      <div className="toast-icon">!</div>

      <div className="toast-content">
        <strong>Validation Error</strong>
        <p>{message}</p>
      </div>

      <button
        className="toast-close"
        onClick={onClose}
        type="button"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
