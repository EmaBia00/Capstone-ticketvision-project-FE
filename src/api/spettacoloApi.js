const API_URL = "http://localhost:8080/api/spettacoli";

const getToken = () => localStorage.getItem("token");

export const fetchSpettacoli = async () => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  if (!response.ok) throw new Error("Errore nel recupero degli spettacoli");
  return await response.json();
};

export const addSpettacolo = async (spettacoloData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(spettacoloData)
  });
  if (!response.ok) throw new Error("Errore nell'aggiunta dello spettacolo");
  return await response.json();
};

export const updateSpettacolo = async (spettacoloId, spettacoloData) => {
  const response = await fetch(`${API_URL}/${spettacoloId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(spettacoloData)
  });
  if (!response.ok) throw new Error("Errore nell'aggiornamento dello spettacolo");
  return await response.json();
};

export const deleteSpettacolo = async (spettacoloId) => {
  const response = await fetch(`${API_URL}/${spettacoloId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  if (!response.ok) throw new Error("Errore nell'eliminazione dello spettacolo");
  if (response.status === 204) {
    return;
  }
  return await response.json();
};
