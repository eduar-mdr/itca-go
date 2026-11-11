import { useEffect, useState, useCallback } from 'react';
import * as commentService from '../../../services/comment.service';
import * as realtimeService from '../../../services/realtime.service';

export default function useComments(id, type) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = type === 'route'
        ? await commentService.getRouteComments(id)
        : await commentService.getTripComments(id);
      setComments(res.data || []);
    } catch (err) {
      // User might not be subscribed yet — comments return 403
    } finally {
      setLoading(false);
    }
  }, [id, type]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = realtimeService.subscribeToComments(type, id, (rtComments) => {
      if (rtComments.length > 0) {
        fetchComments();
      }
    });
    return () => unsubscribe();
  }, [id, type, fetchComments]);

  const sendComment = useCallback(async (text) => {
    if (!text.trim()) return;
    try {
      if (type === 'route') {
        await commentService.addRouteComment(id, text.trim());
      } else {
        await commentService.addTripComment(id, text.trim());
      }
      await fetchComments();
    } catch (err) {
      throw new Error(err.message || 'Error al enviar comentario');
    }
  }, [id, type, fetchComments]);

  return { comments, sendComment, loading, refresh: fetchComments };
}
