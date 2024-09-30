import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { supabase } from '../Datos/conexion';
import RegistrarIngresoA from '../formulariosCreacion/RegistrarIngresoA';
import Swal from 'sweetalert2';

const PresentacionIngresoA = () => {
  const [ingresos, setIngresos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIngreso, setSelectedIngreso] = useState(null);

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        if (ingresos.length === 0) {
          const { data: ingresosData, error: ingresosError } = await supabase
            .from('ingreso')
            .select('*');

          if (ingresosError) {
            throw ingresosError;
          }

          if (ingresosData) {
            const ingresosConDetalles = await Promise.all(ingresosData.map(async ingreso => {
              const { data: proveedorData, error: proveedorError } = await supabase
                .from('empresas')
                .select('nombre')
                .eq('id_empresa', ingreso.id_proveedor)
                .single();

              if (proveedorError) {
                throw proveedorError;
              }

              return {
                ...ingreso,
                proveedorNombre: proveedorData.nombre
              };
            }));

            setIngresos(ingresosConDetalles);
          }
        }
      } catch (error) {
        console.error('Error al obtener ingresos:', error.message);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        });
      }
    };

    fetchIngresos();
  }, [ingresos]);

  const handleCreateClick = () => {
    setSelectedIngreso(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUpdateClick = (ingreso) => {
    setSelectedIngreso(ingreso);
    setShowModal(true);
  };

  const handleDeleteClick = (ingreso) => {
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
          const { error } = await supabase
            .from('ingreso')
            .delete()
            .eq('id_ingreso', ingreso.id_ingreso);
          if (error) {
            throw error;
          }
          setIngresos(ingresos.filter(i => i.id_ingreso !== ingreso.id_ingreso));
          Swal.fire(
            'Eliminado!',
            'El ingreso ha sido eliminado.',
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
      <h1 className="mb-4">Lista de Ingresos de articulos</h1>
      <Button className="mb-3" variant="success" onClick={handleCreateClick}>
        Crear ingreso
      </Button>

      <table className="table-color" style={{ borderRadius: '30px' }}>
        <thead>
          <tr>
            <th scope="col">Proveedor</th>
            <th scope="col">Información</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ingresos.map(ingreso => (
            <tr key={ingreso.id_ingreso}>
              <td>{ingreso.proveedorNombre}</td>
              <td>
                {ingreso.informacion ? (
                  <>
                    <div><b>Articulo: </b> {ingreso.informacion.articulo}</div>
                    <div><b>Cantidad: </b>{ingreso.informacion.cantidad}</div>
                    <div><b>Precio Compra:</b> ${ingreso.informacion.precio_compra}</div>
                    <div> <b>Precio Venta: </b>  ${ingreso.informacion.precio_venta}</div>
                  </>
                ) : 'No disponible'}
              </td>
              <td>
                <div className="d-flex gap-2">
                  <Button variant="primary" size="sm" onClick={() => handleUpdateClick(ingreso)}>Actualizar</Button>
          
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedIngreso ? 'Actualizar Ingreso' : 'Registrar Ingreso'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegistrarIngresoA ingreso={selectedIngreso} onClose={handleCloseModal} />
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

export default PresentacionIngresoA;
