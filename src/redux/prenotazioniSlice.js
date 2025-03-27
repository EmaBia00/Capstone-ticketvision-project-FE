import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "./authSlice";

export const fetchUserBookings = createAsyncThunk("prenotazioni/fetchUserBookings", async (userId, { getState }) => {
  const token = getState().auth.token;
  try {
    const response = await fetch(`http://localhost:8080/api/prenotazioni/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Errore nella risposta:", errorText);
      throw new Error(errorText || "Errore nel recupero prenotazioni");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    Error("Errore durante fetchUserBookings:", err);
    throw err;
  }
});

export const cancelBooking = createAsyncThunk("prenotazioni/cancelBooking", async (bookingId, { getState }) => {
  const token = getState().auth.token;
  const response = await fetch(`http://localhost:8080/api/prenotazioni/${bookingId}/annulla`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error("Errore nell'annullamento");
  return bookingId;
});

export const resetPrenotazioni = createAction("prenotazioni/reset");

const prenotazioniSlice = createSlice({
  name: "prenotazioni",
  initialState: {
    bookings: [],
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter((booking) => booking.id !== action.payload);
      })
      .addCase(resetPrenotazioni, (state) => {
        state.bookings = [];
        state.status = "idle";
        state.error = null;
      })
      .addCase(logout, (state) => {
        state.bookings = [];
        state.status = "idle";
        state.error = null;
      });
  }
});

export default prenotazioniSlice.reducer;
