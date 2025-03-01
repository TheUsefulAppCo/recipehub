import { MMKV } from 'react-native-mmkv';
import { Ingredient, RecipeFilters, Recipe } from '../types';

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
 * Get all saved recipes as Recipe objects
 * Note: In a production environment, this would fetch the full recipe details 
 * from the API for each saved recipe ID
 */
export const getSavedRecipeDetails = async (): Promise<Recipe[]> => {
  try {
    const savedRecipeIds = getSavedRecipes();
    
    // In a real implementation, this would be an API call to fetch the recipes
    // For now we'll return mock data for the saved IDs
    // TODO: Replace with actual API calls in the future
    
    // Mock recipe data with different images and realistic information
    const mockRecipeTemplates = [
      {
        id: '715538',
        title: 'Maple-Glazed Bacon',
        image: 'https://spoonacular.com/recipeImages/715538-556x370.jpg',
        readyInMinutes: 25,
        servings: 2,
        sourceUrl: 'https://spoonacular.com/maple-glazed-bacon-715538',
        summary: 'Maple-Glazed Bacon is a side dish that serves 2. One serving contains 498 calories, 12g of protein, and 42g of fat.',
      },
      {
        id: '642605',
        title: 'Farro With Mushrooms and Asparagus',
        image: 'https://spoonacular.com/recipeImages/642605-556x370.jpg',
        readyInMinutes: 75,
        servings: 4,
        sourceUrl: 'https://spoonacular.com/farro-with-mushrooms-and-asparagus-642605',
        summary: 'Farro With Mushrooms and Asparagus is a main course that serves 4. One serving contains 202 calories, 8g of protein, and 4g of fat.',
      },
      {
        id: '642129',
        title: 'Easy Vegetable Beef Soup',
        image: 'https://spoonacular.com/recipeImages/642129-556x370.jpg',
        readyInMinutes: 150,
        servings: 8,
        sourceUrl: 'https://spoonacular.com/easy-vegetable-beef-soup-642129',
        summary: 'Easy Vegetable Beef Soup is a main course that serves 8. One serving contains 566 calories, 45g of protein, and 19g of fat.',
      },
      {
        id: '636325',
        title: 'Brussels Sprout Carbonara',
        image: 'https://spoonacular.com/recipeImages/636325-556x370.jpg',
        readyInMinutes: 45,
        servings: 2,
        sourceUrl: 'https://spoonacular.com/brussels-sprout-carbonara-636325',
        summary: 'Brussels Sprout Carbonara is a main course that serves 2. One serving contains 719 calories, 31g of protein, and 54g of fat.',
      },
      {
        id: '646651',
        title: 'Herb-Crusted Pork Loin',
        image: 'https://spoonacular.com/recipeImages/646651-556x370.jpg',
        readyInMinutes: 45,
        servings: 10,
        sourceUrl: 'https://spoonacular.com/herb-crusted-pork-loin-646651',
        summary: 'Herb-Crusted Pork Loin is a main course that serves 10. One serving contains 362 calories, 51g of protein, and 16g of fat.',
      }
    ];
    
    // Map saved recipe IDs to mock recipe data
    const mockRecipes: Recipe[] = savedRecipeIds.map((id, index) => {
      // Use the actual ID but get mock data from templates
      const mockTemplate = mockRecipeTemplates[index % mockRecipeTemplates.length];
      
      return {
        id: id, // Keep the original ID for navigation
        title: mockTemplate.title,
        image: mockTemplate.image,
        readyInMinutes: mockTemplate.readyInMinutes,
        servings: mockTemplate.servings,
        sourceUrl: mockTemplate.sourceUrl,
        summary: mockTemplate.summary,
        instructions: 'This is a mock recipe. In a production environment, detailed instructions would be fetched from the API.',
        extendedIngredients: [],
        diets: ['gluten free', 'dairy free'],
        vegetarian: index % 2 === 0,
        vegan: index % 3 === 0,
        glutenFree: true,
        dairyFree: index % 2 === 1,
      };
    });
    
    return mockRecipes;
  } catch (error) {
    console.error('Error getting saved recipe details:', error);
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
