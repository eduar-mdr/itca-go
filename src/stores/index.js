import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../modules/auth/stores/userSlice';
import exploreReducer from '../modules/explore/stores/exploreSlice';
import routeDetailReducer from '../modules/route-detail/stores/routeDetailSlice';
import myTripsReducer from '../modules/trips/stores/myTripsSlice';
import notificationsReducer from '../modules/notifications/stores/notificationsSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    explore: exploreReducer,
    routeDetail: routeDetailReducer,
    myTrips: myTripsReducer,
    notifications: notificationsReducer,
  },
});

export default store;
