import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert, Spinner, Modal, Badge } from "react-bootstrap";
import { FaChair, FaMoneyBillWave, FaCalendarAlt, FaMapMarkerAlt, FaFilm, FaClock, FaPaypal } from "react-icons/fa";
import "../styles/Prenotazione.css";

const Prenotazione = () => {
  const { spettacoloId } = useParams();
  const navigate = useNavigate();

  // Stati principali del componente
  const [screening, setScreening] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [seatsLayout, setSeatsLayout] = useState([]);
  const [user, setUser] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paypalScriptLoaded, setPaypalScriptLoaded] = useState(false);
  const [paypalButtonRendered, setPaypalButtonRendered] = useState(false);

  // Recupero dati utente dal localStorage
  useEffect(() => {
    const getUser = () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData")) || {
          id: localStorage.getItem("id"),
          email: localStorage.getItem("email"),
          name: localStorage.getItem("name"),
          role: localStorage.getItem("role")
        };

        if (!userData.id) return null;

        return userData;
      } catch (error) {
        console.error("Errore nel recupero utente:", error);
        return null;
      }
    };

    const user = getUser();
    setUser(user);
  }, []);

  // Render bottone paypal
  useEffect(() => {
    if (paypalScriptLoaded && paymentMethod === "paypal" && !paypalButtonRendered && window.paypal) {
      try {
        window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    description: `Biglietti per ${screening?.film.title}`,
                    amount: {
                      value: totalPrice.toFixed(2),
                      currency_code: "EUR"
                    }
                  }
                ]
              });
            },
            onApprove: (data, actions) => {
              return actions.order.capture().then(() => {
                handleConfirmBooking(true);
              });
            },
            onError: (err) => {
              setError("Errore durante il pagamento con PayPal: " + err.message);
            }
          })
          .render("#paypal-button-container");

        setPaypalButtonRendered(true);
      } catch (err) {
        console.error("Error rendering PayPal button:", err);
        setError("Errore nell'inizializzazione di PayPal");
      }
    }
  }, [paypalScriptLoaded, paymentMethod, totalPrice, user?.id]);

  // Caricamento Paypal al cambio di utente
  useEffect(() => {
    const handleUserChange = () => {
      // 1. Resetta lo stato di PayPal
      setPaypalScriptLoaded(false);
      setPaypalButtonRendered(false);
      setPaymentMethod(null);

      const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }

      if (user?.id) {
        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=EUR`;
        script.async = true;
        script.onload = () => {
          setPaypalScriptLoaded(true);
        };
        document.body.appendChild(script);
      }
    };

    handleUserChange();
  }, [user?.id]);

  // Reset Modale metodo di pagamento
  useEffect(() => {
    if (showConfirmation) {
      setPaymentMethod(null);
    }
  }, [showConfirmation]);

  // Gestisce il cambio del metodo di pagamento
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method !== "paypal") {
      setPaypalButtonRendered(false);
    }
  };

  // Effetto per recuperare i dati dello spettacolo e dei posti occupati
  useEffect(() => {
    const fetchScreeningData = async () => {
      try {
        setLoading(true);

        // Recupera i dettagli dello spettacolo
        const screeningResponse = await fetch(`http://localhost:8080/api/spettacoli/${spettacoloId}`);
        if (!screeningResponse.ok) throw new Error("Spettacolo non trovato");
        const screeningData = await screeningResponse.json();
        setScreening(screeningData);

        // Recupera i posti già occupati per questo spettacolo
        const occupiedSeatsResponse = await fetch(`http://localhost:8080/api/spettacoli/${spettacoloId}/posti-occupati`);
        if (!occupiedSeatsResponse.ok) throw new Error("Errore nel recupero posti occupati");
        const occupiedSeatsData = await occupiedSeatsResponse.json();
        setOccupiedSeats(occupiedSeatsData);

        // Genera il layout della sala con i posti disponibili/occupati
        generateSeatsLayout(screeningData.sala.capienza, occupiedSeatsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScreeningData();
  }, [spettacoloId]);

  // Genera il layout della sala con posti disponibili/occupati/selezionati
  const generateSeatsLayout = (totalSeats, occupiedSeatsList) => {
    const rows = Math.ceil(totalSeats / 10);
    const layout = [];

    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      const seatsInRow = row === rows ? totalSeats % 10 || 10 : 10;

      for (let seat = 1; seat <= seatsInRow; seat++) {
        const seatNumber = (row - 1) * 10 + seat;
        const isOccupied = occupiedSeatsList.includes(seatNumber);

        rowSeats.push({
          number: seatNumber,
          available: !isOccupied,
          selected: false
        });
      }

      layout.push(rowSeats);
    }

    setSeatsLayout(layout);
  };

  // Gestisce il click su un posto (selezione/deselezione)
  const handleSeatClick = (rowIndex, seatIndex) => {
    if (!seatsLayout[rowIndex][seatIndex].available) return;

    const updatedLayout = [...seatsLayout];
    const seat = updatedLayout[rowIndex][seatIndex];
    seat.selected = !seat.selected;

    setSeatsLayout(updatedLayout);

    const newSelectedSeats = seat.selected ? [...selectedSeats, seat.number] : selectedSeats.filter((num) => num !== seat.number);

    setSelectedSeats(newSelectedSeats);
    setTotalPrice(newSelectedSeats.length * (screening?.film.price || 0));
  };

  // Gestisce la conferma della prenotazione (con o senza pagamento)
  const handleConfirmBooking = async (isPaid = false) => {
    try {
      setIsBooking(true);
      setError(null);

      if (!user?.id) {
        throw new Error("Utente non valido, effettua il login");
      }

      // Crea la richiesta per la prenotazione
      const url = new URL(`http://localhost:8080/api/prenotazioni`);
      url.searchParams.append("utenteId", user.id);
      url.searchParams.append("spettacoloId", spettacoloId);
      url.searchParams.append("postiPrenotati", selectedSeats.length);
      url.searchParams.append("isPaid", isPaid);

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedSeats)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Errore durante la prenotazione");
      }

      // Prenotazione riuscita
      setBookingSuccess(true);

      // Aggiorna la lista dei posti occupati
      setOccupiedSeats([...occupiedSeats, ...selectedSeats]);

      // Rigenera il layout con i nuovi posti occupati
      generateSeatsLayout(screening.sala.capienza, [...occupiedSeats, ...selectedSeats]);

      // Resetta i posti selezionati e il prezzo totale
      setSelectedSeats([]);
      setTotalPrice(0);

      // Notifica altri componenti della prenotazione effettuata
      window.dispatchEvent(new Event("prenotazione-effettuata"));
    } catch (err) {
      setError(err.message || "Errore di connessione al server");
    } finally {
      setIsBooking(false);
      setShowConfirmation(false);
    }
  };

  // Mostra spinner del caricamento
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Mostra errore se presente
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate(-1)} className="mt-3">
          Torna indietro
        </Button>
      </Container>
    );
  }

  if (!screening) return null;

  return (
    <div className="prenotazione-page">
      <Container className="py-5">
        <Row>
          {/* Selezione posti */}
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header className="bg-dark text-white">
                <h4 className="mb-0">Selezione Posti</h4>
              </Card.Header>
              <Card.Body>
                <div className="screen-display mb-4">SCHERMO</div>

                <div className="seats-container">
                  {seatsLayout.map((row, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="seat-row">
                      {row.map((seat, seatIndex) => (
                        <button
                          key={`seat-${seat.number}`}
                          className={`seat ${seat.available ? "" : "unavailable"} ${seat.selected ? "selected" : ""}`}
                          onClick={() => handleSeatClick(rowIndex, seatIndex)}
                          disabled={!seat.available}
                        >
                          <FaChair />
                          <span className="seat-number">{seat.number}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="seat-legend mt-4">
                  <div className="legend-item">
                    <span className="seat-sample available"></span>
                    <span>Disponibile</span>
                  </div>
                  <div className="legend-item">
                    <span className="seat-sample selected"></span>
                    <span>Selezionato</span>
                  </div>
                  <div className="legend-item">
                    <span className="seat-sample unavailable"></span>
                    <span>Occupato</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Riepilogo prenotazione */}
          <Col lg={4}>
            <Card className="sticky-top summary-card">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">Riepilogo Prenotazione</h4>
              </Card.Header>
              <Card.Body>
                <div className="summary-item">
                  <FaFilm className="me-2" />
                  <strong>Film:</strong> {screening.film.title}
                </div>

                <div className="summary-item">
                  <FaCalendarAlt className="me-2" />
                  <strong>Data:</strong> {new Date(screening.orario).toLocaleDateString("it-IT")}
                  <FaClock className="me-2 ms-4" />
                  <strong>Ora:</strong>{" "}
                  {new Date(screening.orario).toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>

                <div className="summary-item">
                  <FaMapMarkerAlt className="me-2" />
                  <strong>Cinema:</strong> {screening.sala.cinema.name}
                </div>

                <div className="summary-item">
                  <strong>Sala:</strong> {screening.sala.numero}
                </div>

                <hr />

                <div className="selected-seats-display mb-3">
                  <h5>Posti selezionati:</h5>
                  {selectedSeats.length > 0 ? (
                    <div className="seats-badge-container">
                      {selectedSeats.map((seat) => (
                        <Badge key={seat} bg="primary" className="me-2">
                          {seat}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p>Nessun posto selezionato</p>
                  )}
                </div>

                <div className="summary-item total-price">
                  <FaMoneyBillWave className="me-2" />
                  <strong>Totale:</strong> €{totalPrice.toFixed(2)}
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-100 mt-3"
                  disabled={selectedSeats.length === 0 || !user}
                  onClick={() => setShowConfirmation(true)}
                >
                  {user ? "Conferma Prenotazione" : "Effettua il login"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modale di conferma prenotazione */}
      <Modal
        show={showConfirmation}
        onHide={() => {
          setShowConfirmation(false);
          setPaymentMethod(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Conferma Prenotazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Stai per prenotare {selectedSeats.length} posto/i per:</p>
          <ul>
            <li>
              <strong>Film:</strong> {screening.film.title}
            </li>
            <li>
              <strong>Cinema:</strong> {screening.sala.cinema.name}
            </li>
            <li>
              <strong>Data:</strong> {new Date(screening.orario).toLocaleDateString("it-IT")}
            </li>
            <li>
              <strong>Ora:</strong> {new Date(screening.orario).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
            </li>
            <li>
              <strong>Posti:</strong> {selectedSeats.join(", ")}
            </li>
            <li>
              <strong>Totale:</strong> €{totalPrice.toFixed(2)}
            </li>
          </ul>

          {!paymentMethod ? (
            <div className="payment-options">
              <h5>Scegli il metodo di pagamento:</h5>
              <Button variant="outline-primary" className="mb-3 w-100 payment-method-btn" onClick={() => handlePaymentMethodChange("paypal")}>
                <FaPaypal className="me-2" /> Paga ora con PayPal
              </Button>
              <Button variant="outline-secondary" className="w-100 payment-method-btn" onClick={() => handlePaymentMethodChange("later")}>
                Paga più tardi (in cassa)
              </Button>
            </div>
          ) : paymentMethod === "paypal" ? (
            <div id="paypal-button-container" className="mt-3"></div>
          ) : (
            <>
              <Alert variant="info" className="mt-3">
                Pagherai direttamente al cinema prima dello spettacolo.
              </Alert>
              <Button variant="primary" onClick={() => handleConfirmBooking(false)} disabled={isBooking} className="w-100 mt-3">
                {isBooking ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Prenotazione in corso...
                  </>
                ) : (
                  "Conferma Prenotazione"
                )}
              </Button>
            </>
          )}
        </Modal.Body>
        {paymentMethod && paymentMethod !== "paypal" && (
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setPaymentMethod(null)}>
              Torna indietro
            </Button>
          </Modal.Footer>
        )}
      </Modal>

      {/* Modale di successo prenotazione */}
      <Modal show={bookingSuccess} onHide={() => navigate("/")}>
        <Modal.Header closeButton>
          <Modal.Title>Prenotazione Confermata!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">La tua prenotazione è stata confermata con successo!</Alert>
          <p>Riceverai una email con i dettagli della prenotazione.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => navigate("/")}>
            Torna alla Home
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Prenotazione;
