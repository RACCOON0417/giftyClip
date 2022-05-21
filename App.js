import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, SafeAreaView, TouchableOpacity,Image, Alert, Modal, Pressable, Switch , TextInput , AppRegistry} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons'; 
//import Barcode from './Barcode';

const {height:SCREEN_HEIGHT, width:SCREEN_WIDTH} = Dimensions.get('window');
console.log(SCREEN_HEIGHT,SCREEN_WIDTH)

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [addCardVisible, setaddCardVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [SHOP, onChangeSHOP] = React.useState('교환처를 입력하세요.');
  const [Product, onChangeProduct] = React.useState('제품명을 입력하세요.');
  const [Date, onChangedate] = React.useState('유효기간을 입력하세요.');
  const [Barcode, onChangeBarcode] = React.useState(false);

  const clearAll = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
    }
    console.log('Done.')
  }

  const getAllKeys = async () => {
    let keys = []
    try {
      keys = await AsyncStorage.getAllKeys()
    } catch(e) {
      // read key error
    }
    console.log(keys)
  }

  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      console.log(jsonValue)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      console.log("Data load ERROR")
    }
  }

  const storeData = async (value, key) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
      console.log(jsonValue, "store")
      setaddCardVisible(!addCardVisible)
    } catch (e) {
      // saving error
    }
  }


  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.topMenu}>
        <TouchableOpacity style={styles.home_btn}>
          <Image style={styles.logo} source={{uri: 'https://cdn.discordapp.com/attachments/971817216905478205/971817234861293608/logo.png',}}/>
        </TouchableOpacity>

        <View style={{flex:2}}></View>

        <View style={styles.setting_btn}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={addCardVisible}
            onRequestClose={() => {setaddCardVisible(!addCardVisible);}}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Add COUPON</Text>
                <View style={styles.settingText}>
                  <Text style={styles.settingText}>SHOP</Text>
                  <TextInput style={styles.input} onChangeText={onChangeSHOP} value={SHOP} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingText}>Product</Text>
                  <TextInput style={styles.input} onChangeText={onChangeProduct} value={Product} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingText}>Date</Text>
                  <TextInput style={styles.input} onChangeText={onChangedate} value={Date} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingText}>Barcode</Text>
                  <TextInput style={styles.input} onChangeText={onChangeBarcode} value={Barcode}  keyboardType="numeric"/>
                </View>
                <View style={styles.settingText}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={()=>getData(Barcode) }>
                    <Text style={styles.textStyle}>불러오기</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={()=>getAllKeys() }>
                    <Text style={styles.textStyle}>카드목록</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={()=>storeData(makeCoupon(SHOP, Product, Date, Barcode), Barcode) }>
                    <Text style={styles.textStyle}>Add</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setaddCardVisible(!addCardVisible)}>
                    <Text style={styles.textStyle}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
          <TouchableOpacity  onPress={() => setaddCardVisible(true)}>
            <Ionicons name="add" size={24} color="black" /></TouchableOpacity>
        </View>


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
                <Text style={styles.settingText}>Alarm Setting</Text>
            <Switch onValueChange={toggleSwitch} value={isEnabled}/>
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
          <Pressable style={({ pressed }) => [{ marginBottom: pressed ? 0 : -180 }, styles.card ]}></Pressable>
          <Pressable style={({ pressed }) => [{ marginBottom: pressed ? 0 : -180 }, styles.card ]}></Pressable>
          <Pressable style={({ pressed }) => [{ marginBottom: pressed ? 0 : -180 }, styles.card ]}></Pressable>
          <Pressable style={({ pressed }) => [{ marginBottom: pressed ? 0 : -180 }, styles.card ]}></Pressable>


          <Pressable style={({ pressed }) => [{ marginBottom: pressed ? 0 : -180 }, styles.card ]}>
            <View style={styles.centeredView}>
              <Text style={styles.cardText}> GS25 </Text>
              <Text style={styles.cardText}> 1000원권 </Text>
              <Text style={styles.cardText}> BARCODE </Text>
                {/* <Barcode
                value="123456789999"
                options={{ format: 'UPC', background: 'lightblue' }}
                rotation={-5}
                /> */}
            </View>



          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView> 
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
  cardText : {
    flex:1,
    flexDirection : "row",
    alignItems : "center",
    fontSize : 25,

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

var coupon = new Object();
var coupon = {
  shop : null,
  product : null,
  date : null,
  barcode : null,
  use : false,
}

function makeCoupon(SHOP, Product, Date, Barcode){
  coupon.shop = SHOP;
  coupon.product = Product;
  coupon.date = Date;
  coupon.barcode = Barcode;
  coupon.use = false;
  return coupon
}
