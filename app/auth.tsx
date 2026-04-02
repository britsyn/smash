import { useState } from 'react';
import {
  ActivityIndicator,
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

type Mode = 'signin' | 'signup';
type Sport = 'padel' | 'tennis' | 'football';
type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validate(mode: Mode, name: string, email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (mode === 'signup' && name.trim().length < 2) {
    errors.name = 'Enter at least 2 characters';
  }
  if (!validateEmail(email)) {
    errors.email = 'Enter a valid email address';
  }
  if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  return errors;
}

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [sport, setSport] = useState<Sport>('padel');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('intermediate');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  const handleSignIn = async () => {
    const errors = validate('signin', '', email, password);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setServerError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setServerError(error.message);
    setLoading(false);
  };

  const handleSignUp = async () => {
    const errors = validate('signup', name, email, password);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setServerError(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: 'smash://auth/callback',
        data: { name: name.trim(), sport, skill_level: skillLevel },
      },
    });
    if (error) {
      setServerError(error.message);
    } else if (data.session === null) {
      setCheckEmail(true);
    }
    setLoading(false);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setFieldErrors({});
    setServerError(null);
  };

  if (checkEmail) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={{ fontSize: 48 }}>📬</Text>
        <Text style={styles.logoText}>Check your email</Text>
        <Text style={[styles.tagline, { textAlign: 'center', marginTop: 8 }]}>
          We sent a confirmation link to{'\n'}{email.trim()}
        </Text>
        <Text style={[styles.tagline, { textAlign: 'center', color: '#444', marginTop: 4 }]}>
          Tap the link — it'll open the app automatically.
        </Text>
        <TouchableOpacity
          style={[styles.cta, { marginTop: 32, paddingHorizontal: 32 }]}
          onPress={() => { setCheckEmail(false); switchMode('signin'); }}
        >
          <Text style={styles.ctaText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoBlock}>
          <Text style={styles.logoEmoji}>🎾</Text>
          <Text style={styles.logoText}>SMASH</Text>
          <Text style={styles.tagline}>Find your next game partner</Text>
        </View>

        {/* Mode toggle */}
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'signin' && styles.toggleBtnActive]}
            onPress={() => switchMode('signin')}
          >
            <Text style={[styles.toggleLabel, mode === 'signin' && styles.toggleLabelActive]}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'signup' && styles.toggleBtnActive]}
            onPress={() => switchMode('signup')}
          >
            <Text style={[styles.toggleLabel, mode === 'signup' && styles.toggleLabelActive]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Name (signup only) */}
        {mode === 'signup' && (
          <View style={styles.fieldBlock}>
            <TextInput
              style={[styles.input, fieldErrors.name ? styles.inputError : null]}
              placeholder="Your name"
              placeholderTextColor="#555"
              value={name}
              onChangeText={(t) => { setName(t); setFieldErrors((e) => ({ ...e, name: undefined })); }}
              autoCapitalize="words"
            />
            {fieldErrors.name && <Text style={styles.fieldError}>{fieldErrors.name}</Text>}
          </View>
        )}

        {/* Email */}
        <View style={styles.fieldBlock}>
          <TextInput
            style={[styles.input, fieldErrors.email ? styles.inputError : null]}
            placeholder="Email"
            placeholderTextColor="#555"
            value={email}
            onChangeText={(t) => { setEmail(t); setFieldErrors((e) => ({ ...e, email: undefined })); }}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />
          {fieldErrors.email && <Text style={styles.fieldError}>{fieldErrors.email}</Text>}
        </View>

        {/* Password */}
        <View style={styles.fieldBlock}>
          <TextInput
            style={[styles.input, fieldErrors.password ? styles.inputError : null]}
            placeholder="Password"
            placeholderTextColor="#555"
            value={password}
            onChangeText={(t) => { setPassword(t); setFieldErrors((e) => ({ ...e, password: undefined })); }}
            secureTextEntry
          />
          {fieldErrors.password && <Text style={styles.fieldError}>{fieldErrors.password}</Text>}
        </View>

        {/* Sport + skill (signup only) */}
        {mode === 'signup' && (
          <>
            <Text style={styles.sectionLabel}>Sport</Text>
            <View style={styles.chipRow}>
              {(['padel', 'tennis', 'football'] as Sport[]).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, sport === s && styles.chipActive]}
                  onPress={() => setSport(s)}
                >
                  <Text style={[styles.chipText, sport === s && styles.chipTextActive]}>
                    {s === 'padel' ? '🏓 Padel' : s === 'tennis' ? '🎾 Tennis' : '⚽ Football'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Skill level</Text>
            <View style={styles.chipRow}>
              {(['beginner', 'intermediate', 'advanced'] as SkillLevel[]).map((lvl) => (
                <TouchableOpacity
                  key={lvl}
                  style={[styles.chip, skillLevel === lvl && styles.chipActive]}
                  onPress={() => setSkillLevel(lvl)}
                >
                  <Text style={[styles.chipText, skillLevel === lvl && styles.chipTextActive]}>
                    {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Server error */}
        {serverError && <Text style={styles.serverError}>{serverError}</Text>}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.cta, loading && styles.ctaDisabled]}
          onPress={mode === 'signin' ? handleSignIn : handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.ctaText}>
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  logoBlock: {
    alignItems: 'center',
    marginBottom: 40,
    gap: 6,
  },
  logoEmoji: {
    fontSize: 52,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#e8ff6b',
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#555',
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#e8ff6b',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555',
  },
  toggleLabelActive: {
    color: '#000',
  },
  fieldBlock: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  inputError: {
    borderColor: '#ff4d4d',
  },
  fieldError: {
    color: '#ff4d4d',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  sectionLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 16,
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
    marginBottom: 12,
    textAlign: 'center',
  },
  cta: {
    backgroundColor: '#e8ff6b',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  ctaDisabled: {
    opacity: 0.6,
  },
  ctaText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '800',
  },
});
