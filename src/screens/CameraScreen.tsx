import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ingredient, RootStackParamList } from '../types';
import { getIngredients, saveIngredients } from '../utils/storage';
import Button from '../components/Button/Button';

type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Camera'>;

// For demo purposes - simulating the API for ingredient recognition from image
// In a real app, this would be replaced with actual API call to a service like 
// Google Cloud Vision API or a custom ML model
const recognizeIngredientsFromImage = async (imageUri: string): Promise<Ingredient[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock recognized ingredients
  const mockIngredients: Ingredient[] = [
    {
      id: `img-${Date.now()}-1`,
      name: 'Tomato',
      imageUrl: 'https://spoonacular.com/cdn/ingredients_100x100/tomato.png',
    },
    {
      id: `img-${Date.now()}-2`,
      name: 'Onion',
      imageUrl: 'https://spoonacular.com/cdn/ingredients_100x100/onion.png',
    },
  ];
  
  return mockIngredients;
};

const CameraScreen = () => {
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<'front' | 'back'>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<Camera>(null);

  // Request camera permissions on mount
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
      setIsCapturing(false);
    } catch (error) {
      console.error('Error taking picture:', error);
      setIsCapturing(false);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const switchCameraType = () => {
    setCameraType((current: 'front' | 'back') => 
      current === 'back' ? 'front' : 'back'
    );
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery. Please try again.');
    }
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;
    
    try {
      setIsAnalyzing(true);
      
      // arron: replace with actual API call to analyze image for ingredient recognition
      const recognizedIngredients = await recognizeIngredientsFromImage(capturedImage);
      
      if (recognizedIngredients.length > 0) {
        // Add recognized ingredients to the stored list
        const currentIngredients = getIngredients();
        
        // Filter out duplicates by name
        const newIngredients = [
          ...currentIngredients,
          ...recognizedIngredients.filter(
            newItem => !currentIngredients.some(
              existingItem => existingItem.name.toLowerCase() === newItem.name.toLowerCase()
            )
          ),
        ];
        
        saveIngredients(newIngredients);
        
        // Navigate back to ingredient input screen
        navigation.navigate('IngredientInput');
      } else {
        Alert.alert(
          'No Ingredients Found',
          'We couldn\'t identify any ingredients in this image. Please try again with a clearer photo.'
        );
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
  };

  const goBack = () => {
    navigation.goBack();
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera access is required to take photos of ingredients.
        </Text>
        <Button
          title="Go Back"
          onPress={goBack}
          type="primary"
          style={styles.permissionButton}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {capturedImage ? (
        // Show captured image preview
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: capturedImage }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          
          <View style={styles.previewActions}>
            <Button
              title="Retake"
              onPress={retakePicture}
              type="outline"
              style={styles.actionButton}
            />
            
            <Button
              title={isAnalyzing ? 'Analyzing...' : 'Identify Ingredients'}
              onPress={analyzeImage}
              type="primary"
              style={styles.actionButton}
              isLoading={isAnalyzing}
              disabled={isAnalyzing}
            />
          </View>
        </View>
      ) : (
        // Show camera view
        <View style={styles.cameraContainer}>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={cameraType}
            ratio="4:3"
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.cameraTopBar}>
                <TouchableOpacity
                  onPress={goBack}
                  style={styles.iconButton}
                >
                  <Text style={styles.iconText}>✕</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={switchCameraType}
                  style={styles.iconButton}
                >
                  <Text style={styles.iconText}>↺</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.cameraInstructions}>
                <Text style={styles.instructionText}>
                  Take a clear photo of your ingredients
                </Text>
              </View>
              
              <View style={styles.cameraBottomBar}>
                <TouchableOpacity
                  onPress={pickImageFromGallery}
                  style={styles.galleryButton}
                >
                  <Text style={styles.galleryButtonText}>Gallery</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={takePicture}
                  style={styles.captureButton}
                  disabled={isCapturing}
                >
                  {isCapturing ? (
                    <View style={styles.capturingIndicator} />
                  ) : (
                    <View style={styles.captureButtonInner} />
                  )}
                </TouchableOpacity>
                
                <View style={styles.placeholderButton} />
              </View>
            </View>
          </Camera>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    width: 200,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cameraTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  cameraInstructions: {
    alignItems: 'center',
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cameraBottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 20,
  },
  galleryButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  capturingIndicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B6B',
  },
  placeholderButton: {
    width: 70,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
  },
  previewActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default CameraScreen;
