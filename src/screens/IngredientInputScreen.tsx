import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useIngredientSearch } from '../hooks/useRecipes';
import { Ingredient, RootStackParamList } from '../types';
import Button from '../components/Button/Button';
import IngredientCard from '../components/IngredientCard/IngredientCard';
import { getIngredients, saveIngredients } from '../utils/mockstorage';

type IngredientInputScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'IngredientInput'
>;

const IngredientInputScreen = () => {
  const navigation = useNavigation<IngredientInputScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // TanStack Query for ingredient search
  const {
    data: searchResults,
    isLoading: isSearching,
    refetch,
  } = useIngredientSearch(searchQuery);

  // Load saved ingredients on mount
  useEffect(() => {
    const loadSavedIngredients = async () => {
      try {
        const ingredients = getIngredients();
        setSelectedIngredients(ingredients);
      } catch (error) {
        console.error('Error loading ingredients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedIngredients();
  }, []);

  // Save ingredients when they change
  useEffect(() => {
    if (!isLoading) {
      saveIngredients(selectedIngredients);
    }
  }, [selectedIngredients, isLoading]);

  const handleAddIngredient = (ingredient: Ingredient) => {
    if (!selectedIngredients.some(item => item.id === ingredient.id)) {
      setSelectedIngredients(prev => [...prev, ingredient]);
      setSearchQuery('');
    }
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    setSelectedIngredients(prev => 
      prev.filter(ingredient => ingredient.id !== ingredientId)
    );
  };

  const handleManualAdd = () => {
    if (searchQuery.trim()) {
      const newIngredient: Ingredient = {
        id: `manual-${Date.now()}`,
        name: searchQuery.trim(),
      };
      
      setSelectedIngredients(prev => [...prev, newIngredient]);
      setSearchQuery('');
    }
  };

  const handleContinue = () => {
    navigation.navigate('RecipeFilters');
  };

  const renderIngredientItem = ({ item }: { item: Ingredient }) => (
    <IngredientCard
      ingredient={item}
      onRemove={() => handleRemoveIngredient(item.id)}
    />
  );

  const renderSearchResultItem = ({ item }: { item: Ingredient }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => handleAddIngredient(item)}
    >
      <Text style={styles.searchResultName}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <View style={styles.header}>
          <Text style={styles.title}>What's in your kitchen?</Text>
          <Text style={styles.subtitle}>
            Add the ingredients you have, and we'll find recipes for you
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for an ingredient..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={() => refetch()}
          />
          
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.addManualButton}
              onPress={handleManualAdd}
            >
              <Text style={styles.addManualButtonText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results */}
        {searchQuery.length > 0 && (
          <View style={styles.searchResultsContainer}>
            {isSearching ? (
              <ActivityIndicator size="small" color="#FF6B6B" />
            ) : (
              <>
                {searchResults && searchResults.length > 0 ? (
                  <FlatList
                    data={searchResults.slice(0, 5)}
                    renderItem={renderSearchResultItem}
                    keyExtractor={item => item.id}
                    style={styles.searchResultsList}
                  />
                ) : (
                  <Text style={styles.noResults}>
                    No ingredients found. Try a different search term or tap "Add" to add manually.
                  </Text>
                )}
              </>
            )}
          </View>
        )}

        <View style={styles.divider} />

        {/* Selected Ingredients */}
        <Text style={styles.sectionTitle}>
          Selected Ingredients ({selectedIngredients.length})
        </Text>
        
        {selectedIngredients.length > 0 ? (
          <FlatList
            data={selectedIngredients}
            renderItem={renderIngredientItem}
            keyExtractor={item => item.id}
            style={styles.ingredientsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No ingredients added yet. Search and add ingredients above.
            </Text>
          </View>
        )}

        <View style={styles.buttonsContainer}>
          <Button
            title="Add from Camera"
            onPress={() => Alert.alert('Coming Soon', 'Camera functionality will be available in a future update.')}
            type="outline"
            style={styles.cameraButton}
            disabled={true}
          />
          
          <Button
            title="Scan Barcode"
            onPress={() => Alert.alert('Coming Soon', 'Barcode scanning will be available in a future update.')}
            type="outline"
            style={styles.scanButton}
            disabled={true}
          />
        </View>

        <Button
          title="Continue to Preferences"
          onPress={handleContinue}
          fullWidth
          disabled={selectedIngredients.length === 0}
        />
      </KeyboardAvoidingView>
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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  addManualButton: {
    marginLeft: 12,
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addManualButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  searchResultsContainer: {
    marginBottom: 16,
  },
  searchResultsList: {
    maxHeight: 200,
  },
  searchResultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchResultName: {
    fontSize: 16,
    color: '#333',
  },
  noResults: {
    padding: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  ingredientsList: {
    flex: 1,
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  cameraButton: {
    flex: 1,
    marginRight: 8,
  },
  scanButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default IngredientInputScreen;
