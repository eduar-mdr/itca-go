import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../modules/auth/stores/userSlice';
import exploreReducer from '../modules/explore/stores/exploreSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    explore: exploreReducer,
  },
});

export default store;
