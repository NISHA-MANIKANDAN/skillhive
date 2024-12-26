// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice.js';
import formReducer from '../slice/skillSlice.js';
import blogReducer from '../slice/blogSlice.js';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']
};

const rootReducer = {
  auth: authReducer,
  form: formReducer,
  blog: blogReducer
};

const persistedReducer = persistCombineReducers(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER']
      }
    })
});

export const persistor = persistStore(store);
export default store;