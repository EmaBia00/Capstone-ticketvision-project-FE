import React, { useState, useEffect } from "react";
import { fetchCinema, addCinema, updateCinema, deleteCinema } from "../../api/cinemaApi";
import { Button, Form, Table, Card, Container, Row, Col, Alert } from "react-bootstrap";

const CinemaComponent = () => {
  const [cinema, setCinema] = useState([]);
  const [newCinema, setNewCinema] = useState({ name: "", address: "" });
  const [editCinemaId, setEditCinemaId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCinemaData();
  }, []);

  const fetchCinemaData = async () => {
    try {
      const data = await fetchCinema();
      setCinema(data);
    } catch (error) {
      setError("Errore nel recupero dei cinema", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCinemaId) {
        await updateCinema(editCinemaId, newCinema);
      } else {
        await addCinema(newCinema);
      }
      fetchCinemaData();
      resetForm();
    } catch (error) {
      setError("Operazione fallita", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Eliminare questo cinema?")) {
      try {
        await deleteCinema(id);
        fetchCinemaData();

        if (editCinemaId === id) {
          resetForm();
        }
      } catch (error) {
        setError("Eliminazione fallita", error);
      }
    }
  };

  const resetForm = () => {
    setNewCinema({ name: "", address: "" });
    setEditCinemaId(null);
  };

  return (
    <Container className="py-4">
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title as="h2" className="border-bottom pb-2 mb-4">
            Gestione Cinema
          </Card.Title>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} className="mb-4">
            <Row className="align-items-end">
              <Col md={5}>
                <Form.Group>
                  <Form.Label>Nome Cinema</Form.Label>
                  <Form.Control type="text" value={newCinema.name} onChange={(e) => setNewCinema({ ...newCinema, name: e.target.value })} required />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group>
                  <Form.Label>Indirizzo</Form.Label>
                  <Form.Control type="text" value={newCinema.address} onChange={(e) => setNewCinema({ ...newCinema, address: e.target.value })} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <div className="d-flex flex-column gap-2">
                  <Button type="submit" variant="primary" className="w-100">
                    {editCinemaId ? "Salva" : "Aggiungi"}
                  </Button>
                  {editCinemaId && (
                    <Button variant="outline-secondary" onClick={resetForm} className="w-100">
                      Annulla
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Table striped hover className="mb-0">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Indirizzo</th>
                <th width="150">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {cinema.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.address}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => {
                          setEditCinemaId(item.id);
                          setNewCinema(item);
                        }}
                      >
                        Modifica
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}>
                        Elimina
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CinemaComponent;
