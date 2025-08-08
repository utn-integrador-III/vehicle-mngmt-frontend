import React from "react";
import "./confirmarformulario.css";

export default function ConfirmarFormulario({ onClose }) {
  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true">
      <div className="confirm-modal">
        <button
          className="confirm-close"
          aria-label="Close confirmation"
          onClick={onClose}
        >
          ×
        </button>

        <div className="confirm-title">Your application form is completed</div>

        <div className="confirm-check" aria-hidden="true">✓</div>

        <p className="confirm-text">
          Please wait for your request to be approved. We&apos;ll notify you when
          the administrator sends a response.
        </p>
      </div>
    </div>
  );
}