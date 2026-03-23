import { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/hooks/useSession';
import { SwipeCard } from '@/components/SwipeCard';
import { MatchModal } from '@/components/MatchModal';
import { UserProfile } from '@/types';

export default function DiscoverScreen() {
  const { session } = useSession();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchedProfile, setMatchedProfile] = useState<UserProfile | null>(null);

  const userId = session?.user.id;

  const fetchProfiles = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    // Get IDs already swiped (liked or passed)
    const { data: swipes } = await supabase
      .from('swipes')
      .select('target_id')
      .eq('swiper_id', userId);

    const excludeIds = (swipes ?? []).map((s) => s.target_id);
    excludeIds.push(userId); // exclude self

    // Fetch current user's sport
    const { data: me } = await supabase
      .from('profiles')
      .select('sport')
      .eq('id', userId)
      .single();

    // Query profiles with matching sport, excluding already swiped
    let query = supabase
      .from('profiles')
      .select('id, name, avatar_url, sport, skill_level, location, bio')
      .eq('sport', me?.sport)
      .limit(20);

    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`);
    }

    const { data } = await query;
    setProfiles(data ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleSwipe = async (direction: 'like' | 'pass') => {
    if (!userId || profiles.length === 0) return;

    const target = profiles[0];

    // Record the swipe
    await supabase.from('swipes').insert({
      swiper_id: userId,
      target_id: target.id,
      direction,
    });

    if (direction === 'like') {
      // Check if target already liked us back
      const { data: theirLike } = await supabase
        .from('swipes')
        .select('id')
        .eq('swiper_id', target.id)
        .eq('target_id', userId)
        .eq('direction', 'like')
        .single();

      if (theirLike) {
        // Mutual like — create a match
        await supabase.from('matches').insert({
          user_a: userId,
          user_b: target.id,
        });
        setMatchedProfile(target);
      }
    }

    // Remove the top card
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

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color="#e8ff6b" size="large" />
          </View>
        ) : profiles.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyEmoji}>🎾</Text>
            <Text style={styles.emptyTitle}>No more players</Text>
            <Text style={styles.emptyText}>Check back later or expand your search</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={fetchProfiles}>
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.cardStack}>
              {/* Render up to 2 cards; back card is static for depth effect */}
              {profiles[1] && (
                <View style={[styles.cardWrapper, styles.backCard]} pointerEvents="none">
                  <SwipeCard
                    profile={profiles[1]}
                    onSwipeLeft={() => {}}
                    onSwipeRight={() => {}}
                  />
                </View>
              )}
              <View style={styles.cardWrapper}>
                <SwipeCard
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
    marginBottom: 16,
    letterSpacing: 0.5,
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
