import React from "react";
import "./App.css";
import AdministradorVehiculos from "./components/administradorvehiculos";

function App() {
  return (
    <div className="app-container">
      {/* Barra azul */}
      <header className="navbar">
        <img
          src="src/images/logoutn.png"
          alt="Logo UTN"
          className="logo"
        />
      </header>

      {/* Borde gris */}
      <div className="borde-gris"></div>

      {/* Contenido principal */}
      <main className="main-content">
        <AdministradorVehiculos />
      </main>
    </div>
  );
}

export default App;
