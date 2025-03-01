// Recipe Filter/Preference Types
export type DietaryPreference = 
  | 'vegan' 
  | 'vegetarian' 
  | 'gluten-free' 
  | 'dairy-free' 
  | 'keto' 
  | 'paleo' 
  | 'low-carb'
  | 'none';

export type TimeToCook = 
  | '15 min or less' 
  | '30 min or less' 
  | '45 min or less' 
  | '1 hour or less'
  | 'any';

export type RecipeDifficulty = 
  | 'easy' 
  | 'medium' 
  | 'hard'
  | 'any';

export type RecipeFilters = {
  dietaryPreferences: DietaryPreference[];
  timeToCook: TimeToCook;
  difficulty: RecipeDifficulty;
  servings: number;
  calorieLimit: number | null;
};

// Ingredient Types
export type Ingredient = {
  id: string;
  name: string;
  imageUrl?: string;
  quantity?: string;
  unit?: string;
};

// Recipe Types
export type RecipeCard = {
  id: string;
  name: string;
  imageUrl: string;
  matchedIngredients: number;
  totalIngredients: number;
  timeToCook: number; // in minutes
  difficulty: RecipeDifficulty;
  caloriesPerServing: number;
};

export type RecipeDetail = {
  id: string;
  name: string;
  imageUrl: string;
  timeToCook: number; // in minutes
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  difficulty: RecipeDifficulty;
  caloriesPerServing: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[];
  dietaryInfo: {
    isVegan: boolean;
    isVegetarian: boolean;
    isGlutenFree: boolean;
    isDairyFree: boolean;
    isKeto: boolean;
    isPaleo: boolean;
    isLowCarb: boolean;
  };
};

// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  IngredientInput: undefined;
  RecipeFilters: undefined;
  RecipeList: { ingredients: Ingredient[], filters: RecipeFilters };
  RecipeDetail: { recipeId: string };
  Camera: undefined;
  BarcodeScanner: undefined;
};
