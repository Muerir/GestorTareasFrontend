import React from 'react';

const TareaCard = ({ tarea, onEditar, onEliminar , onVer }) => {
  const colores = {
    'pendiente': '#f44336', // rojo
    'en progreso': '#ff9800', // naranja
    'completada': '#4CAF50' // verde
  };

  return (
    <div style={{ ...styles.card, borderLeft: `8px solid ${colores[tarea.estado]}` }}>
      <h3 style={{ marginBottom: '10px' }}>{tarea.titulo}</h3>
      <p style={{ fontWeight: 'bold', color: '#fff', backgroundColor: colores[tarea.estado], padding: '5px 10px', borderRadius: '8px', display: 'inline-block' }}>
        {tarea.estado.toUpperCase()}
      </p>
      <div style={styles.acciones}>
        <span onClick={onVer} style={styles.icono}>👁</span>
        <span onClick={onEditar} style={styles.icono}>✏️</span>
        <span onClick={onEliminar} style={styles.icono}>🗑️</span>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'relative',
  },
  acciones: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    display: 'flex',
    gap: '10px',
    cursor: 'pointer'
  },
  icono: {
    fontSize: '18px',
    cursor: 'pointer'
  }
};

export default TareaCard;
