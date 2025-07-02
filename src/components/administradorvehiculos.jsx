import React from "react";
import "./administradorvehiculos.css";

function AdministradorVehiculos() {
  return (
    <div className="vehiculos-container">
      <div className="titulo-seccion">Vehículos disponibles</div>

      <div className="top-bar">
        <button className="add-button">+ Agregar Vehículo</button>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar vehículo..."
        />
      </div>
    </div>
  );
}

export default AdministradorVehiculos;
