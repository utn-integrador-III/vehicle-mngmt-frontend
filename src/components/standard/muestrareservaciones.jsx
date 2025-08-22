import React, { useState, useEffect } from 'react';
import './muestrareservaciones.css';
import ConfirmarFormulario from './confirmarformulario'; 

const ReservationTicket = ({ onExit, boleta }) => {
  // --- Dev: no se modifica ---
  const [showConfirm, setShowConfirm] = useState(!boleta);
  const [showReason, setShowReason] = useState(false);

  // --- Nuevos datos dinámicos ---
  const [data, setData] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);

  useEffect(() => {
    if (!boleta) {
      const savedData = localStorage.getItem("reservationData");
      const savedVehicleData = localStorage.getItem("selectedVehicle");
      const loggedUserName = localStorage.getItem("loggedUserName");

      if (savedData) setData(JSON.parse(savedData));
      if (savedVehicleData) {
        const vehicle = JSON.parse(savedVehicleData);
        if (loggedUserName) vehicle.applicant = loggedUserName;
        setVehicleData(vehicle);
      }
    }
  }, [boleta]);

  // --- Dev: lógica de status ---
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

  const handleExit = () => { if (onExit) onExit(); };

  // --- JSX ajustado conservando líneas de Dev ---
  return (
    <div className="ticket-container">
      {showConfirm && <ConfirmarFormulario onClose={() => setShowConfirm(false)} />}

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
        <p className="date">Reservation date: {boleta?.fecha || data?.fecha || "2025-08-17"}</p>

        <div className="ticket-card">
          <div className="ticket-row">
            <div className="ticket-field">
              <label>Applicant</label>
              <div className="value">{boleta?.applicant || vehicleData?.applicant || "Mario Araya"}</div>
            </div>
            <div className="ticket-field">
              <label>Vehicle plate</label>
              <div className="value">{boleta?.codigo || vehicleData?.plate || "ABC34"}</div>
            </div>
            <div className="ticket-field">
              <label>Vehicle Brand</label>
              <div className="value">{boleta?.marca || vehicleData?.model || "Toyota"}</div>
            </div>
          </div>

          <div className="ticket-row">
            <div className="ticket-field">
              <label>Vehicle address</label>
              <div className="value">{boleta?.direccion || data?.direccion || "10th Street, Central Avenue"}</div>
            </div>
            <div className="ticket-field">
              <label>Trip estimate</label>
              <div className="value">{boleta?.estimate || data?.estimate || "2 hrs with 30 minutes"}</div>
            </div>
            <div className="ticket-field">
              <label>Need for service</label>
              <div className="value">{boleta?.necesidad || data?.necesidad || "Transfer to meeting"}</div>
            </div>
          </div>

          <div className="ticket-row">
            <div className="ticket-field">
              <label>Date of service</label>
              <div className="value">{boleta?.fecha || data?.fecha || "2025-08-17"}</div>
            </div>
            <div className="ticket-field">
              <label>Vehicle departure time</label>
              <div className="value">{boleta?.departureTime || data?.departureTime || "16:00 🕓"}</div>
            </div>
            <div className="ticket-field">
              <label>Vehicle delivery time</label>
              <div className="value">{boleta?.deliveryTime || data?.deliveryTime || "18:30 🕡"}</div>
            </div>
          </div>

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
                {boleta
                  ? [boleta.comp1, boleta.comp2, boleta.comp3, boleta.comp4].filter(Boolean).map((c,i) => <li key={i}>{c}</li>)
                  : [data?.comp1, data?.comp2, data?.comp3, data?.comp4].filter(Boolean).map((c,i) => <li key={i}>{c}</li>)
                }
              </ul>
            </div>
          </div>

          <div className="ticket-buttons">
            <button className="btn-exit" onClick={handleExit}>Exit</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReservationTicket;
