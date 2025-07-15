import React, { useState } from 'react';
import './administradorusuarios.css';

export default function AdministradorUsuarios() {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    tipoUsuario: 'Administrador',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log('Datos guardados:', formData);
    setShowModal(false);
  };

  return (
    <div className="module-container">
    
      <h3 className="usu-section-title">Listado de Usuarios</h3>

      {/* Interfaz superior */}
      <div className="usu-toolbar">
        <button className="usu-add-btn" onClick={() => setShowModal(true)}>➕ Agregar Usuario</button>
        <div className="usu-search-bar">
          <input type="text" placeholder="Buscar Usuario" />
          <button className="usu-search-btn">🔍</button>
        </div>
      </div>

      {/* Modal (popup) */}
      {showModal && (
        <div className="usu-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="usu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="usu-modal-header">
              <h3>Editar Usuario</h3>
            </div>

            <div className="usu-input-row">
              <label htmlFor="cedula">Cédula</label>
              <input
                id="cedula"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                type="text"
              />
            </div>

            <div className="usu-input-row">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                type="text"
              />
            </div>

            <div className="usu-input-row">
              <label htmlFor="apellidos">Apellidos</label>
              <input
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                type="text"
              />
            </div>

            <div className="usu-input-row">
              <label htmlFor="correo">Correo</label>
              <input
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                type="email"
              />
            </div>

            <div className="usu-input-row">
              <label htmlFor="contrasena">Contraseña</label>
              <input
                id="contrasena"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                type="password"
              />
            </div>

            <div className="usu-input-row">
              <label htmlFor="tipoUsuario">Tipo Usuario</label>
              <select
                id="tipoUsuario"
                name="tipoUsuario"
                value={formData.tipoUsuario}
                onChange={handleChange}
              >
                <option value="Administrador">Administrador</option>
                <option value="Usuario">Usuario</option>
              </select>
            </div>

            <div className="usu-modal-buttons">
              <button className="usu-save-btn" onClick={handleSave}>Guardar</button>
              <button className="usu-cancel-btn" onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
