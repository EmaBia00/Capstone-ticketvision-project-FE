const API_URL = "http://localhost:8080/api/sale";

const getToken = () => localStorage.getItem("token");

export const fetchSale = async () => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  if (!response.ok) throw new Error("Errore nel recupero delle sale");
  return await response.json();
};

export const addSala = async (salaData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(salaData)
  });
  if (!response.ok) throw new Error("Errore nell'aggiunta della sala");
  return await response.json();
};

export const updateSala = async (salaId, salaData) => {
  const response = await fetch(`${API_URL}/${salaId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(salaData)
  });
  if (!response.ok) throw new Error("Errore nell'aggiornamento della sala");
  return await response.json();
};

export const deleteSala = async (salaId) => {
  const response = await fetch(`${API_URL}/${salaId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  if (!response.ok) throw new Error("Errore nell'eliminazione della sala");
  if (response.status === 204) {
    return;
  }
  return await response.json();
};
