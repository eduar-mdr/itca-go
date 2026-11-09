import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../modules/auth/stores/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
