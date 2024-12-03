import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const PetDetailScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const navigation = useNavigation();

  const savePetDetails = async () => {
    if (!firstName || !lastName || !birthday) {
      Alert.alert('Error', '모든 필드를 채워주세요.');
      return;
    }

    const user = auth().currentUser; // 현재 로그인한 사용자 가져오기

    if (!user) {
      Alert.alert('Error', '사용자가 로그인되어 있지 않습니다.');
      return;
    }

    try {
        const userRef = firestore().collection('users').doc(user.uid);
    
        // Firestore에 Pet 정보 저장
        await userRef.collection('pets').add({
          firstName,
          lastName,
          birthday,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
    
        // 사용자 문서에 hasPet 업데이트
        await userRef.set(
          { hasPet: true }, 
          { merge: true } // 기존 필드에 덮어쓰기 방지
        );
    
        Alert.alert('Success', 'Pet details saved successfully!');
        navigation.navigate('HomeScreen');
      } catch (error) {
        Alert.alert('Error', 'Failed to save pet details. Please try again.');
        console.error(error);
      }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pet Details</Text>
      <Text style={styles.subHeader}>
        Please enter your pet's details below.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Birthday (mm/dd/yyyy)"
        value={birthday}
        onChangeText={setBirthday}
      />
      <Button title="Continue" onPress={savePetDetails} />
    </View>
  );
};

export default PetDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
});