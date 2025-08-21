import React, { useState, useEffect } from 'react';
import './muestrareservaciones.css';
import ConfirmarFormulario from './confirmarformulario'; 

const ReservationTicket = ({ onExit }) => {
  const [showConfirm, setShowConfirm] = useState(true);
  const [data, setData] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem("reservationData");
    const savedVehicleData = localStorage.getItem("selectedVehicle");
    const loggedUserName = localStorage.getItem("loggedUserName");

    if (savedData) setData(JSON.parse(savedData));
    if (savedVehicleData) {
      const vehicle = JSON.parse(savedVehicleData);
      if (loggedUserName) vehicle.applicant = loggedUserName;
      setVehicleData(vehicle);
    }
  }, []);

  const handleExit = () => { if (onExit) onExit(); };

  useEffect(() => {
    if (!data && !vehicleData) return;

    const setValue = (label, value) => {
      const elements = document.querySelectorAll(".ticket-field");
      elements.forEach(el => {
        const lbl = el.querySelector("label")?.innerText;
        if (lbl && lbl.toLowerCase().includes(label.toLowerCase())) {
          const valEl = el.querySelector(".value");
          if (valEl) valEl.innerText = value || "-";
        }
      });
    };

    if (data) {
      setValue("Vehicle address", data.direccion);
      setValue("Trip estimate", data.estimate);
      setValue("Need for service", data.necesidad);
      setValue("Vehicle departure time", data.departureTime);
      if (data.day && data.month && data.year) setValue("Date of service", `${data.day}/${data.month}/${data.year}`);
    }

    if (vehicleData) {
      setValue("Applicant", vehicleData.applicant);
      setValue("Vehicle plate", vehicleData.plate);
      setValue("Vehicle Brand", vehicleData.model);
    }

    const list = document.querySelector(".companion-list");
    if (list && data) {
      list.innerHTML = "";
      [data.comp1, data.comp2, data.comp3, data.comp4].forEach(c => {
        if (c) {
          const li = document.createElement("li");
          li.innerText = c;
          list.appendChild(li);
        }
      });
    }
  }, [data, vehicleData]);

  return (
    <div className="ticket-container">
      {showConfirm && <ConfirmarFormulario onClose={() => setShowConfirm(false)} />}
      <main className="ticket-content">
        <h2>Reservation ticket information</h2>
        <div className="ticket-card">
          <div className="ticket-row">
            <div className="ticket-field"><label>Applicant</label><div className="value"></div></div>
            <div className="ticket-field"><label>Vehicle plate</label><div className="value"></div></div>
            <div className="ticket-field"><label>Vehicle Brand</label><div className="value"></div></div>
          </div>
          <div className="ticket-row">
            <div className="ticket-field"><label>Vehicle address</label><div className="value"></div></div>
            <div className="ticket-field"><label>Trip estimate</label><div className="value"></div></div>
            <div className="ticket-field"><label>Need for service</label><div className="value"></div></div>
          </div>
          <div className="ticket-row">
            <div className="ticket-field"><label>Date of service</label><div className="value"></div></div>
            <div className="ticket-field"><label>Vehicle departure time</label><div className="value"></div></div>
            <div className="ticket-field" style={{ visibility: "hidden" }}><label>Vehicle delivery time</label><div className="value"></div></div>
            <div className="ticket-field"><label>Status</label><div className="status accepted">Accepted</div></div>
          </div>
          <div className="ticket-row companions">
            <div className="ticket-field"><label>Companions</label><ul className="companion-list"></ul></div>
          </div>
          <div className="ticket-buttons">
            <button className="btn-view">View pdf</button>
            <button className="btn-exit" onClick={handleExit}>Exit</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReservationTicket;
