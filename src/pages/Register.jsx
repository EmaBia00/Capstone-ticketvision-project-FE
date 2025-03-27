import React, { useState } from "react";
import { Container, Form, Button, Alert, Card, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER"
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrazione fallita. Riprova.");
      }

      setSuccess("Registrazione avvenuta con successo! Reindirizzamento in corso...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
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
                <h2 className="auth-title display-5">Registrati su TicketVision</h2>
                <p className="text-muted fs-5">Crea il tuo account per iniziare</p>
              </div>

              {error && (
                <Alert variant="danger" className="text-center">
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" className="text-center">
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome completo</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Inserisci il tuo nome"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="auth-input"
                  />
                </Form.Group>

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
                    placeholder="Crea una password (min. 8 caratteri)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="8"
                    className="auth-input"
                  />
                  <Form.Text className="text-muted small">Usa almeno 8 caratteri con una combinazione di lettere e numeri</Form.Text>
                </Form.Group>

                <Button variant="success" type="submit" className="w-100 auth-button" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Registrazione in corso...
                    </>
                  ) : (
                    "Registrati"
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="text-muted mb-0">Hai già un account?</p>
                <Link to="/login" className="text-decoration-none fw-bold">
                  Accedi ora
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
