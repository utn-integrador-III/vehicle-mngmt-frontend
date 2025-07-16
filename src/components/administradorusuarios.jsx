import React, { useState } from 'react';
import './administradorusuarios.css';

export default function AdministradorUsuarios() {
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [usuarios, setUsuarios] = useState([]);

  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    tipoUsuario: 'Administrador',
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const [busqueda, setBusqueda] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const actualizados = [...usuarios];
      actualizados[editIndex] = formData;
      setUsuarios(actualizados);
      setEditIndex(null);
    } else {
      setUsuarios([...usuarios, formData]);
    }

    setFormData({
      cedula: '',
      nombre: '',
      apellidos: '',
      correo: '',
      contrasena: '',
      tipoUsuario: 'Administrador',
    });

    setShowModal(false);
    setBusqueda('');
  };

  const confirmarEliminar = (index) => {
    setUsuarioAEliminar(usuarios[index]);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmado = () => {
    const nuevosUsuarios = usuarios.filter(
      (usuario) => usuario.cedula !== usuarioAEliminar.cedula
    );
    setUsuarios(nuevosUsuarios);
    setShowConfirmModal(false);
    setUsuarioAEliminar(null);
    setBusqueda('');
  };

  const handleEdit = (index) => {
    setFormData(usuarios[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="module-container">
      <h3 className="usu-section-title">Listado de Usuarios</h3>

      <div className="usu-toolbar">
        <button className="usu-add-btn" onClick={() => { setShowModal(true); setEditIndex(null); }}>
          ➕ Agregar Usuario
        </button>
        <div className="usu-search-bar">
          <input
            type="text"
            placeholder="Buscar Usuario"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className="usu-search-btn" onClick={() => {}}>🔍</button>
        </div>
      </div>

      {/* Modal de agregar/editar */}
      {showModal && (
        <div className="usu-modal-overlay" onClick={() => { setShowModal(false); setEditIndex(null); }}>
          <div className="usu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="usu-modal-header">
              <h3>{editIndex !== null ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
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
                <option value="Administrador">Admin</option>
                <option value="Usuario">Usuario</option>
              </select>
            </div>

            <div className="usu-modal-buttons">
              <button className="usu-save-btn" onClick={handleSave}>Guardar</button>
              <button className="usu-cancel-btn" onClick={() => { setShowModal(false); setEditIndex(null); }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tarjetas */}
      <div className="usu-card-container">
        {usuariosFiltrados.map((usuario, index) => {
          const originalIndex = usuarios.findIndex(u => u.cedula === usuario.cedula);
          return (
            <div key={index} className="usu-card">
              <h4>{usuario.tipoUsuario}</h4>
              <ul>
                <li><strong>•</strong> {usuario.nombre}</li>
                <li><strong>•</strong> {usuario.apellidos}</li>
                <li><strong>•</strong> {usuario.correo}</li>
                <li><strong>•</strong> {usuario.cedula}</li>
              </ul>
              <div className="usu-card-buttons">
                <button className="usu-edit-btn" onClick={() => handleEdit(originalIndex)}>Editar</button>
                <button className="usu-delete-btn" onClick={() => confirmarEliminar(originalIndex)}>Eliminar</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de confirmación */}
      {showConfirmModal && usuarioAEliminar && (
        <div className="usu-modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="usu-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="usu-confirm-title">
              Eliminar usuario <strong>{usuarioAEliminar.nombre}</strong>
            </h3>
            <p>¿Estás seguro que deseas borrar este usuario de la lista?</p>
            <div className="usu-modal-buttons">
              <button className="usu-delete-confirm-btn" onClick={handleDeleteConfirmado}>
                Aceptar
              </button>
              <button className="usu-cancel-btn" onClick={() => setShowConfirmModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
