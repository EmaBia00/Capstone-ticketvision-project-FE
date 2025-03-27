import React, { useState, useEffect } from "react";
import { fetchUsers, updateUserRole, deleteUser, updateUserData } from "../../api/userApi";
import { Button, Form, Table, Badge, Alert, Modal } from "react-bootstrap";

const UserComponent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      const sortedUsers = [...data].sort((a, b) => a.id - b.id);
      setUsers(sortedUsers);
    } catch (error) {
      setError("Errore nel recupero degli utenti");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      await fetchUserData();
    } catch (error) {
      setError("Errore nell'aggiornamento del ruolo", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo utente?")) return;
    try {
      await deleteUser(userId);
      await fetchUserData();
    } catch (error) {
      setError("Errore nell'eliminazione dell'utente", error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: "" });
  };

  const handleSaveChanges = async () => {
    try {
      await updateUserData(editingUser.id, formData);
      await fetchUserData();
      setEditingUser(null);
    } catch (error) {
      setError("Errore nel salvataggio delle modifiche", error);
    }
  };

  if (loading) return <div>Caricamento...</div>;

  return (
    <div>
      <h2>Gestione Utenti</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Email</th>
            <th>Nome</th>
            <th>Ruolo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>
                <Badge bg={user.role === "ADMIN" ? "danger" : "primary"}>{user.role}</Badge>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <Button variant="warning" size="sm" onClick={() => handleEditClick(user)}>
                    Modifica
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>
                    Elimina
                  </Button>
                  <Form.Select value={user.role} onChange={(e) => handleUpdateRole(user.id, e.target.value)} style={{ width: "200px" }}>
                    <option value="USER">Utente</option>
                    <option value="ADMIN">Amministratore</option>
                  </Form.Select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={editingUser !== null} onHide={() => setEditingUser(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Utente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nuova Password (lascia vuoto per non modificare)</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Inserisci nuova password"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditingUser(null)}>
            Annulla
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Salva
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserComponent;
