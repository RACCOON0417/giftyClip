import React, { useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, SafeAreaView, TouchableOpacity,Image, Alert, Modal, Pressable, Switch , TextInput , AppRegistry, Platform ,FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons'; 
//import Barcode from 'react-barcode';
import ImagePickerComponent from "./ImagePickerComponent";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import noti from "./Notification";
import Barcode from './Barcode';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// import Select from "react-dropdown-select";

const {height:SCREEN_HEIGHT, width:SCREEN_WIDTH} = Dimensions.get('window');
console.log(SCREEN_HEIGHT,SCREEN_WIDTH)

const Stack = createNativeStackNavigator();

{/* 홈 스크린 */}
function HomeScreen(props) {
  const [CARDLIST, setCARDLIST] = useState([]);
  const [cardOption, setcardOption] = useState(1);
  const [cardMargin, setcardMargin] = useState(0);

  const CardItem = ({shop,product,date,barcode})=>{
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
      <View style={styles.cardView}>
        {cardOption ? null:(          
            <View>
              <View style={styles.setting_btn}>
                <TouchableOpacity  onPress={() => {storeData(makeCoupon(shop, product, date, barcode, true), barcode)}}>
                <Ionicons name="checkmark-circle-outline" size={24} color="blue"/></TouchableOpacity>
              </View>
              <View style={styles.setting_btn}>
                <TouchableOpacity  onPress={() => {removeValue(barcode)}}>
                <Ionicons name="trash-outline" size={24} color="red"/></TouchableOpacity>
              </View>
            </View>)}
        <Pressable style={({ pressed }) => [{ marginBottom: pressed ? 0 : (cardMargin ? 0:-160)}, styles.card,{ backgroundColor : "white"} ]}>
            <View style={styles.centeredView}>
              <Text style={styles.cardText}> {shop}</Text>
              <Text style={styles.cardText}> {product} </Text>
              <Barcode style={styles.barcode} value={barcode} options={{ format: 'CODE128', background: 'white', font:'',width:1.2 }}/>
            </View>
        </Pressable>
      </View>
    )
  }

  const getUnusedCard = async (val) => {
    let CARD_RENDER = "";
    let keys = await AsyncStorage.getAllKeys()
    let temList=[]
    for (let key in keys){
        const cardInfo = await AsyncStorage.getItem(keys[key])
        cardInfo = JSON.parse(cardInfo) 
        if (val==cardInfo["use"]){
            let CARD_Shop = cardInfo.shop
            let CARD_Barcode = cardInfo.barcode
            let CARD_Product = cardInfo.product
            let CARD_date = cardInfo.date
            console.log(CARD_Shop,CARD_Barcode);
            temList.push(Object({shop:CARD_Shop, product:CARD_Product, date:CARD_date, barcode:CARD_Barcode}));
        }
    }   
    setCARDLIST(temList);
    console.log("확인",temList[0].barcode);
    return CARD_RENDER
  };

  const removeValue = async (value) => {
    try {
      await AsyncStorage.removeItem(value)
    } catch(e) {
      // remove error
    }
    console.log('Done.')
  }

  useEffect(() => {
    getUnusedCard(false);
    },[]);
  

  const renderItem = ({item})=>( 
    <CardItem shop={item.shop} product={item.product} date={item.date} barcode={item.barcode} />
  );

  return (
    <SafeAreaView style={styles.main}>
      {/* 로고, 추가, 설정 버튼 */}
      <View style={styles.topMenu}>

        <TouchableOpacity style={styles.home_btn}>
          <Image style={styles.logo} source={{uri: 'https://cdn.discordapp.com/attachments/971817216905478205/971817234861293608/logo.png',}}/>
        </TouchableOpacity>

        <View style={{flex:2}}></View>

        <View style={styles.setting_btn}>
          <TouchableOpacity  onPress={() => {props.navigation.navigate('AddScreen');}}>
          <Ionicons name="add" size={24} color="black"/></TouchableOpacity>
        </View>

        <View style={styles.setting_btn}>
          <TouchableOpacity  onPress={() => {setcardOption(!cardOption),setcardMargin(!cardMargin)}}>
          <Ionicons name="pencil-outline" size={24} color="black"/></TouchableOpacity>
        </View>

        <View style={styles.setting_btn}>
          <TouchableOpacity  onPress={() => {props.navigation.navigate('SettingScreen');}}>
          <Ionicons name="ios-settings-outline" size={24} color="black" /></ TouchableOpacity>
        </View>
      </View>

      {/* 카드 선택 버튼 */}
      <View style={styles.cardSelect}>
      <TouchableOpacity style={styles.cardSelect_btn}  onPress={()=>{ getUnusedCard(false);}}><Text style={styles.cardSelect_txt}>사용가능</Text></TouchableOpacity>
        <TouchableOpacity style={styles.cardSelect_btn}  onPress={()=>{ getUnusedCard(true);}}><Text style={styles.cardSelect_txt}>사용완료</Text></TouchableOpacity>
      </View>

      {/* 카드 표시 뷰 */}
      <View style={styles.cardList}>
          <FlatList
        data={CARDLIST}
        renderItem={renderItem}
        keyExtractor={item => item.barcode}></FlatList>

      </View>
    </SafeAreaView> 
  );
}

