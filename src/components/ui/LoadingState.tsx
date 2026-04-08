import { View, StyleSheet, StyleProp, ViewStyle, Animated } from 'react-native';
import { theme } from '@theme';
import { useEffect, useRef } from 'react';

export type LoadingVariant = 'text' | 'card' | 'avatar' | 'custom';

export interface LoadingStateProps {
  variant?: LoadingVariant;
  width?: number | string;
  height?: number;
  style?: ViewStyle;
}

export function LoadingState({
  variant = 'text',
  width = '100%',
  height,
  style,
}: LoadingStateProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  const defaultHeight =
    variant === 'text' ? 16 : variant === 'card' ? 120 : variant === 'avatar' ? 40 : 40;

  return (
    <Animated.View
      style={
        [
          styles.skeleton,
          variant === 'avatar' && styles.avatar,
          style,
          {
            width,
            height: height || defaultHeight,
            opacity,
          },
        ] as StyleProp<ViewStyle>
      }
    />
  );
}

// Skeleton presets for common patterns
export function SkeletonText({ lines = 3, style }: { lines?: number; style?: ViewStyle }) {
  return (
    <View style={[styles.skeletonGroup, style]}>
      {Array.from({ length: lines }).map((_, index) => (
        <LoadingState
          key={index}
          variant="text"
          width={index === lines - 1 ? '70%' : '100%'}
          style={styles.skeletonLine}
        />
      ))}
    </View>
  );
}

export function SkeletonCard({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.skeletonCard, style]}>
      <LoadingState variant="text" width="60%" style={{ marginBottom: 12 }} />
      <SkeletonText lines={2} />
    </View>
  );
}

export function SkeletonProfile({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.skeletonProfile, style]}>
      <LoadingState variant="avatar" width={48} height={48} />
      <View style={styles.skeletonProfileInfo}>
        <LoadingState variant="text" width="60%" height={16} style={{ marginBottom: 8 }} />
        <LoadingState variant="text" width="40%" height={12} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: theme.colors.gray[200],
    borderRadius: theme.borderRadius.md,
  },

  avatar: {
    borderRadius: theme.borderRadius.full,
  },

  skeletonGroup: {
    gap: theme.spacing.xs,
  },

  skeletonLine: {
    marginBottom: theme.spacing.xs,
  },

  skeletonCard: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.cardPadding,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
  },

  skeletonProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },

  skeletonProfileInfo: {
    flex: 1,
  },
});
