import React, { useState, useEffect } from "react";
import { fetchSpettacoli, addSpettacolo, updateSpettacolo, deleteSpettacolo } from "../../api/spettacoloApi";
import { fetchFilms } from "../../api/filmApi";
import { fetchSale } from "../../api/salaApi";
import { Button, Form, Table, Card, Container, Row, Col, Alert } from "react-bootstrap";

const SpettacoloComponent = () => {
  const [spettacoli, setSpettacoli] = useState([]);
  const [films, setFilms] = useState([]);
  const [sale, setSale] = useState([]);
  const [newSpettacolo, setNewSpettacolo] = useState({
    film: { id: "" },
    sala: { id: "" },
    data: "",
    orario: "",
    postiDisponibili: 0
  });
  const [editSpettacoloId, setEditSpettacoloId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSpettacoloData();
    fetchFilmData();
    fetchSalaData();
  }, []);

  const fetchSpettacoloData = async () => {
    try {
      const data = await fetchSpettacoli();
      setSpettacoli(data);
    } catch (error) {
      setError("Errore nel recupero degli spettacoli", error);
    }
  };

  const fetchFilmData = async () => {
    try {
      const data = await fetchFilms();
      setFilms(data);
    } catch (error) {
      setError("Errore nel recupero dei film", error);
    }
  };

  const fetchSalaData = async () => {
    try {
      const data = await fetchSale();
      setSale(data);
    } catch (error) {
      setError("Errore nel recupero delle sale", error);
    }
  };

  const handleSalaChange = (e) => {
    const salaId = e.target.value;
    const selectedSala = sale.find((s) => s.id.toString() === salaId);

    setNewSpettacolo({
      ...newSpettacolo,
      sala: { id: salaId },
      postiDisponibili: selectedSala ? selectedSala.capienza : 0
    });
  };

  const handleFilmChange = (e) => {
    const filmId = e.target.value;
    setNewSpettacolo({
      ...newSpettacolo,
      film: { id: filmId }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newSpettacolo.film.id || !newSpettacolo.sala.id) {
        throw new Error("Seleziona sia film che sala");
      }

      const selectedSala = sale.find((s) => s.id.toString() === newSpettacolo.sala.id);
      if (!selectedSala) {
        throw new Error("Sala non trovata");
      }

      const spettacoloData = {
        film: { id: parseInt(newSpettacolo.film.id) },
        sala: { id: parseInt(newSpettacolo.sala.id) },
        orario: `${newSpettacolo.data}T${newSpettacolo.orario}`,
        postiDisponibili: selectedSala.capienza
      };

      if (editSpettacoloId) {
        await updateSpettacolo(editSpettacoloId, spettacoloData);
      } else {
        await addSpettacolo(spettacoloData);
      }

      fetchSpettacoloData();
      resetForm();
    } catch (error) {
      setError(error.message || "Operazione fallita");
    }
  };

  const resetForm = () => {
    setNewSpettacolo({
      film: { id: "" },
      sala: { id: "" },
      data: "",
      orario: "",
      postiDisponibili: 0
    });
    setEditSpettacoloId(null);
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return { date: "", time: "" };

    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString("it-IT"),
      time: date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
    };
  };

  return (
    <Container className="py-4">
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title as="h2" className="border-bottom pb-2">
            Gestione Spettacoli
          </Card.Title>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Film*</Form.Label>
                  <Form.Select value={newSpettacolo.film.id} onChange={handleFilmChange} required>
                    <option value="">Seleziona un film</option>
                    {films.map((film) => (
                      <option key={film.id} value={film.id}>
                        {film.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Sala*</Form.Label>
                  <Form.Select value={newSpettacolo.sala.id} onChange={handleSalaChange} required>
                    <option value="">Seleziona una sala</option>
                    {sale.map((sala) => (
                      <option key={sala.id} value={sala.id}>
                        Sala {sala.numero} (Capienza: {sala.capienza})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data*</Form.Label>
                  <Form.Control
                    type="date"
                    value={newSpettacolo.data}
                    onChange={(e) => setNewSpettacolo({ ...newSpettacolo, data: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Orario*</Form.Label>
                  <Form.Control
                    type="time"
                    value={newSpettacolo.orario}
                    onChange={(e) => setNewSpettacolo({ ...newSpettacolo, orario: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-3">
              {editSpettacoloId && (
                <Button variant="outline-secondary" onClick={resetForm} className="me-2">
                  Annulla
                </Button>
              )}
              <Button type="submit" variant="primary">
                {editSpettacoloId ? "Salva modifiche" : "Aggiungi spettacolo"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Film</th>
                <th>Sala</th>
                <th>Data</th>
                <th>Orario</th>
                <th>Posti disponibili</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {spettacoli.map((spettacolo) => {
                const { date, time } = formatDateTime(spettacolo.orario);
                return (
                  <tr key={spettacolo.id}>
                    <td>{spettacolo.film?.title}</td>
                    <td>Sala {spettacolo.sala?.numero}</td>
                    <td>{date}</td>
                    <td>{time}</td>
                    <td>{spettacolo.postiDisponibili}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => {
                            const [date, time] = spettacolo.orario?.split("T") || ["", ""];
                            setEditSpettacoloId(spettacolo.id);
                            setNewSpettacolo({
                              film: { id: spettacolo.film?.id?.toString() },
                              sala: { id: spettacolo.sala?.id?.toString() },
                              data: date,
                              orario: time.substring(0, 5),
                              postiDisponibili: spettacolo.postiDisponibili
                            });
                          }}
                        >
                          Modifica
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            if (window.confirm(`Eliminare lo spettacolo di ${spettacolo.film?.title}?`)) {
                              deleteSpettacolo(spettacolo.id).then(fetchSpettacoloData);
                            }
                          }}
                        >
                          Elimina
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SpettacoloComponent;
