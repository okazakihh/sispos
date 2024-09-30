import { useState, useEffect } from 'react';
import { supabase } from '../Datos/conexion';
import Swal from 'sweetalert2';

const RegisterForm = ({ usuario, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [document, setDocument] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoData, setPhotoData] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');

  const resetFormFields = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setDocumentType('');
    setDocument('');
    setPhone('');
    setAddress('');
    setPhoto(null);
    setPhotoData(null);
    setRoles([]);
    setSelectedRole('');
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data, error } = await supabase.from('rol').select('id_rol, nombre');
        if (error) {
          console.error(error.message);
        } else {
          setRoles(data);
        }
      } catch (error) {
        console.error('Error fetching roles:', error.message);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    if (usuario) {
      setEmail(usuario.email);
      setPassword('');
      handleNameSplit(usuario.informacion.nombres);
      setDocumentType(usuario.informacion.tipo_documento);
      setDocument(usuario.informacion.Numero_documento);
      setPhone(usuario.informacion.telefono);
      setAddress(usuario.informacion.direccion);
      setPhotoData(usuario.photo_data);
      setSelectedRole(usuario.idrol);
    } else {
      resetFormFields();
    }
  }, [usuario]);

  const handleNameSplit = (fullName) => {
    const nameParts = fullName.split(' ');
    if (nameParts.length >= 2) {
      setFirstName(nameParts.slice(0, -1).join(' '));
      setLastName(nameParts.slice(-1).join(' '));
    } else {
      setFirstName(fullName);
      setLastName('');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // Evitar la recarga de la página por defecto del formulario

    try {
      if (usuario) {
        // Actualizar usuario
        let updatedFields = {
          email,
          informacion: {
            nombres: `${firstName} ${lastName}`,
            telefono: phone,
            direccion: address,
            tipo_documento: documentType,
            Numero_documento: document,
          },
          num_documento: document,
          idrol: selectedRole,
        };

        // Si hay nueva foto, actualizar también la foto
        if (photoData) {
          updatedFields = { ...updatedFields, photo_data: photoData };
        }

        const { error } = await supabase.from('usuario').update(updatedFields).eq('id_usuario', usuario.id_usuario);

        if (error) {
          throw error;
        }

        Swal.fire('Actualizado!', 'El usuario ha sido actualizado correctamente.', 'success');
      } else {
        // Crear nuevo usuario
        const { data, error } = await supabase.from('usuario').insert([
          {
            email,
            clave: password,
            informacion: {
              nombres: `${firstName} ${lastName}`,
              telefono: phone,
              direccion: address,
              tipo_documento: documentType,
              Numero_documento: document,
            },
            num_documento: document,
            photo_data: photoData,
            idrol: selectedRole,
          }
        ]);

        if (error) {
          throw error;
        }

        Swal.fire('Creado!', 'El usuario ha sido creado correctamente.', 'success');
      }
      resetFormFields();
      onClose(); // Cerrar modal
    } catch (error) {
      console.error('Error signing up:', error.message);
      Swal.fire({ icon: 'error', title: 'Oops...', text: error.message });
    }
  };

  const handleCleanForm = () => {
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
      src="/assets/usuario.ico"
      alt="Vector de cliente de perfil - arte vectorial de perfil - vista de costado"
      style={{ width: "100%", height: "auto" }}
      aria-hidden="false"
    />
    <div className="card-body" style={{ display: "none" }}>

    </div>
  </div>
</div>

      <form className="container" style={{ marginTop: "2rem" }} onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Correo:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='ejemplo@gmail.com'
          />
        </div>
        <div className="mb-3">
          <label>Contraseña:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='********'
          />
        </div>
        <div className="mb-3">
          <label>Rol:</label>
          <select
            className="form-control"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Seleccionar rol</option>
            {roles.map((role) => (
              <option key={role.id_rol} value={role.id_rol}>
                {role.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Nombres:</label>
          <input
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder='Nombre'
          />
        </div>
        <div className="mb-3">
          <label>Apellidos:</label>
          <input
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder='Apellido'
          />
        </div>
        <div className="mb-3">
          <label>Tipo de documento:</label>
          <select
            className="form-control"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
          >
            <option value="">Seleccionar tipo de documento</option>
            <option value="CC">Cedula de Ciudadania</option>
            <option value="TI">Tarjeta de Identidad</option>
            <option value="PP">Pasaporte</option>
            <option value="RC">Registro Civil</option>
            <option value="CE">Cedula extranjera</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Número de documento:</label>
          <input
            className="form-control"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            placeholder='12345678'
          />
        </div>
        <div className="mb-3">
          <label>Télefono:</label>
          <input
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder='312345678'
          />
        </div>
        <div className="mb-3">
          <label>Dirección:</label>
          <input
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder='Calle 123 # 45 - 67'
          />
        </div>
        <div className="mb-3">
          <label>Foto:</label>
          <input
            type="file"
            className="form-control"
            onChange={handlePhotoChange}
          />
          {photoData && <img src={photoData} alt="Foto" style={{ marginTop: "10px", maxHeight: "200px" }} />}
          {usuario && usuario.photo_data && !photoData && <img src={usuario.photo_data} alt="Foto actual" style={{ marginTop: "10px", maxHeight: "200px" }} />}
        </div>

        <button type="submit" style={{ marginRight: "2px" }} className="btn btn-primary">
          {usuario ? 'Actualizar' : 'Registrar'}
        </button>

        <button type="button" style={{ marginLeft: "2px" }} className="btn btn-secondary"
          onClick={handleCleanForm}
        >
          Limpiar formulario
        </button>
      </form>
    </>
  );
};

export default RegisterForm;

