import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
};

const recalcUnread = (notifications) =>
  notifications.filter((n) => !n.read).length;

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action) {
      const exists = state.notifications.some((n) => n.id === action.payload.id);
      if (!exists) {
        state.notifications.unshift(action.payload);
        state.unreadCount = recalcUnread(state.notifications);
      }
    },
    markAsRead(state, action) {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.read = true;
        state.unreadCount = recalcUnread(state.notifications);
      }
    },
    markAllAsRead(state) {
      state.notifications.forEach((n) => { n.read = true; });
      state.unreadCount = 0;
    },
    clearNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, clearNotifications } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
