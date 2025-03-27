const API_URL = "http://localhost:8080/api/films";

const getToken = () => localStorage.getItem("token");

export const fetchFilms = async () => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  if (!response.ok) throw new Error("Errore nel recupero dei film");
  return await response.json();
};

// Funzione per recuperare un film per ID
export const fetchFilmById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  if (!response.ok) throw new Error("Errore nel recupero del film");
  return await response.json();
};

export const addFilm = async (filmData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({
      ...filmData,
      featured: Boolean(filmData.featured)
    })
  });
  if (!response.ok) throw new Error("Errore nell'aggiunta del film");
  return await response.json();
};

export const updateFilm = async (filmId, filmData) => {
  const response = await fetch(`${API_URL}/${filmId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({
      ...filmData,
      featured: Boolean(filmData.featured)
    })
  });
  if (!response.ok) throw new Error("Errore nell'aggiornamento del film");
  return await response.json();
};

export const deleteFilm = async (filmId) => {
  const response = await fetch(`${API_URL}/${filmId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!response.ok) throw new Error("Errore nell'eliminazione del film");
  if (response.status === 204) {
    return;
  }
  return await response.json();
};
