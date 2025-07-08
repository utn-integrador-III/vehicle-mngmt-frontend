import React, { useState } from "react";
import "./App.css";                                   

import AdministradorVehiculos from "./components/administradorvehiculos";
import AdministradorUsuarios   from "./components/administradorusuarios";
import AdministradorReservaciones from "./components/administradorreservaciones";

import logoUTN   from "./images/logoutn.png";
import perfilImg from "./images/logoperfil.png";
import ListadoVehiculos from "./components/listaVehiculos";


function App() {
  // By default we start in 'vehicles'
  const [activeTab, setActiveTab] = useState("vehiculos");

  // We choose which component to render
  let Content;
  switch (activeTab) {
    case "reservaciones":
      Content = <AdministradorReservaciones />;
      break;
    case "usuarios":
      Content = <AdministradorUsuarios />;
      break;
    case "listado":
      Content = <ListadoVehiculos/>;
      break;
    default:
      Content = <AdministradorVehiculos />;
  }

  return (
    <div className="app-container">
      {/* Blue bar with menu */}
      <header className="navbar">
        <img src={logoUTN} alt="Logo UTN" className="navbar-logo" />

        <div className="navbar-menu">
          <button
            className={`menu-button ${activeTab === "vehiculos" ? "active" : ""}`}
            onClick={() => setActiveTab("vehiculos")}
          >
            Inicio
          </button>
          <button
            className={`menu-button ${activeTab === "reservaciones" ? "active" : ""}`}
            onClick={() => setActiveTab("reservaciones")}
          >
            Reservación Vehículo
          </button>
           <button
            className={`menu-button ${activeTab === "listado" ? "active" : ""}`}
            onClick={() => setActiveTab("listado")}
          >
            Listado Vehiculos
          </button>
          <button
            className={`menu-button ${activeTab === "usuarios" ? "active" : ""}`}
            onClick={() => setActiveTab("usuarios")}
          >
            Gestión Usuarios
          </button>
        </div>

        <div className="navbar-profile">
          <img src={perfilImg} alt="Perfil" className="profile-pic" />
          <span className="profile-name">Yonan Arguedas Calvo</span>
        </div>
      </header>

      {/* Gray border */}
      <div className="borde-gris" />

      {/* Main content */}
      <main className="main-content">
        {Content}
      </main>
    </div>
  );
}

export default App;

