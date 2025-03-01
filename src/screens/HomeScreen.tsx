import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import Button from '../components/Button/Button';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>RecipeHub</Text>
          <Text style={styles.subtitle}>
            Discover recipes from ingredients in your kitchen
          </Text>
        </View>

        <Image
          style={styles.heroImage}
          source={{ uri: 'https://images.unsplash.com/photo-1505935428862-770b6f24f629?q=80&w=1000&auto=format&fit=crop' }}
          resizeMode="cover"
        />

        <View style={styles.actionContainer}>
          <Button
            title="Find Recipes by Ingredients"
            onPress={() => navigation.navigate('IngredientInput')}
            type="primary"
            fullWidth
            size="large"
          />
          
          <Button
            title="View Saved Recipes"
            onPress={() => navigation.navigate('SavedRecipes')}
            type="secondary"
            fullWidth
            size="large"
            style={styles.savedRecipesButton}
          />
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <View style={styles.quickActionContainer}>
            <TouchableOpacity 
              style={[styles.quickActionButton, styles.disabledButton]}
              onPress={() => Alert.alert('Coming Soon', 'Camera functionality will be available in a future update.')}
            >
              <Text style={styles.quickActionIcon}>📸</Text>
              <Text style={styles.quickActionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionButton, styles.disabledButton]}
              onPress={() => Alert.alert('Coming Soon', 'Barcode scanning will be available in a future update.')}
            >
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionText}>Scan Barcode</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>What You Can Do</Text>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔍</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Find Recipes</Text>
              <Text style={styles.featureDescription}>
                Enter ingredients you have and discover recipes
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🍽️</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Dietary Preferences</Text>
              <Text style={styles.featureDescription}>
                Find recipes that match your dietary needs
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⏱️</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Time Control</Text>
              <Text style={styles.featureDescription}>
                Filter recipes by preparation time
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📱</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Multiple Inputs</Text>
              <Text style={styles.featureDescription}>
                Add ingredients by camera, barcode, or text
              </Text>
            </View>
          </View>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginBottom: 24,
  },
  actionContainer: {
    marginBottom: 32,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#999999',
  },
  quickActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    width: '45%',
  },
  disabledButton: {
    opacity: 0.7,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  featuresContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666666',
  },
  savedRecipesButton: {
    marginTop: 12,
    marginBottom: 16,
  },
});

export default HomeScreen;
