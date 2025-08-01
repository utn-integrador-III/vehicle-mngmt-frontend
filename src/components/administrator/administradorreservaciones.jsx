import React from 'react';
import './administradorreservaciones.css';

const ReservationTicket = () => {
  return (
    <div className="ticket-container">

      <main className="ticket-content">
        <h2>Reservation ticket information</h2>
        <p className="date">Reservation date: 2025-08-17</p>

        <div className="ticket-card">
          <div className="ticket-row">
            <div className="ticket-field">
              <label>Applicant</label>
              <div className="value">Mario Araya</div>
            </div>
            <div className="ticket-field">
              <label>Vehicle plate</label>
              <div className="value">ABC34</div>
            </div>
            <div className="ticket-field">
              <label>Vehicle Brand</label>
              <div className="value">Toyota</div>
            </div>
          </div>

          <div className="ticket-row">
            <div className="ticket-field">
              <label>Vehicle address</label>
              <div className="value">10th Street, Central Avenue</div>
            </div>
            <div className="ticket-field">
              <label>Trip estimate</label>
              <div className="value">2 hrs with 30 minutes</div>
            </div>
            <div className="ticket-field">
              <label>Need for service</label>
              <div className="value">Transfer to meeting</div>
            </div>
          </div>

          <div className="ticket-row">
            <div className="ticket-field">
              <label>Date of service</label>
              <div className="value">2025-08-17</div>
            </div>
            <div className="ticket-field">
              <label>Vehicle departure time</label>
              <div className="value">16:00 🕓</div>
            </div>
            <div className="ticket-field">
              <label>Vehicle delivery time</label>
              <div className="value">18:30 🕡</div>
            </div>
            <div className="ticket-field">
              <label>Status</label>
              <div className="status accepted">Accepted</div>
            </div>
          </div>

          <div className="ticket-row companions">
            <div className="ticket-field">
              <label>Companions</label>
              <ul className="companion-list">
                <li>Mauro López</li>
                <li>Angie Vasquéz</li>
              </ul>
            </div>
          </div>

          <div className="ticket-buttons">
            <button className="btn-view">View pdf</button>
            <button className="btn-exit">Exit</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReservationTicket;