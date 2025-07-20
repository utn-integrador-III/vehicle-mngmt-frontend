import React, { useState } from "react";
import logo from "../../images/logo-utn.png";
import "./ListadoVehiculos.css";

const initialVehicles = [
  {
    id: 1,
    model: "Nissan Frontier",
    plate: "ACT-478",
    mode: "Automatic",
    photo:
      "https://www.nissanautoferro.com/wp-content/uploads/2022/05/nueva-frontier-s-4x2-mt-1.png",
  },
  {
    id: 2,
    model: "Toyota Rush",
    plate: "BAT-123",
    mode: "Automatic",
    photo:
      "https://www.toyotacr.com/uploads/family/7174cd099fd106eb448a2256c99809509d96903d.png",
  },
  {
    id: 3,
    model: "Toyota Hiace",
    plate: "HYA-947",
    mode: "Manual",
    photo:
      "https://cdn-api.toyotacr.com/toyotacr_website/media/cache/hero_bg_small/uploads/model/8b85d9a3743860e529c0fd0c3adc1b965e4f4938.png",
  },
  {
    id: 4,
    model: "Tesla Model S",
    plate: "AJD-834",
    mode: "Automatic",
    photo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo4TMPCIgoeW1tQvN0A8K5F4_D9kqxYWx4fw&s",
  },
  {
    id: 5,
    model: "Chevrolet Groove",
    plate: "LMN-794",
    mode: "Automatic",
    photo:
      "https://www.inalcochevrolet.cl/content/dam/chevrolet/sa/cl/es/master/index/models/groove/2-colorizer/GGB.png?imwidth=1920",
  },
  {
    id: 6,
    model: "Kia Sportage",
    plate: "XYZ-991",
    mode: "Manual",
    photo:
      "https://www.kia.com/content/dam/kwcms/kme/global/en/assets/vehicles/kia-sportage-nq5-my22/discover/kia-sportage-ice-gls-my22-trimlist.png",
  },
  {
    id: 7,
    model: "Hyundai Tucson",
    plate: "TUC-555",
    mode: "Automatic",
    photo:
      "https://www.hyundaicr.com/images/modelos/nuevotucson/360/Teal/Teal_6.webp",
  },
];

const ListadoVehiculos = ({ onReservarClick }) => {
  const [vehicles] = useState(initialVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

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

        <div className="carousel">
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
                    onClick={onReservarClick}
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
