import React, { useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { UserProfile } from '@/types';

interface MatchModalProps {
  visible: boolean;
  matchedProfile: UserProfile | null;
  onClose: () => void;
}

export function MatchModal({ visible, matchedProfile, onClose }: MatchModalProps) {
  const scale = useSharedValue(0);
  const titleY = useSharedValue(40);
  const titleOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 12, stiffness: 180 });
      titleY.value = withDelay(200, withSpring(0));
      titleOpacity.value = withDelay(200, withTiming(1, { duration: 300 }));
    } else {
      scale.value = 0;
      titleY.value = 40;
      titleOpacity.value = 0;
    }
  }, [visible]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleY.value }],
    opacity: titleOpacity.value,
  }));

  if (!matchedProfile) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, cardStyle]}>
          <Animated.View style={titleStyle}>
            <Text style={styles.emoji}>🎾</Text>
            <Text style={styles.title}>It's a Match!</Text>
            <Text style={styles.subtitle}>
              You and <Text style={styles.accent}>{matchedProfile.name}</Text> both want to play
            </Text>
          </Animated.View>

          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>You</Text>
            </View>
            <Text style={styles.vs}>⚡</Text>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{matchedProfile.name[0]}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skip} onPress={onClose}>
            <Text style={styles.skipText}>Keep Swiping</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    width: '85%',
    gap: 20,
    borderWidth: 1,
    borderColor: '#e8ff6b33',
  },
  emoji: {
    fontSize: 48,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#e8ff6b',
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 22,
  },
  accent: {
    color: '#ffffff',
    fontWeight: '700',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 8,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2a2a2a',
    borderWidth: 2,
    borderColor: '#e8ff6b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#e8ff6b',
    fontSize: 22,
    fontWeight: '700',
  },
  vs: {
    fontSize: 28,
  },
  button: {
    backgroundColor: '#e8ff6b',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 16,
  },
  skip: {
    paddingVertical: 8,
  },
  skipText: {
    color: '#555',
    fontSize: 14,
  },
});
