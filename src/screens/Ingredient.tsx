import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const IngredientScreen = ({ navigation }) => {
  const [ingredients, setIngredients] = useState({
    ingredient1: '',
    ingredient2: '',
    ingredient3: '',
    ingredient4: '',
    ingredient5: '',
  });

  const handleInputChange = (name, value) => {
    setIngredients({ ...ingredients, [name]: value });
  };

  const handleContinue = () => {
    // 성분 데이터를 처리하거나 저장하는 로직 추가
    Alert.alert('Success', 'Ingredients saved successfully!');
    navigation.goBack(); // 이전 화면으로 이동
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ingredients</Text>
      <Text style={styles.subHeader}>
        It’s helpful to provide a good reason for why the address is required.
      </Text>

      {Object.keys(ingredients).map((key, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Ingredient${index + 1}`}
          value={ingredients[key]}
          onChangeText={(text) => handleInputChange(key, text)}
        />
      ))}

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default IngredientScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});