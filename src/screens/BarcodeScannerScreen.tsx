import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Ingredient } from '../types';
import { getIngredients, saveIngredients } from '../utils/mockstorage';
import Button from '../components/Button/Button';

type BarcodeScannerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BarcodeScanner'
>;

// For demo purposes - simulating API lookup for ingredient based on barcode
// In a real app, this would call an actual product database API
const getIngredientFromBarcode = async (barcode: string): Promise<Ingredient | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock barcode to ingredient mapping
  const mockBarcodeDatabase: Record<string, Ingredient> = {
    '8901072000156': {
      id: 'barcode-spice-1',
      name: 'Turmeric Powder',
      imageUrl: 'https://spoonacular.com/cdn/ingredients_100x100/turmeric.jpg',
    },
    '8410179000039': {
      id: 'barcode-oil-1',
      name: 'Olive Oil',
      imageUrl: 'https://spoonacular.com/cdn/ingredients_100x100/olive-oil.jpg',
    },
    '5000157024466': {
      id: 'barcode-sauce-1',
      name: 'Tomato Sauce',
      imageUrl: 'https://spoonacular.com/cdn/ingredients_100x100/tomato-sauce-or-pasta-sauce.jpg',
    },
    // For testing purposes, any other barcode will "match" this
    'default': {
      id: `barcode-${Date.now()}`,
      name: 'Scanned Item',
      imageUrl: 'https://spoonacular.com/cdn/ingredients_100x100/mixed-vegetables.png',
    },
  };

  return mockBarcodeDatabase[barcode] || mockBarcodeDatabase.default;
};

const BarcodeScannerScreen = () => {
  const navigation = useNavigation<BarcodeScannerScreenNavigationProp>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [processingBarcode, setProcessingBarcode] = useState(false);

  useEffect(() => {
    const getBarcodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarcodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned || processingBarcode) return;
    
    setScanned(true);
    setProcessingBarcode(true);
    
    try {
      // Look up the ingredient based on the barcode
      const ingredient = await getIngredientFromBarcode(data);
      
      if (ingredient) {
        // Add the ingredient to the stored list
        const currentIngredients = getIngredients();
        
        // Check if the ingredient already exists in the list
        const exists = currentIngredients.some(
          item => item.name.toLowerCase() === ingredient.name.toLowerCase()
        );
        
        if (!exists) {
          const newIngredients = [...currentIngredients, ingredient];
          saveIngredients(newIngredients);
          
          Alert.alert(
            'Ingredient Added',
            `${ingredient.name} has been added to your ingredient list.`,
            [
              {
                text: 'Continue Scanning',
                onPress: () => {
                  setScanned(false);
                  setProcessingBarcode(false);
                },
              },
              {
                text: 'Done',
                onPress: () => {
                  navigation.navigate('IngredientInput');
                },
                style: 'default',
              },
            ]
          );
        } else {
          Alert.alert(
            'Already in Your List',
            `${ingredient.name} is already in your ingredient list.`,
            [
              {
                text: 'Continue Scanning',
                onPress: () => {
                  setScanned(false);
                  setProcessingBarcode(false);
                },
              },
              {
                text: 'Done',
                onPress: () => {
                  navigation.navigate('IngredientInput');
                },
                style: 'default',
              },
            ]
          );
        }
      } else {
        Alert.alert(
          'Product Not Found',
          'We couldn\'t identify this product. Please try scanning again or add the ingredient manually.',
          [
            {
              text: 'Try Again',
              onPress: () => {
                setScanned(false);
                setProcessingBarcode(false);
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error processing barcode:', error);
      Alert.alert('Error', 'Failed to process barcode. Please try again.');
      setScanned(false);
      setProcessingBarcode(false);
    }
  };

  const toggleScanning = () => {
    setScanning(!scanning);
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
          Camera access is required to scan barcodes.
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
      <View style={styles.scannerContainer}>
        {scanning ? (
          <>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={styles.scanner}
            />
            <View style={styles.overlay}>
              <View style={styles.topBar}>
                <TouchableOpacity
                  onPress={goBack}
                  style={styles.iconButton}
                >
                  <Text style={styles.iconText}>✕</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={toggleScanning}
                  style={styles.iconButton}
                >
                  <Text style={styles.iconText}>⏸</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.scanArea}>
                <View style={styles.scanAreaCornerTopLeft} />
                <View style={styles.scanAreaCornerTopRight} />
                <View style={styles.scanAreaCornerBottomLeft} />
                <View style={styles.scanAreaCornerBottomRight} />
              </View>
              
              <View style={styles.instructions}>
                <Text style={styles.instructionText}>
                  Scan product barcode to add ingredient
                </Text>
                
                {processingBarcode && (
                  <Text style={styles.processingText}>
                    Processing barcode...
                  </Text>
                )}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.pausedContainer}>
            <Text style={styles.pausedText}>Scanning paused</Text>
            <Button
              title="Resume Scanning"
              onPress={toggleScanning}
              type="primary"
              style={styles.resumeButton}
            />
            <Button
              title="Go Back"
              onPress={goBack}
              type="outline"
              style={styles.backButton}
            />
          </View>
        )}
      </View>
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
  scannerContainer: {
    flex: 1,
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
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
  scanArea: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    position: 'relative',
  },
  scanAreaCornerTopLeft: {
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  scanAreaCornerTopRight: {
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#fff',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  scanAreaCornerBottomLeft: {
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  scanAreaCornerBottomRight: {
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#fff',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  instructions: {
    alignItems: 'center',
    marginBottom: 40,
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
    marginBottom: 10,
  },
  processingText: {
    color: '#fff',
    fontSize: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  pausedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  pausedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resumeButton: {
    width: 200,
    marginBottom: 12,
  },
  backButton: {
    width: 200,
  },
});

export default BarcodeScannerScreen;
