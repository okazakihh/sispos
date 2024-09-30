import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Instancia useNavigate para la redirección
import { Modal } from 'react-bootstrap';
import { supabase } from '../Datos/conexion';
import RegisterForm from '../formulariosCreacion/RegistrarUsuario';
import Swal from 'sweetalert2'; // Importa SweetAlert

const Login = () => {
    const navigate = useNavigate(); // Instancia useNavigate para la redirección
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleLogin = async () => {
        try {
            const { data, error } = await supabase
                .from('usuario')
                .select('*') // Obtén todos los datos del usuario
                .eq('email', email)
                .eq('clave', password)
                .single();

            if (error) {
                throw new Error('Error al buscar el usuario, al parecer no está registrado o las credenciales son incorrectas');
            } else if (data) {
                console.log('Usuario admitido', data);
                navigateToViewPrincipal(data);
            } else {
                console.log('Usuario no encontrado o credenciales incorrectas');
                throw new Error('Usuario no encontrado o credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error:', error.message);
            // Muestra una alerta de SweetAlert para el error
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message,
            });
        }
    };

    const navigateToViewPrincipal = (userData) => {
        console.log("lista para enviar", userData);
        navigate('/view-principal', { state: { userData } });
    };

    return (
        <>
            <div className='container d-flex flex-column align-items-center justify-content-center' style={{ height: '100vh' }}>
                <div className='mb-4'>
                    <div className="card" style={{ borderRadius: "50%", width: "200px", height: "200px", overflow: "hidden", backgroundColor: "#dfdddd", boxShadow: "0 10px 14px rgba(0, 0, 0, 0.5)" }}>
                        <img
                            src="/assets/login.ico"
                            alt="Icono de login"
                            style={{ width: "100%", height: "auto" }}
                            aria-hidden="false"
                        />
                    </div>
                </div>
                <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
                    <div className="card-body">
                        <h1 className="text-center">Login</h1>
                        <form style={{ width: '100%' }}>
                            <div className="mb-3">
                                <label htmlFor="user" className="form-label">Usuario</label>
                                <input type="email" className="form-control" id="user" placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="pass" className="form-label">Contraseña</label>
                                <input type="password" className="form-control" id="pass" placeholder="******" onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="text-center">
                                <button type="button" className="btn btn-success" style={{ margin: "1rem" }} onClick={handleLogin}>Ingresar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
