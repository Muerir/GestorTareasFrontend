import React, { useState } from 'react';
import axios from 'axios';

const AuthPage = () => {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [mensajeTipo, setMensajeTipo] = useState(''); // 'success' o 'error'

    const [showRegistro, setShowRegistro] = useState(false);
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevoCorreo, setNuevoCorreo] = useState('');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [mensajeRegistro, setMensajeRegistro] = useState('');
    const [tipoMensajeRegistro, setTipoMensajeRegistro] = useState('');

    const handleLogin = async () => {
        try {
            const res = await axios.post('https://gestortareasbackend.onrender.com/api/usuario/login', {
                correo,
                contrasena
            });
            localStorage.setItem('token', res.data.token);
            setMensaje('Sesión iniciada correctamente');
            setMensajeTipo('success');
            // Redirigir después de 1 segundo
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        } catch (error) {
            setMensaje(error.response?.data?.mensaje || 'Error al iniciar sesión');
            setMensajeTipo('error');
        }
    };

    const handleRegistro = async () => {
        try {
            const res = await axios.post('https://gestortareasbackend.onrender.com/api/usuario/registro', {
                nombre: nuevoNombre,
                correo: nuevoCorreo,
                contrasena: nuevaContrasena
            });

            setMensajeRegistro('Usuario registrado correctamente');
            setTipoMensajeRegistro('success');
            setNuevoNombre('');
            setNuevoCorreo('');
            setNuevaContrasena('');
        } catch (error) {
            setMensajeRegistro(error.response?.data?.mensaje || 'Error al registrar');
            setTipoMensajeRegistro('error');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2 style={{ marginBottom: '20px' }}>Gestor de Tareas</h2>
                <input
                    type="email"
                    placeholder="Correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    style={styles.input}
                />
                <div>
                    <button onClick={handleLogin} style={styles.button}>Iniciar Sesión</button>
                    <button onClick={() => {
                        setShowRegistro(true);
                        setMensajeRegistro('');
                        setTipoMensajeRegistro('');
                    }} style={{ ...styles.button, backgroundColor: '#6c63ff' }}>Registrarse</button>
                </div>
                {mensaje && (
                    <p style={{ ...styles.mensaje, color: mensajeTipo === 'success' ? 'green' : 'red' }}>
                        {mensaje}
                    </p>
                )}
            </div>

            {/* Modal de Registro */}
            {showRegistro && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3>Registro de Usuario</h3>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={nuevoNombre}
                            onChange={(e) => setNuevoNombre(e.target.value)}
                            style={styles.input}
                        />
                        <input
                            type="email"
                            placeholder="Correo"
                            value={nuevoCorreo}
                            onChange={(e) => setNuevoCorreo(e.target.value)}
                            style={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={nuevaContrasena}
                            onChange={(e) => setNuevaContrasena(e.target.value)}
                            style={styles.input}
                        />
                        <div style={{ marginTop: '10px' }}>
                            <button onClick={handleRegistro} style={styles.button}>Registrar</button>
                            <button onClick={() => setShowRegistro(false)} style={{ ...styles.button, backgroundColor: '#aaa' }}>Cancelar</button>
                        </div>
                        {mensajeRegistro && (
                            <p style={{ ...styles.mensaje, color: tipoMensajeRegistro === 'success' ? 'green' : 'red' }}>
                                {mensajeRegistro}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// 🎨 Estilos
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
    },
    box: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center',
        width: '100%',
        maxWidth: '400px',
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
    button: {
        padding: '10px 20px',
        margin: '10px 5px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#4CAF50',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '15px',
        transition: 'background-color 0.3s ease',
    },
    mensaje: {
        marginTop: '15px',
        fontWeight: 'bold',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        animation: 'fadeIn 0.3s ease-in-out',
    },
    modal: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '15px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        transform: 'scale(1)',
        transition: 'transform 0.3s ease-in-out',
    }
};

export default AuthPage;
