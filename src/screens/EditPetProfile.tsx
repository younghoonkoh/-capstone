import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const EditPetProfile = ({ route, navigation }) => {
  const { pet } = route.params || {}; // 기존 펫 데이터가 없으면 추가 모드로 설정

  const [firstName, setFirstName] = useState(pet?.firstName || '');
  const [lastName, setLastName] = useState(pet?.lastName || '');
  const [birthday, setBirthday] = useState(pet?.birthday || '');

  const handleSaveChanges = async () => {
    try {
      const userId = auth().currentUser?.uid; // 현재 로그인된 사용자 ID 가져오기

      if (!userId) {
        throw new Error('User not logged in');
      }

      if (pet?.id) {
        // 기존 펫 프로필 업데이트
        console.log('Updating pet profile:', pet.id);
        await firestore()
          .collection('users')
          .doc(userId)
          .collection('pets')
          .doc(pet.id)
          .update({
            firstName,
            lastName,
            birthday,
          });

        Alert.alert('Success', 'Pet profile updated successfully!');
      } else {
        // 새로운 펫 프로필 추가
        console.log('Adding new pet profile');
        await firestore()
          .collection('users')
          .doc(userId)
          .collection('pets')
          .add({
            firstName,
            lastName,
            birthday,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });

        Alert.alert('Success', 'New pet profile added successfully!');
      }

      navigation.goBack(); // 이전 화면으로 돌아가기
    } catch (error) {
      console.error('Error saving pet profile:', error);
      Alert.alert('Error', 'Failed to save pet profile. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>First Name:</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Last Name:</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={styles.label}>Birthday:</Text>
      <TextInput
        style={styles.input}
        value={birthday}
        onChangeText={setBirthday}
      />

      <Button
        title={pet ? 'Save Changes' : 'Add Pet'}
        onPress={handleSaveChanges}
      />
    </View>
  );
};

export default EditPetProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
});