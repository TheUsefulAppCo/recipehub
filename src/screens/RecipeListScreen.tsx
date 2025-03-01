import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRecipes } from '../hooks/useRecipes';
import { RootStackParamList } from '../types';
import RecipeCard from '../components/RecipeCard/RecipeCard';

type RecipeListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RecipeList'
>;

type RecipeListScreenRouteProp = RouteProp<RootStackParamList, 'RecipeList'>;

const RecipeListScreen = () => {
  const navigation = useNavigation<RecipeListScreenNavigationProp>();
  const route = useRoute<RecipeListScreenRouteProp>();
  const { ingredients, filters } = route.params;

  // TanStack Query for recipes
  const {
    data: recipes,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useRecipes(ingredients, filters);

  const handleRecipePress = (recipeId: string) => {
    navigation.navigate('RecipeDetail', { recipeId });
  };

  const handleRefresh = () => {
    refetch();
  };

  const renderRecipeItem = ({ item }: { item: any }) => (
    <RecipeCard recipe={item} onPress={() => handleRecipePress(item.id)} />
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Finding recipes...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorText}>
          {error instanceof Error 
            ? error.message 
            : 'Something went wrong while fetching recipes.'}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => refetch()}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noRecipesTitle}>No Recipes Found</Text>
        <Text style={styles.noRecipesText}>
          We couldn't find any recipes that match your ingredients and preferences.
          Try adding more ingredients or adjusting your filters.
        </Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.actionButtonText}>Adjust Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('IngredientInput')}
        >
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
            Add More Ingredients
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.resultCount}>
            {recipes.length} {recipes.length === 1 ? 'Recipe' : 'Recipes'} Found
          </Text>
          <Text style={styles.subtitle}>
            Based on {ingredients.length} {ingredients.length === 1 ? 'ingredient' : 'ingredients'}
          </Text>
        </View>

        <FlatList
          data={recipes}
          renderItem={renderRecipeItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.recipesList}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              colors={['#FF6B6B']}
              tintColor="#FF6B6B"
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  header: {
    marginBottom: 16,
  },
  resultCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  recipesList: {
    paddingBottom: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  noRecipesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  noRecipesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  secondaryButtonText: {
    color: '#FF6B6B',
  },
});

export default RecipeListScreen;
