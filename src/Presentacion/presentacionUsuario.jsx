import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { supabase } from '../Datos/conexion';
import RegisterForm from '../formulariosCreacion/RegistrarUsuario';
import Swal from 'sweetalert2';

const PresentacionUsuario = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                // Consultar la tabla de usuarios solo si aún no se han cargado los datos
                if (usuarios.length === 0) {
                    const { data, error } = await supabase.from('usuario').select('*');

                    if (error) {
                        throw error;
                    }

                    if (data) {
                        // Actualizar el estado con los datos de los usuarios
                        setUsuarios(data);
                    }
                }
            } catch (error) {
                console.error('Error al obtener usuarios:', error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.message,
                });
            }
        };

        fetchUsuarios(); // Llamar a la función para obtener los usuarios al montar el componente
    }, [usuarios]); // Dependencia de usuarios para evitar bucles infinitos

    const handleCreateClick = () => {
        setSelectedUsuario(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleUpdateClick = (usuario) => {
        console.log(usuario)
        setSelectedUsuario(usuario);
        setShowModal(true);
    };

    const handleDeleteClick = (usuario) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { error } = await supabase.from('usuario').delete().eq('id_usuario', usuario.id_usuario);
                    if (error) {
                        throw error;
                    }
                    setUsuarios(usuarios.filter(u => u.id_usuario !== usuario.id_usuario));
                    Swal.fire(
                        'Eliminado!',
                        'El usuario ha sido eliminado.',
                        'success'
                    );
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.message,
                    });
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Lista de Usuarios</h1>
            <Button className="mb-3" variant="success" onClick={handleCreateClick}>
                Crear usuario
            </Button>

            <table className="table-color" style={{borderRadius:'30px'}}>
                <thead>
                    <tr>
                        <th scope="col">Nombres</th>
                        <th scope="col">Correo</th>
                        <th scope="col">Dirección</th>
                        <th scope="col">Teléfono</th>
                        <th scope="col">Foto</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(usuario => (
                        <tr key={usuario.id_usuario}>
                            <td>{usuario.informacion.nombres}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.informacion.direccion}</td>
                            <td>{usuario.informacion.telefono}</td>
                            <td>
                                {usuario.photo_data && (
                                    <img
                                        src={`data:image/jpeg;base64,${usuario.photo_data.replace(/^data:image\/\w+;base64,/, "")}`}
                                        alt="Foto de Perfil"
                                        style={{ width: '50px', height: '50px', borderRadius:'30px' }}
                                    />
                                )}
                            </td>
                            <td>
                                <div className="d-flex gap-2">
                                    <Button variant="primary" size="sm" onClick={() => handleUpdateClick(usuario)}>Actualizar</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteClick(usuario)}>Eliminar</Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedUsuario ? 'Actualizar Usuario' : 'Registrar Usuario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RegisterForm usuario={selectedUsuario} onClose={handleCloseModal} /> 
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PresentacionUsuario;
