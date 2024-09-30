import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { supabase } from '../Datos/conexion';
import RegistrarPersona from '../formulariosCreacion/RegistrarPersona';
import Swal from 'sweetalert2';

const PresentacionPersona = () => {
    const [personas, setPersonas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [filterTipoPersona, setFilterTipoPersona] = useState('');
    const [filterNumDocumento, setFilterNumDocumento] = useState('');

    useEffect(() => {
        const fetchPersonas = async () => {
            try {
                if (personas.length === 0) {
                    const { data, error } = await supabase.from('persona').select('*');
                    if (error) throw error;
                    if (data) setPersonas(data);
                }
            } catch (error) {
                console.error('Error al obtener información de las personas:', error.message);
                Swal.fire({ icon: 'error', title: 'Oops...', text: error.message });
            }
        };
        fetchPersonas();
    }, [personas]);

    const handleCreateClick = () => {
        setSelectedPersona(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleUpdateClick = (persona) => {
        setSelectedPersona(persona);
        setShowModal(true);
    };

    const handleDeleteClick = async (persona) => {
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
                    const { error } = await supabase.from('persona').delete().eq('id_persona', persona.id_persona);
                    if (error) throw error;
                    setPersonas(personas.filter(p => p.id_persona !== persona.id_persona));
                    Swal.fire('Eliminado!', "La persona ha sido eliminada.", 'success');
                } catch (error) {
                    Swal.fire({ icon: 'error', title: 'Oops...', text: error.message });
                }
            }
        });
    };

    const handleTipoPersonaChange = (event) => {
        setFilterTipoPersona(event.target.value);
    };

    const handleNumDocumentoChange = (event) => {
        setFilterNumDocumento(event.target.value);
    };

    const filteredPersonas = personas.filter(persona => {
        return (
            (filterTipoPersona === '' || persona.tipo_persona === filterTipoPersona) &&
            (filterNumDocumento === '' || persona.num_documento.includes(filterNumDocumento))
        );
    });

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Lista de personas</h1>
            <Button className="mb-3" variant="success" onClick={handleCreateClick}>Crear persona</Button>

            <div className="mb-3">
                <label htmlFor="tipoPersonaFilter">Tipo de Persona:</label>
                <select
                    id="tipoPersonaFilter"
                    value={filterTipoPersona}
                    onChange={handleTipoPersonaChange}
                    className="form-select"
                >
                    <option value="">Todos</option>
                    <option value="Proveedor">Proveedor</option>
                    <option value="Cliente">Cliente</option>
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="numDocumentoFilter">Número de Documento:</label>
                <input
                    id="numDocumentoFilter"
                    type="text"
                    value={filterNumDocumento}
                    onChange={handleNumDocumentoChange}
                    className="form-control"
                />
            </div>

            <table className="table-color">
                <thead>
                    <tr>
                        <th scope="col">Nombres</th>
                        <th scope="col">Documento</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Proveedor de</th>
                        <th scope="col">Teléfono</th>
                        <th scope="col">Foto</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPersonas.map(persona => (
                        <tr key={persona.id_persona}>
                            <td>{persona.informacion.Nombres}</td>
                            <td>{persona.num_documento}</td>
                            <td>{persona.tipo_persona}</td>
                            <td>{persona.informacion.Proveedor_de}</td>
                            <td>{persona.informacion.Telefono}</td>
                            <td>
                                {persona.foto && (
                                    <img
                                        src={`data:image/jpeg;base64,${persona.foto.replace(/^data:image\/\w+;base64,/, "")}`}
                                        alt="Foto de Perfil"
                                        style={{ width: '50px', height: '50px', borderRadius:'30px'}}
                                    />
                                )}
                            </td>
                            <td>
                                <div className="d-flex gap-2">
                                    <Button variant="primary" size="sm" onClick={() => handleUpdateClick(persona)}>Actualizar</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteClick(persona)}>Eliminar</Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedPersona ? 'Actualizar persona' : 'Registrar persona'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RegistrarPersona persona={selectedPersona} onClose={handleCloseModal} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PresentacionPersona;
