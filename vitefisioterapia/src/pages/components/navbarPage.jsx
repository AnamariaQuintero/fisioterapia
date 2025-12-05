import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Navbar,
  Nav,
  Container,
  Dropdown,
  Image,
} from "react-bootstrap";
import {
  FaBars,
  FaQuestionCircle,
  FaCog,
  FaTh,
  FaSignOutAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";

import "./stylesComponents.css";

// 🔹 Firebase
import { getAuth, signOut } from "firebase/auth";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";

// 🔹 Helpers para formatear hora
const pad = (v) => String(v).padStart(2, "0");

const formatHora = (date = new Date()) => {
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${hh}:${mm}:${ss}`;
};

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

    if (!result.isConfirmed) return;

    try {
      const loginDocId = localStorage.getItem("currentLoginHistoryId");
      const sessionStartMs = Number(localStorage.getItem("sessionStartMs"));

      if (loginDocId && !Number.isNaN(sessionStartMs)) {
        const now = new Date();
        const logoutAtMs = now.getTime();
        const logoutTime = formatHora(now);

        const diffMs = logoutAtMs - sessionStartMs;
        const sessionDurationMinutes =
          Math.round((diffMs / 60000) * 100) / 100;

        const historyRef = doc(db, "login_history", loginDocId);

        await updateDoc(historyRef, {
          logoutTime,
          logoutAtMs,
          sessionDurationMinutes,
        });

        localStorage.removeItem("currentLoginHistoryId");
        localStorage.removeItem("sessionStartMs");
      }

      await signOut(auth);

      Swal.fire({
        icon: "success",
        title: "Sesión cerrada",
        text: "Has cerrado sesión correctamente.",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cerrar sesión. Intenta nuevamente.",
      });
    }
  };

  return (
    <Navbar
      variant="dark"
      expand="lg"
      fixed="top"
      className="navbar-custom shadow-lg"
    >
      <Container fluid className="px-3 d-flex justify-content-between align-items-center">

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
            <Dropdown.Item className="dropdown-item-custom">
              <Link to="/ListaAuditoria" className="forgot-link">Auditoria</Link>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Logo + Título */}
        <Navbar.Brand
          href="#"
          className="ms-2 d-flex align-items-center text-white brand-custom"
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

        {/* Iconos */}
        <Nav className="d-flex align-items-center gap-2">
          
          {/* Logout */}
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
