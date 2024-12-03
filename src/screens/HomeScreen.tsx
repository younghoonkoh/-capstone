import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [petDetails, setPetDetails] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPetDetails = async () => {
        const user = auth().currentUser;

        if (!user) {
          console.error('No user logged in');
          return;
        }

        try {
          const snapshot = await firestore()
            .collection('users')
            .doc(user.uid)
            .collection('pets')
            .get();

          const details = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setPetDetails(details);

          // 선택된 펫 유지
          if (details.length > 0) {
            setSelectedPet(details.find((pet) => pet.id === selectedPet?.id) || details[0]);
          }
        } catch (error) {
          console.error('Error fetching pet details:', error);
        }
      };

      fetchPetDetails();
    }, [selectedPet]) // selectedPet 변경 시 데이터를 새로 가져옴
  );

  const handleSelectPet = (pet) => {
    setSelectedPet(pet);
    navigation.navigate('EditPetProfile', { pet });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleSelectPet(item)}
    >
      <Image
        source={{ uri: 'https://via.placeholder.com/50' }}
        style={styles.profileImage}
      />
      <View style={styles.itemTextContainer}>
        <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.birthday}>Birthday: {item.birthday}</Text>
      </View>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      {/* 상단 오른쪽에 작은 + 버튼 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('EditPetProfile', { pet: null })} // HomeTabs 내부에서 EditPetProfile 호출
>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* 세로 중앙에 위치한 프로필 리스트 */}
      <FlatList
        data={petDetails}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  addButtonText: {
    color: '#000', // + 버튼의 텍스트 색상 검은색
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    flexGrow: 1,
    justifyContent: 'center', // 세로 중앙 배치
    alignItems: 'center', // 가로 정렬
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    width: '90%', // 항목 너비를 화면 기준으로 설정
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  birthday: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});