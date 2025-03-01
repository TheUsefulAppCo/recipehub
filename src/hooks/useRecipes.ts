import { useQuery } from '@tanstack/react-query';
import { 
  getRecipesByIngredients, 
  getRecipeById, 
  searchIngredients, 
  getIngredientByBarcode 
} from '../api/recipeService';
import { Ingredient, RecipeFilters } from '../types';

/**
 * Hook to get recipes based on ingredients and filters
 */
export const useRecipes = (ingredients: Ingredient[], filters: RecipeFilters) => {
  return useQuery({
    queryKey: ['recipes', ingredients, filters],
    queryFn: () => getRecipesByIngredients(ingredients, filters),
    enabled: ingredients.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get a single recipe by ID
 */
export const useRecipe = (recipeId: string) => {
  return useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipeById(recipeId),
    enabled: !!recipeId,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Hook to search for ingredients
 */
export const useIngredientSearch = (query: string) => {
  return useQuery({
    queryKey: ['ingredients', query],
    queryFn: () => searchIngredients(query),
    enabled: query.length > 2, // Only search when query is at least 3 characters
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to get ingredient by barcode
 */
export const useIngredientByBarcode = (barcode: string) => {
  return useQuery({
    queryKey: ['ingredient', barcode],
    queryFn: () => getIngredientByBarcode(barcode),
    enabled: !!barcode,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
