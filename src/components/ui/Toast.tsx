import { useEffect, useRef } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@hooks/useAppTheme';
import { springs, durations } from '@/theme/animations';
import type { ToastConfig } from '@/types/announcement';

const TAB_BAR_HEIGHT = 60;
const TAB_BAR_MARGIN_BOTTOM = 24;

const TYPE_ICON: Record<ToastConfig['type'], string> = {
  cta: '🔮',
  feature: '✨',
  info: 'ℹ️',
};

interface ToastProps extends ToastConfig {
  onDismiss: () => void;
}

export function Toast({
  type,
  title,
  message,
  actionLabel,
  onAction,
  autoDismissMs,
  onDismiss,
}: ToastProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(140)).current;
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerDismiss = () => {
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    Animated.timing(slideAnim, {
      toValue: 210,
      duration: durations.toast,
      useNativeDriver: true,
    }).start(() => onDismiss());
  };

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      ...springs.gentle,
      useNativeDriver: true,
    }).start();

    if (autoDismissMs) {
      dismissTimerRef.current = setTimeout(triggerDismiss, autoDismissMs);
    }

    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy, vy }) => dy > 8 || vy > 0.2,
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > 40 || vy > 0.5) {
          triggerDismiss();
        }
      },
    })
  ).current;

  const accentColor =
    type === 'cta'
      ? theme.colors.brand.primary
      : type === 'feature'
        ? theme.colors.info.main
        : theme.colors.text.muted;

  const bottomOffset = insets.bottom + TAB_BAR_HEIGHT + TAB_BAR_MARGIN_BOTTOM + 12;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: bottomOffset,
          backgroundColor: theme.colors.surface.card,
          borderColor: theme.colors.border.main,
          ...theme.shadows.xl,
          transform: [{ translateY: slideAnim }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={[styles.accent, { backgroundColor: accentColor }]} />

      <Text style={styles.icon}>{TYPE_ICON[type]}</Text>

      <View style={styles.body}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]} numberOfLines={1}>
          {title}
        </Text>
        {message ? (
          <Text style={[styles.message, { color: theme.colors.text.secondary }]} numberOfLines={2}>
            {message}
          </Text>
        ) : null}
        {actionLabel && onAction ? (
          <Pressable
            onPress={() => {
              onAction();
              triggerDismiss();
            }}
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
          >
            <Text style={[styles.action, { color: theme.colors.brand.primary }]}>
              {actionLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>

      <Pressable
        onPress={triggerDismiss}
        style={styles.closeBtn}
        accessibilityRole="button"
        accessibilityLabel="Dismiss notification"
        hitSlop={8}
      >
        <Text style={[styles.closeIcon, { color: theme.colors.text.muted }]}>✕</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    gap: 12,
    paddingVertical: 14,
    paddingRight: 14,
    zIndex: 9999,
  },
  accent: {
    width: 4,
    alignSelf: 'stretch',
  },
  icon: {
    fontSize: 22,
    marginLeft: 4,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  action: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  closeBtn: {
    alignSelf: 'flex-start',
    padding: 2,
  },
  closeIcon: {
    fontSize: 14,
    fontWeight: '600',
  },
});
