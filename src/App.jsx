import React, { useState } from "react";
import "./App.css";

import AdministradorVehiculos from "./components/administrator/administradorvehiculos";
import AdministradorUsuarios from "./components/administrator/administradorusuarios";
import AdministradorReservaciones from "./components/standard/administradorreservaciones";  // Este sigue igual
import AdministradorBoletas from "./components/administrator/administradorboletas";  // Nueva importación
import ListadoVehiculos from "./components/standard/listaVehiculos";
import Calendario from "./components/standard/calendario";
import Login from "./components/login";
import logoUTN from "./images/logoutn.png";
import perfilImg from "./images/logoperfil.png";

function App() {
  const [activeTab, setActiveTab] = useState("vehiculos");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState(""); // Estado para el nombre completo del usuario

  let Content;
  switch (activeTab) {
    case "reservaciones":
      Content = <AdministradorReservaciones />;
      break;
    case "usuarios":
      Content = <AdministradorUsuarios />;
      break;
    case "listado":
      Content = (
        <ListadoVehiculos onReservarClick={() => setActiveTab("calendario")} />
      );
      break;
    case "calendario":
      Content = <Calendario setActiveTab={setActiveTab} />;
      break;
    case "horario":
      Content = <Horario />;
      break;
    case "boletas":
      Content = <AdministradorBoletas />;
      break;
    case "login":
      Content = <Login />;
      break;
    default:
      Content = <AdministradorVehiculos />;
  }

  // Mostrar solo Login si no está autenticado
  if (!isLoggedIn) {
    return (
      <Login
        onLoginSuccess={(role, nombreCompleto) => {
          setIsLoggedIn(true);
          setUserType(role);

          // Asignar el nombre completo que llega del login
          setUserName(nombreCompleto);

          // Definir pestaña inicial según rol
          if (role === "admin") {
            setActiveTab("vehiculos");
          }
          if (role === "usuario") {
            setActiveTab("listado");
          }
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
