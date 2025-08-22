import React, { useState, useRef } from "react";
import calendar from "../../images/calendarioicono.png";
import "./administradorreservaciones.css";
import ReservationTicket from "./muestrareservaciones"; 

export default function AdministradorReservaciones({ boletas: propBoletas, setBoletas: propSetBoletas }) {
  const [tab, setTab] = useState("pendientes"); // "pendientes" | "completadas"
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(""); // YYYY-MM-DD
  const dateInputRef = useRef(null);

  const [showTicket, setShowTicket] = useState(false);
  const [selectedBoleta, setSelectedBoleta] = useState(null);

  // Usar props si existen, sino usar datos de ejemplo de dev
  const boletas = propBoletas || [
    { id: 1, codigo: "ABC123", marca: "Toyota", fecha: "2025-08-17", estado: "pendientes" },
    { id: 2, codigo: "MNO654", marca: "Kia", fecha: "2025-08-20", estado: "pendientes" },
    { id: 3, codigo: "QWE321", marca: "Ford", fecha: "2025-08-21", estado: "pendientes" },
    { id: 4, codigo: "ZZZ111", marca: "Toyota", fecha: "2025-08-17", estado: "completadas", resultado: "aceptada", motivo: "Se aprobó por disponibilidad." },
    { id: 5, codigo: "YYY222", marca: "Hyundai", fecha: "2025-08-18", estado: "completadas", resultado: "aceptada" },
    { id: 6, codigo: "XXX333", marca: "Chevrolet", fecha: "2025-08-19", estado: "completadas", resultado: "rechazada", motivo: "El vehículo no está disponible en esa fecha." },
  ];

  const setBoletas = propSetBoletas || (() => {}); // fallback si no viene prop

  // Función para finalizar boleta (solo si viene prop)
  const finalizarBoleta = (id) => {
    if (!propSetBoletas) return; 
    const savedData = JSON.parse(localStorage.getItem("reservationData")) || {};
    propSetBoletas(prev =>
      prev.map(b =>
        b.id === id
          ? { ...b, estado: "completadas", resultado: "aceptada", ...savedData }
          : b
      )
    );
  };

  // Filtrado por pestaña, código y fecha
  const boletasFiltradas = boletas.filter((b) => {
    if (b.estado !== tab) return false;
    const matchCodigo = !search || b.codigo.toLowerCase().includes(search.toLowerCase());
    const matchFecha = !date || b.fecha === date;
    return matchCodigo && matchFecha;
  });

  if (showTicket && selectedBoleta) {
    // Mantener dev intacto
    return (
      <ReservationTicket
        boleta={selectedBoleta}
        onExit={() => {
          setShowTicket(false);
          setSelectedBoleta(null);
        }}
      />
    );
  }

  return (
    <div>
      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn ${tab === "pendientes" ? "active" : ""}`} onClick={() => setTab("pendientes")}>Pendientes</button>
        <button className={`tab-btn ${tab === "completadas" ? "active" : ""}`} onClick={() => setTab("completadas")}>Completadas</button>
      </div>

      {/* Buscador por código + fecha */}
      <div className="search-wrapper">
        <div className="search-container">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Magnifying_glass_icon.svg" alt="lupa" className="search-icon" />
          <input type="text" placeholder="Buscar por código" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="date-container" onClick={() => dateInputRef.current?.showPicker?.()}>
          <input ref={dateInputRef} className="date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <img src={calendar} alt="calendario" className="calendar-icon" />
        </div>
      </div>

      {/* Lista de boletas */}
      <div className="boletas-list">
        {boletasFiltradas.length > 0 ? (
          boletasFiltradas.map((b) => (
            <div key={b.id} className="boleta-card">
              <div className="boleta-color"></div>
              <div className="boleta-info">
                <p>Boleta {b.codigo}</p>
                <p>{b.fecha}</p>
                <p>{b.vehiculo || b.marca}</p> {/* Mostrar vehículo si existe */}
              </div>
              <div className="boleta-actions">
                {tab === "pendientes" ? (
                  <>
                    <strong className="status-text">Pendiente</strong>
                    <div className="action-buttons">
                      {propSetBoletas && (
                       <button className="btn-primary" onClick={() => { setSelectedBoleta(b); setShowTicket(true); }}>Visualizar</button>
                      )}
                     
                    </div>
                  </>
                ) : (
                  <>
                    <span className={`status-badge ${b.resultado === "aceptada" ? "accepted" : "rejected"}`}>
                      {b.resultado === "aceptada" ? "Aceptada" : "Rechazada"}
                    </span>
                    <div className="action-buttons">
                      <button className="btn-primary" onClick={() => { setSelectedBoleta(b); setShowTicket(true); }}>Visualizar</button>
                      {propSetBoletas && (
                        <button className="btn-secondary" onClick={() => propSetBoletas(prev => prev.filter(x => x.id !== b.id))}>Borrar</button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-result">No se encontraron resultados</p>
        )}
      </div>
    </div>
  );
}
