import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Button, ZodiacBackground } from '@components/ui';
import { theme } from '@theme';
import { useAnalytics } from '@/hooks/useAnalytics';
// import SVGatorComponent from '@/components/tarot/VectorEyeLightFinal';

export default function WelcomeScreen() {
  const router = useRouter();
  const { capture } = useAnalytics();

  // Capture an analytics event for screen views — useful for understanding drop-off in the onboarding funnel
  capture('screen_viewed', { screen: 'onboarding welcome' });

  const handleGetStarted = () => {
    router.push('/(onboarding)/name');
  };

  return (
    <Screen scroll={false} padding={false}>
      <ZodiacBackground />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={[styles.subtitle, { marginTop: theme.spacing.xxxl }]}>
            Your personalized daily oracle awaits
          </Text>

          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Magic Mystics is your enchanted companion, blending ancient tarot with star-born
              astrology. Share your essence—name, birth moment, and place—and we’ll unveil your Sun,
              Moon, and Rising.
            </Text>
          </View>
        </View>

        <Button title="Get Started" onPress={handleGetStarted} fullWidth size="lg" />
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
