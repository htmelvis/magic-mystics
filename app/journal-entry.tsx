import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import {
  useJournal,
  useCreateJournal,
  useUpdateJournal,
  useDeleteJournal,
} from '@hooks/useJournals';
import { useReflection } from '@hooks/useReflection';
import { useAppTheme } from '@/hooks/useAppTheme';
import { theme as staticTheme } from '@theme';

const BODY_MAX = 10_000;
const TITLE_MAX = 120;

function formatEntryDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function JournalEntryScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const theme = useAppTheme();
  const params = useLocalSearchParams<{
    id?: string;
    seedTitle?: string;
    seedBody?: string;
    seedReflection?: string;
    readingId?: string;
    aiPrompt?: string;
  }>();

  const isEditMode = !!params.id;
  const { data: existingEntry, isLoading: entryLoading } = useJournal(params.id);
  const { mutateAsync: createJournal, isPending: isCreating } = useCreateJournal();
  const { mutateAsync: updateJournal, isPending: isUpdating } = useUpdateJournal();
  const { mutateAsync: deleteJournal, isPending: isDeleting } = useDeleteJournal();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [seeded, setSeeded] = useState(false);

  const isSaving = isCreating || isUpdating;
  const bodyRef = useRef<TextInput>(null);

  // Fetch the linked reflection so the non-editable card persists in edit mode.
  // In create mode this won't fire (readingId comes from params, not existingEntry).
  const { reflection } = useReflection(existingEntry?.reading_id ?? null, user?.id ?? null);

  // Create mode: reflection text comes from the URL param.
  // Edit mode: reflection text comes from the DB via reading_id.
  const reflectionCardContent = isEditMode
    ? (reflection?.content ?? null)
    : (params.seedReflection ?? null);

  useEffect(() => {
    if (seeded) return;
    if (isEditMode) {
      if (!existingEntry) return;
      setTitle(existingEntry.title ?? '');
      setBody(existingEntry.body);
      setSeeded(true);
    } else {
      setTitle(params.seedTitle ?? '');
      setBody(params.seedBody ?? '');
      setSeeded(true);
    }
  }, [existingEntry, isEditMode, params.seedTitle, params.seedBody, seeded]);

  const isDirty = isEditMode
    ? title !== (existingEntry?.title ?? '') || body !== existingEntry?.body
    : title.length > 0 || body.length > 0;

  const canSave = !isSaving && !isDeleting && (body.length > 0 || !!reflectionCardContent);

  const handleCancel = useCallback(() => {
    if (isDirty) {
      Alert.alert('Discard changes?', 'Your unsaved changes will be lost.', [
        { text: 'Keep editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => router.back() },
      ]);
    } else {
      router.back();
    }
  }, [isDirty, router]);

  const handleSave = useCallback(async () => {
    if (!user) return;
    if (isEditMode && existingEntry) {
      await updateJournal({ id: existingEntry.id, payload: { title: title.trim() || null, body } });
    } else {
      await createJournal({
        user_id: user.id,
        reading_id: params.readingId ?? null,
        title: title.trim() || null,
        body,
        ai_prompt: params.aiPrompt ?? null,
      });
    }
    router.back();
  }, [
    user,
    isEditMode,
    existingEntry,
    title,
    body,
    params.readingId,
    params.aiPrompt,
    updateJournal,
    createJournal,
    router,
  ]);

  const handleDelete = useCallback(() => {
    if (!existingEntry || !user) return;
    Alert.alert('Delete entry?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteJournal({ id: existingEntry.id, userId: user.id });
          router.back();
        },
      },
    ]);
  }, [existingEntry, user, deleteJournal, router]);

  const entryDate =
    isEditMode && existingEntry
      ? formatEntryDate(existingEntry.created_at)
      : formatEntryDate(new Date().toISOString());

  if (isEditMode && entryLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface.background }]} />
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.surface.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Toolbar */}
      <View style={[styles.toolbar, { borderBottomColor: theme.colors.border.subtle }]}>
        <TouchableOpacity
          onPress={handleCancel}
          style={styles.toolbarBtn}
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          disabled={isSaving || isDeleting}
        >
          <Text style={[styles.toolbarCancelText, { color: theme.colors.brand.primary }]}>
            Cancel
          </Text>
        </TouchableOpacity>

        <Text style={[styles.toolbarDate, { color: theme.colors.text.muted }]}>{entryDate}</Text>

        <View style={styles.toolbarRight}>
          {isEditMode && (
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.toolbarBtn}
              accessibilityRole="button"
              accessibilityLabel="Delete entry"
              disabled={isSaving || isDeleting}
            >
              <Text style={[styles.toolbarDeleteText, { color: theme.colors.error.main }]}>
                {isDeleting ? 'Deleting…' : 'Delete'}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleSave}
            style={styles.toolbarBtn}
            accessibilityRole="button"
            accessibilityLabel="Save entry"
            disabled={!canSave}
          >
            <Text
              style={[
                styles.toolbarSaveText,
                { color: theme.colors.brand.primary },
                !canSave && styles.toolbarBtnDisabled,
              ]}
            >
              {isSaving ? 'Saving…' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={[styles.titleInput, { color: theme.colors.text.primary }]}
          value={title}
          onChangeText={t => setTitle(t.slice(0, TITLE_MAX))}
          placeholder="Title (optional)"
          placeholderTextColor={theme.colors.text.muted}
          returnKeyType="next"
          onSubmitEditing={() => bodyRef.current?.focus()}
          blurOnSubmit={false}
          maxLength={TITLE_MAX}
        />

        {!!reflectionCardContent && (
          <View
            style={[
              styles.reflectionCard,
              {
                backgroundColor: theme.colors.brand.purple[50],
                borderColor: theme.colors.brand.purple[200],
              },
            ]}
          >
            <Text style={[styles.reflectionLabel, { color: theme.colors.brand.primaryDark }]}>
              Your immediate reflection:
            </Text>
            <Text style={[styles.reflectionText, { color: theme.colors.text.secondary }]}>
              {reflectionCardContent}
            </Text>
          </View>
        )}

        <TextInput
          ref={bodyRef}
          style={[styles.bodyInput, { color: theme.colors.text.primary }]}
          value={body}
          onChangeText={t => setBody(t.slice(0, BODY_MAX))}
          placeholder="Continue writing here…"
          placeholderTextColor={theme.colors.text.muted}
          multiline
          textAlignVertical="top"
          maxLength={BODY_MAX}
          autoFocus={!isEditMode && !reflectionCardContent}
        />

        <Text style={[styles.charCount, { color: theme.colors.text.muted }]}>
          {body.length.toLocaleString()} / {BODY_MAX.toLocaleString()}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 20,
    borderBottomWidth: 1,
  },
  toolbarBtn: { padding: 4 },
  toolbarCancelText: { fontSize: 16, fontWeight: '500' },
  toolbarDate: { fontSize: 13, fontWeight: '500', flex: 1, textAlign: 'center' },
  toolbarRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  toolbarDeleteText: { fontSize: 16, fontWeight: '500' },
  toolbarSaveText: { fontSize: 16, fontWeight: '700' },
  toolbarBtnDisabled: { opacity: 0.4 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 48 },
  titleInput: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    padding: 0,
  },
  reflectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    gap: 8,
  },
  reflectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  reflectionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  bodyInput: {
    fontSize: 16,
    lineHeight: 26,
    minHeight: 200,
    padding: 0,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
});
