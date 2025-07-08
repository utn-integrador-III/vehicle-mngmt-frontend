import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup } from "react-bootstrap";
import logo from "../images/logo-utn.png";

const initialVehicles = [
  {
    id: 1,
    model: "Nissan Frontier",
    plate: "ACT-478",
    mode: "Automatic",
    photo: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    model: "Toyota Rush",
    plate: "BAT-123",
    mode: "Automatic",
    photo: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    model: "Toyota Hiace",
    plate: "HYA-947",
    mode: "Manual",
    photo: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
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
    <Container>
      <InputGroup className="mb-4 mt-4">
        <Form.Control
          placeholder="Search by model, plate or transmission"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            borderRadius: "50px",
            padding: "12px 24px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        />
      </InputGroup>
      <Row>
        {filteredVehicles.map((vehicle) => (
          <Col key={vehicle.id} sm={12} md={4} lg={3} className="mb-4">
            <Card style={{ border: "none", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
              <div style={{ position: "relative", textAlign: "center" }}>
                <img
                  src={vehicle.photo}
                  alt={vehicle.model}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "rgba(255,255,255,0.8)",
                    borderRadius: "8px",
                    padding: "4px",
                  }}
                >
                  <img src={logo} alt="Logo UTN" style={{ width: "30px" }} />
                </div>
              </div>
              <Card.Body className="text-center" style={{ paddingTop: "0" }}>
                <Card.Title style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "12px" }}>
                  {vehicle.model}
                </Card.Title>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: "#f0f0f0",
                    padding: "6px 12px",
                    borderRadius: "5px",
                    marginBottom: "12px",
                  }}
                >
                  <span>{vehicle.plate}</span>
                  <span>{vehicle.mode}</span>
                </div>
                <Button
                  variant="primary"
                  style={{
                    backgroundColor: "#003366",
                    border: "none",
                    width: "100%",
                    borderRadius: "20px",
                  }}
                >
                  Reservation
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ListadoVehiculos;
