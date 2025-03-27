import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert, Spinner, Badge, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "../api/userApi";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, email, role, isAuthenticated } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ name: "", email: "", currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const usernameFromEmail = email ? email.split("@")[0] : "";

    setFormData({
      name: usernameFromEmail || "",
      email: email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  }, [isAuthenticated, email, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError("Le nuove password non corrispondono");
      return;
    }

    try {
      setLoading(true);

      const updateData = {
        name: formData.name,
        email: formData.email
      };

      if (formData.newPassword) {
        if (!formData.currentPassword) {
          throw new Error("Inserisci la password corrente per modificarla");
        }
        updateData.password = formData.newPassword;
        updateData.currentPassword = formData.currentPassword;
      }

      await updateUserData(id, updateData);

      if (formData.email !== email) {
        dispatch(logout());
        navigate("/login");
        return;
      }

      setSuccess("Profilo aggiornato con successo!");
      setIsEditing(false);
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      setError(err.message || "Errore durante l'aggiornamento del profilo");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container className="profile-page py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="profile-card shadow">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">Il tuo profilo</h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="mb-1">{formData.name || "Utente"}</h4>
                  <Badge bg={role === "ADMIN" ? "danger" : "primary"}>{role}</Badge>
                </div>
                <Button variant={isEditing ? "secondary" : "primary"} onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Annulla" : "Modifica Profilo"}
                </Button>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} />
                </Form.Group>

                {isEditing && (
                  <>
                    <hr className="my-4" />
                    <h5 className="mb-3">Cambia Password</h5>

                    <Form.Group className="mb-3">
                      <Form.Label>Password corrente</Form.Label>
                      <Form.Control
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Inserisci la password corrente"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Nuova password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Inserisci la nuova password"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Conferma nuova password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Conferma la nuova password"
                      />
                    </Form.Group>
                  </>
                )}

                {isEditing && (
                  <div className="d-flex justify-content-end gap-2">
                    <Button variant="secondary" onClick={() => setIsEditing(false)} disabled={loading}>
                      Annulla
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Salvataggio...
                        </>
                      ) : (
                        "Salva modifiche"
                      )}
                    </Button>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
