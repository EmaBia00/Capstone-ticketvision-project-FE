import { createSlice } from "@reduxjs/toolkit";

const loadInitialAuthState = () => {
  const token = localStorage.getItem("token");
  return {
    id: localStorage.getItem("id") || null,
    email: localStorage.getItem("email") || null,
    name: localStorage.getItem("name") || null,
    role: localStorage.getItem("role") || null,
    token: token,
    isAuthenticated: !!token
  };
};

const initialState = loadInitialAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.id = parseInt(action.payload.id);
      state.email = action.payload.email;
      state.name = action.payload.name || "";
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      localStorage.setItem("id", action.payload.id);
      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("name", action.payload.name || "");
      localStorage.setItem("role", action.payload.role);
      localStorage.setItem("token", action.payload.token);
    },
    logout(state) {
      state.id = null;
      state.email = null;
      state.name = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("id");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
    },
    resetState(state) {
      state.id = null;
      state.email = null;
      state.name = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    forceRefresh(state) {
      return { ...state };
    }
  }
});

export const { login, logout, resetState, forceRefresh } = authSlice.actions;
export default authSlice.reducer;
