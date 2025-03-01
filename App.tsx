import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppNavigation from './src/navigation/AppNavigation';
import { Platform } from 'react-native';

// Create a client for TanStack Query
const queryClient = new QueryClient();

export default function App() {
  // Initialize MMKV
  useEffect(() => {
    // Any MMKV initialization can be done here if needed
    // This is a good place to handle migration from AsyncStorage if necessary
    console.log(`RecipeHub app initialized on ${Platform.OS}`);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AppNavigation />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
