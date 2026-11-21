
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTasks } from '../context/TasksContext';
import { THEMES } from '../styles/colors';
import TaskCard from '../components/TaskCard';
import AddTaskModal from '../components/AddTaskModal';

const WEEKDAYS = [
  'Понеділок',
  'Вівторок',
  'Середа',
  'Четвер',
  "П'ятниця",
  'Субота',
  'Неділя',
];

function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getMonday(date) {
  const monday = new Date(date);
  const day = monday.getDay();

  monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);

  return monday;
}

function formatShortDate(date) {
  return date.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'short',
  });
}

export default function TasksScreen() {
  const {
    tasks,
    addTask,
    updateTask,
    toggleTask,
    darkMode,
  } = useTasks();

  const insets = useSafeAreaInsets();
  const colors = darkMode ? THEMES.dark : THEMES.light;
  const styles = createStyles(colors);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    getDateString(new Date())
  );

  const today = getDateString(new Date());
  const monday = getMonday(new Date());

  const weekDates = WEEKDAYS.map((name, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    const dateString = getDateString(date);

    return {
      name,
      date: dateString,
      label: formatShortDate(date),
      isToday: dateString === today,
    };
  });

  const openAddModal = (date) => {
    setEditingTask(null);
    setSelectedDate(date);
    setModalVisible(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setSelectedDate(task.date);
    setModalVisible(true);
  };

  const saveTask = (taskData) => {
    if (editingTask) {
      updateTask(taskData);
    } else {
      addTask(taskData);
    }

    setModalVisible(false);
    setEditingTask(null);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingTask(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
          <Text style={styles.title}>Мої плани</Text>

          <Text style={styles.subtitle}>
            Організуй завдання на цей тиждень
          </Text>
        </View>

        <Text style={styles.weekRange}>
          {weekDates[0].label} — {weekDates[6].label}
        </Text>

        {weekDates.map((day) => {
          const dayTasks = tasks
            .filter((task) => task.date === day.date)
            .sort(
              (a, b) =>
                Number(a.done) - Number(b.done)
            );

          return (
            <View
              key={day.date}
              style={styles.dayCard}
            >
              <Pressable
                style={styles.dayHeader}
                onPress={() => openAddModal(day.date)}
              >
                <View>
                  <Text style={styles.dayName}>
                    {day.name}
                  </Text>

                  <Text style={styles.dayDate}>
                    {day.label}
                  </Text>
                </View>

                <View style={styles.dayHeaderRight}>
                  {day.isToday && (
                    <Text style={styles.todayLabel}>
                      СЬОГОДНІ
                    </Text>
                  )}

                  <Text style={styles.addText}>
                    + Додати
                  </Text>
                </View>
              </Pressable>

              {dayTasks.length > 0 ? (
                <View style={styles.taskList}>
                  {dayTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={() => toggleTask(task.id)}
                      onEdit={() => openEditModal(task)}
                    />
                  ))}
                </View>
              ) : (
                <Pressable
                  style={styles.emptyDay}
                  onPress={() => openAddModal(day.date)}
                >
                  <Text style={styles.emptyText}>
                    Поки немає завдань
                  </Text>
                </Pressable>
              )}
            </View>
          );
        })}

        <View style={styles.bottomSpace} />
      </ScrollView>

      <AddTaskModal
        visible={modalVisible}
        onClose={closeModal}
        onAdd={saveTask}
        task={editingTask}
        selectedDate={selectedDate}
        weekDates={weekDates}
      />
    </View>
  );
}

function createStyles(c) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    scrollContent: {
      width: '100%',
      maxWidth: 1200,
      alignSelf: 'center',
      paddingBottom: 10,
    },
    header: {
      paddingHorizontal: 25,
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
    weekRange: {
      marginHorizontal: 25,
      marginTop: 22,
      marginBottom: 15,
      fontSize: 13,
      color: c.secondaryText,
    },
    dayCard: {
      backgroundColor: c.card,
      marginHorizontal: 17,
      marginBottom: 13,
      borderRadius: 17,
      padding: 15,
    },
    dayHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 12,
    },
    dayName: {
      fontSize: 16,
      fontWeight: '700',
      color: c.text,
    },
    dayDate: {
      fontSize: 11,
      color: c.mutedText,
      marginTop: 3,
    },
    dayHeaderRight: {
      alignItems: 'flex-end',
      gap: 5,
    },
    todayLabel: {
      fontSize: 9,
      color: c.secondaryText,
      fontWeight: '700',
    },
    addText: {
      fontSize: 11,
      color: c.secondaryText,
    },
    taskList: {
      gap: 8,
    },
    emptyDay: {
      borderTopWidth: 1,
      borderTopColor: c.border,
      paddingTop: 12,
    },
    emptyText: {
      fontSize: 12,
      color: c.mutedText,
    },
    bottomSpace: {
      height: 25,
    },
  });
}
