// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice.js';
import blog from '../slice/blogSclice.js' // Correct path here

const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blog,
  },
});

export default store;
