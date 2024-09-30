import React, { useState, useEffect } from 'react';
import { supabase } from '../Datos/conexion';
import { Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2'; // Importar el componente de gráfico de barras
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver'; // Importar para guardar archivos
import * as XLSX from 'xlsx'; // Importar para manejar archivos Excel
import 'chart.js/auto'; // Importar Chart.js

const Home = () => {
  const [totales, setTotales] = useState({
    semanal: 0,
    mensual: 0,
    semestral: 0,
    anual: 0,
  });

  useEffect(() => {
    calcularTotalesVentas();
  }, []);

  const calcularTotalesVentas = async () => {
    try {
      const { data, error } = await supabase
        .from('venta')
        .select('*');

      if (error) throw error;

      const hoy = new Date();
      const ventas = data || [];

      const totalSemanal = ventas.reduce((sum, venta) => {
        const fechaVenta = new Date(venta.created_at);
        const diferenciaEnDias = Math.floor((hoy - fechaVenta) / (1000 * 60 * 60 * 24));
        if (diferenciaEnDias <= 7) {
          return sum + (venta.total || 0);
        }
        return sum;
      }, 0);

      const totalMensual = ventas.reduce((sum, venta) => {
        const fechaVenta = new Date(venta.created_at);
        if (fechaVenta.getMonth() === hoy.getMonth() && fechaVenta.getFullYear() === hoy.getFullYear()) {
          return sum + (venta.total || 0);
        }
        return sum;
      }, 0);

      const totalSemestral = ventas.reduce((sum, venta) => {
        const fechaVenta = new Date(venta.created_at);
        if (fechaVenta.getFullYear() === hoy.getFullYear() && fechaVenta.getMonth() >= hoy.getMonth() - 6) {
          return sum + (venta.total || 0);
        }
        return sum;
      }, 0);

      const totalAnual = ventas.reduce((sum, venta) => {
        const fechaVenta = new Date(venta.created_at);
        if (fechaVenta.getFullYear() === hoy.getFullYear()) {
          return sum + (venta.total || 0);
        }
        return sum;
      }, 0);

      setTotales({
        semanal: totalSemanal,
        mensual: totalMensual,
        semestral: totalSemestral,
        anual: totalAnual,
      });
    } catch (error) {
      console.error('Error al calcular totales de ventas:', error.message);
      Swal.fire({ icon: 'error', title: 'Oops...', text: error.message });
    }
  };

  const data = {
    labels: ['Semanal', 'Mensual', 'Semestral', 'Anual'],
    datasets: [
      {
        label: 'Total Ventas (COP)',
        data: [
          totales.semanal,
          totales.mensual,
          totales.semestral,
          totales.anual,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Función para generar el archivo Excel
  const generarExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Periodo: 'Semanal', Total_Ventas: totales.semanal },
      { Periodo: 'Mensual', Total_Ventas: totales.mensual },
      { Periodo: 'Semestral', Total_Ventas: totales.semestral },
      { Periodo: 'Anual', Total_Ventas: totales.anual },
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Totales Ventas');

    // Generar el archivo Excel
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'totales_ventas.xlsx'); // Guardar el archivo con nombre
  };

  return (
    <div className="container mt-4">
      <h2>Reporte de Ventas</h2>
      <table className='table-color'>
        <thead>
          <tr>
            <th>Periodo</th>
            <th>Total Ventas (COP)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Semanal</td>
            <td>${totales.semanal.toLocaleString('es-CO')}</td>
          </tr>
          <tr>
            <td>Mensual</td>
            <td>${totales.mensual.toLocaleString('es-CO')}</td>
          </tr>
          <tr>
            <td>Semestral</td>
            <td>${totales.semestral.toLocaleString('es-CO')}</td>
          </tr>
          <tr>
            <td>Anual</td>
            <td>${totales.anual.toLocaleString('es-CO')}</td>
          </tr>
        </tbody>
      </table>

      <h3>Gráfico de Ventas</h3>
      <Bar data={data} options={{ responsive: true }} />

      <button onClick={generarExcel} className="btn btn-primary mt-3">
        Exportar a Excel
      </button>
    </div>
  );
};

export default Home;
