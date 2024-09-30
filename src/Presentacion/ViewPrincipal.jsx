import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Asegúrate de tener esto aquí
import { Navbar, Container, Nav } from 'react-bootstrap';
import { supabase } from '../Datos/conexion';
import PresentacionUsuario from './presentacionUsuario';
import PresentacionPersona from './PresentacionPersona';
import PresentacionArticulos from './PresentacionArticulos';
import PresentacionEmpresas from './PresentacionEmpresas';
import PresentacionIngresoA from './PresentacionIngresoA'
import PresentacionVentas from './PresentacionVentas';
import PresentacionAperturaCierre from './PresentacionAperturaCierre';
import Home from './home';
import StockDisponible from './StockDisponible';
import './ViewPrincipal.css';
import { FaPowerOff } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ViewPrincipal = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Mover aquí
    const { state } = location;
    const [userData, setUserData] = useState(state?.userData || {});
    const [rolName, setRolName] = useState('');
    const [mostrarHome, setMostrarHome] = useState(false);
    const [mostrarPresentacionUsuario, setMostrarPresentacionUsuario] = useState(false);
    const [mostrarPresentacionPersona, setMostrarPresentacionPersona] = useState(false);
    const [mostrarPresentacionUArticulos, setMostrarPresentacionArticulos] = useState(false);
    const [mostrarPresentacionEmpresas, setMostrarPresentacionEmpresas] = useState(false);
    const [mostrarPresentacionIngresoA, setMostrarPresentacionIngresoA] = useState(false);
    const [mostrarPresentacionVentas, setMostrarPresentacionVentas] = useState(false);
    const [mostrarPresentacionAperturaCierre, setMostrarPresentacionAperturaCierre] = useState(false);
    const [mostrarStockDisponible, setMostrarStockDisponible] = useState(false);

    // Extraer datos del usuario
    const nombres = userData.informacion?.nombres;
    const email = userData.email;
    const idRol = userData.idrol;
    const foto = userData.photo_data;
    const currentYear = new Date().getFullYear();

    // Limpiar la base64 para asegurarse de que no contiene el prefijo de URL
    const cleanedFoto = foto ? foto.replace(/^data:image\/\w+;base64,/, "") : null;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data, error } = await supabase
                    .from('rol')
                    .select('*')
                    .eq('id_rol', idRol)
                    .single();

                if (error) {
                    throw new Error('Error al obtener el nombre del rol');
                }

                if (data) {
                    setRolName(data.nombre);
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
        };

        fetchUserData();
    }, [idRol]);

    // Funciones para mostrar u ocultar componentes
    const showHome = () => {
        setMostrarHome(true);
        setMostrarPresentacionUsuario(false);
        setMostrarPresentacionPersona(false);
        setMostrarPresentacionArticulos(false);
        setMostrarPresentacionEmpresas(false);
        setMostrarPresentacionIngresoA(false);
        setMostrarPresentacionVentas(false);
        setMostrarPresentacionAperturaCierre(false);
        setMostrarStockDisponible(false);
    };

    const showPresentacionUsuario = () => {
        setMostrarPresentacionUsuario(true);
        setMostrarHome(false);
        setMostrarPresentacionPersona(false);
        setMostrarPresentacionArticulos(false);
        setMostrarPresentacionEmpresas(false);
        setMostrarPresentacionIngresoA(false);
        setMostrarPresentacionVentas(false);
        setMostrarPresentacionAperturaCierre(false);
        setMostrarStockDisponible(false);
    };

    const showPresentacionPersona = () => {
        setMostrarPresentacionPersona(true);
        setMostrarHome(false);
        setMostrarPresentacionUsuario(false);
        setMostrarPresentacionArticulos(false);
        setMostrarPresentacionEmpresas(false);
        setMostrarPresentacionIngresoA(false);
        setMostrarPresentacionVentas(false);
        setMostrarPresentacionAperturaCierre(false);
        setMostrarStockDisponible(false);
    };

    const showPresentacionArticulos = () => {
        setMostrarPresentacionArticulos(true);
        setMostrarHome(false);
        setMostrarPresentacionPersona(false);
        setMostrarPresentacionUsuario(false);
        setMostrarPresentacionEmpresas(false);
        setMostrarPresentacionIngresoA(false);
        setMostrarPresentacionVentas(false);
        setMostrarPresentacionAperturaCierre(false);
        setMostrarStockDisponible(false);
    };

    const showPresentacionEmpresas = () => {
        setMostrarPresentacionEmpresas(true);
        setMostrarHome(false);
        setMostrarPresentacionArticulos(false);
        setMostrarPresentacionPersona(false);
        setMostrarPresentacionUsuario(false);
        setMostrarPresentacionIngresoA(false);
        setMostrarPresentacionVentas(false);
        setMostrarPresentacionAperturaCierre(false);
        setMostrarStockDisponible(false);
    };

    const showPresentacionIngresoArticulo = () => {
        setMostrarPresentacionIngresoA(true);
        setMostrarHome(false);
        setMostrarPresentacionArticulos(false);
        setMostrarPresentacionPersona(false);
        setMostrarPresentacionUsuario(false);
        setMostrarPresentacionEmpresas(false);
        setMostrarPresentacionVentas(false);
        setMostrarPresentacionAperturaCierre(false);
        setMostrarStockDisponible(false);
    };

    const showPresentacionVentas = () => {
        setMostrarPresentacionVentas(true);
        setMostrarPresentacionIngresoA(false);
        setMostrarHome(false);
        setMostrarPresentacionArticulos(false);
        setMostrarPresentacionPersona(false);
        setMostrarPresentacionUsuario(false);
        setMostrarPresentacionEmpresas(false);
        setMostrarPresentacionAperturaCierre(false);
        setMostrarStockDisponible(false);
    };

    const showsetMostrarPresentacionAperturaCierre = () => {
        setMostrarPresentacionAperturaCierre(true);
        setMostrarPresentacionVentas(false);
        setMostrarPresentacionIngresoA(false);
        setMostrarHome(false);
        setMostrarPresentacionArticulos(false);
        setMostrarPresentacionPersona(false);
        setMostrarPresentacionUsuario(false);
        setMostrarPresentacionEmpresas(false);
        setMostrarStockDisponible(false);
    };


    const showStockDisponible = () => {
        setMostrarStockDisponible(true);
        setMostrarPresentacionAperturaCierre(false);
        setMostrarPresentacionVentas(false);
        setMostrarPresentacionIngresoA(false);
        setMostrarHome(false);
        setMostrarPresentacionArticulos(false);
        setMostrarPresentacionPersona(false);
        setMostrarPresentacionUsuario(false);
        setMostrarPresentacionEmpresas(false);
    }

    // Usar useEffect para establecer el estilo del body al montar el componente
    useEffect(() => {
        document.body.style.minHeight = '10vh';
        document.body.style.display = 'grid';
        document.body.style.placeItems = 'normal';
        document.body.style.backgroundColor = 'rgba(251, 249, 249, 0.84)';

        // Limpiar el estilo cuando el componente se desmonte
        return () => {
            document.body.style.minHeight = '';
            document.body.style.backgroundColor = '';
        };
    }, []);

    // Estilos de flexbox para ocupar toda la página
    useEffect(() => {
        document.body.style.minHeight = '100vh';
        document.body.style.display = 'flex';
        document.body.style.flexDirection = 'column';

        return () => {
            document.body.style.minHeight = '';
            document.body.style.display = '';
            document.body.style.flexDirection = '';
        };
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: '¿Estás seguro de que deseas cerrar sesión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/'); // Cambiado aquí
                Swal.fire({
                    icon: 'success',
                    title: 'Sesión cerrada',
                    text: 'Has salido de tu sesión correctamente',
                });
            }
        });
    };



    const IconNavLink = ({ base64, rolesVisible, onClick, tooltipText }) => {
        const userRole = idRol; // Este valor se obtendría dinámicamente de la sesión o el contexto de la app
        const [showTooltip, setShowTooltip] = useState(false); // Estado para manejar la visibilidad del tooltip

        // Verifica si el rol del usuario actual está en la lista de roles que pueden ver el ícono
        const isVisible = rolesVisible.includes(userRole);

        return (
            <Nav.Link
                style={{ display: isVisible ? "block" : "none" }} // Muestra solo si el rol del usuario está en rolesVisible
                onClick={onClick} // Agrega la función de clic aquí
                onMouseEnter={(e) => {
                    e.currentTarget.firstChild.style.transform = "scale(1.4)"; // Agranda el círculo al pasar el mouse
                    setShowTooltip(true); // Muestra el tooltip
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.firstChild.style.transform = "scale(1.2)"; // Vuelve al tamaño original al quitar el mouse
                    setShowTooltip(false); // Oculta el tooltip
                }}
            >
                <div
                    style={{
                        width: '40px',  // Tamaño del contenedor circular
                        height: '40px',
                        borderRadius: '50%',  // Hace que el contenedor sea circular
                        backgroundColor: '#dfdddd',  // Color de fondo gris
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #ccc', // Borde gris claro
                        transition: 'transform 0.3s ease', // Transición suave al agrandar
                        position: 'relative', // Necesario para posicionar el tooltip
                        margin: '5px'
                    }}
                >
                    <img
                        src={base64}
                        style={{
                            width: '24px',  // Tamaño del ícono dentro del círculo
                            height: '24px',
                        }}
                        alt="Icono"
                    />
                </div>
                {showTooltip && (
                    <div style={{
                        position: 'absolute',
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '5px',
                        marginTop: '5px',
                        zIndex: '1000',
                        whiteSpace: 'nowrap',
                        color: 'black',
                    }}>
                        {tooltipText}
                    </div>
                )}
            </Nav.Link>
        );
    };

    return (
        < >
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <IconNavLink
                                base64="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAtUlEQVR4nO3SP2oCQRhA8Z8WYitYS5qUYqFXsPMUdt4iV8gd0uUQAcXS1kYrEa3FToSRwAjLsv7dBQv3wYMphvcxH8M70cIs+n8ulDZWCNENukXF+9gl4mf3GOSND3HIiJ89YvRMuIKvK+G036jeG6/h54F4iP6ifivewN8T8RCdonkp/oF5jniILvCZjnewLiAeolv0kgOWBcZD4iWZ5A3f5GUD0pQDlCu6yCTjh4xz3CtxlRNLzeteM7X5aAAAAABJRU5ErkJggg=="
                                onClick={showHome}
                                rolesVisible={[1, 2, 3]}
                                tooltipText="Reporte de ventas"
                            />
                            <IconNavLink
                                base64="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABsklEQVR4nO2Yu0oDQRhGT6MBr6CIYiFip4KFD6B4K8ReRBEfQAwiVlZeQCwstAkEfQqxV+zEdxAFjU3EQkUhG0YGJhAGQmZ3J5lZ2QMfpFgm59vJbnZ/SPnf9KokhnYgC9wCP4BQkZ9vgC11jJesAm9V0rVSAFbwjBMDcT3HeMJuBPlKtl3LTwBBjAIlYNxlgesY8pVcuZLvB8oWCpSBARcFNizIC5V1FwUOLBbYd1EgZ7FAzkWBvMUC+bRABNIdIP0JxePc4kV8RsIe4vTsuCiwZLHAoosCrUDRgvy7WoukXgenOKQbeIkh/wx04pgF7QXeNN/AFJ4wC3yFkP8EpvGMuxAF5LHekRZwTaJ3YFBN3EwLvAI9eEAXsAd8RLiNysKbQJurkcpRRHE9ReBQrdlwxoBL4NeCuB655gUw2gjxPrW4jUFWvQTqdVV+pxXmDcfmtlMA5uLKL6sBbLPlRdVurMU583Emz7ZSAmbCystH3CcP5IXKI9ARpkDWA2mhRf5nGPPggbDQcm8q39Kk22XYBMqtLsMeyIoaGTIpMOmBqKgR6VaXDDDiaTImBVJSMOcPaPVTY8cXWtcAAAAASUVORK5CYII="
                                onClick={showPresentacionUsuario}
                                rolesVisible={[1, 2]}
                                tooltipText="Gestión de usuarios"
                            />
                            <IconNavLink
                                base64="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEbElEQVR4nO2ZW4hWVRTHf6PZqDNdMYkCCa9RmZZOqQ9lL6FOdIEUBINI7QJ2l1IjNc1SsKjEF7EsrPDNAkOsfIqIshTqTRDDSrJsNBu/0dGZIwvWge1m387lCwQXLGb4ztr/tdbZe6/bgYt0YdFQ4FqgpQnYQ5qIzRzgR6APyIBu4A1gcA3YDwLfG9gN4C11qBZ6VoFdfAy4rwL24wHsf4GHqxrfDvwXUCJ8FGgtgS1ruiLYJ4C2Kg7cE1GQc0cJ7DsTse+u4sCsRCXiaFGanojdWcWByYlKbi6BfVMTd/e8c3oqouAkMKgE9kA94yHsXg3dpek2oD+ipL/kDtxohM4QyykoTeMTt3lMCezRidgTqEivRxS8WgF7WQT7TWqgK4G/PAoOa66w6RrgUWC1GnmvB7sN+MOD/TdwFTXRDOC0paDHEz7n68W2DfoYuN0TThuWrOiaSc30mqVkiUNmWuRiNjxOvGzJrarbeJeSZxwyHyZcyvcd655OeDmV6T1LyVqHzLcJDnzjWLfGktlYp+Gt+vbPWkokwb1gJZrdCQ58bcgPAZ5zJMs+vfyVynWJv+8C/yRUow/omk0JDnygslLjHI3IduluTCpi+EPAd4lJJufnde3KBFkJra5zn0V4DzA7ZLhs52eeUuFL4DHgLmCUlsKLgd9UJm88vkowRI5Z3on1Azs09E4BRgJ36Av51bP+C1999KlDeL8n7OUkiWa5nlehFxMcEMfRFzI1gH05sNRT8G1zZUT7kh4BrtfnkzQRHdRzK/3xPCtb57QzYPwuQ26A/r0V+Ag4oNh7gQVWPXbccckvMx24BPhJL03OC4w70esxaB8w0XoZHR75XkdtPzNQrv+iR1XoScu2PWpzUgj9M3IkDhpvM6fZVkbu08mG3Q8cimAfLtlrnFcalC15u6zphU2ycynYoXsSpc5EJa6irtt4Lv+XHRh0VnFgaskdmGV1cv0aNk2SNU3fgXZHdMocpe9Q41hsAc445ARnq9Eiyv3qiWD3WRGuMI3xGGM7cIPKH0h4o5KghEYkDAzOau9cmqYUPEK+7GmyZO8i/fa0Kg4M0G0PKdissqMSDRIem1j8feII0YXpOk+LmGmaH6Yj8e0FHPhc1wwLzIYaRiVQmVxTZIksj+jzOQWMz3murp3nmT09QZM7snX6+/CEjOq7C8MVY631bANNoJcsJVLPo2EzK8lbFGOR9bt0gLXTGs9AS8Lh24HZkYul6nzHCL+vJPTbleh+x4eOE1aaH6St5a5IPyzV7aXWzOm4JXdS5SrRFcBTWrqG3uYPWu6aGbNDS+1c5mcrnkstvzChdd2rx+vqIobfoo23PS2LcUPXydw/35Ht2jLmn6DGaew3C70sgXs0HwUHvS169mKlQ4zP6EC4RY9KbvyKQGOUJbKUFut9yW1dRfAsMB5cXjP2etv4wQmVYVHu1rYv5UtMVpBP2ZOJ1oJhMIV/V+MHamtYJ/YR16fddp3L1MXm9922mrHbQ5f5IvE/0jln+OSzSiCfmAAAAABJRU5ErkJggg=="
                                onClick={showPresentacionPersona}
                                rolesVisible={[1, 2, 3]}
                                tooltipText="Gestión de clientes"
                            />
                            <IconNavLink
                                base64="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC80lEQVR4nOWaz0uUQRzGnzU6aIcQ9uDFIjuJR0/mtcB/oFuH8JC3yC51ELpll4Q8CB2EQAQNbwoJgocVBDfxsIYgkr86qAitobWV1hsvPAMP476507yu79t+4QH9vDs787zzfmfmnVngP47LABo9lHGsLxO3gS4AgYeyDnVdB/DQp7GXALRYuu9poN36vmsRdbcA2AYwbH2+2aVXsp6NrUSbZeptYuP/VqYzyQbqeOfD61sAZkTvyXcANCTVgJoYwOl4x7K34GhgH8BbaoFsVdgq2YKwfbJpYScVGDAmOnA6Rlg2HFCcDOTk2j0yvUMDZOE1EzmyVmFfKzQQFf9sYA3AA8o8ozPCZsiGha2RPRP2A8Br6jnco5tl21wNxKmqRNaq9BOAF9QkWV5YnmxSWFjmjfxvFEY9gCceulGtHGiv8Ptd1VWtHjAGnlq98MrTwHiZnr0S5x0yMgY2zzGngnJrLdvACoC71CDZlLApskFhK0kykPPMgQs3UJQ1yXKZtcoW2bKwYoSB7wBuU91kBWH9ZBPCJsj6hRVcDMSZA+FsbKLVs4eDSg0ssTGh+shGhY2S9QlbijDwC8Ai9YHsUNg62a6wXbJ1YYc1lQMlAB+pPbIDYQdke8JKEQa+yVvWHbK8sF4yfSMz669eYfmayoF52V3oIRsSNkTWI2w+wsBvAJ+pL2THwo6k1w0rkR0JO64pA0HaH6FS2pM4l/ZhdCntE1mQ9hwopn0xl0t7DqzE+EJzIhtd0zFsnAU1kQNBjAZ+yvbIS7INYWNkc8LmyMaEbVyUgarkQL3nxpNR00X1QNxR9RwoF23cWA3Hbh8Dx7LBOy6HFobNkhWEmTF/VtiOqwFzyDfiaaAqOeBqoIOHElFhz8RmrnjkOc8ELgY6+cHwmMeOAS5565KcAw2yKly0DuDMWijKhD0Tm3LznmutwHUU6jzjed6WoTNxOaDRbB1CD7Px4d9IgwE7HgO4iehIvIHMGdevev5QpPEcfkySzPgDe73s80GkzWcAAAAASUVORK5CYII="
                                onClick={showPresentacionEmpresas}
                                rolesVisible={[1, 2, 3, 4]}
                                tooltipText="Gestión de empresas"
                            />
                            <IconNavLink
                                base64="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADEElEQVR4nO2ZO2gVQRSGvyTeGJ9RiKIWUQQbGx8RBEWCL6JoIRI1EdEiIpZGCxHUQi3EQohY+EBTiGJ8NEHRgLHQIgSDqIilEBXRQlFjElTCyoGzMCx7c8/c3OTuveSHv9jZc86cf2fm7OwsjMOEmRQgFgH3gEEgAH4BrcAcCgArgZ+aeJQfgLkkGDOAj2mSD9kFlJJQnM6QfMidJBBlwGdD8n+A3aOVRCWwAVgBTAJKgI3ADodbgAkxvuuMT/+w2k8BNkViR1kHVFiT3wX8cDoaALrTJNEY499iSL5PH4zwrVHwCyCVKfmpOrRDwAOgUzsLg7wBLgMv9fpATIwuQzISR1BrTD5kjWUEmoD1zrWoPq4BzmvbmTQCUk7Nlyf7GLgD3FLhHXqvR+1l6vgIWEMWkLl3XQM8B44CT/X6JjDZsV3sdLY2EqfWWdxjKmCrRymsc9o/AReU0TX0Wu0lIR8BS7MRsD1D0D2O7X5jIgNa6aTkPjP6tGeTvK+Ak1ksyHdG+3DaeaEeeJghcLfWasE5YzJS6cp1yzHk6WOGNRnhMfW56LS16YJv1mq1F7gReZrycvRZA8utyVd6PBnhIfULq1XgjIpgGnAC+Kf3rmj7EU8B7nQdFss8Ax9Uv9tO25C+8F4BfyP2MiqCa579nLIKqPEMvE/92o32mz3e2kFkWo6KANk/CZ4Y7ReovbvnslBG04SJwEIPyo5SMM9oX6L06UM4n2JHI9ALfE84e4EGYnaSvz3nZD7ZF/0+qEpAUoEnq4pKQCnwNQFJBUZ+iTuWWa1fTT0JZwewimLGdD1WGY7VMfunqI1bJVIx98XHRbWhX8ktI5YY5mC4IQvxKMMiiysS4uOiOVcnE2WGBZ0PAYPWEUD37EkTcB8P1CVQQIOPAFl03xIkoF9PDr3QmiABd8nxoZacm551+D7GpsW5H3foKz5ujE7DR5MXynX7GuSZ/c5HkzfCo5B8so0RYFsCBNSPRECF/h4tyOkT4moeBVwiR3/Zw58TY8l2n62DBbOzOArJlrNymfg4xkF6/AdqYTP+usvl6gAAAABJRU5ErkJggg=="
                                onClick={showPresentacionArticulos}
                                rolesVisible={[1, 2, 4]}
                                tooltipText="Gestión de artículos"
                            />
                            <IconNavLink
                                base64="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACPklEQVR4nO3Yz4tNYRzH8RdGYSkSImKBiGKjSBbKwoYMUvgDZKEsrGRDmuRHoRClFGU1kY1i/EojG2VSFpIf+dEkP0Y0g6Oj59btdM+9x50zM+fmfOpbt3Of5/k87+fH95znoVSpUqVKlSpVqtRi7MWhIY5dmJr3cG/CAKJhil7MzRPg2TB2vhJn8gT4PQIAXXkCRCMQd0qAKpUzoPkltBqPUuIeTmTJWCM5AxsylP2B7a0MEOEXtrQyQIQ+LGhlgAhPMKGoAAPYirE1BrkNt0O5c0UFuFRvo2I6PoSy24oIcERjrQ0b+ivmtSJArAOh/H2MakWANvSEOuuLBHBMdrWHOteKBNCN0RkBxuEn3hUJIEJnSKXtGeJLqFMogKiJKAGicgaUS8h/sYl7cRg7cRSfhgDgPTqCx/HwzZMLwMMaV4Iz8DhHgLuYnPCYjaeNACovhLT4XudgvajJa8kbCYA+zEzxWFbn8i3uu8sZzdL0oAmAfQmAzgYeaTP99wwRT9vNOmZXGjR+/R87fxXjEwAXGnh01WjnVnLJxWt6aVWsCQWfY0xKw/Hx7204ZKxM1K8V0xL1VwSPnsq3fcqH20f0Y3loJ+5rJnUHgz0p/+/PuMzUGYBXoY0489RSR8ZlVlOrwuj+Cil0Ung+BSfD5uoPo9KsNocOxsngICaG5/FsnQ0ecSJZ2KzBjnA7Vll7n6t+f8NGg9fuRDar9ogzzbrBGszHebwOI/4SpzEnh85XtAQX8SZ4vMApzKpX6w/KdpLty0KX+gAAAABJRU5ErkJggg=="
                                onClick={showPresentacionIngresoArticulo}
                                rolesVisible={[1, 2, 4]}
                                tooltipText="Ingreso de artículos"
                            />
                            <IconNavLink
                                base64="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACV0lEQVR4nO2ZPUwUQRTHfxrEjkAhUlhcAwlQWGBDBaHSWCl0UNNgKKSwvVLE8FFQUBzXUdjYoMVpQmIpAQoqEpLDRKmEKImxEdZM8i55bvaDvf2ajftPXm7v3ZvZ/39n5r25WUgPncCCmLkuFAaBPcAROwTuUwDcAOaB30L8UswR37zEWIm7wLZ66l+AcWAUOFb+D8A9LMMk8F2RfAP0qN+7gA31+w9gGgvgRWwmIH4qRGimcE+Nj9ecGn3AO4+plhk6gCrwRy3OF8DNCH2YhTwL/JI+roA14DYFS49DWaXbNJ/YrQRGtK30mDRG00i3YekxaXQllW6jpsekMRXnwbWbHpNGX9R0m0R6zC15DAP7Su2B+KLisUw9P1uTJxsVw8KpxW9f83vo2j0uxti/H6qb+NnzNvvuFG56d2u4UxPHV2CMeHgUMgKrkpbjYEy4OsKdunwxn0VBXXMuBeSA+n81Ak+lHuRhT+IK6JXi4eRkV8CdOAIqOZJ3xCpZCvgJLAMvgU3l3xTfCnBhs4BXPm01iSWbBVRV227gk5i5bqFaFAF+KAVQjgDlFHJsXcRLhOO1zVnoQv41+e1tFm0vZE4KVklLwLKcGBg7EV9D+d6r2G3lb4jPtGn5VrIW8M0Vt+NRyAZUvLl2FzLTRuM0SwFNV9wz4C0w4dNWk5iQ2DlXH808BXjBT4AfmqUAyhH4B+UUIsVFfCavhoLwQMWPXOPc8zzuIj7yOMvcCigwnwPOQGtynu+oolULiN8NuM+WR/yRFqDfxBTNNowAUyXXQ06VbTTDuf8viqBzCjWLw4UAAAAASUVORK5CYII="
                                onClick={showStockDisponible}
                                rolesVisible={[1, 2, 3, 4]}
                                tooltipText="Stock disponible"
                            />
                            <IconNavLink
                                base64="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFP0lEQVR4nO2ae2hXZRjHP13+SBpOUzbK0tLlKlpBusAsXbXJhByUWqm//vCfHJbdL+qEJrXKP5qrLCpN7cIs89eCBKkYeYkVaIZK1igxi5JC81q2izvxjO8PToff7ZzfCzuBDzywHc9z3ud93+f7XL4TzsgZySbFwAjgPP4HMgp4EPgIOAj0AJ5P/wK+A14D7orTps4Cnk/jcC79FbiZGEh1SMf9ajc14HIxcCjiBj4gBjICuBx4EziSp+Odwks5MZAE8D0wFxgGjAPmA43Ay8Aq4AVgETBLG74KeA74m5hswJN2AduB1drAI8A84ElgGfAhsC9wGwMuMwsA8T/EpFjtjriBp4mBXCMwLgC26lSzOf078D5QBUwjJhg4CawAJulGJgB1ArYBejZQC1whoN8DfBoXDCQCJ9ytkNoItAIrgfVAO/BzmhsZcKkrAMTHiIGcC7wXwXlr7u72f+hs4DrgYaAZeAv4GFin+LS8PBUocryBKmAKcAOwHNgJnM7g9HFgE/CEulfzifPVDR7Oc+c92tjVjjHwpQ7PKvEQ4CKgAqhUlhoOlAI1QAvwWwoDn0WMvxPAaIcb8Hzaq06zUzdi1fdoBj84UACIbnIUQl5EtazUH/ffhjS0WHwAd/K4akEYH2w6G4/iuUwnsRT4HNgvJz1VRpt+vtE4Z8i/EGgApjtw/g5gsbrMhLrPXYrxLl+4/gRsAZ4BblULbr73v2Co3wYsVKaxDQ1ViisSoKw63gu869ucLegKA8eBd7TGBK1ZJB+Gyqep8nGbL1NFjj/XG/AiKl9HNOx2lEorIgz0KbXZgctUrHpDGO7WMD4oi2PnACVS+zmTDFJu3xNi/V71SeY7PwqMFnO3qwongc0CbofAYlNSvTrCa/WOP4RuFMC+yDDbHtG/WQ8/0WeXADaorb5Sa6zWmh3yYbPWa5aP5usM1Yf/LGBd3xLgTp2wpanJ6rvvB15X+vJjoEQLhL1+y3YlAQzs1Rr3ac3J8qFaZNYS+eg/oIx9Rz5qffqrBdi/om9EtTffaYtofFiczhygL4K92Zjzl4Tow4JqYdUf048JC/n24GuAsSo+o1VY2vPMJj169xZgjL5hzdpaX33JpebroyleyLiVZwWgkYrJBnExq8TNNCouK9UVzlWjldAptCmTFGv0MzqkCXhD2qRntXpnikjcZIAXsm9fL7wtDfBCi3XbI4O8kH9n+8S9LBMXM08LN+rUd/jKewrESd/vf+p0X9KCC6QNcqZd7/hDIFEoL+R3KKzOVA2Jat/qghdqimhsDddgpboTEezNZpILXug28eyWX//IY8dbFaPlKj41AnSz8niuRfcqps2mxgUvZA8/EdcyTGCuVYqbL3DVqUMcrFNbof49hYEf1CWO1dhXpepeL52uZ6V6Z5EySdIFL5RuymnXjaxUnG7UNXcH3g2C2NPo1yHArRU50KZnwbEw6YIXOlYAiKbJyaj2a1zwQrPFsYQ1btWwUaaaENbecv8YF7zQU8ClyrWbsmSU02IIlitGaxXX9Rrv5mii+iXLohYCb+vQDAv1LnghTzNvi7JCqSpiuSpvhdrXIeJsjLv5KoCBU2qJZ+lGirXAOOkoPSvTOxtkk3TBC6Xb6VFVvJ0Kj4MZBp50IPbk3AENKXv086k07yVd8ELZrjyXWhF7sQD7Fhe8UGUEEJ5UN4iuOxmype7Tn0iLXfBCKWK3WiPhFnEwKTB3Kd52KSfblV+QZra1AviQusxO/e23T3pIz9r0jhWkoNg3w/BC5nNOyTaM5yP23whMC5GsPvwLpyxrMVFcrwkAAAAASUVORK5CYII="
                                onClick={showPresentacionVentas}
                                rolesVisible={[1, 2, 3]}
                                tooltipText="Gestión de ventas"
                            />
                            <IconNavLink
                                base64="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADCUlEQVR4nO2aSWgUURCGv7gT8BANuIJbgmCMHoIHwfUgxmNEvSiKiqMH0ZtGEj2JC6IICioEoqLgVSSI5iCKuJBj9GQSVCJEjUmQgKJjWipU5PHsbXqme6bFgv9S87pefdPv1VtmIBmbCHQDTgQNAVUU2SojJu+o6v8DpP0NLALqctSMUgFYA4xE6PQLML4UAHZokHdAe0h902fKSwngQg7PvP3XACryBNhQSIAVQMZDlR4AYkeAa6q7AQk/M9qeteKEsnnAPuAocMcCOOnTcZ0F0KwxbF0JALhntZdcFoRNfifwwyXoGMBG4IyH5lgAhVQWOBCU/HRg2CNAlDlQaH0HZvl1vMvn4WK/AUclw8nTLoYAyGUOmPoANPkUgIwlGS4tOnTMOJf8AO6HAFgKbPVQhQ9ALdGs2Yrz0K9xTwiAMGYDDBLdllmxZEfgalOAXyEAdvtsIao9AD7nAVBu7cVGvNaF2oDJk88cyAcAnT9mvOW42JaQALN9ttDlMQE8seJtc2vUFBIgjNkAUkmm5gHw2Ip33K3RzRgBRLciQIwDGlxKqcT6y14GAMgefyCkvIpBNocYAz67gg43gMEAgFLSV6DMTH5mAp026EI3DTilvn6gRv2yx3mgfpm0c9W/GOh1iSfF5I+tTQBg7Hwstlp9Tz0KyekQO4R1ZoNMCgH2mw3OJwCwF1io14SXjWvDVeqvMep9hy6s4l8JfAyqim0JABRabSbAmwQ6HNYL3m6rrver773Vvlf9nzzidY0lP8lloYhD840vbLv6eoAJhv+q+m9bi1mnSzzJebI0WJLQKy/0JHY099H6nATA6Leltl59L6xET6j/nOVv94i5WT5sTAigxTguPlLfTz1xie+gcaCS8X9I/Y3GVaWtYwJwPSGAONQqAM9LIBEnouQGb7QcDaRUXeiGKc3CSbkodgJOqQL0AYdVfWkEqDcWok1pBKgyAKrTCNCqfzEQ3YgTIBtj8CFVXPGzAvA6xg7iVif6g4GTUu0RALlfEYhXCR1s8pXkKLnKGbvsN2rhAsDzVRnmAAAAAElFTkSuQmCC"
                                onClick={showsetMostrarPresentacionAperturaCierre}
                                rolesVisible={[1, 2, 3, 3]}
                                tooltipText="Apertura y cierre de caja"
                            />
                        </Nav>
                        <Nav>
                            <hr />
                            <Nav.Link href="#">{nombres}</Nav.Link>
                            <br />
                            <Nav.Link href="#">{rolName.toUpperCase()}</Nav.Link>
                            {cleanedFoto && (
                                <img
                                    src={`data:image/jpeg;base64,${cleanedFoto}`}
                                    alt="User"
                                    className="img-fluid rounded-circle"
                                    style={{ width: '40px', height: '40px' }}
                                />
                            )}
                            <br />
                            <Nav.Link onClick={handleLogout} className="text-danger">
                                <FaPowerOff size={30} style={{ marginLeft: "15px" }} className="nav-link-logout" />
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {mostrarHome && <Home />}
            {mostrarPresentacionUsuario && <PresentacionUsuario />}
            {mostrarPresentacionPersona && <PresentacionPersona />}
            {mostrarPresentacionUArticulos && <PresentacionArticulos />}
            {mostrarPresentacionEmpresas && <PresentacionEmpresas />}
            {mostrarPresentacionIngresoA && <PresentacionIngresoA />}
            {mostrarStockDisponible && <StockDisponible />}
            {mostrarPresentacionVentas && <PresentacionVentas />}
            {mostrarPresentacionAperturaCierre && <PresentacionAperturaCierre />}
        </>
    );
};

export default ViewPrincipal;
