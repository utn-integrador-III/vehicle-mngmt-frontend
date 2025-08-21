import React, { useState } from "react";
import "./calendario.css";
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

const HorarioPopup = ({ visible, onClose, onHoraSeleccionada }) => {
  const [selected, setSelected] = useState(null);
  const allOptions = ["Todo el día", ...horarios];
  const rows = chunkArray(allOptions, 6);

  if (!visible) return null;

  return (
    <div className="horario-modal-overlay">
      <div className="horario-modal">
        <h2 className="horario-title">Selecciona tu hora</h2>
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
            onClick={() => {
              onHoraSeleccionada(selected);
              setSelected(null);
            }}
            disabled={!selected}
          >
            Siguiente
          </button>
          <button
            className="cancel-btn"
            style={{ marginLeft: 16 }}
            onClick={() => {
              setSelected(null);
              onClose();
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

const Calendario = ({ setActiveTab, boletas, setBoletas, vehiculoSeleccionado }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showHorario, setShowHorario] = useState(false);
  const [showReservacion, setShowReservacion] = useState(false);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  const handleDateClick = (day) => {
    const selected = new Date(currentYear, currentMonth, day);
    setSelectedDate(selected);
    setShowHorario(true);

    localStorage.setItem("reservationDate", JSON.stringify({
      day: selected.getDate(),
      month: selected.getMonth() + 1,
      year: selected.getFullYear()
    }));
  };

  const handleHoraSeleccionada = (hora) => {
    localStorage.setItem("reservationHour", hora);
    setShowHorario(false);
    setShowReservacion(true);
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = (getFirstDayOfMonth(currentMonth, currentYear) + 6) % 7;

  const daysArray = [];
  for (let i = 0; i < firstDay; i++) daysArray.push(null);
  for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);

  if (showReservacion) 
    return (
      <Reservaciones 
        onExit={() => setActiveTab("listado")} 
        boletas={boletas} 
        setBoletas={setBoletas} 
        vehiculo={vehiculoSeleccionado} 
      />
    );

  return (
    <div className="calendar-container">
      <HorarioPopup
        visible={showHorario}
        onClose={() => setShowHorario(false)}
        onHoraSeleccionada={handleHoraSeleccionada}
      />
      <div className="calendar-header">
        <button className="nav-button" onClick={handlePrevMonth}>‹</button>
        <span className="calendar-title">
          {monthNames[currentMonth]} {currentYear}
        </span>
        <button className="nav-button" onClick={handleNextMonth}>›</button>
      </div>
      <div className="calendar-grid">
        <div className="calendar-day">Mo</div>
        <div className="calendar-day">Tu</div>
        <div className="calendar-day">We</div>
        <div className="calendar-day">Th</div>
        <div className="calendar-day">Fr</div>
        <div className="calendar-day">Sa</div>
        <div className="calendar-day">Su</div>
        {daysArray.map((day, index) => (
          <div
            key={index}
            className={`calendar-cell ${
              day === selectedDate?.getDate() &&
              currentMonth === selectedDate?.getMonth() &&
              currentYear === selectedDate?.getFullYear() ? "selected" : ""
            }`}
            onClick={() => day && handleDateClick(day)}
          >
            {day || ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendario;
