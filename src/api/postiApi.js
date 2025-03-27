const API_URL = "http://localhost:8080/api/spettacoli";

export const fetchAvailableSeats = async (spettacoloId) => {
  const response = await fetch(`${API_URL}/${spettacoloId}/posti`);
  if (!response.ok) throw new Error("Errore nel recupero dei posti disponibili");
  return await response.json(); // Assicurati che il backend restituisca un array di posti disponibili
};
