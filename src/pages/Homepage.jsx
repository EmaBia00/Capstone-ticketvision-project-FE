import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Carousel, Badge } from "react-bootstrap";
import FilmCard from "../components/FilmCard";
import "../styles/Homepage.css";
import { Link } from "react-router-dom";

const Homepage = () => {
  const [films, setFilms] = useState([]);
  const [featuredFilms, setFeaturedFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/films")
      .then((res) => res.json())
      .then((data) => {
        const sortedFilms = [...data].sort((a, b) => Boolean(b.featured) - Boolean(a.featured));
        const filmsForCarousel = sortedFilms.slice(0, 5);
        setFilms(data);
        setFeaturedFilms(filmsForCarousel);
        setLoading(false);
      })
      .catch((error) => console.error("Errore nel recupero dei film:", error));
  }, []);

  return (
    <div className="homepage-container">
      {/* Carosello */}
      {!loading && featuredFilms.length > 0 && (
        <section className="hero-section">
          <Carousel fade indicators={featuredFilms.length > 1} controls={featuredFilms.length > 1}>
            {featuredFilms.map((film) => (
              <Carousel.Item key={`featured-${film.id}`} interval={5000}>
                <div className="hero-slide">
                  <div
                    className="hero-backdrop"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), 
                                     url(${film.bannerUrl || film.posterUrl})`
                    }}
                  />
                  <Container className="hero-content">
                    <div className="hero-poster-wrapper">
                      <img src={film.posterUrl} alt={`Locandina ${film.title}`} className="hero-poster" loading="lazy" />
                    </div>

                    <div className="hero-text-wrapper">
                      <div className="hero-meta mb-2">
                        <Badge bg="primary" className="me-2">
                          {film.genre}
                        </Badge>
                        <span className="text-light">{film.duration} min</span>
                        {film.rating && (
                          <>
                            <span className="mx-2 text-muted">•</span>
                            <span className="text-warning">
                              <i className="bi bi-star-fill"></i> {film.rating}/10
                            </span>
                          </>
                        )}
                      </div>

                      <h1 className="hero-title">{film.title}</h1>

                      <p className="hero-synopsis">
                        {film.synopsis.substring(0, 200)}
                        {film.synopsis.length > 200 ? "..." : ""}
                      </p>

                      <div className="hero-buttons mt-4">
                        <Link to={`/film/${film.id}`} className="btn btn-primary btn-lg me-3">
                          Prenota ora
                        </Link>
                        <Link to={`/film/${film.id}`} className="btn btn-outline-light btn-lg">
                          Dettagli
                        </Link>
                      </div>
                    </div>
                  </Container>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </section>
      )}

      {/* Film Disponibili */}
      <Container className="films-section py-5">
        <h2 className="section-title mb-5 text-center">
          <span className="position-relative">
            Film in programmazione
            <span className="title-decoration"></span>
          </span>
        </h2>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Caricamento film in corso...</p>
          </div>
        ) : (
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
        )}
      </Container>
    </div>
  );
};

export default Homepage;
