
import { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTasks } from '../context/TasksContext';
import { THEMES } from '../styles/colors';

const SUPPORT_EMAIL = 'victoria.myskiv@gmail.com';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  const {
    habits,
    showWeeklyBlock,
    userName,
    darkMode,
    notificationsEnabled,
    addHabit,
    updateHabit,
    deleteHabit,
    setShowWeeklyBlock,
    setUserName,
    setDarkMode,
    setNotificationsEnabled,
  } = useTasks();

  const colors = darkMode ? THEMES.dark : THEMES.light;
  const styles = createStyles(colors);

  const [nameInput, setNameInput] = useState(userName);
  const [habitModalVisible, setHabitModalVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [habitName, setHabitName] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    setNameInput(userName);
  }, [userName]);

  const saveProfile = () => {
    const name = nameInput.trim();

    setUserName(name);
    setSavedMessage(
      name ? `Ім'я «${name}» збережено` : 'Ім’я очищено'
    );
  };

  const openAddHabit = () => {
    setEditingHabit(null);
    setHabitName('');
    setHabitModalVisible(true);
  };

  const openEditHabit = (habit) => {
    setEditingHabit(habit);
    setHabitName(habit.name);
    setHabitModalVisible(true);
  };

  const saveHabit = () => {
    if (!habitName.trim()) return;

    if (editingHabit) {
      updateHabit(editingHabit.id, habitName);
    } else {
      addHabit(habitName);
    }

    setHabitModalVisible(false);
    setEditingHabit(null);
    setHabitName('');
  };

  const openFeedback = async (subject, body) => {
    const url =
      `mailto:${SUPPORT_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    try {
      await Linking.openURL(url);
    } catch {
      if (Platform.OS === 'web') {
        setSavedMessage(`Адреса підтримки: ${SUPPORT_EMAIL}`);
      } else {
        Alert.alert(
          'Не вдалося відкрити пошту',
          `Напиши на ${SUPPORT_EMAIL}`
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View
          style={[
            styles.header,
            {
              paddingTop:
                Platform.OS === 'web'
                  ? 60
                  : insets.top + 24,
            },
          ]}
        >
          <Text style={styles.title}>
            Налаштування
          </Text>

          <Text style={styles.subtitle}>
            Налаштуй застосунок під себе
          </Text>
        </View>

        {/* Профіль */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Профіль
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>
              Твоє ім'я
            </Text>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Введи ім'я"
                placeholderTextColor={colors.mutedText}
                value={nameInput}
                onChangeText={(value) => {
                  setNameInput(value);
                  setSavedMessage('');
                }}
              />

              <Pressable
                style={styles.smallButton}
                onPress={saveProfile}
              >
                <Text style={styles.smallButtonText}>
                  Зберегти
                </Text>
              </Pressable>
            </View>

            {savedMessage ? (
              <Text style={styles.successText}>
                {savedMessage}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Оформлення */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Оформлення
          </Text>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  Темна тема
                </Text>

                <Text style={styles.settingDescription}>
                  Темне оформлення застосунку
                </Text>
              </View>

              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{
                  false: '#DDDDDD',
                  true: colors.accent,
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Тижневі блоки */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Тижневі блоки
          </Text>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  Показувати тижневі блоки
                </Text>

                <Text style={styles.settingDescription}>
                  Відображати всі тижневі блоки
                  на головній сторінці
                </Text>
              </View>

              <Switch
                value={showWeeklyBlock}
                onValueChange={setShowWeeklyBlock}
                trackColor={{
                  false: '#DDDDDD',
                  true: colors.accent,
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Звички */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Мої звички
            </Text>

            <Pressable onPress={openAddHabit}>
              <Text style={styles.addText}>
                + Додати
              </Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            {habits.map((habit, index) => (
              <View
                key={habit.id}
                style={[
                  styles.habitRow,
                  index < habits.length - 1 &&
                    styles.habitBorder,
                ]}
              >
                <Text style={styles.habitName}>
                  {habit.name}
                </Text>

                <View style={styles.habitActions}>
                  <Pressable
                    onPress={() =>
                      openEditHabit(habit)
                    }
                  >
                    <Text style={styles.editText}>
                      Змінити
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      deleteHabit(habit.id)
                    }
                  >
                    <Text style={styles.deleteText}>
                      Видалити
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}

            {habits.length === 0 && (
              <Text style={styles.emptyText}>
                Звичок поки немає. Додай першу.
              </Text>
            )}
          </View>
        </View>

        {/* Сповіщення */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Сповіщення
          </Text>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  Дозволити сповіщення
                </Text>

                <Text style={styles.settingDescription}>
                  Налаштування майбутніх нагадувань
                </Text>
              </View>

              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{
                  false: '#DDDDDD',
                  true: colors.accent,
                }}
                thumbColor="#FFFFFF"
              />
            </View>

            <Text style={styles.note}>
              Самі нагадування ще не підключені.
            </Text>
          </View>
        </View>

        {/* Підтримка */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Підтримка та відгуки
          </Text>

          <View style={styles.card}>
            <Text style={styles.settingDescription}>
              Розкажи про проблему або запропонуй ідею.
            </Text>

            <Pressable
              style={styles.feedbackRow}
              onPress={() =>
                openFeedback(
                  'TaskFlow — повідомлення про проблему',
                  'Опиши проблему:\n\nПристрій:\n'
                )
              }
            >
              <Text style={styles.settingTitle}>
                Повідомити про проблему
              </Text>

              <Text style={styles.arrow}>
                ›
              </Text>
            </Pressable>

            <Pressable
              style={styles.feedbackRow}
              onPress={() =>
                openFeedback(
                  'TaskFlow — пропозиція покращення',
                  'Моя пропозиція:\n\n'
                )
              }
            >
              <Text style={styles.settingTitle}>
                Запропонувати покращення
              </Text>

              <Text style={styles.arrow}>
                ›
              </Text>
            </Pressable>

            <Text
              selectable
              style={styles.email}
            >
              {SUPPORT_EMAIL}
            </Text>
          </View>
        </View>

        {/* Про застосунок */}
        <View style={styles.about}>
          <Text style={styles.aboutTitle}>
            TaskFlow
          </Text>

          <Text style={styles.aboutText}>
            Планування завдань, подій і звичок
          </Text>

          <Text style={styles.version}>
            Версія 1.0.0
          </Text>
        </View>
      </ScrollView>

      {/* Додавання та редагування звички */}
      <Modal
        visible={habitModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setHabitModalVisible(false)
        }
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              {editingHabit
                ? 'Змінити звичку'
                : 'Нова звичка'}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Назва звички"
              placeholderTextColor={colors.mutedText}
              value={habitName}
              onChangeText={setHabitName}
              autoFocus
            />

            <Pressable
              style={styles.modalSave}
              onPress={saveHabit}
            >
              <Text style={styles.smallButtonText}>
                Зберегти
              </Text>
            </Pressable>

            <Pressable
              style={styles.modalCancel}
              onPress={() =>
                setHabitModalVisible(false)
              }
            >
              <Text style={styles.settingDescription}>
                Скасувати
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function createStyles(c) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },

    content: {
      width: '100%',
      maxWidth: 1200,
      alignSelf: 'center',
      paddingBottom: 35,
    },

    header: {
      paddingHorizontal: 25,
      marginBottom: 25,
    },

    title: {
      fontSize: 26,
      fontWeight: '700',
      color: c.text,
    },

    subtitle: {
      fontSize: 14,
      color: c.mutedText,
      marginTop: 7,
    },

    section: {
      marginBottom: 22,
    },

    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 22,
      marginBottom: 12,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: c.text,
      marginHorizontal: 22,
      marginBottom: 12,
    },

    card: {
      backgroundColor: c.card,
      marginHorizontal: 17,
      padding: 16,
      borderRadius: 16,
    },

    label: {
      fontSize: 12,
      color: c.secondaryText,
      marginBottom: 8,
    },

    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    input: {
      flex: 1,
      minWidth: 0,
      backgroundColor: c.input,
      color: c.text,
      borderRadius: 9,
      padding: 11,
      fontSize: 13,
    },

    smallButton: {
      backgroundColor: c.button,
      paddingHorizontal: 12,
      paddingVertical: 11,
      borderRadius: 9,
    },

    smallButtonText: {
      color: c.buttonText,
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
    },

    successText: {
      color: c.accent,
      fontSize: 12,
      marginTop: 10,
    },

    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },

    settingInfo: {
      flex: 1,
    },

    settingTitle: {
      fontSize: 13,
      color: c.text,
      fontWeight: '600',
    },

    settingDescription: {
      fontSize: 11,
      color: c.mutedText,
      marginTop: 4,
    },

    addText: {
      color: c.secondaryText,
      fontSize: 12,
      fontWeight: '600',
    },

    habitRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 13,
      gap: 10,
    },

    habitBorder: {
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },

    habitName: {
      flex: 1,
      color: c.text,
      fontSize: 13,
    },

    habitActions: {
      flexDirection: 'row',
      gap: 15,
    },

    editText: {
      color: '#82A9D6',
      fontSize: 12,
    },

    deleteText: {
      color: '#D98C8C',
      fontSize: 12,
    },

    emptyText: {
      color: c.mutedText,
      fontSize: 12,
    },

    note: {
      color: c.mutedText,
      fontSize: 11,
      marginTop: 12,
    },

    feedbackRow: {
      borderTopWidth: 1,
      borderTopColor: c.border,
      paddingVertical: 16,
      marginTop: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    arrow: {
      fontSize: 23,
      color: c.mutedText,
    },

    email: {
      color: c.secondaryText,
      fontSize: 12,
      marginTop: 15,
    },

    about: {
      alignItems: 'center',
      padding: 15,
    },

    aboutTitle: {
      color: c.text,
      fontSize: 15,
      fontWeight: '700',
    },

    aboutText: {
      color: c.mutedText,
      fontSize: 11,
      marginTop: 5,
    },

    version: {
      color: c.mutedText,
      fontSize: 10,
      marginTop: 7,
    },

    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      justifyContent: 'center',
      padding: 25,
    },

    modal: {
      backgroundColor: c.card,
      borderRadius: 18,
      padding: 22,
      width: '100%',
      maxWidth: 430,
      alignSelf: 'center',
    },

    modalTitle: {
      color: c.text,
      fontSize: 19,
      fontWeight: '700',
      marginBottom: 17,
    },

    modalInput: {
      backgroundColor: c.input,
      color: c.text,
      borderRadius: 10,
      padding: 13,
      fontSize: 14,
    },

    modalSave: {
      backgroundColor: c.button,
      borderRadius: 10,
      padding: 13,
      marginTop: 15,
    },

    modalCancel: {
      padding: 12,
      alignItems: 'center',
    },
  });
}
