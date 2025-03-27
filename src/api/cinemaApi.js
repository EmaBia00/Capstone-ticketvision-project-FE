const API_URL = "http://localhost:8080/api/cinema";

const getToken = () => localStorage.getItem("token");

export const fetchCinema = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Errore nel recupero dei cinema");
  return await response.json();
};

export const addCinema = async (cinemaData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(cinemaData)
  });
  if (!response.ok) throw new Error("Errore nell'aggiunta del cinema");
  return await response.json();
};

export const updateCinema = async (cinemaId, cinemaData) => {
  const response = await fetch(`${API_URL}/${cinemaId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(cinemaData)
  });
  if (!response.ok) throw new Error("Errore nell'aggiornamento del cinema");
  return await response.json();
};

export const deleteCinema = async (cinemaId) => {
  const response = await fetch(`${API_URL}/${cinemaId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` }
  });
  if (!response.ok) throw new Error("Errore nell'eliminazione del cinema");
  if (response.status === 204) {
    return;
  }
  return await response.json();
};
