import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  myTrips: [],
  myRoutes: [],
  loading: false,
  error: null,
};

const myTripsSlice = createSlice({
  name: 'myTrips',
  initialState,
  reducers: {
    setMyTrips(state, action) {
      state.myTrips = action.payload;
    },
    setMyRoutes(state, action) {
      state.myRoutes = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    clearMyTrips(state) {
      state.myTrips = [];
      state.myRoutes = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setMyTrips, setMyRoutes, setLoading, setError, clearMyTrips } = myTripsSlice.actions;
export default myTripsSlice.reducer;
