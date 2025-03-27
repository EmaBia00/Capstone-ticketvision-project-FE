import React, { useState, useEffect } from "react";
import { fetchFilms, addFilm, updateFilm, deleteFilm } from "../../api/filmApi";
import { Button, Form, Table, Card, Container, Row, Col, Alert, Badge } from "react-bootstrap";

const FilmComponent = () => {
  const [films, setFilms] = useState([]);
  const [newFilm, setNewFilm] = useState({
    title: "",
    synopsis: "",
    posterUrl: "",
    bannerUrl: "",
    duration: "",
    price: "",
    actors: "",
    oscarNominations: "",
    featured: false
  });
  const [editFilmId, setEditFilmId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFilmData();
  }, []);

  const fetchFilmData = async () => {
    try {
      const data = await fetchFilms();
      setFilms(data);
    } catch (error) {
      setError("Errore nel recupero dei film", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const filmData = {
        ...newFilm,
        duration: parseInt(newFilm.duration),
        price: parseFloat(newFilm.price),
        actors: newFilm.actors.split(",").map((actor) => actor.trim()),
        oscarNominations: parseInt(newFilm.oscarNominations),
        featured: Boolean(newFilm.featured)
      };

      if (editFilmId) {
        await updateFilm(editFilmId, filmData);
      } else {
        await addFilm(filmData);
      }

      fetchFilmData();
      resetForm();
    } catch (error) {
      setError(error.message || "Operazione fallita");
    }
  };

  const resetForm = () => {
    setNewFilm({
      title: "",
      synopsis: "",
      posterUrl: "",
      bannerUrl: "",
      duration: "",
      price: "",
      actors: "",
      oscarNominations: "",
      featured: false
    });
    setEditFilmId(null);
  };

  return (
    <Container className="py-4">
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title as="h2" className="border-bottom pb-2">
            Gestione Film
          </Card.Title>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Titolo*</Form.Label>
                  <Form.Control type="text" value={newFilm.title} onChange={(e) => setNewFilm({ ...newFilm, title: e.target.value })} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Trama*</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newFilm.synopsis}
                    onChange={(e) => setNewFilm({ ...newFilm, synopsis: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Attori (separati da virgola)*</Form.Label>
                  <Form.Control type="text" value={newFilm.actors} onChange={(e) => setNewFilm({ ...newFilm, actors: e.target.value })} required />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>URL Locandina*</Form.Label>
                  <Form.Control type="url" value={newFilm.posterUrl} onChange={(e) => setNewFilm({ ...newFilm, posterUrl: e.target.value })} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>URL Banner (per carosello)</Form.Label>
                  <Form.Control
                    type="url"
                    value={newFilm.bannerUrl}
                    onChange={(e) => setNewFilm({ ...newFilm, bannerUrl: e.target.value })}
                    placeholder="Se vuoto, usa la locandina"
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Durata (min)*</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        value={newFilm.duration}
                        onChange={(e) => setNewFilm({ ...newFilm, duration: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Prezzo (€)*</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        min="0"
                        value={newFilm.price}
                        onChange={(e) => setNewFilm({ ...newFilm, price: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nomination Oscar</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        value={newFilm.oscarNominations}
                        onChange={(e) => setNewFilm({ ...newFilm, oscarNominations: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Check
                  type="checkbox"
                  label="Film in evidenza"
                  checked={newFilm.featured}
                  onChange={(e) => setNewFilm({ ...newFilm, featured: e.target.checked })}
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-3">
              {editFilmId && (
                <Button variant="outline-secondary" onClick={resetForm} className="me-2">
                  Annulla
                </Button>
              )}
              <Button type="submit" variant="primary">
                {editFilmId ? "Salva modifiche" : "Aggiungi film"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Locandina</th>
                <th>Titolo</th>
                <th>Info</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {films.map((film) => (
                <tr key={film.id}>
                  <td>
                    <img src={film.posterUrl} alt={`Locandina ${film.title}`} style={{ width: "60px", height: "auto" }} className="img-thumbnail" />
                  </td>
                  <td>
                    <strong>{film.title}</strong>
                    <br />
                    <small className="text-muted">{film.actors?.join(", ")}</small>
                    {film.featured && (
                      <Badge bg="warning" text="dark" className="ms-2">
                        In evidenza
                      </Badge>
                    )}
                  </td>
                  <td>
                    <div>
                      <Badge bg="light" text="dark" className="me-1">
                        {film.duration} min
                      </Badge>
                      <Badge bg="light" text="dark" className="me-1">
                        €{film.price?.toFixed(2)}
                      </Badge>
                      {film.oscarNominations > 0 && (
                        <Badge bg="success" className="me-1">
                          {film.oscarNominations} Oscar
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => {
                          setEditFilmId(film.id);
                          setNewFilm({
                            ...film,
                            actors: film.actors?.join(", "),
                            featured: Boolean(film.featured)
                          });
                        }}
                      >
                        Modifica
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          if (window.confirm(`Eliminare "${film.title}"?`)) {
                            deleteFilm(film.id).then(fetchFilmData);
                          }
                        }}
                      >
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

export default FilmComponent;
