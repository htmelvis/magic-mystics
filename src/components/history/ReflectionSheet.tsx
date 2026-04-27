import { useCallback, useEffect, useRef, useState } from 'react';
import type { TextInput as TextInputType } from 'react-native';
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
import { useAppTheme } from '@/hooks/useAppTheme';
import { theme as staticTheme } from '@theme';

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
  const theme = useAppTheme();

  return (
    <View style={pickerStyles.root}>
      <Text style={[pickerStyles.question, { color: theme.colors.text.primary }]}>{question}</Text>
      <View style={pickerStyles.options}>
        {SENTIMENT_OPTIONS.map(opt => {
          const selected = value === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[
                pickerStyles.option,
                {
                  borderColor: selected ? theme.colors.brand.primary : theme.colors.border.default,
                  backgroundColor: selected
                    ? theme.colors.brand.purple[50]
                    : theme.colors.surface.card,
                },
              ]}
              onPress={() => onChange(opt.value)}
              accessibilityRole="radio"
              accessibilityLabel={opt.label}
              accessibilityState={{ selected }}
            >
              <Text style={pickerStyles.icon}>{opt.icon}</Text>
              <Text
                style={[
                  pickerStyles.label,
                  { color: selected ? theme.colors.brand.primary : theme.colors.text.muted },
                ]}
              >
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
  root: { marginBottom: staticTheme.spacing.xl },
  question: {
    fontSize: staticTheme.typography.fontSize.base,
    fontWeight: '600',
    marginBottom: staticTheme.spacing.lg,
    textAlign: 'center',
    lineHeight: 22,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: staticTheme.spacing.md,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: staticTheme.spacing.lg,
    borderRadius: staticTheme.radius.lg,
    borderWidth: 2,
    gap: staticTheme.spacing.xs,
  },
  icon: { fontSize: 26 },
  label: {
    fontSize: staticTheme.typography.fontSize.xs,
    fontWeight: '600',
  },
});

// ── Steps ─────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4;

// ── Sheet ─────────────────────────────────────────────────────────────────────

interface ReflectionSheetProps {
  visible: boolean;
  initialFeeling?: ReflectionSentiment | null;
  initialAlignment?: ReflectionSentiment | null;
  initialContent?: string;
  isSaving: boolean;
  onSave: (
    feeling: ReflectionSentiment,
    alignment: ReflectionSentiment,
    content: string
  ) => Promise<void>;
  onClose: () => void;
  onAddToJournal?: (content: string) => void;
}

export function ReflectionSheet({
  visible,
  initialFeeling = null,
  initialAlignment = null,
  initialContent = '',
  isSaving,
  onSave,
  onClose,
  onAddToJournal,
}: ReflectionSheetProps) {
  const theme = useAppTheme();
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
  const textInputRef = useRef<TextInputType>(null);

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

  const handleFeelingChange = (v: ReflectionSentiment) => {
    setFeeling(v);
    setTimeout(() => setStep(2), 300);
  };

  const handleAlignmentChange = (v: ReflectionSentiment) => {
    setAlignment(v);
    setTimeout(() => {
      setStep(3);
      setTimeout(() => textInputRef.current?.focus(), 350);
    }, 300);
  };

  const handleSave = async () => {
    if (!feeling || !alignment) return;
    await onSave(feeling, alignment, content.trim());
    if (onAddToJournal) {
      setStep(4);
    } else {
      dismiss();
    }
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

        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: theme.colors.surface.card, transform: [{ translateY: slideY }] },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border.subtle }]}>
            <View style={[styles.handle, { backgroundColor: theme.colors.border.default }]} />
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: theme.colors.text.primary }]}>
                {step < 4 ? 'Add Reflection' : 'Reflection Saved'}
              </Text>
              {step < 4 && (
                <Text style={[styles.stepLabel, { color: theme.colors.text.muted }]}>
                  {stepLabel}
                </Text>
              )}
            </View>

            {/* Progress bar */}
            {step < 4 && (
              <View style={[styles.progressTrack, { backgroundColor: theme.colors.border.subtle }]}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(step / 3) * 100}%`, backgroundColor: theme.colors.brand.primary },
                  ]}
                />
              </View>
            )}
          </View>

          {/* Body */}
          <View style={styles.body}>
            {step === 1 && (
              <SentimentPicker
                question="How does this card resonate with you today?"
                value={feeling}
                onChange={handleFeelingChange}
              />
            )}

            {step === 2 && (
              <SentimentPicker
                question="Do you think it aligns with your current path or challenges?"
                value={alignment}
                onChange={handleAlignmentChange}
              />
            )}

            {step === 3 && (
              <View>
                <Text style={[styles.textLabel, { color: theme.colors.text.primary }]}>
                  Your thoughts
                </Text>
                <Text style={[styles.textHint, { color: theme.colors.text.muted }]}>
                  Write freely — this is just for you.
                </Text>
                <TextInput
                  ref={textInputRef}
                  style={[
                    styles.textArea,
                    {
                      color: theme.colors.text.primary,
                      backgroundColor: theme.colors.surface.elevated,
                      borderColor: theme.colors.border.default,
                    },
                  ]}
                  value={content}
                  onChangeText={setContent}
                  placeholder="What came up for you? What does this card stir in you today?"
                  placeholderTextColor={theme.colors.text.muted}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  maxLength={2000}
                />
                <Text style={[styles.charCount, { color: theme.colors.text.muted }]}>
                  {content.length} / 2000
                </Text>
              </View>
            )}

            {step === 4 && (
              <View>
                <Text style={[styles.textLabel, { color: theme.colors.text.primary }]}>
                  Carry this into your Journal?
                </Text>
                <Text style={[styles.textHint, { color: theme.colors.text.muted }]}>
                  Your reflection is saved. You can also expand it into a private journal entry.
                </Text>
              </View>
            )}
          </View>

          {/* Footer actions */}
          {step === 3 && (
            <View style={[styles.footer, { borderTopColor: theme.colors.border.subtle }]}>
              <TouchableOpacity
                style={[styles.backBtn, { borderColor: theme.colors.border.default }]}
                onPress={() => setStep(s => (s - 1) as Step)}
                accessibilityRole="button"
                accessibilityLabel="Previous step"
              >
                <Text style={[styles.backBtnText, { color: theme.colors.text.secondary }]}>
                  Back
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.nextBtn,
                  { backgroundColor: theme.colors.brand.primary },
                  isSaving && styles.btnDisabled,
                ]}
                onPress={handleSave}
                disabled={isSaving}
                accessibilityRole="button"
                accessibilityLabel="Save reflection"
              >
                <Text style={styles.nextBtnText}>{isSaving ? 'Saving…' : 'Save Reflection'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 4 && (
            <View style={[styles.footer, { borderTopColor: theme.colors.border.subtle }]}>
              <TouchableOpacity
                style={[styles.backBtn, { borderColor: theme.colors.border.default }]}
                onPress={dismiss}
                accessibilityRole="button"
                accessibilityLabel="Done"
              >
                <Text style={[styles.backBtnText, { color: theme.colors.text.secondary }]}>
                  Done
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.nextBtn, { backgroundColor: theme.colors.brand.primary }]}
                onPress={() => {
                  onAddToJournal!(content.trim());
                  dismiss();
                }}
                accessibilityRole="button"
                accessibilityLabel="Add to Journal"
              >
                <Text style={styles.nextBtnText}>Add to Journal</Text>
              </TouchableOpacity>
            </View>
          )}
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
    borderTopLeftRadius: staticTheme.radius['2xl'],
    borderTopRightRadius: staticTheme.radius['2xl'],
    ...staticTheme.shadows.xl,
    overflow: 'hidden',
  },
  header: {
    paddingTop: staticTheme.spacing.md,
    paddingHorizontal: staticTheme.spacing.xl,
    paddingBottom: staticTheme.spacing.lg,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: staticTheme.spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: staticTheme.spacing.md,
  },
  title: {
    fontSize: staticTheme.typography.fontSize.lg,
    fontWeight: '700',
  },
  stepLabel: {
    fontSize: staticTheme.typography.fontSize.xs,
    fontWeight: '500',
  },
  progressTrack: {
    width: '100%',
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  body: {
    padding: staticTheme.spacing.xl,
    paddingTop: staticTheme.spacing.xxl,
  },
  textLabel: {
    fontSize: staticTheme.typography.fontSize.base,
    fontWeight: '600',
    marginBottom: staticTheme.spacing.xs,
  },
  textHint: {
    fontSize: staticTheme.typography.fontSize.sm,
    marginBottom: staticTheme.spacing.md,
  },
  textArea: {
    borderWidth: 1.5,
    borderRadius: staticTheme.radius.lg,
    padding: staticTheme.spacing.md,
    fontSize: staticTheme.typography.fontSize.base,
    minHeight: 130,
    lineHeight: 22,
  },
  charCount: {
    fontSize: staticTheme.typography.fontSize.xs,
    textAlign: 'right',
    marginTop: staticTheme.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: staticTheme.spacing.xl,
    paddingBottom: 36,
    paddingTop: staticTheme.spacing.md,
    gap: staticTheme.spacing.md,
    borderTopWidth: 1,
  },
  backBtn: {
    flex: 1,
    paddingVertical: staticTheme.spacing.md,
    borderRadius: staticTheme.radius.lg,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: staticTheme.typography.fontSize.base,
    fontWeight: '600',
  },
  nextBtn: {
    flex: 2,
    paddingVertical: staticTheme.spacing.md,
    borderRadius: staticTheme.radius.lg,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.45 },
  nextBtnText: {
    fontSize: staticTheme.typography.fontSize.base,
    fontWeight: '700',
    color: '#fff',
  },
});
