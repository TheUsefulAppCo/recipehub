import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Slider from '@react-native-community/slider';
import Button from '../components/Button/Button';
import { 
  DietaryPreference, 
  TimeToCook, 
  RecipeDifficulty, 
  RecipeFilters, 
  RootStackParamList 
} from '../types';
import { getFilters, saveFilters, getIngredients } from '../utils/storage';

type RecipeFiltersScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RecipeFilters'
>;

const RecipeFiltersScreen = () => {
  const navigation = useNavigation<RecipeFiltersScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<RecipeFilters>({
    dietaryPreferences: ['none'],
    timeToCook: 'any',
    difficulty: 'any',
    servings: 2,
    calorieLimit: null,
  });

  // Available options
  const dietaryOptions: DietaryPreference[] = [
    'none',
    'vegan',
    'vegetarian',
    'gluten-free',
    'dairy-free',
    'keto',
    'paleo',
    'low-carb',
  ];
  
  const timeOptions: TimeToCook[] = [
    'any',
    '15 min or less',
    '30 min or less',
    '45 min or less',
    '1 hour or less',
  ];
  
  const difficultyOptions: RecipeDifficulty[] = [
    'any',
    'easy',
    'medium',
    'hard',
  ];

  // Load saved filters on mount
  useEffect(() => {
    const loadSavedFilters = async () => {
      try {
        const savedFilters = getFilters();
        if (savedFilters) {
          setFilters(savedFilters);
        }
      } catch (error) {
        console.error('Error loading filters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedFilters();
  }, []);

  // Save filters when they change
  useEffect(() => {
    if (!isLoading) {
      saveFilters(filters);
    }
  }, [filters, isLoading]);

  const handleDietaryPreferenceToggle = (preference: DietaryPreference) => {
    if (preference === 'none') {
      setFilters(prev => ({
        ...prev,
        dietaryPreferences: ['none'],
      }));
      return;
    }

    setFilters(prev => {
      // If none is currently selected, remove it
      const updatedPreferences = prev.dietaryPreferences.filter(p => p !== 'none');
      
      // Toggle the selected preference
      if (updatedPreferences.includes(preference)) {
        updatedPreferences.splice(updatedPreferences.indexOf(preference), 1);
      } else {
        updatedPreferences.push(preference);
      }

      // If no options selected, add 'none'
      if (updatedPreferences.length === 0) {
        updatedPreferences.push('none' as DietaryPreference);
      }

      return {
        ...prev,
        dietaryPreferences: updatedPreferences,
      };
    });
  };

  const handleTimeSelection = (time: TimeToCook) => {
    setFilters(prev => ({
      ...prev,
      timeToCook: time,
    }));
  };

  const handleDifficultySelection = (difficulty: RecipeDifficulty) => {
    setFilters(prev => ({
      ...prev,
      difficulty,
    }));
  };

  const handleServingsChange = (value: number) => {
    setFilters(prev => ({
      ...prev,
      servings: value,
    }));
  };

  const handleCalorieLimitToggle = (enabled: boolean) => {
    setFilters(prev => ({
      ...prev,
      calorieLimit: enabled ? 500 : null,
    }));
  };

  const handleCalorieLimitChange = (value: number) => {
    setFilters(prev => ({
      ...prev,
      calorieLimit: value,
    }));
  };

  const handleSearch = async () => {
    const ingredients = getIngredients();
    
    navigation.navigate('RecipeList', {
      ingredients,
      filters,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Recipe Preferences</Text>
          <Text style={styles.subtitle}>
            Customize your recipe search to find the perfect match
          </Text>
        </View>

        {/* Dietary Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dietary Preferences</Text>
          <Text style={styles.sectionSubtitle}>
            Select all that apply
          </Text>
          
          <View style={styles.optionsGrid}>
            {dietaryOptions.map(preference => (
              <TouchableOpacity
                key={preference}
                style={[
                  styles.dietaryOption,
                  filters.dietaryPreferences.includes(preference) && styles.selectedOption,
                ]}
                onPress={() => handleDietaryPreferenceToggle(preference)}
              >
                <Text
                  style={[
                    styles.optionText,
                    filters.dietaryPreferences.includes(preference) && styles.selectedOptionText,
                  ]}
                >
                  {preference === 'none' ? 'No Preference' : preference}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time to Cook */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time to Cook</Text>
          <Text style={styles.sectionSubtitle}>
            How much time do you have?
          </Text>
          
          <View style={styles.optionsVertical}>
            {timeOptions.map(time => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeOption,
                  filters.timeToCook === time && styles.selectedOption,
                ]}
                onPress={() => handleTimeSelection(time)}
              >
                <Text
                  style={[
                    styles.optionText,
                    filters.timeToCook === time && styles.selectedOptionText,
                  ]}
                >
                  {time === 'any' ? 'Any Time' : time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Difficulty */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipe Difficulty</Text>
          <Text style={styles.sectionSubtitle}>
            Select your preferred difficulty level
          </Text>
          
          <View style={styles.optionsRow}>
            {difficultyOptions.map(difficulty => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.difficultyOption,
                  filters.difficulty === difficulty && styles.selectedOption,
                ]}
                onPress={() => handleDifficultySelection(difficulty)}
              >
                <Text
                  style={[
                    styles.optionText,
                    filters.difficulty === difficulty && styles.selectedOptionText,
                  ]}
                >
                  {difficulty === 'any' ? 'Any' : difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Servings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Number of Servings</Text>
          <Text style={styles.sectionSubtitle}>
            How many people are you cooking for?
          </Text>
          
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={filters.servings}
              onValueChange={handleServingsChange}
              minimumTrackTintColor="#FF6B6B"
              maximumTrackTintColor="#D1D1D1"
              thumbTintColor="#FF6B6B"
            />
            
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderValue}>{filters.servings}</Text>
              <Text style={styles.sliderLabel}>
                {filters.servings === 1 ? 'Person' : 'People'}
              </Text>
            </View>
          </View>
        </View>

        {/* Calorie Limit */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Calorie Limit</Text>
            <Switch
              value={filters.calorieLimit !== null}
              onValueChange={handleCalorieLimitToggle}
              trackColor={{ false: '#D1D1D1', true: '#FF6B6B' }}
              ios_backgroundColor="#D1D1D1"
            />
          </View>
          
          {filters.calorieLimit !== null && (
            <>
              <Text style={styles.sectionSubtitle}>
                Maximum calories per serving
              </Text>
              
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={100}
                  maximumValue={1500}
                  step={50}
                  value={filters.calorieLimit}
                  onValueChange={handleCalorieLimitChange}
                  minimumTrackTintColor="#FF6B6B"
                  maximumTrackTintColor="#D1D1D1"
                  thumbTintColor="#FF6B6B"
                />
                
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderValue}>{filters.calorieLimit}</Text>
                  <Text style={styles.sliderLabel}>calories</Text>
                </View>
              </View>
            </>
          )}
        </View>

        <Button
          title="Find Recipes"
          onPress={handleSearch}
          type="primary"
          fullWidth
          size="large"
          style={styles.searchButton}
        />
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
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionsVertical: {
    flexDirection: 'column',
  },
  dietaryOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  timeOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  difficultyOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    textTransform: 'capitalize',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '500',
  },
  sliderContainer: {
    marginVertical: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginRight: 6,
  },
  sliderLabel: {
    fontSize: 16,
    color: '#666',
  },
  searchButton: {
    marginTop: 8,
    marginBottom: 40,
  },
});

export default RecipeFiltersScreen;
