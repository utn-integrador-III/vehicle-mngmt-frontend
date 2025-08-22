import React, { useState, useEffect } from 'react';
import axios from 'axios';
import calendar from "../../images/calendarioicono.png";
import './administradorboletas.css';

export default function Boletas({ boletas, setBoletas, setActiveTab, setSelectedBoleta }) {
  const [tab, setTab] = useState("en-progreso");
  const [search, setSearch] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailToShow, setEmailToShow] = useState("");

  const loggedUserName = localStorage.getItem("loggedUserName");

  // Mapear status API a estado de pestañas
  const mapStatus = (status) => {
    switch (status) {
      case "pending": return "pendientes";
      case "in-progress": return "en-progreso";
      case "cancelled": return "canceladas";
      default: return "pendientes";
    }
  };

  // Cargar boletas desde la API
  useEffect(() => {
    const fetchBoletas = async () => {
      try {
        if (!loggedUserName) return;

        const response = await axios.get(`http://127.0.0.1:8000/rental_requestId/${encodeURIComponent(loggedUserName)}`);
        if (response.data?.data) {
          const fetchedBoletas = response.data.data.map((b) => ({
            _id: b._id, // Usamos _id original para update
            id: b._id,  // Para key de React
            codigo: b.plate || "N/A",
            nombre: b.applicant || "Desconocido",
            marca: b.model || "Sin modelo",
            fecha: b.date ? `${b.date.day}/${b.date.month}/${b.date.year}` : "",
            email: b.email || "",
            estado: mapStatus(b.status),
            estadoDetalle: b.status === "in-progress" ? "Aceptada" : (b.status === "cancelled" ? "Cancelada" : "Pendiente"),

            // Datos extra para enviar a EstadoBoleta
            direccion: b.direccion || "",
            necesidad: b.necesidad || "",
            departureTime: b.start_date || "",
            estimate: b.estimate || "",
            companions: b.companions || [],
            endTime: b.end_date || "",
            status: b.status,
            motivo: b.motivo || ""
          }));
          setBoletas(fetchedBoletas);
        }
      } catch (error) {
        console.error("Error al obtener boletas:", error);
      }
    };

    fetchBoletas();
  }, [loggedUserName, setBoletas]);

  const getEstadoTexto = (b) => {
    if (b.estadoDetalle) return b.estadoDetalle;
    if (tab === "pendientes") return "Pendiente";
    if (tab === "en-progreso") return "En progreso";
    if (tab === "canceladas") return "Cancelada";
  };

  // Filtrar boletas según la pestaña y búsqueda
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

                {/* Botón principal */}
                <button
                  className="btn-primary"
                  onClick={() => {
                    setSelectedBoleta(b); // enviamos objeto completo
                    setActiveTab("estadoboleta");
                  }}
                >
                  {tab === "pendientes" ? "Pendiente" : "Visualizar"}
                </button>

                {/* Botón secundario */}
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
