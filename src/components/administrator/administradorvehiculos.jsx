import React, { useState, useEffect } from "react";
import axios from "axios";
import "./administradorvehiculos.css";

function AdministradorVehiculos() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState("");
  const [placa, setPlaca] = useState("");
  const [tipo, setTipo] = useState("Automático");
  const [estado, setEstado] = useState("Disponible");

  const [vehiculos, setVehiculos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [vehiculoEditando, setVehiculoEditando] = useState(null);
  const [vehiculoParaEliminar, setVehiculoParaEliminar] = useState(null);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const API_URL = "http://localhost:8000/car";

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = () => {
    axios.get(API_URL)
      .then(res => {
        if (res.data && res.data.data) setVehiculos(res.data.data);
      })
      .catch(err => console.error("Error cargando vehículos:", err));
  };

  const abrirFormulario = () => {
    setMostrarFormulario(true);
    setModoEdicion(false);
    limpiarFormulario();
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    limpiarFormulario();
  };

  const cerrarVistaVehiculo = () => setVehiculoSeleccionado(null);

  const limpiarFormulario = () => {
    setImagenSeleccionada(null);
    setMarca("");
    setModelo("");
    setAnio("");
    setPlaca("");
    setTipo("Automático");
    setEstado("Disponible");
    setVehiculoEditando(null);
  };

  const manejarCargaImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const lector = new FileReader();
      lector.onloadend = () => setImagenSeleccionada(lector.result);
      lector.readAsDataURL(archivo);
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const manejarGuardarVehiculo = async () => {
    try {
      const formData = new FormData();
      formData.append("brand", marca);
      formData.append("model", modelo);
      formData.append("year", anio);
      formData.append("plate", placa);
      formData.append("type", tipo);
      formData.append("status", estado);

      if (imagenSeleccionada) {
        const archivo = dataURLtoFile(imagenSeleccionada, "imagen.png");
        formData.append("photo", archivo);
      }

      if (modoEdicion && vehiculoEditando !== null) {
        const id = vehiculos[vehiculoEditando].id;
        await axios.put(`${API_URL}/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await axios.post(API_URL, formData, { headers: { "Content-Type": "multipart/form-data" } });
      }

      cargarVehiculos();
      cerrarFormulario();
    } catch (err) {
      console.error("Error guardando vehículo:", err);
    }
  };

  const manejarEditarVehiculo = (index) => {
    const v = vehiculos[index];
    setMarca(v.brand || "");
    setModelo(v.model || "");
    setAnio(v.year || "");
    setPlaca(v.plate || "");
    setTipo(v.type || "Automático");
    setEstado(v.status || "Disponible");
    setImagenSeleccionada(v.photo ? `data:image/png;base64,${v.photo}` : null);
    setVehiculoEditando(index);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  const manejarConfirmarEliminar = async () => {
    if (vehiculoParaEliminar !== null) {
      const id = vehiculos[vehiculoParaEliminar].id;
      try {
        await axios.delete(`${API_URL}/${id}`);
        cargarVehiculos();
        setVehiculoParaEliminar(null);
      } catch (err) {
        console.error("Error eliminando vehículo:", err);
      }
    }
  };

  const vehiculosFiltrados = vehiculos.filter((vehiculo) =>
    `${vehiculo.brand} ${vehiculo.model} ${vehiculo.plate}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="vehiculos-container">
      <div className="titulo-seccion">Vehículos disponibles</div>

      <div className="top-bar">
        <button className="add-button" onClick={abrirFormulario}>+ Agregar Vehículo</button>
        <input
          type="text"
          className="search-input-list"
          placeholder="Buscar vehículo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="vehiculo-lista">
        {vehiculosFiltrados.map((vehiculo, index) => (
          <div key={index} className="vehiculo-card">
            <div className="vehiculo-img">
              <img src={vehiculo.photo ? `data:image/png;base64,${vehiculo.photo}` : imagenSeleccionada} alt="Vehículo" />
            </div>
            <div className="vehiculo-info">
              <h3>{vehiculo.brand}</h3>
              <p>{vehiculo.model} - {vehiculo.year}</p>
              <p>Placa: {vehiculo.plate}</p>
              <div className="vehiculo-botones">
                <button onClick={() => setVehiculoSeleccionado(vehiculo)}>Ver Vehículo</button>
                <button onClick={() => manejarEditarVehiculo(index)}>Editar</button>
                <button onClick={() => setVehiculoParaEliminar(index)}>Borrar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal agregar / editar */}
      {mostrarFormulario && (
        <div className="modal-overlay">
          <div className={`modal-content ${modoEdicion ? "editar-form" : ""}`}>
            <div className="modal-header">{modoEdicion ? "Editar Vehículo" : "Agregar Vehículo"}</div>
            <div className="modal-body">
              {modoEdicion ? (
                <div className="editar-body">
                  <div className="editar-imagen">
                    {imagenSeleccionada && <img src={imagenSeleccionada} alt="Vista previa" />}
                    <label className="upload-label" style={{ marginTop: "10px" }}>
                      <input type="file" accept="image/png, image/jpeg" onChange={manejarCargaImagen} hidden />
                      <div className="upload-btn-editar">
                        <img src="src/images/carpeta2.png" alt="icono adjuntar" className="icono-adjuntar"/>
                        Adjuntar PNG
                      </div>
                    </label>
                    <div className="campo-anio-editar">
                      <label>Año</label>
                      <input type="text" value={anio} onChange={(e) => setAnio(e.target.value)} />
                    </div>
                  </div>
                  <div className="editar-campos">
                    <div className="form-group">
                      <label>Placa</label>
                      <input type="text" value={placa} onChange={(e) => setPlaca(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Modelo</label>
                      <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Tipo</label>
                      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                        <option value="Automático">Automático</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Estado</label>
                      <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                        <option value="Automático">Disponible</option>
                        <option value="Ocupado">Ocupado</option>
                        <option value="Mantenimiento">Mantenimiento</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="form-group">
                    <label>Foto del vehículo</label>
                    <label className="upload-label">
                      <input type="file" accept="image/png, image/jpeg" onChange={manejarCargaImagen} hidden />
                      <div className="upload-btn-with-icon">
                        <img src="src/images/carpeta.png" alt="icono adjuntar" className="icono-adjuntar"/>
                        Adjuntar PNG
                      </div>
                    </label>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Marca</label>
                      <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Modelo</label>
                      <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Placa</label>
                      <input type="text" value={placa} onChange={(e) => setPlaca(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Año</label>
                      <input type="text" value={anio} onChange={(e) => setAnio(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Tipo</label>
                      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                        <option value="Automático">Automático</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Estado</label>
                      <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                        <option value="Automático">Disponible</option>
                        <option value="Ocupado">Ocupado</option>
                        <option value="Mantenimiento">Mantenimiento</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="accept-btn" onClick={manejarGuardarVehiculo}>{modoEdicion ? "Guardar" : "Aceptar"}</button>
              <button className="cancel-btn" onClick={cerrarFormulario}>Salir</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminar */}
      {vehiculoParaEliminar !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="eliminar-header">
              <strong>Eliminar vehículo {vehiculos[vehiculoParaEliminar]?.plate}</strong>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro que deseas eliminar este vehículo de la lista?</p>
            </div>
            <div className="modal-footer">
              <button className="accept-btn" style={{ backgroundColor:"#d9534f" }} onClick={manejarConfirmarEliminar}>Aceptar</button>
              <button className="cancel-btn" onClick={() => setVehiculoParaEliminar(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ver vehículo */}
      {vehiculoSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-ver">
            <div className="ver-titulo">Información Vehículo</div>
            <div className="ver-body fila">
              <img src={`data:image/png;base64,${vehiculoSeleccionado.photo}`} alt="Vehículo" className="ver-imagen"/>
              <div className="ver-info">
                <p><strong>Placa:</strong> {vehiculoSeleccionado.plate}</p>
                <p><strong>Modelo:</strong> {vehiculoSeleccionado.model}</p>
                <p><strong>Tipo:</strong> {vehiculoSeleccionado.type}</p>
                <p><strong>Año:</strong> {vehiculoSeleccionado.year}</p>
                <p><strong>Estado:</strong> {vehiculoSeleccionado.status}</p>
              </div>
            </div>
            <div className="ver-footer">
              <h2>{vehiculoSeleccionado.brand}</h2>
              <button className="cancel-btn" onClick={cerrarVistaVehiculo}>Salir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdministradorVehiculos;
