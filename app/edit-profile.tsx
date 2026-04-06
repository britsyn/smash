import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ProfileEditScreen } from '@/components/ProfileEditScreen';

export default function EditProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* Custom header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backBtn}
        >
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backLabel}>Profile</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        {/* Spacer to balance the back button */}
        <View style={styles.headerSpacer} />
      </View>

      <ProfileEditScreen onSaved={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingTop: 56,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    minWidth: 70,
  },
  backIcon: {
    fontSize: 28,
    color: '#e8ff6b',
    lineHeight: 30,
    marginTop: -2,
  },
  backLabel: {
    color: '#e8ff6b',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
  },
  headerSpacer: {
    minWidth: 70,
  },
});
