import { createSlice } from '@reduxjs/toolkit';

const getUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch {
    return null;
  }
};

const initialState = {
  token: sessionStorage.getItem('token') || null,
  user: getUserFromStorage(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      sessionStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user)); // User persists across sessions
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      sessionStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    rehydrateAuth: (state) => {
      state.token = sessionStorage.getItem('token') || null;
      state.user = getUserFromStorage();
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, logout, rehydrateAuth, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token);
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
