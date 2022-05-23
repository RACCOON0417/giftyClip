import * as Notifications from 'expo-notifications';

export default function noti(date,set_time) {

    // var set_time = 5000; //알람 트리거를 위한 시간

    const date1 = new Date(date);    //text : ocr로 읽은 유효기간 날짜; date1: 유효기간 
    var clone = new Date(date1);     //text : ocr로 읽은 유효기간 날짜; date1: 유효기간
    const today = new Date();        //today : 현재 날짜
    const d = clone.getDate();
    const h = today.getHours();
    const m = today.getMinutes();
    const s = today.getSeconds();
    const ms = today.getMilliseconds();

    clone.setDate(d - 1);            //해당 값이 유효기간으로 부터 몇일 전에 알람이 가는 것인지를 설정 가능.
    clone.setHours(h);               //해당 값이 유효기간으로 부터 몇시간 전에 알람이 가는 것인지를 설정 가능.
    clone.setMinutes(m);             //해당 값이 유효기간으로 부터 몇분 전에 알람이 가는 것인지를 설정 가능.
    clone.setSeconds(s + 2);         //해당 값이 유효기간으로 부터 몇초 전에 알람이 가는 것인지를 설정 가능.
    clone.setMilliseconds(ms);


    const dateday = clone;
    console.log("dateday:", dateday);
    //dateday : 알람 계산을 위해 유효기간의 현재 날짜로 맞춤
    set_time = Math.round((dateday - today) / 1000);
    console.log("차이", set_time);
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });

    Notifications.scheduleNotificationAsync({
        content: {
            title: "Gifty Clip",
            body: '유효기간 하루 전인 기프티콘이 있습니다',
        },
        trigger: {
            seconds: set_time,
        },
    });

    return null;

}