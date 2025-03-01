import { MMKV } from 'react-native-mmkv';
import { Ingredient, RecipeFilters } from '../types';

// Initialize MMKV storage with explicit ID and path
export const storage = new MMKV({
  id: 'recipehub-storage',
});

// Storage keys
const KEYS = {
  INGREDIENTS: 'ingredients',
  FILTERS: 'filters',
  SAVED_RECIPES: 'saved_recipes',
  RECENT_SEARCHES: 'recent_searches',
};

/**
 * Save ingredients to MMKV
 */
export const saveIngredients = (ingredients: Ingredient[]): void => {
  try {
    storage.set(KEYS.INGREDIENTS, JSON.stringify(ingredients));
  } catch (error) {
    console.error('Error saving ingredients:', error);
  }
};

/**
 * Get saved ingredients from MMKV
 */
export const getIngredients = (): Ingredient[] => {
  try {
    const data = storage.getString(KEYS.INGREDIENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting ingredients:', error);
    return [];
  }
};

/**
 * Save recipe filters to MMKV
 */
export const saveFilters = (filters: RecipeFilters): void => {
  try {
    storage.set(KEYS.FILTERS, JSON.stringify(filters));
  } catch (error) {
    console.error('Error saving filters:', error);
  }
};

/**
 * Get saved recipe filters from MMKV
 */
export const getFilters = (): RecipeFilters | null => {
  try {
    const data = storage.getString(KEYS.FILTERS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting filters:', error);
    return null;
  }
};

/**
 * Save recipe ID to favorites
 */
export const saveRecipe = (recipeId: string): void => {
  try {
    const savedRecipes = getSavedRecipes();
    if (!savedRecipes.includes(recipeId)) {
      savedRecipes.push(recipeId);
      storage.set(KEYS.SAVED_RECIPES, JSON.stringify(savedRecipes));
    }
  } catch (error) {
    console.error('Error saving recipe:', error);
  }
};

/**
 * Remove recipe ID from favorites
 */
export const removeRecipe = (recipeId: string): void => {
  try {
    const savedRecipes = getSavedRecipes();
    const updatedRecipes = savedRecipes.filter(id => id !== recipeId);
    storage.set(KEYS.SAVED_RECIPES, JSON.stringify(updatedRecipes));
  } catch (error) {
    console.error('Error removing recipe:', error);
  }
};

/**
 * Get all saved recipe IDs
 */
export const getSavedRecipes = (): string[] => {
  try {
    const data = storage.getString(KEYS.SAVED_RECIPES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting saved recipes:', error);
    return [];
  }
};

/**
 * Check if a recipe is saved
 */
export const isRecipeSaved = (recipeId: string): boolean => {
  try {
    const savedRecipes = getSavedRecipes();
    return savedRecipes.includes(recipeId);
  } catch (error) {
    console.error('Error checking if recipe is saved:', error);
    return false;
  }
};

/**
 * Save a search query to recent searches
 */
export const saveRecentSearch = (query: string): void => {
  try {
    const recentSearches = getRecentSearches();
    
    // Remove if exists and add to beginning
    const updatedSearches = [
      query,
      ...recentSearches.filter(q => q !== query),
    ].slice(0, 10); // Keep only the 10 most recent
    
    storage.set(KEYS.RECENT_SEARCHES, JSON.stringify(updatedSearches));
  } catch (error) {
    console.error('Error saving recent search:', error);
  }
};

/**
 * Get recent searches
 */
export const getRecentSearches = (): string[] => {
  try {
    const data = storage.getString(KEYS.RECENT_SEARCHES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting recent searches:', error);
    return [];
  }
};

/**
 * Clear recent searches
 */
export const clearRecentSearches = (): void => {
  try {
    storage.delete(KEYS.RECENT_SEARCHES);
  } catch (error) {
    console.error('Error clearing recent searches:', error);
  }
};
