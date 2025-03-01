import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import IngredientInputScreen from '../screens/IngredientInputScreen';
import RecipeFiltersScreen from '../screens/RecipeFiltersScreen';
import RecipeListScreen from '../screens/RecipeListScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import SavedRecipesScreen from '../screens/SavedRecipesScreen';
// Import native modules screens - commented out for initial testing
// import CameraScreen from '../screens/CameraScreen';
// import BarcodeScannerScreen from '../screens/BarcodeScannerScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FF6B6B',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          cardStyle: { backgroundColor: '#f8f9fa' },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="IngredientInput" 
          component={IngredientInputScreen} 
          options={{ title: 'Enter Ingredients' }} 
        />
        <Stack.Screen 
          name="RecipeFilters" 
          component={RecipeFiltersScreen} 
          options={{ title: 'Set Preferences' }} 
        />
        <Stack.Screen 
          name="RecipeList" 
          component={RecipeListScreen} 
          options={{ title: 'Recipes' }} 
        />
        <Stack.Screen 
          name="RecipeDetail" 
          component={RecipeDetailScreen} 
          options={({ route }) => ({ title: 'Recipe Details' })} 
        />
        <Stack.Screen 
          name="SavedRecipes" 
          component={SavedRecipesScreen} 
          options={{ title: 'Saved Recipes' }} 
        />
        {/* Temporarily comment out native module screens for initial testing
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen} 
          options={{ title: 'Take a Photo', headerShown: false }} 
        />
        <Stack.Screen 
          name="BarcodeScanner" 
          component={BarcodeScannerScreen} 
          options={{ title: 'Scan Barcode', headerShown: false }} 
        />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
