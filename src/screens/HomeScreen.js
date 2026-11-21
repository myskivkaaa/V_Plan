
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  useWindowDimensions,
} from 'react-native';

import Header from '../components/Header';
import TaskCard from '../components/TaskCard';
import EventCard from '../components/EventCard';
import AddTaskModal from '../components/AddTaskModal';
import { useTasks } from '../context/TasksContext';
import { THEMES } from '../styles/colors';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMonday(date) {
  const monday = new Date(date);
  const day = monday.getDay();

  monday.setDate(
    monday.getDate() - (day === 0 ? 6 : day - 1)
  );

  monday.setHours(0, 0, 0, 0);
  return monday;
}

function formatDayDate(value) {
  if (!value) return '';

  const [year, month, day] = value.split('-');
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  const weekday = [
    'Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб',
  ][date.getDay()];

  return `${weekday} ${day}.${month}`;
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 760;

  const {
    tasks,
    events,
    habits,
    weeklyBlocks,
    showWeeklyBlock,
    userName,
    darkMode,
    addTask,
    toggleTask,
    toggleHabit,
    addWeeklyBlock,
    updateWeeklyBlock,
    deleteWeeklyBlock,
    addWeeklyItem,
    toggleWeeklyItem,
    deleteWeeklyItem,
  } = useTasks();

  const colors = darkMode ? THEMES.dark : THEMES.light;
  const styles = createStyles(colors);

  const [modalVisible, setModalVisible] = useState(false);

  // Створення та перейменування блоків
  const [addingBlock, setAddingBlock] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [blockTitle, setBlockTitle] = useState('');
  const [blockError, setBlockError] = useState('');

  // Додавання справ до тижневих блоків
  const [activeWeeklyBlockId, setActiveWeeklyBlockId] =
    useState(null);
  const [weeklyItemTitle, setWeeklyItemTitle] = useState('');
  const [weeklyItemDate, setWeeklyItemDate] = useState('');
  const [weeklyError, setWeeklyError] = useState('');

  const today = new Date();
  const todayString = getDateString(today);
  const monday = getMonday(today);

  const weekDates = WEEKDAYS.map((name, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    return {
      name,
      date: getDateString(date),
      label: date.toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'short',
      }),
    };
  });

  const todayTasks = tasks.filter(
    (task) => task.date === todayString
  );

  const todayEvents = events
    .filter((event) => event.date === todayString)
    .sort((a, b) =>
      (a.time || '').localeCompare(b.time || '')
    );

  const completedTasks = todayTasks.filter(
    (task) => task.done
  ).length;

  const dateLabel = today.toLocaleDateString('uk-UA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const universityTasks = tasks.filter(
    (task) =>
      task.category === 'Навчання' &&
      weekDates.some((day) => day.date === task.date)
  );

  // Відкриття створення нового блоку
  const openNewBlockForm = () => {
    setEditingBlockId(null);
    setAddingBlock(true);
    setBlockTitle('');
    setBlockError('');
  };

  // Редагування прямо всередині вибраного блоку
  const openEditBlockForm = (block) => {
    setAddingBlock(false);
    setEditingBlockId(block.id);
    setBlockTitle(block.title);
    setBlockError('');
  };

  const closeBlockForm = () => {
    setAddingBlock(false);
    setEditingBlockId(null);
    setBlockTitle('');
    setBlockError('');
  };

  const saveBlock = () => {
    const title = blockTitle.trim();

    if (!title) {
      setBlockError('Введи назву блоку');
      return;
    }

    if (editingBlockId) {
      updateWeeklyBlock(editingBlockId, title);
    } else {
      addWeeklyBlock(title);
    }

    closeBlockForm();
  };

  // Відкриття форми додавання справи
  const openWeeklyForm = (blockId) => {
    if (activeWeeklyBlockId === blockId) {
      setActiveWeeklyBlockId(null);
      setWeeklyError('');
      return;
    }

    setActiveWeeklyBlockId(blockId);
    setWeeklyItemTitle('');
    setWeeklyItemDate('');
    setWeeklyError('');
  };

  const saveWeeklyItem = () => {
    if (!weeklyItemTitle.trim()) {
      setWeeklyError('Введи назву справи');
      return;
    }

    if (!weeklyItemDate) {
      setWeeklyError('Вибери день');
      return;
    }

    addWeeklyItem(
      {
        title: weeklyItemTitle.trim(),
        date: weeklyItemDate,
      },
      activeWeeklyBlockId
    );

    setWeeklyItemTitle('');
    setWeeklyItemDate('');
    setWeeklyError('');
    setActiveWeeklyBlockId(null);
  };

  const removeBlock = (blockId) => {
    deleteWeeklyBlock(blockId);

    if (editingBlockId === blockId) {
      closeBlockForm();
    }

    if (activeWeeklyBlockId === blockId) {
      setActiveWeeklyBlockId(null);
    }
  };

  // Спільна форма назви блоку
  const renderBlockForm = () => (
    <View style={styles.inlineEdit}>
      <TextInput
        style={styles.weeklyInput}
        placeholder="Назва блоку"
        placeholderTextColor={colors.mutedText}
        value={blockTitle}
        onChangeText={(value) => {
          setBlockTitle(value);
          setBlockError('');
        }}
        maxLength={40}
        autoFocus
      />

      {blockError ? (
        <Text style={styles.error}>{blockError}</Text>
      ) : null}

      <View style={styles.formActions}>
        <Pressable
          style={styles.formSaveButton}
          onPress={saveBlock}
        >
          <Text style={styles.saveWeeklyText}>
            Зберегти
          </Text>
        </Pressable>

        <Pressable
          style={styles.formCancelButton}
          onPress={closeBlockForm}
        >
          <Text style={styles.cancelText}>
            Скасувати
          </Text>
        </Pressable>
      </View>
    </View>
  );

  // Окремий тижневий блок
  const renderWeeklyBlock = (block) => {
    const isUniversity = block.id === 'university';
    const isEditing = editingBlockId === block.id;

    const blockItems = [
      ...(isUniversity
        ? universityTasks.map((task) => ({
            ...task,
            isTask: true,
          }))
        : []),
      ...block.items.map((item) => ({
        ...item,
        isTask: false,
      })),
    ].sort((a, b) =>
      (a.date || '').localeCompare(b.date || '')
    );

    return (
      <View key={block.id} style={styles.weeklyCard}>
        <View style={styles.weeklyHeader}>
          <View style={styles.weeklyHeaderText}>
            <Text style={styles.weeklyTitle}>
              {block.title}
            </Text>

            <Text style={styles.weeklySubtitle}>
              Твої справи на цей тиждень
            </Text>
          </View>

          <View style={styles.weeklyHeaderActions}>
            <Pressable
              style={styles.headerIconButton}
              onPress={() =>
                isEditing
                  ? closeBlockForm()
                  : openEditBlockForm(block)
              }
              accessibilityLabel="Перейменувати блок"
            >
              <Text style={styles.headerIconText}>
                ✎
              </Text>
            </Pressable>

            {!isUniversity && (
              <Pressable
                style={styles.headerIconButton}
                onPress={() => removeBlock(block.id)}
                accessibilityLabel="Видалити блок"
              >
                <Text style={styles.headerIconText}>
                  ×
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Редагування назви в самій картці */}
        {isEditing && renderBlockForm()}

        <Pressable
          style={styles.weeklyAddButton}
          onPress={() => openWeeklyForm(block.id)}
        >
          <Text style={styles.weeklyAdd}>
            {activeWeeklyBlockId === block.id
              ? '− Скасувати'
              : '+ Додати справу'}
          </Text>
        </Pressable>

        {/* Додавання справи в цій самій картці */}
        {activeWeeklyBlockId === block.id && (
          <View style={styles.weeklyForm}>
            <TextInput
              style={styles.weeklyInput}
              placeholder="Назва справи"
              placeholderTextColor={colors.mutedText}
              value={weeklyItemTitle}
              onChangeText={(value) => {
                setWeeklyItemTitle(value);
                setWeeklyError('');
              }}
            />

            <Text style={styles.formLabel}>
              День виконання
            </Text>

            <View style={styles.dateOptions}>
              {weekDates.map((day) => {
                const selected =
                  weeklyItemDate === day.date;

                return (
                  <Pressable
                    key={day.date}
                    style={[
                      styles.dateOption,
                      selected && styles.dateSelected,
                    ]}
                    onPress={() => {
                      setWeeklyItemDate(day.date);
                      setWeeklyError('');
                    }}
                  >
                    <Text
                      style={[
                        styles.dateOptionText,
                        selected && styles.dateSelectedText,
                      ]}
                    >
                      {day.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {weeklyError ? (
              <Text style={styles.error}>
                {weeklyError}
              </Text>
            ) : null}

            <Pressable
              style={styles.saveWeeklyButton}
              onPress={saveWeeklyItem}
            >
              <Text style={styles.saveWeeklyText}>
                Зберегти
              </Text>
            </Pressable>
          </View>
        )}

        {/* Список справ блоку */}
        {blockItems.map((item) => (
          <View
            key={`${item.isTask ? 'task' : 'weekly'}-${item.id}`}
            style={styles.weeklyItem}
          >
            <Pressable
              style={[
                styles.weeklyCheckbox,
                item.done && styles.weeklyCheckboxDone,
              ]}
              onPress={() => {
                if (item.isTask) {
                  toggleTask(item.id);
                } else {
                  toggleWeeklyItem(item.id, block.id);
                }
              }}
            >
              {item.done && (
                <Text style={styles.weeklyCheckmark}>
                  ✓
                </Text>
              )}
            </Pressable>

            <Text
              style={[
                styles.weeklyItemTitle,
                item.done && styles.weeklyDoneText,
              ]}
            >
              {item.title}
            </Text>

            <Text style={styles.weeklyItemDate}>
              {formatDayDate(item.date)}
            </Text>

            {!item.isTask && (
              <Pressable
                style={styles.deleteItem}
                onPress={() =>
                  deleteWeeklyItem(item.id, block.id)
                }
              >
                <Text style={styles.deleteText}>
                  ×
                </Text>
              </Pressable>
            )}
          </View>
        ))}

        {blockItems.length === 0 && (
          <Text style={styles.emptyText}>
            Поки немає справ на тиждень
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header />

        {/* Привітання */}
        <View style={styles.greeting}>
          <Text style={styles.date}>
            {dateLabel}
          </Text>

          <Text style={styles.title}>
            {userName
              ? `Привіт, ${userName}!`
              : 'Мій день'}
          </Text>

          <Text style={styles.subtitle}>
            Нехай сьогодні все вдасться!
          </Text>
        </View>

        {/* Завдання на сьогодні */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Завдання на сьогодні
            </Text>

            <Text style={styles.sectionSubtitle}>
              Виконано {completedTasks} із {todayTasks.length}
            </Text>
          </View>
        </View>

        <View style={styles.list}>
          {todayTasks.length > 0 ? (
            todayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>
              На сьогодні завдань немає
            </Text>
          )}
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>
            + Додати завдання
          </Text>
        </Pressable>

        {/* Тижневі блоки та звички */}
        <View
          style={[
            styles.dashboardRow,
            isWide && styles.dashboardRowWide,
          ]}
        >
          <View
            style={[
              styles.weeklyColumn,
              isWide && styles.dashboardColumnCard,
            ]}
          >
            {showWeeklyBlock &&
              weeklyBlocks.map(renderWeeklyBlock)}

            {showWeeklyBlock && !addingBlock && (
              <Pressable
                style={styles.addBlockButton}
                onPress={openNewBlockForm}
              >
                <Text style={styles.addBlockText}>
                  + Додати тижневий блок
                </Text>
              </Pressable>
            )}

            {/* Новий блок створюється тут */}
            {showWeeklyBlock && addingBlock && (
              <View style={styles.blockForm}>
                <Text style={styles.blockFormTitle}>
                  Новий тижневий блок
                </Text>

                {renderBlockForm()}
              </View>
            )}
          </View>

          {/* Мої звички */}
          <View
            style={[
              styles.habitsCard,
              isWide && styles.dashboardColumnCard,
            ]}
          >
            <View style={styles.habitsHeader}>
              <Text style={styles.sectionTitle}>
                Мої звички
              </Text>

              <Text style={styles.sectionSubtitle}>
                Маленькі кроки щодня
              </Text>
            </View>

            <View style={styles.habitWeekHeader}>
              <View style={styles.habitNameSpacer} />

              <View style={styles.habitChecks}>
                {weekDates.map((day, index) => (
                  <View
                    key={day.date}
                    style={styles.habitDay}
                  >
                    <Text
                      style={[
                        styles.habitDayText,
                        day.date === todayString &&
                          styles.currentDayText,
                      ]}
                    >
                      {WEEKDAYS[index]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {habits.map((habit) => (
              <View
                key={habit.id}
                style={styles.habitRow}
              >
                <Text
                  style={styles.habitName}
                  numberOfLines={2}
                >
                  {habit.name}
                </Text>

                <View style={styles.habitChecks}>
                  {weekDates.map((day) => {
                    const isDone = Boolean(
                      habit.records?.[day.date]
                    );

                    return (
                      <View
                        key={day.date}
                        style={styles.habitDay}
                      >
                        <Pressable
                          style={[
                            styles.habitCheck,
                            isDone && styles.habitChecked,
                          ]}
                          onPress={() =>
                            toggleHabit(
                              habit.id,
                              day.date
                            )
                          }
                        >
                          {isDone && (
                            <Text
                              style={styles.habitCheckmark}
                            >
                              ✓
                            </Text>
                          )}
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}

            {habits.length === 0 && (
              <Text style={styles.emptyText}>
                Додай звички у налаштуваннях
              </Text>
            )}
          </View>
        </View>

        {/* Події на сьогодні */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Події на сьогодні
          </Text>
        </View>

        <View style={styles.list}>
          {todayEvents.length > 0 ? (
            todayEvents.map((event) => (
              <EventCard
                key={event.id}
                time={event.time}
                day="СЬОГОДНІ"
                color={event.color || '#A9C5E5'}
                title={event.title}
                description={event.description}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>
              На сьогодні подій немає
            </Text>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={(newTask) => {
          addTask(newTask);
          setModalVisible(false);
        }}
        selectedDate={todayString}
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

    greeting: {
      paddingHorizontal: 25,
      marginTop: 22,
      marginBottom: 25,
    },

    date: {
      fontSize: 13,
      color: c.mutedText,
      textTransform: 'capitalize',
    },

    title: {
      fontSize: 29,
      fontWeight: '700',
      color: c.text,
      marginTop: 8,
    },

    subtitle: {
      fontSize: 14,
      color: c.mutedText,
      marginTop: 7,
    },

    sectionHeader: {
      paddingHorizontal: 25,
      marginBottom: 13,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: c.text,
    },

    sectionSubtitle: {
      fontSize: 12,
      color: c.mutedText,
      marginTop: 5,
    },

    list: {
      paddingHorizontal: 20,
      gap: 9,
    },

    emptyText: {
      fontSize: 12,
      color: c.mutedText,
      paddingVertical: 10,
    },

    addButton: {
      backgroundColor: c.button,
      marginHorizontal: 20,
      marginTop: 15,
      marginBottom: 28,
      padding: 15,
      borderRadius: 13,
      alignItems: 'center',
    },

    addButtonText: {
      color: c.buttonText,
      fontSize: 13,
      fontWeight: '600',
    },

    dashboardRow: {
      marginHorizontal: 17,
      gap: 0,
    },

    dashboardRowWide: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 18,
    },

    weeklyColumn: {
      width: '100%',
    },

    dashboardColumnCard: {
      flex: 1,
      width: 0,
      marginHorizontal: 0,
    },

    weeklyCard: {
      backgroundColor: c.card,
      width: '100%',
      marginBottom: 14,
      borderRadius: 17,
      padding: 16,
    },

    weeklyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
      gap: 8,
    },

    weeklyHeaderText: {
      flex: 1,
    },

    weeklyHeaderActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },

    headerIconButton: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },

    headerIconText: {
      fontSize: 20,
      color: c.secondaryText,
    },

    weeklyTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: c.text,
    },

    weeklySubtitle: {
      fontSize: 11,
      color: c.mutedText,
      marginTop: 4,
    },

    weeklyAddButton: {
      alignSelf: 'flex-start',
      paddingVertical: 8,
      marginBottom: 8,
    },

    weeklyAdd: {
      fontSize: 12,
      color: c.secondaryText,
      fontWeight: '600',
    },

    weeklyForm: {
      backgroundColor: c.input,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
    },

    weeklyInput: {
      backgroundColor: c.card,
      borderRadius: 9,
      padding: 11,
      fontSize: 13,
      color: c.text,
      borderWidth: 1,
      borderColor: c.border,
    },

    formLabel: {
      fontSize: 11,
      color: c.secondaryText,
      marginTop: 12,
      marginBottom: 8,
    },

    dateOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },

    dateOption: {
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 8,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
    },

    dateSelected: {
      backgroundColor: c.button,
      borderColor: c.button,
    },

    dateOptionText: {
      fontSize: 11,
      color: c.secondaryText,
    },

    dateSelectedText: {
      color: c.buttonText,
      fontWeight: '600',
    },

    error: {
      color: '#D98C8C',
      fontSize: 11,
      marginTop: 8,
    },

    saveWeeklyButton: {
      backgroundColor: c.button,
      borderRadius: 9,
      padding: 11,
      alignItems: 'center',
      marginTop: 12,
    },

    saveWeeklyText: {
      color: c.buttonText,
      fontSize: 12,
      fontWeight: '600',
    },

    weeklyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: c.border,
      gap: 9,
    },

    weeklyCheckbox: {
      width: 19,
      height: 19,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: c.mutedText,
      alignItems: 'center',
      justifyContent: 'center',
    },

    weeklyCheckboxDone: {
      backgroundColor: c.button,
      borderColor: c.button,
    },

    weeklyCheckmark: {
      color: c.buttonText,
      fontSize: 11,
    },

    weeklyItemTitle: {
      flex: 1,
      fontSize: 12,
      color: c.text,
    },

    weeklyDoneText: {
      textDecorationLine: 'line-through',
      color: c.mutedText,
    },

    weeklyItemDate: {
      fontSize: 10,
      color: c.mutedText,
    },

    deleteItem: {
      paddingHorizontal: 4,
    },

    deleteText: {
      color: c.mutedText,
      fontSize: 18,
    },

    addBlockButton: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      padding: 15,
      alignItems: 'center',
      marginBottom: 18,
    },

    addBlockText: {
      color: c.text,
      fontSize: 12,
      fontWeight: '600',
    },

    blockForm: {
      backgroundColor: c.card,
      borderRadius: 14,
      padding: 15,
      marginBottom: 18,
    },

    blockFormTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: c.text,
      marginBottom: 12,
    },

    inlineEdit: {
      backgroundColor: c.input,
      padding: 12,
      borderRadius: 12,
      marginBottom: 12,
    },

    formActions: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 10,
    },

    formSaveButton: {
      flex: 1,
      backgroundColor: c.button,
      padding: 11,
      borderRadius: 9,
      alignItems: 'center',
    },

    formCancelButton: {
      flex: 1,
      backgroundColor: c.card,
      padding: 11,
      borderRadius: 9,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: c.border,
    },

    cancelText: {
      color: c.secondaryText,
      fontSize: 12,
      fontWeight: '600',
    },

    habitsCard: {
      backgroundColor: c.card,
      width: '100%',
      borderRadius: 16,
      padding: 15,
      marginBottom: 18,
    },

    habitsHeader: {
      marginBottom: 15,
    },

    habitWeekHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },

    habitNameSpacer: {
      width: 76,
    },

    habitDay: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    habitDayText: {
      fontSize: 10,
      color: c.mutedText,
    },

    currentDayText: {
      color: c.text,
      fontWeight: '700',
    },

    habitRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    },

    habitName: {
      width: 76,
      fontSize: 12,
      color: c.text,
    },

    habitChecks: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },

    habitCheck: {
      width: 22,
      height: 22,
      borderRadius: 7,
      backgroundColor: c.input,
      alignItems: 'center',
      justifyContent: 'center',
    },

    habitChecked: {
      backgroundColor: c.accent,
    },

    habitCheckmark: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '700',
    },

    bottomSpace: {
      height: 30,
    },
  });
}
