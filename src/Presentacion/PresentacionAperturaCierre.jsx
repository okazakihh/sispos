import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { supabase } from '../Datos/conexion';
import RegistrarAperturaCierre from "../formulariosCreacion/RegistrarAperturaCierre";
import Swal from 'sweetalert2';

const PresentacionAperturaCierre = () => {
  const [aperturaCierre, setAperturaCierre] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchAperturaCierre = async () => {
      try {
        const { data, error } = await supabase.from('apertura_cierre').select('*');
        if (error) throw error;
        if (data) setAperturaCierre(data);
      } catch (error) {
        console.error('Error al obtener datos de apertura/cierre:', error.message);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        });
      }
    };
    fetchAperturaCierre();
  }, []);

  const handleCreateClick = () => {
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleUpdateClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDeleteClick = async (item) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { error } = await supabase
            .from('apertura_cierre')
            .delete()
            .eq('id', item.id);

          if (error) throw error;

          setAperturaCierre(aperturaCierre.filter(ac => ac.id !== item.id));
          Swal.fire('Eliminado!', 'El registro ha sido eliminado.', 'success');
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

  // Nueva función para cerrar la caja
  const handleCloseCaja = (item) => {
    setSelectedItem(item); // Establecer el registro seleccionado
    setShowModal(true); // Abrir el modal para actualizar el registro
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleSubmitCloseCaja = async (formData) => {
    Swal.fire({
      title: '¿Estás seguro de cerrar la caja?',
      text: 'Esta acción no se puede revertir.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar!',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { error } = await supabase
            .from('apertura_cierre')
            .update({
              estado: 0,  // Actualiza el estado a cerrado (0)
              total_cierre: formData.total_cierre // Suponiendo que envías el total de cierre en el formulario
            })
            .eq('id', selectedItem.id);

          if (error) throw error;

          setAperturaCierre(aperturaCierre.map(ac =>
            ac.id === selectedItem.id ? { ...ac, estado: 0, total_cierre: formData.total_cierre } : ac
          ));
          Swal.fire('Cerrado!', 'La caja ha sido cerrada.', 'success');
          setShowModal(false); // Cierra el modal después de la actualización
          setSelectedItem(null); // Resetea el ítem seleccionado
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
      <h2>Apertura y Cierre</h2>
      <Button className="mb-3" variant="success" onClick={handleCreateClick}>Nueva Apertura</Button>
      <table className="table-color">
        <thead>
          <tr>
            <th scope="col">Fecha Apertura</th>
            <th scope="col">Hora Cierre</th> 
            <th scope="col">Base</th>
            <th scope="col">Total Apertura</th>
            <th scope="col">Total Cierre</th>
            <th scope="col">Detalle</th>
            <th scope="col">Estado</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {aperturaCierre.map((item) => (
            <tr key={item.id}>
              <td>
                {new Date(item.created_at).toLocaleString('es-CO', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true // Cambia a true si prefieres el formato de 12 horas
                })}
              </td>
              <td>
                {item.estado === 0 ? (
                  new Date(item.updated_at).toLocaleString('es-CO', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true // Cambia a true si prefieres el formato de 12 horas
                  })
                ) : (
                  '-'
                )}
              </td>
              <td>{item.base}</td>
              <td>{item.total_apertura}</td>
              <td>{item.total_cierre}</td>
              <td>
                {item.detalle && (
                  <div>
                    <div key={`efectivo-${item.id}`}>Efectivo: {item.detalle.efectivo}</div>
                    <div key={`transferencias-${item.id}`}>Transferencias: {item.detalle.transferencias}</div>
                    <div key={`bonos-${item.id}`}>Bonos: {item.detalle.bonos}</div>
                  </div>
                )}
              </td>
              <td>{item.estado === 1 ? 'Abierto' : 'Cerrado'}</td>
              <td>
                <div className="d-flex gap-2">
                  {item.estado === 1 && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleCloseCaja(item)}
                    >
                      Cierre de caja
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem ? 'Actualizar Registro' : 'Registrar Nueva Apertura'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegistrarAperturaCierre item={selectedItem} onClose={handleCloseModal} onSubmit={handleSubmitCloseCaja} />
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

export default PresentacionAperturaCierre;
