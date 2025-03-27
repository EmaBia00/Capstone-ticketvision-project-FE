import React, { useState } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { resetPrenotazioni } from "../redux/prenotazioniSlice";
import { FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaCogs, FaHome, FaSearch, FaTicketAlt } from "react-icons/fa";
import "../styles/Navbar.css";

const NavbarComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authState = useSelector((state) => state.auth);
  const { email, role, name, isAuthenticated } = authState;

  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetPrenotazioni());
    localStorage.clear();
    navigate("/", { replace: true });
    setExpanded(false);
  };

  const closeNavbar = () => setExpanded(false);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" expanded={expanded} className="navbar-custom">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center" onClick={closeNavbar}>
          <span className="navbar-logo me-2">🎬</span>
          <span className="fw-bold brand-text">TicketVision</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} className="navbar-toggle-custom" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={Link} to="/" active={location.pathname === "/"} onClick={closeNavbar} className="nav-link-custom">
              <FaHome className="me-1" /> Home
            </Nav.Link>

            <Nav.Link as={Link} to="/search" active={location.pathname === "/search"} onClick={closeNavbar} className="nav-link-custom">
              <FaSearch className="me-1" /> Cerca
            </Nav.Link>

            {isAuthenticated ? (
              <>
                {role === "ADMIN" && (
                  <Nav.Link as={Link} to="/admin" active={location.pathname.startsWith("/admin")} onClick={closeNavbar} className="nav-link-custom admin-link">
                    <FaCogs className="me-1" /> Admin
                  </Nav.Link>
                )}

                {role === "USER" && (
                  <Nav.Link as={Link} to="/dashboard" active={location.pathname.startsWith("/dashboard")} onClick={closeNavbar} className="nav-link-custom">
                    <FaTicketAlt className="me-1" /> Prenotazioni
                  </Nav.Link>
                )}

                <Dropdown as={Nav.Item} align="end" className="ms-lg-2">
                  <Dropdown.Toggle as={Nav.Link} className="nav-link-custom user-dropdown">
                    <div className="d-flex align-items-center">
                      <div className="user-avatar me-2">
                        <FaUser />
                      </div>
                      <span className="d-none d-lg-inline user-name">{name || email.split("@")[0]}</span>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropdown-menu-custom">
                    <Dropdown.Header className="dropdown-header">
                      Ciao, <strong>{name || email.split("@")[0]}</strong>
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/profile" onClick={closeNavbar} className="dropdown-item-custom">
                      Profilo
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="dropdown-item-custom logout-item">
                      <FaSignOutAlt className="me-2" /> Esci
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" active={location.pathname === "/login"} onClick={closeNavbar} className="nav-link-custom login-link">
                  <FaSignInAlt className="me-1" /> Accedi
                </Nav.Link>

                <Nav.Link as={Link} to="/register" active={location.pathname === "/register"} onClick={closeNavbar} className="nav-link-custom register-link">
                  <FaUserPlus className="me-1" /> Registrati
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
