import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/hooks/useSession';

interface MatchOption {
  id: string;
  other_name: string;
  sport: string;
}

interface LogGameSheetProps {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function LogGameSheet({ visible, onClose, onSaved }: LogGameSheetProps) {
  const { session } = useSession();
  const userId = session?.user.id;

  const [matches, setMatches] = useState<MatchOption[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchOption | null>(null);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    if (visible && userId) fetchMatches();
  }, [visible, userId]);

  const fetchMatches = async () => {
    if (!userId) return;
    setLoadingMatches(true);

    const { data } = await supabase
      .from('matches')
      .select('id, user_a, user_b')
      .or(`user_a.eq.${userId},user_b.eq.${userId}`);

    if (!data) {
      setLoadingMatches(false);
      return;
    }

    const options: MatchOption[] = await Promise.all(
      data.map(async (m) => {
        const otherId = m.user_a === userId ? m.user_b : m.user_a;
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, sport')
          .eq('id', otherId)
          .single();
        return {
          id: m.id,
          other_name: profile?.name ?? 'Unknown',
          sport: profile?.sport ?? 'padel',
        };
      })
    );

    setMatches(options);
    setLoadingMatches(false);
  };

  const onDateChange = (_: DateTimePickerEvent, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) {
      setDate((prev) => {
        const next = new Date(selected);
        next.setHours(prev.getHours(), prev.getMinutes());
        return next;
      });
    }
  };

  const onTimeChange = (_: DateTimePickerEvent, selected?: Date) => {
    setShowTimePicker(false);
    if (selected) {
      setDate((prev) => {
        const next = new Date(prev);
        next.setHours(selected.getHours(), selected.getMinutes());
        return next;
      });
    }
  };

  const save = async () => {
    if (!selectedMatch || !location.trim() || !userId) return;
    setSaving(true);

    // Insert game
    const { data: game, error } = await supabase
      .from('games')
      .insert({
        host_id: userId,
        match_id: selectedMatch.id,
        sport: selectedMatch.sport,
        location: location.trim(),
        scheduled_at: date.toISOString(),
        status: 'pending',
      })
      .select('id')
      .single();

    if (error || !game) {
      setSaving(false);
      return;
    }

    // Add both players from the match
    const match = matches.find((m) => m.id === selectedMatch.id);
    const { data: matchRow } = await supabase
      .from('matches')
      .select('user_a, user_b')
      .eq('id', selectedMatch.id)
      .single();

    if (matchRow) {
      await supabase.from('game_players').insert([
        { game_id: game.id, user_id: matchRow.user_a },
        { game_id: game.id, user_id: matchRow.user_b },
      ]);
    }

    setSaving(false);
    resetForm();
    onSaved();
  };

  const resetForm = () => {
    setSelectedMatch(null);
    setLocation('');
    setDate(new Date());
  };

  const canSave = !!selectedMatch && location.trim().length > 0 && !saving;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.dismiss} onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheet}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>Log a Game</Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
            {/* Match picker */}
            <Text style={styles.label}>Match</Text>
            {loadingMatches ? (
              <ActivityIndicator color="#e8ff6b" style={{ marginVertical: 12 }} />
            ) : matches.length === 0 ? (
              <Text style={styles.noMatches}>No matches yet — go swipe!</Text>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.matchRow}
              >
                {matches.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[
                      styles.matchChip,
                      selectedMatch?.id === m.id && styles.matchChipSelected,
                    ]}
                    onPress={() => setSelectedMatch(m)}
                  >
                    <Text
                      style={[
                        styles.matchChipText,
                        selectedMatch?.id === m.id && styles.matchChipTextSelected,
                      ]}
                    >
                      vs {m.other_name}
                    </Text>
                    <Text style={styles.matchChipSport}>{m.sport}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Date & Time */}
            <Text style={styles.label}>Date & Time</Text>
            <View style={styles.dateRow}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  📅{' '}
                  {date.toLocaleDateString([], {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  🕐{' '}
                  {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                minimumDate={new Date()}
                onChange={onDateChange}
                themeVariant="dark"
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                onChange={onTimeChange}
                themeVariant="dark"
              />
            )}

            {/* Location */}
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Club, court, address..."
              placeholderTextColor="#555"
              value={location}
              onChangeText={setLocation}
              returnKeyType="done"
            />

            {/* Save */}
            <TouchableOpacity
              style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
              onPress={save}
              disabled={!canSave}
            >
              {saving ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.saveText}>Save Game</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  dismiss: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#151515',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 16,
  },
  form: {
    gap: 6,
    paddingBottom: 8,
  },
  label: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 8,
  },
  noMatches: {
    color: '#555',
    fontSize: 14,
    fontStyle: 'italic',
  },
  matchRow: {
    gap: 10,
    paddingBottom: 4,
  },
  matchChip: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#2a2a2a',
    alignItems: 'center',
    gap: 2,
  },
  matchChipSelected: {
    borderColor: '#e8ff6b',
    backgroundColor: '#e8ff6b18',
  },
  matchChipText: {
    color: '#ccc',
    fontWeight: '700',
    fontSize: 14,
  },
  matchChipTextSelected: {
    color: '#e8ff6b',
  },
  matchChipSport: {
    color: '#555',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  saveButton: {
    backgroundColor: '#e8ff6b',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 16,
  },
});
