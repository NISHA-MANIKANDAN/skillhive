// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice.js'; // Correct path here
import formReducer from '../slice/skillSlice.js';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Persist only the auth slice
};
const persistedReducer = persistReducer(persistConfig, authReducer);
const store = configureStore({
  reducer: {
    auth: persistedReducer,
    form: formReducer,
  },
});
export const persistor = persistStore(store);

export default store;
