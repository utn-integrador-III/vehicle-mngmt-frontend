import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import logo from "../../images/logo-utn.png";
import "./ListadoVehiculos.css";

const ListadoVehiculos = ({ onReservarClick }) => {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  // === Traer vehículos desde backend ===
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("http://localhost:8000/car"); // misma URL que funciona
        if (response.data && response.data.data) {
          const formattedVehicles = response.data.data.map((vehicle) => ({
            id: vehicle.id,
            model: vehicle.model,
            plate: vehicle.plate,
            mode: vehicle.type === "Automático" ? "Automatic" : "Manual",
            photo: `data:image/png;base64,${vehicle.photo}`,
          }));
          setVehicles(formattedVehicles);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };
    fetchVehicles();
  }, []);

  // === Manejo touch carousel ===
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (diff > 50 && currentIndex < filteredVehicles.length - 3) {
      setCurrentIndex((prev) => Math.min(prev + 1, filteredVehicles.length - 3));
    } else if (diff < -50 && currentIndex > 0) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  // === Manejo búsqueda ===
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentIndex(0);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const lowerTerm = searchTerm.toLowerCase();
    return (
      vehicle.model.toLowerCase().includes(lowerTerm) ||
      vehicle.plate.toLowerCase().includes(lowerTerm) ||
      vehicle.mode.toLowerCase().includes(lowerTerm)
    );
  });

  const visibleVehicles = filteredVehicles.slice(currentIndex, currentIndex + 3);

  // === Navegación carousel ===
  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, filteredVehicles.length - 3)
    );
  };

  return (
    <div className="container text-center">
      <div className="input-group mb-4 mt-4 search-input-group">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search by model, plate or transmission"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="carousel-wrapper">
        <button
          className="nav-arrow left"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          &lt;
        </button>

        <div
          className="carousel"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {visibleVehicles.map((vehicle, idx) => {
            const isCenter = idx === 1;
            return (
              <div
                key={vehicle.id}
                className={`vehicle-card ${isCenter ? "center-card" : "side-card"}`}
              >
                <div className="image-container">
                  <img
                    src={vehicle.photo}
                    alt={vehicle.model}
                    className="vehicle-photo card-img-top"
                  />
                  <div className="logo-overlay">
                    <img src={logo} alt="Logo UTN" className="logo-utn" />
                  </div>
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title vehicle-title">{vehicle.model}</h5>
                  <div className="vehicle-info">
                    <span>{vehicle.plate}</span>
                    <span>{vehicle.mode}</span>
                  </div>
                  <button
                    className="btn btn-primary reservation-button"
                    onClick={() => onReservarClick(vehicle.id)}
                  >
                    Reservación
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="nav-arrow right"
          onClick={handleNext}
          disabled={currentIndex >= filteredVehicles.length - 3}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default ListadoVehiculos;
