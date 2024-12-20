// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice.js'; // Correct path here

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
