import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { UserProfile } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.35;

interface SwipeCardProps {
  profile: UserProfile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function SwipeCard({ profile, onSwipeLeft, onSwipeRight }: SwipeCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY / 4;
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(SCREEN_WIDTH * 1.5);
        runOnJS(onSwipeRight)();
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5);
        runOnJS(onSwipeLeft)();
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-12, 0, 12],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const likeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const passOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        {profile.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.avatarInitial}>{profile.name[0]}</Text>
          </View>
        )}

        <Animated.View style={[styles.badge, styles.likeBadge, likeOpacity]}>
          <Text style={styles.badgeText}>SMASH</Text>
        </Animated.View>

        <Animated.View style={[styles.badge, styles.passBadge, passOpacity]}>
          <Text style={[styles.badgeText, styles.passBadgeText]}>PASS</Text>
        </Animated.View>

        <View style={styles.info}>
          <Text style={styles.name}>{profile.name}</Text>
          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{profile.sport}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{profile.skill_level}</Text>
            </View>
          </View>
          {profile.location && (
            <Text style={styles.location}>📍 {profile.location}</Text>
          )}
          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - 32,
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
    position: 'absolute',
  },
  image: {
    width: '100%',
    height: '65%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '65%',
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 80,
    color: '#e8ff6b',
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: 48,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 3,
  },
  likeBadge: {
    left: 20,
    borderColor: '#e8ff6b',
    transform: [{ rotate: '-15deg' }],
  },
  passBadge: {
    right: 20,
    borderColor: '#ff4d4d',
    transform: [{ rotate: '15deg' }],
  },
  badgeText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#e8ff6b',
    letterSpacing: 2,
  },
  passBadgeText: {
    color: '#ff4d4d',
  },
  info: {
    padding: 20,
    gap: 8,
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e8ff6b',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  location: {
    color: '#888',
    fontSize: 14,
  },
  bio: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
});