{/* 카드 추가 스크린 */}
function AddScreen(props) {
  const [SHOP, onChangeSHOP] = React.useState('');
  const [Product, onChangeProduct] = React.useState('');
  const [Date, onChangedate] = React.useState('');
  const [Barcode, onChangeBarcode] = React.useState(false);
  const [Color, onChangeColor] = React.useState(false);
  const [selectedColor, setselectedColor] = useState();

  {/* OCR 데이터 정리 */}
  function setInputData(ret){
    console.log("setInputData 실행" + ret);
    let afterret=ret.split('\n');
    let f_shop=afterret[0];
    let f_product=afterret[1];
    let f_date=afterret[7];
    let f_barcode=afterret[5];
    
    onChangeSHOP(f_shop);
    onChangeProduct(f_product);
    onChangedate(f_date);
    onChangeBarcode(f_barcode);
  }

  {/* 데이터 관리 */}
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

  const removeValue = async (value) => {
    try {
      await AsyncStorage.removeItem(value)
    } catch(e) {
      // remove error
    }
    console.log('Done.')
  }

  return (
    <SafeAreaView style={styles.main}>
      {/* 로고, 추가, 설정 버튼 */}
      <View style={styles.topMenu}>

        <TouchableOpacity style={styles.home_btn} onPress={() => {props.navigation.navigate('HomeScreen');}}>
          <Image style={styles.logo} source={{uri: 'https://cdn.discordapp.com/attachments/971817216905478205/971817234861293608/logo.png',}}/>
        </TouchableOpacity>

        <View style={{flex:2}}></View>

        <View style={styles.setting_btn}>
          <TouchableOpacity  >
          <Ionicons name="add" size={24} color="black"/></TouchableOpacity>
        </View>

        <View style={styles.setting_btn}>
          <TouchableOpacity  onPress={() => {props.navigation.navigate('SettingScreen');}}>
          <Ionicons name="ios-settings-outline" size={24} color="black" /></ TouchableOpacity>
        </View>
      </View>
      
      {/* 이미지 OCR */}
      <View style={styles.cardSelect}>
      <Pressable
            style={[styles.button, styles.buttonClose,{
              backgroundColor : '#A6A6A6'
            }]}>
        <ImagePickerComponent onSubmit={setInputData}/>
      </Pressable>
      </View>

      {/* 수기 입력파트 */}
      <View style={styles.cardList}>
        <View style={styles.settingText}>
          <Text style={styles.settingText}>SHOP</Text>
          <TextInput style={styles.input} onChangeText={onChangeSHOP} placeholder="교환처를 입력하세요." value={SHOP} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingText}>Product</Text>
          <TextInput style={styles.input} onChangeText={onChangeProduct} placeholder="제품명을 입력하세요." value={Product} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingText}>Date</Text>
          <TextInput style={styles.input} onChangeText={onChangedate} placeholder="0000년 00월 00일" value={Date}/>
        </View>
            
        <View style={styles.settingText}>
          <Text style={styles.settingText}>Barcode</Text>
          <TextInput style={styles.input} onChangeText={onChangeBarcode} value={Barcode} placeholder="바코드 숫자를 입력하세요" keyboardType="numeric"/>
        </View>

        {/* <View style={styles.settingText}>
        
        <Select options={options} onChange={(values) => this.setValues(values)} /></View> */}

        <View style={styles.settingText}>
          <Text style={styles.settingText}>Color</Text>
          <TextInput style={styles.input} onChangeText={onChangeColor} value={Color} placeholder="색을 입력하세요 " keyboardType="numeric"/>
        </View>


        {/* 확인 취소 버튼 */}
        <View>
          <Pressable
            style={[styles.button, styles.buttonClose,{
              backgroundColor : '#38AA61'
            }]}
            onPress={()=>storeData(makeCoupon(SHOP, Product, Date, Barcode, Color, false), Barcode) }>
            <Text style={[styles.textStyle, {
              color: 'black'
            }]}>추가</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonClose,{
              backgroundColor : '#E8887E'
            }]}
            onPress={()=>removeValue(Barcode) }>
            <Text style={[styles.textStyle, {
              color: 'black'
            }]}>삭제</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonClose,{
              backgroundColor : '#EE0001'
            }]}
            onPress={()=>clearAll()}>
            <Text style={[styles.textStyle, {
              color: 'black'
            }]}>전체삭제</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonClose,{
              backgroundColor : '#F0F0F0'
            }]}
            onPress={() =>{
              props.navigation.navigate('HomeScreen');}}>
            <Text style={[styles.textStyle, {
              color: 'black'
            }]}>취소</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView> 
  )
}

