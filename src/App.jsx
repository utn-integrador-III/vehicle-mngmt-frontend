import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import AdministradorVehiculos from "./components/administradorvehiculos";
import ListadoVehiculos from "./components/listaVehiculos";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Barra azul */}
        <header className="navbar">
          <img
            src="src/images/logoutn.png"
            alt="Logo UTN"
            className="logo"
          />
          {/* Botones de navegación */}
          <nav className="nav-links">
            <Link to="/">Administrar Vehículos</Link>
            <Link to="/listado">Listado Vehículos</Link>
          </nav>
        </header>

        {/* Borde gris */}
        <div className="borde-gris"></div>

        {/* Contenido principal */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<AdministradorVehiculos />} />
            <Route path="/listado" element={<ListadoVehiculos />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
