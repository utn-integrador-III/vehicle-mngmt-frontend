import React, { useState } from 'react';
import './muestrareservaciones.css';
import ConfirmarFormulario from './confirmarformulario'; 

const ReservationTicket = ({ onExit, boleta }) => {
  // Mostrar el pop-up de confirmación SOLO si no viene una boleta (flujo "Send")
  const [showConfirm, setShowConfirm] = useState(!boleta);

  // Mapear el estado entrante a la etiqueta/clase visual
  const getStatusKey = () => {
    if (!boleta) return "pending";
    if (boleta.estado === "pendientes") return "pending";
    if (boleta.estado === "completadas") {
      if (boleta.resultado === "aceptada") return "accepted";
      if (boleta.resultado === "rechazada") return "rejected";
    }
    return "pending";
  };

  const statusKey = getStatusKey();
  const statusLabel =
    statusKey === "pending"  ? "Pending"  :
    statusKey === "accepted" ? "Accepted" :
    "Rejected";

  const [showReason, setShowReason] = useState(false);

  const handleExit = () => {
    if (onExit) onExit();
  };

  return (
    <div className="ticket-container">
      {showConfirm && (
        <ConfirmarFormulario onClose={() => setShowConfirm(false)} />
      )}

      {/* Modal para ver la razón del Rechazo */}
      {showReason && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Rejection Reason</h3>
            <p>{boleta?.motivo || "Reason not specified."}</p>
            <div className="modal-buttons">
              <button onClick={() => setShowReason(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <main className="ticket-content">
        <h2>Reservation ticket information</h2>
        <p className="date">Reservation date: {boleta?.fecha || "2025-08-17"}</p>

        <div className="ticket-card">
          <div className="ticket-row">
            <div className="ticket-field">
              <label>Applicant</label>
              <div className="value">Mario Araya</div>
            </div>
            <div className="ticket-field">
              <label>Vehicle plate</label>
              <div className="value">{boleta?.codigo || "ABC34"}</div>
            </div>
            <div className="ticket-field">
              <label>Vehicle Brand</label>
              <div className="value">{boleta?.marca || "Toyota"}</div>
            </div>
          </div>

          <div className="ticket-row">
            <div className="ticket-field">
              <label>Vehicle address</label>
              <div className="value">10th Street, Central Avenue</div>
            </div>
            <div className="ticket-field">
              <label>Trip estimate</label>
              <div className="value">2 hrs with 30 minutes</div>
            </div>
            <div className="ticket-field">
              <label>Need for service</label>
              <div className="value">Transfer to meeting</div>
            </div>
          </div>

          <div className="ticket-row">
            <div className="ticket-field">
              <label>Date of service</label>
              <div className="value">{boleta?.fecha || "2025-08-17"}</div>
            </div>
            <div className="ticket-field">
              <label>Vehicle departure time</label>
              <div className="value">16:00 🕓</div>
            </div>
            <div className="ticket-field">
              <label>Vehicle delivery time</label>
              <div className="value">18:30 🕡</div>
            </div>
          </div>

          {/* Status con colores y acción en Rejected */}
          <div className="ticket-row">
            <div className="ticket-field" style={{ width: '100%' }}>
              <label>Status</label>
              <div
                className={`status ${statusKey}`}
                onClick={() => { if (statusKey === "rejected") setShowReason(true); }}
                style={{ cursor: statusKey === "rejected" ? "pointer" : "default" }}
              >
                {statusLabel}
              </div>
            </div>
          </div>

          <div className="ticket-row companions">
            <div className="ticket-field">
              <label>Companions</label>
              <ul className="companion-list">
                <li>Mauro López</li>
                <li>Angie Vasquéz</li>
              </ul>
            </div>
          </div>

          <div className="ticket-buttons">
            {/* (Quitado) <button className="btn-view">View pdf</button> */}
            <button className="btn-exit" onClick={handleExit}>
              Exit
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReservationTicket;

