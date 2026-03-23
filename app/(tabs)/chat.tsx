import { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/hooks/useSession';

interface MatchRow {
  id: string;
  other_user: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
  last_message: string | null;
  last_message_at: string | null;
}

export default function ChatScreen() {
  const { session } = useSession();
  const router = useRouter();
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = session?.user.id;

  const fetchMatches = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('matches')
      .select(`
        id,
        user_a,
        user_b,
        messages (
          content,
          created_at
        )
      `)
      .or(`user_a.eq.${userId},user_b.eq.${userId}`)
      .order('created_at', { referencedTable: 'messages', ascending: false });

    if (error || !data) {
      setLoading(false);
      return;
    }

    // For each match, fetch the other user's profile
    const rows: MatchRow[] = await Promise.all(
      data.map(async (match: any) => {
        const otherId = match.user_a === userId ? match.user_b : match.user_a;

        const { data: profile } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .eq('id', otherId)
          .single();

        const messages: any[] = match.messages ?? [];
        const latest = messages.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];

        return {
          id: match.id,
          other_user: profile ?? { id: otherId, name: 'Unknown', avatar_url: null },
          last_message: latest?.content ?? null,
          last_message_at: latest?.created_at ?? null,
        };
      })
    );

    // Sort by last message time
    rows.sort((a, b) => {
      if (!a.last_message_at) return 1;
      if (!b.last_message_at) return -1;
      return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime();
    });

    setMatches(rows);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  if (!session) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Sign in to see your chats</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chats</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#e8ff6b" size="large" />
        </View>
      ) : matches.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>💬</Text>
          <Text style={styles.emptyTitle}>No matches yet</Text>
          <Text style={styles.emptyText}>Start swiping to find a partner</Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() =>
                router.push({
                  pathname: '/conversation/[matchId]',
                  params: { matchId: item.id, name: item.other_user.name },
                })
              }
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.other_user.name[0]}</Text>
              </View>
              <View style={styles.rowContent}>
                <View style={styles.rowTop}>
                  <Text style={styles.name}>{item.other_user.name}</Text>
                  {item.last_message_at && (
                    <Text style={styles.time}>
                      {formatTime(item.last_message_at)}
                    </Text>
                  )}
                </View>
                <Text style={styles.preview} numberOfLines={1}>
                  {item.last_message ?? 'Say hello 👋'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

function formatTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2a2a2a',
    borderWidth: 2,
    borderColor: '#e8ff6b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#e8ff6b',
    fontSize: 20,
    fontWeight: '700',
  },
  rowContent: {
    flex: 1,
    gap: 4,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  time: {
    color: '#555',
    fontSize: 12,
  },
  preview: {
    color: '#777',
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#1a1a1a',
    marginLeft: 86,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  emptyText: { fontSize: 14, color: '#555' },
});
