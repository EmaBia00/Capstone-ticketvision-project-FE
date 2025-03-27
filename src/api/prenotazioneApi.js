const API_URL = "http://localhost:8080/api/prenotazioni";

const getToken = () => localStorage.getItem("token");

export const fetchPrenotazioni = async () => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  if (!response.ok) throw new Error("Errore nel recupero delle prenotazioni");
  return await response.json();
};

export const addPrenotazione = async (prenotazioneData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(prenotazioneData)
  });
  if (!response.ok) throw new Error("Errore nell'aggiunta della prenotazione");
  return await response.json();
};

export const updatePrenotazione = async (prenotazioneId, prenotazioneData) => {
  const response = await fetch(`${API_URL}/${prenotazioneId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(prenotazioneData)
  });
  if (!response.ok) throw new Error("Errore nell'aggiornamento della prenotazione");
  return await response.json();
};

export const deletePrenotazione = async (prenotazioneId) => {
  const response = await fetch(`${API_URL}/${prenotazioneId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  if (!response.ok) throw new Error("Errore nell'eliminazione della prenotazione");
  if (response.status === 204) {
    return;
  }
  return await response.json();
};
