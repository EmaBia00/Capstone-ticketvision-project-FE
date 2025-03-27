import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Spinner, Alert, Button, InputGroup } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import FilmCard from "../components/FilmCard";
import "../styles/SearchPage.css";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const searchQuery = searchParams.get("q");
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, [searchParams]);

  const handleSearch = async (term) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:8080/api/films/public");
      if (!response.ok) throw new Error("Errore nel recupero dei film");
      const allFilms = await response.json();
      const filteredFilms = allFilms.filter((film) => film.title.toLowerCase().includes(term.toLowerCase()));
      setFilms(filteredFilms);
    } catch (err) {
      setError("Errore durante la ricerca dei film");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  return (
    <Container className="search-page py-5">
      <h2 className="section-title mb-5 text-center">
        <span className="position-relative">
          Cerca Film
          <span className="title-decoration"></span>
        </span>
      </h2>

      <Form onSubmit={handleSubmit} className="mb-5">
        <InputGroup className="search-input-container">
          <Form.Control
            type="search"
            placeholder="Cerca film per titolo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Button type="submit" variant="primary" className="search-button">
            <FaSearch />
          </Button>
        </InputGroup>
      </Form>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Ricerca in corso...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="mt-4">
          {error}
        </Alert>
      )}

      {!loading && searchParams.get("q") && (
        <>
          <h4 className="mb-4">
            Risultati per: <span className="text-primary">"{searchParams.get("q")}"</span>
          </h4>

          {films.length > 0 ? (
            <Row xs={1} md={2} lg={3} xl={4} className="g-4">
              {films.map((film) => (
                <Col key={film.id}>
                  <FilmCard
                    id={film.id}
                    title={film.title}
                    posterUrl={film.posterUrl}
                    duration={film.duration}
                    genre={film.genre}
                    synopsis={film.synopsis}
                    rating={film.rating}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Alert variant="info" className="mt-4">
              Nessun film trovato con questo titolo.
            </Alert>
          )}
        </>
      )}

      {!loading && !searchParams.get("q") && (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-search display-4 mb-3"></i>
          <p>Inserisci un titolo per cercare i film disponibili</p>
        </div>
      )}
    </Container>
  );
};

export default SearchPage;
