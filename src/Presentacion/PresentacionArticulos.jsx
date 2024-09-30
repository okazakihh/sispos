import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { supabase } from '../Datos/conexion';
import ResgistrarArticulo from '../formulariosCreacion/ResgistrarArticulo';
import RegistrarCategoria from '../formulariosCreacion/RegistrarCategoria';
import PresentacionCategorias from './PresentacionCategorias';
import Swal from 'sweetalert2';
import { toPng } from 'html-to-image';

const PresentacionArticulos = () => {
  const [articulos, setArticulos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalCategory, setShowModalCategory] = useState(false);
  const [showModalCategoryCreate, setShowModalCategoryCreate] = useState(false);
  const [selectedArticulo, setSelectedArticulo] = useState(null);
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterArticulo, setFilterArticulo] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [selectedBarcodes, setSelectedBarcodes] = useState([]);
  const barcodeRefs = useRef({});

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const { data, error } = await supabase.from('articulo').select('*');
        if (error) throw error;
        setArticulos(data);
      } catch (error) {
        console.error('Error al obtener información de los artículos:', error.message);
        Swal.fire({ icon: 'error', title: 'Oops...', text: error.message });
      }
    };
    fetchArticulos();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const { data, error } = await supabase.from('categoria').select('id_categoria, nombre');
        if (error) {
          console.error(error.message);
        } else {
          setCategorias(data);
        }
      } catch (error) {
        console.error('Error fetching categorias:', error.message);
      }
    };

    fetchCategorias();
  }, []);

  const handleCreateClick = () => {
    setSelectedArticulo(null);
    setShowModal(true);
  };

  const handleCreateCategoryClick = () => {
    setShowModalCategoryCreate(true);
  };

  const handleViewCategoryClick = () => {
    setShowModalCategory(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseModalCategoryCreate = () => {
    setShowModalCategoryCreate(false);
  };

  const handleCloseModalCategory = () => {
    setShowModalCategory(false);
  };

  const handleUpdateClick = (articulo) => {
    setSelectedArticulo(articulo);
    setShowModal(true);
  };

  const handleDeleteClick = async (articulo) => {
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
          const { error } = await supabase.from('articulo').delete().eq('id_articulo', articulo.id_articulo);
          if (error) throw error;
          setArticulos(articulos.filter(ar => ar.id_articulo !== articulo.id_articulo));
          Swal.fire('Eliminado!', "El artículo ha sido eliminado.", 'success');
        } catch (error) {
          Swal.fire({ icon: 'error', title: 'Oops...', text: error.message });
        }
      }
    });
  };

  const handleArticulosChange = (event) => {
    setFilterArticulo(event.target.value);
  };

  const handleCategoriaChange = (event) => {
    setFilterCategoria(event.target.value);
  };

  const handleBarcodeClick = (barcode) => {
    setSelectedBarcodes((prevSelected) => {
      if (prevSelected.includes(barcode)) {
        return prevSelected.filter((b) => b !== barcode);
      } else {
        return [...prevSelected, barcode];
      }
    });
    setShowBarcodeModal(true);
  };

  const handleUpdateArticulo = async (updatedArticulo) => {
    try {
      const { data, error } = await supabase
        .from('articulo')
        .update(updatedArticulo)
        .eq('id_articulo', updatedArticulo.id_articulo);
      if (error) throw error;

      const updatedArticulos = articulos.map((articulo) =>
        articulo.id_articulo === updatedArticulo.id_articulo ? updatedArticulo : articulo
      );
      setArticulos(updatedArticulos);
      setShowModal(false);
      Swal.fire('Actualizado!', 'El artículo ha sido actualizado correctamente.', 'success');
    } catch (error) {
      console.error('Error al actualizar el artículo:', error.message);
      Swal.fire({ icon: 'error', title: 'Oops...', text: error.message });
    }
  };

  const handleDownloadBarcode = (codigo) => {
    const barcodeElement = barcodeRefs.current[codigo];
    if (!barcodeElement) {
      console.error('Elemento del código de barras no encontrado:', codigo);
      return;
    }
    toPng(barcodeElement)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `barcode-${codigo}.jpg`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('Error al generar la imagen:', error);
      });
  };

  const filteredArticulos = articulos.filter(articulo => {
    const categoria = categorias.find(cat => cat.id_categoria === articulo.id_categoria)?.nombre.toLowerCase() || '';
    return (
      (filterArticulo === '' || articulo.codigo.toString().includes(filterArticulo)) &&
      (filterCategoria === '' || categoria.includes(filterCategoria.toLowerCase()))
    );
  });

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Lista de artículos</h1>
      <Button className="mb-3" variant="success" style={{ marginRight: "2px" }} onClick={handleCreateClick}>Crear Artículo</Button>
      <Button className="mb-3" variant="success" style={{ marginLeft: "2px", marginRight: "2px" }} onClick={handleCreateCategoryClick}>Crear Categoría</Button>
      <Button className="mb-3" variant="primary" style={{ marginLeft: "2px", marginRight: "2px" }} onClick={handleViewCategoryClick}>Ver Categorías</Button>
      <div className="mb-3">
        <label htmlFor="articuloFilter">Código del artículo:</label>
        <input
          id="articuloFilter"
          value={filterArticulo}
          onChange={handleArticulosChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="numDocumentoFilter">Categoría:</label>
        <input
          id="numDocumentoFilter"
          type="text"
          value={filterCategoria}
          onChange={handleCategoriaChange}
          className="form-control"
        />
      </div>

      <table className="table-color">
        <thead >
          <tr  >
            <th scope="col">Nombre</th>
            <th scope="col">Código</th>
            <th scope="col">Categoría</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Foto</th>
            <th scope="col">Código de barras</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredArticulos.map(articulo => (
            <tr key={articulo.id_articulo}>
              <td>{articulo.informacion.nombre}</td>
              <td>{articulo.codigo}</td>
              <td>{categorias.find(cat => cat.id_categoria === articulo.id_categoria)?.nombre}</td>
              <td>{articulo.cantidad}</td>
              <td>
                {articulo.foto && (
                  <img
                    src={articulo.foto}
                    alt="Foto del artículo"
                    style={{ width: '50px', height: '50px', borderRadius: '30px' }}
                  />
                )}
              </td>
              <td>
                {articulo.codigo_barras && (
                  <div
                    id={`barcode-${articulo.codigo}`}
                    ref={(el) => (barcodeRefs.current[articulo.codigo] = el)}
                    style={{ display: 'inline-block' }}
                  >
                    <img
                      src={articulo.codigo_barras}
                      alt="Código de barras"
                      style={{ width: '100px', height: '100px' }}
                      onClick={() => handleBarcodeClick(articulo.codigo_barras)}
                    />
                  </div>
                )}
              </td>
              <td>
                <div className="d-flex gap-2">
                  <Button variant="primary" size="sm" onClick={() => handleUpdateClick(articulo)}>Actualizar</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteClick(articulo)}>Eliminar</Button>
                  <Button variant="info" size="sm" onClick={() => handleDownloadBarcode(articulo.codigo)}>Descargar</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedArticulo ? 'Actualizar artículo' : 'Registrar artículo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ResgistrarArticulo
            articulo={selectedArticulo}
            onClose={handleCloseModal}
            onUpdate={handleUpdateArticulo}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalCategoryCreate} onHide={handleCloseModalCategoryCreate} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Registrar categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxWidth: "100%" }}>
          <RegistrarCategoria onClose={handleCloseModalCategoryCreate} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalCategoryCreate}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalCategory} onHide={handleCloseModalCategory} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Lista de categorías</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxWidth: "100%" }}>
          <PresentacionCategorias onClose={handleCloseModalCategory} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalCategory}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showBarcodeModal} onHide={() => setShowBarcodeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Código de Barras</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {selectedBarcodes.map((barcode, index) => (
              <div key={index} style={{ margin: '10px' }}>
                <img src={barcode} alt="Código de barras" style={{ width: '200px', height: '200px' }} />
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBarcodeModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PresentacionArticulos;

