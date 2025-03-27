import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const FooterComponent = () => {
  return (
    <footer className="site-footer bg-dark pt-5 pb-4">
      <Container>
        <Row className="justify-content-between">
          <Col lg={3} className="mb-4 mb-lg-0">
            <h5 className="footer-brand d-flex align-items-center text-light">
              <span className="fw-bold">TicketVision</span>
              <span className="ms-2">🎬</span>
            </h5>
            <p className="mt-3 text-light opacity-75">Il tuo biglietto per il mondo del cinema. Prenota semplicemente, guarda comodamente.</p>
          </Col>

          <Col md={5} lg={4} className="mb-4 mb-md-0">
            <h5 className="footer-heading text-light">Contatti</h5>
            <ul className="footer-contacts list-unstyled text-light opacity-75">
              <li className="mb-2 d-flex align-items-center">
                <i className="bi bi-envelope me-2"></i> Email: emanuelebianchi00@gmail.com
              </li>
              <li className="mb-2 d-flex align-items-center">
                <i className="bi bi-geo-alt me-2"></i> Città: Senago, (MI)
              </li>
              <li className="d-flex align-items-center">
                <i className="bi bi-github me-2"></i>
                <a href="https://github.com/EmaBia00" target="_blank" rel="noopener noreferrer" className="text-light opacity-75 hover-opacity-100">
                  GitHub
                </a>
              </li>
              <li className="d-flex align-items-center mt-2">
                <i className="bi bi-linkedin me-2"></i>
                <a
                  href="https://www.linkedin.com/in/emanuele-bianchi-815550227/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light opacity-75 hover-opacity-100"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </Col>

          <Col md={5} lg={4}>
            <h5 className="footer-heading text-light">Legal</h5>
            <ul className="footer-legal list-unstyled text-light opacity-75">
              <li className="mb-2">
                <Link to="/privacy" className="text-light opacity-75 hover-opacity-100">
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/terms" className="text-light opacity-75 hover-opacity-100">
                  Termini e condizioni
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-light opacity-75 hover-opacity-100">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="mt-5 mb-4 opacity-25" />

        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0 text-light opacity-75">&copy; {new Date().getFullYear()} TicketVision. Tutti i diritti riservati.</p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <div className="social-links">
              <a href="https://github.com/EmaBia00" target="_blank" rel="noopener noreferrer" className="text-light opacity-75 hover-opacity-100 me-3">
                <i className="bi bi-github"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/emanuele-bianchi-815550227/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light opacity-75 hover-opacity-100 me-3"
              >
                <i className="bi bi-linkedin"></i>
              </a>
              <Link to="#" className="text-light opacity-75 hover-opacity-100 me-3">
                <i className="bi bi-instagram"></i>
              </Link>
              <Link to="#" className="text-light opacity-75 hover-opacity-100">
                <i className="bi bi-youtube"></i>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterComponent;
