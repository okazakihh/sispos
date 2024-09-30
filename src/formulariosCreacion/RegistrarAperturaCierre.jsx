import { useState, useEffect } from 'react';
import { supabase } from '../Datos/conexion';
import Swal from 'sweetalert2';

const RegistrarAperturaCierre = ({ item, onClose }) => {
  const [base, setBase] = useState('');
  const [totalApertura, setTotalApertura] = useState('');
  const [totalCierre, setTotalCierre] = useState('');
  const [efectivo, setEfectivo] = useState('');
  const [transferencias, setTransferencias] = useState('');
  const [bonos, setBonos] = useState('');
  const [estado, setEstado] = useState('');


  useEffect(() => {
    if (item) {
      setBase(item.base || '');
      setTotalApertura(item.total_apertura || '');
      setTotalCierre(item.total_cierre || '');
      setEfectivo(item.detalle.efectivo || '');
      setTransferencias(item.detalle.transferencias || '');
      setBonos(item.detalle.bonos || '');
      setEstado(item.estado || '');
 
    }
  }, [item]);

  const resetFormFields = () => {
    setBase('');
    setTotalApertura('');
    setTotalCierre('');
    setEfectivo('');
    setTransferencias('');
    setBonos('');
    setEstado('');

  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validar campos obligatorios
    if (!base || !totalApertura || (estado === '0' && !totalCierre) || !efectivo) {
      Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor completa todos los campos necesarios.' });
      return;
    }
    
    // Crear el objeto detalle JSON
    const detalle = {
      efectivo: parseFloat(efectivo),
      transferencias: estado === '0' ? parseFloat(transferencias) : 0,
      bonos: estado === '0' ? parseFloat(bonos) : 0,
    };
    
    // Obtener la fecha y hora actuales
    const currentTime = new Date().toISOString(); // Formato ISO para la base de datos
    
    try {
      const { data, error } = item 
        ? await supabase.from('apertura_cierre').update([{
            base,
            total_apertura: parseFloat(totalApertura),
            total_cierre: estado === '0' ? parseFloat(totalCierre) : null, // solo asignar si es cierre
            detalle,
            estado,
            updated_at: currentTime // Solo para actualizaciones
          }]).eq('id', item.id)
        : await supabase.from('apertura_cierre').insert([{
            base,
            total_apertura: parseFloat(totalApertura),
            total_cierre: estado === '0' ? parseFloat(totalCierre) : null,
            detalle,
            estado
          }]);
    
      if (error) {
        throw error;
      }
    
      Swal.fire('¡Éxito!', 'El registro de caja ha sido guardado correctamente.', 'success');
      resetFormFields();
      onClose(); // Cerrar el formulario después de guardar
    } catch (error) {
      console.error('Error registrando apertura/cierre:', error.message);
      Swal.fire({ icon: 'error', title: 'Oops...', text: error.message });
    }
  };
  
  

  const handleCleanForm = () => {
    resetFormFields();
  };

  return (
    <>
      <div className='container' style={{ marginTop: "1rem" }}>
        <div className="card" style={{ alignItems: "center" }}>
          <img
            src="/assets/caja-registradora.png"
            style={{ width: "260px", height: "140px", marginTop: "15px", alignContent: "center" }}
            aria-hidden="false"
            alt="Caja Registradora"
          />
          <div className="card-body"></div>
        </div>
      </div>

      <form className="container" style={{ marginTop: "2rem" }} onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Base:</label>
          <input
            type="text"
            className="form-control"
            value={base}
            onChange={(e) => setBase(e.target.value)}
            placeholder='Base de la caja'
          />
        </div>

        <div className="mb-3">
          <label>Total Apertura:</label>
          <input
            type="text"
            className="form-control"
            value={totalApertura}
            onChange={(e) => setTotalApertura(e.target.value)}
            placeholder='Total de apertura'
          />
        </div>

        {estado === '0' && (
          <div className="mb-3">
            <label>Total Cierre:</label>
            <input
              type="text"
              className="form-control"
              value={totalCierre}
              onChange={(e) => setTotalCierre(e.target.value)}
              placeholder='Total de cierre'
            />
          </div>
        )}

        <div className="mb-3">
          <label>Efectivo:</label>
          <input
            type="text"
            className="form-control"
            value={efectivo}
            onChange={(e) => setEfectivo(e.target.value)}
            placeholder='Monto en efectivo'
          />
        </div>

        {estado === '0' && (
          <>
            <div className="mb-3">
              <label>Transferencias:</label>
              <input
                type="text"
                className="form-control"
                value={transferencias}
                onChange={(e) => setTransferencias(e.target.value)}
                placeholder='Monto de transferencias'
              />
            </div>

            <div className="mb-3">
              <label>Bonos:</label>
              <input
                type="text"
                className="form-control"
                value={bonos}
                onChange={(e) => setBonos(e.target.value)}
                placeholder='Monto de bonos'
              />
            </div>
          </>
        )}

        <div className="mb-3">
          <label>Estado:</label>
          <select
            className="form-control"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="">Seleccionar estado</option>
            <option value="1">Apertura</option>
            <option value="0">Cierre</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          {item ? 'Cerrar caja' : 'completar'}
        </button>

        <button type="button" className="btn btn-secondary" onClick={handleCleanForm}>
          Limpiar formulario
        </button>
      </form>
    </>
  );
};

export default RegistrarAperturaCierre;
