import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './administradorusuarios.css';

export default function AdministradorUsuarios() {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [usuarios, setUsuarios] = useState([]);

  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    apellidos: '',
    correo: '',
    contraseña: '',
    tipoUsuario: 'admin',
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const API_BASE = 'http://localhost:8000/auth'; // Cambiar si tu API está en otro host/puerto

  // Traer todos los usuarios al iniciar
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await axios.get(`${API_BASE}/all`);
      if (res.data && res.data.data) {
        setUsuarios(res.data.data);
      }
    } catch (err) {
      console.error('Error al traer usuarios:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      if (editId) {
        // PUT actualizar usuario
        const res = await axios.put(`${API_BASE}/update/${editId}`, {
          cedula: formData.cedula,
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          correo: formData.correo,
          contraseña: formData.contrasena,
          rol: formData.tipoUsuario,
        });

        if (res.data && res.data.data) {
          // Reemplazar el usuario actualizado en el estado
          setUsuarios((prev) =>
            prev.map((u) => (u._id === editId ? res.data.data : u))
          );
        }
      } else {
        // POST crear usuario
        const res = await axios.post(`${API_BASE}/register`, {
          cedula: formData.cedula,
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          correo: formData.correo,
          contraseña: formData.contraseña,
          rol: formData.tipoUsuario,
        });

        if (res.data && res.data.data) {
          setUsuarios([...usuarios, res.data.data]);
        }
      }

      // Reset form
      setFormData({
        cedula: '',
        nombre: '',
        apellidos: '',
        correo: '',
        contraseña: '',
        tipoUsuario: 'admin',
      });
      setEditId(null);
      setShowModal(false);
      setBusqueda('');
    } catch (err) {
      console.error('Error al guardar usuario:', err);
    }
  };

  const confirmarEliminar = (id) => {
    const usuario = usuarios.find((u) => u._id === id);
    setUsuarioAEliminar(usuario);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmado = async () => {
    try {
      if (!usuarioAEliminar) return;
      await axios.delete(`${API_BASE}/delete/${usuarioAEliminar._id}`);
      setUsuarios((prev) =>
        prev.filter((u) => u._id !== usuarioAEliminar._id)
      );
      setShowConfirmModal(false);
      setUsuarioAEliminar(null);
      setBusqueda('');
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/get/${id}`);
      if (res.data && res.data.data) {
        const user = res.data.data;
        setFormData({
          cedula: user.cedula || '',
          nombre: user.nombre || '',
          apellidos: user.apellidos || '',
          correo: user.correo || '',
          contraseña: user.contraseña || '',
          tipoUsuario: user.rol || 'admin',
        });
        setEditId(user._id);
        setShowModal(true);
      }
    } catch (err) {
      console.error('Error al traer usuario por ID:', err);
    }
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="module-container">
      <h3 className="usu-section-title">Listado de Usuarios</h3>

      <div className="usu-toolbar">
        <button className="usu-add-btn" onClick={() => { setShowModal(true); setEditId(null); }}>
          ➕ Agregar Usuario
        </button>
        <div className="usu-search-bar">
          <input
            type="text"
            placeholder="Buscar Usuario"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className="usu-search-btn">🔍</button>
        </div>
      </div>

      {/* Modal de agregar/editar */}
      {showModal && (
        <div className="usu-modal-overlay" onClick={() => { setShowModal(false); setEditId(null); }}>
          <div className="usu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="usu-modal-header">
              <h3>{editId ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
            </div>

            <div className="usu-input-row">
              <label htmlFor="cedula">Cédula</label>
              <input id="cedula" name="cedula" value={formData.cedula} onChange={handleChange} type="text" />
            </div>
            <div className="usu-input-row">
              <label htmlFor="nombre">Nombre</label>
              <input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} type="text" />
            </div>
            <div className="usu-input-row">
              <label htmlFor="apellidos">Apellidos</label>
              <input id="apellidos" name="apellidos" value={formData.apellidos} onChange={handleChange} type="text" />
            </div>
            <div className="usu-input-row">
              <label htmlFor="correo">Correo</label>
              <input id="correo" name="correo" value={formData.correo} onChange={handleChange} type="email" />
            </div>
            <div className="usu-input-row">
              <label htmlFor="contraseña">Contraseña</label>
              <input id="contraseña" name="contraseña" value={formData.contraseña} onChange={handleChange} type="password" />
            </div>
            <div className="usu-input-row">
              <label htmlFor="tipoUsuario">Tipo Usuario</label>
              <select id="tipoUsuario" name="tipoUsuario" value={formData.tipoUsuario} onChange={handleChange}>
                <option value="admin">admin</option>
                <option value="usuario">usuario</option>
              </select>
            </div>

            <div className="usu-modal-buttons">
              <button className="usu-save-btn" onClick={handleSave}>Guardar</button>
              <button className="usu-cancel-btn" onClick={() => { setShowModal(false); setEditId(null); }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Tarjetas */}
      <div className="usu-card-container">
        {usuariosFiltrados.map((usuario) => (
          <div key={usuario._id} className="usu-card">
            <h4>{usuario.rol}</h4>
            <ul>
              <li><strong>•</strong> {usuario.nombre}</li>
              <li><strong>•</strong> {usuario.apellidos}</li>
              <li><strong>•</strong> {usuario.correo}</li>
              <li><strong>•</strong> {usuario.cedula}</li>
            </ul>
            <div className="usu-card-buttons">
              <button className="usu-edit-btn" onClick={() => handleEdit(usuario._id)}>Editar</button>
              <button className="usu-delete-btn" onClick={() => confirmarEliminar(usuario._id)}>Eliminar</button>
            </div>
          </div>
        ))}
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
              <button className="usu-delete-confirm-btn" onClick={handleDeleteConfirmado}>Aceptar</button>
              <button className="usu-cancel-btn" onClick={() => setShowConfirmModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}