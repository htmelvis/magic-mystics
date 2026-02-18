import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';

export default function HistoryScreen() {
  const { user } = useAuth();
  const { limits } = useSubscription(user?.id);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reading History</Text>
      <Text style={styles.subtitle}>
        {limits.maxReadingHistory === -1
          ? 'Unlimited history'
          : `Last ${limits.maxReadingHistory} readings`}
      </Text>

      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No readings yet</Text>
        <Text style={styles.emptySubtext}>
          Draw your first card from the Home screen to begin your journey
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
