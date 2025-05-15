import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TareaCard from '../components/TareaCard';
import TareaModal from '../components/TareaModal';

const Dashboard = () => {
    const [tareas, setTareas] = useState([]);
    const [filtros, setFiltros] = useState({ estado: '', busqueda: '', desde: '', hasta: '' });
    const [modalAbierto, setModalAbierto] = useState(false);
    const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
    const [modoVer, setModoVer] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            window.location.href = '/';
        } else {
            obtenerTareas();
        }
    }, []);

    const obtenerTareas = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/tareas', {
                headers: { Authorization: `Bearer ${token}` },
                params: filtros
            });
            setTareas(res.data);
        } catch (err) {
            console.error('Error al obtener tareas', err);
        }
    };

    const eliminarTarea = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tareas/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            obtenerTareas();
        } catch (err) {
            alert(err.response?.data?.mensaje || 'No se pudo eliminar la tarea');
        }
    };

    const abrirModal = (tarea = null) => {
        setTareaSeleccionada(tarea);
        setModoVer(false);
        setModalAbierto(true);
    };

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const abrirModalVer = async (tarea) => {
        if (tarea.estado === 'pendiente') {
            try {
                await axios.put(`http://localhost:5000/api/tareas/${tarea.id}`, {
                    titulo: tarea.titulo,
                    descripcion: tarea.descripcion,
                    fechaLimite: tarea.fechaLimite,
                    estado: 'en progreso'
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                tarea.estado = 'en progreso'; // actualizar local para reflejar en UI
            } catch (err) {
                console.error('No se pudo actualizar a en progreso', err);
            }
        }

        setTareaSeleccionada(tarea);
        setModoVer(true);
        setModalAbierto(true);
    };

    return (
        <div style={{ padding: '20px', background: '#f4f4f4', minHeight: '100vh' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={cerrarSesion} style={styles.botonLogout}>Cerrar sesión</button>
                <button onClick={() => abrirModal()} style={styles.botonCrear}>+ Crear Tarea</button>
                <div style={styles.filtros}>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={filtros.busqueda}
                        onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                        style={styles.input}
                    />
                    <select
                        value={filtros.estado}
                        onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                        style={styles.input}
                    >
                        <option value="">Estado</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="en progreso">En Progreso</option>
                        <option value="completada">Completada</option>
                    </select>
                    <label>Desde:</label>
                    <input
                        type="date"
                        value={filtros.fechaInicio}
                        onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })}
                        style={styles.input}
                    />
                    <label>Hasta:</label>
                    <input
                        type="date"
                        value={filtros.fechaFin}
                        onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })}
                        style={styles.input}
                    />
                    <button onClick={obtenerTareas} style={styles.botonBuscar}>Buscar</button>
                </div>
            </div>

            <div style={styles.grid}>
                {tareas.map((tarea) => (
                    <TareaCard
                        key={tarea.id}
                        tarea={tarea}
                        onEditar={() => abrirModal(tarea)}
                        onEliminar={() => eliminarTarea(tarea.id)}
                        onVer={() => abrirModalVer(tarea)}
                    />
                ))}
            </div>

            {modalAbierto && (
                <TareaModal
                    tarea={tareaSeleccionada}
                    onClose={() => setModalAbierto(false)}
                    onRefresh={obtenerTareas}
                    modoVer={modoVer}
                />
            )}
        </div>
    );
};

const styles = {
    filtros: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
    },
    input: {
        padding: '8px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '14px',
        minWidth: '150px'
    },
    botonBuscar: {
        padding: '8px 15px',
        borderRadius: '8px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        cursor: 'pointer'
    },
    botonCrear: {
        padding: '10px 20px',
        borderRadius: '8px',
        backgroundColor: '#6c63ff',
        color: '#fff',
        border: 'none',
        cursor: 'pointer'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '15px'
    },
    botonLogout: {
        padding: '10px 20px',
        borderRadius: '8px',
        backgroundColor: '#f44336',
        color: '#fff',
        border: 'none',
        cursor: 'pointer'
    }

};

export default Dashboard;
