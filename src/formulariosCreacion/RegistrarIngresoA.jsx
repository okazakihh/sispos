import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { supabase } from '../Datos/conexion';
import Swal from 'sweetalert2';

const RegistrarIngresoA = ({ ingreso, onClose }) => {
  const [articulos, setArticulos] = useState([]);
  const [selectedArticulo, setSelectedArticulo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioCompra, setPrecioCompra] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [selectedProveedor, setSelectedProveedor] = useState('');
  const [proveedores, setProveedores] = useState([]);

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

    const fetchProveedores = async () => {
      try {
        const { data: empresasData, error: empresasError } = await supabase
          .from('empresas')
          .select('id_empresa, nombre');
        if (empresasError) throw empresasError;
        setProveedores(empresasData);
      } catch (error) {
        console.error('Error al obtener proveedores:', error.message);
      }
    };

    fetchArticulos();
    fetchProveedores();
  }, []);

  useEffect(() => {
    if (ingreso) {
      setSelectedProveedor(ingreso.id_proveedor);
      setCantidad(ingreso.informacion.cantidad || '');
      setPrecioCompra(ingreso.informacion.precio_compra || '');
      setPrecioVenta(ingreso.informacion.precio_venta || '');
      setSelectedArticulo(ingreso.informacion.articuloId || '');
    }
  }, [ingreso]);

  useEffect(() => {
    const fetchArticuloDetails = async (id) => {
      try {
        if (id) {
          const { data: articuloData, error } = await supabase
            .from('articulo')
            .select('*')
            .eq('id_articulo', id)
            .single();
          if (error) throw error;

          console.log('Articulo Data:', articuloData); // Debugging line

          setPrecioCompra(articuloData.informacion.precio_compra || '');
          setPrecioVenta(articuloData.informacion.precio_venta || '');
        }
      } catch (error) {
        console.error('Error al obtener detalles del artículo:', error.message);
        Swal.fire({ icon: 'error', title: 'Oops...', text: error.message });
      }
    };

    if (selectedArticulo) {
      fetchArticuloDetails(selectedArticulo);
    }
  }, [selectedArticulo]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!selectedArticulo || !cantidad || !precioCompra || !precioVenta || !selectedProveedor) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Todos los campos son obligatorios.' });
      return;
    }

    try {
      const { data: articuloData, error: articuloError } = await supabase
        .from('articulo')
        .select('*')
        .eq('id_articulo', selectedArticulo)
        .single();
      if (articuloError) throw articuloError;

      const currentCantidad = articuloData.cantidad || 0;
      const newCantidad = parseInt(cantidad, 10) + currentCantidad;
      const articuloNombre = articuloData.informacion.nombre;

      if (ingreso) {
        const { error: ingresoError } = await supabase
          .from('ingreso')
          .update({
            id_proveedor: selectedProveedor,
            informacion: {
              articulo: articuloNombre,
              cantidad,
              precio_compra: precioCompra,
              precio_venta: precioVenta,
            },
          })
          .eq('id_ingreso', ingreso.id_ingreso);
        if (ingresoError) throw ingresoError;

        Swal.fire('Actualizado!', 'El ingreso ha sido actualizado correctamente.', 'success');
      } else {
        const { error: ingresoError } = await supabase.from('ingreso').insert([{
          id_proveedor: selectedProveedor,
          informacion: {
            articulo: articuloNombre,
            cantidad,
            precio_compra: precioCompra,
            precio_venta: precioVenta,
          },
        }]);
        if (ingresoError) throw ingresoError;

        Swal.fire('Creado!', 'El ingreso ha sido creado correctamente.', 'success');
      }

      const updatedFields = {
        cantidad: newCantidad,
        ...(precioCompra !== articuloData.informacion.precio_compra && { 
          "informacion->precio_compra": precioCompra 
        }),
        ...(precioVenta !== articuloData.informacion.precio_venta && { 
          "informacion->precio_venta": precioVenta 
        }),
      };

      const { error: articuloUpdateError } = await supabase
        .from('articulo')
        .update(updatedFields)
        .eq('id_articulo', selectedArticulo);
      if (articuloUpdateError) throw articuloUpdateError;

      resetFormFields();
      onClose();
    } catch (error) {
      console.error('Error:', error.message);
      Swal.fire({ icon: 'error', title: 'Oops...', text: error.message });
    }
  };

  const resetFormFields = () => {
    setSelectedProveedor('');
    setSelectedArticulo('');
    setCantidad('');
    setPrecioCompra('');
    setPrecioVenta('');
  };

  return (
    <div className="container" style={{ marginTop: "1rem" }}>
      <div className="card">
        <div className="card-body">
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label>Proveedor:</Form.Label>
              <Form.Select value={selectedProveedor} onChange={(e) => setSelectedProveedor(e.target.value)}>
                <option value="">Seleccione un proveedor</option>
                {proveedores.map(proveedor => (
                  <option key={proveedor.id_empresa} value={proveedor.id_empresa}>{proveedor.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Artículo:</Form.Label>
              <Form.Select value={selectedArticulo} onChange={(e) => setSelectedArticulo(e.target.value)}>
                <option value="">Seleccione un artículo</option>
                {articulos.map(articulo => (
                  <option key={articulo.id_articulo} value={articulo.id_articulo}>{articulo.informacion.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad:</Form.Label>
              <Form.Control type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="Cantidad" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio de compra:</Form.Label>
              <Form.Control type="number" value={precioCompra} onChange={(e) => setPrecioCompra(e.target.value)} placeholder="Precio de compra" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio de venta:</Form.Label>
              <Form.Control type="number" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} placeholder="Precio de venta" />
            </Form.Group>
            <Button variant="primary" type="submit" style={{ marginRight: "2px" }}>
              {ingreso ? 'Actualizar' : 'Registrar'}
            </Button>
            <Button variant="secondary" onClick={resetFormFields} style={{ marginLeft: "2px" }}>
              Cancelar
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegistrarIngresoA;
