import { useEffect, useRef, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/hooks/useSession';

type Sport = 'padel' | 'tennis' | 'football';
type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

const SPORTS: { value: Sport; label: string }[] = [
  { value: 'padel', label: '🏓 Padel' },
  { value: 'tennis', label: '🎾 Tennis' },
  { value: 'football', label: '⚽ Football' },
];

const LEVELS: { value: SkillLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const BIO_MAX = 300;

interface FieldErrors {
  name?: string;
  bio?: string;
}

interface ProfileEditScreenProps {
  onSaved: () => void;
}

export function ProfileEditScreen({ onSaved }: ProfileEditScreenProps) {
  const { session } = useSession();
  const userId = session?.user.id;

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [sport, setSport] = useState<Sport>('padel');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('intermediate');
  const [location, setLocation] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const toastOpacity = useRef(new Animated.Value(0)).current;
  // Synchronous guard — prevents double-submit even before setSaving re-renders
  const savingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = () => {
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1600),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    fetchProfile();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [userId]);

  const fetchProfile = async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('name, bio, sport, skill_level, location')
      .eq('id', userId)
      .single();

    if (data) {
      setName(data.name ?? '');
      setBio(data.bio ?? '');
      setSport((data.sport as Sport) ?? 'padel');
      setSkillLevel((data.skill_level as SkillLevel) ?? 'intermediate');
      setLocation(data.location ?? '');
    }
    setLoading(false);
  };

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (name.trim().length < 2) next.name = 'Name must be at least 2 characters';
    if (bio.length > BIO_MAX) next.bio = `Bio must be ${BIO_MAX} characters or less`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = useCallback(async () => {
    // Synchronous guard — blocks before React has a chance to re-render
    if (savingRef.current || !userId) return;
    if (!validate()) return;

    savingRef.current = true;
    setSaving(true);
    setServerError(null);

    const { error } = await supabase
      .from('profiles')
      .update({
        name: name.trim(),
        bio: bio.trim() || null,
        sport,
        skill_level: skillLevel,
        location: location.trim() || null,
      })
      .eq('id', userId);

    savingRef.current = false;
    setSaving(false);

    if (error) {
      setServerError(error.message);
      return;
    }

    showToast();
    timeoutRef.current = setTimeout(onSaved, 2100);
  }, [userId, name, bio, sport, skillLevel, location, onSaved]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#e8ff6b" size="large" />
      </View>
    );
  }

  return (
    <>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
        >
          {/* Name */}
          <Text style={styles.label}>Name</Text>
          <View style={styles.fieldBlock}>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              value={name}
              onChangeText={(t) => { setName(t); setErrors((e) => ({ ...e, name: undefined })); }}
              placeholder="Your name"
              placeholderTextColor="#555"
              autoCapitalize="words"
              returnKeyType="next"
            />
            {errors.name && <Text style={styles.fieldError}>{errors.name}</Text>}
          </View>

          {/* Location */}
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="City, country..."
            placeholderTextColor="#555"
            returnKeyType="next"
          />

          {/* Sport */}
          <Text style={styles.label}>Sport</Text>
          <View style={styles.chipRow}>
            {SPORTS.map((s) => (
              <TouchableOpacity
                key={s.value}
                style={[styles.chip, sport === s.value && styles.chipActive]}
                onPress={() => setSport(s.value)}
              >
                <Text style={[styles.chipText, sport === s.value && styles.chipTextActive]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Skill level */}
          <Text style={styles.label}>Skill Level</Text>
          <View style={styles.chipRow}>
            {LEVELS.map((l) => (
              <TouchableOpacity
                key={l.value}
                style={[styles.chip, skillLevel === l.value && styles.chipActive]}
                onPress={() => setSkillLevel(l.value)}
              >
                <Text style={[styles.chipText, skillLevel === l.value && styles.chipTextActive]}>
                  {l.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bio */}
          <View style={styles.bioHeader}>
            <Text style={styles.label}>Bio</Text>
            <Text style={[styles.charCount, bio.length > BIO_MAX && styles.charCountOver]}>
              {bio.length}/{BIO_MAX}
            </Text>
          </View>
          <View style={styles.fieldBlock}>
            <TextInput
              style={[styles.input, styles.bioInput, errors.bio ? styles.inputError : null]}
              value={bio}
              onChangeText={(t) => { setBio(t); if (t.length <= BIO_MAX) setErrors((e) => ({ ...e, bio: undefined })); }}
              placeholder="Tell players about yourself..."
              placeholderTextColor="#555"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {errors.bio && <Text style={styles.fieldError}>{errors.bio}</Text>}
          </View>

          {serverError && <Text style={styles.serverError}>{serverError}</Text>}

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Animated.View style={[styles.toast, { opacity: toastOpacity }]} pointerEvents="none">
        <Text style={styles.toastText}>✓  Profile updated</Text>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 4,
  },
  label: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 8,
  },
  fieldBlock: {
    gap: 4,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  inputError: {
    borderColor: '#ff4d4d',
  },
  bioInput: {
    height: 110,
    paddingTop: 13,
  },
  bioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  charCount: {
    color: '#555',
    fontSize: 12,
    marginBottom: 8,
  },
  charCountOver: {
    color: '#ff4d4d',
  },
  fieldError: {
    color: '#ff4d4d',
    fontSize: 12,
    marginLeft: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  chipActive: {
    backgroundColor: '#e8ff6b22',
    borderColor: '#e8ff6b',
  },
  chipText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#e8ff6b',
  },
  serverError: {
    color: '#ff4d4d',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#e8ff6b',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 28,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 16,
  },
  toast: {
    position: 'absolute',
    bottom: 48,
    alignSelf: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e8ff6b55',
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  toastText: {
    color: '#e8ff6b',
    fontSize: 14,
    fontWeight: '700',
  },
});
