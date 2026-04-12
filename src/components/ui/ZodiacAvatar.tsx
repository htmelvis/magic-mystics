import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ZodiacSign } from '@lib/astrology/calculate-signs';
import { ZODIAC_THEMES } from '@lib/astrology/zodiac-themes';

interface ZodiacAvatarProps {
  sign: ZodiacSign;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function ZodiacAvatar({ sign, size = 48, style }: ZodiacAvatarProps) {
  const theme = ZODIAC_THEMES[sign];
  const glyphSize = size * 0.45;
  const borderRadius = size / 2;

  return (
    <View style={[{ width: size, height: size, borderRadius }, style]}>
      <LinearGradient
        colors={theme.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius }]}
      >
        <Text style={[styles.glyph, { fontSize: glyphSize }]} accessible={false}>
          {theme.glyph}
        </Text>
      </LinearGradient>
    </View>
  );
}

interface ZodiacAvatarPlaceholderProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Gradient circle shown while the user's sign is loading.
 * Holds the same dimensions as ZodiacAvatar so the layout doesn't shift
 * once the real avatar is ready.
 */
export function ZodiacAvatarPlaceholder({ size = 48, style }: ZodiacAvatarPlaceholderProps) {
  const glyphSize = size * 0.38;
  const borderRadius = size / 2;

  return (
    <View style={[{ width: size, height: size, borderRadius }, style]}>
      <LinearGradient
        colors={['#7c3aed', '#a78bfa']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius }]}
      >
        <Text style={[styles.glyph, { fontSize: glyphSize }]} accessible={false}>
          ✦
        </Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    color: '#ffffff',
    lineHeight: undefined,
  },
});
