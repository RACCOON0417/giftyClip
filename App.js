import React, { useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Animated, ScrollView, Dimensions, SafeAreaView, TouchableOpacity,Image, Alert, Modal, Pressable, Switch , TextInput , AppRegistry, Platform ,FlatList} from 'react-native';
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
import { getCameraRollPermissionsAsync } from 'expo-image-picker';

// import Select from "react-dropdown-select";

const {height:SCREEN_HEIGHT, width:SCREEN_WIDTH} = Dimensions.get('window');
console.log(SCREEN_HEIGHT,SCREEN_WIDTH)

const Stack = createNativeStackNavigator();

{/* 홈 스크린 */}
function HomeScreen(props) {
  const [CARDLIST, setCARDLIST] = useState([]);
  const [cardOption, setcardOption] = useState(1);
  const [cardMargin, setcardMargin]=useState(0);
  const [NowSelect,setNowSelect]=useState("");

  const CardItem = ({shop,product,date,barcode,color})=>{
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

    function selectedCardStyle(){
      if(NowSelect==barcode){
        return {
          marginBottom:0
        }
        
      }else return { marginBottom : -160}

    }

    return (
      <View style={[styles.cardView]}>
        {cardOption ? null:(          
            <View>
              <View style={styles.setting_btn}>
                <TouchableOpacity  onPress={() => {storeData(makeCoupon(shop, product, date, barcode, color, true), barcode),
                  setcardOption(!cardOption),setcardMargin(!cardMargin),getUnusedCard(false)}}>
                <Ionicons name="arrow-redo-circle-outline" size={24} color="blue"/></TouchableOpacity>
              </View>
              <View style={styles.setting_btn}>
                <TouchableOpacity  onPress={() => {removeValue(barcode),getUnusedCard(true);}}>
                <Ionicons name="trash-outline" size={24} color="red"/></TouchableOpacity>
              </View>
            </View>)}
        <Pressable onPress={()=>setNowSelect(barcode)} style={[selectedCardStyle(), styles.card,{backgroundColor:color}]}>
            <View style={styles.centeredView}>
               <Text style={[{alignSelf:'flex-start', position: 'absolute', top:10, left:10},styles.cardText]}> {shop}</Text>
              <Text style={[{alignSelf:'flex-end', position:'absolute',top:10, right:10},styles.cardText]}> {"~"+date}</Text>
              
              <Text style={[{alignSelf:'flex-start', position: 'absolute', top:40, left:10, fontWeight:'bold'},styles.cardText]}> {product} </Text>
              <View style={{backgroundColor:'white',width:'100%', alignItems:'center'}}>
                <Barcode value={barcode} options={{ format: 'CODE128', background: 'white', font:'',width:2, }}/>
              </View>
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
            let CARD_color = cardInfo.color
            console.log(CARD_Shop,CARD_Barcode);
            temList.push(Object({shop:CARD_Shop, product:CARD_Product, date:CARD_date, barcode:CARD_Barcode,color:CARD_color}));
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
    console.log("useEffect 실행");
    getUnusedCard(false);
    },[]);
  

  const renderItem = ({item})=>( 
    <CardItem shop={item.shop} product={item.product} date={item.date} barcode={item.barcode} color={item.color} />
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
          <TouchableOpacity  onPress={() => {props.navigation.push('AddScreen');}}>
          <Ionicons name="add" size={24} color="black"/></TouchableOpacity>
        </View>

        <View style={styles.setting_btn}>
          <TouchableOpacity  onPress={() => {setcardOption(!cardOption),setcardMargin(!cardMargin)}}>
          <Ionicons name="pencil-outline" size={24} color="black"/></TouchableOpacity>
        </View>

        <View style={styles.setting_btn}>
          <TouchableOpacity  onPress={() => {props.navigation.push('SettingScreen');}}>
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
  const [Color, onChangeColor] = React.useState("gainsboro");

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

  useEffect(() => {
    onChangeSHOP('');
    onChangeProduct('');
    onChangedate('');
    onChangeBarcode(false);
    onChangeColor('gainsboro');
    },[]);
  
  function applySelectStyle(mycolor){
    if(mycolor==Color){
      return styles.selectColorOutline;
    }else return styles.nonSelectColorOutline;
  }
  return (
    <SafeAreaView style={styles.main}>
      {/* 로고, 추가, 설정 버튼 */}
      <View style={styles.topMenu}>
      <View style={styles.setting_btn}>
      <TouchableOpacity style={{ position:'absolute', left:'0%',marginLeft:20,top:'0%'}} onPress={()=>{props.navigation.push('HomeScreen');}}><Ionicons  name="chevron-back-outline" size={30} color="black" /></TouchableOpacity>
      </View>
      </View>
      
      {/* 이미지 OCR */}
      <View style={[styles.cardSelect, { backgroundColor: 'rgba(0,0,0,0.0)'}]}>
        <Pressable
              style={[styles.button, styles.buttonClose,{
                backgroundColor : '#DADADA',height:40,position:'absolute',right:'0%',marginRight:30,borderColor:'black',borderWidth:1,
              }]}>
          <ImagePickerComponent onSubmit={setInputData}/>
        </Pressable>
      </View>

      {/* 수기 입력파트 */}
      <View style={styles.cardList}>
        <View style={styles.settingText}>
          <Text style={styles.settingText}>브랜드</Text>
          <TextInput style={styles.input} onChangeText={onChangeSHOP} placeholder="교환처를 입력하세요." maxLength={10} value={SHOP} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingText}>이름</Text>
          <TextInput style={styles.input} onChangeText={onChangeProduct} placeholder="제품명을 입력하세요." maxLength={10}  value={Product} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingText}>사용기간</Text>
          <TextInput style={styles.input} onChangeText={onChangedate} placeholder="0000년 00월 00일"  value={Date}/>
        </View>
            
        <View style={styles.settingText}>
          <Text style={styles.settingText}>바코드 숫자</Text>
          <TextInput style={styles.input} onChangeText={onChangeBarcode} value={Barcode} placeholder="바코드 숫자를 입력하세요" returnKeyType="done" keyboardType="number-pad"/>
        </View>

        {/* <View style={styles.settingText}>
        
        <Select options={options} onChange={(values) => this.setValues(values)} /></View> */}

        <View style={styles.settingText}>
          <Text style={styles.settingText}>Color</Text>
          <Pressable onPress={()=>{onChangeColor("gainsboro");}} style={[styles.colorPicker,{left:100,backgroundColor : 'gainsboro'},applySelectStyle("gainsboro")]}/>
          <Pressable onPress={()=>{onChangeColor("lightpink");}} style={[styles.colorPicker,{left:150,backgroundColor : 'lightpink',},applySelectStyle("lightpink")]}/>
          <Pressable onPress={()=>{onChangeColor("#a9dec8");} } style={[styles.colorPicker,{left:200,backgroundColor : '#a9dec8'},applySelectStyle("#a9dec8")]}/>
          <Pressable onPress={()=>{onChangeColor("lightblue");}} style={[styles.colorPicker,{left:250,backgroundColor : 'lightblue'},applySelectStyle("lightblue")]}/>
          <Pressable onPress={()=>{onChangeColor("#cba9de");}} style={[styles.colorPicker,{left:300,backgroundColor : '#cba9de'},applySelectStyle("#cba9de")]}/>
        </View>


        {/* 확인 취소 버튼 */}
        <View>
          <View style={{height:70}}>
          <Pressable
            style={[styles.button, styles.buttonClose,{
              backgroundColor : '#A6A6A6',
              position: 'absolute',
              left:'50%', width:85,height:50,
              marginLeft:-100
            }]}
            onPress={()=>{
              storeData(makeCoupon(SHOP, Product, Date, Barcode, Color, false), Barcode);
              props.navigation.push('HomeScreen',{ dataChanged : true}); } }>
            <Text style={[styles.textStyle, {
              color: 'black',
              fontSize:20,
              top:5
            }]}>추가</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonClose,{
              backgroundColor : '#F0F0F0',
              position: 'absolute',
              left:'50%', width:85,height:50,
              marginLeft:20
            }]}
            onPress={() =>{
              props.navigation.push('HomeScreen',{ dataChanged : false});}}>
            <Text style={[styles.textStyle, {
              color: 'black',
              fontSize:20,
              top:5
            }]}>취소</Text>
          </Pressable>
          
          </View>
          <View style={{margin:50}}></View>
          


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
  const [switchValue, setswitchValue] = useState("");
  const toggleSwitch = () => (setIsEnabled(!switchValue),setswitchValue(!switchValue))
  const setPush = async () => {
      let keys = await AsyncStorage.getAllKeys()
      console.log("getAllKeys") 
      for (let key in keys){
          const cardInfo = await AsyncStorage.getItem(keys[key])
          console.log("getItem")
          cardInfo = JSON.parse(cardInfo)
          console.log(cardInfo.use)
          if (cardInfo.use==false){
            noti(new Date(dateParser(cardInfo.date)),5000)
          }
      }
      setIsEnabled(false);
  };

  const clerPush = async () => {
    noti(new Date(),-1);
    console.log("clerPush!")
  }

  {isEnabled ? (

      setPush()
) : (

     clerPush()
) }

  function dateParser(str) {
    let y = str.slice(0, 4);
    let m = str.slice(6, 8);
    let d = str.slice(10, 12);
    console.log(y+'-'+m+'-'+d)
    return y+'-'+m+'-'+d
  }

  return (
    <SafeAreaView style={styles.main}>

        {/* 헤더 */}
        <View style={styles.topMenu}>
            <View style={styles.setting_btn}>
                <TouchableOpacity style={{ position: 'absolute', left: '0%', marginLeft: 20, top: '0%' }} onPress={() => { props.navigation.push('HomeScreen'); }}><Ionicons name="chevron-back-outline" size={30} color="black" /></TouchableOpacity>
            </View>
        </View>

        {/* 메인화면 */}
        <View style={styles.option_main}>
            {/* 설정 화면 */}

            {/*사용 방법*/}
            <View style={styles.option_box}>
                <Text style={styles.option_large_text}>사용방법</Text>
            </View>

            {/*사용 방법 설명*/}
            <View style={styles.option_box2}>
                <Text style={styles.option_small_text}>
                    갤러리에서 기프티콘을 불러오거나, {'\n'}
                    사용자가 직접 데이터를 입력하여 등록한다 {'\n'}
                    사용자가 임의로 기프티콘 색을 변경하거나, {'\n'}
                    미사용된 기프티콘만 따로 볼 수있다
                </Text>
            </View>

            {/*설정 변경*/}
            <View style={styles.option_box}>
                <Text style={styles.option_large_text}>설정 </Text>
            </View>

            <View style={styles.option_box3}>
                <Text style={styles.option_small_text}>알림설정</Text>
                <Switch style={styles.option_notification_switch} onValueChange={toggleSwitch} value={switchValue} />
            </View>


            <View style={styles.option_box}>
                <Text style={styles.option_large_text}>기타 </Text>
            </View>

            <View style={styles.option_box2}>
                <Text style={styles.option_small_text}>개발자 정보</Text>
                <Text style={styles.option_small_text2}>남현정 jeong_opo@naver.com</Text>
                <Text style={styles.option_small_text2}>김현섭 nill0806@gmail.com</Text>
                <Text style={styles.option_small_text2}>이민혁 wsx1341@kakao.com</Text>
            </View>

            <View style={styles.option_box2}>
                <Text style={styles.option_small_text}>애플리케이션 버전</Text>
                <Text style={styles.option_small_text2}>0.2.1</Text>
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
    marginLeft:20,
    fontSize:16,
    alignItems: 'center',
  },
  input: {
    flex:3,
    height: 35,
    width: 20,
    margin: 12,
    borderBottomColor:'#9B9EA3',
    borderBottomWidth: 0,
    padding: 10,
    flexDirection: "row",
    margin:0,
    fontSize:16,
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
    height: SCREEN_HEIGHT/3.5,
    backgroundColor: 'white',
    paddingVertical: 8,
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
  colorPicker:{
    flex:1,
    position: 'absolute',
    borderRadius : 15,
    width:30,
    height : 30
  },
  selectColorOutline:{
    borderWidth: 2,
    borderColor: 'black',
    borderStyle : "dashed"
  },
  nonSelectColorOutline :{
    borderWidth : 0,
  },
  option_main: {
    flex: 13.5,
    flexDirection: "column",
    alignItems: 'stretch',
    justifyContent: 'flex-start',
},

option_box: {
    flexDirection: "row",
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    /*borderBottomColor: 'black',
    borderBottomWidth: 1,*/
    marginTop: 12,
    marginBottom: 6,
},

option_box2: {
    flexDirection: "column",
    paddingLeft: 10,
    margin: 2,
    marginVertical: 8,
    /*borderBottomColor: 'black',
    borderBottomWidth: 1,*/
},
option_box3: {
    flexDirection: "row",
    paddingLeft: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: 4,
    /*borderBottomColor: 'black',
    borderBottomWidth: 1,*/
},
option_large_text: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    margin: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    marginVertical: 8,

},


option_small_text: {
    fontSize: 20,
    margin: 2,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: 10,
    marginVertical: 8,
},
option_small_text2: {
    fontSize: 16,
    margin: 2,
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingLeft: 10,
    color: 'gray',
},

option_notification_switch: {
    height: 35,
    borderBottomColor: '#9B9EA3',
    borderBottomWidth: 1,
    flexDirection: "column",
    alignItems: 'flex-end',
    marginRight: 10,
},
});
