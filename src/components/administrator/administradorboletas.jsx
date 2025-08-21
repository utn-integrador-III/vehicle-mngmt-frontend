import React, { useState } from 'react';
import calendar from "../../images/calendarioicono.png";
import './administradorboletas.css';

export default function Boletas({ boletas, setBoletas, setActiveTab, setSelectedBoleta }) {
  const [tab, setTab] = useState("en-progreso");
  const [search, setSearch] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailToShow, setEmailToShow] = useState("");

  const getEstadoTexto = (b) => {
    if (b.estadoDetalle) return b.estadoDetalle; // "Aceptada" o "Rechazada" o "Cancelada"
    if (tab === "pendientes") return "Pendiente";
    if (tab === "en-progreso") return "En progreso";
    if (tab === "canceladas") return "Cancelada";
  };

  const boletasFiltradas = boletas.filter(
    (b) =>
      b.estado === tab &&
      (
        b.codigo.toLowerCase().includes(search.toLowerCase()) ||
        b.nombre.toLowerCase().includes(search.toLowerCase()) ||
        b.marca.toLowerCase().includes(search.toLowerCase())
      )
  );

  const handleContact = (b) => {
    setEmailToShow(b.email || "sin-correo@ejemplo.com");
    setShowEmailModal(true);
  };

  const handleDelete = (b) => {
    if (window.confirm(`¿Borrar la boleta ${b.codigo}?`)) {
      setBoletas(prev => prev.filter(x => x.id !== b.id));
    }
  };

  return (
    <div>
      <div className="tabs">
        <button
          className={`tab-btn ${tab === "pendientes" ? "active" : ""}`}
          onClick={() => setTab("pendientes")}
        >
          Pendientes
        </button>
        <button
          className={`tab-btn ${tab === "en-progreso" ? "active" : ""}`}
          onClick={() => setTab("en-progreso")}
        >
          En progreso
        </button>
        <button
          className={`tab-btn ${tab === "canceladas" ? "active" : ""}`}
          onClick={() => setTab("canceladas")}
        >
          Canceladas
        </button>
      </div>

      <div className="search-wrapper">
        <div className="search-container">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Magnifying_glass_icon.svg"
            alt="lupa"
            className="search-icon"
          />
          <input
            type="text"
            placeholder="Buscar por placa, nombre o marca"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <img
          src={calendar}
          alt="calendario"
          className="calendar-icon"
        />
      </div>

      <div className="boletas-list">
        {boletasFiltradas.length > 0 ? (
          boletasFiltradas.map((b) => (
            <div key={b.id} className="boleta-card">
              <div className="boleta-color"></div>
              <div className="boleta-info">
                <p>Boleta {b.codigo}</p>
                <p>{b.nombre}</p>
                <p>{b.marca}</p>
                <p>{b.fecha}</p>
              </div>
              <div className="boleta-actions">
                <strong>{getEstadoTexto(b)}</strong>

                {tab === "pendientes" ? (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setSelectedBoleta(b);
                      setActiveTab("estadoboleta");
                    }}
                  >
                    Pendiente
                  </button>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setSelectedBoleta(b);
                      setActiveTab("estadoboleta");
                    }}
                  >
                    Visualizar
                  </button>
                )}

                {tab === "canceladas" ? (
                  <button className="btn-secondary" onClick={() => handleDelete(b)}>
                    Borrar
                  </button>
                ) : (
                  <button className="btn-secondary" onClick={() => handleContact(b)}>
                    Contactar
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-result">No se encontraron resultados</p>
        )}
      </div>

      {/* Modal de correo */}
      {showEmailModal && (
        <div className="ab-modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="ab-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Contacto</h3>
            <p>Correo del solicitante:</p>
            <p><strong>{emailToShow}</strong></p>
            <div className="ab-modal-buttons">
              <button onClick={() => setShowEmailModal(false)}>Cerrar</button>
              <a href={`mailto:${emailToShow}`}><button>Enviar correo</button></a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
