import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const MyTextInput = () => {
  return (
    <View style = {styles.container}>
      <Image
        source = {require("../assets/SocialMediaIcons/facebook.png")}
        style={styles.image}
      />
      <Image
        source = {require("../assets/SocialMediaIcons/twitter.png")}
        style={styles.twitterIcon}
      />
      <Image
        source = {require("../assets/SocialMediaIcons/google.png")}
        style={styles.image}
      />
    </View>
  )
}

export default MyTextInput

const styles = StyleSheet.create({
    image:{
        height: 40,
        width: 40,
        
    },
    twitterIcon:{
        height:60, width:60, marginTop : 15
    },
    container:{
        flexDirection:"row",
        justifyContent:"space-evenly",
        width:"100%",
        alignItems: "center"
    }

})

