import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import calendar from "../../images/calendarioicono.png";
import "./administradorreservaciones.css";
import ReservationTicket from "./muestrareservaciones";

export default function AdministradorReservaciones({
  boletas: propBoletas,
  setBoletas: propSetBoletas,
}) {
  const [tab, setTab] = useState("pendientes"); // "pendientes" | "completadas"
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(""); // YYYY-MM-DD
  const dateInputRef = useRef(null);

  const [showTicket, setShowTicket] = useState(false);
  const [selectedBoleta, setSelectedBoleta] = useState(null);

  const [boletas, setBoletas] = useState(propBoletas || []);

  // Usar el nombre del usuario para buscar boletas
  const loggedUserName = localStorage.getItem("loggedUserName");

  // Cargar boletas desde API
  useEffect(() => {
    const fetchBoletas = async () => {
      try {
        if (!loggedUserName) return;

        const response = await axios.get(
          `http://146.190.156.26:8000/rental_requestId/${encodeURIComponent(
            loggedUserName
          )}`
        );
        if (response.data?.data) {
          const fetchedBoletas = response.data.data.map((b) => ({
            id: b._id, // React key
            applicant: b.applicant,
            direccion: b.direccion,
            necesidad: b.necesidad,
            departureTime: b.start_date || "",
            estimate: b.estimate || "",
            comp1: b.companions?.[0] || "",
            comp2: b.companions?.[1] || "",
            comp3: b.companions?.[2] || "",
            comp4: b.companions?.[3] || "",
            fecha: b.date
              ? `${b.date.year}-${String(b.date.month).padStart(
                  2,
                  "0"
                )}-${String(b.date.day).padStart(2, "0")}`
              : "",
            plate: b.plate,
            marca: b.model,
            model: b.model, // <-- se asegura de mostrar el model
            status: b.status,
            estado: b.status === "cancelled" ? "completadas" : "pendientes",
            resultado:
              b.status === "cancelled"
                ? "aceptada"
                : b.status === "rejected"
                ? "rechazada"
                : "",
          }));
          setBoletas(fetchedBoletas);
          if (propSetBoletas) propSetBoletas(fetchedBoletas);
        }
      } catch (error) {
        console.error("Error fetching boletas:", error);
      }
    };
    fetchBoletas();
  }, [loggedUserName, propSetBoletas]);

  const setBoletasProp = propSetBoletas || (() => {});

  // Finalizar boleta (solo si viene prop)
  const finalizarBoleta = (id) => {
    if (!propSetBoletas) return;
    const savedData = JSON.parse(localStorage.getItem("reservationData")) || {};
    propSetBoletas((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, estado: "completadas", resultado: "aceptada", ...savedData }
          : b
      )
    );
  };

  const boletasFiltradas = boletas.filter((b) => {
    if (b.estado !== tab) return false;
    const matchCodigo =
      !search || b.codigo?.toLowerCase().includes(search.toLowerCase());
    const matchFecha = !date || b.fecha === date;
    return matchCodigo && matchFecha;
  });

  if (showTicket && selectedBoleta) {
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
      <div className="tabs">
        <button
          className={`tab-btn ${tab === "pendientes" ? "active" : ""}`}
          onClick={() => setTab("pendientes")}
        >
          Pendientes
        </button>
        <button
          className={`tab-btn ${tab === "completadas" ? "active" : ""}`}
          onClick={() => setTab("completadas")}
        >
          Completadas
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
            placeholder="Buscar por código"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div
          className="date-container"
          onClick={() => dateInputRef.current?.showPicker?.()}
        >
          <input
            ref={dateInputRef}
            className="date-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <img src={calendar} alt="calendario" className="calendar-icon" />
        </div>
      </div>

      <div className="boletas-list">
        {boletasFiltradas.length > 0 ? (
          boletasFiltradas.map((b) => (
            <div key={b.id} className="boleta-card">
              <div className="boleta-color"></div>
              <div className="boleta-info">
                <p>Boleta {b.codigo}</p>
                <p>{b.fecha}</p>
                <p>{b.vehiculo || b.model}</p> {/* <-- mostrar model */}
              </div>
              <div className="boleta-actions">
                {tab === "pendientes" ? (
                  <>
                    <strong className="status-text">Pendiente</strong>
                    <div className="action-buttons">
                      <button
                        className="btn-primary"
                        onClick={() => {
                          setSelectedBoleta(b);
                          setShowTicket(true);
                        }}
                      >
                        Visualizar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span
                      className={`status-badge ${
                        b.resultado === "aceptada" ? "accepted" : "rejected"
                      }`}
                    >
                      {b.resultado === "aceptada" ? "Aceptada" : "Rechazada"}
                    </span>
                    <div className="action-buttons">
                      <button
                        className="btn-primary"
                        onClick={() => {
                          setSelectedBoleta(b);
                          setShowTicket(true);
                        }}
                      >
                        Visualizar
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() =>
                          setBoletas((prev) =>
                            prev.filter((x) => x.id !== b.id)
                          )
                        }
                      >
                        Borrar
                      </button>
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
