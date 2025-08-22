import React, { useState } from "react";
import axios from "axios";
import ReservationTicket from "./muestrareservaciones";
import "./reservaciones.css";

export default function Reservaciones({ onExit, boletas, setBoletas, vehiculo }) {
    const [direccion, setDireccion] = useState("");
    const [necesidad, setNecesidad] = useState("");
    const [estimate, setEstimate] = useState("2:30");
    const [comp1, setComp1] = useState("");
    const [comp2, setComp2] = useState("");
    const [comp3, setComp3] = useState("");
    const [comp4, setComp4] = useState("");
    const [file, setFile] = useState(null);
    const [showTicket, setShowTicket] = useState(false);

    // Tomamos directamente reservationHour del localStorage
    const reservationHour = localStorage.getItem("reservationHour") || "";

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        const reader = new FileReader();
        reader.onload = () => localStorage.setItem("reservationFile", reader.result);
        reader.readAsDataURL(selectedFile);
    };

    const handleSend = async () => {
        if (!direccion || !necesidad) {
            alert("Please fill in the required fields.");
            return;
        }

        const savedDate = JSON.parse(localStorage.getItem("reservationDate")) || {};
        const selectedVehicle = JSON.parse(localStorage.getItem("selectedVehicle")) || {};
        const loggedUserId = localStorage.getItem("loggedUserId") || "Invitado";
        const loggedUserName = localStorage.getItem("loggedUserName") || "Invitado";

        const reservationData = {
            applicant: selectedVehicle?.applicant || loggedUserName,
            userId: loggedUserId,
            direccion,
            necesidad,
            start_date: reservationHour, // <-- usamos reservationHour
            estimate,
            companions: [comp1, comp2, comp3, comp4].filter(c => c),
            day: savedDate.day,
            month: savedDate.month,
            year: savedDate.year,
            plate: selectedVehicle?.plate || "-",
            model: selectedVehicle?.model || "-",
            fileName: file ? file.name : null,
            status: "pending"
        };

        localStorage.setItem("reservationData", JSON.stringify(reservationData));

        const newBoleta = {
            id: Date.now(),
            codigo: `B-${Date.now()}`,
            vehiculo: selectedVehicle?.model || "No asignado",
            marca: selectedVehicle?.marca || "No asignado",
            fecha: `${savedDate.day}/${savedDate.month}/${savedDate.year}`,
            estado: "pendientes",
            resultado: null,
            ...reservationData
        };
        setBoletas(prev => [...prev, newBoleta]);
        setShowTicket(true);

        try {
            const response = await axios.post("http://127.0.0.1:8000/rental_request/", reservationData);
            console.log("Reserva enviada:", response.data);
        } catch (error) {
            console.error("Error sending reservation:", error);
        }
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
                        <input type="text" value={reservationHour} disabled />
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
                                    value={{1: comp1, 2: comp2, 3: comp3, 4: comp4}[i]}
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
