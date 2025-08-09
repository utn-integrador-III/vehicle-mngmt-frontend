import React, { useState } from 'react';
import calendar from "../../images/calendarioicono.png";
import './administradorboletas.css';

export default function Boletas() {
  const [tab, setTab] = useState("en-progreso");
  const [search, setSearch] = useState("");

  const boletas = [
    // EN PROGRESO
    { id: 1, codigo: "ABC123", nombre: "Solano Mora Ruben", marca: "Toyota", fecha: "2025-08-17", estado: "en-progreso" },
    { id: 2, codigo: "XYZ789", nombre: "María Pérez", marca: "Hyundai", fecha: "2025-08-18", estado: "en-progreso" },
    { id: 3, codigo: "JKL456", nombre: "Carlos Jiménez", marca: "Honda", fecha: "2025-08-19", estado: "en-progreso" },

    // PENDIENTES
    { id: 4, codigo: "BAT123", nombre: "Luis Rodríguez", marca: "Toyota", fecha: "2025-08-17", estado: "pendientes" },
    { id: 5, codigo: "MNO654", nombre: "Ana Gómez", marca: "Kia", fecha: "2025-08-20", estado: "pendientes" },
    { id: 6, codigo: "QWE321", nombre: "Pedro Sánchez", marca: "Ford", fecha: "2025-08-21", estado: "pendientes" },

    // CANCELADAS
    { id: 7, codigo: "HYA947", nombre: "Juan Herrera", marca: "Toyota", fecha: "2025-08-17", estado: "canceladas" },
    { id: 8, codigo: "RTY852", nombre: "Laura Martínez", marca: "Chevrolet", fecha: "2025-08-22", estado: "canceladas" },
    { id: 9, codigo: "UIO963", nombre: "Miguel Castro", marca: "Mazda", fecha: "2025-08-23", estado: "canceladas" },
  ];

  const getEstadoTexto = () => {
    if (tab === "pendientes") return "Pendiente";
    if (tab === "en-progreso") return "En progreso";
    if (tab === "canceladas") return "Cancelada";
  };

  // Filtrado por tab y búsqueda
  const boletasFiltradas = boletas.filter(
    (b) =>
      b.estado === tab &&
      (
        b.codigo.toLowerCase().includes(search.toLowerCase()) ||
        b.nombre.toLowerCase().includes(search.toLowerCase()) ||
        b.marca.toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div>
      {/* Tabs */}
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

      {/* Buscador */}
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
                <strong>{getEstadoTexto()}</strong>
                <button className="btn-primary">Visualizar</button>
                <button className="btn-secondary">Contactar</button>
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

