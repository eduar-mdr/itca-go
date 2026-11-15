import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  createdRoutes: [],
  subscribedRoutes: [],
  createdTrips: [],
  subscribedTrips: [],
  loading: false,
  error: null,
};

const myTripsSlice = createSlice({
  name: 'myTrips',
  initialState,
  reducers: {
    setCreatedRoutes(state, action) {
      state.createdRoutes = action.payload;
    },
    setSubscribedRoutes(state, action) {
      state.subscribedRoutes = action.payload;
    },
    setCreatedTrips(state, action) {
      state.createdTrips = action.payload;
    },
    setSubscribedTrips(state, action) {
      state.subscribedTrips = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    clearMyTrips(state) {
      state.createdRoutes = [];
      state.subscribedRoutes = [];
      state.createdTrips = [];
      state.subscribedTrips = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setCreatedRoutes,
  setSubscribedRoutes,
  setCreatedTrips,
  setSubscribedTrips,
  setLoading,
  setError,
  clearMyTrips,
} = myTripsSlice.actions;

export default myTripsSlice.reducer;
