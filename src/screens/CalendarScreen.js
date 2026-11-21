
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTasks } from '../context/TasksContext';
import { THEMES } from '../styles/colors';

const MONTHS = [
  'Січень', 'Лютий', 'Березень', 'Квітень',
  'Травень', 'Червень', 'Липень', 'Серпень',
  'Вересень', 'Жовтень', 'Листопад', 'Грудень',
];

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function CalendarScreen() {
  const { events, addEvent, darkMode } = useTasks();

  const insets = useSafeAreaInsets();
  const colors = darkMode ? THEMES.dark : THEMES.light;
  const styles = createStyles(colors);

  const today = new Date();
  const todayString = formatDate(today);

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(todayString);

  const [showForm, setShowForm] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('12:00');
  const [eventDescription, setEventDescription] = useState('');
  const [error, setError] = useState('');

  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) => index + 1
    ),
  ];

  const selectedEvents = events
    .filter((event) => event.date === selectedDate)
    .sort((a, b) =>
      (a.time || '').localeCompare(b.time || '')
    );

  const changeMonth = (direction) => {
    const newDate = new Date(year, month + direction, 1);

    setMonth(newDate.getMonth());
    setYear(newDate.getFullYear());
  };

  const saveEvent = () => {
    if (!eventTitle.trim()) {
      setError('Введи назву події');
      return;
    }

    if (!/^\d{2}:\d{2}$/.test(eventTime)) {
      setError('Введи час у форматі ГГ:ХХ');
      return;
    }

    const [hours, minutes] = eventTime.split(':').map(Number);

    if (hours > 23 || minutes > 59) {
      setError('Вкажи правильний час');
      return;
    }

    addEvent({
      id: Date.now().toString(),
      title: eventTitle.trim(),
      description: eventDescription.trim(),
      date: selectedDate,
      time: eventTime,
      color: '#A9C5E5',
    });

    setEventTitle('');
    setEventTime('12:00');
    setEventDescription('');
    setError('');
    setShowForm(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop:
              Platform.OS === 'web'
                ? 60
                : insets.top + 24,
          },
        ]}
      >
        <Text style={styles.title}>Календар</Text>

        <Text style={styles.subtitle}>
          Твої події та плани
        </Text>

        {/* Календар */}
        <View style={styles.calendar}>
          <View style={styles.monthHeader}>
            <Pressable
              style={styles.arrowButton}
              onPress={() => changeMonth(-1)}
              accessibilityLabel="Попередній місяць"
            >
              <Text style={styles.arrow}>‹</Text>
            </Pressable>

            <Text style={styles.monthTitle}>
              {MONTHS[month]} {year}
            </Text>

            <Pressable
              style={styles.arrowButton}
              onPress={() => changeMonth(1)}
              accessibilityLabel="Наступний місяць"
            >
              <Text style={styles.arrow}>›</Text>
            </Pressable>
          </View>

          <View style={styles.weekdays}>
            {WEEKDAYS.map((day) => (
              <Text
                key={day}
                style={styles.weekday}
              >
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {calendarDays.map((day, index) => {
              if (day === null) {
                return (
                  <View
                    key={`empty-${index}`}
                    style={styles.dayCell}
                  />
                );
              }

              const dateString = formatDate(
                new Date(year, month, day)
              );

              const isSelected = selectedDate === dateString;
              const isToday = todayString === dateString;

              const hasEvents = events.some(
                (event) => event.date === dateString
              );

              return (
                <Pressable
                  key={dateString}
                  style={styles.dayCell}
                  onPress={() => {
                    setSelectedDate(dateString);
                    setShowForm(false);
                    setError('');
                  }}
                >
                  <View
                    style={[
                      styles.dayButton,
                      isToday && styles.todayButton,
                      isSelected && styles.selectedButton,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isSelected && styles.selectedText,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>

                  {hasEvents && (
                    <View
                      style={[
                        styles.dayDot,
                        isSelected && styles.selectedDot,
                      ]}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Заголовок подій */}
        <View style={styles.eventsHeader}>
          <View style={styles.eventsHeaderInfo}>
            <Text style={styles.sectionTitle}>
              {selectedDate === todayString
                ? 'Події сьогодні'
                : 'Події вибраного дня'}
            </Text>

            <Text style={styles.selectedDateText}>
              {selectedDate.split('-').reverse().join('.')}
            </Text>
          </View>

          <Pressable
            style={styles.addButton}
            onPress={() => {
              setError('');
              setShowForm(true);
            }}
          >
            <Text style={styles.addButtonText}>
              + Подія
            </Text>
          </Pressable>
        </View>

        {/* Форма нової події */}
        {showForm && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>
              Нова подія
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Назва події"
              placeholderTextColor={colors.mutedText}
              value={eventTitle}
              onChangeText={setEventTitle}
            />

            <TextInput
              style={styles.input}
              placeholder="Час (наприклад, 13:00)"
              placeholderTextColor={colors.mutedText}
              value={eventTime}
              onChangeText={setEventTime}
              keyboardType="numbers-and-punctuation"
            />

            <TextInput
              style={styles.input}
              placeholder="Опис або місце (необов'язково)"
              placeholderTextColor={colors.mutedText}
              value={eventDescription}
              onChangeText={setEventDescription}
            />

            {error ? (
              <Text style={styles.error}>
                {error}
              </Text>
            ) : null}

            <Pressable
              style={styles.saveButton}
              onPress={saveEvent}
            >
              <Text style={styles.saveButtonText}>
                Зберегти подію
              </Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setShowForm(false);
                setError('');
              }}
            >
              <Text style={styles.cancelButtonText}>
                Скасувати
              </Text>
            </Pressable>
          </View>
        )}

        {/* Список подій */}
        <View style={styles.eventsList}>
          {selectedEvents.length > 0 ? (
            selectedEvents.map((event) => (
              <View
                key={event.id}
                style={styles.eventCard}
              >
                <View
                  style={[
                    styles.eventAccent,
                    {
                      backgroundColor:
                        event.color || '#A9C5E5',
                    },
                  ]}
                />

                <Text style={styles.eventTime}>
                  {event.time}
                </Text>

                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>
                    {event.title}
                  </Text>

                  {event.description ? (
                    <Text style={styles.eventDescription}>
                      {event.description}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              На цей день подій немає
            </Text>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
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

    title: {
      fontSize: 26,
      fontWeight: '700',
      color: c.text,
      marginHorizontal: 28,
    },

    subtitle: {
      fontSize: 14,
      color: c.mutedText,
      marginHorizontal: 28,
      marginTop: 8,
      marginBottom: 18,
    },

    calendar: {
      backgroundColor: c.card,
      marginHorizontal: 20,
      paddingHorizontal: 13,
      paddingTop: 10,
      paddingBottom: 8,
      borderRadius: 16,
    },

    monthHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },

    monthTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: c.text,
    },

    arrowButton: {
      minWidth: 36,
      minHeight: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },

    arrow: {
      fontSize: 25,
      color: c.secondaryText,
    },

    weekdays: {
      flexDirection: 'row',
      marginBottom: 4,
    },

    weekday: {
      width: '14.2857%',
      textAlign: 'center',
      fontSize: 11,
      color: c.mutedText,
      fontWeight: '600',
    },

    daysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },

    dayCell: {
      width: '14.2857%',
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
    },

    dayButton: {
      width: 29,
      height: 29,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },

    todayButton: {
      borderWidth: 1,
      borderColor: c.text,
    },

    selectedButton: {
      backgroundColor: c.button,
    },

    dayText: {
      fontSize: 12,
      color: c.text,
    },

    selectedText: {
      color: c.buttonText,
      fontWeight: '700',
    },

    dayDot: {
      position: 'absolute',
      bottom: 0,
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#A9C5E5',
    },

    selectedDot: {
      backgroundColor: c.text,
    },

    eventsHeader: {
      marginHorizontal: 25,
      marginTop: 23,
      marginBottom: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },

    eventsHeaderInfo: {
      flex: 1,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: c.text,
    },

    selectedDateText: {
      color: c.mutedText,
      fontSize: 12,
      marginTop: 4,
    },

    addButton: {
      backgroundColor: c.button,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
    },

    addButtonText: {
      color: c.buttonText,
      fontSize: 12,
      fontWeight: '600',
    },

    form: {
      backgroundColor: c.card,
      marginHorizontal: 20,
      padding: 16,
      borderRadius: 14,
      marginBottom: 16,
    },

    formTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: c.text,
      marginBottom: 12,
    },

    input: {
      backgroundColor: c.input,
      borderRadius: 10,
      padding: 12,
      fontSize: 13,
      color: c.text,
      marginBottom: 9,
    },

    error: {
      color: '#D98C8C',
      fontSize: 12,
      marginBottom: 9,
    },

    saveButton: {
      backgroundColor: c.button,
      padding: 13,
      borderRadius: 10,
      alignItems: 'center',
    },

    saveButtonText: {
      color: c.buttonText,
      fontWeight: '600',
    },

    cancelButton: {
      padding: 10,
      alignItems: 'center',
    },

    cancelButtonText: {
      color: c.secondaryText,
      fontSize: 12,
    },

    eventsList: {
      paddingHorizontal: 20,
      gap: 9,
    },

    eventCard: {
      backgroundColor: c.card,
      borderRadius: 12,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
    },

    eventAccent: {
      width: 4,
      height: 38,
      borderRadius: 3,
    },

    eventTime: {
      fontSize: 13,
      fontWeight: '600',
      color: c.secondaryText,
      marginHorizontal: 12,
    },

    eventInfo: {
      flex: 1,
      minWidth: 0,
    },

    eventTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: c.text,
    },

    eventDescription: {
      fontSize: 12,
      color: c.mutedText,
      marginTop: 4,
    },

    emptyText: {
      fontSize: 13,
      color: c.mutedText,
      paddingHorizontal: 5,
    },

    bottomSpace: {
      height: 25,
    },
  });
}
