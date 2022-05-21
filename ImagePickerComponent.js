import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import { StyleSheet,TouchableOpacity,Button,Dimensions, Image, View, Text,Alert  } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { Ionicons } from '@expo/vector-icons'; 

const {height:SCREEN_HEIGHT, width:SCREEN_WIDTH} = Dimensions.get('window');

function ImagePickerComponent({ onSubmit }) {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('Please add an image');
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = ({ type, data }) => {
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true, //return base64 data.
      //this will allow the Vision API to read this image.
    });
    if (!result.cancelled) { //if the user submits an image,
      //setImage(result.uri);
      setText("Loading..");
      //alert(result.base64);
      
      const responseData = await onSubmit(result.base64).catch((error)=>{
        console.log("Api call error");
        alert(error.message);
     });
     
     //alert(result.uri);
      let ret=await BarCodeScanner.scanFromURLAsync(result.uri, [BarCodeScanner.Constants.BarCodeType.qr,BarCodeScanner.Constants.BarCodeType.codabar,BarCodeScanner.Constants.BarCodeType.code39])
      .then((result)=>{
        //alert(result.length);
        if(result.length>0) handleBarCodeScanned(result[0]);
      })
      .catch((error)=>{
        console.log("Api call error");
        alert(error.message);
     });
    }
    //alert("종료");
  };
  return (
    <View>
        <BarCodeScanner></BarCodeScanner>
        <TouchableOpacity style={styles.add_btn}>
          <Ionicons name="add" size={24} color="black" onPress={pickImage}/></TouchableOpacity>
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 200, height: 200, resizeMode:"contain" }}
        />
      )}
      { <Text>{text}</Text> }
    </View>
  );
}
export default ImagePickerComponent;

const styles = StyleSheet.create({
    main: {
      flex:1,
      backgroundColor: 'white',
    },
  
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    modalView: {
      flex: 0.5,
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
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
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    settingText:{
      flex:1,
      flexDirection: "row",
      margin:10,
      fontSize:20,
    },
  
  
  
  
    topMenu : {
      flex:1.5,
      flexDirection : "row",
      backgroundColor: 'white',
      justifyContent :"center",
      alignItems : "center", 
    },
    logo: {
      width: 100,
      height: 50,
    },
    cardSelect : {
      flex:1,
      flexDirection : "row",
      backgroundColor: 'white',
      justifyContent :"center",
      alignItems : "center", 
      paddingHorizontal: SCREEN_WIDTH/5,
    },
    cardList : {
      flex:12,
      backgroundColor: 'white',
    },
    card : {
      marginBottom: -200,
      height: SCREEN_HEIGHT/4,
      backgroundColor: 'white',
      paddingVertical: 8,
      borderWidth: 2,
      borderColor: 'black',
      borderRadius: 15,
      margin:15,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
    },
    cardSelect_btn: {
      flex:1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
    },
    cardSelect_txt: {
      fontSize : 20,
    },
    home_btn: {
      flex:3,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
    },
    add_btn: {
      flex:1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
    },
    setting_btn: {
      flex:1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
    },
  });