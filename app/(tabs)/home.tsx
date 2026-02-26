import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuth } from '@hooks/useAuth';
import { useSubscription } from '@hooks/useSubscription';
import { supabase } from '@lib/supabase/client';
import { UserProfile } from '@types/user';

export default function HomeScreen() {
  const { user } = useAuth();
  const { isPremium, limits } = useSubscription(user?.id);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setUserProfile({
          id: data.id,
          email: data.email,
          displayName: data.display_name,
          avatarUrl: data.avatar_url,
          birthDate: data.birth_date,
          birthTime: data.birth_time,
          birthLocation: data.birth_location,
          sunSign: data.sun_sign,
          moonSign: data.moon_sign,
          risingSign: data.rising_sign,
          onboardingCompleted: data.onboarding_completed,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      }
    };

    fetchUserProfile();
  }, [user]);

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.userName}>{userProfile?.displayName || user?.email}</Text>
        {userProfile?.sunSign && (
          <View style={styles.zodiacBadge}>
            <Text style={styles.zodiacText}>
              ☀️ {userProfile.sunSign} • 🌙 {userProfile.moonSign} • ⬆️ {userProfile.risingSign}
            </Text>
          </View>
        )}
      </View>

      {/* Main Actions */}
      <View style={styles.actionsContainer}>
        <Pressable style={styles.primaryButton} onPress={handleDrawCard}>
          <Text style={styles.primaryButtonIcon}>✨</Text>
          <Text style={styles.primaryButtonText}>Draw Your Daily Card</Text>
          <Text style={styles.primaryButtonSubtext}>Discover today's message</Text>
        </Pressable>

        <Pressable
          style={[styles.secondaryButton, !isPremium && styles.disabledButton]}
          onPress={handlePPFSpread}
          disabled={!isPremium}
        >
          <Text style={styles.secondaryButtonIcon}>🔮</Text>
          <Text style={styles.secondaryButtonText}>
            Past/Present/Future {!isPremium && '(Premium)'}
          </Text>
          <Text style={styles.secondaryButtonSubtext}>
            {isPremium ? 'Three-card spread' : 'Upgrade to unlock'}
          </Text>
        </Pressable>
      </View>

      {/* Premium Promo */}
      {!isPremium && (
        <View style={styles.promoCard}>
          <Text style={styles.promoIcon}>✨</Text>
          <Text style={styles.promoTitle}>Unlock Premium Features</Text>
          <View style={styles.promoFeatures}>
            <Text style={styles.promoFeature}>• Unlimited reading history</Text>
            <Text style={styles.promoFeature}>• Monthly Past/Present/Future spreads</Text>
            <Text style={styles.promoFeature}>• AI insights with personalized context</Text>
            <Text style={styles.promoFeature}>• Priority support</Text>
          </View>
          <View style={styles.promoFooter}>
            <Text style={styles.promoPrice}>$49/year</Text>
            <Pressable style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Quick Stats */}
      {isPremium && (
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Journey</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Readings</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Reflections</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Days Active</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  zodiacBadge: {
    backgroundColor: '#f3e8ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  zodiacText: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  actionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#8b5cf6',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  primaryButtonSubtext: {
    color: '#f3e8ff',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  secondaryButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  secondaryButtonText: {
    color: '#1f2937',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  secondaryButtonSubtext: {
    color: '#666',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
  promoCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    marginBottom: 24,
  },
  promoIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 12,
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#8b5cf6',
    textAlign: 'center',
  },
  promoFeatures: {
    gap: 8,
    marginBottom: 20,
  },
  promoFeature: {
    fontSize: 15,
    lineHeight: 24,
    color: '#666',
  },
  promoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  promoPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  upgradeButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
});
