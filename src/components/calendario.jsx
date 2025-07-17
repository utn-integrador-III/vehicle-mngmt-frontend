import React, { useState } from "react";
import "./calendario.css";

const Calendario = ({ setActiveTab }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day) => {
    const selected = new Date(currentYear, currentMonth, day);
    setSelectedDate(selected);
    setActiveTab("horario"); // Ir a la vista de horarios
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = (getFirstDayOfMonth(currentMonth, currentYear) + 6) % 7;

  const daysArray = [];
  for (let i = 0; i < firstDay; i++) {
    daysArray.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  return (
    <div className="calendar-container">
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
              day === (selectedDate?.getDate()) &&
              currentMonth === selectedDate?.getMonth() &&
              currentYear === selectedDate?.getFullYear()
                ? "selected"
                : ""
            }`}
            onClick={() => day && handleDateClick(day)}
          >
            {day || ""}
          </div>
        ))}
      </div>
      <div className="calendar-footer">
        <button className="done-button">Done</button>
      </div>
    </div>
  );
};

export default Calendario;