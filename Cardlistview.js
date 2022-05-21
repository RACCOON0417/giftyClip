import React, { useState, Component } from 'react';

import { StyleSheet, Text, View, ScrollView, Dimensions, SafeAreaView, TouchableOpacity,Image, Alert, Modal, Pressable, Switch , TextInput , AppRegistry} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons'; 
import { render } from 'react-dom';

const {height:SCREEN_HEIGHT, width:SCREEN_WIDTH} = Dimensions.get('window');


function Cardlistview({ }) {
    const [CARD, setCARD] = useState();

    const getUnusedCard = async () => {
        let CARD_RENDER
        let CARD_RENDER_HEAD = "<Pressable style={({ pressed }) => [{ marginBottom: pressed ? 0 : -180 }, styles.card]}><Text style={styles.cardText}>"
        let CARD_RENDER_TAIL = "</Text></Pressable>"
        let keys = await AsyncStorage.getAllKeys()
        for (let key in keys){
            const cardInfo = await AsyncStorage.getItem(keys[key])
            cardInfo = JSON.parse(cardInfo)
            console.log(cardInfo)
            if (!cardInfo["use"]){
                CARD_RENDER += CARD_RENDER_HEAD
                CARD_RENDER += cardInfo
                CARD_RENDER += CARD_RENDER_TAIL
            }
        }
        console.log(CARD_RENDER);
        return CARD_RENDER
    };

    console.log("asdasdasdasdasasd")
    setCARD("asdasd")

    return (
        <View>
             <Text>asdasd</Text> 
        </View>
    );
};
export default Cardlistview;
    


    
    
    const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    cardText : {
      flex:1,
      flexDirection : "row",
      alignItems : "center",
      fontSize : 25,
    
    },
    main: {
        flex:1,
        backgroundColor: 'white',
    },
    modalView: {
        flex: 0.8,
        margin: 20,
        marginBottom:300,
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
      borderRadius: 15,
      padding: 10,
      elevation: 2,
      margin:10
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
      fontSize: 25,
      marginBottom: 15,
      textAlign: 'center',
    },
    settingText:{
      flex:1,
      fontSize: 8,
      flexDirection: "row",
      margin:10,
      fontSize:20,
      alignItems: 'center',
    },
    input: {
      flex:3,
      height: 35,
      margin: 12,
      borderColor: '#9B9EA3',
      borderWidth: 1,
      padding: 10,
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
      // marginBottom: -200,
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