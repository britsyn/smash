import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/hooks/useSession';
import { LogGameSheet } from '@/components/LogGameSheet';

type GameStatus = 'pending' | 'confirmed';

interface Player {
  id: string;
  name: string;
  avatar_url: string | null;
}

interface Game {
  id: string;
  sport: string;
  location: string;
  scheduled_at: string;
  status: GameStatus;
  players: Player[];
}

export default function GamesScreen() {
  const { session } = useSession();
  const userId = session?.user.id;

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetVisible, setSheetVisible] = useState(false);

  const fetchGames = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    // Get all game_ids the user is part of
    const { data: playerRows } = await supabase
      .from('game_players')
      .select('game_id')
      .eq('user_id', userId);

    const gameIds = (playerRows ?? []).map((r) => r.game_id);

    if (gameIds.length === 0) {
      setGames([]);
      setLoading(false);
      return;
    }

    // Fetch those games with all their players
    const { data: gameRows } = await supabase
      .from('games')
      .select(`
        id, sport, location, scheduled_at, status,
        game_players (
          profiles ( id, name, avatar_url )
        )
      `)
      .in('id', gameIds)
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true });

    const parsed: Game[] = (gameRows ?? []).map((g: any) => ({
      id: g.id,
      sport: g.sport,
      location: g.location,
      scheduled_at: g.scheduled_at,
      status: g.status,
      players: (g.game_players ?? [])
        .map((gp: any) => gp.profiles)
        .filter(Boolean),
    }));

    setGames(parsed);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const renderGame = ({ item }: { item: Game }) => {
    const gameDate = new Date(item.scheduled_at);
    const isToday = gameDate.toDateString() === new Date().toDateString();

    return (
      <View style={styles.card}>
        {/* Top row: sport + status badge */}
        <View style={styles.cardTop}>
          <View style={styles.sportBadge}>
            <Text style={styles.sportEmoji}>{item.sport === 'padel' ? '🏓' : item.sport === 'football' ? '⚽' : '🎾'}</Text>
            <Text style={styles.sportLabel}>{item.sport}</Text>
          </View>
          <View style={[styles.statusBadge, item.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending]}>
            <Text style={[styles.statusText, item.status === 'confirmed' ? styles.statusTextConfirmed : styles.statusTextPending]}>
              {item.status}
            </Text>
          </View>
        </View>

        {/* Date & time */}
        <View style={styles.dateBlock}>
          <Text style={styles.dateDay}>
            {isToday
              ? 'Today'
              : gameDate.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
          </Text>
          <Text style={styles.dateTime}>
            {gameDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        {/* Players */}
        {item.players.length > 0 && (
          <View style={styles.playersRow}>
            {item.players.map((p) => (
              <View key={p.id} style={styles.playerChip}>
                <View style={[styles.playerAvatar, p.id === userId && styles.playerAvatarMe]}>
                  <Text style={[styles.playerAvatarText, p.id === userId && styles.playerAvatarTextMe]}>
                    {p.name[0]}
                  </Text>
                </View>
                <Text style={[styles.playerName, p.id === userId && styles.playerNameMe]}>
                  {p.id === userId ? 'You' : p.name.split(' ')[0]}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Games</Text>
        <TouchableOpacity style={styles.fab} onPress={() => setSheetVisible(true)}>
          <Text style={styles.fabText}>+ Log</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#e8ff6b" size="large" />
        </View>
      ) : games.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>🏆</Text>
          <Text style={styles.emptyTitle}>No upcoming games</Text>
          <Text style={styles.emptyText}>Log a game with one of your matches</Text>
          <TouchableOpacity style={styles.logButton} onPress={() => setSheetVisible(true)}>
            <Text style={styles.logButtonText}>+ Log a Game</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id}
          renderItem={renderGame}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <LogGameSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onSaved={() => {
          setSheetVisible(false);
          fetchGames();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
  },
  fab: {
    backgroundColor: '#e8ff6b',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  fabText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: '#151515',
    borderRadius: 18,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: '#1e1e1e',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sportEmoji: {
    fontSize: 18,
  },
  sportLabel: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusConfirmed: {
    backgroundColor: '#e8ff6b18',
    borderColor: '#e8ff6b',
  },
  statusPending: {
    backgroundColor: '#ff944418',
    borderColor: '#ff9444',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusTextConfirmed: {
    color: '#e8ff6b',
  },
  statusTextPending: {
    color: '#ff9444',
  },
  dateBlock: {
    gap: 2,
  },
  dateDay: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  dateTime: {
    color: '#e8ff6b',
    fontSize: 15,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationIcon: {
    fontSize: 14,
  },
  locationText: {
    color: '#888',
    fontSize: 14,
  },
  playersRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#1e1e1e',
  },
  playerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerAvatarMe: {
    backgroundColor: '#e8ff6b22',
    borderWidth: 1.5,
    borderColor: '#e8ff6b',
  },
  playerAvatarText: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '700',
  },
  playerAvatarTextMe: {
    color: '#e8ff6b',
  },
  playerName: {
    color: '#888',
    fontSize: 13,
  },
  playerNameMe: {
    color: '#e8ff6b',
    fontWeight: '600',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  emptyText: { fontSize: 14, color: '#555', textAlign: 'center' },
  logButton: {
    marginTop: 8,
    backgroundColor: '#e8ff6b',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 20,
  },
  logButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
  },
});
