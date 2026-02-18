import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { testSupabaseConnection, testAuth } from '@lib/supabase/test-connection';

export default function HomeScreen() {
  const { user } = useAuth();
  const { isPremium, limits } = useSubscription(user?.id);

  const handleTestConnection = async () => {
    const result = await testSupabaseConnection();
    const authResult = await testAuth();
    
    Alert.alert(
      'Supabase Test Results',
      `Connection: ${result.message}\n\nAuth: ${authResult.authenticated ? `Logged in as ${authResult.user?.email}` : 'Not authenticated'}`
    );
  };

  const handleDrawCard = () => {
    // TODO: Implement card drawing logic
    console.warn('Draw card functionality coming soon!');
  };

  const handlePPFSpread = () => {
    if (!isPremium) {
      console.warn('Premium feature - upgrade to access PPF spread');
      return;
    }
    // TODO: Implement PPF spread logic
    console.warn('PPF spread functionality coming soon!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Magic Mystics</Text>
      <Text style={styles.subtitle}>Your Daily Tarot Companion</Text>

      <View style={styles.cardContainer}>
        <Pressable style={styles.primaryButton} onPress={handleDrawCard}>
          <Text style={styles.primaryButtonText}>✨ Draw Daily Card ✨</Text>
        </Pressable>

        <Pressable
          style={[styles.secondaryButton, !isPremium && styles.disabledButton]}
          onPress={handlePPFSpread}
          disabled={!isPremium}
        >
          <Text style={styles.secondaryButtonText}>
            🔮 Past/Present/Future {!isPremium && '(Premium)'}
          </Text>
        </Pressable>
      </View>

      {!isPremium && (
        <View style={styles.promoCard}>
          <Text style={styles.promoTitle}>Unlock Premium</Text>
          <Text style={styles.promoText}>
            • Unlimited reading history{'\n'}
            • Monthly Past/Present/Future spreads{'\n'}
            • AI insights with personalized context{'\n'}
          </Text>
          <Text style={styles.promoPrice}>$49/year</Text>
        </View>
      )}

      <Pressable style={styles.testButton} onPress={handleTestConnection}>
        <Text style={styles.testButtonText}>🔍 Test Supabase Connection</Text>
      </Pressable>
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
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    color: '#8b5cf6',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    marginBottom: 60,
  },
  cardContainer: {
    gap: 20,
  },
  primaryButton: {
    backgroundColor: '#8b5cf6',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f3e8ff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  secondaryButtonText: {
    color: '#8b5cf6',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  promoCard: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#8b5cf6',
  },
  promoText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 12,
  },
  promoPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  testButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
});
