import React, { useState, useEffect } from "react";
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
  // Leer valores de localStorage al iniciar
  const getInitial = (key, fallback) => {
    const value = localStorage.getItem(key);
    if (value === null) return fallback;
    if (key === "isLoggedIn") return value === "true";
    return value;
  };

  const [activeTab, setActiveTab] = useState(() => getInitial("activeTab", "vehiculos"));
  const [isLoggedIn, setIsLoggedIn] = useState(() => getInitial("isLoggedIn", false));
  const [userType, setUserType] = useState(() => getInitial("userType", null));
  const [userName, setUserName] = useState(() => getInitial("userName", "")); 

  // Estado global de boletas
  const [boletas, setBoletas] = useState([]);

  const [selectedBoleta, setSelectedBoleta] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Sincronizar cambios de sesión y pestaña con localStorage
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
    localStorage.setItem("userType", userType ?? "");
    localStorage.setItem("userName", userName ?? "");
    localStorage.setItem("activeTab", activeTab ?? "");
  }, [isLoggedIn, userType, userName, activeTab]);

  let Content;
  switch (activeTab) {
    case "reservaciones":
      Content = <AdministradorReservaciones boletas={boletas} setBoletas={setBoletas} />;
      break;
    case "usuarios":
      Content = <AdministradorUsuarios />;
      break;
    case "listado":
      Content = <ListadoVehiculos onReservarClick={() => setActiveTab("calendario")} />;
      break;
    case "calendario":
      Content = <Calendario setActiveTab={setActiveTab} boletas={boletas} setBoletas={setBoletas} />;
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
      Content = <Login onLoginSuccess={(role, nombreCompleto) => {
        setIsLoggedIn(true);
        setUserType(role);
        setUserName(nombreCompleto);
        setShowProfileMenu(false); // <-- Cierra el menú al hacer login
        if (role === "admin") setActiveTab("vehiculos");
        if (role === "usuario") setActiveTab("listado");
      }} />;
      break;
    default:
      Content = <AdministradorVehiculos />;
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUserName("");
    setActiveTab("login");
    setShowProfileMenu(false);
    // Limpia localStorage para sesión
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    localStorage.removeItem("activeTab");
  };

  // Mostrar solo Login si no está autenticado
  if (!isLoggedIn) {
    return (
      <Login
        onLoginSuccess={(role, nombreCompleto) => {
          setIsLoggedIn(true);
          setUserType(role);
          setUserName(nombreCompleto);
          setShowProfileMenu(false); 
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
              <button className={`menu-button ${activeTab === "vehiculos" ? "active" : ""}`} onClick={() => setActiveTab("vehiculos")}>Inicio</button>
              <button className={`menu-button ${activeTab === "boletas" ? "active" : ""}`} onClick={() => setActiveTab("boletas")}>Reservación Vehículo</button>
              <button className={`menu-button ${activeTab === "usuarios" ? "active" : ""}`} onClick={() => setActiveTab("usuarios")}>Gestión Usuarios</button>
            </>
          )}
          {userType === "usuario" && (
            <>
              <button className={`menu-button ${activeTab === "listado" ? "active" : ""}`} onClick={() => setActiveTab("listado")}>Listado Vehiculos</button>
              <button className={`menu-button ${activeTab === "reservaciones" ? "active" : ""}`} onClick={() => setActiveTab("reservaciones")}>Reservación Vehículo</button>
            </>
          )}
        </div>
        <div
          className="navbar-profile"
          style={{ position: "relative", cursor: "pointer" }}
          onClick={() => setShowProfileMenu((v) => !v)}
        >
          <img src={perfilImg} alt="Perfil" className="profile-pic" />
          <span className="profile-name">
            {userName}
            <span style={{ marginLeft: 6, fontSize: 16, verticalAlign: "middle" }}>▼</span>
          </span>
          {showProfileMenu && (
            <div className="profile-menu">
              <button className="logout-btn" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="borde-gris" />
      <main className="main-content">{Content}</main>
    </div>
  );
}

export default App;
