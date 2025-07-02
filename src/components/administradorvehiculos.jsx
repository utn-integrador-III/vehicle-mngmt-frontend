import React, { useState } from "react";
import "./administradorvehiculos.css";

function AdministradorVehiculos() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="vehiculos-container">
      <div className="titulo-seccion">Vehículos disponibles</div>

      <div className="top-bar">
        <button className="add-button" onClick={() => setShowModal(true)}>
          + Agregar Vehículo
        </button>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar vehículo..."
        />
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">Agregar Vehículo</div>
                  <div className="modal-body">
  <div className="form-row">
    <div className="form-group flex-1">
      <label>Foto del vehículo</label>
      <input type="file" accept="image/png" />
    </div>
    <div className="form-group flex-1">
      <label>Marca</label>
      <input type="text" />
    </div>
  </div>

  <div className="form-group">
    <label>Placa</label>
    <input type="text" />
  </div>

  <div className="form-row">
    <div className="form-group flex-1">
      <label>Modelo</label>
      <input type="text" />
    </div>
    <div className="form-group flex-1">
      <label>Año</label>
      <input type="text" />
    </div>
  </div>

            </div>
            <div className="modal-footer">
              <button className="btn-aceptar">Aceptar</button>
              <button className="btn-salir" onClick={() => setShowModal(false)}>
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdministradorVehiculos;
