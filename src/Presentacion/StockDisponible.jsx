import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; 
import { supabase } from '../Datos/conexion';

const StockDisponible = () => {
  const [articulos, setArticulos] = useState([]);
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [codigoFiltro, setCodigoFiltro] = useState('');

  const getColor = (cantidad) => {
    if (cantidad < 30) return 'red';   // Menor a 30
    if (cantidad < 60) return 'orange'; // Menor a 60
    return 'green';                     // 60 o más
  };

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

  const handleNombreChange = (event) => {
    setNombreFiltro(event.target.value);
  };

  const handleCodigoChange = (event) => {
    setCodigoFiltro(event.target.value);
  };

  const filteredArticulos = articulos.filter(articulo => {
    const nombreMatch = articulo.informacion.nombre.toLowerCase().includes(nombreFiltro.toLowerCase());
    const codigoMatch = articulo.codigo.toLowerCase().includes(codigoFiltro.toLowerCase());
    return nombreMatch && codigoMatch;
  });

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Reporte de Artículos</h2>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Filtrar por nombre"
          value={nombreFiltro}
          onChange={handleNombreChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Filtrar por código"
          value={codigoFiltro}
          onChange={handleCodigoChange}
          className="form-control"
        />
      </div>
      <table className="table-color ">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Código</th>
            <th scope="col">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {filteredArticulos.map(articulo => (
            <tr key={articulo.id_articulo}>
              <td>{articulo.informacion.nombre}</td>
              <td>{articulo.codigo}</td>
              <td style={{ color: getColor(articulo.cantidad) }}>
                {articulo.cantidad}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockDisponible;
