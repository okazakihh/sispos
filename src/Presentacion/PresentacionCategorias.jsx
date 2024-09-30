import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { supabase } from '../Datos/conexion';
import RegistrarCategoria from '../formulariosCreacion/RegistrarCategoria';
import Swal from 'sweetalert2';

const PresentacionCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filteredCategorias, setFilteredCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const { data, error } = await supabase.from('categoria').select('*');
        if (error) {
          throw error;
        }
        if (data) {
          setCategorias(data);
          setFilteredCategorias(data);
        }
      } catch (error) {
        console.error('Error al obtener categorias:', error.message);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        });
      }
    };
    fetchCategorias();
  }, []);

  const handleCreateClick = () => {
    setSelectedCategoria(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUpdateClick = (categoria) => {
    setSelectedCategoria(categoria);
    setShowModal(true);
  };

  const handleDeleteClick = (categoria) => {
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
          const { error } = await supabase.from('categoria').delete().eq('id_categoria', categoria.id_categoria);
          if (error) {
            throw error;
          }
          setCategorias(categorias.filter(ca => ca.id_categoria !== categoria.id_categoria));
          setFilteredCategorias(filteredCategorias.filter(ca => ca.id_categoria !== categoria.id_categoria));
          Swal.fire(
            'Eliminado!',
            'La categoria ha sido eliminada.',
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

  const handleCategoriaChange = (event) => {
    setFilterCategoria(event.target.value);
    setFilteredCategorias(categorias.filter(categoria => categoria.nombre.toLowerCase().includes(event.target.value.toLowerCase())));
  };

  return (
    <div className="container mt-4">
    

      <div className="mb-3">
        <label htmlFor="numDocumentoFilter">Categoria:</label>
        <input
          id="numDocumentoFilter"
          type="text"
          value={filterCategoria}
          onChange={handleCategoriaChange}
          className="form-control"
        />
      </div>

      <table className="table-color">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Descripcion</th>
            <th scope="col">Estado</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategorias.map(categoria => (
            <tr key={categoria.id_categoria}>
              <td>{categoria.nombre}</td>
              <td>{categoria.descripcion}</td>
              <td>{categoria.estado}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button variant="primary" size="sm" onClick={() => handleUpdateClick(categoria)}>Actualizar</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteClick(categoria)}>Eliminar</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCategoria ? 'Actualizar categoria' : 'Registrar categoria'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegistrarCategoria categoria={selectedCategoria} onClose={handleCloseModal} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PresentacionCategorias;
