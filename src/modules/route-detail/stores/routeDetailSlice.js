import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentItem: null,
  itemType: null,
  comments: [],
  subscribers: [],
  passengers: [],
  loading: false,
  error: null,
};

const routeDetailSlice = createSlice({
  name: 'routeDetail',
  initialState,
  reducers: {
    setCurrentItem(state, action) {
      state.currentItem = action.payload.item;
      state.itemType = action.payload.type;
      state.subscribers = action.payload.item?.subscribers || [];
      state.passengers = action.payload.item?.passengers || [];
      state.error = null;
    },
    setComments(state, action) {
      state.comments = action.payload;
    },
    setSubscribers(state, action) {
      state.subscribers = action.payload;
    },
    setPassengers(state, action) {
      state.passengers = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    clearDetail() {
      return initialState;
    },
  },
});

export const {
  setCurrentItem,
  setComments,
  setSubscribers,
  setPassengers,
  setLoading,
  setError,
  clearDetail,
} = routeDetailSlice.actions;

export default routeDetailSlice.reducer;
