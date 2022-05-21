import React, {useState} from 'react'
import { View, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Notifications from 'expo-notifications';


function final(date){
 const clone = new Date(date);
 const today = new Date();
 const h = today.getHours();
 const m = today.getMinutes();
 const s = today.getSeconds();
 const ms = today.getMilliseconds();

 clone.setHours(h);
 clone.setMinutes(m);
 clone.setSeconds(s);
 clone.setMilliseconds(ms);
 return clone;
} 

Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
    var dt = new Date();

    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
 
var set_time = 5000; 
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};


export default function Home() {
    const placeholder = "날짜를 입력해주세요";

    const [isDatePickerVisible, setDatePickerVisibility, isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [text, onChangeText] = useState("");
    
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };
    const handleConfirm = (date) => {
        console.warn("datetimeFormat: ", date.format("yyyy-MM-dd HH:mm:ss"));
        hideDatePicker();
        onChangeText(date.format("yyyy-MM-dd"))
    };


    const date1 =new Date(text);
    console.log("text:",text);
    console.log("date1:",date1);
    const dateday = final(date1);
    console.log("시간1:dateday",dateday);
    const date2 =new Date();
    console.log("시간2:date2",date2);
    set_time = Math.round((dateday - date2)/(1000*24*60*60))*24*60*60-86398 ;
    console.log("차이",set_time);

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      }),
    });

    Notifications.scheduleNotificationAsync({
      content: {
        title: "제목",
        body: '내용',
      },
      trigger: {
        seconds: set_time,
      },
    });


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={showDatePicker}>
                <TextInput
                    pointerEvents="none"
                    style={styles.textInput}
                    placeholder={placeholder}
                    placeholderTextColor='#000000'
                    underlineColorAndroid="transparent"
                    editable={false}
                    value={text}
                />
                <DateTimePickerModal
                    headerTextIOS={placeholder}
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
                
            </TouchableOpacity>
        </View>

  );
}





const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    textInput: {
        fontSize: 16,
        color: '#000000',
        height: 50, 
        width: 300, 
        borderColor: '#000000', 
        borderWidth: 1, 
        borderRadius: 12,
        padding: 10

    },

});


