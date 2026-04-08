import { ScrollView, View, StyleSheet, ViewStyle, ScrollViewProps } from 'react-native';
import { theme } from '@theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  const safeAreaStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  const containerStyle = [
    styles.container,
    safeAreaStyle,
    padding && styles.padding,
    style,
  ];

  if (scroll) {
    return (
      <ScrollView
        style={styles.scrollView}
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
    backgroundColor: theme.colors.surface.background,
  },

  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.surface.background,
  },

  padding: {
    padding: theme.spacing.screenPadding,
  },
});
