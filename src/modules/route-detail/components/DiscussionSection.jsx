import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Card from '../../../components/card/Card';
import { lightTheme, spacing, borderRadius, fontSize } from '../../../styles/theme';

const formatRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'ahora';
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `hace ${diffHrs}h`;
  const diffDays = Math.floor(diffHrs / 24);
  return `hace ${diffDays}d`;
};

export default function DiscussionSection({ comments = [], onSendComment, loading = false, theme = lightTheme }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    onSendComment(trimmed);
    setText('');
  };

  const renderComment = ({ item }) => (
    <View style={[styles.bubble, { backgroundColor: theme.background, borderColor: theme.border }]}>
      <Text style={[styles.author, { color: theme.primary }]}>{item.author?.name || 'Usuario'}</Text>
      <Text style={[styles.commentText, { color: theme.textPrimary }]}>{item.text}</Text>
      <Text style={[styles.time, { color: theme.textSecondary }]}>{formatRelativeTime(item.createdAt)}</Text>
    </View>
  );

  return (
    <Card style={styles.card} theme={theme}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Comentarios ({comments.length})</Text>

      {comments.length === 0 ? (
        <Text style={[styles.empty, { color: theme.textSecondary }]}>Sin comentarios aún. Inicia la conversación.</Text>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item._id}
          renderItem={renderComment}
          scrollEnabled={false}
          style={styles.list}
        />
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { borderColor: theme.border, color: theme.textPrimary, backgroundColor: theme.background }]}
          placeholder="Escribe un comentario..."
          placeholderTextColor={theme.textSecondary}
          value={text}
          onChangeText={setText}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: theme.primary }, (!text.trim() || loading) && styles.sendDisabled]}
          onPress={handleSend}
          disabled={!text.trim() || loading}
        >
          <Text style={styles.sendText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  empty: {
    fontSize: fontSize.sm,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  list: {
    marginBottom: spacing.sm,
  },
  bubble: {
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
  },
  author: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    marginBottom: 2,
  },
  commentText: {
    fontSize: fontSize.sm,
  },
  time: {
    fontSize: fontSize.xs,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm,
    fontSize: fontSize.sm,
  },
  sendButton: {
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sendDisabled: {
    opacity: 0.4,
  },
  sendText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
});
