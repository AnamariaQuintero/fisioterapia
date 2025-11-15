import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Navbar,
  Nav,
  Container,
  Dropdown,
  InputGroup,
  FormControl,
  Image,
  Button,
} from "react-bootstrap";
import {
  FaBars,
  FaSearch,
  FaQuestionCircle,
  FaCog,
  FaTh,
  FaSignOutAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";
import "./stylesComponents.css";
import { getAuth, signOut } from "firebase/auth";

function FisioNavbar() {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión actual se cerrará.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      background: "#f9f9f9",
    });

    if (result.isConfirmed) {
      try {
        await signOut(auth);
        Swal.fire({
          icon: "success",
          title: "Sesión cerrada",
          text: "Has cerrado sesión correctamente.",
          timer: 1800,
          showConfirmButton: false,
        });
        navigate("/"); // Redirige al login o página principal
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cerrar sesión. Intenta nuevamente.",
        });
      }
    }
  };

  return (
    <Navbar
      variant="dark"
      expand="lg"
      fixed="top"
      className="navbar-custom shadow-lg"
    >
      <Container fluid className="px-4 d-flex justify-content-between align-items-center">
        
        {/* Menú Hamburguesa */}
        <Dropdown align="start">
          <Dropdown.Toggle as="div" className="hamburger-menu">
            <FaBars size={24} />
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-custom">
            <Dropdown.Item className="dropdown-item-custom">
              <Link to="/LeerUsuario" className="forgot-link">Usuario</Link>
            </Dropdown.Item>
            <Dropdown.Item className="dropdown-item-custom">
              <Link to="/CitaPage" className="forgot-link">Cita</Link>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Logo + Título */}
        <Navbar.Brand
          href="#"
          className="ms-3 d-flex align-items-center text-white brand-custom"
        >
          <img
            src="https://img.icons8.com/color/48/000000/health-checkup.png"
            alt="Logo"
            width="38"
            height="38"
            className="me-2 brand-logo"
          />
          Fisioterapia
        </Navbar.Brand>

        {/* Buscador */}
        <InputGroup className="mx-3 search-input-group" style={{ maxWidth: "500px", flex: 1 }}>
          <FormControl 
            placeholder="Buscar paciente, cita, usuario..." 
            className="search-input-custom"
          />
          <Button variant="light" className="search-button-custom">
            <FaSearch />
          </Button>
        </InputGroup>

        {/* Iconos y Avatar */}
        <Nav className="d-flex align-items-center gap-2">
          <Nav.Link href="#" className="nav-icon-custom">
            <FaQuestionCircle size={20} />
          </Nav.Link>
          <Nav.Link href="#" className="nav-icon-custom">
            <FaCog size={20} />
          </Nav.Link>
          <Nav.Link href="#" className="nav-icon-custom">
            <FaTh size={20} />
          </Nav.Link>
          <Image
            src="https://i.pinimg.com/236x/aa/59/6e/aa596ef27b82423e67fe63206edc57f6.jpg"
            roundedCircle
            width="42"
            height="42"
            className="ms-2 avatar-custom"
          />

          {/* 🔹 Icono de cerrar sesión con confirmación */}
          <Nav.Link
            onClick={handleLogout}
            className="nav-logout-icon"
            title="Cerrar sesión"
          >
            <FaSignOutAlt size={20} />
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default FisioNavbar;
