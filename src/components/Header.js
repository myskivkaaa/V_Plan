
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTasks } from '../context/TasksContext';
import { THEMES } from '../styles/colors';

export default function Header() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const { userName, darkMode } = useTasks();

  const colors = darkMode ? THEMES.dark : THEMES.light;
  const styles = createStyles(colors);

  const initial = userName?.trim()
    ? userName.trim().charAt(0).toLocaleUpperCase('uk-UA')
    : '?';

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop:
            Platform.OS === 'web'
              ? 24
              : insets.top + 12,
        },
      ]}
    >
      <Text style={styles.logo}>
        TaskFlow.
      </Text>

      <Pressable
        style={styles.avatar}
        onPress={() =>
          navigation.navigate('Налаштування')
        }
        accessibilityRole="button"
        accessibilityLabel="Відкрити профіль"
      >
        <Text style={styles.avatarText}>
          {initial}
        </Text>
      </Pressable>
    </View>
  );
}

function createStyles(c) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 25,
      paddingBottom: 20,
    },

    logo: {
      fontSize: 25,
      fontWeight: '800',
      color: c.text,
      letterSpacing: -1,
    },

    avatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: c.input,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    avatarText: {
      color: c.text,
      fontSize: 17,
      fontWeight: '700',
    },
  });
}
