import React, { useState, useEffect } from "react";
import { fetchSale, addSala, updateSala, deleteSala } from "../../api/salaApi";
import { Button, Form, Table, Card, Container, Row, Col, Alert } from "react-bootstrap";

const SalaComponent = () => {
  const [sale, setSale] = useState([]);
  const [newSala, setNewSala] = useState({ numero: "", capienza: "" });
  const [editSalaId, setEditSalaId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSaleData();
  }, []);

  const fetchSaleData = async () => {
    try {
      const data = await fetchSale();
      const sortedSale = [...data].sort((a, b) => Number(a.numero) - Number(b.numero));
      setSale(sortedSale);
    } catch (error) {
      setError("Errore nel recupero delle sale", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editSalaId) {
        await updateSala(editSalaId, newSala);
      } else {
        await addSala(newSala);
      }
      fetchSaleData();
      resetForm();
    } catch (error) {
      setError("Operazione fallita", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Eliminare questa sala?")) {
      try {
        await deleteSala(id);
        fetchSaleData();
        // Reset del form se stiamo modificando l'elemento che viene eliminato
        if (editSalaId === id) {
          resetForm();
        }
      } catch (error) {
        setError("Eliminazione fallita", error);
      }
    }
  };

  const resetForm = () => {
    setNewSala({ numero: "", capienza: "" });
    setEditSalaId(null);
  };

  return (
    <Container className="py-4">
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title as="h2" className="border-bottom pb-2 mb-4">
            Gestione Sale
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
                  <Form.Label>Numero Sala</Form.Label>
                  <Form.Control type="text" value={newSala.numero} onChange={(e) => setNewSala({ ...newSala, numero: e.target.value })} required />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group>
                  <Form.Label>Capienza</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={newSala.capienza}
                    onChange={(e) => setNewSala({ ...newSala, capienza: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <div className="d-flex flex-column gap-2">
                  <Button type="submit" variant="primary" className="w-100">
                    {editSalaId ? "Salva" : "Aggiungi"}
                  </Button>
                  {editSalaId && (
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
                <th>Numero Sala</th>
                <th>Capienza</th>
                <th width="150">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {sale.map((sala) => (
                <tr key={sala.id}>
                  <td>{sala.numero}</td>
                  <td>{sala.capienza}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => {
                          setEditSalaId(sala.id);
                          setNewSala(sala);
                        }}
                      >
                        Modifica
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(sala.id)}>
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

export default SalaComponent;
