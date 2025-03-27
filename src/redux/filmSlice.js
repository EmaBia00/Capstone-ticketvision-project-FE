import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  films: []
};

const filmSlice = createSlice({
  name: "film",
  initialState,
  reducers: {
    setFilms(state, action) {
      state.films = action.payload;
    }
  }
});

export const { setFilms } = filmSlice.actions;
export default filmSlice.reducer;
