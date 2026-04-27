import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Screen, Input, Button } from '@components/ui';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function UpdateEmailScreen() {
  const router = useRouter();
  const { user, updateEmail } = useAuth();
  const theme = useAppTheme();

  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const validateEmail = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter a new email address';
    if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address';
    if (trimmed.toLowerCase() === user?.email?.toLowerCase())
      return 'New email must be different from your current email';
    return null;
  };

  const handleSubmit = useCallback(async () => {
    const error = validateEmail(newEmail);
    if (error) {
      setEmailError(error);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const { error: apiError } = await updateEmail(newEmail.trim());

    setSubmitting(false);

    if (apiError) {
      setSubmitError(apiError.message ?? 'Something went wrong. Please try again.');
      return;
    }

    setSent(true);
  }, [newEmail, updateEmail, user?.email]);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.navigate('/(tabs)/settings')}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            style={styles.cancelButton}
          >
            <Text style={[styles.cancelText, { color: theme.colors.brand.primary }]}>Cancel</Text>
          </Pressable>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Update Email</Text>
        </View>

        {sent ? (
          <View
            style={[
              styles.successBanner,
              {
                backgroundColor: theme.colors.brand.primary + '18',
                borderColor: theme.colors.brand.primary + '40',
              },
            ]}
          >
            <Text style={[styles.successTitle, { color: theme.colors.text.primary }]}>
              Confirmation sent
            </Text>
            <Text style={[styles.successBody, { color: theme.colors.text.secondary }]}>
              Check both your current email ({user?.email}) and your new inbox ({newEmail.trim()})
              for a confirmation link. After both are confirmed, your email will be updated.
            </Text>
            <Button
              title="Back to Settings"
              variant="outline"
              onPress={() => router.navigate('/(tabs)/settings')}
              style={{ marginTop: 16 }}
            />
          </View>
        ) : (
          <>
            <View
              style={[
                styles.currentEmailBanner,
                {
                  backgroundColor: theme.colors.surface.elevated,
                  borderColor: theme.colors.border.main,
                },
              ]}
            >
              <Text style={[styles.currentEmailLabel, { color: theme.colors.text.muted }]}>
                Current email
              </Text>
              <Text style={[styles.currentEmailValue, { color: theme.colors.text.primary }]}>
                {user?.email}
              </Text>
            </View>

            <Input
              label="New email"
              value={newEmail}
              onChangeText={value => {
                setNewEmail(value);
                if (emailError) setEmailError(validateEmail(value));
              }}
              onBlur={() => setEmailError(validateEmail(newEmail))}
              error={emailError ?? undefined}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              editable={!submitting}
            />

            {submitError && (
              <Text style={[styles.errorText, { color: theme.colors.error.main }]}>
                {submitError}
              </Text>
            )}

            <Button
              title="Send Confirmation"
              variant="primary"
              onPress={handleSubmit}
              loading={submitting}
              disabled={submitting}
              fullWidth
            />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
    gap: 24,
  },
  header: {
    marginTop: 16,
    marginBottom: 8,
  },
  cancelButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  currentEmailBanner: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  currentEmailLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  currentEmailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 13,
    textAlign: 'center',
  },
  successBanner: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  successBody: {
    fontSize: 14,
    lineHeight: 22,
  },
});
