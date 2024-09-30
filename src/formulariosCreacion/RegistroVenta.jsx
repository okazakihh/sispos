import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Row, Col, Card } from 'react-bootstrap';
import { supabase } from '../Datos/conexion';
import Swal from 'sweetalert2';

const RegistroVenta = ({ onClose }) => {
  const [documentoCliente, setDocumentoCliente] = useState('');
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [codigoArticulo, setCodigoArticulo] = useState('');
  const [articulos, setArticulos] = useState([]);
  const [selectedArticulo, setSelectedArticulo] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [numComprobante, setNumComprobante] = useState(0);
  const [lineasVenta, setLineasVenta] = useState([]);
  const [typePayment, setTypePayment] = useState('0');
  const [totalVenta, setTotalVenta] = useState('');
  const [efectivo, setEfectivo] = useState('');
  const [cambio, setCambio] = useState('');
  const [numeroTransaccion, setNumeroTransaccion] = useState('');

  useEffect(() => {
    const fetchLastComprobante = async () => {
      try {
        const { data, error } = await supabase
          .from('venta')
          .select('num_comprobante')
          .order('num_comprobante', { ascending: false })
          .limit(1);

        if (error) throw error;
        setNumComprobante(data.length ? data[0].num_comprobante + 1 : 1);
      } catch (error) {
        console.error('Error al obtener el último número de comprobante:', error.message);
      }
    };

    fetchLastComprobante();
  }, []);

  useEffect(() => {
    const calcularTotal = () => {
      const total = lineasVenta.reduce((acc, linea) => acc + linea.precio_total, 0);
      setTotalVenta(total);
    };
    calcularTotal();
  }, [lineasVenta]);

  useEffect(() => {
    if (typePayment === '1') {
      setCambio(efectivo - totalVenta);
    } else {
      setCambio('');
    }
  }, [efectivo, totalVenta, typePayment]);

  const handleClienteChange = async (e) => {
    const documento = e.target.value;
    setDocumentoCliente(documento);

    if (documento) {
      try {
        const { data, error } = await supabase
          .from('persona')
          .select('*')
          .eq('num_documento', documento);

        if (error) throw error;
        setClientes(data);
        setSelectedCliente(data.length === 1 ? data[0] : null);
      } catch (error) {
        console.error('Error al obtener información del cliente:', error.message);
        setClientes([]);
        setSelectedCliente(null);
      }
    } else {
      setClientes([]);
      setSelectedCliente(null);
    }
  };

  const handleArticuloChange = async (e) => {
    const codigo = e.target.value;
    setCodigoArticulo(codigo);

    if (codigo) {
      try {
        const { data, error } = await supabase
          .from('articulo')
          .select('*')
          .eq('codigo', codigo);

        if (error) throw error;
        setArticulos(data);
        setSelectedArticulo(data.length === 1 ? data[0] : null);
      } catch (error) {
        console.error('Error al obtener información del artículo:', error.message);
        setArticulos([]);
        setSelectedArticulo(null);
      }
    } else {
      setArticulos([]);
      setSelectedArticulo(null);
    }
  };

  const handleAddArticle = () => {
    if (selectedArticulo && cantidad > 0) {
      const nuevaLinea = {
        codigo: codigoArticulo,
        nombre: selectedArticulo.informacion.nombre,
        cantidad,
        precio_unitario: selectedArticulo.informacion.precio_venta,
        precio_total: cantidad * selectedArticulo.informacion.precio_venta,
      };
      setLineasVenta(prevLineas => [...prevLineas, nuevaLinea]);
      setCodigoArticulo('');
      setCantidad(1);
      setSelectedArticulo(null);
      setArticulos([]);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!selectedCliente || lineasVenta.length === 0) {
      Swal.fire('Error', 'Por favor selecciona un cliente y añade al menos un artículo', 'error');
      return;
    }

    try {
      const userId = 5; // Suponiendo que este es el ID del usuario
      const { data: userData, error: userError } = await supabase
        .from('usuario')
        .select('*')
        .eq('id_usuario', userId);

      if (userError) throw userError;
      if (userData.length === 0) {
        Swal.fire('Error', 'Usuario no válido', 'error');
        return;
      }

      const { data: ventaData, error: ventaError } = await supabase
        .from('venta')
        .insert([{
          cc_cliente: documentoCliente,
          idusuario: userId,
          num_comprobante: numComprobante,
          descrp_venta: JSON.stringify(lineasVenta),
          estado: 1,
          tipo_pago: typePayment,
          total: totalVenta, // Total que se guarda en la tabla
          num_transaccion: typePayment === '1' ? null : numeroTransaccion // Guardar número de transacción si es tarjeta
        }])
        .select('id_venta');

      if (ventaError) throw ventaError;
      const idventa = ventaData[0].id_venta;

      const detalles = lineasVenta.map(linea => ({
        idventa: idventa,
        codigo_articulo: linea.codigo,
        articulo: linea.nombre,
        cantidad: linea.cantidad,
        precio_unitario: linea.precio_unitario,
        precio_total: linea.precio_total,
      }));

      const { error: detalleError } = await supabase
        .from('detalle_venta')
        .insert(detalles);

      if (detalleError) throw detalleError;

      Swal.fire('Registrado!', 'La venta ha sido registrada con éxito.', 'success');
      onClose();
      resetFormFields();
    } catch (error) {
      console.error('Error al registrar la venta:', error.message);
      Swal.fire('Error', error.message, 'error');
    }
  };

  const resetFormFields = () => {
    setDocumentoCliente('');
    setClientes([]);
    setSelectedCliente(null);
    setCodigoArticulo('');
    setArticulos([]);
    setSelectedArticulo(null);
    setCantidad(1);
    setLineasVenta([]);
    setTotalVenta(0);
    setEfectivo(0);
    setCambio(0);
    setNumeroTransaccion('');
    setTypePayment('0');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  };

  return (
    <div className="container mt-4">
      <Card>
        <Card.Body>
          <Form onSubmit={handleRegister}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Documento del cliente:</Form.Label>
                  <Form.Control
                    type="text"
                    value={documentoCliente}
                    onChange={handleClienteChange}
                    placeholder="Ingrese el documento del cliente"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nombres y apellidos:</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedCliente?.informacion?.Nombres || ''}
                    readOnly
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono del cliente:</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedCliente?.informacion?.Telefono || ''}
                    readOnly
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Dirección del cliente:</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedCliente?.informacion?.Direccion || ''}
                    readOnly
                  />
                </Form.Group>
              
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Código Artículo:</Form.Label>
                  <Form.Control
                    type="text"
                    value={codigoArticulo}
                    onChange={handleArticuloChange}
                    placeholder="Ingrese el código del artículo"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Artículo:</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedArticulo?.informacion?.nombre || ''}
                    readOnly
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Cantidad:</Form.Label>
                  <Form.Control
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    min={1}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Pago:</Form.Label>
                  <Form.Select value={typePayment} onChange={(e) => setTypePayment(e.target.value)}>
                  <option value="0"></option>
                    <option value="1">Efectivo</option>
                    <option value="2">Tarjeta</option>
                    <option value="3">Billetera virtual</option>
                    <option value="4">transferencia</option>
                  </Form.Select>
                </Form.Group>

                {typePayment !== '1'  && (
                  <Form.Group className="mb-3">
                    <Form.Label>Número de Transacción:</Form.Label>
                    <Form.Control
                      type="text"
                      value={numeroTransaccion}
                      onChange={(e) => setNumeroTransaccion(e.target.value)}
                      placeholder="Ingrese el número de transacción"
                    />
                  </Form.Group>
                )}

                {typePayment === '1' && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Efectivo Recibido:</Form.Label>
                      <Form.Control
                        type="number"
                        value={efectivo}
                        onChange={(e) => setEfectivo(Number(e.target.value))}
                        min={0}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Cambio:</Form.Label>
                      <Form.Control
                        type="number"
                        value={cambio}
                        readOnly
                      />
                    </Form.Group>
                  </>
                )}


                <Button onClick={handleAddArticle} variant="primary">Añadir artículo</Button>
              </Col>
            </Row>

            <Table striped bordered hover className="mt-4">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Artículo</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Precio Total</th>
                </tr>
              </thead>
              <tbody>
                {lineasVenta.map((linea, index) => (
                  <tr key={index}>
                    <td>{linea.codigo}</td>
                    <td>{linea.nombre}</td>
                    <td>{linea.cantidad}</td>
                    <td>{formatCurrency(linea.precio_unitario)}</td>
                    <td>{formatCurrency(linea.precio_total)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="mt-3">
              <strong>Total Venta: {formatCurrency(totalVenta)}</strong>
            </div>
            <div className="mt-3">
              <Button type="submit" variant="success">Registrar Venta</Button>
              <Button variant="secondary" onClick={onClose} className="ms-2">Cancelar</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RegistroVenta;
