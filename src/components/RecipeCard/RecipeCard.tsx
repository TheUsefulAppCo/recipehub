import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { RecipeCard as RecipeCardType } from '../../types';

type RecipeCardProps = {
  recipe: RecipeCardType;
  onPress: () => void;
};

const RecipeCard = ({ recipe, onPress }: RecipeCardProps) => {
  // Helper function to format time
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

  // Map difficulty to user-friendly labels
  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
    };
    
    return labels[difficulty] || difficulty;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: recipe.imageUrl || 'https://via.placeholder.com/300' }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.overlay}>
        <Text style={styles.matchLabel}>
          {recipe.matchedIngredients} of {recipe.totalIngredients} ingredients
        </Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.name}
        </Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>⏱️</Text>
            <Text style={styles.detailText}>{formatTime(recipe.timeToCook)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>🔥</Text>
            <Text style={styles.detailText}>{getDifficultyLabel(recipe.difficulty)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>🍽️</Text>
            <Text style={styles.detailText}>{Math.round(recipe.caloriesPerServing)} cal</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 180,
  },
  overlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  matchLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
  },
});

export default RecipeCard;
