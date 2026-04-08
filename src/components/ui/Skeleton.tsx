import { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { theme } from '@theme';

// ── Base Skeleton ─────────────────────────────────────────────────────────────

interface SkeletonProps {
  /** Width — number (px) or percentage string. Default `'100%'` */
  width?: number | `${number}%`;
  /** Height in px. Default `16` */
  height?: number;
  /** Override border radius. Default `theme.borderRadius.md` */
  borderRadius?: number;
  /** Make it a circle (overrides borderRadius). */
  circle?: boolean;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius: br,
  circle = false,
  style,
}: SkeletonProps) {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const resolvedRadius = circle
    ? (typeof width === 'number' ? width / 2 : 9999)
    : (br ?? theme.borderRadius.md);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: resolvedRadius,
          backgroundColor: theme.colors.gray[200],
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

// ── Skeleton presets ──────────────────────────────────────────────────────────

/** Multiple pulsing text lines. Last line is shorter for a natural look. */
export function SkeletonText({
  lines = 3,
  lineHeight = 14,
  gap = theme.spacing.xs,
  style,
}: {
  lines?: number;
  lineHeight?: number;
  gap?: number;
  style?: ViewStyle;
}) {
  return (
    <View style={[{ gap }, style]}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          width={i === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </View>
  );
}

/** Circle skeleton (avatar, icon placeholder). */
export function SkeletonCircle({
  size = 48,
  style,
}: {
  size?: number;
  style?: ViewStyle;
}) {
  return <Skeleton width={size} height={size} circle style={style} />;
}

/** Card-shaped skeleton with a title bar and two text lines. */
export function SkeletonCard({ style }: { style?: ViewStyle }) {
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface.card,
          borderRadius: theme.borderRadius.card,
          borderWidth: 1,
          borderColor: theme.colors.border.main,
          padding: theme.spacing.cardPadding,
          gap: theme.spacing.sm,
        },
        style,
      ]}
    >
      <Skeleton width="60%" height={18} />
      <SkeletonText lines={2} />
    </View>
  );
}

/** Row skeleton matching the history reading row layout. */
export function SkeletonRow({ style }: { style?: ViewStyle }) {
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface.card,
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border.subtle,
          padding: theme.spacing.lg,
          marginBottom: theme.spacing.md,
          gap: theme.spacing.xs,
        },
        style,
      ]}
    >
      <Skeleton width={90} height={20} />
      <Skeleton width="65%" height={18} />
      <Skeleton width="40%" height={13} />
    </View>
  );
}

/** Profile skeleton with avatar + info lines. */
export function SkeletonProfile({ style }: { style?: ViewStyle }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }, style]}>
      <SkeletonCircle size={48} />
      <View style={{ flex: 1, gap: theme.spacing.xs }}>
        <Skeleton width="60%" height={16} />
        <Skeleton width="40%" height={12} />
      </View>
    </View>
  );
}
