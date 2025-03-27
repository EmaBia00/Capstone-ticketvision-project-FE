import React, { useEffect } from "react";
import { Container, Card, Button, Alert, Spinner, Table, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings, cancelBooking } from "../redux/prenotazioniSlice";
import { FaTrash, FaTicketAlt, FaCalendarAlt, FaFilm, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id, isAuthenticated, token } = useSelector((state) => state.auth);
  const { bookings, status, error } = useSelector((state) => state.prenotazioni);

  useEffect(() => {
    if (!token || !localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    if (!id) {
      navigate("/login");
      return;
    }

    dispatch(fetchUserBookings(id));
  }, [dispatch, id, token, navigate]);

  useEffect(() => {
    const handleNewBooking = () => {
      dispatch(fetchUserBookings(id));
    };

    window.addEventListener("prenotazione-effettuata", handleNewBooking);

    return () => {
      window.removeEventListener("prenotazione-effettuata", handleNewBooking);
    };
  }, [dispatch, id]);

  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Sei sicuro di voler annullare questa prenotazione?")) {
      dispatch(cancelBooking(bookingId))
        .unwrap()
        .then(() => {
          dispatch(fetchUserBookings(id));
        });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("it-IT");
  };

  if (status === "idle" && !isAuthenticated) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Errore nel caricamento delle prenotazioni: {error}</Alert>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Torna alla home
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5 dashboard-page">
      <h2 className="mb-4">Le tue prenotazioni</h2>

      {bookings.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <FaTicketAlt size={48} className="text-muted mb-3" />
            <h4>Nessuna prenotazione trovata</h4>
            <p className="text-muted">Non hai ancora effettuato nessuna prenotazione</p>
            <Button variant="primary" onClick={() => navigate("/")}>
              Vedi film disponibili
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="align-middle">
            <thead className="table-dark">
              <tr>
                <th>Film</th>
                <th>Data e ora</th>
                <th>Cinema</th>
                <th>Sala</th>
                <th>Posti</th>
                <th>Stato</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <FaFilm className="me-2 text-primary" />
                      {booking.spettacolo?.film?.title || "N/A"}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <FaCalendarAlt className="me-2 text-primary" />
                      {booking.spettacolo?.orario ? formatDate(booking.spettacolo.orario) : "N/A"}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <FaMapMarkerAlt className="me-2 text-primary" />
                      {booking.spettacolo?.sala?.cinema?.name || "N/A"}
                    </div>
                  </td>
                  <td>Sala {booking.spettacolo?.sala?.numero || "N/A"}</td>
                  <td>
                    {booking.posti?.map((posto, index) => (
                      <Badge key={index} bg="primary" className="me-1">
                        {posto}
                      </Badge>
                    )) || "N/A"}
                  </td>
                  <td>
                    <Badge bg={booking.stato === "CONFERMATA" ? "success" : "secondary"}>{booking.stato || "N/A"}</Badge>
                  </td>
                  <td>
                    {booking.stato === "CONFERMATA" && (
                      <Button variant="outline-danger" size="sm" onClick={() => handleCancelBooking(booking.id)} className="d-flex align-items-center">
                        <FaTrash className="me-1" /> Annulla
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default Dashboard;
