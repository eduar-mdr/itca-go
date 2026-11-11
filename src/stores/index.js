import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../modules/auth/stores/userSlice';
import exploreReducer from '../modules/explore/stores/exploreSlice';
import routeDetailReducer from '../modules/route-detail/stores/routeDetailSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    explore: exploreReducer,
    routeDetail: routeDetailReducer,
  },
});

export default store;
