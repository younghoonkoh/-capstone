import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Alert,
  Text,
} from 'react-native';
import React, { useState } from 'react';
import MyButton from '../components/MyButton';
import MyTextInput from '../components/MyTextInput';
import SocialMedia from '../components/SocialMedia';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginWithEmailAndPass = async () => {
    if (!email || !password) {
      Alert.alert('Error', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      console.log('Logged in:', userCredential.user.uid);

      // Firestore에서 해당 사용자의 데이터 확인
      const userDoc = await firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .get();

      if (userDoc.exists && userDoc.data()?.hasPet) {
        console.log('Navigating to HomeScreen');
        navigation.navigate('HomeScreen');
      } else {
        console.log('Navigating to PetDetail');
        navigation.navigate('PetDetail');
      }
    } catch (err) {
      let userFriendlyMessage;

      switch (err.code) {
        case 'auth/invalid-email':
          userFriendlyMessage = '유효하지 않은 이메일 형식입니다. 이메일을 확인해 주세요.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          userFriendlyMessage = '아이디 혹은 비밀번호가 틀립니다. 다시 시도해 주세요.';
          break;
        default:
          userFriendlyMessage = '로그인 중 문제가 발생했습니다. 다시 시도해 주세요.';
      }

      // 사용자 친화적 메시지를 Alert로 표시
      Alert.alert('로그인 실패', userFriendlyMessage);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/background.png')} // 로그인 배경화면
        style={styles.imageBackground}
      >
        <Image
          source={require('../assets/dog/footprint.png')} //오른쪽 상단의 강아지 발자국 그림 크기
          style={styles.DogImage}
        />

        <Text style={styles.title}>Lovely Dog</Text>

        <View style={styles.inputsContainer}>
          <MyTextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Enter Email or User Name"
          />
          <MyTextInput
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholder="Password, At least 6 characters"
            secureTextEntry
          />

          <Text
            style={styles.textDontHave}
            onPress={() => navigation.navigate('SignUp')}
          >
            Don't Have An Account Yet?{' '}
            <Text style={{ textDecorationLine: 'underline' }}>Sign Up</Text>
          </Text>

          <MyButton title="Login" onPress={loginWithEmailAndPass} />

          <Text style={styles.orText}>OR</Text>

          <SocialMedia />
        </View>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1, // Make the background take up the entire screen
    paddingHorizontal: 60,
    alignItems: 'center',
    justifyContent: 'center', // Ensure content stays centered
  },
  DogImage: {
    height: 50,
    width: 90,
    resizeMode: 'stretch',
    position: 'absolute',
    right: 20,
    top: 20,
  },
  title: {
    fontSize: 40,
    color: 'white',
    marginTop: 30,
    fontFamily: 'Audiowide-Regular',
  },
  inputsContainer: {
    height: 450,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  textDontHave: {
    alignSelf: 'flex-end',
    marginRight: 10,
    color: 'black',
    marginBottom: 15,
    fontFamily: 'NovaFlat-Regular',
  },
  orText: {
    fontSize: 20,
    color: 'gray',
    marginTop: 20,
    fontFamily: 'Audiowide-Regular',
  },
});