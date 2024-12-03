import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import PetDetail from '../screens/PetDetail';
import EditPetProfile from '../screens/EditPetProfile';
import Ingredient from '../screens/Ingredient';
import PetHealth from '../screens/PetHealth';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Ingredient') {
            iconName = 'cutlery';
          } else if (route.name === 'PetHealth') {
            iconName = 'paw';
          }
          return <Icon name={iconName} size={focused ? size + 4 : size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Ingredient" component={Ingredient} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="PetHealth" component={PetHealth} />
    </Tab.Navigator>
  );
}

export default function MyStack() {
  const [initialScreen, setInitialScreen] = useState<string | null>('Login'); // 초기값을 'Login'으로 설정

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();

          if (userDoc.exists && userDoc.data()?.hasPet) {
            setInitialScreen('HomeScreen');
          } else {
            setInitialScreen('PetDetail');
          }
        } catch (error) {
          console.error('Error fetching Firestore data:', error);
        }
      } else {
        setInitialScreen('Login'); // 로그아웃 상태에서 Login으로 설정
      }
    });

    return unsubscribe;
  }, []);

  if (initialScreen === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="PetDetail" component={PetDetail} />
        <Stack.Screen name="HomeScreen" component={BottomTabs} />
        <Stack.Screen name="EditPetProfile" component={EditPetProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}