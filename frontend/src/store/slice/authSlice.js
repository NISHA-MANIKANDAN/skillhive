// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const getUserFromStorage = () => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log('Retrieved user from sessionStorage:', user);
    return user || null;
  } catch {
    console.log('Failed to parse user from sessionStorage');
    return null;
  }
};

const initialState = {
  token: sessionStorage.getItem('token') || null,
  user: getUserFromStorage(),
  loading: false,
  error: null,
};

console.log('Initial auth state:', initialState);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      console.log('Setting new credentials - Token:', token);
      console.log('Setting new credentials - User:', user);
      
      state.token = token;
      state.user = user;
      
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
      console.log('Credentials saved to sessionStorage');
    },
    logout: (state) => {
      console.log('Logging out - Clearing credentials');
      state.token = null;
      state.user = null;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      console.log('SessionStorage cleared');
    },
    rehydrateAuth: (state) => {
      const token = sessionStorage.getItem('token');
      const user = getUserFromStorage();
      console.log('Rehydrating auth state - Token:', token);
      console.log('Rehydrating auth state - User:', user);
      
      state.token = token || null;
      state.user = user;
    },
  },
});

export const { setCredentials, logout, rehydrateAuth } = authSlice.actions;

export default authSlice.reducer;

// Updated selector to explicitly check for token
export const selectIsAuthenticated = (state) => Boolean(state.auth.token && sessionStorage.getItem('token'));
export const selectCurrentUser = (state) => state.auth.user;