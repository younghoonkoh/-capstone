import { Image,
    ImageBackground,
    StyleSheet,
    Platform,
    View,
    Text,
    Alert,
  } from 'react-native';
  import React, {useState} from 'react';
  import MyButton from '../components/MyButton';
  import MyTextInput from '../components/MyTextInput';
  import SocialMedia from '../components/SocialMedia';
  import auth from "@react-native-firebase/auth";


  
  const SignUpScreen = ({navigation}) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const signUpTestFn = () => {
       auth()
        .createUserWithEmailAndPassword(email,password)
        .then(() => {
          Alert.alert('User Created with those credentials. Please Login');
          navigation.navigate("Login")
        })
        .catch(err => {
          let errorMessage;
          switch (err.code) {
            case 'auth/email-already-in-use':
              errorMessage = "이 이메일은 이미 사용 중입니다.";
              break;
            case 'auth/invalid-email':
              errorMessage = "유효하지 않은 이메일 형식입니다.";
              break;
            case 'auth/weak-password':
              errorMessage = "비밀번호는 최소 6자 이상이어야 합니다.";
              break;
            default:
              errorMessage = err.message || "예기치 않은 오류가 발생했습니다.";
          }
          Alert.alert(errorMessage);
        });
    };




    return (
      <View style={styles.container}>
        <ImageBackground source={require("../assets/background.png")}  // 로그인 배경화면
          style={styles.imageBackground}
        >
          <Image
            source={require("../assets/dog/footprint.png")} //오른쪽 상단의 강아지 발자국 그림 크기
            style={styles.dogImage}
          />
  
          <Text style={styles.title}>Lovely Dog</Text>
  
          <View style = {styles.inputsContainer}> 
            <MyTextInput value={email} onChangeText={text => setEmail(text)} placeholder="Enter E-mail or User Name" />
            <MyTextInput value={password} onChangeText={text => setPassword(text)} placeholder="Password" secureTextEntry /> 
              {/*비밀번호 암호화*/}
            <MyTextInput value={confirmPassword}  onChangeText={text => setConfirmPassword(text)} placeholder="Confirm Password" secureTextEntry />  

            <MyButton onPress={signUpTestFn} title={'Sign Up'} />      

            <Text style={styles.orText}>OR</Text>

            <SocialMedia />

          </View>
        
          
        </ImageBackground>
  
      </View>

    );
  };
  
  export default SignUpScreen;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    imageBackground: {
      height: '100%',
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    dogImage: {
      height: 50,
      width: 90,
      resizeMode: 'stretch',
      position: 'absolute',
      right: 20,
      top: Platform.OS == 'android' ? 20 : 50,
    },
    title: {
      fontSize: 40,
      color: 'white',
      marginTop: Platform.OS == 'android' ? 60 : 110,
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