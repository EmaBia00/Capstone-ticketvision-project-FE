import React, { useState } from "react";
import { Container, Form, Button, Alert, Card, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { forceRefresh, login } from "../redux/authSlice";
import "../styles/Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Credenziali non valide!");
      }

      const data = await response.json();

      dispatch(
        login({
          id: data.id,
          email: data.email,
          name: data.name || "",
          role: data.role,
          token: data.token
        })
      );

      localStorage.setItem(
        "userData",
        JSON.stringify({
          id: data.id,
          email: data.email,
          name: data.name || "",
          role: data.role
        })
      );

      dispatch(forceRefresh());
      setTimeout(() => navigate("/"), 100);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Container className="auth-container">
      <Row className="justify-content-center">
        <Col xl={8} lg={10} md={10} sm={12}>
          <Card className="auth-card shadow">
            <Card.Body className="p-5">
              <div className="text-center mb-5">
                <h2 className="auth-title display-5">Accedi a TicketVision</h2>
                <p className="text-muted fs-5">Inserisci le tue credenziali per accedere</p>
              </div>

              {error && (
                <Alert variant="danger" className="text-center">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Inserisci la tua email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="auth-input"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Inserisci la password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="auth-input"
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 auth-button" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Accesso in corso...
                    </>
                  ) : (
                    "Accedi"
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="text-muted mb-0">Non hai un account?</p>
                <Link to="/register" className="text-decoration-none fw-bold">
                  Registrati ora
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
