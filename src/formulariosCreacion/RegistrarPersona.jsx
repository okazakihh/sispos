import { useState, useEffect } from 'react';
import { supabase } from '../Datos/conexion';
import Swal from 'sweetalert2';

const RegistrarPersona = ({persona, onClose}) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [typePerson, setTypePerson] = useState('');
  const [document, setDocument] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [providerOf, setProviderOf] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoData, setPhotoData] = useState(null);


  const resetFormFields = () => {
    setEmail('');
    setFirstName('');
    setLastName('');
    setTypePerson('');
    setDocument('');
    setPhone('');
    setAddress('');
    setPhoto(null);
    setPhotoData(null);
    setProviderOf('');
    setLocation('');
    setNeighborhood('');

  };



  useEffect(() => {
    if (persona) {
      setEmail(persona.informacion.Correo);
      handleNameSplit(persona.informacion.Nombres);
      setTypePerson(persona.tipo_persona);
      setDocument(persona.num_documento);
      setPhone(persona.informacion.Telefono);
      setAddress(persona.informacion.Direccion);
      setNeighborhood(persona.informacion.Barrio);
      setLocation(persona.informacion.Ubicacion);
      setPhotoData(persona.photo_data);
      setProviderOf(persona.informacion.Proveedor_de);
    } else {
      resetFormFields();
    }
  }, [persona]);

  const handleNameSplit = (fullName) => {
    const nameParts = fullName.split(' ');
    console.log(nameParts.length);
    if (nameParts.length >= 4) {
      setFirstName(`${nameParts[0]} ${nameParts[1]}`);
      setLastName(`${nameParts[2]} ${nameParts[3]}`);
    } else if (nameParts.length === 3) {
      setFirstName(nameParts[0]);
      setLastName(`${nameParts[1]} ${nameParts[2]}`);
    } else if (nameParts.length === 2) {
      setFirstName(nameParts[0]);
      setLastName(nameParts[1]);
    } else {
      setFirstName(fullName);
      setLastName('');
    }
  };

  const handleRegister = async () => {
    try {
      if (persona) {
        // Actualizar persona
        const { error } = await supabase.from('persona').update({
          num_documento: document,
          informacion: {
            Nombres: `${firstName} ${lastName}`,
            Telefono: phone,
            Direccion: address,
            Barrio: neighborhood,
            Ubicacion: location,
            Proveedor_de: providerOf,
            Correo: email                   
            
          },
          tipo_persona: typePerson,
          foto: photoData,
         
        }).eq('id_persona', persona.id_persona);

        if (error) {
          throw error;
        }

        Swal.fire(
          'Actualizado!',
          'La persona ha sido actualizada.',
          'success'
        );
      } else {
        // Crear nuevo persona
        const { error } = await supabase.from('persona').insert([
          {
            num_documento: document,
            informacion: {
              Nombres: `${firstName} ${lastName}`,
              Telefono: phone,
              Direccion: address,
              Barrio: neighborhood,
              Ubicacion: location,
              Proveedor_de: providerOf,
              Correo: email                   
              
            },
            tipo_persona: typePerson,
            foto: photoData,
          }
        ]);

        if (error) {
          throw error;
        }

        Swal.fire(
          'Creado!',
          'La persona ha sido creada.',
          'success'
        );
      }
      resetFormFields();
      onClose(); // Cerrar modal
    } catch (error) {
      console.error('Error signing up:', error.message);
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result;
      setPhotoData(imageData);
    };

    reader.readAsDataURL(file);
  };
  return (
    <>
<div className='container' style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
  <div className="card" style={{ borderRadius: "50%", width: "200px", height: "200px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor:"#dfdddd", boxShadow:"0 10px 14px rgba(0, 0, 0, 0.5)" }}>
    <img
      src="public/assets/personas.ico"
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
        <label>Numero de documento:</label>
        <input
          
          className="form-control"
          value={document}
          onChange={(e) => setDocument(e.target.value)}
          placeholder='123456789'
        />
      </div>
      <div className="mb-3">
        <label>Nombres:</label>
        <input
          type="text"
          className="form-control"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder='Nombres'
        />
      </div>
      <div className="mb-3">
        <label>Apellidos:</label>
        <input
          type="text"
          className="form-control"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder='Apellidos'
        />
      </div>
      <div className="mb-3">
        <label>Télefono:</label>
        <input
          className="form-control"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder='312345678'
        
        >        
        </input>
      </div>

      <div className="mb-3">
        <label>Dirección:</label>
        <input
          className="form-control"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder='Calle 1 # 33 - 44'
        />
      </div>
      <div className="mb-3">
        <label>Barrio:</label>
        <input
          className="form-control"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          
        />
      </div>
      <div className="mb-3">
        <label>Ubicacion:</label>
        <input
          className="form-control"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder='Ciudad - Departamento'
        >      
        </input>
      </div>

      <div className="mb-3">
        <label>Proveedor de:</label>
        <input
          className="form-control"
          value={providerOf}
          onChange={(e) => setProviderOf(e.target.value)}
          placeholder='Granos'
        />
      </div>
      <div className="mb-3">
        <label>Correo:</label>
        <input
          className="form-control"
          value={email}
          type='email'
          onChange={(e) => setEmail(e.target.value)}
          placeholder='ejemplo@gmail.com'
        />
      </div>
      <div className="mb-3">
        <label>Tipo de persona:</label>
        <select
          className="form-control"
          value={typePerson}
          onChange={(e) => setTypePerson(e.target.value)}
         
        >
          <option value="">Seleccionar tipo de persona</option>
          <option value="Cliente">Cliente</option>
          <option value="Proveedor">Proveedor</option>
          </select>
      </div>
      <div className="mb-3">
        <label>Foto:</label>
        <input
          type="file"
          className="form-control"
          onChange={handlePhotoChange}
        />
      </div>

      <button type="button" style={{ marginRight: "2px" }} className="btn btn-primary" onClick={handleRegister}>
        {persona ? 'Actualizar' : 'Registrar'}
      </button>

      <button type="button" style={{ marginLeft: "2px" }} className="btn btn-secondary" onClick={handlecleanForm}>
        Limpiar formulario
      </button>
    </form>
  </>
  )
}

export default RegistrarPersona


