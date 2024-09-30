import { useState, useEffect } from 'react';
import { supabase } from '../Datos/conexion';
import Swal from 'sweetalert2';



const RegistrarEmpresa = ({ empresa, onClose }) => {

    const [nombre, setNombre] = useState('');
    const [typeEmpresa, setTypeEmpresa] = useState('');
    const [nit, setNit] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [providerOf, setProviderOf] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [location, setLocation] = useState('');
    const [Representante, setRepresentante] = useState('');


    const resetFormFields = () => {
        setNombre('');
        setTypeEmpresa('');
        setNit('');
        setPhone('');
        setAddress('');
        setProviderOf('');
        setLocation('');
        setNeighborhood('');
        setRepresentante('');

    };

    useEffect(() => {
        if (empresa) {
            setNombre(empresa.nombre);
            setTypeEmpresa(empresa.tipo);
            setNit(empresa.nit);
            setPhone(empresa.informacion.Telefono);
            setAddress(empresa.informacion.Direccion);
            setProviderOf(empresa.informacion.Proveedor_de);
            setLocation(empresa.informacion.Ubicacion);
            setNeighborhood(empresa.informacion.Barrio);
            setRepresentante(empresa.informacion.Representante);
        } else {
            resetFormFields();
        }
    }, [empresa]);

    const handleRegister = async () => {
        try {
            if (empresa) {
                // Actualizar empresa
                const { error } = await supabase.from('empresas').update({
                    nombre: nombre,
                    tipo: typeEmpresa,
                    nit: nit,
                    informacion: {
                        Telefono: phone,
                        Direccion: address,
                        Barrio: neighborhood,
                        Ubicacion: location,
                        Proveedor_de: providerOf,
                        Representante: Representante
                    }

                }).eq('id_empresa', empresa.id_empresa);

                if (error) {
                    throw error;
                }

                Swal.fire(
                    'Actualizado!',
                    'La empresa ha sido actualizada.',
                    'success'
                );
            } else {
                // Crear nueva empresa
                const { error } = await supabase.from('empresas').insert([
                    {
                        nombre: nombre,
                        tipo: typeEmpresa,
                        nit: nit,
                        informacion: {
                            Telefono: phone,
                            Direccion: address,
                            Barrio: neighborhood,
                            Ubicacion: location,
                            Proveedor_de: providerOf,
                            Representante: Representante
                        }
                    }
                ]);

                if (error) {
                    throw error;
                }

                Swal.fire(
                    'Creado!',
                    'La empresa ha sido creada.',
                    'success'
                );
            }
            resetFormFields();
            onClose(); // Cerrar modal
        } catch (error) {
            console.error('Error registrando empresa:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message,
            });
        }
    };

    const handlecleanForm = () => {
        resetFormFields();
    };


    return (
        <div>
            <div className='container' style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
                <div className="card" style={{ borderRadius: "50%", width: "200px", height: "200px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#dfdddd", boxShadow: "0 10px 14px rgba(0, 0, 0, 0.5)" }}>
                    <img
                        src="/assets/empresa.ico"
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
                    <label>Nombre de la empresa:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder='Nombre de la empresa'
                    />
                </div>
                <div className="mb-3">
                    <label>Tipo de empresa:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={typeEmpresa}
                        onChange={(e) => setTypeEmpresa(e.target.value)}
                        placeholder='Tipo de empresa'
                    />
                </div>
                <div className="mb-3">
                    <label>NIT:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nit}
                        onChange={(e) => setNit(e.target.value)}
                        placeholder='NIT de la empresa'
                    />
                </div>
                <div className="mb-3">
                    <label>Teléfono:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder='Teléfono de la empresa'
                    />
                </div>
                <div className="mb-3">
                    <label>Dirección:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder='Dirección de la empresa'
                    />
                </div>
                <div className="mb-3">
                    <label>Barrio:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder='Barrio de la empresa'
                    />
                </div>
                <div className="mb-3">
                    <label>Ubicación:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder='Ciudad - Departamento'
                    />
                </div>
                <div className="mb-3">
                    <label>Proveedor de:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={providerOf}
                        onChange={(e) => setProviderOf(e.target.value)}
                        placeholder='Productos que provee'
                    />
                </div>
                <div className="mb-3">
                    <label>Representante:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={Representante}
                        onChange={(e) => setRepresentante(e.target.value)}
                        placeholder='Nombre representante legal'
                    />
                </div>
                <button type="button" className="btn btn-primary" onClick={handleRegister} style={{ marginRight: "2px" }}>
                    {empresa ? 'Actualizar' : 'Registrar'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetFormFields} style={{ marginLeft: "2px" }}>
                    Limpiar formulario
                </button>
            </form>

        </div>
    )
}

export default RegistrarEmpresa