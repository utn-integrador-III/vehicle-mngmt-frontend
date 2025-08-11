import React, { useState } from "react";
import "./horario.css";
import Reservaciones from "./reservaciones";

const horarios = Array.from({ length: 24 }, (_, i) => {
  const hour12 = ((i + 11) % 12) + 1;
  const ampm = i < 12 ? "AM" : "PM";
  return `${hour12.toString().padStart(2, "0")}:00 ${ampm}`;
});

function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

const Horario = () => {
  const [selected, setSelected] = useState(null);
  const [showReservaciones, setShowReservaciones] = useState(false);


  const allOptions = ["Todo el día", ...horarios];
  const rows = chunkArray(allOptions, 6);

  if (showReservaciones) {
    return <Reservaciones />;
  }

  return (
    <div className="horario-container">
      <h2 className="horario-title">Selecciona tu hora</h2>
      <p className="horario-date">Date of reservation: 2025-08-17</p>

      <div className="horario-grid-outer">
        <div className="horario-grid horario-grid-centered">
          {rows.map((row, i) => (
            <div className="horario-row horario-row-centered" key={i}>
              {row.map((hora) => (
                <button
                  key={hora}
                  className={`horario-btn${selected === hora ? " selected" : ""}${hora === "Todo el día" ? " all-day-btn" : ""}`}
                  onClick={() => setSelected(hora)}
                >
                  {hora}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="horario-footer">
        <button
          className="next-btn"
          onClick={() => setShowReservaciones(true)}
          disabled={!selected}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Horario;
