import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ingredient } from '../../types';

type IngredientCardProps = {
  ingredient: Ingredient;
  onRemove?: () => void;
  onPress?: () => void;
  selected?: boolean;
};

const IngredientCard = ({ 
  ingredient, 
  onRemove, 
  onPress,
  selected = false,
}: IngredientCardProps) => {
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        selected && styles.selectedContainer,
      ]}
      activeOpacity={0.7}
    >
      {ingredient.imageUrl ? (
        <Image
          source={{ uri: ingredient.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>
            {ingredient.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      
      <View style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {ingredient.name}
        </Text>
        
        {ingredient.quantity && ingredient.unit && (
          <Text style={styles.quantity}>
            {ingredient.quantity} {ingredient.unit}
          </Text>
        )}
      </View>
      
      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          style={styles.removeButton}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedContainer: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
    backgroundColor: '#FFF5F5',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  quantity: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff6b6b',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  removeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 22,
  },
});

export default IngredientCard;
