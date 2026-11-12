import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ref, onChildAdded, off } from 'firebase/database';
import { database } from '../../../config/firebase';
import {
  addNotification,
  markAsRead,
  markAllAsRead,
} from '../stores/notificationsSlice';

export default function useNotifications() {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((s) => s.notifications);
  const userId = useSelector((s) => s.user.user?._id);

  useEffect(() => {
    if (!userId) return;

    const notifRef = ref(database, `notifications/${userId}`);

    const handler = onChildAdded(notifRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        dispatch(
          addNotification({
            id: snapshot.key,
            title: data.title || '',
            body: data.body || '',
            type: data.type || 'route',
            entityId: data.entityId || null,
            read: false,
            createdAt: data.createdAt || new Date().toISOString(),
          }),
        );
      }
    });

    return () => off(notifRef, 'child_added', handler);
  }, [userId, dispatch]);

  const markRead = useCallback(
    (id) => dispatch(markAsRead(id)),
    [dispatch],
  );

  const markAllRead = useCallback(
    () => dispatch(markAllAsRead()),
    [dispatch],
  );

  return { notifications, unreadCount, markRead, markAllRead };
}
