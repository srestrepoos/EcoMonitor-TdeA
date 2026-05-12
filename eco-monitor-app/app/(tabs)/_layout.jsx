import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { COLORS } from '../../utils/constants';

function DashIcon({ focused }) {
  const c = focused ? COLORS.green : COLORS.textMuted;
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
        <Rect x="1.5" y="1.5" width="6" height="6" rx="1.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <Rect x="10.5" y="1.5" width="6" height="6" rx="1.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <Rect x="1.5" y="10.5" width="6" height="6" rx="1.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <Rect x="10.5" y="10.5" width="6" height="6" rx="1.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </Svg>
    </View>
  );
}

function HistoryIcon({ focused }) {
  const c = focused ? COLORS.green : COLORS.textMuted;
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
        <Rect x="1.5" y="2.5" width="15" height="13" rx="2" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M5 2.5V1M13 2.5V1M1.5 7h15M5 11h2M9 11h4M5 14h2" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
      </Svg>
    </View>
  );
}

function SettingsIcon({ focused }) {
  const c = focused ? COLORS.green : COLORS.textMuted;
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
        <Circle cx="9" cy="9" r="2.5" stroke={c} strokeWidth="1.6"/>
        <Path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.6 3.6l1.4 1.4M13 13l1.4 1.4M3.6 14.4l1.4-1.4M13 5l1.4-1.4" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
      </Svg>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor:  COLORS.bg,
          shadowColor:      'transparent',
          elevation:        0,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        },
        headerTitleStyle:      { color: COLORS.text, fontWeight: '700', fontSize: 17, letterSpacing: -0.3 },
        headerTintColor:       COLORS.text,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor:  COLORS.border,
          borderTopWidth:  1,
          height:          62,
          paddingBottom:   8,
          paddingTop:      6,
        },
        tabBarActiveTintColor:   COLORS.green,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle:        { fontSize: 10, fontWeight: '600', letterSpacing: 0.2, marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Dashboard', tabBarIcon: ({ focused }) => <DashIcon focused={focused} /> }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: 'Historial', tabBarIcon: ({ focused }) => <HistoryIcon focused={focused} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Ajustes', tabBarIcon: ({ focused }) => <SettingsIcon focused={focused} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 32, height: 28,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 8,
  },
  iconWrapActive: {
    backgroundColor: `${COLORS.green}1a`,
  },
});
