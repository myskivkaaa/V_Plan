
import { StyleSheet, Text, View } from 'react-native';
import { THEMES } from '../styles/colors';
import { useTasks } from '../context/TasksContext';

export default function EventCard({
  time,
  day,
  color,
  title,
  description,
}) {
  const { darkMode } = useTasks();
  const c = darkMode ? THEMES.dark : THEMES.light;
  const styles = createStyles(c);

  return (
    <View style={styles.eventCard}>
      <View style={styles.eventTimeBlock}>
        <Text style={styles.eventHour}>{time}</Text>
        <Text style={styles.eventDay}>{day}</Text>
      </View>

      <View
        style={[
          styles.eventAccent,
          { backgroundColor: color || '#A9C5E5' },
        ]}
      />

      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{title}</Text>

        {description ? (
          <Text style={styles.eventDescription}>
            {description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function createStyles(c) {
  return StyleSheet.create({
    eventCard: {
      backgroundColor: c.card,
      borderRadius: 15,
      padding: 17,
      flexDirection: 'row',
      alignItems: 'center',
    },
    eventTimeBlock: {
      width: 83,
    },
    eventHour: {
      fontSize: 17,
      fontWeight: '700',
      color: c.text,
    },
    eventDay: {
      fontSize: 9,
      color: c.mutedText,
      marginTop: 5,
    },
    eventAccent: {
      width: 3,
      height: 40,
      borderRadius: 3,
      marginHorizontal: 13,
    },
    eventInfo: {
      flex: 1,
      minWidth: 0,
    },
    eventTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: c.text,
    },
    eventDescription: {
      fontSize: 12,
      color: c.mutedText,
      marginTop: 5,
    },
  });
}
