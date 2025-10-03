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

function FisioFooter() {
  return (
    <footer
      className="text-white text-center py-4"
      style={{
        backgroundColor: "#0d6efd", 
        position: "fixed", 
        bottom: 0,
        left: 0,
        width: "100%", 
        height: "20%"
      }}
    >
      <Container>
        {/* Logo/Título */}
        <h4 className="fw-bold mb-2">TARRAGO</h4>
        <div className="d-flex justify-content-center align-items-center mb-3">
          <hr style={{ width: "50px", border: "1px solid white" }} />
          <span className="mx-2 small">1940</span>
          <hr style={{ width: "50px", border: "1px solid white" }} />
        </div>
      
        {/* Íconos redes sociales */}
        <Row className="justify-content-center">
          <Col xs="auto">
            <a href="#" className="text-white mx-2">
              <FaFacebookF size={28} />
            </a>
          </Col>
          <Col xs="auto">
            <a href="#" className="text-white mx-2">
              <FaInstagram size={28} />
            </a>
          </Col>
          <Col xs="auto">
            <a href="#" className="text-white mx-2">
              <FaYoutube size={28} />
            </a>
          </Col>
          <Col xs="auto">
            <a href="#" className="text-white mx-2">
              <FaPinterestP size={28} />
            </a>
          </Col>
          <Col xs="auto">
            <a href="#" className="text-white mx-2">
              <FaLinkedinIn size={28} />
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default FisioFooter;