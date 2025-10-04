import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPinterestP,
  FaLinkedinIn,
} from "react-icons/fa";
import "./stylesComponents.css";

function FisioFooter() {
  return (
    <footer className="footer-custom text-white text-center py-4">
      <Container>
        {/* Logo/Título */}
        <div className="d-flex justify-content-center align-items-center mb-3">
          <hr className="footer-divider" />
          <span className="mx-2 footer-year">Fisioterapia</span>
          <hr className="footer-divider" />
        </div>
      
        {/* Íconos redes sociales */}
        <Row className="justify-content-center mb-3">
          <Col xs="auto">
            <a href="#" className="footer-social-icon">
              <FaFacebookF size={20} />
            </a>
          </Col>
          <Col xs="auto">
            <a href="#" className="footer-social-icon">
              <FaInstagram size={20} />
            </a>
          </Col>
          <Col xs="auto">
            <a href="#" className="footer-social-icon">
              <FaYoutube size={20} />
            </a>
          </Col>
          <Col xs="auto">
            <a href="#" className="footer-social-icon">
              <FaPinterestP size={20} />
            </a>
          </Col>
          <Col xs="auto">
            <a href="#" className="footer-social-icon">
              <FaLinkedinIn size={20} />
            </a>
          </Col>
        </Row>

        {/* Copyright */}
        <p className="footer-copyright">
          © 2025 Fisioterapia TARRAGO. Todos los derechos reservados.
        </p>
      </Container>
    </footer>
  );
}

export default FisioFooter;