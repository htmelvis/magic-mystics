import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@theme';
import { ErrorBoundary } from '@components/ui/ErrorBoundary';
import { UpgradeSheetProvider } from '@/context/UpgradeSheetContext';

export default function TabsLayout() {
  return (
    <ErrorBoundary>
      <UpgradeSheetProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: theme.colors.brand.primary,
            tabBarInactiveTintColor: theme.colors.text.muted,
            tabBarStyle: {
              backgroundColor: theme.colors.surface.card,
              borderTopColor: theme.colors.border.light,
              borderTopWidth: 1,
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
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
      </UpgradeSheetProvider>
    </ErrorBoundary>
  );
}
