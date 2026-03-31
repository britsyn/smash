import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/hooks/useSession';
import { UserProfile } from '@/types';

const SKILL_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const SPORT_LABELS: Record<string, string> = {
  padel: '🏓 Padel',
  tennis: '🎾 Tennis',
};

export default function ProfileScreen() {
  const { session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user.id) return;
    supabase
      .from('profiles')
      .select('id, name, avatar_url, sport, skill_level, location, bio')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        setProfile(data);
        setLoading(false);
      });
  }, [session?.user.id]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#e8ff6b" size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Profile</Text>

      {/* Avatar */}
      <View style={styles.avatarBlock}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profile?.name?.[0] ?? '?'}</Text>
        </View>
        <Text style={styles.name}>{profile?.name}</Text>
        <Text style={styles.email}>{session?.user.email}</Text>
      </View>

      {/* Info cards */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Sport</Text>
          <Text style={styles.rowValue}>{SPORT_LABELS[profile?.sport ?? ''] ?? profile?.sport}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Skill level</Text>
          <Text style={styles.rowValue}>{SKILL_LABELS[profile?.skill_level ?? ''] ?? profile?.skill_level}</Text>
        </View>
        {profile?.location && (
          <>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Location</Text>
              <Text style={styles.rowValue}>{profile.location}</Text>
            </View>
          </>
        )}
      </View>

      {profile?.bio && (
        <>
          <Text style={styles.sectionLabel}>Bio</Text>
          <View style={styles.bioCard}>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>
        </>
      )}

      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 28,
  },
  avatarBlock: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#e8ff6b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#e8ff6b',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  email: {
    fontSize: 13,
    color: '#555',
  },
  section: {
    backgroundColor: '#151515',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e1e1e',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLabel: {
    color: '#666',
    fontSize: 14,
  },
  rowValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#1e1e1e',
    marginHorizontal: 16,
  },
  sectionLabel: {
    color: '#555',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  bioCard: {
    backgroundColor: '#151515',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e1e1e',
    padding: 16,
    marginBottom: 20,
  },
  bioText: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 20,
  },
  signOutBtn: {
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ff4d4d33',
    backgroundColor: '#ff4d4d11',
    paddingVertical: 14,
    alignItems: 'center',
  },
  signOutText: {
    color: '#ff4d4d',
    fontSize: 15,
    fontWeight: '700',
  },
});
