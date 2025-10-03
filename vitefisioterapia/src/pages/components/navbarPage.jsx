import React from "react";
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
import { FaBars, FaSearch, FaQuestionCircle, FaCog, FaTh } from "react-icons/fa";

function FisioNavbar() {
  return (
    <Navbar
      bg="primary"
      variant="dark"
      expand="lg"
      fixed="top"
      className="shadow-sm"
      style={{ height: "70px" }}
    >
      <Container fluid className="px-4 d-flex justify-content-between">
        
        {/* Menú Hamburguesa */}
        <Dropdown align="start">
          <Dropdown.Toggle as="div" style={{ cursor: "pointer", color: "#fff" }}>
            <FaBars size={24} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#usuario">Usuario</Dropdown.Item>
            <Dropdown.Item href="#cita">Cita</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Logo + Título */}
        <Navbar.Brand
          href="#"
          className="ms-3 d-flex align-items-center text-white fw-bold fs-4"
        >
          <img
            src="https://img.icons8.com/color/48/000000/health-checkup.png"
            alt="Logo"
            width="35"
            height="35"
            className="me-2"
          />
          Fisioterapia
        </Navbar.Brand>

        {/* Buscador */}
        <InputGroup className="mx-3" style={{ maxWidth: "500px", flex: 1 }}>
          <FormControl placeholder="Buscar paciente, cita, usuario..." />
          <Button variant="light">
            <FaSearch />
          </Button>
        </InputGroup>

        {/* Iconos y Avatar */}
        <Nav className="d-flex align-items-center">
          <Nav.Link href="#" className="text-white mx-2">
            <FaQuestionCircle size={22} />
          </Nav.Link>
          <Nav.Link href="#" className="text-white mx-2">
            <FaCog size={22} />
          </Nav.Link>
          <Nav.Link href="#" className="text-white mx-2">
            <FaTh size={22} />
          </Nav.Link>
          <Image
            src="https://via.placeholder.com/40"
            roundedCircle
            width="40"
            height="40"
            className="ms-3 border border-light"
          />
        </Nav>
      </Container>
    </Navbar>
  );
}

export default FisioNavbar;
