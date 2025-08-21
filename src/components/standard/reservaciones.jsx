import React, { useState } from "react";
import ReservationTicket from "./muestrareservaciones";
import "./reservaciones.css";

export default function Reservaciones({ onExit, boletas, setBoletas, vehiculo }) {
  const [direccion, setDireccion] = useState("");
  const [necesidad, setNecesidad] = useState("");
  const [departureTime, setDepartureTime] = useState(localStorage.getItem("reservationHour") || "");
  const [estimate, setEstimate] = useState("2:30");
  const [comp1, setComp1] = useState("");
  const [comp2, setComp2] = useState("");
  const [comp3, setComp3] = useState("");
  const [comp4, setComp4] = useState("");
  const [file, setFile] = useState(null);
  const [showTicket, setShowTicket] = useState(false);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => localStorage.setItem("reservationFile", reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleSend = () => {
    if (!direccion || !necesidad) {
      alert("Please fill in the required fields.");
      return;
    }

    const savedDate = JSON.parse(localStorage.getItem("reservationDate")) || {};

    const reservationData = {
      direccion,
      necesidad,
      departureTime,
      estimate,
      comp1,
      comp2,
      comp3,
      comp4,
      day: savedDate.day,
      month: savedDate.month,
      year: savedDate.year,
      fileName: file ? file.name : null
    };

    // Guardar los datos de la reservación en localStorage
    localStorage.setItem("reservationData", JSON.stringify(reservationData));

    // Guardar los datos del vehículo seleccionado en localStorage
    if (vehiculo) {
      const vehicleData = {
        applicant: vehiculo.applicant || "Invitado",
        plate: vehiculo.plate || "-",
        brand: vehiculo.marca || "-"
      };
      localStorage.setItem("reservationVehicleData", JSON.stringify(vehicleData));
    }

    // Guardar boleta en el estado global
    const newBoleta = {
      id: Date.now(),
      codigo: `B-${Date.now()}`,
      vehiculo: vehiculo?.nombre || "No asignado",
      marca: vehiculo?.marca || "No asignado",
      fecha: `${savedDate.day}/${savedDate.month}/${savedDate.year}`,
      estado: "pendientes",
      resultado: null,
      ...reservationData
    };

    setBoletas(prev => [...prev, newBoleta]);
    setShowTicket(true);
  };

  const handleExit = () => {
    if (onExit) onExit();
  };

  if (showTicket) return <ReservationTicket onExit={onExit} />;

  return (
    <div className="res-container">
      <h2 className="res-title">Vehicle reservation ticket</h2>

      <div className="res-card">
        <div className="res-col">
          <div className="res-group">
            <label>Direction of travel</label>
            <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
          </div>
          <div className="res-group">
            <label>Departure time</label>
            <input type="text" value={departureTime} disabled />
          </div>
          <div className="res-group">
            <label>Attach PDF</label>
            <button className="file-btn" onClick={() => document.getElementById("pdf-input").click()}>Select file</button>
            <input id="pdf-input" type="file" accept="application/pdf" onChange={handleFile} hidden />
          </div>
        </div>

        <div className="res-col">
          <div className="res-group">
            <label>Need for service</label>
            <input type="text" value={necesidad} onChange={(e) => setNecesidad(e.target.value)} />
          </div>
          <div className="res-group">
            <label>Estimated travel time</label>
            <input type="text" value={estimate} onChange={(e) => setEstimate(e.target.value)} />
          </div>
          <div className="companions">
            {[1,2,3,4].map((i) => (
              <div className="res-group" key={i}>
                <label>Companion {i}</label>
                <input
                  type="text"
                  value={{1:comp1,2:comp2,3:comp3,4:comp4}[i]}
                  onChange={(e) => {
                    if(i===1) setComp1(e.target.value);
                    if(i===2) setComp2(e.target.value);
                    if(i===3) setComp3(e.target.value);
                    if(i===4) setComp4(e.target.value);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="res-footer">
        <button className="send-btn" onClick={handleSend}>Send</button>
        <button className="exit-btn" onClick={handleExit}>Exit</button>
      </div>
    </div>
  );
}
