import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import { StyleSheet,Pressable,TouchableOpacity,Button,Dimensions, Image, View, Text,Alert  } from 'react-native';
import callGoogleVisionAsync from "./helperFunctions.js";

const {height:SCREEN_HEIGHT, width:SCREEN_WIDTH} = Dimensions.get('window');

function ImagePickerComponent({onSubmit}) {

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true, //return base64 data.
    });
    
    if (!result.cancelled) { //if the user submits an image,
      let ret= await callGoogleVisionAsync(result.base64);
      onSubmit=await onSubmit(ret.text);
    }

  };

  return (
    <View>
        <TouchableOpacity  onPress={pickImage}>
          <Text style={styles.blacktext}>갤러리에서 불러오기</Text>
        </TouchableOpacity >
    </View>
  );
}
export default ImagePickerComponent;

const styles = StyleSheet.create({
    main: {
      flex:1,
      backgroundColor: 'white',
    },
    rightView : {
      flex: 1,
      justifyContent: 'flex-end',
      alignSelf: 'flex-end',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    browseBtn : {
      borderRadius: 20,
      padding: 20,
      elevation: 2,
      backgroundColor: '#DADADA',
      borderWidth: 1,
      Stroke:'Solid #484848',
      marginRight : 30,
      marginTop : 100,
      width : 200,
      height : 40
    },
    blacktext : {
      fontSize : 16,
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
    }
  });