{/* 설정 스크린 */}
function SettingScreen(props){
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }


  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const setPush = async () => {
      let keys = await AsyncStorage.getAllKeys()
      for (let key in keys){
          const cardInfo = await AsyncStorage.getItem(keys[key])
          cardInfo = JSON.parse(cardInfo)
          if (!cardInfo.use){
            noti(new Date(dateParser(cardInfo.date)),5000);
          }
      }
  };
  const clerPush = async () => {
    noti(new Date(),-1);
    console.log("clerPush!")
  }

  {isEnabled ? (setPush()) : (clerPush()) }

  function dateParser(str) {
    let y = str.slice(0, 4);
    let m = str.slice(6, 8);
    let d = str.slice(10, 12);
    
    return y+'-'+m+'-'+d
  }

  return (
    <SafeAreaView style={styles.main}>
    {/* 로고, 추가, 설정 버튼 */}
    <View style={styles.topMenu}>

      <TouchableOpacity style={styles.home_btn} onPress={() => {props.navigation.navigate('HomeScreen');}}>
        <Image style={styles.logo} source={{uri: 'https://cdn.discordapp.com/attachments/971817216905478205/971817234861293608/logo.png',}}/>
      </TouchableOpacity>

      <View style={{flex:2}}></View>

      <View style={styles.setting_btn}>
        <TouchableOpacity>
        <Ionicons name="add" size={24} color="black"/></TouchableOpacity>
      </View>

      <View style={styles.setting_btn}>
        <TouchableOpacity  onPress={() => {props.navigation.navigate('SettingScreen');}}>
        <Ionicons name="ios-settings-outline" size={24} color="black" /></ TouchableOpacity>
      </View>
    </View>


    {/* 메인화면 */}
    <View style={styles.cardList}>
      {/* 확인 취소 버튼 */}
        <View style={styles.settingText}>
          <Text style={styles.settingText}>알람설정</Text>
          <Switch style={styles.input} onValueChange={toggleSwitch} value={isEnabled}/>
        </View>
    </View>
    </SafeAreaView> 
  )
}

{/* 네비게이터 */}
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator  screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="AddScreen" component={AddScreen} />
        <Stack.Screen name="SettingScreen" component={SettingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;

{/* 카드 정보 객체 생성 */}
var coupon = new Object();
var coupon = {
  shop : null,
  product : null,
  date : null,
  barcode : null,
  use : false,
}
function makeCoupon(SHOP, Product, Date, Barcode, color, use){
  coupon.shop = SHOP;
  coupon.product = Product;
  coupon.date = Date;
  coupon.barcode = Barcode;
  coupon.color = color;
  coupon.use = use;
  return coupon
}

{/* 스타일 */}
const styles = StyleSheet.create({
  main: {
    flex:1,
    backgroundColor: 'white',
  },
  centeredView: {
    flex:12,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  leftView : {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
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
    borderBottomColor:'#9B9EA3',
    borderBottomWidth: 1,
    padding: 10,
    flexDirection: "row",
    margin:0,
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
  cardView:{
    flex:1,
    flexDirection : "row",
  },
  card : {
    //marginBottom: -150,
    flex : 5,
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
    fontSize : 20,

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
