import React, { useState } from "react";
import axios from "axios";
import "/src/components/login.css";
import driverImage from "../images/login.jpg";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/login", {
        cedula: username,
        contraseña: password,
      });

      const data = response.data.data;

      if (data && data.rol) {
        // Construir el nombre completo
        const nombreCompleto = `${data.nombre} ${data.apellidos}`;
        if (onLoginSuccess) onLoginSuccess(data.rol, nombreCompleto);
      } else {
        setError("Respuesta inválida del servidor");
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setError("Cédula o contraseña incorrectos");
      } else {
        setError("Error de conexión con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-background"></div>

      <div className="login-popup">
        <div className="login-left">
          <img src={driverImage} alt="Conductor feliz" />
        </div>

        <div className="login-right">
          <h2 className="welcome-title">Welcome Back!</h2>
          <p className="subtitle">Sign in your account</p>
          <form onSubmit={handleLogin} className="login-form">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="60189670"
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="***"
              required
            />

            {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}

            <button type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
