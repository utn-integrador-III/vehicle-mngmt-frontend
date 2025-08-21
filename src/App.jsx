import React, { useState } from "react";
import "./App.css";

import AdministradorVehiculos from "./components/administrator/administradorvehiculos";
import AdministradorUsuarios from "./components/administrator/administradorusuarios";
import AdministradorReservaciones from "./components/standard/administradorreservaciones"; 
import AdministradorBoletas from "./components/administrator/administradorboletas";  
import EstadoBoleta from "./components/administrator/estadoboleta";
import ListadoVehiculos from "./components/standard/listaVehiculos";
import Calendario from "./components/standard/calendario";
import Login from "./components/login";
import logoUTN from "./images/logoutn.png";
import perfilImg from "./images/logoperfil.png";

function App() {
  const [activeTab, setActiveTab] = useState("vehiculos");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState(""); 

  // Datos fijos para las boletas Aceptar/rechazar/cancelada
  const [boletas, setBoletas] = useState([
    { id: 1, codigo: "ABC123", nombre: "Solano Mora Ruben", marca: "Toyota",  fecha: "2025-08-17", estado: "en-progreso", email: "ruben.solano@utn.cr", estadoDetalle: "Aceptada" },
    { id: 2, codigo: "XYZ789", nombre: "María Pérez",        marca: "Hyundai", fecha: "2025-08-18", estado: "en-progreso", email: "maria.perez@utn.cr",   estadoDetalle: "Aceptada" },
    { id: 3, codigo: "JKL456", nombre: "Carlos Jiménez",      marca: "Honda",   fecha: "2025-08-19", estado: "en-progreso", email: "carlos.jimenez@utn.cr", estadoDetalle: "Aceptada" },
    { id: 4, codigo: "BAT123", nombre: "Luis Rodríguez",      marca: "Toyota",  fecha: "2025-08-17", estado: "pendientes", email: "luis.rodriguez@utn.cr" },
    { id: 5, codigo: "MNO654", nombre: "Ana Gómez",           marca: "Kia",     fecha: "2025-08-20", estado: "pendientes", email: "ana.gomez@utn.cr" },
    { id: 6, codigo: "QWE321", nombre: "Pedro Sánchez",       marca: "Ford",    fecha: "2025-08-21", estado: "pendientes", email: "pedro.sanchez@utn.cr" },
    { id: 7, codigo: "HYA947", nombre: "Juan Herrera",        marca: "Toyota",  fecha: "2025-08-17", estado: "canceladas", email: "juan.herrera@utn.cr",    estadoDetalle: "Cancelada" },
    { id: 8, codigo: "RTY852", nombre: "Laura Martínez",      marca: "Chevrolet",fecha: "2025-08-22", estado: "canceladas", email: "laura.martinez@utn.cr",  estadoDetalle: "Cancelada" },
    { id: 9, codigo: "UIO963", nombre: "Miguel Castro",       marca: "Mazda",   fecha: "2025-08-23", estado: "canceladas", email: "miguel.castro@utn.cr",   estadoDetalle: "Cancelada" },
  ]);

  const [selectedBoleta, setSelectedBoleta] = useState(null);

  let Content;
  switch (activeTab) {
    case "reservaciones":
      Content = <AdministradorReservaciones onExit={() => setActiveTab("listado")} />;
      break;
    case "usuarios":
      Content = <AdministradorUsuarios />;
      break;
    case "listado":
      Content = <ListadoVehiculos onReservarClick={() => setActiveTab("calendario")} />;
      break;
    case "calendario":
      Content = <Calendario setActiveTab={setActiveTab} />;
      break;
    case "boletas":
      Content = (
        <AdministradorBoletas
          boletas={boletas}
          setBoletas={setBoletas}
          setActiveTab={setActiveTab}
          setSelectedBoleta={setSelectedBoleta}
        />
      );
      break;
    case "estadoboleta":
      Content = (
        <EstadoBoleta
          boleta={selectedBoleta}
          setBoletas={setBoletas}
          setActiveTab={setActiveTab}
        />
      );
      break;
    case "login":
      Content = <Login />;
      break;
    default:
      Content = <AdministradorVehiculos />;
  }

  if (!isLoggedIn) {
    return (
      <Login
        onLoginSuccess={(role, nombreCompleto) => {
          setIsLoggedIn(true);
          setUserType(role);
          setUserName(nombreCompleto);
          if (role === "admin") setActiveTab("vehiculos");
          if (role === "usuario") setActiveTab("listado");
        }}
      />
    );
  }

  return (
    <div className="app-container">
      <header className="navbar">
        <img src={logoUTN} alt="Logo UTN" className="navbar-logo" />
        <div className="navbar-menu">
          {userType === "admin" && (
            <>
              <button
                className={`menu-button ${activeTab === "vehiculos" ? "active" : ""}`}
                onClick={() => setActiveTab("vehiculos")}
              >
                Inicio
              </button>
              <button
                className={`menu-button ${activeTab === "boletas" ? "active" : ""}`}
                onClick={() => setActiveTab("boletas")}
              >
                Reservación Vehículo
              </button>
              <button
                className={`menu-button ${activeTab === "usuarios" ? "active" : ""}`}
                onClick={() => setActiveTab("usuarios")}
              >
                Gestión Usuarios
              </button>
            </>
          )}
          {userType === "usuario" && (
            <>
              <button
                className={`menu-button ${activeTab === "listado" ? "active" : ""}`}
                onClick={() => setActiveTab("listado")}
              >
                Listado Vehiculos
              </button>
              <button
                className={`menu-button ${activeTab === "reservaciones" ? "active" : ""}`}
                onClick={() => setActiveTab("reservaciones")}
              >
                Reservación Vehículo
              </button>
            </>
          )}
        </div>
        <div className="navbar-profile">
          <img src={perfilImg} alt="Perfil" className="profile-pic" />
          <span className="profile-name">{userName}</span>
        </div>
      </header>

      <div className="borde-gris" />
      <main className="main-content">{Content}</main>
    </div>
  );
}

export default App;
