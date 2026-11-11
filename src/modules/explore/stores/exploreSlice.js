import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  routes: [],
  trips: [],
  filter: 'all',
  loading: false,
  error: null,
};

const exploreSlice = createSlice({
  name: 'explore',
  initialState,
  reducers: {
    setRoutes(state, action) {
      state.routes = action.payload;
    },
    setTrips(state, action) {
      state.trips = action.payload;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    clearExplore() {
      return initialState;
    },
  },
});

export const { setRoutes, setTrips, setFilter, setLoading, setError, clearExplore } =
  exploreSlice.actions;
export default exploreSlice.reducer;
