import React, { useState } from "react";
import logo from "../images/logo-utn.png";
import "./ListadoVehiculos.css";

const initialVehicles = [
  {
    id: 1,
    model: "Nissan Frontier",
    plate: "ACT-478",
    mode: "Automatic",
    photo:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    model: "Toyota Rush",
    plate: "BAT-123",
    mode: "Automatic",
    photo:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    model: "Toyota Hiace",
    plate: "HYA-947",
    mode: "Manual",
    photo:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
  },
];

const ListadoVehiculos = () => {
  const [vehicles] = useState(initialVehicles);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const lowerTerm = searchTerm.toLowerCase();
    return (
      vehicle.model.toLowerCase().includes(lowerTerm) ||
      vehicle.plate.toLowerCase().includes(lowerTerm) ||
      vehicle.mode.toLowerCase().includes(lowerTerm)
    );
  });

  return (
    <div className="container">
      <div className="input-group mb-4 mt-4 search-input-group">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search by model, plate or transmission"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="row">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="col-sm-12 col-md-4 col-lg-3 mb-4">
            <div className="card vehicle-card">
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
                <button className="btn btn-primary reservation-button">
                  Reservation
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListadoVehiculos;
