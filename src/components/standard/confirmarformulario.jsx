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

        <div className="confirm-title">
          Tu formulario de solicitud está completo
        </div>

        <div className="confirm-check" aria-hidden="true">
          ✓
        </div>

        <p className="confirm-text">
          Por favor, espera a que tu solicitud sea aprobada. Te notificaremos
          cuando el administrador envíe una respuesta.
        </p>
      </div>
    </div>
  );
}
