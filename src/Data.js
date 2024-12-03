import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';

const Data = () => {
  const [size, setSize] = useState('소형견');
  const [weight, setWeight] = useState('10');
  const [activity, setActivity] = useState('보통');
  const [condition, setCondition] = useState('없음');
  const [ingredients, setIngredients] = useState('');

  // Firestore 데이터 가져오기
  const fetchDataFromFirebase = async () => {
    try {
      const ingredientSnapshot = await firestore().collection('Ingredient').get();
      const recipeSnapshot = await firestore().collection('Recipe').get();

      const ingredientData = ingredientSnapshot.docs.map((doc) => {
        const data = doc.data();
        const ingredientsArray = Object.keys(data)
          .filter((key) => key.startsWith('ingredient_'))
          .map((key) => data[key]);

        return { ...data, ingredients: ingredientsArray, id: doc.id };
      });

      const recipeData = recipeSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      return { ingredientData, recipeData };
    } catch (error) {
      console.error('Firebase fetch error:', error);
      return { ingredientData: [], recipeData: [] };
    }
  };

  // 재료 전처리
  const preprocessIngredients = (rawIngredients) => {
    if (!rawIngredients) return [];
    const cleanText = rawIngredients
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^\w,]/g, '')
      .trim();

    return cleanText.split(',');
  };

  // 추천 함수
  const recommendRecipes = async () => {
    try {
      const { ingredientData, recipeData } = await fetchDataFromFirebase();

      if (!ingredientData || ingredientData.length === 0) {
        Alert.alert('오류', '재료 데이터를 불러오지 못했습니다.');
        return;
      }

      if (!recipeData || recipeData.length === 0) {
        Alert.alert('오류', '레시피 데이터를 불러오지 못했습니다.');
        return;
      }

      const userIngredients = preprocessIngredients(ingredients);

      if (!userIngredients || userIngredients.length === 0) {
        Alert.alert('오류', '입력한 재료가 없습니다. 재료를 입력하세요.');
        return;
      }

      let matches = [];

      ingredientData.forEach((item) => {
        const recipeName = item.name;
        const recipeIngredients = Array.isArray(item.ingredients) ? item.ingredients : [];

        if (recipeIngredients.length === 0) return;

        const commonIngredients = userIngredients.filter((userIngredient) =>
          recipeIngredients.some((ingredient) =>
            ingredient.toLowerCase().includes(userIngredient.toLowerCase())
          )
        );

        const matchCount = commonIngredients.length;

        if (matchCount === 0) return;

        const recipeInfo = recipeData.find((recipe) => recipe.name === recipeName);

        if (!recipeInfo) return;

        const calorieLimit = parseInt(weight) * (activity === '많음' ? 80 : activity === '보통' ? 70 : 60);

        if (recipeInfo.calories > calorieLimit) return;

        matches.push({
          name: recipeName,
          ingredients: recipeIngredients.join(', '),
          calories: recipeInfo.calories,
          cookingMethod: recipeInfo.cooking_method,
          totalTime: recipeInfo.total_time,
        });
      });

      if (matches.length === 0) {
        Alert.alert('결과 없음', '추천된 레시피가 없습니다.');
      } else {
        // 추천된 레시피 중 하나만 랜덤 선택
        const randomRecipe = matches[Math.floor(Math.random() * matches.length)];

        const result = `
          추천된 레시피: ${randomRecipe.name}\n
          칼로리: ${randomRecipe.calories}\n
          총 소요 시간: ${randomRecipe.totalTime}분\n
          필요한 재료: ${randomRecipe.ingredients}\n
          요리 방법: ${randomRecipe.cookingMethod}
        `;
        Alert.alert('추천 결과', result);
      }
    } catch (error) {
      console.error('추천 검색 중 오류 발생:', error);
      Alert.alert('오류', '추천 검색 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 체중 입력 검증
  const handleWeightChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setWeight(numericValue);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>견 크기:</Text>
      <RNPickerSelect
        onValueChange={(value) => setSize(value)}
        value={size}
        placeholder={{ label: '견 크기를 선택하세요', value: null }}
        items={[
          { label: '소형견', value: '소형견' },
          { label: '중형견', value: '중형견' },
          { label: '대형견', value: '대형견' },
        ]}
      />

      <Text style={styles.label}>체중 (kg):</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={handleWeightChange}
        keyboardType="numeric"
        placeholder="예: 10"
      />

      <Text style={styles.label}>운동량:</Text>
      <RNPickerSelect
        onValueChange={(value) => setActivity(value)}
        value={activity}
        placeholder={{ label: '운동량을 선택하세요', value: null }}
        items={[
          { label: '적음', value: '적음' },
          { label: '보통', value: '보통' },
          { label: '많음', value: '많음' },
        ]}
      />

      <Text style={styles.label}>질환:</Text>
      <RNPickerSelect
        onValueChange={(value) => setCondition(value)}
        value={condition}
        placeholder={{ label: '질환 여부를 선택하세요', value: null }}
        items={[
          { label: '없음', value: '없음' },
          { label: '비만', value: '비만' },
          { label: '관절염', value: '관절염' },
          { label: '당뇨', value: '당뇨' },
        ]}
      />

      <Text style={styles.label}>재료 입력 (쉼표로 구분):</Text>
      <TextInput
        style={styles.input}
        value={ingredients}
        onChangeText={setIngredients}
        placeholder="예: 고구마, 닭고기, 당근"
      />

      <Button title="추천 검색" onPress={recommendRecipes} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
});

export default Data;