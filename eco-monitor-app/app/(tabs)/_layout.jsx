import { Tabs } from 'expo-router';
import { COLORS } from '../../utils/constants';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle:      { backgroundColor: COLORS.bg },
        headerTitleStyle: { color: COLORS.text, fontWeight: '700' },
        headerTintColor:  COLORS.text,
        tabBarStyle:      { backgroundColor: COLORS.card, borderTopColor: COLORS.border },
        tabBarActiveTintColor:   COLORS.green,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <TabIcon emoji="📊" color={color} /> }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: 'Historial', tabBarIcon: ({ color }) => <TabIcon emoji="📅" color={color} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Ajustes', tabBarIcon: ({ color }) => <TabIcon emoji="⚙️" color={color} /> }}
      />
    </Tabs>
  );
}

function TabIcon({ emoji, color }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: 18, opacity: color === COLORS.green ? 1 : 0.5 }}>{emoji}</Text>;
}
