
import { createContext, useContext, useState } from 'react';
import { initialTasks } from '../data/initialTasks';

const TasksContext = createContext();

const defaultHabits = [
  { id: '1', name: 'Кроки', records: {} },
  { id: '2', name: 'Читання', records: {} },
  { id: '3', name: 'Вода', records: {} },
];

const defaultWeeklyBlocks = [
  {
    id: 'university',
    title: 'УНІВЕРСИТЕТ',
    items: [],
  },
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [events, setEvents] = useState([]);
  const [habits, setHabits] = useState(defaultHabits);

  // Незалежні тижневі блоки
  const [weeklyBlocks, setWeeklyBlocks] = useState(defaultWeeklyBlocks);
  const [showWeeklyBlock, setShowWeeklyBlock] = useState(true);

  // Налаштування
  const [userName, setUserName] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Завдання
  const addTask = (newTask) => {
    setTasks((previous) => [...previous, newTask]);
  };

  const updateTask = (updatedTask) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === updatedTask.id
          ? { ...task, ...updatedTask }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );
  };

  const toggleTask = (id) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, done: !task.done }
          : task
      )
    );
  };

  // Події
  const addEvent = (newEvent) => {
    setEvents((previous) => [...previous, newEvent]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents((previous) =>
      previous.map((event) =>
        event.id === updatedEvent.id
          ? { ...event, ...updatedEvent }
          : event
      )
    );
  };

  const deleteEvent = (id) => {
    setEvents((previous) =>
      previous.filter((event) => event.id !== id)
    );
  };

  // Звички
  const addHabit = (name) => {
    if (!name?.trim()) return;

    setHabits((previous) => [
      ...previous,
      {
        id: createId(),
        name: name.trim(),
        records: {},
      },
    ]);
  };

  const updateHabit = (id, name) => {
    if (!name?.trim()) return;

    setHabits((previous) =>
      previous.map((habit) =>
        habit.id === id
          ? { ...habit, name: name.trim() }
          : habit
      )
    );
  };

  const deleteHabit = (id) => {
    setHabits((previous) =>
      previous.filter((habit) => habit.id !== id)
    );
  };

  const toggleHabit = (id, date) => {
    setHabits((previous) =>
      previous.map((habit) => {
        if (habit.id !== id) return habit;

        const records = { ...habit.records };

        if (records[date]) {
          delete records[date];
        } else {
          records[date] = true;
        }

        return { ...habit, records };
      })
    );
  };

  // Створити тижневий блок
  const addWeeklyBlock = (title) => {
    if (!title?.trim()) return;

    const newBlock = {
      id: createId(),
      title: title.trim(),
      items: [],
    };

    setWeeklyBlocks((previous) => [...previous, newBlock]);

    return newBlock;
  };

  // Перейменувати тижневий блок
  const updateWeeklyBlock = (id, title) => {
    if (!title?.trim()) return;

    setWeeklyBlocks((previous) =>
      previous.map((block) =>
        block.id === id
          ? { ...block, title: title.trim() }
          : block
      )
    );
  };

  // Видалити тижневий блок
  const deleteWeeklyBlock = (id) => {
    if (id === 'university') return;

    setWeeklyBlocks((previous) =>
      previous.filter((block) => block.id !== id)
    );
  };

  // Додати справу до конкретного блоку
  const addWeeklyItem = (item, blockId = 'university') => {
    if (!item?.title?.trim() || !item.date) return;

    const newItem = {
      id: createId(),
      title: item.title.trim(),
      date: item.date,
      done: false,
    };

    setWeeklyBlocks((previous) =>
      previous.map((block) =>
        block.id === blockId
          ? {
              ...block,
              items: [...block.items, newItem],
            }
          : block
      )
    );
  };

  // Позначити справу виконаною
  const toggleWeeklyItem = (id, blockId = 'university') => {
    setWeeklyBlocks((previous) =>
      previous.map((block) =>
        block.id === blockId
          ? {
              ...block,
              items: block.items.map((item) =>
                item.id === id
                  ? { ...item, done: !item.done }
                  : item
              ),
            }
          : block
      )
    );
  };

  // Видалити справу з блоку
  const deleteWeeklyItem = (id, blockId = 'university') => {
    setWeeklyBlocks((previous) =>
      previous.map((block) =>
        block.id === blockId
          ? {
              ...block,
              items: block.items.filter(
                (item) => item.id !== id
              ),
            }
          : block
      )
    );
  };

  // Сумісність зі старими компонентами
  const universityBlock = weeklyBlocks.find(
    (block) => block.id === 'university'
  );

  const weeklyItems = universityBlock?.items || [];
  const weeklyTitle = universityBlock?.title || 'УНІВЕРСИТЕТ';

  const setWeeklyTitle = (title) => {
    updateWeeklyBlock('university', title);
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        events,
        habits,

        weeklyBlocks,
        weeklyItems,
        weeklyTitle,
        showWeeklyBlock,

        userName,
        darkMode,
        notificationsEnabled,

        addTask,
        updateTask,
        deleteTask,
        toggleTask,

        addEvent,
        updateEvent,
        deleteEvent,

        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabit,

        addWeeklyBlock,
        updateWeeklyBlock,
        deleteWeeklyBlock,

        addWeeklyItem,
        toggleWeeklyItem,
        deleteWeeklyItem,

        setWeeklyTitle,
        setShowWeeklyBlock,

        setUserName,
        setDarkMode,
        setNotificationsEnabled,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}
