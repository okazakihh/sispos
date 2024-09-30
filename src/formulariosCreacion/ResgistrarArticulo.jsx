import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { supabase } from '../Datos/conexion';
import Swal from 'sweetalert2';
import JsBarcode from 'jsbarcode';

const RegistrarArticulo = ({ articulo, onClose }) => {
  const [categoria, setCategoria] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [precioCompra, setPrecioCompra] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [photoData, setPhotoData] = useState(null);
  const [codigoBarras, setCodigoBarras] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');

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

  useEffect(() => {
    if (codigo) {
      generateBarcode(codigo);
    }
  }, [codigo]);

  useEffect(() => {
    if (articulo) {
      setCategoria(articulo.id_categoria);
      setCodigo(articulo.codigo);
      setNombre(articulo.informacion.nombre);
      setPrecioCompra(articulo.informacion.precio_compra);
      setPrecioVenta(articulo.informacion.precio_venta);
      setCantidad(articulo.cantidad);
      setCodigoBarras(articulo.codigo_barras);
      setSelectedCategoria(articulo.id_categoria);
    }
  }, [articulo]);

  useEffect(() => {
    if (articulo && articulo.foto) {
      setPhotoData(articulo.foto); // Mostrar la foto actual del artículo al cargar datos para actualizar
    }
  }, [articulo]);

  const generateBarcode = (code) => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, code, { format: 'CODE128' });
    const barcodeBase64 = canvas.toDataURL('image/png');
    setCodigoBarras(barcodeBase64);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result;
      setPhotoData(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // Evitar la recarga de la página por defecto del formulario

    try {
      if (articulo) {
        // Actualizar artículo existente
        let updatedFields = {
          id_categoria: selectedCategoria,  // Usa selectedCategoria aquí
          codigo: codigo,
          informacion: {
            nombre: nombre,
            precio_compra: precioCompra,
            precio_venta: precioVenta,
          },
          cantidad: cantidad,
          codigo_barras: codigoBarras,
        };

        // Si hay nueva foto, actualizar también la foto
        if (photoData) {
          updatedFields = { ...updatedFields, foto: photoData };
        }

        const { error } = await supabase.from('articulo').update(updatedFields).eq('id_articulo', articulo.id_articulo);

        if (error) {
          throw error;
        }

        Swal.fire('Actualizado!', 'El artículo ha sido actualizado correctamente.', 'success');
      } else {
        // Crear nuevo artículo
        const { data, error } = await supabase.from('articulo').insert([{
          id_categoria: selectedCategoria,  // Usa selectedCategoria aquí
          codigo: codigo,
          informacion: {
            nombre: nombre,
            precio_compra: precioCompra,
            precio_venta: precioVenta,
          },
          cantidad: cantidad,
          codigo_barras: codigoBarras,
          foto: photoData,
        }]);

        if (error) {
          throw error;
        }

        Swal.fire('Creado!', 'El artículo ha sido creado correctamente.', 'success');
      }

      resetFormFields();
      onClose();
    } catch (error) {
      console.error('Error:', error.message);
      Swal.fire({ icon: 'error', title: 'Oops...', text: error.message });
    }
  };

  const resetFormFields = () => {
    setCategoria('');
    setCodigo('');
    setNombre('');
    setPrecioCompra('');
    setPrecioVenta('');
    setCantidad('');
    setPhotoData(null);
    setCodigoBarras(null);
    setSelectedCategoria('');
  };

  return (
    <>
      <div className='container' style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
  <div className="card" style={{ borderRadius: "50%", width: "200px", height: "200px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor:"#dfdddd", boxShadow:"0 10px 14px rgba(0, 0, 0, 0.5)" }}>
    <img
      src="/assets/articulos.ico"
      alt="Vector de cliente de perfil - arte vectorial de perfil - vista de costado"
      style={{ width: "100%", height: "auto" }}
      aria-hidden="false"
    />
    <div className="card-body" style={{ display: "none" }}>
 
    </div>
  </div>
</div>
      <div className="container" style={{ marginTop: "1rem" }}>
        <div className="card">
          <div className="card-body">
            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Label>Categoría:</Form.Label>
                <Form.Select value={selectedCategoria} onChange={(e) => {
                  setSelectedCategoria(e.target.value);
                  setCategoria(e.target.value); // Asegúrate de actualizar categoria también
                }}>
                  <option value="">Seleccione una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Código:</Form.Label>
                <Form.Control type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Código" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nombre del artículo:</Form.Label>
                <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del artículo" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Precio de compra:</Form.Label>
                <Form.Control type="number" value={precioCompra} onChange={(e) => setPrecioCompra(e.target.value)} placeholder="Precio de compra" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Precio de venta:</Form.Label>
                <Form.Control type="number" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} placeholder="Precio de venta" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Cantidad:</Form.Label>
                <Form.Control type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="Cantidad" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Foto:</Form.Label>
                <Form.Control type="file" onChange={handlePhotoChange} />
                {photoData && <img src={photoData} alt="Foto" style={{ marginTop: "10px", maxHeight: "200px" }} />}
                {articulo && articulo.foto && !photoData && <img src={articulo.foto} alt="Foto actual" style={{ marginTop: "10px", maxHeight: "200px" }} />}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Código de barras:</Form.Label>
                {codigoBarras && <img src={codigoBarras} alt="Código de barras" style={{ marginTop: "10px" }} />}
              </Form.Group>
              <Button variant="primary" type="submit" style={{ marginRight: "2px" }}>
                {articulo ? 'Actualizar' : 'Registrar'}
              </Button>
              <Button variant="secondary" onClick={resetFormFields} style={{ marginLeft: "2px" }}>
                Limpiar formulario
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrarArticulo;
