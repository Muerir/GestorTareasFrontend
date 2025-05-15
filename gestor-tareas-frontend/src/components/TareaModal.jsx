import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TareaModal = ({ tarea, onClose, onRefresh, modoVer = false }) => {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaLimite, setFechaLimite] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        if (tarea) {
            setTitulo(tarea.titulo);
            setDescripcion(tarea.descripcion || '');
            setFechaLimite(tarea.fechaLimite?.split('T')[0] || '');
        } else {
            setTitulo('');
            setDescripcion('');
            setFechaLimite('');
        }
        setMensaje('');
    }, [tarea]);

    const token = localStorage.getItem('token');

    const handleGuardar = async () => {
        try {
            if (!titulo.trim()) {
                return setMensaje('El título es obligatorio');
            }

            if (tarea) {
                // EDITAR
                if (tarea.estado === 'completada') {
                    return setMensaje('No se puede editar una tarea completada');
                }

                const nuevaTarea = {
                    titulo,
                    descripcion,
                    fechaLimite: fechaLimite === '' ? null : fechaLimite
                };

                // Si la tarea es pendiente, podemos avanzar a "en progreso"
                if (tarea.estado === 'pendiente') {
                    nuevaTarea.estado = 'en progreso';
                }

                await axios.put(`https://gestortareasbackend.onrender.com/api/tareas/${tarea.id}`, nuevaTarea, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // CREAR NUEVA
                await axios.post('https://gestortareasbackend.onrender.com/api/tareas', {
                    titulo,
                    descripcion,
                    fechaLimite: fechaLimite === '' ? null : fechaLimite
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            onRefresh();
            onClose();
        } catch (err) {
            setMensaje(err.response?.data?.mensaje || 'Error al guardar');
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h3 style={{ marginTop: 0 }}>
                    {modoVer ? 'Ver Tarea' : (tarea ? 'Editar Tarea' : 'Crear Tarea')}
                </h3>
                <label>Título:</label>
                <input
                    type="text"
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    disabled={modoVer}
                    style={styles.input}
                />
                <label>Descripción:</label>
                <textarea
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    disabled={modoVer}
                    style={styles.textarea}
                />
                <label>Fecha límite:</label>
                <input
                    type="date"
                    value={fechaLimite}
                    onChange={(e) => setFechaLimite(e.target.value)}
                    disabled={modoVer}
                    style={styles.input}
                />
                {mensaje && <p style={{ color: 'red', marginTop: '10px' }}>{mensaje}</p>}
                <div style={{ marginTop: '15px' }}>
                    {!modoVer && (
                        <div style={{ marginTop: '15px' }}>
                            <button onClick={handleGuardar} style={styles.button}>Guardar</button>
                            <button onClick={onClose} style={{ ...styles.button, backgroundColor: '#aaa' }}>Cancelar</button>
                        </div>
                    )}
                    {modoVer && (
                        <div style={{ marginTop: '15px' }}>
                            {tarea && tarea.estado === 'en progreso' && (
                                <button
                                    onClick={async () => {
                                        try {
                                            await axios.put(`https://gestortareasbackend.onrender.com/api/tareas/${tarea.id}`, {
                                                titulo,
                                                descripcion,
                                                fechaLimite,
                                                estado: 'completada'
                                            }, {
                                                headers: { Authorization: `Bearer ${token}` }
                                            });
                                            onRefresh();
                                            onClose();
                                        } catch (err) {
                                            setMensaje(err.response?.data?.mensaje || 'Error al completar tarea');
                                        }
                                    }}
                                    style={{ ...styles.button, backgroundColor: '#4CAF50' }}
                                >
                                    Completar Tarea
                                </button>
                            )}
                            <button onClick={onClose} style={{ ...styles.button, backgroundColor: '#aaa' }}>Cerrar</button>
                        </div>
                    )}
                    {!modoVer && tarea && tarea.estado === 'en progreso' && (
                        <button
                            onClick={async () => {
                                try {
                                    await axios.put(`https://gestortareasbackend.onrender.com/api/tareas/${tarea.id}`, {
                                        titulo,
                                        descripcion,
                                        fechaLimite,
                                        estado: 'completada'
                                    }, {
                                        headers: { Authorization: `Bearer ${token}` }
                                    });
                                    onRefresh();
                                    onClose();
                                } catch (err) {
                                    setMensaje(err.response?.data?.mensaje || 'Error al completar tarea');
                                }
                            }}
                            style={{ ...styles.button, backgroundColor: '#4CAF50' }}
                        >
                            Completar Tarea
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        animation: 'fadeIn 0.3s ease-in-out'
    },
    modal: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '15px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    },
    input: {
        display: 'block',
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '16px',
    },
    textarea: {
        display: 'block',
        width: '100%',
        padding: '10px',
        minHeight: '80px',
        margin: '10px 0',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '16px',
        resize: 'vertical'
    },
    button: {
        padding: '10px 20px',
        margin: '5px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#4CAF50',
        color: '#fff',
        cursor: 'pointer'
    }
};

export default TareaModal;
