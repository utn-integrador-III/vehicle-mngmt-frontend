import React, { useState } from "react";
import ReservationTicket from "./muestrareservaciones";
import "./reservaciones.css";
import Vehicle from "./listaVehiculos";

export default function Reservaciones() {
  const [direccion, setDireccion] = useState("");
  const [necesidad, setNecesidad] = useState("");
  const [departureTime] = useState("16:00");
  const [arrivalTime] = useState("18:30");
  const [estimate, setEstimate] = useState("2:30");
  const [comp1, setComp1] = useState("");
  const [comp2, setComp2] = useState("");
  const [comp3, setComp3] = useState("");
  const [comp4, setComp4] = useState("");
  const [file, setFile] = useState(null);
  const [showTicket, setShowTicket] = useState(false);
    const [showlistado, setShowlistado] = useState(false); 

    if (showlistado) {
      return <Vehicle />;
    }

  const handleFile = (e) => setFile(e.target.files[0]);
  const handleSend = () => {
    setShowTicket(true);
  };

  if (showTicket) {
    return <ReservationTicket />;
  }

  return (
    <div className="res-container">
      <h2 className="res-title">Vehicle reservation ticket</h2>
      <p className="res-date">Reservation date: 2025-08-17</p>

      <div className="res-card">
        <div className="res-col">
          <div className="res-group">
            <label>Direction of travel</label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </div>
          <div className="res-group">
            <label>Departure time</label>
            <input type="text" value={departureTime} disabled />
          </div>
          <div className="res-group">
            <label>Arrival time</label>
            <input type="text" value={arrivalTime} disabled />
          </div>
          <div className="res-group">
            <label>Attach PDF</label>
            <button
              className="file-btn"
              onClick={() => document.getElementById("pdf-input").click()}
            >
              Select file
            </button>
            <input
              id="pdf-input"
              type="file"
              accept="application/pdf"
              onChange={handleFile}
              hidden
            />
          </div>
        </div>

        <div className="res-col">
          <div className="res-group">
            <label>Need for service</label>
            <input
              type="text"
              value={necesidad}
              onChange={(e) => setNecesidad(e.target.value)}
            />
          </div>
          <div className="res-group">
            <label>Estimated travel time</label>
            <input
              type="text"
              value={estimate}
              onChange={(e) => setEstimate(e.target.value)}
            />
          </div>
          <div className="companions">
            <div className="res-group">
              <label>Companion 1</label>
              <input
                type="text"
                value={comp1}
                onChange={(e) => setComp1(e.target.value)}
              />
            </div>
            <div className="res-group">
              <label>Companion 2</label>
              <input
                type="text"
                value={comp2}
                onChange={(e) => setComp2(e.target.value)}
              />
            </div>
            <div className="res-group">
              <label>Companion 3</label>
              <input
                type="text"
                value={comp3}
                onChange={(e) => setComp3(e.target.value)}
              />
            </div>
            <div className="res-group">
              <label>Companion 4</label>
              <input
                type="text"
                value={comp4}
                onChange={(e) => setComp4(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="res-footer">
        <button className="send-btn" onClick={handleSend}>
          Send
        </button>
        <button className="exit-btn" onClick={() => setShowlistado(true)}>
          Exit
        </button>
      </div>
    </div>
  );
}