import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Share,
  useWindowDimensions,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useRecipe } from '../hooks/useRecipes';
import { RootStackParamList } from '../types';
import IngredientCard from '../components/IngredientCard/IngredientCard';
import { isRecipeSaved, saveRecipe, removeRecipe } from '../utils/storage';

type RecipeDetailScreenRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;

const RecipeDetailScreen = () => {
  const route = useRoute<RecipeDetailScreenRouteProp>();
  const { recipeId } = route.params;
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');

  // TanStack Query for recipe details
  const {
    data: recipe,
    isLoading,
    isError,
    error,
    refetch,
  } = useRecipe(recipeId);

  // Check if recipe is saved
  useEffect(() => {
    const checkSavedStatus = async () => {
      const saved = isRecipeSaved(recipeId);
      setIsSaved(saved);
    };

    checkSavedStatus();
  }, [recipeId]);

  // Handle save/unsave recipe
  const handleToggleSave = async () => {
    if (isSaved) {
      removeRecipe(recipeId);
    } else {
      saveRecipe(recipeId);
    }
    setIsSaved(!isSaved);
  };

  // Handle share recipe
  const handleShare = async () => {
    if (!recipe) return;

    try {
      await Share.share({
        message: `Check out this recipe for ${recipe.name} that I found on RecipeHub!`,
        // If you have a web version, you could include a URL here
      });
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading recipe...</Text>
      </View>
    );
  }

  if (isError || !recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorText}>
          {error instanceof Error 
            ? error.message 
            : 'Failed to load recipe details. Please try again.'}
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

  // Format time for display
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (mins === 0) {
      return `${hours} hr`;
    }
    
    return `${hours} hr ${mins} min`;
  };

  // Get difficulty label
  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
    };
    
    return labels[difficulty] || difficulty;
  };

  // Get dietary tags
  const getDietaryTags = () => {
    const tags = [];
    
    if (recipe.dietaryInfo.isVegan) tags.push('Vegan');
    if (recipe.dietaryInfo.isVegetarian) tags.push('Vegetarian');
    if (recipe.dietaryInfo.isGlutenFree) tags.push('Gluten-Free');
    if (recipe.dietaryInfo.isDairyFree) tags.push('Dairy-Free');
    if (recipe.dietaryInfo.isKeto) tags.push('Keto');
    if (recipe.dietaryInfo.isPaleo) tags.push('Paleo');
    if (recipe.dietaryInfo.isLowCarb) tags.push('Low-Carb');
    
    return tags;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Recipe Image and Actions */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: recipe.imageUrl || 'https://via.placeholder.com/400' }}
            style={styles.recipeImage}
            resizeMode="cover"
          />
          
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleToggleSave}
            >
              <Text style={styles.actionButtonIcon}>
                {isSaved ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Text style={styles.actionButtonIcon}>↗️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recipe Title and Info */}
        <View style={styles.recipeInfoContainer}>
          <Text style={styles.recipeTitle}>{recipe.name}</Text>
          
          <View style={styles.tagContainer}>
            {getDietaryTags().map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailBox}>
              <Text style={styles.detailIcon}>⏱️</Text>
              <Text style={styles.detailLabel}>Total Time</Text>
              <Text style={styles.detailValue}>{formatTime(recipe.timeToCook)}</Text>
            </View>
            
            <View style={styles.detailBox}>
              <Text style={styles.detailIcon}>🍽️</Text>
              <Text style={styles.detailLabel}>Calories</Text>
              <Text style={styles.detailValue}>{Math.round(recipe.caloriesPerServing)}</Text>
            </View>
            
            <View style={styles.detailBox}>
              <Text style={styles.detailIcon}>👨‍🍳</Text>
              <Text style={styles.detailLabel}>Difficulty</Text>
              <Text style={styles.detailValue}>{getDifficultyLabel(recipe.difficulty)}</Text>
            </View>
            
            <View style={styles.detailBox}>
              <Text style={styles.detailIcon}>👥</Text>
              <Text style={styles.detailLabel}>Servings</Text>
              <Text style={styles.detailValue}>{recipe.servings}</Text>
            </View>
          </View>
          
          <View style={styles.timeBreakdownContainer}>
            <View style={styles.timeBreakdownItem}>
              <Text style={styles.timeBreakdownLabel}>Prep Time</Text>
              <Text style={styles.timeBreakdownValue}>{formatTime(recipe.prepTime)}</Text>
            </View>
            
            <View style={styles.timeBreakdownDivider} />
            
            <View style={styles.timeBreakdownItem}>
              <Text style={styles.timeBreakdownLabel}>Cook Time</Text>
              <Text style={styles.timeBreakdownValue}>{formatTime(recipe.cookTime)}</Text>
            </View>
          </View>
        </View>

        {/* Tabs for Ingredients and Instructions */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'ingredients' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('ingredients')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'ingredients' && styles.activeTabText,
              ]}
            >
              Ingredients
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'instructions' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('instructions')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'instructions' && styles.activeTabText,
              ]}
            >
              Instructions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContentContainer}>
          {activeTab === 'ingredients' ? (
            <View style={styles.ingredientsContainer}>
              <Text style={styles.sectionTitle}>
                Ingredients for {recipe.servings} {recipe.servings === 1 ? 'serving' : 'servings'}
              </Text>
              
              {recipe.ingredients.map((ingredient, index) => (
                <IngredientCard
                  key={`${ingredient.id}-${index}`}
                  ingredient={ingredient}
                />
              ))}
            </View>
          ) : (
            <View style={styles.instructionsContainer}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              
              {recipe.instructions.map((step, index) => (
                <View key={index} style={styles.instructionStep}>
                  <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
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
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  actionButtonsContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  actionButtonIcon: {
    fontSize: 20,
  },
  recipeInfoContainer: {
    padding: 20,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#EAFBF7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailBox: {
    width: '48%',
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeBreakdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    marginTop: 8,
  },
  timeBreakdownItem: {
    alignItems: 'center',
  },
  timeBreakdownDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#FFCECE',
  },
  timeBreakdownLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timeBreakdownValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#FF6B6B',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FF6B6B',
    fontWeight: '700',
  },
  tabContentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  ingredientsContainer: {},
  instructionsContainer: {},
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});

export default RecipeDetailScreen;
