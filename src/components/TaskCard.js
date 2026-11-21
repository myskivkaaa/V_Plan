
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { CATEGORY_COLORS, THEMES } from '../styles/colors';
import { useTasks } from '../context/TasksContext';

export default function TaskCard({ task, onToggle, onEdit }) {
  const { darkMode } = useTasks();
  const c = darkMode ? THEMES.dark : THEMES.light;
  const styles = createStyles(c);

  return (
    <View style={styles.taskCard}>
      <Pressable
        style={styles.checkbox}
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: Boolean(task.done) }}
      >
        <View style={[styles.checkboxInner, task.done && styles.checked]}>
          {task.done && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </Pressable>

      <View style={styles.taskInfo}>
        <Text style={[styles.taskTitle, task.done && styles.completed]}>
          {task.title}
        </Text>

        {task.description ? (
          <Text style={styles.taskDescription}>{task.description}</Text>
        ) : null}

        <View style={styles.taskMetadata}>
          <View
            style={[
              styles.categoryDot,
              {
                backgroundColor:
                  CATEGORY_COLORS[task.category] || '#D4C5E8',
              },
            ]}
          />
          <Text style={styles.taskCategory}>{task.category}</Text>
        </View>

        <Text
          style={[
            styles.priority,
            task.priority === 'Високий' && styles.highPriority,
            task.priority === 'Низький' && styles.lowPriority,
          ]}
        >
          {task.priority} пріоритет
        </Text>
      </View>

      {onEdit && (
        <Pressable style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editText}>Редагувати</Text>
        </Pressable>
      )}
    </View>
  );
}

function createStyles(c) {
  return StyleSheet.create({
    taskCard: {
      backgroundColor: c.card,
      borderRadius: 15,
      padding: 15,
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkbox: {
      marginRight: 12,
      paddingVertical: 5,
    },
    checkboxInner: {
      width: 23,
      height: 23,
      borderRadius: 7,
      borderWidth: 1.5,
      borderColor: c.mutedText,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checked: {
      backgroundColor: c.button,
      borderColor: c.button,
    },
    checkmark: {
      color: c.buttonText,
      fontSize: 15,
      fontWeight: '700',
    },
    taskInfo: {
      flex: 1,
      minWidth: 0,
    },
    taskTitle: {
      fontSize: 14,
      color: c.text,
      fontWeight: '600',
    },
    completed: {
      textDecorationLine: 'line-through',
      color: c.mutedText,
    },
    taskDescription: {
      fontSize: 12,
      color: c.secondaryText,
      marginTop: 5,
    },
    taskMetadata: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      gap: 6,
    },
    categoryDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    taskCategory: {
      fontSize: 11,
      color: c.secondaryText,
    },
    priority: {
      fontSize: 11,
      color: c.secondaryText,
      marginTop: 5,
    },
    highPriority: {
      color: '#D98C8C',
    },
    lowPriority: {
      color: '#8DBB9A',
    },
    editButton: {
      paddingVertical: 8,
      paddingHorizontal: 9,
      marginLeft: 5,
    },
    editText: {
      color: c.secondaryText,
      fontSize: 11,
    },
  });
}
