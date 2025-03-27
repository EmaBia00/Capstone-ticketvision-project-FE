import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Row, Col, Card, Spinner, Alert, Badge, ListGroup } from "react-bootstrap";
import { FaStar, FaClock, FaTicketAlt, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";
import "../styles/FilmDetail.css";

const FilmDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [film, setFilm] = useState(null);
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch film details
        const filmResponse = await fetch(`http://localhost:8080/api/films/${id}`);
        if (!filmResponse.ok) throw new Error("Film non trovato");
        const filmData = await filmResponse.json();

        // Fetch spettacoli
        const screeningsResponse = await fetch(`http://localhost:8080/api/spettacoli`);
        if (!screeningsResponse.ok) throw new Error("Errore nel caricamento degli spettacoli");
        const allScreenings = await screeningsResponse.json();

        // Filtro spettacoli del film corrente
        const filmScreenings = allScreenings.filter((screening) => screening.film.id.toString() === id);

        setFilm(filmData);
        setScreenings(filmScreenings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBooking = (screeningId) => {
    navigate(`/prenotazione/${screeningId}`);
  };

  // Formattazione Data
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Data non disponibile";
      }
      return date.toLocaleDateString("it-IT", {
        weekday: "long",
        day: "numeric",
        month: "long"
      });
    } catch (error) {
      return Error("Data non disponibile", error);
    }
  };

  // Formattazione Orario
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Orario non disponibile";
      }
      return date.toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return Error("Orario non disponibile", error);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (!film) return null;

  return (
    <div className="film-detail-page">
      <Container className="py-5">
        {/* Film */}
        <Row className="mb-4 film-header">
          <Col md={4} className="mb-4 mb-md-0">
            <Card className="poster-card">
              <Card.Img variant="top" src={film.posterUrl} alt={film.title} className="film-poster" />
            </Card>
          </Col>

          <Col md={8}>
            <div className="film-info">
              <h1 className="film-title">{film.title}</h1>

              <div className="film-meta mb-4">
                {film.rating && (
                  <Badge bg="warning" text="dark" className="me-2">
                    <FaStar className="me-1" />
                    {film.rating}/10
                  </Badge>
                )}

                <Badge bg="secondary" className="me-2">
                  <FaClock className="me-1" />
                  {film.duration} min
                </Badge>

                {film.oscarNominations > 0 && (
                  <Badge bg="success" className="me-2">
                    🏆 {film.oscarNominations} Oscar
                  </Badge>
                )}

                <Badge bg="info" className="me-2">
                  {film.genre}
                </Badge>
              </div>

              <div className="film-price mb-4">
                <h5>
                  <FaMoneyBillWave className="me-2" />
                  Prezzo: <strong>€{film.price.toFixed(2)}</strong>
                </h5>
              </div>

              <div className="synopsis-section mb-4">
                <h4>Trama</h4>
                <p className="film-synopsis">{film.synopsis}</p>
              </div>

              <div className="cast-section mb-4">
                <h4>Cast</h4>
                <p className="film-cast">{film.actors.join(", ")}</p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Spettacoli */}
        <Row className="mt-5">
          <Col>
            <Card className="screenings-card">
              <Card.Header className="screenings-header">
                <h3 className="mb-0">
                  <FaCalendarAlt className="me-2" />
                  Spettacoli disponibili
                </h3>
              </Card.Header>

              <Card.Body>
                {screenings.length > 0 ? (
                  <ListGroup variant="flush">
                    {screenings.map((screening) => (
                      <ListGroup.Item key={screening.id} className="screening-item">
                        <Row className="align-items-center">
                          <Col md={3} className="screening-time">
                            <h5 className="mb-0">{formatDate(screening.orario)}</h5>
                            <p className="mb-0 text-muted">{formatTime(screening.orario)}</p>
                          </Col>

                          <Col md={3} className="screening-cinema">
                            <h6 className="mb-1">{screening.sala.cinema.name}</h6>
                            <small className="text-muted">{screening.sala.cinema.address}</small>
                          </Col>

                          <Col md={3} className="screening-room">
                            <Badge bg="secondary">Sala {screening.sala.numero}</Badge>
                            <small className="d-block text-muted">Posti disponibili: {screening.postiDisponibili}</small>
                          </Col>

                          <Col md={3} className="text-end">
                            <Button variant="primary" onClick={() => handleBooking(screening.id)} className="booking-button">
                              <FaTicketAlt className="me-2" />
                              Prenota
                            </Button>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <Alert variant="info">Nessuno spettacolo disponibile al momento per questo film.</Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FilmDetail;
