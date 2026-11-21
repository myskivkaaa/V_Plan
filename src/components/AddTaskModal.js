
import { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { CATEGORY_COLORS, THEMES } from '../styles/colors';
import { useTasks } from '../context/TasksContext';

const CATEGORIES = ['Навчання', 'Робота', 'Особисте', 'Інше'];
const PRIORITIES = ['Низький', 'Середній', 'Високий'];

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function AddTaskModal({
  visible,
  onClose,
  onAdd,
  task = null,
  selectedDate = getTodayDate(),
  weekDates = [],
}) {
  const { darkMode } = useTasks();
  const c = darkMode ? THEMES.dark : THEMES.light;
  const styles = createStyles(c);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [category, setCategory] = useState('Особисте');
  const [priority, setPriority] = useState('Середній');
  const [error, setError] = useState('');

  const availableDays = weekDates.length > 0
    ? weekDates
    : [{ name: 'Сьогодні', date: selectedDate, label: 'Сьогодні' }];

  useEffect(() => {
    if (visible) {
      setTitle(task?.title || '');
      setDescription(task?.description || '');
      setDate(task?.date || selectedDate);
      setCategory(task?.category || 'Особисте');
      setPriority(task?.priority || 'Середній');
      setError('');
    }
  }, [visible, task, selectedDate]);

  const saveTask = () => {
    if (!title.trim()) {
      setError('Введи назву завдання');
      return;
    }

    onAdd({
      id: task?.id || Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      date,
      category,
      priority,
      done: task?.done || false,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modal}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>
              {task ? 'Редагувати завдання' : 'Нове завдання'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Назва завдання"
              placeholderTextColor={c.mutedText}
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Опис (необов'язково)"
              placeholderTextColor={c.mutedText}
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Text style={styles.label}>День тижня</Text>
            <View style={styles.options}>
              {availableDays.map((day) => (
                <Pressable
                  key={day.date}
                  style={[
                    styles.dayOption,
                    date === day.date && styles.selectedOption,
                  ]}
                  onPress={() => setDate(day.date)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      date === day.date && styles.selectedText,
                    ]}
                  >
                    {day.name}
                  </Text>
                  <Text
                    style={[
                      styles.dayDate,
                      date === day.date && styles.selectedText,
                    ]}
                  >
                    {day.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Категорія</Text>
            <View style={styles.options}>
              {CATEGORIES.map((item) => (
                <Pressable
                  key={item}
                  style={[
                    styles.option,
                    category === item && styles.selectedOption,
                  ]}
                  onPress={() => setCategory(item)}
                >
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: CATEGORY_COLORS[item] },
                    ]}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      category === item && styles.selectedText,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Пріоритет</Text>
            <View style={styles.options}>
              {PRIORITIES.map((item) => (
                <Pressable
                  key={item}
                  style={[
                    styles.priorityOption,
                    priority === item && styles.selectedOption,
                  ]}
                  onPress={() => setPriority(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      priority === item && styles.selectedText,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable style={styles.saveButton} onPress={saveTask}>
              <Text style={styles.saveText}>
                {task ? 'Зберегти зміни' : 'Додати завдання'}
              </Text>
            </Pressable>

            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Скасувати</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function createStyles(c) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      justifyContent: 'center',
      padding: 20,
    },
    modal: {
      backgroundColor: c.card,
      borderRadius: 20,
      padding: 22,
      maxHeight: '90%',
      width: '100%',
      maxWidth: 540,
      alignSelf: 'center',
    },
    heading: {
      fontSize: 21,
      fontWeight: '700',
      color: c.text,
      marginBottom: 20,
    },
    input: {
      backgroundColor: c.input,
      borderRadius: 11,
      padding: 14,
      fontSize: 14,
      color: c.text,
      marginBottom: 13,
    },
    descriptionInput: {
      minHeight: 75,
      textAlignVertical: 'top',
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
      color: c.secondaryText,
      marginBottom: 10,
      marginTop: 5,
    },
    options: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    dayOption: {
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 10,
      paddingVertical: 9,
      paddingHorizontal: 11,
      alignItems: 'center',
      minWidth: 75,
    },
    dayDate: {
      fontSize: 10,
      color: c.mutedText,
      marginTop: 3,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 10,
      paddingVertical: 9,
      paddingHorizontal: 11,
      gap: 6,
    },
    priorityOption: {
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 10,
      paddingVertical: 9,
      paddingHorizontal: 13,
    },
    selectedOption: {
      borderColor: c.accent,
      backgroundColor: c.input,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    optionText: {
      fontSize: 12,
      color: c.secondaryText,
    },
    selectedText: {
      color: c.text,
      fontWeight: '600',
    },
    error: {
      color: '#D98C8C',
      fontSize: 12,
      marginBottom: 12,
    },
    saveButton: {
      backgroundColor: c.button,
      padding: 15,
      borderRadius: 11,
      alignItems: 'center',
    },
    saveText: {
      color: c.buttonText,
      fontWeight: '600',
    },
    cancelButton: {
      padding: 13,
      alignItems: 'center',
    },
    cancelText: {
      color: c.secondaryText,
    },
  });
}
