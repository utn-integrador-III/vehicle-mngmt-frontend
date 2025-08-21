import React, { useState, useRef } from "react";
import calendar from "../../images/calendarioicono.png";
import "./administradorreservaciones.css";

export default function AdministradorReservaciones({ boletas, setBoletas }) {
  const [tab, setTab] = useState("pendientes");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [selectedBoleta, setSelectedBoleta] = useState(null);
  const dateInputRef = useRef(null);

  const finalizarBoleta = (id) => {
    // Obtener los datos de la reserva desde localStorage
    const savedData = JSON.parse(localStorage.getItem("reservationData")) || {};
    setBoletas(prev =>
      prev.map(b =>
        b.id === id
          ? { ...b, estado: "completadas", resultado: "aceptada", ...savedData }
          : b
      )
    );
  };

  const boletasFiltradas = boletas.filter(b => {
    if(b.estado !== tab) return false;
    const matchCodigo = !search || b.codigo.toLowerCase().includes(search.toLowerCase());
    const matchFecha  = !date   || b.fecha === date;
    return matchCodigo && matchFecha;
  });

  return (
    <div>
      <div className="tabs">
        <button className={`tab-btn ${tab === "pendientes" ? "active" : ""}`} onClick={() => setTab("pendientes")}>Pendientes</button>
        <button className={`tab-btn ${tab === "completadas" ? "active" : ""}`} onClick={() => setTab("completadas")}>Completadas</button>
      </div>

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

      <div className="boletas-list">
        {boletasFiltradas.length > 0 ? (
          boletasFiltradas.map(b => (
            <div key={b.id} className="boleta-card">
              <div className="boleta-color"></div>
              <div className="boleta-info">
                <p>Boleta {b.codigo}</p>
                <p>{b.fecha}</p>
                <p>{b.vehiculo || b.marca}</p> {/* Mostramos vehículo */}
              </div>
              <div className="boleta-actions">
                {tab === "pendientes" ? (
                  <>
                    <strong className="status-text">Pendiente</strong>
                    <div className="action-buttons">
                      <button className="btn-primary" onClick={() => finalizarBoleta(b.id)}>Finalizar</button>
                      <button className="btn-primary" onClick={() => setSelectedBoleta(b)}>Visualizar</button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className={`status-badge ${b.resultado === "aceptada" ? "accepted" : "rejected"}`}>
                      {b.resultado === "aceptada" ? "Aceptada" : "Rechazada"}
                    </span>
                    <div className="action-buttons">
                      <button className="btn-primary" onClick={() => setSelectedBoleta(b)}>Visualizar</button>
                      <button className="btn-secondary" onClick={() => setBoletas(prev => prev.filter(x => x.id !== b.id))}>Borrar</button>
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

      {/* Modal de visualización */}
      {selectedBoleta && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Boleta {selectedBoleta.codigo}</h3>
            <p><strong>Vehículo:</strong> {selectedBoleta.vehiculo || "No disponible"}</p>
            <p><strong>Fecha:</strong> {selectedBoleta.fecha || "No disponible"}</p>
            <p><strong>Dirección:</strong> {selectedBoleta.direccion || "No disponible"}</p>
            <p><strong>Necesidad:</strong> {selectedBoleta.necesidad || "No disponible"}</p>
            <p><strong>Hora de salida:</strong> {selectedBoleta.departureTime || "No disponible"}</p>
            <p><strong>Tiempo estimado:</strong> {selectedBoleta.estimate || "No disponible"}</p>
            <p><strong>Compañeros:</strong> {`${selectedBoleta.comp1 || ""} ${selectedBoleta.comp2 || ""} ${selectedBoleta.comp3 || ""} ${selectedBoleta.comp4 || ""}`.trim() || "No disponible"}</p>
            <p><strong>Archivo adjunto:</strong> {selectedBoleta.fileName || "No disponible"}</p>
            <button className="btn-primary" onClick={() => setSelectedBoleta(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
