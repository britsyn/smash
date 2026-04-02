import { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/hooks/useSession';
import { SwipeCard } from '@/components/SwipeCard';
import { MatchModal } from '@/components/MatchModal';
import { UserProfile } from '@/types';

type Sport = 'padel' | 'tennis';
type Level = 'beginner' | 'intermediate' | 'advanced';

const SPORTS: { value: Sport; label: string }[] = [
  { value: 'padel', label: '🏓 Padel' },
  { value: 'tennis', label: '🎾 Tennis' },
  { value: 'football', label: '⚽ Football' },
];

const LEVELS: { value: Level; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function DiscoverScreen() {
  const { session } = useSession();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);

  const [sportFilters, setSportFilters] = useState<Sport[]>([]);
  const [levelFilters, setLevelFilters] = useState<Level[]>([]);

  const userId = session?.user.id;

  const fetchProfiles = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    const { data: swipes } = await supabase
      .from('swipes')
      .select('target_id')
      .eq('swiper_id', userId);

    const excludeIds = (swipes ?? []).map((s) => s.target_id);
    excludeIds.push(userId);

    const { data: me } = await supabase
      .from('profiles')
      .select('sport')
      .eq('id', userId)
      .single();

    const activeSports = sportFilters.length > 0 ? sportFilters : [me?.sport].filter(Boolean);

    let query = supabase
      .from('profiles')
      .select('id, name, avatar_url, sport, skill_level, location, bio')
      .in('sport', activeSports)
      .limit(20);

    if (levelFilters.length > 0) {
      query = query.in('skill_level', levelFilters);
    }

    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`);
    }

    const { data } = await query;
    setProfiles(data ?? []);
    setLoading(false);
  }, [userId, sportFilters, levelFilters]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const toggleSport = (sport: Sport) => {
    setSportFilters((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const toggleLevel = (level: Level) => {
    setLevelFilters((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleSwipe = async (direction: 'like' | 'pass') => {
    if (!userId || profiles.length === 0) return;

    const target = profiles[0];

    await supabase.from('swipes').insert({
      swiper_id: userId,
      target_id: target.id,
      direction,
    });

    if (direction === 'like') {
      const { data: theirLike } = await supabase
        .from('swipes')
        .select('id')
        .eq('swiper_id', target.id)
        .eq('target_id', userId)
        .eq('direction', 'like')
        .single();

      if (theirLike) {
        await supabase.from('matches').insert({ user_a: userId, user_b: target.id });
        setMatchedProfile(target);
      }
    }

    setProfiles((prev) => prev.slice(1));
  };

  if (!session) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Sign in to discover players</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.header}>Discover</Text>

        {/* Filters */}
        <View style={styles.filtersBlock}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {SPORTS.map((s) => (
              <TouchableOpacity
                key={s.value}
                style={[styles.chip, sportFilters.includes(s.value) && styles.chipActiveSport]}
                onPress={() => toggleSport(s.value)}
              >
                <Text style={[styles.chipText, sportFilters.includes(s.value) && styles.chipTextActive]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.divider} />

            {LEVELS.map((l) => (
              <TouchableOpacity
                key={l.value}
                style={[styles.chip, levelFilters.includes(l.value) && styles.chipActiveLevel]}
                onPress={() => toggleLevel(l.value)}
              >
                <Text style={[styles.chipText, levelFilters.includes(l.value) && styles.chipTextActive]}>
                  {l.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color="#e8ff6b" size="large" />
          </View>
        ) : profiles.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyEmoji}>🎾</Text>
            <Text style={styles.emptyTitle}>No players found</Text>
            <Text style={styles.emptyText}>Try adjusting your filters</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={fetchProfiles}>
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.cardStack}>
              {profiles[1] && (
                <View style={[styles.cardWrapper, styles.backCard]} pointerEvents="none">
                  <SwipeCard
                    key={profiles[1].id}
                    profile={profiles[1]}
                    onSwipeLeft={() => {}}
                    onSwipeRight={() => {}}
                  />
                </View>
              )}
              <View style={styles.cardWrapper}>
                <SwipeCard
                  key={profiles[0].id}
                  profile={profiles[0]}
                  onSwipeLeft={() => handleSwipe('pass')}
                  onSwipeRight={() => handleSwipe('like')}
                />
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.passButton]}
                onPress={() => handleSwipe('pass')}
              >
                <Text style={styles.passIcon}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.likeButton]}
                onPress={() => handleSwipe('like')}
              >
                <Text style={styles.likeIcon}>⚡</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      <MatchModal
        visible={!!matchedProfile}
        matchedProfile={matchedProfile}
        onClose={() => setMatchedProfile(null)}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  filtersBlock: {
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  chipActiveSport: {
    backgroundColor: '#e8ff6b22',
    borderColor: '#e8ff6b',
  },
  chipActiveLevel: {
    backgroundColor: '#ffffff15',
    borderColor: '#ffffff55',
  },
  chipText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#e8ff6b',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#2a2a2a',
    marginHorizontal: 4,
  },
  cardStack: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  cardWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
  },
  backCard: {
    transform: [{ scale: 0.95 }, { translateY: 12 }],
    opacity: 0.6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingBottom: 32,
    paddingTop: 8,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  passButton: {
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#ff4d4d',
  },
  likeButton: {
    backgroundColor: '#e8ff6b',
  },
  passIcon: {
    fontSize: 24,
    color: '#ff4d4d',
    fontWeight: '700',
  },
  likeIcon: {
    fontSize: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 56,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  refreshButton: {
    marginTop: 8,
    backgroundColor: '#e8ff6b',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 20,
  },
  refreshText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
  },
});
