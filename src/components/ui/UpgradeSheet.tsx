import { useCallback, useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  findNodeHandle,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { theme } from '@theme';

const FEATURES = [
  { icon: '📜', label: 'Unlimited reading history' },
  { icon: '🔮', label: 'Past / Present / Future spreads' },
  { icon: '✦', label: 'AI insights with your personal context' },
  { icon: '⭐', label: 'Priority support' },
] as const;

interface UpgradeSheetProps {
  isVisible: boolean;
  onClose: () => void;
  /** Called when the user taps "Upgrade Now". Wire to RevenueCat purchase. */
  onUpgradePress: () => void;
}

export function UpgradeSheet({ isVisible, onClose, onUpgradePress }: UpgradeSheetProps) {
  const slideY = useRef(new Animated.Value(900)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetRef = useRef<View>(null);
  const dismissRef = useRef<() => void>(() => {});

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideY, {
        toValue: 900,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  }, [onClose, slideY, backdropOpacity]);

  useEffect(() => {
    dismissRef.current = dismiss;
  });

  useEffect(() => {
    if (isVisible) {
      slideY.setValue(900);
      backdropOpacity.setValue(0);
    }
  }, [isVisible, slideY, backdropOpacity]);

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
    ]).start(() => {
      const node = findNodeHandle(sheetRef.current);
      if (node) AccessibilityInfo.setAccessibilityFocus(node);
    });
  }, [slideY, backdropOpacity]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) slideY.setValue(gs.dy);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 110 || gs.vy > 0.7) {
          dismissRef.current();
        } else {
          Animated.spring(slideY, {
            toValue: 0,
            damping: 50,
            stiffness: 380,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onShow={handleShow}
      onRequestClose={() => dismissRef.current()}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => dismissRef.current()}
          accessibilityRole="button"
          accessibilityLabel="Close upgrade sheet"
        >
          <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
        </Pressable>

        <Animated.View
          ref={sheetRef}
          style={[styles.sheet, { transform: [{ translateY: slideY }] }]}
          accessibilityViewIsModal
          accessibilityRole="none"
        >
          {/* Drag handle */}
          <View
            {...panResponder.panHandlers}
            style={styles.handleZone}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Drag handle, swipe down to close"
            accessibilityHint="Swipe down to dismiss"
            hitSlop={{ top: 12, bottom: 12 }}
          >
            <View style={styles.handle} />
          </View>

          <View style={styles.content}>
            {/* Header */}
            <Text style={styles.star} accessible={false}>✦</Text>
            <Text style={styles.title}>Keep Your Full History</Text>
            <Text style={styles.subtitle}>
              Free accounts store 30 days of readings. Premium keeps everything, forever.
            </Text>

            {/* Feature list */}
            <View style={styles.features}>
              {FEATURES.map(({ icon, label }) => (
                <View key={label} style={styles.featureRow}>
                  <Text style={styles.featureIcon} accessible={false}>{icon}</Text>
                  <Text style={styles.featureLabel}>{label}</Text>
                </View>
              ))}
            </View>

            {/* Price */}
            <View style={styles.priceRow}>
              <Text style={styles.price}>$49</Text>
              <Text style={styles.pricePer}> / year</Text>
            </View>

            {/* Actions */}
            <Pressable
              style={({ pressed }) => [styles.upgradeButton, pressed && styles.upgradeButtonPressed]}
              onPress={onUpgradePress}
              accessibilityRole="button"
              accessibilityLabel="Upgrade to Premium for $49 per year"
            >
              <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.laterButton, pressed && styles.laterButtonPressed]}
              onPress={() => dismissRef.current()}
              accessibilityRole="button"
              accessibilityLabel="Maybe later"
            >
              <Text style={styles.laterButtonText}>Maybe Later</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

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
  handleZone: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: theme.colors.border.default,
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 44,
    alignItems: 'center',
  },
  star: {
    fontSize: 28,
    color: theme.colors.brand.accent,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: theme.spacing.xl,
  },
  features: {
    width: '100%',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  featureIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  featureLabel: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    fontWeight: '500',
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.xl,
  },
  price: {
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.brand.primary,
  },
  pricePer: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.muted,
    fontWeight: '500',
  },
  upgradeButton: {
    width: '100%',
    backgroundColor: theme.colors.brand.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    ...theme.shadows.button,
  },
  upgradeButtonPressed: {
    opacity: 0.85,
  },
  upgradeButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.base,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  laterButton: {
    width: '100%',
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  laterButtonPressed: {
    opacity: 0.6,
  },
  laterButtonText: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '500',
  },
});
