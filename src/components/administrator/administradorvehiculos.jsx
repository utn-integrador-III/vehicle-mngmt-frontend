import React, { useState } from "react";
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

  const [busqueda, setBusqueda] = useState("");

  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null); 

  const abrirFormulario = () => {
    setMostrarFormulario(true);
    setModoEdicion(false);
    limpiarFormulario();
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    limpiarFormulario();
  };

  const cerrarVistaVehiculo = () => { 
    setVehiculoSeleccionado(null);
  };

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
      lector.onloadend = () => {
        setImagenSeleccionada(lector.result);
      };
      lector.readAsDataURL(archivo);
    }
  };

  const manejarGuardarVehiculo = () => {
    const nuevoVehiculo = {
      imagen: imagenSeleccionada,
      marca,
      modelo,
      anio,
      placa,
      tipo,
      estado,
    };

    if (modoEdicion && vehiculoEditando !== null) {
      const nuevosVehiculos = [...vehiculos];
      nuevosVehiculos[vehiculoEditando] = nuevoVehiculo;
      setVehiculos(nuevosVehiculos);
    } else {
      setVehiculos([...vehiculos, nuevoVehiculo]);
    }

    cerrarFormulario();
  };

  const manejarEditarVehiculo = (index) => {
    const vehiculo = vehiculos[index];
    setMarca(vehiculo.marca);
    setModelo(vehiculo.modelo);
    setAnio(vehiculo.anio);
    setPlaca(vehiculo.placa);
    setImagenSeleccionada(vehiculo.imagen);
    setTipo(vehiculo.tipo || "Automático");
    setEstado(vehiculo.estado || "Disponible");
    setVehiculoEditando(index);
    setModoEdicion(true);
    setMostrarFormulario(true);
  };

  const manejarConfirmarEliminar = () => {
    if (vehiculoParaEliminar !== null) {
      const nuevosVehiculos = vehiculos.filter((_, i) => i !== vehiculoParaEliminar);
      setVehiculos(nuevosVehiculos);
      setVehiculoParaEliminar(null);
    }
  };

  const vehiculosFiltrados = vehiculos.filter((vehiculo) =>
  `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.placa}`
    .toLowerCase()
    .includes(busqueda.toLowerCase())
);


  return (
    <div className="vehiculos-container">
      <div className="titulo-seccion">Vehículos disponibles</div>

      <div className="top-bar">
        <button className="add-button" onClick={abrirFormulario}>
          + Agregar Vehículo
        </button>
        <input
  type="text"
  className="search-input"
  placeholder="Buscar vehículo..."
  value={busqueda}
  onChange={(e) => setBusqueda(e.target.value)}
    />
      </div>

      <div className="vehiculo-lista">
        {vehiculosFiltrados.map((vehiculo, index) => (
          <div key={index} className="vehiculo-card">
            <div className="vehiculo-img">
              <img src={vehiculo.imagen} alt="Vehículo" />
            </div>
            <div className="vehiculo-info">
              <h3>{vehiculo.marca}</h3>
              <p>{vehiculo.modelo} - {vehiculo.anio}</p>
              <p>Placa: {vehiculo.placa}</p>
              <div className="vehiculo-botones">
                <button onClick={() => setVehiculoSeleccionado(vehiculo)}>Ver Vehículo</button>
                <button onClick={() => manejarEditarVehiculo(index)}>Editar</button>
                <button onClick={() => setVehiculoParaEliminar(index)}>Borrar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      
      {mostrarFormulario && !modoEdicion && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">Agregar Vehículo</div>

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Foto del vehículo</label>
                  <label className="upload-label">
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={manejarCargaImagen}
                      hidden
                    />
                    <div className="upload-btn-with-icon">
                      <img
                        src="src/images/carpeta.png"
                        alt="icono adjuntar"
                        className="icono-adjuntar"
                      />
                      Adjuntar PNG
                    </div>
                  </label>
                </div>

                <div className="form-group">
                  <label>Marca</label>
                  <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Placa</label>
                  <input type="text" value={placa} onChange={(e) => setPlaca(e.target.value)} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Modelo</label>
                  <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Año</label>
                  <input type="text" value={anio} onChange={(e) => setAnio(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="accept-btn" onClick={manejarGuardarVehiculo}>Aceptar</button>
              <button className="cancel-btn" onClick={cerrarFormulario}>Salir</button>
            </div>
          </div>
        </div>
      )}

      {mostrarFormulario && modoEdicion && (
        <div className="modal-overlay">
          <div className="modal-content editar-form">
            <div className="modal-header">Editar Vehículo</div>
            <div className="modal-body editar-body">
              <div className="editar-imagen">
                {imagenSeleccionada && (
                  <img src={imagenSeleccionada} alt="Vista previa" />
                )}
                <label className="upload-label" style={{ marginTop: "10px" }}>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={manejarCargaImagen}
                    hidden
                  />
                  <div className="upload-btn-editar">
                    <img
                      src="src/images/carpeta2.png"
                      alt="icono adjuntar"
                      className="icono-adjuntar"
                    />
                    Adjuntar PNG
                  </div>
                </label>

                <div className="form-group" style={{ marginTop: "12px", width: "100%" }}>
                  <label>Año:</label>
                  <input
                    type="text"
                    value={anio}
                    onChange={(e) => setAnio(e.target.value)}
                    style={{ maxWidth: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }}
                  />
                </div>
              </div>

              <div className="editar-campos">
                <div className="form-group">
                  <label>Placa:</label>
                  <input type="text" value={placa} onChange={(e) => setPlaca(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Modelo:</label>
                  <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Tipo:</label>
                  <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option value="Automático">Automático</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado:</label>
                  <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="accept-btn" onClick={manejarGuardarVehiculo}>Guardar</button>
              <button className="cancel-btn" onClick={cerrarFormulario}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {vehiculoParaEliminar !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
          <div className="eliminar-header">
  <strong>Eliminar vehículo {vehiculos[vehiculoParaEliminar]?.placa}</strong>
</div>
            <div className="modal-body">
              <p>¿Estás seguro que deseas eliminar este vehículo de la lista?</p>
            </div>
            <div className="modal-footer">
              <button
                style={{
                  backgroundColor: "#d9534f",
                  color: "white",
                  border: "none",
                  padding: "8px 20px",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={manejarConfirmarEliminar}
              >
                Aceptar
              </button>
              <button className="cancel-btn" onClick={() => setVehiculoParaEliminar(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {vehiculoSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-ver">
            <div className="ver-titulo">Información Vehículo</div>
            <div className="ver-body fila">
              <img
                src={vehiculoSeleccionado.imagen}
                alt="Vehículo"
                className="ver-imagen"
              />
              <div className="ver-info">
                <p><strong>Placa:</strong> {vehiculoSeleccionado.placa}</p>
                <p><strong>Modelo:</strong> {vehiculoSeleccionado.modelo}</p>
                <p><strong>Tipo:</strong> {vehiculoSeleccionado.tipo}</p>
                <p><strong>Año:</strong> {vehiculoSeleccionado.anio}</p>
                <p><strong>Estado:</strong> {vehiculoSeleccionado.estado}</p>
              </div>
            </div>
            <div className="ver-footer">
              <h2>{vehiculoSeleccionado.marca}</h2>
              <button className="cancel-btn" onClick={cerrarVistaVehiculo}>Salir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdministradorVehiculos;
