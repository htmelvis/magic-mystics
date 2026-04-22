import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ErrorBoundary } from '@components/ui/ErrorBoundary';

export default function TabsLayout() {
  const { activeColorScheme } = useTheme();
  const theme = useAppTheme();
  const tabBarBg =
    activeColorScheme === 'dark' ? 'rgba(26, 26, 26, 0.92)' : 'rgba(255, 255, 255, 0.85)';

  return (
    <ErrorBoundary>
      <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: theme.colors.brand.primary,
            tabBarInactiveTintColor: theme.colors.text.muted,
            tabBarStyle: {
              position: 'absolute',
              borderTopColor: theme.colors.border.light,
              borderTopWidth: 1,
              height: 60,
              paddingBottom: 8,
              paddingTop: 2,
              marginBottom: 24,
              marginHorizontal: theme.spacing.md,
              borderRadius: theme.borderRadius.full,
              backgroundColor: tabBarBg,
            },
            tabBarItemStyle: {
              padding: 0,
            },
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: '400',
            },
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: 'Home',
              tabBarAccessibilityLabel: 'Home tab',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="draw"
            options={{
              title: 'Draw',
              tabBarAccessibilityLabel: 'Draw tab',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="cards" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarAccessibilityLabel: 'Profile tab',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="path"
            options={{
              title: 'Path',
              tabBarAccessibilityLabel: 'Path tab',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="compass-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarAccessibilityLabel: 'Settings tab',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="cog-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen name="history" options={{ href: null }} />
          <Tabs.Screen name="natal-chart" options={{ href: null }} />
          <Tabs.Screen name="edit-birth-details" options={{ href: null }} />
          <Tabs.Screen name="support" options={{ href: null }} />
        </Tabs>
    </ErrorBoundary>
  );
}
