import { Image,
    ImageBackground,
    StyleSheet,
    Platform,
    View,
    Text,
    Alert,
    Button, } from 'react-native'
  import React from 'react'
  import MyButton from '../components/MyButton'
  import MyTextInput from '../components/MyTextInput'
  import SocialMedia from '../components/SocialMedia'

  
  const SignUpScreen = () => {
    return (
      <View style={styles.container}>
        <ImageBackground source={require("../assets/background.png")}  // 로그인 배경화면
          style={styles.imageBackground}
        >
          <Image
            source={require("../assets/dog/footprint.png")} //오른쪽 상단의 강아지 발자국 그림 크기
            style={styles.DogImage}
          />
  
          <Text style={styles.title}>Lovely Dog</Text>
  
          <View style = {styles.inputsContainer}> 
              <MyTextInput placeholder="Enter Email or User Name"  />
              <MyTextInput placeholder="Password" secureTextEntry />  
              {/*비밀번호 암호화*/}
              <MyTextInput placeholder="Confirm Password" secureTextEntry />  
              <MyButton title={'Sign Up'}/>       
  
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
      flex: 1
    },
    imageBackground: {
      height: '100%',
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    DogImage: {
      height: 50,
      width: 90,
      resizeMode: "stretch",
      position: "absolute",
      right: 20,
      top: 20,
    },
    title:{
      fontSize:40,
      color:"white",
      marginTop: 50,
      fontFamily: "Audiowide-Regular",
    },
    inputsContainer:{
      height : 450,
      width : "100%",
      backgroundColor:"white",
      borderRadius:25,
      justifyContent:"center",
      alignItems:"center",
      marginTop:50,
      paddingHorizontal:15
    },
    textDontHave:{
      alignSelf:"flex-end",
      marginRight:10,
      color:"black", 
      marginBottom:15,
      fontFamily:"NovaFlat-Regular"
    }, 
    orText:{
      fontSize:20,
      color:"gray",
      marginTop:20,
      fontFamily:"Audiowide-Regular"
    }
  });