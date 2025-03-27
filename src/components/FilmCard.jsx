import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const FilmCard = ({ id, title, posterUrl, duration, genre, synopsis }) => {
  return (
    <Card className="h-100">
      <Card.Img variant="top" src={posterUrl} alt={title} style={{ height: "400px", objectFit: "cover" }} />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{title}</Card.Title>
        <Card.Text className="text-muted">
          <small>
            {genre} • {duration} min
          </small>
        </Card.Text>
        <Card.Text className="flex-grow-1">{synopsis.substring(0, 100)}...</Card.Text>
        <Button as={Link} to={`/film/${id}`} variant="primary" className="mt-auto">
          Dettagli
        </Button>
      </Card.Body>
    </Card>
  );
};

export default FilmCard;
