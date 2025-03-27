import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import filmReducer from "./filmSlice";
import prenotazioniReducer from "./prenotazioniSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    film: filmReducer,
    prenotazioni: prenotazioniReducer
  }
});

export default store;
