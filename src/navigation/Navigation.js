
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import CalendarScreen from '../screens/CalendarScreen';
import SettingsScreen from '../screens/SettingsScreen';

import { useTasks } from '../context/TasksContext';
import { THEMES } from '../styles/colors';

const Tab = createBottomTabNavigator();

export default function Navigation() {
  const { darkMode } = useTasks();
  const insets = useSafeAreaInsets();
  const colors = darkMode ? THEMES.dark : THEMES.light;

  const navigationTheme = {
    ...(darkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(darkMode ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.text,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
    },
  };

  const bottomInset = Platform.OS === 'web' ? 0 : insets.bottom;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.mutedText,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            height: 58 + bottomInset,
            paddingBottom: Math.max(bottomInset, 6),
            paddingTop: 7,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
          },
          sceneStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Tab.Screen name="Головна" component={HomeScreen} />
        <Tab.Screen name="Завдання" component={TasksScreen} />
        <Tab.Screen name="Календар" component={CalendarScreen} />
        <Tab.Screen name="Налаштування" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
