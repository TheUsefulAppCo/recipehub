import axios from 'axios';
import { Ingredient, RecipeCard, RecipeDetail, RecipeFilters, RecipeDifficulty } from '../types';

// arron: Add your Spoonacular API key here
const API_KEY = 'ff94b30f4e944a859574f277d5ad5d74';
const BASE_URL = 'https://api.spoonacular.com';

// Setup axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    apiKey: API_KEY,
  },
});

/**
 * Converts ingredient objects to a comma-separated string for API call
 */
const ingredientsToString = (ingredients: Ingredient[]): string => {
  return ingredients.map(ing => ing.name).join(',');
};

/**
 * Get recipes by ingredients
 */
export const getRecipesByIngredients = async (
  ingredients: Ingredient[],
  filters: RecipeFilters
): Promise<RecipeCard[]> => {
  try {
    // Initial search by ingredients
    const { data } = await api.get('/recipes/findByIngredients', {
      params: {
        ingredients: ingredientsToString(ingredients),
        number: 20, // Number of results to return
        ranking: 2, // Maximize used ingredients
        ignorePantry: true, // Ignore typical pantry items like salt, oil, etc.
      },
    });

    // Get additional recipe details to apply filters
    const recipeIds = data.map((recipe: any) => recipe.id).join(',');
    const { data: recipeDetails } = await api.get('/recipes/informationBulk', {
      params: {
        ids: recipeIds,
      },
    });

    // Map and filter according to user preferences
    const recipes = recipeDetails
      .filter((recipe: any) => {
        // Filter by dietary preferences
        if (filters.dietaryPreferences.length > 0 && 
            filters.dietaryPreferences[0] !== 'none') {
          const dietaryMatch = filters.dietaryPreferences.some(pref => {
            switch(pref) {
              case 'vegan': return recipe.vegan;
              case 'vegetarian': return recipe.vegetarian;
              case 'gluten-free': return recipe.glutenFree;
              case 'dairy-free': return recipe.dairyFree;
              case 'keto': return recipe.veryHealthy && recipe.veryPopular; // Approximation
              case 'paleo': return recipe.whole30 || recipe.veryHealthy; // Approximation
              case 'low-carb': return recipe.lowFodmap || (recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount < 20); // Approximation
              default: return true;
            }
          });
          if (!dietaryMatch) return false;
        }

        // Filter by time to cook if not 'any'
        if (filters.timeToCook !== 'any') {
          const maxTime = parseInt(filters.timeToCook.split(' ')[0]);
          if (recipe.readyInMinutes > maxTime) return false;
        }

        // Filter by difficulty if not 'any'
        if (filters.difficulty !== 'any') {
          // Determine difficulty based on number of steps and ingredients
          const complexityScore = 
            (recipe.extendedIngredients?.length || 0) + 
            (recipe.analyzedInstructions[0]?.steps?.length || 0);
          
          const recipeDifficulty = 
            complexityScore < 10 ? 'easy' : 
            complexityScore < 20 ? 'medium' : 'hard';
          
          if (filters.difficulty !== recipeDifficulty) return false;
        }

        // Filter by calorie limit if specified
        if (filters.calorieLimit) {
          const calories = recipe.nutrition?.nutrients?.find(
            (n: any) => n.name === 'Calories'
          )?.amount;
          
          if (calories && calories > filters.calorieLimit) return false;
        }

        return true;
      })
      .map((recipe: any) => {
        // Find the original data from findByIngredients to get matched ingredients
        const originalData = data.find((r: any) => r.id === recipe.id);
        
        // Calculate difficulty based on complexity
        const complexityScore = 
          (recipe.extendedIngredients?.length || 0) + 
          (recipe.analyzedInstructions[0]?.steps?.length || 0);
        
        const difficulty = 
          complexityScore < 10 ? 'easy' : 
          complexityScore < 20 ? 'medium' : 'hard';
        
        return {
          id: recipe.id,
          name: recipe.title,
          imageUrl: recipe.image,
          matchedIngredients: originalData?.usedIngredientCount || 0,
          totalIngredients: recipe.extendedIngredients?.length || 0,
          timeToCook: recipe.readyInMinutes,
          difficulty: difficulty as RecipeDifficulty,
          caloriesPerServing: recipe.nutrition?.nutrients?.find(
            (n: any) => n.name === 'Calories'
          )?.amount || 0,
        };
      });

    return recipes;
  } catch (error) {
    console.error('Error fetching recipes by ingredients:', error);
    throw error;
  }
};

/**
 * Get detailed recipe information by ID
 */
export const getRecipeById = async (recipeId: string): Promise<RecipeDetail> => {
  try {
    const { data } = await api.get(`/recipes/${recipeId}/information`, {
      params: {
        includeNutrition: true,
      },
    });

    // Calculate difficulty based on complexity
    const complexityScore = 
      (data.extendedIngredients?.length || 0) + 
      (data.analyzedInstructions[0]?.steps?.length || 0);
    
    const difficulty = 
      complexityScore < 10 ? 'easy' : 
      complexityScore < 20 ? 'medium' : 'hard';

    // Format ingredients
    const ingredients = data.extendedIngredients.map((ingredient: any) => ({
      id: ingredient.id.toString(),
      name: ingredient.originalName || ingredient.name,
      imageUrl: `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`,
      quantity: ingredient.amount.toString(),
      unit: ingredient.unit,
    }));

    // Format instructions
    const instructions = data.analyzedInstructions[0]?.steps.map(
      (step: any) => step.step
    ) || [];

    // Get calories per serving
    const caloriesPerServing = data.nutrition?.nutrients?.find(
      (n: any) => n.name === 'Calories'
    )?.amount || 0;

    return {
      id: data.id.toString(),
      name: data.title,
      imageUrl: data.image,
      timeToCook: data.readyInMinutes,
      prepTime: data.preparationMinutes > 0 ? data.preparationMinutes : Math.floor(data.readyInMinutes / 3),
      cookTime: data.cookingMinutes > 0 ? data.cookingMinutes : Math.floor(data.readyInMinutes * 2 / 3),
      difficulty,
      caloriesPerServing,
      servings: data.servings,
      ingredients,
      instructions,
      tags: data.dishTypes || [],
      dietaryInfo: {
        isVegan: data.vegan,
        isVegetarian: data.vegetarian,
        isGlutenFree: data.glutenFree,
        isDairyFree: data.dairyFree,
        isKeto: data.veryHealthy && data.veryPopular, // Approximation
        isPaleo: data.whole30 || data.veryHealthy, // Approximation
        isLowCarb: data.lowFodmap || (data.nutrition?.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount < 20), // Approximation
      },
    };
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
    throw error;
  }
};

/**
 * Search for ingredients by name/query
 */
export const searchIngredients = async (query: string): Promise<Ingredient[]> => {
  try {
    const { data } = await api.get('/food/ingredients/search', {
      params: {
        query,
        number: 10,
        metaInformation: true,
      },
    });

    return data.results.map((ingredient: any) => ({
      id: ingredient.id.toString(),
      name: ingredient.name,
      imageUrl: `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`,
    }));
  } catch (error) {
    console.error('Error searching ingredients:', error);
    throw error;
  }
};

/**
 * Get ingredient information by barcode/UPC
 */
export const getIngredientByBarcode = async (barcode: string): Promise<Ingredient | null> => {
  try {
    const { data } = await api.get('/food/products/upc/' + barcode);
    
    if (!data) return null;
    
    return {
      id: data.id.toString(),
      name: data.title,
      imageUrl: data.image,
    };
  } catch (error) {
    console.error('Error fetching ingredient by barcode:', error);
    return null;
  }
};
