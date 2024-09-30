import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { supabase } from '../Datos/conexion';
import RegistrarEmpresa from '../formulariosCreacion/RegistrarEmpresa';
import Swal from 'sweetalert2';

const PresentacionEmpresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [filterTipoEmpresa, setFilterTipoEmpresa] = useState('');
  const [filterNit, setFilterNit] = useState('');

  useEffect(() => {
    const fetchEmpresas = async () => {
        try {
            if (empresas.length === 0) {
                const { data, error } = await supabase.from('empresas').select('*');
                if (error) throw error;
                if (data) setEmpresas(data);
            }
        } catch (error) {
            console.error('Error al obtener información de las empresas:', error.message);
            Swal.fire({ icon: 'error', title: 'Oops...', text: error.message });
        }
    };
    fetchEmpresas();
}, [empresas]);

const handleCreateClick = () => {
  setSelectedEmpresa(null);
  setShowModal(true);
};

const handleCloseModal = () => {
  setShowModal(false);
};

const handleUpdateClick = (empresa) => {
  setSelectedEmpresa(empresa);
  setShowModal(true);
};

const handleDeleteClick = async (empresa) => {
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
              const { error } = await supabase.from('empresas').delete().eq('id_empresa', empresa.id_empresa);
              if (error) throw error;
              setEmpresas(empresas.filter(e => e.id_empresa !== empresa.id_empresa));
              Swal.fire('Eliminado!', "La empresa ha sido eliminada.", 'success');
          } catch (error) {
              Swal.fire({ icon: 'error', title: 'Oops...', text: error.message });
          }
      }
  });
};

const handleTipoEmpresaChange = (event) => {
  setFilterTipoEmpresa(event.target.value);
};

const handleNitChange = (event) => {
  setFilterNit(event.target.value);
};

const filteredEmpresas = empresas.filter(empresa => {
  return (
      (filterTipoEmpresa === '' || empresa.tipo === filterTipoEmpresa) &&
      (filterNit === '' || empresa.nit.includes(filterNit))
  );
});

  return (
    <div className="container mt-4">
            <h1 className="mb-4">Lista de empresas</h1>
            <Button className="mb-3" variant="success" onClick={handleCreateClick}>Crear empresa</Button>

            <div className="mb-3">
                <label htmlFor="tipoEmpreaFilter">Tipo de empresa:</label>
                <select
                    id="tipoEmpresaFilter"
                    value={filterTipoEmpresa}
                    onChange={handleTipoEmpresaChange}
                    className="form-select"
                >
                    <option value="">Todos</option>
                    <option value="Proveedor">Proveedor</option>
                    <option value="Cliente">Cliente</option>
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="nitFilter">Nit:</label>
                <input
                    id="nitFilter"
                    type="text"
                    value={filterNit}
                    onChange={handleNitChange}
                    className="form-control"
                />
            </div>

            <table className="table-color">
                <thead>
                    <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Nit</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Proveedor de</th>
                        <th scope="col">Teléfono</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmpresas.map(empresa => (
                        <tr key={empresa.id_empresa}>
                            <td>{empresa.nombre}</td>
                            <td>{empresa.nit}</td>
                            <td>{empresa.tipo}</td>
                            <td>{empresa.informacion.Proveedor_de}</td>
                            <td>{empresa.informacion.Telefono}</td>                      
                            <td>
                                <div className="d-flex gap-2">
                                    <Button variant="primary" size="sm" onClick={() => handleUpdateClick(empresa)}>Actualizar</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteClick(empresa)}>Eliminar</Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedEmpresa ? 'Actualizar empresa' : 'Registrar empresa'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RegistrarEmpresa empresa={selectedEmpresa} onClose={handleCloseModal} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </div>
  )
}

export default PresentacionEmpresas