export const fetchUsers = async () => {
  const response = await fetch("http://localhost:8080/api/users", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  if (!response.ok) throw new Error("Errore nel recupero utenti");
  return await response.json();
};

export const updateUserRole = async (userId, newRole) => {
  const response = await fetch(`http://localhost:8080/api/users/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ role: newRole })
  });
  if (!response.ok) throw new Error("Errore nell'aggiornamento del ruolo");
};

export const updateUserData = async (userId, { name, email, password }) => {
  const userData = { name, email };
  if (password && password.trim() !== "") {
    userData.password = password;
  }

  const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(userData)
  });
  if (!response.ok) throw new Error("Errore nell'aggiornamento dell'utente");
};

export const deleteUser = async (userId) => {
  const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  if (!response.ok) throw new Error("Errore nell'eliminazione dell'utente");
};
