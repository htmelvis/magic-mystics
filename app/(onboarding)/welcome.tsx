import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Button } from '@components/ui';
import { theme } from '@theme';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/(onboarding)/name');
  };

  return (
    <Screen scroll={false} padding={false}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emoji}>🔮✨</Text>
          <Text style={styles.title}>Welcome to Magic Mystics</Text>
          <Text style={styles.subtitle}>
            Your personal tarot and astrology companion
          </Text>

          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              To provide you with personalized insights, we'll need a few details about you.
            </Text>
            <Text style={styles.description}>
              We'll calculate your Sun, Moon, and Rising signs to enhance your daily readings.
            </Text>
          </View>
        </View>

        <Button 
          title="Get Started" 
          onPress={handleGetStarted}
          fullWidth
          size="lg"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.textStyles.display,
    color: theme.colors.brand.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.textStyles.h3,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xxxl,
  },
  descriptionContainer: {
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  description: {
    ...theme.textStyles.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
