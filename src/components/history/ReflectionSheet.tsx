import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { ReflectionSentiment } from '@hooks/useReflection';
import { theme } from '@theme';

// ── Sentiment option ───────────────────────────────────────────────────────────

const SENTIMENT_OPTIONS: { value: ReflectionSentiment; label: string; icon: string }[] = [
  { value: 'positive', label: 'Positive', icon: '👍' },
  { value: 'neutral', label: 'Neutral', icon: '😐' },
  { value: 'negative', label: 'Negative', icon: '👎' },
];

interface SentimentPickerProps {
  question: string;
  value: ReflectionSentiment | null;
  onChange: (v: ReflectionSentiment) => void;
}

function SentimentPicker({ question, value, onChange }: SentimentPickerProps) {
  return (
    <View style={pickerStyles.root}>
      <Text style={pickerStyles.question}>{question}</Text>
      <View style={pickerStyles.options}>
        {SENTIMENT_OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[pickerStyles.option, selected && pickerStyles.optionSelected]}
              onPress={() => onChange(opt.value)}
              accessibilityRole="radio"
              accessibilityLabel={opt.label}
              accessibilityState={{ selected }}
            >
              <Text style={pickerStyles.icon}>{opt.icon}</Text>
              <Text style={[pickerStyles.label, selected && pickerStyles.labelSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const pickerStyles = StyleSheet.create({
  root: { marginBottom: theme.spacing.xl },
  question: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    lineHeight: 22,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border.default,
    backgroundColor: theme.colors.surface.card,
    gap: theme.spacing.xs,
  },
  optionSelected: {
    borderColor: theme.colors.brand.primary,
    backgroundColor: theme.colors.brand.purple[50],
  },
  icon: { fontSize: 26 },
  label: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '600',
    color: theme.colors.text.muted,
  },
  labelSelected: { color: theme.colors.brand.primary },
});

// ── Steps ─────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

// ── Sheet ─────────────────────────────────────────────────────────────────────

interface ReflectionSheetProps {
  visible: boolean;
  initialFeeling?: ReflectionSentiment | null;
  initialAlignment?: ReflectionSentiment | null;
  initialContent?: string;
  isSaving: boolean;
  onSave: (feeling: ReflectionSentiment, alignment: ReflectionSentiment, content: string) => void;
  onClose: () => void;
}

export function ReflectionSheet({
  visible,
  initialFeeling = null,
  initialAlignment = null,
  initialContent = '',
  isSaving,
  onSave,
  onClose,
}: ReflectionSheetProps) {
  const [step, setStep] = useState<Step>(1);
  const [feeling, setFeeling] = useState<ReflectionSentiment | null>(initialFeeling);
  const [alignment, setAlignment] = useState<ReflectionSentiment | null>(initialAlignment);
  const [content, setContent] = useState(initialContent);

  // Reset state each time the sheet opens, seeded from initial values.
  useEffect(() => {
    if (visible) {
      setStep(1);
      setFeeling(initialFeeling ?? null);
      setAlignment(initialAlignment ?? null);
      setContent(initialContent ?? '');
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const slideY = useRef(new Animated.Value(600)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const handleShow = useCallback(() => {
    Animated.parallel([
      Animated.spring(slideY, {
        toValue: 0,
        damping: 50,
        stiffness: 380,
        mass: 1,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideY, backdropOpacity]);

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideY, { toValue: 600, duration: 280, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => onClose());
  }, [slideY, backdropOpacity, onClose]);

  // Reset animation values when visible changes.
  useEffect(() => {
    if (visible) {
      slideY.setValue(600);
      backdropOpacity.setValue(0);
    }
  }, [visible, slideY, backdropOpacity]);

  const handleNext = () => {
    if (step === 1 && feeling) setStep(2);
    else if (step === 2 && alignment) setStep(3);
  };

  const handleSave = () => {
    if (!feeling || !alignment) return;
    onSave(feeling, alignment, content.trim());
  };

  const stepLabel = step === 1 ? 'Step 1 of 3' : step === 2 ? 'Step 2 of 3' : 'Step 3 of 3';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onShow={handleShow}
      onRequestClose={dismiss}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismiss}
          accessibilityRole="button"
          accessibilityLabel="Close reflection"
        >
          <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
        </Pressable>

        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideY }] }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.handle} />
            <View style={styles.titleRow}>
              <Text style={styles.title}>Add Reflection</Text>
              <Text style={styles.stepLabel}>{stepLabel}</Text>
            </View>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
            </View>
          </View>

          {/* Body */}
          <View style={styles.body}>
            {step === 1 && (
              <SentimentPicker
                question="How do you feel about this reading?"
                value={feeling}
                onChange={setFeeling}
              />
            )}

            {step === 2 && (
              <SentimentPicker
                question="Does this align with your journey?"
                value={alignment}
                onChange={setAlignment}
              />
            )}

            {step === 3 && (
              <View>
                <Text style={styles.textLabel}>Your thoughts</Text>
                <Text style={styles.textHint}>
                  Write freely — this is just for you.
                </Text>
                <TextInput
                  style={styles.textArea}
                  value={content}
                  onChangeText={setContent}
                  placeholder="What came up for you? What does this card stir in you today?"
                  placeholderTextColor={theme.colors.text.muted}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  autoFocus
                  maxLength={2000}
                />
                <Text style={styles.charCount}>{content.length} / 2000</Text>
              </View>
            )}
          </View>

          {/* Footer actions */}
          <View style={styles.footer}>
            {step > 1 && (
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => setStep((s) => (s - 1) as Step)}
                accessibilityRole="button"
                accessibilityLabel="Previous step"
              >
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>
            )}

            {step < 3 ? (
              <TouchableOpacity
                style={[
                  styles.nextBtn,
                  step === 1 && !feeling && styles.btnDisabled,
                  step === 2 && !alignment && styles.btnDisabled,
                ]}
                onPress={handleNext}
                disabled={(step === 1 && !feeling) || (step === 2 && !alignment)}
                accessibilityRole="button"
                accessibilityLabel="Next step"
              >
                <Text style={styles.nextBtnText}>Next →</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.nextBtn, isSaving && styles.btnDisabled]}
                onPress={handleSave}
                disabled={isSaving}
                accessibilityRole="button"
                accessibilityLabel="Save reflection"
              >
                <Text style={styles.nextBtnText}>{isSaving ? 'Saving…' : 'Save Reflection'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.48)',
  },
  sheet: {
    backgroundColor: theme.colors.surface.card,
    borderTopLeftRadius: theme.radius['2xl'],
    borderTopRightRadius: theme.radius['2xl'],
    ...theme.shadows.xl,
    overflow: 'hidden',
  },
  header: {
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: theme.colors.border.default,
    borderRadius: 2,
    marginBottom: theme.spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  stepLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.muted,
    fontWeight: '500',
  },
  progressTrack: {
    width: '100%',
    height: 3,
    backgroundColor: theme.colors.border.subtle,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.brand.primary,
    borderRadius: 2,
  },
  body: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
  },
  textLabel: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  textHint: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.md,
  },
  textArea: {
    borderWidth: 1.5,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    minHeight: 130,
    lineHeight: 22,
    backgroundColor: theme.colors.surface.subtle,
  },
  charCount: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.muted,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 36,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
  },
  backBtn: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.border.default,
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  nextBtn: {
    flex: 2,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.brand.primary,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.45 },
  nextBtnText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '700',
    color: '#fff',
  },
});
