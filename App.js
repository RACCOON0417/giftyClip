import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, SafeAreaView, TouchableOpacity,Image,Alert, Modal, Pressable, Switch  } from 'react-native';
import Barcode from 'react-native-barcode-expo';
import { Ionicons } from '@expo/vector-icons'; 

const {height:SCREEN_HEIGHT, width:SCREEN_WIDTH} = Dimensions.get('window');


console.log(SCREEN_HEIGHT,SCREEN_WIDTH)

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return (
    <SafeAreaView style={styles.main}>
      
      <View style={styles.topMenu}>

        <TouchableOpacity style={styles.home_btn}>
          <Image style={styles.logo} source={{uri: 'https://cdn.discordapp.com/attachments/971817216905478205/971817234861293608/logo.png',}}/>
        </TouchableOpacity>

        <View style={{flex:2}}></View>
        <TouchableOpacity style={styles.add_btn}>
          <Ionicons name="add" size={24} color="black"/></TouchableOpacity>
        <View style={styles.setting_btn}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {setModalVisible(!modalVisible);}}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>SETTING</Text>
                <View style={styles.settingText}>
                <Text>Alarm Setting</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>확인</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <TouchableOpacity  onPress={() => setModalVisible(true)}>
            <Ionicons name="ios-settings-outline" size={24} color="black" /></TouchableOpacity>
        </View>
      </View>
      <View style={styles.cardSelect}>
        <TouchableOpacity style={styles.cardSelect_btn}><Text style={styles.cardSelect_txt}>사용가능</Text></TouchableOpacity>
        <TouchableOpacity style={styles.cardSelect_btn}><Text style={styles.cardSelect_txt}>사용완료</Text></TouchableOpacity>
      </View>
      
      <View style={styles.cardList}>
        <ScrollView>
          <View style={styles.card}></View>
          <View style={styles.card}></View>
          <View style={styles.card}></View>
          <View style={styles.card}></View>
          <View style={styles.card}></View>
          <View style={styles.card}></View>
          <View style={styles.card}></View>

        </ScrollView>

      </View>
    </SafeAreaView  > 
    
  );
}

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
