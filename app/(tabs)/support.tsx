import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { useAuth } from '@hooks/useAuth';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Screen } from '@components/ui';
import { supabase } from '@lib/supabase/client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SupportCategory = 'bug' | 'feature' | 'account' | 'feedback';

const CATEGORIES: { value: SupportCategory; label: string }[] = [
  { value: 'bug', label: 'Bug Report' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'account', label: 'Account Issue' },
  { value: 'feedback', label: 'General Feedback' },
];

const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 2000;

// ---------------------------------------------------------------------------
// ReviewPrompt — isolated extension point for future App Store review flow.
// When you're ready, install expo-store-review and implement this component.
// The submitted category is passed in so you can gate the prompt on positive
// intent (e.g. only show for 'feedback' or 'feature' submissions).
// ---------------------------------------------------------------------------

function ReviewPrompt({ _category }: { _category: SupportCategory }) {
  // TODO: implement with expo-store-review
  // import * as StoreReview from 'expo-store-review';
  // if (_category === 'feedback' || _category === 'feature') {
  //   return (
  //     <Pressable onPress={() => StoreReview.requestReview()}>
  //       <Text>Enjoying the app? Leave us a review ✨</Text>
  //     </Pressable>
  //   );
  // }
  return null;
}

// ---------------------------------------------------------------------------
// Success state
// ---------------------------------------------------------------------------

function SuccessView({ category, onDone }: { category: SupportCategory; onDone: () => void }) {
  const theme = useAppTheme();
  return (
    <View style={successStyles.container}>
      <Text style={successStyles.emoji}>🙏</Text>
      <Text style={[successStyles.title, { color: theme.colors.text.primary }]}>
        Message received
      </Text>
      <Text style={[successStyles.body, { color: theme.colors.text.secondary }]}>
        Thanks for reaching out. We read every message and will follow up via email if needed.
      </Text>

      {/* Extension point: app store review prompt */}
      <ReviewPrompt _category={category} />

      <Pressable
        style={[successStyles.button, { backgroundColor: theme.colors.brand.primary }]}
        onPress={onDone}
        accessibilityRole="button"
        accessibilityLabel="Back to profile"
      >
        <Text style={successStyles.buttonText}>Back to Profile</Text>
      </Pressable>
    </View>
  );
}

const successStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

// ---------------------------------------------------------------------------
// Main support form
// ---------------------------------------------------------------------------

export default function SupportScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useAppTheme();

  const [category, setCategory] = useState<SupportCategory>('feedback');
  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const validateMessage = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return 'Please describe your issue or feedback';
    if (trimmed.length < MIN_MESSAGE_LENGTH)
      return `Message must be at least ${MIN_MESSAGE_LENGTH} characters`;
    if (trimmed.length > MAX_MESSAGE_LENGTH)
      return `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer`;
    return null;
  };

  const handleSubmit = useCallback(async () => {
    if (!user) return;

    const msgError = validateMessage(message);
    if (msgError) {
      setMessageError(msgError);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const appVersion = Constants.expoConfig?.version ?? null;

      const { error } = await supabase.from('support_tickets').insert({
        user_id: user.id,
        category,
        message: message.trim(),
        app_version: appVersion,
      });

      if (error) throw error;

      setSubmitted(true);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [user, category, message]);

  if (submitted) {
    return (
      <Screen>
        <SuccessView category={category} onDone={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              style={styles.cancelButton}
            >
              <Text style={[styles.cancelText, { color: theme.colors.brand.primary }]}>Cancel</Text>
            </Pressable>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>Get Help</Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
              Send us a message and we'll get back to you.
            </Text>
          </View>

          {/* Category pills */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text.secondary }]}>
              What's this about?
            </Text>
            <View style={styles.pillRow}>
              {CATEGORIES.map(c => {
                const active = category === c.value;
                return (
                  <Pressable
                    key={c.value}
                    style={[
                      styles.pill,
                      {
                        backgroundColor: active
                          ? theme.colors.brand.primary
                          : theme.colors.surface.card,
                        borderColor: active ? theme.colors.brand.primary : theme.colors.border.main,
                      },
                    ]}
                    onPress={() => setCategory(c.value)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: active }}
                    accessibilityLabel={c.label}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        {
                          color: active ? '#fff' : theme.colors.text.secondary,
                          fontWeight: active ? '600' : '400',
                        },
                      ]}
                    >
                      {c.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Message */}
          <View style={styles.field}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Message</Text>
              <Text style={[styles.charCount, { color: theme.colors.text.muted }]}>
                {message.length}/{MAX_MESSAGE_LENGTH}
              </Text>
            </View>
            <TextInput
              style={[
                styles.textarea,
                {
                  backgroundColor: theme.colors.surface.card,
                  borderColor: messageError ? '#dc2626' : theme.colors.border.main,
                  color: theme.colors.text.primary,
                },
              ]}
              placeholder="Describe your issue or share your feedback..."
              placeholderTextColor={theme.colors.text.muted}
              value={message}
              onChangeText={text => {
                setMessage(text);
                if (messageError) setMessageError(validateMessage(text));
              }}
              onBlur={() => setMessageError(validateMessage(message))}
              multiline
              numberOfLines={6}
              maxLength={MAX_MESSAGE_LENGTH}
              textAlignVertical="top"
              returnKeyType="default"
            />
            {messageError && <Text style={styles.errorText}>{messageError}</Text>}
          </View>

          {submitError && (
            <Text style={[styles.errorText, { textAlign: 'center' }]}>{submitError}</Text>
          )}

          <Pressable
            style={[
              styles.submitButton,
              { backgroundColor: theme.colors.brand.primary, opacity: submitting ? 0.7 : 1 },
            ]}
            onPress={handleSubmit}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Send Message</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
    gap: 28,
  },
  header: {
    marginTop: 16,
    gap: 8,
  },
  cancelButton: {
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  field: {
    gap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  charCount: {
    fontSize: 12,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  pillText: {
    fontSize: 14,
  },
  textarea: {
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    minHeight: 140,
    lineHeight: 22,
  },
  errorText: {
    fontSize: 13,
    color: '#dc2626',
  },
  submitButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
