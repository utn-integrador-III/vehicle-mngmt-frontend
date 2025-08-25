import React, { useState, useEffect } from 'react';
import './muestrareservaciones.css';
import ConfirmarFormulario from './confirmarformulario'; 

const ReservationTicket = ({ onExit, boleta }) => {
  const [showConfirm, setShowConfirm] = useState(!boleta);
  const [showReason, setShowReason] = useState(false);

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

  // Mapea el estado a la clave visual
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

  // Texto del estado en español
  const statusLabel =
    statusKey === "pending"  ? "Pendiente"  :
    statusKey === "accepted" ? "Aceptada"   :
    "Rechazada";

  const handleExit = () => { if (onExit) onExit(); };

  return (
    <div className="ticket-container">
      {showConfirm && <ConfirmarFormulario onClose={() => setShowConfirm(false)} />}

      {/* Modal para ver la razón del rechazo */}
      {showReason && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Motivo del rechazo</h3>
            <p>{boleta?.motivo || "Motivo no especificado."}</p>
            <div className="modal-buttons">
              <button onClick={() => setShowReason(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      <main className="ticket-content">
        <h2>Información de la boleta de reservación</h2>
        <br></br>

        <div className="ticket-card">
          <div className="ticket-row">
            <div className="ticket-field">
              <label>Solicitante</label>
              <div className="value">{boleta?.applicant || vehicleData?.applicant || "Mario Araya"}</div>
            </div>
            <div className="ticket-field">
              <label>Placa del vehículo</label>
              <div className="value">{boleta?.plate || vehicleData?.plate || "ABC34"}</div>
            </div>
            <div className="ticket-field">
              <label>Marca del vehículo</label>
              <div className="value">{boleta?.model || vehicleData?.model || "Toyota"}</div>
            </div>
          </div>

          <div className="ticket-row">
            <div className="ticket-field">
              <label>Dirección del vehículo</label>
              <div className="value">{boleta?.direccion || data?.direccion || "10th Street, Central Avenue"}</div>
            </div>
            <div className="ticket-field">
              <label>Estimación del viaje</label>
              <div className="value">{boleta?.estimate || data?.estimate || "2 hrs con 30 minutos"}</div>
            </div>
            <div className="ticket-field">
              <label>Necesidad del servicio</label>
              <div className="value">{boleta?.necesidad || data?.necesidad || "Traslado a reunión"}</div>
            </div>
          </div>

          <div className="ticket-row">
            <div className="ticket-field">
              <label>Fecha del servicio</label>
              <div className="value">{boleta?.fecha || data?.fecha || "2025-08-17"}</div>
            </div>
            <div className="ticket-field">
              <label>Hora de salida del vehículo</label>
              <div className="value">{boleta?.departureTime || data?.departureTime || "02:00 PM"}</div>
            </div>
            <div className="ticket-field">
              <label>Hora de entrega del vehículo</label>
              <div className="value">{boleta?.deliveryTime || data?.deliveryTime || "04:30 PM"}</div>
            </div>
          </div>

          <div className="ticket-row">
            <div className="ticket-field" style={{ width: '100%' }}>
              <label>Estado</label>
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
              <label>Acompañantes</label>
              <ul className="companion-list">
                {(
                  boleta
                    ? [boleta.comp1, boleta.comp2, boleta.comp3, boleta.comp4].filter(Boolean)
                    : data
                      ? [data.comp1, data.comp2, data.comp3, data.comp4].filter(Boolean)
                      : []
                ).map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="ticket-buttons">
            <button className="btn-exit" onClick={handleExit}>Salir</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReservationTicket;

