import { ScrollView, View, StyleSheet, ViewStyle, ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@hooks/useAppTheme';

export interface ScreenProps extends Omit<ScrollViewProps, 'style'> {
  children: React.ReactNode;
  scroll?: boolean;
  padding?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: ViewStyle;
}

export function Screen({
  children,
  scroll = true,
  padding = true,
  edges = ['bottom'],
  style,
  ...scrollViewProps
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  const pad = padding ? theme.spacing.screenPadding : 0;
  const bg = theme.colors.surface.background;

  // Combine screen padding and safe area insets into a single style object.
  // Avoids Yoga's specificity rule where explicit paddingLeft/Right beats
  // shorthand `padding`, which would silently zero out horizontal padding.
  const containerStyle = [
    styles.container,
    {
      backgroundColor: bg,
      paddingTop: pad + (edges.includes('top') ? insets.top : 0),
      paddingBottom: pad + (edges.includes('bottom') ? insets.bottom : 0),
      paddingLeft: pad + (edges.includes('left') ? insets.left : 0),
      paddingRight: pad + (edges.includes('right') ? insets.right : 0),
    },
    style,
  ];

  if (scroll) {
    return (
      <ScrollView
        style={[styles.scrollView, { backgroundColor: bg }]}
        contentContainerStyle={containerStyle}
        showsVerticalScrollIndicator={false}
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
  },
});
