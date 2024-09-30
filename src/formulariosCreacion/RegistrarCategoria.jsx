import { useState, useEffect } from 'react';
import { supabase } from '../Datos/conexion';
import Swal from 'sweetalert2';

const RegistrarCategoria = ({ categoria, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('');

  useEffect(() => {
    if (categoria) {
      setNombre(categoria.nombre || '');
      setDescripcion(categoria.descripcion || '');
      setEstado(categoria.estado || '');
    }
  }, [categoria]);

  const resetFormFields = () => {
    setNombre('');
    setDescripcion('');
    setEstado('');
  };

  const handleRegister = async () => {
    try {
      if (categoria) {
        // Actualizar categoría
        const { error } = await supabase.from('categoria').update({
          nombre: nombre,
          descripcion: descripcion,
          estado: estado,
        }).eq('id_categoria', categoria.id_categoria);

        if (error) {
          throw error;
        }

        Swal.fire(
          'Actualizado!',
          'La categoría ha sido actualizada.',
          'success'
        );
      } else {
        // Crear nueva categoría
        const { error } = await supabase.from('categoria').insert([
          {
            nombre: nombre,
            descripcion: descripcion,
            estado: estado,
          }
        ]);

        if (error) {
          throw error;
        }

        Swal.fire(
          'Creado!',
          'La categoría ha sido creada.',
          'success'
        );
      }
      resetFormFields();
      onClose(); // Cerrar modal
    } catch (error) {
      console.error('Error:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      });
    }
  };

  return (
    <>
      <div className='container' style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
  <div className="card" style={{ borderRadius: "50%", width: "200px", height: "200px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor:"#dfdddd", boxShadow:"0 10px 14px rgba(0, 0, 0, 0.5)" }}>
    <img
      src="/assets/categoria.ico"
      alt="Vector de cliente de perfil - arte vectorial de perfil - vista de costado"
      style={{ width: "100%", height: "auto" }}
      aria-hidden="false"
    />
    <div className="card-body" style={{ display: "none" }}>
  
    </div>
  </div>
</div>

      <form className="container" style={{ marginTop: "2rem" }}>
        <div className="mb-3">
          <label>Nombre de la categoría:</label>
          <input
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder='Nombre'
          />
        </div>
        <div className="mb-3">
          <label>Descripción de la categoría:</label>
          <textarea
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder='Descripción'
          />
        </div>

        <div className="mb-3">
          <label>Estado de la categoría:</label>
          <select
            className="form-control"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="">Seleccione un estado</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <button type="button" style={{ marginRight: "2px" }} className="btn btn-primary" onClick={handleRegister}>
          {categoria ? 'Actualizar' : 'Registrar'}
        </button>

        <button type="button" style={{ marginLeft: "2px" }} className="btn btn-secondary" onClick={resetFormFields}>
          Limpiar formulario
        </button>
      </form>
    </>
  );
}

export default RegistrarCategoria;
