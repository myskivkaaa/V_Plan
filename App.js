
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Navigation from './src/navigation/Navigation';
import { TasksProvider } from './src/context/TasksContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <TasksProvider>
        <StatusBar style="dark" />
        <Navigation />
      </TasksProvider>
    </SafeAreaProvider>
  );
}
