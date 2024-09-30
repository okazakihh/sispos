import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Alert } from 'react-bootstrap';
import { supabase } from '../Datos/conexion';
import RegistroVenta from '../formulariosCreacion/RegistroVenta';
import Swal from 'sweetalert2';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const PresentacionVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);

  const [pdfPreview, setPdfPreview] = useState(null);
  const [showModalPreview, setShowModalPreview] = useState(false);





  useEffect(() => {
    fetchUltimasVentas();
   }, []);

  const fetchUltimasVentas = async () => {
    try {
      const { data, error } = await supabase
        .from('venta')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Parsear descrp_venta y calcular el total de cada venta
      const ventasConDescripcion = data.map(venta => {
        let descrp_venta;
        let total = 0;

        try {
          descrp_venta = venta.descrp_venta ? JSON.parse(venta.descrp_venta) : [];
        } catch (e) {
          descrp_venta = [];
        }

        if (Array.isArray(descrp_venta)) {
          total = descrp_venta.reduce((sum, item) => {
            const cantidad = Number(item.cantidad) || 0;
            const precio = Number(item.precio_unitario) || 0;
            return sum + cantidad * precio;
          }, 0);
        }

        return { ...venta, descrp_venta, total };
      });

      setVentas(ventasConDescripcion);
    } catch (error) {
      console.error('Error al obtener las últimas ventas:', error.message);
      Swal.fire({ icon: 'error', title: 'Oops...', text: error.message });
    }
  };


  const handleCreateClick = async () => {
    try {
      // Realizamos la consulta para verificar si existe una caja abierta
      const { data, error } = await supabase
        .from('apertura_cierre')
        .select('*')
        .eq('estado', 1); // Estado 1 significa 'abierto'
  
      if (error) throw error;
  
      // Si no hay caja abierta, mostramos una alerta
      if (data.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Caja cerrada',
          text: 'No se puede crear una venta porque la  caja está cerrada.',

        });
        return;
      }
  
      // Si hay una caja abierta, permitimos crear la venta
      setSelectedVenta(null);
      setShowModal(true);
    } catch (error) {
      console.error('Error al verificar la caja:', error.message);
      Swal.fire({ icon: 'error', title: 'Oops...', text: error.message + " Algo salio mal, consulte soporte tecnico. " });
    }
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUpdateClick = (venta) => {
    setSelectedVenta(venta);
    setShowModal(true);
  };


  const handleClosePreviewModal = () => {
    setShowModalPreview(false);
    setPdfPreview(null);
  };


  const generarFactura = async (venta) => {
    try {
      const pdfDoc = await PDFDocument.create();
      
      // Definir las dimensiones iniciales de la página
      const pageWidth = 600;
      const pageHeight = 800;
      
      // Crear una página con dimensiones iniciales
      const page = pdfDoc.addPage([pageWidth, pageHeight]);
  
      // Calcular la altura necesaria para el contenido
      const margin = 30;
      const headerRowHeight = 20;
      const headerColumnWidths = [80, 120, 130, 80]; // Anchos de las columnas del encabezado
      const spaceBetweenTables = 50; // Aumentar el espacio adicional entre tablas
      const lineHeight = 15; // Altura de cada línea en la tabla
  
      const headerYPosition = pageHeight - margin; // Posición inicial del encabezado
      let tableYPosition = headerYPosition - headerRowHeight - spaceBetweenTables; // Posición inicial de la tabla de productos
  
      // Calcular el espacio necesario para la tabla de productos
      const numberOfRows = venta.descrp_venta.length;
      const tableHeight = numberOfRows * lineHeight + lineHeight; // Añadir una línea adicional para la línea final
  
      // Calcular la altura total requerida para la página
      const totalHeight = headerYPosition + spaceBetweenTables + tableHeight + 30; // 40px de margen en el pie
  
      // Ajustar el tamaño de la página si es necesario
      if (totalHeight > pageHeight) {
        page.setSize(pageWidth, totalHeight); // Ajustar la altura de la página
      }
  
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
      const drawCenteredText = (text, yPosition, size) => {
        const textWidth = font.widthOfTextAtSize(text, size);
        const xPosition = (page.getWidth() - textWidth) / 2;
        page.drawText(text, { x: xPosition, y: yPosition, size, font, color: rgb(0, 0, 0) });
      };
  
      // Agregar el título de la factura
      drawCenteredText('Factura de venta', headerYPosition + 70, 20);
      drawCenteredText('Autoservicio la lupita', headerYPosition + 60, 10);
      drawCenteredText('Nit:123456789-0', headerYPosition + 50, 10);
      drawCenteredText('Direccion: 1 carrera 1 # 02-03', headerYPosition + 40, 10);
      drawCenteredText('Telefono: 3214569807', headerYPosition + 30, 10);
      // Títulos y valores del encabezado
      const headerTitles = [
        'ID Venta:',
        'Fecha:',
        'ID Cliente:',
        'Número factura:'
      ];
      
      const headerValues = [
        venta.id_venta.toString(), // Convertir a cadena
        new Date(venta.created_at).toLocaleDateString(),
        venta.cc_cliente.toString(), // Convertir a cadena   
        venta.num_comprobante.toString() // Convertir a cadena
        
      ];
  
      // Dibujar encabezado de la tabla
      let xPosition = margin;
      headerTitles.forEach((title, index) => {
        page.drawText(title, { x: xPosition, y: headerYPosition, size: 14, color: rgb(0, 0, 0),  });
        xPosition += headerColumnWidths[index];
      });
  
      // Dibujar línea debajo del encabezado
      page.drawLine({ start: { x: margin, y: headerYPosition - headerRowHeight }, end: { x: margin + headerColumnWidths.reduce((a, b) => a + b, 0), y: headerYPosition - headerRowHeight }, thickness: 1, color: rgb(0, 0, 0) });
  
      // Dibujar valores del encabezado
      xPosition = margin;
      headerValues.forEach((value, index) => {
        page.drawText(value, { x: xPosition, y: headerYPosition - headerRowHeight - 20, size: 14, color: rgb(0, 0, 0) });
        xPosition += headerColumnWidths[index];
      });
  
      // Ajustar la posición de la tabla de productos
      tableYPosition = headerYPosition - headerRowHeight - spaceBetweenTables;
      // Dibujar encabezado de la tabla de productos
      page.drawText('Nombre', { x: margin, y: tableYPosition, size: 12, color: rgb(0, 0, 0) });
      page.drawText('Cantidad', { x: margin + 150, y: tableYPosition, size: 12, color: rgb(0, 0, 0) });
      page.drawText('Valor Unitario', { x: margin + 230, y: tableYPosition, size: 12, color: rgb(0, 0, 0) });
      page.drawText('Valor Total', { x: margin + 350, y: tableYPosition, size: 12, color: rgb(0, 0, 0) });
  
      // Dibujar líneas de la tabla de productos
      tableYPosition -= lineHeight;
      page.drawLine({ start: { x: margin, y: tableYPosition }, end: { x: margin + 500, y: tableYPosition }, thickness: 1, color: rgb(0, 0, 0) });
      tableYPosition -= lineHeight;
  
      // Agregar filas de la tabla de productos
      venta.descrp_venta.forEach(item => {
        const nombre = item.nombre.toString(); // Asegurarse de que el nombre sea cadena
        const cantidad = Number(item.cantidad) || 0; // Convertir cantidad a número
        const precioUnitario = Number(item.precio_unitario) || 0; // Convertir a número y manejar posibles valores no numéricos
        const precioTotal = Number(item.precio_total) || 0; // Convertir a número y manejar posibles valores no numéricos
  
        page.drawText(nombre, { x: margin, y: tableYPosition, size: 12, color: rgb(0, 0, 0) });
        page.drawText(cantidad.toString(), { x: margin + 150, y: tableYPosition, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`$${precioUnitario.toFixed(2)}`, { x: margin + 230, y: tableYPosition, size: 12, color: rgb(0, 0, 0) });
        page.drawText(`$${precioTotal.toFixed(2)}`, { x: margin + 350, y: tableYPosition, size: 12, color: rgb(0, 0, 0) });
        tableYPosition -= lineHeight;
      });
  
      // Agregar línea final de la tabla de productos
      page.drawLine({ start: { x: margin, y: tableYPosition }, end: { x: margin + 500, y: tableYPosition }, thickness: 1, color: rgb(0, 0, 0) });
  
      // Agregar el total de ventas en el pie
      const totalVentasYPosition = tableYPosition - 40; // Espacio después de la tabla
      page.drawText(`Total de Venta: $${(venta.total || 0).toFixed(2)}`, { x: margin, y: totalVentasYPosition, size: 12, color: rgb(0, 0, 0) });
  
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
  
      setPdfPreview(url);
      setShowModalPreview(true);
  
      Swal.fire('Factura generada', `Factura para venta ${venta.id_venta} ha sido generada.`, 'success');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se pudo generar la factura.',
      });
      console.error('Error al generar factura:', error);
    }
  };
  


  return (
    <div className="container mt-4">
      <h1 className="mb-4">Lista de Ventas</h1>
      <Button className="mb-3" variant="success" onClick={handleCreateClick}>
        Crear Venta
      </Button>

      <table className="table-color" >
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Fecha</th>
            <th>ID Cliente</th>
            <th>ID Usuario</th>
            <th>Número Comprobante</th>
            <th>Descripción</th>
            <th>Estado</th>   
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id_venta}>
              <td>{venta.id_venta}</td>
              <td>{new Date(venta.created_at).toLocaleString()}</td>
              <td>{venta.cc_cliente}</td>
              <td>{venta.idusuario}</td>
              <td>{venta.num_comprobante}</td>
              <td>
                {Array.isArray(venta.descrp_venta) ? (
                  venta.descrp_venta.map((item, index) => (
                    <div key={index}>
                      <div><b>Artículo: </b>{item.nombre}</div>
                      <div><b>Cantidad: </b>{item.cantidad}</div>
                      <div><b>Precio unitario: </b>${item.precio_unitario}</div>
                      <div><b>Precio total: </b>${item.precio_total}</div>
                    </div>
                  ))
                ) : (
                  'No disponible'
                )}
              </td>
              <td>{venta.estado}</td>
              <td>${venta.total.toFixed(2)}</td>
              <td>
                <div className="d-flex gap-2">

                  <Button variant="success" size="sm" onClick={() => generarFactura(venta)}>Generar Factura</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedVenta ? 'Actualizar Venta' : 'Registrar Venta'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegistroVenta ingreso={selectedVenta} onClose={handleCloseModal} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModalPreview} onHide={handleClosePreviewModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Vista Previa de Factura</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {pdfPreview ? (
          <iframe
            src={pdfPreview}
            width="100%"
            height="600px"
            frameBorder="0"
          />
        ) : (
          <p>No se puede mostrar la vista previa en este momento.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClosePreviewModal}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  );
};

export default PresentacionVentas;
