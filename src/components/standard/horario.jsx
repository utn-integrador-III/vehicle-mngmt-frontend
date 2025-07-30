import React, { useState } from "react";
import "./horario.css";
import Reservaciones from "./reservaciones";

const Horario = () => {
  const [departureHour, setDepartureHour] = useState(16);
  const [departureMinute, setDepartureMinute] = useState(0);
  const [arrivalHour, setArrivalHour] = useState(18);
  const [arrivalMinute, setArrivalMinute] = useState(30);

  const [showReservaciones, setShowReservaciones] = useState(false); 
  
  const formatTwoDigits = (num) => String(num).padStart(2, "0");

  const calculateTop = (hour, minute) => {
    return ((hour + minute / 60) - 15) * 40; // desde 15:00
  };

  const blockTop = calculateTop(departureHour, departureMinute);
  const blockHeight = calculateTop(arrivalHour, arrivalMinute) - blockTop;

  if (showReservaciones) {
    return <Reservaciones />;
  }

  return (
    <div className="horario-container">
      <h2 className="horario-title">Select your Shedule</h2>
      <p className="horario-date">Date of reservation: 2025-08-17</p>

      <div className="horario-card">
        <div className="inputs-container">
          {/* Departure */}
          <div className="time-block">
            <label className="time-label">Departure time</label>
            <div className="time-input-group">
              <input
                type="number"
                value={formatTwoDigits(departureHour)}
                min="0"
                max="23"
                onChange={(e) =>
                  setDepartureHour(Math.max(0, Math.min(23, +e.target.value)))
                }
              />
              <span className="separator">:</span>
              <input
                type="number"
                value={formatTwoDigits(departureMinute)}
                min="0"
                max="59"
                onChange={(e) =>
                  setDepartureMinute(Math.max(0, Math.min(59, +e.target.value)))
                }
              />
              <div className="ampm-buttons">
                <button disabled>AM</button>
                <button disabled>PM</button>
              </div>
            </div>
            <div className="time-actions">
              <button className="cancel-btn">Cancel</button>
              <button className="done-btn">Done</button>
            </div>
          </div>

          {/* Arrival */}
          <div className="time-block">
            <label className="time-label">Arrival time</label>
            <div className="time-input-group">
              <input
                type="number"
                value={formatTwoDigits(arrivalHour)}
                min="0"
                max="23"
                onChange={(e) =>
                  setArrivalHour(Math.max(0, Math.min(23, +e.target.value)))
                }
              />
              <span className="separator">:</span>
              <input
                type="number"
                value={formatTwoDigits(arrivalMinute)}
                min="0"
                max="59"
                onChange={(e) =>
                  setArrivalMinute(Math.max(0, Math.min(59, +e.target.value)))
                }
              />
              <div className="ampm-buttons">
                <button disabled>AM</button>
                <button disabled>PM</button>
              </div>
            </div>
            <div className="time-actions">
              <button className="cancel-btn">Cancel</button>
              <button className="done-btn">Done</button>
            </div>
          </div>
        </div>

        <div className="schedule-visual">
          <div className="hour-list">
            {Array.from({ length: 12 }, (_, i) => {
              const hour = 15 + i;
              return (
                <div key={hour} className="hour-label">
                  {formatTwoDigits(hour)}:00
                </div>
              );
            })}
          </div>
          <div className="bar-container">
            <div
              className="time-block-bar"
              style={{
                top: `${blockTop}px`,
                height: `${blockHeight}px`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="horario-footer">
        <button
          className="next-btn"
          onClick={() => setShowReservaciones(true)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Horario;