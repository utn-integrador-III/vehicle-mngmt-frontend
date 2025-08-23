import React, { useState } from 'react';
import axios from 'axios';
import './estadoboleta.css';

const EstadoBoleta = ({ boleta, setBoletas, setActiveTab }) => {
  // Mapear estado del backend al status visual local
  const mapToLocalStatus = (b) => {
    if (!b) return 'pending';
    switch (b.status) {
      case 'pending':
        return 'pending';
      case 'in-progress':
        return 'accepted';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  const [status, setStatus] = useState(mapToLocalStatus(boleta));
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState(boleta?.motivo || '');

  const getStatusInfo = () => {
    switch (status) {
      case 'accepted': return { text: 'Aceptada', className: 'accepted' };
      case 'rejected': return { text: 'Rechazada', className: 'rejected' };
      case 'cancelled': return { text: 'Cancelada', className: 'rejected' };
      default: return { text: 'Pendiente', className: 'pending' };
    }
  };

  const { text: statusText, className: statusClass } = getStatusInfo();

  // Función para actualizar el status en la API
  const updateStatusAPI = async (newStatus, extraData = {}) => {
    try {
      const payload = { status: newStatus, ...extraData };
      const response = await axios.put(
        `http://127.0.0.1:8000/rental_requestId/${boleta._id}`,
        payload
      );

      if (response.data) {
        setStatus(newStatus);
        setBoletas(prev =>
          prev.map(b =>
            b._id === boleta._id
              ? {
                  ...b,
                  status: newStatus,
                  estado: newStatus === 'in-progress' ? 'en-progreso' : 'canceladas',
                  estadoDetalle: newStatus === 'in-progress' ? 'Aceptada' : 'Cancelada',
                  motivo: extraData.motivo || ''
                }
              : b
          )
        );

        if (newStatus === 'in-progress' || newStatus === 'cancelled') {
          setActiveTab('boletas');
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Ocurrió un error al actualizar la boleta.');
    }
  };

  // Aprobar boleta
  const handleAccept = () => {
    updateStatusAPI('in-progress');
  };

  // Rechazar boleta con motivo
  const handleConfirmReject = () => {
    if (reason.trim() === '') {
      alert('Debe ingresar una razón de rechazo.');
      return;
    }
    setShowRejectModal(false);
    updateStatusAPI('cancelled', { motivo: reason });
  };

  const handleCancelAccepted = () => {
    updateStatusAPI('cancelled');
  };

  return (
    <>
      <div className={`ticket-container ${showRejectModal ? 'blurred' : ''}`}>
        <main className="ticket-content">
          <h2>Reservation ticket information</h2>
          <p className="date">Reservation date: {boleta?.fecha}</p>

          <div className="ticket-card">
            {/* Datos */}
            <div className="ticket-row">
              <div className="ticket-field">
                <label>Applicant</label>
                <div className="value">{boleta?.nombre}</div>
              </div>
              <div className="ticket-field">
                <label>Vehicle plate</label>
                <div className="value">{boleta?.codigo}</div>
              </div>
              <div className="ticket-field">
                <label>Vehicle Brand</label>
                <div className="value">{boleta?.marca}</div>
              </div>
            </div>

            <div className="ticket-row">
              <div className="ticket-field">
                <label>Vehicle address</label>
                <div className="value">{boleta?.direccion}</div>
              </div>
              <div className="ticket-field">
                <label>Trip estimate</label>
                <div className="value">{boleta?.estimate}</div>
              </div>
              <div className="ticket-field">
                <label>Need for service</label>
                <div className="value">{boleta?.necesidad}</div>
              </div>
              <div className="ticket-field">
                <label>Date of service</label>
                <div className="value">{boleta?.fecha}</div>
              </div>
              <div className="ticket-field">
                <label>Vehicle departure time</label>
                <div className="value">{boleta?.departureTime}</div>
              </div>
              <div className="ticket-field">
                <label>Vehicle delivery time</label>
                <div className="value">{boleta?.endTime || 'Pendiente'}</div>
              </div>
            </div>

            {/* Estado */}
            <div className="ticket-row">
              <div className="ticket-field" style={{ width: '100%' }}>
                <label>Status</label>
                <div className={`status ${statusClass}`}>
                  {statusText}
                  {status === 'rejected' && reason && (
                    <button
                      className="note-icon-btn"
                      onClick={() => setShowReasonModal(true)}
                      title="Ver razón del rechazo"
                      aria-label="Ver razón del rechazo"
                      type="button"
                    >
                      📝
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Compañeros */}
            <div className="ticket-row">
              <div className="ticket-field" style={{ width: '100%' }}>
                <label>Companions</label>
                <div className="companions-full">
                  <ul>
                    {boleta?.companions?.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            {/* Botones según estado */}
            <div className="ticket-buttons" style={{ justifyContent: 'center', gap: '10px' }}>
              {status === 'pending' && (
                <>
                  <button className="btn-approve" onClick={handleAccept}>Aprobar</button>
                  <button className="btn-reject" onClick={() => setShowRejectModal(true)}>Rechazar</button>
                </>
              )}

              {status === 'accepted' && (
                <>
                  <button
                    onClick={handleCancelAccepted}
                    style={{
                      backgroundColor: '#002B6E',
                      color: '#fff',
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Cancelada
                  </button>
                  <button
                    onClick={() => setActiveTab('boletas')}
                    style={{
                      backgroundColor: '#d9d9d9',
                      color: '#002B6E',
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Regresar
                  </button>
                </>
              )}

              {status === 'cancelled' && (
                <button
                  onClick={() => setActiveTab('boletas')}
                  style={{
                    backgroundColor: '#d9d9d9',
                    color: '#002B6E',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Regresar
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal Rechazar */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 style={{ textAlign: 'center' }}>Rechazo ❌</h3>
            <p><strong>Vehicle Plate:</strong> {boleta?.codigo}</p>
            <p><strong>Applicant:</strong> {boleta?.nombre}</p>
            <p><strong>Date of service:</strong> {boleta?.fecha}</p>
            <p><strong>Vehicle Brand:</strong> {boleta?.marca}</p>

            <label>Reason for rejection:</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason..."
            />

            <div className="modal-buttons">
              <button onClick={() => setShowRejectModal(false)}>Back</button>
              <button onClick={handleConfirmReject}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Razón */}
      {showReasonModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Rejection Reason</h3>
            <p>{reason}</p>
            <div className="modal-buttons">
              <button onClick={() => setShowReasonModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EstadoBoleta;
