import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  FlatList,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  BackHandler,
  NativeModules,
  NativeEventEmitter,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import ImageLoader from './../widget/ImageLoader';
import AnimateNumber from './../widget/AnimateNumber';
import { Header } from 'react-navigation-stack';
import LinearGradient from 'react-native-linear-gradient';
import HomeModel from './../model/HomeModel';
import MenuLinkModel from './../model/MenuLinkModel';
import GlobalAppModel from './../model/GlobalAppModel';
import { parseColor } from './../utils/utility';
import BottomNavigationTab from './../widget/BottomNavigationTab';
import Toast from 'react-native-root-toast';
import Marquee from '../widget/Marquee';
import BleManager from 'react-native-ble-manager';
import BackgroundTimer from 'react-native-background-timer';
// import SpinWheelScreen from './SpinWheelScreen';SpinWheelScreen
import * as RNEP from '@estimote/react-native-proximity';
// import  from '../beacons/proximityObserver2'
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'RRBeacon.db' });


const maxWidth = Dimensions.get('window').width;
var extipAppCount = 0;

if (Platform.OS == "android") {
  var { Beaconconnect } = NativeModules;
}

if (Platform.OS == "android") {
  var BeaconEvents = new NativeEventEmitter(Beaconconnect);
}
var countTimer
var apidata =
{
  "Response": [
    {
      "welcomeList": [
        {
          "message": "",
          "image": "",
          "OfferID": "",
          "CreateDate": "2019-08-30T06:20:37.623",
          "PointsToAdd": "0",
          "UpdatePointPopUPPush": "SendBoth",
          "NotificationPreview": "",
          "MessageTitle": "",
          "MessagetitleColor": "#000000",
          "MessageColor": "#000000",
          "MessageAlign": "AlignLeft",
          "BackgroundTop": "",
          "BackgroundBottom": "",
          "MessageID": "8b644a28-6ac7-485a-ab78-392e9e805adc",
          "Messagepriority": 1,
          "IsJackpotOffer": false,
          "IssueEveryJackpot": "",
          "JackpotType": "",
          "GlobalInstantWinId": ""
        }
      ],
      "timedelayList": [
        {
          "message": "LUCK SLOT PLAY",
          "image": "https://alpha.roborewards.net/UserUpload/BeaconMessage/484793b5-4e8d-4878-8f55-3d38a3bb0f08/52b2c32d-aa9c-48d1-91c7-f8dd94e5b364.mp4",
          "OfferID": "",
          "CreateDate": "2019-08-30T06:20:37.63",
          "PointsToAdd": "1",
          "UpdatePointPopUPPush": "SendBoth",
          "NotificationPreview": "",
          "MessageTitle": "TET",
          "MessagetitleColor": "#ffffff",
          "MessageColor": "#ffffff",
          "MessageAlign": "AlignLeft",
          "BackgroundTop": "#424242",
          "BackgroundBottom": "#000000",
          "MessageID": "afe2511e-1e14-499f-9ccf-19b0449094d4",
          "Messagepriority": 1,
          "IsJackpotOffer": false,
          "IssueEveryJackpot": "",
          "JackpotType": "",
          "GlobalInstantWinId": ""
        }
      ],
      "OfferJackpotList": [
        {
          "message": "",
          "image": "00ea8f0f-ab25-4a2b-829f-7681f8d600f8.mp4",
          "OfferID": "5528",
          "CreateDate": null,
          "PointsToAdd": "10",
          "UpdatePointPopUPPush": "SendBoth",
          "NotificationPreview": "",
          "MessageTitle": "",
          "MessagetitleColor": "#000000",
          "MessageColor": "#000000",
          "MessageAlign": "AlignLeft",
          "BackgroundTop": "#fafafa",
          "BackgroundBottom": "#fafafa",
          "MessageID": "8e22fec2-a0db-430b-ad36-75dcc627a3d5",
          "Messagepriority": 0,
          "IsJackpotOffer": true,
          "IssueEveryJackpot": "3",
          "JackpotType": "SendJackpot2",
          "GlobalInstantWinId": "05bc147f-4d4a-4a21-942e-7d86cb6dce63"
        },
        {
          "message": "You are Winner.",
          "image": "3324af55-4b89-4cb4-afe3-79fcdac038d9.mp4",
          "OfferID": "5545,5528",
          "CreateDate": null,
          "PointsToAdd": "1",
          "UpdatePointPopUPPush": "SendBoth",
          "NotificationPreview": "",
          "MessageTitle": "Instant Win",
          "MessagetitleColor": "#000000",
          "MessageColor": "#000000",
          "MessageAlign": "AlignLeft",
          "BackgroundTop": "#fafafa",
          "BackgroundBottom": "#fafafa",
          "MessageID": "fb7fa03a-732a-4823-aab2-dec820e8cccd",
          "Messagepriority": 0,
          "IsJackpotOffer": true,
          "IssueEveryJackpot": "2",
          "JackpotType": "SendJackpot1",
          "GlobalInstantWinId": "d389d952-98e4-43f7-88be-b178c3625691"
        }
      ],
      "UUID": "b9407f30-f5f8-466e-aff9-25556b57fe6d",
      "Major": "10",
      "Minor": "3",
      "StoreID": "cf096663-913c-4e2f-8722-34db41fba6c6",
      "RewardProgramID": "f158ed4c-ace0-44fd-835f-c82cdda625a2",
      "BeaconName": "Jonathan Blueberry",
      "AddressID": "9be47abc-8efa-43f9-a383-cb6ea7ac4132",
      "DelayTime": "0:1",
      "CheckInTime": "0:0",
      "BeaconID": "484793b5-4e8d-4878-8f55-3d38a3bb0f08",
      "BluetoothMessage": "Turn on your Bluetooth to access all check-in features!",
      "PrimaryColor": "#012340",
      "HeaderLogo": "https://alpha.roborewards.net/UserUpload/WebForm/af397e51-e29d-4853-8619-56dd0772ffcc/a5e7e358-5661-4afe-95ea-b9671691b8b0.png",
      "HeaderText": "",
      "MessageImageBackgroundColor": "#ffffff",
      "MessageTextBackgroundColor": "#ffffff",
      "WelcomeMessageSendOrder": "random",
      "TimeDelayMessageSendOrder": "random",
      "CheckInCountType": "UserWise",
      "IsWelcomeAllow": "false",
      "IsOkPopup": "true",
      "IsDisplayConnected": true,
      "LocationName": "RoboRewards",
      "IsDisplayLearnMoreLink": false,
      "LearnMoreLink": "",
      "IsOptionToClose": true,
      "IsBeaconandTabletsDependent": false,
      "IsPUSHAlarm": true
    },
    {
      "welcomeList": [
        {
          "message": "",
          "image": "",
          "OfferID": "",
          "CreateDate": "2019-08-28T12:38:43.493",
          "PointsToAdd": "0",
          "UpdatePointPopUPPush": "SendBoth",
          "NotificationPreview": "",
          "MessageTitle": "",
          "MessagetitleColor": "#000000",
          "MessageColor": "#000000",
          "MessageAlign": "AlignLeft",
          "BackgroundTop": "",
          "BackgroundBottom": "",
          "MessageID": "26968a0d-a80b-424a-b672-9374352acf4b",
          "Messagepriority": 1,
          "IsJackpotOffer": false,
          "IssueEveryJackpot": "",
          "JackpotType": "",
          "GlobalInstantWinId": ""
        }
      ],
      "timedelayList": [
        {
          "message": "Test1",
          "image": "https://alpha.roborewards.net/UserUpload/BeaconMessage/247b7c4d-ce04-4f24-af37-56294c950353/b501fc8f-18dc-466e-a473-c0fd765cc8bf.mp4",
          "OfferID": "",
          "CreateDate": "2019-08-28T12:38:43.497",
          "PointsToAdd": "0",
          "UpdatePointPopUPPush": "SendBoth",
          "NotificationPreview": "",
          "MessageTitle": "TEST1",
          "MessagetitleColor": "#000000",
          "MessageColor": "#000000",
          "MessageAlign": "AlignLeft",
          "BackgroundTop": "",
          "BackgroundBottom": "",
          "MessageID": "aa36515e-5097-4d7a-b3b9-05cb8f68e3cd",
          "Messagepriority": 1,
          "IsJackpotOffer": false,
          "IssueEveryJackpot": "",
          "JackpotType": "",
          "GlobalInstantWinId": ""
        },
        {
          "message": "Test2",
          "image": "https://alpha.roborewards.net/UserUpload/BeaconMessage/247b7c4d-ce04-4f24-af37-56294c950353/2a852c5c-83cf-4ab8-ac29-f85238278172.jpg",
          "OfferID": "",
          "CreateDate": "2019-08-28T12:38:43.523",
          "PointsToAdd": "0",
          "UpdatePointPopUPPush": "SendBoth",
          "NotificationPreview": "",
          "MessageTitle": "TEST2",
          "MessagetitleColor": "#000000",
          "MessageColor": "#000000",
          "MessageAlign": "AlignLeft",
          "BackgroundTop": "",
          "BackgroundBottom": "",
          "MessageID": "69f62609-9bf5-4cf9-a4e9-9a0861429dfe",
          "Messagepriority": 2,
          "IsJackpotOffer": false,
          "IssueEveryJackpot": "",
          "JackpotType": "",
          "GlobalInstantWinId": ""
        },
        {
          "message": "This is a message that you have earned points",
          "image": "https://alpha.roborewards.net/UserUpload/BeaconMessage/4e2e5ec2-f792-44e2-9f39-1b433308de82/6a669878-550b-4533-8066-5e0a1fdaf71f.png",
          "OfferID": "",
          "CreateDate": "2020-10-07T06:46:57.58",
          "PointsToAdd": "2",
          "UpdatePointPopUPPush": "SendBoth",
          "NotificationPreview": "",
          "MessageTitle": "TIMEDELAY-1",
          "MessagetitleColor": "#000000",
          "MessageColor": "#000000",
          "MessageAlign": "AlignLeft",
          "BackgroundTop": "",
          "BackgroundBottom": "",
          "MessageID": "04ee04f0-a328-42d6-a18f-06a3b14b0742",
          "Messagepriority": 1,
          "IsJackpotOffer": false,
          "IssueEveryJackpot": "",
          "JackpotType": "",
          "GlobalInstantWinId": ""
        }
      ],
      "OfferJackpotList": [
        {
          "message": "",
          "image": "00ea8f0f-ab25-4a2b-829f-7681f8d600f8.mp4",
          "OfferID": "5528",
          "CreateDate": null,
          "PointsToAdd": "10",
          "UpdatePointPopUPPush": "SendBoth",
          "NotificationPreview": "",
          "MessageTitle": "",
          "MessagetitleColor": "#000000",
          "MessageColor": "#000000",
          "MessageAlign": "AlignLeft",
          "BackgroundTop": "#fafafa",
          "BackgroundBottom": "#fafafa",
          "MessageID": "813ca03c-9485-4ac1-ad11-45b0271f9f65",
          "Messagepriority": 0,
          "IsJackpotOffer": true,
          "IssueEveryJackpot": "3",
          "JackpotType": "SendJackpot2",
          "GlobalInstantWinId": "05bc147f-4d4a-4a21-942e-7d86cb6dce63"
        },
        {
          "message": "You are Winner.",
          "image": "3324af55-4b89-4cb4-afe3-79fcdac038d9.mp4",
          "OfferID": "5545,5528",
          "CreateDate": null,
          "PointsToAdd": "1",
          "UpdatePointPopUPPush": "SendBoth",
          "NotificationPreview": "",
          "MessageTitle": "Instant Win",
          "MessagetitleColor": "#000000",
          "MessageColor": "#000000",
          "MessageAlign": "AlignLeft",
          "BackgroundTop": "#fafafa",
          "BackgroundBottom": "#fafafa",
          "MessageID": "cf257409-e85c-4268-98f4-707ac8ddf9f0",
          "Messagepriority": 0,
          "IsJackpotOffer": true,
          "IssueEveryJackpot": "2",
          "JackpotType": "SendJackpot1",
          "GlobalInstantWinId": "d389d952-98e4-43f7-88be-b178c3625691"
        }
      ],
      "UUID": "b9407f30-f5f8-466e-aff9-25556b57fe6d",
      "Major": "1234",
      "Minor": "1234",
      "StoreID": "cf096663-913c-4e2f-8722-34db41fba6c6",
      "RewardProgramID": "f158ed4c-ace0-44fd-835f-c82cdda625a2",
      "BeaconName": "BeaconTestVideo",
      "AddressID": "e3368787-d8fc-4d78-8e18-73a24c56318a",
      "DelayTime": "2:13",
      "CheckInTime": "0:0",
      "BeaconID": "247b7c4d-ce04-4f24-af37-56294c950353",
      "BluetoothMessage": "Turn on your Bluetooth to access all check-in features!",
      "PrimaryColor": "#012340",
      "HeaderLogo": "https://alpha.roborewards.net/UserUpload/WebForm/af397e51-e29d-4853-8619-56dd0772ffcc/a5e7e358-5661-4afe-95ea-b9671691b8b0.png",
      "HeaderText": "",
      "MessageImageBackgroundColor": "#ffffff",
      "MessageTextBackgroundColor": "#ffffff",
      "WelcomeMessageSendOrder": "random",
      "TimeDelayMessageSendOrder": "random",
      "CheckInCountType": "UserWise",
      "IsWelcomeAllow": "false",
      "IsOkPopup": "false",
      "IsDisplayConnected": true,
      "LocationName": "AJ Location 4",
      "IsDisplayLearnMoreLink": false,
      "LearnMoreLink": "",
      "IsOptionToClose": true,
      "IsBeaconandTabletsDependent": false,
      "IsPUSHAlarm": true
    },
    {
      "welcomeList": [
        {
          "message": "aaa",
          "image": "https://alpha.roborewards.net/UserUpload/BeaconMessage/db696f70-3c85-46d7-9ed4-92797be49020/dc394564-13fb-4040-bd95-1490d8ed7e02.jpg",
          "OfferID": "",
          "CreateDate": "2019-07-13T09:26:04.673",
          "PointsToAdd": "0",
          "UpdatePointPopUPPush": "SendBoth",
          "NotificationPreview": "",
          "MessageTitle": "AA",
          "MessagetitleColor": "#7d657d",
          "MessageColor": "#542854",
          "MessageAlign": "AlignLeft",
          "BackgroundTop": "#a0b899",
          "BackgroundBottom": "#19c27e",
          "MessageID": "b024d868-e4d9-4ed3-936a-097c94c0ce1f",
          "Messagepriority": 1,
          "IsJackpotOffer": false,
          "IssueEveryJackpot": "",
          "JackpotType": "",
          "GlobalInstantWinId": ""
        },
        {
          "message": "eww",
          "image": "https://alpha.roborewards.net/UserUpload/BeaconMessage/db696f70-3c85-46d7-9ed4-92797be49020/8ff5912d-977e-4b5d-9b4e-bcbccfa078ac.jpg",
          "OfferID": "",
          "CreateDate": "2019-07-13T09:26:04.68",
          "PointsToAdd": "12",
          "UpdatePointPopUPPush": "SendBoth",
          "NotificationPreview": "",
          "MessageTitle": "RE",
          "MessagetitleColor": "#e8cfe8",
          "MessageColor": "#388bcf",
          "MessageAlign": "AlignLeft",
          "BackgroundTop": "#babfd1",
          "BackgroundBottom": "#4bcfc4",
          "MessageID": "b22547e0-5726-44cf-9880-e826f09f88ff",
          "Messagepriority": 2,
          "IsJackpotOffer": false,
          "IssueEveryJackpot": "",
          "JackpotType": "",
          "GlobalInstantWinId": ""
        }
      ],
      "timedelayList": [
        {
          "message": "BB",
          "image": "https://alpha.roborewards.net/UserUpload/BeaconMessage/db696f70-3c85-46d7-9ed4-92797be49020/6288afd4-68db-4115-b5be-2eb0bbeb8692.jpg",
          "OfferID": "",
          "CreateDate": "2019-07-13T09:26:04.733",
          "PointsToAdd": "0",
          "UpdatePointPopUPPush": "SendBoth",
          "NotificationPreview": "",
          "MessageTitle": null,
          "MessagetitleColor": "#697eb3",
          "MessageColor": "#8c1e8c",
          "MessageAlign": "AlignLeft",
          "BackgroundTop": "#bdd642",
          "BackgroundBottom": "#c3e615",
          "MessageID": "ddccee29-1d48-4ced-9746-016db11ac47a",
          "Messagepriority": 1,
          "IsJackpotOffer": false,
          "IssueEveryJackpot": "",
          "JackpotType": "",
          "GlobalInstantWinId": ""
        },
        {
          "message": "scsdcs",
          "image": "https://alpha.roborewards.net/UserUpload/BeaconMessage/db696f70-3c85-46d7-9ed4-92797be49020/e0014c2a-afba-43a2-b92b-f80aeb34bb00.jpg",
          "OfferID": "",
          "CreateDate": "2019-07-13T09:26:04.74",
          "PointsToAdd": "33",
          "UpdatePointPopUPPush": "SendBoth",
          "NotificationPreview": "",
          "MessageTitle": "SD",
          "MessagetitleColor": "#5e0f5e",
          "MessageColor": "#4d7a6a",
          "MessageAlign": "AlignLeft",
          "BackgroundTop": "#26ff00",
          "BackgroundBottom": "#e0cce0",
          "MessageID": "d81e446a-802c-4686-b228-e738c38e5c15",
          "Messagepriority": 2,
          "IsJackpotOffer": false,
          "IssueEveryJackpot": "",
          "JackpotType": "",
          "GlobalInstantWinId": ""
        }
      ],
      "OfferJackpotList": [],
      "UUID": "2c324e55-ed8d-cc95-5306-f17a08f1f4e9",
      "Major": "100",
      "Minor": "23",
      "StoreID": "cf096663-913c-4e2f-8722-34db41fba6c6",
      "RewardProgramID": "f158ed4c-ace0-44fd-835f-c82cdda625a2",
      "BeaconName": "demo..",
      "AddressID": "9c884c48-0e3c-4112-aff3-e5cdadddbd1c",
      "DelayTime": "0:1",
      "CheckInTime": "0:1",
      "BeaconID": "db696f70-3c85-46d7-9ed4-92797be49020",
      "BluetoothMessage": "Turn on your Bluetooth to access all check-in features!",
      "PrimaryColor": "#012340",
      "HeaderLogo": "https://alpha.roborewards.net/UserUpload/WebForm/af397e51-e29d-4853-8619-56dd0772ffcc/a5e7e358-5661-4afe-95ea-b9671691b8b0.png",
      "HeaderText": "",
      "MessageImageBackgroundColor": "#ffffff",
      "MessageTextBackgroundColor": "#ffffff",
      "WelcomeMessageSendOrder": "random",
      "TimeDelayMessageSendOrder": "random",
      "CheckInCountType": "UserWise",
      "IsWelcomeAllow": "false",
      "IsOkPopup": "false",
      "IsDisplayConnected": true,
      "LocationName": "New Addition Tst 3",
      "IsDisplayLearnMoreLink": false,
      "LearnMoreLink": "",
      "IsOptionToClose": true,
      "IsBeaconandTabletsDependent": false,
      "IsPUSHAlarm": true
    }
  ],
  "StatusCode": 1,
  "ErrorMessage": "",
  "SuccessMessage": "Success"
}
export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      title: 'HomeScreen',
      tabIndex: 0,
      key: '',
      count: 0
    };
    // this.beacon = this.beacon.bind(this);
  }
  createTableBeacon() {
    var that = this;
    // debugger;
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='beacon'",
        [],
        function (txn, res) {
          // console.log('Inside the select statement');
          if (res.rows.length == 0) {
            console.log('Inside the select statement row count');
            // debugger;
            txn.executeSql('DROP TABLE IF EXISTS beacon', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS beacon(b_id INTEGER PRIMARY KEY AUTOINCREMENT, beacon_id VARCHAR(20), uuid VARCHAR(20), major VARCHAR(20),minor VARCHAR(20),delay_time VARCHAR(20),check_in_time VARCHAR(20),welcome_order VARCHAR(20),delay_order VARCHAR(20),check_in_count_type VARCHAR(20),welcome_jackpot_count INT(20),delay_jackpot_count INT(20),next_welcome INT(20),next_welcome_jackpot INT(20),next_delay VARCHAR(1024),next_delay_jackpot INT(20),is_allow_welcome VARCHAR(20),is_ok_popup VARCHAR(10),location_name VARCHAR(10),TimeDelayMessageSendOrder VARCHAR(20))',
              [],
              (success) => {
                console.log("success in create beacon " + success);
                that.createTableMsg();
              },
              (error) => {
                console.log("error beacon " + error);
              }
            );
          } else {
            that.createTableMsg();
            // console.log('Beacon table is already created');
          }
        }
      );
      // debugger;
    });
  }
  createTableMsg() {
    var that = this;
    db.transaction(function (txn) {
      // debugger
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='message'",
        [],
        function (tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS message', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS message(m_id INTEGER PRIMARY KEY AUTOINCREMENT, message_id VARCHAR(20), beacon_id VARCHAR(10), offer_id VARCHAR(20),message VARCHAR(20),message_title VARCHAR(10),point_to_add VARCHAR(20),image VARCHAR(50),notification_type VARCHAR(10),is_jackpot_type VARCHAR(20),issue_count VARCHAR(20),is_welcome VARCHAR(10))',
              [],
              (success) => {
                console.log("success in create message " + success);
                that.insertData();
              },
              (error) => {
                console.log("error message " + error);
              }
            );
          } else {
            that.insertData();
            // console.log('Message table is already created');
          }
        }
      );
      // debugger;
    });
  }
  insertData = async () => {
    var that = this;
    for (let index = 0; index < apidata.Response.length; index++) {
      for (let i = 0; i < apidata['Response'][index]['timedelayList'].length; i++) {
        db.transaction(function (tx) {
          // debugger;
          tx.executeSql(
            'SELECT * FROM message where message_id = ?',
            [apidata['Response'][index]['timedelayList'][i]['MessageID']],
            (txx, results) => {
              var len = results.rows.length;
              if (len == 0) {
                db.transaction((tx) => {
                  tx.executeSql(
                    'INSERT INTO message (m_id,message_id,beacon_id,offer_id,message,message_title,point_to_add,image,notification_type,is_jackpot_type,issue_count,is_welcome) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
                    [null, apidata['Response'][index]['timedelayList'][i]['MessageID'], apidata['Response'][index]['BeaconID'], apidata['Response'][index]['timedelayList'][i]['OfferID'], apidata['Response'][index]['timedelayList'][i]['message'], apidata['Response'][index]['timedelayList'][i]['MessageTitle'], apidata['Response'][index]['timedelayList'][i]['PointsToAdd'], apidata['Response'][index]['timedelayList'][i]['image'], apidata['Response'][index]['timedelayList'][i]['NotificationPreview'], apidata['Response'][index]['timedelayList'][i]['IsJackpotOffer'], apidata['Response'][index]['timedelayList'][i]['IssueEveryJackpot'], false],
                    (tx, results) => {
                      // console.log("data inserted in message")
                    },
                    (error) => {
                      console.log("error in insert message " + JSON.stringify(error))
                    }
                  );
                });
              } else {
                console.log('data available in message')
              }
            }
          );
        });
      }
      db.transaction(function (tx) {
        // debugger;
        tx.executeSql(
          'SELECT * FROM beacon where beacon_id = ?',
          [apidata['Response'][index]['BeaconID']],
          (txx, results) => {
            var len = results.rows.length;
            // console.log("len " + len)
            if (len == 0) {
              db.transaction((tx) => {
                tx.executeSql(
                  'INSERT INTO beacon(beacon_id,uuid,major,minor,delay_time,check_in_time,welcome_order,delay_order,check_in_count_type,welcome_jackpot_count,delay_jackpot_count,next_welcome,next_welcome_jackpot,next_delay,next_delay_jackpot,is_allow_welcome,is_ok_popup,location_name,TimeDelayMessageSendOrder) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                  [apidata['Response'][index]['BeaconID'], apidata['Response'][index]['UUID'], apidata['Response'][index]['Major'], apidata['Response'][index]['Minor'], apidata['Response'][index]['DelayTime'], apidata['Response'][index]['CheckInTime'], apidata['Response'][index]['WelcomeMessageSendOrder'], apidata['Response'][index]['DelayTime'], apidata['Response'][index]['CheckInCountType'], apidata['Response'][index]['WelcomeMessageSendOrder'], apidata['Response'][index]['DelayTime'], apidata['Response'][index]['BeaconName'], apidata['Response'][index]['WelcomeMessageSendOrder'], "", apidata['Response'][index]['DelayTime'], apidata['Response'][index]['IsWelcomeAllow'], apidata['Response'][index]['IsOkPopup'], apidata['Response'][index]['LocationName'], apidata['Response'][index]['TimeDelayMessageSendOrder']],
                  (tx, results) => {
                    // console.log("data inserted in beacon")
                  },
                  (error) => {
                    console.log("error in insert beacon " + JSON.stringify(error));
                  }
                );
              });
            } else {
              console.log('data available in beacon')
            }
          }
        );
      });
    }
  }
  // }

  getMessageIndex(rows, currentID) {
    for (let i = 0; i < rows.length; i++) {
      if (rows.item(i)['m_id'] === currentID)
        return i;
    }
    return -1;
  }

  updateData(id = '247b7c4d-ce04-4f24-af37-56294c950353') {
    // console.log("update call")
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT m_id FROM message where beacon_id = ?',
        [id],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            debugger;
            tx.executeSql('select * from beacon where beacon_id=?', [id], (tx, r) => {
              // console.log("r.rows.item(0)['next_delay'] " + r.rows.item(0)['next_delay'])
              if (r.rows.item(0)['next_delay'] === "" || true) {
                var newVal = 0;
                if (r.rows.item(0)['TimeDelayMessageSendOrder'] === 'loop') {
                  var current = parseInt(r.rows.item(0)['next_delay']);
                  var currentIndex = this.getMessageIndex(results.rows, current);
                  // var newVal = 0;
                  if (currentIndex >= len - 1 || currentIndex == -1) {
                    newVal = results.rows.item(0)['m_id'];
                  } else {
                    newVal = results.rows.item(currentIndex + 1)['m_id'];
                  }
                } else {
                  var RandomNumber = Math.floor(Math.random() * results.rows.length);
                  newVal = results.rows.item(RandomNumber)['m_id'];
                  console.log("random call " + RandomNumber + " length " + results.rows.length + " newval " + newVal)
                }
                db.transaction((txx) => {
                  txx.executeSql(
                    'update beacon set next_delay = ? where beacon_id = ?',
                    [newVal, id],
                    (tx, res) => {
                      debugger
                      console.log('Results', res.rowsAffected);
                      if (res.rowsAffected > 0) {
                        debugger
                        Alert.alert(
                          'Success',
                          'User updated successfully',
                          [
                            {
                              text: 'Ok',
                              onPress: () => console.log("data updated"),
                            },
                          ],
                          { cancelable: false }
                        );
                      } else alert('Updation Failed');
                    },
                    (error) => {
                      console.log("error in update " + JSON.stringify(error))
                    }
                  );
                })
              }
            })
          } else {
            alert('No beacon found...');
          }
        }
      );
    });
  }

  selectData() {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='beacon_msg_list'",
        [],
        function (txn, res) {
          // console.log('Inside the select statement');
          if (res.rows.length == 0) {
            console.log('Inside the select statement row count');
            // debugger;
            txn.executeSql('DROP TABLE IF EXISTS beacon_msg_list', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS beacon_msg_list(bm_id INTEGER PRIMARY KEY AUTOINCREMENT, beacon_id VARCHAR(20),message_id VARCHAR(20))',
              [],
              (success) => {
                console.log("success in create beacon msg list" + success);
                // that.createTableMsg();
              },
              (error) => {
                console.log("error beacon " + error);
              }
            );
          } else {
            // that.createTableMsg();
            // console.log('Beacon table is already created');
          }
        }
      );
      // debugger;
    });
    console.log("select call")
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM beacon', [], (tx, results) => {
        var temp1 = [];
        for (let i = 0; i < results.rows.length; i++)
          temp1.push(results.rows.item(i));
        console.log("beacon " + temp1.length)
      }, (error) => {
        console.log("error in select beacon " + error)
      });
    });
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM message', [], (tx, results) => {
        console.log('Selected data');
        var temp2 = [];
        for (let i = 0; i < results.rows.length; i++) {
          temp2.push(results.rows.item(i));
        }
        console.log("message " + temp2.length)
      }, (error) => {
        console.log("error in select msg " + JSON.stringify(error))
      });
    });
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM beacon_msg_list', [], (tx, results) => {
        console.log('Selected data');
        var temp3 = [];
        for (let i = 0; i < results.rows.length; i++) {
          temp3.push(results.rows.item(i));
        }
        console.log("message list " + temp3.length)
      }, (error) => {
        console.log("error in select msg " + JSON.stringify(error))
      });
    });
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM beacon_msg_list', [], (tx, results) => {

      }, (error) => {
        console.log("error in select msg " + JSON.stringify(error))
      });
    });

  }
  componentDidMount() {
    this.createTableBeacon()
  }
  componentWillMount() {
    // this.selectData()
    extipAppCount = 0;
    this._getStoredData();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    if (Platform.OS == "android") {
      BeaconEvents.addListener('onEnterZone', ({ deviceID }) => {
        if (deviceID) {
          debugger
          // alert("Device connect successfully:"+ key1)
          console.log("Device connect successfully:" + deviceID)
          Alert.alert(
            "Beacon connection",
            "Device connect successfully",
            [
              { text: "OK", onPress: console.log('ok') }
              //() => this.props.navigation.push('SpinWheel') }
            ],
            { cancelable: false }
          );
        }
      });
      BeaconEvents.addListener('onExitZone', ({ deviceID }) => {
        if (deviceID) {
          debugger
          BackgroundTimer.stopBackgroundTimer();
          alert("Device Disconnect successfully:" + deviceID)
          console.log("Device Disconnect successfully:" + deviceID)
        }
      });
      BeaconEvents.addListener('onContextChange', ({ key }) => {
        if (key) {
          debugger
          // alert("onContextChange:"+ key)
          console.log("onContextChange:" + key)
        }
      });
    }
  }
  //beacon connect for android
  beacon = async () => {
    // this.selectData()
    this.updateData();
    let listA = [{ 'appid': 'jingram-roborewards-com-s--8ki', 'apptoken': '03cec4f4b6eba05b2c72f09e82cb252e' }]
    if (Platform.OS == "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the Location ");
          BleManager.enableBluetooth()
            .then(() => {
              // Success code
              console.log("The bluetooth is already enabled or the user confirm");
              Beaconconnect.beacon({ listA })
                .then(message => console.log("message get from native " + message))
                .catch(error => console.error(error));
            })
            .catch((error) => {
              // Failure code
              alert("The user refuse to enable bluetooth");
            });
        } else {
          console.log("Location permission denied");
          alert("Location permission denied")
        }
      } catch (err) {
        console.warn(err);
      }
    }

  }

  //beacon connect for ios
  beaconIOS=()=>{
    console.log("beacon call");
    const ESTIMOTE_APP_ID = 'jingram-roborewards-com-s--8ki';
    const ESTIMOTE_APP_TOKEN = '03cec4f4b6eba05b2c72f09e82cb252e';

    console.log('Starting observers');
    const zone1 = new RNEP.ProximityZone(5, 'White');
    zone1.onEnterAction = context => {
      // startTimer();
      debugger
      alert('divce connected successfully')
      console.log('zone1 onEnter', context);
    };
    zone1.onExitAction = context => {
      // stopTimer(true);
      debugger
      alert('Divce disconnected successfully')
      console.log('zone1 onExit', context);
    };
    zone1.onChangeAction = contexts => {
      debugger
      //console.log('zone1 onChange', contexts);
      var data = contexts.map(function (item) {
        return {
          key: item.deviceIdentifier,
          value: item.tag
        };
      })

      // console.log('value :' + JSON.stringify(data));
      console.log('zone1 onChange', contexts);
    };


    RNEP.locationPermission.request().then(
      permission => {
        console.log(`location permission: ${permission}`);
        debugger
        if (permission !== RNEP.locationPermission.DENIED) {
          const credentials = new RNEP.CloudCredentials(
            ESTIMOTE_APP_ID,
            ESTIMOTE_APP_TOKEN,
          );

          const config = {
            // notification: {
            //   title: 'Exploration mode is on',
            //   text: "We'll notify you when you're next to something interesting.",
            //   channel: {
            //     id: 'exploration-mode',
            //     name: 'Exploration Mode',
            //   },
            // },
          };
          debugger
          RNEP.proximityObserver.initialize(credentials, config);
          debugger
          console.log('Proximity Observer - ', RNEP.proximityObserver.isObserving);
          RNEP.proximityObserver.isObserving == false ? RNEP.proximityObserver.startObservingZones([zone1]) : null
          // RNEP.proximityObserver.startObservingZones([zone1,zone2]
          console.log('Proximity Observer after - ', RNEP.proximityObserver.isObserving);
          // RNEP.startProximityObserver.startObservingZones([RNEP.proximityObserver(5,'blue')])

          console.log('zone1 value:' + JSON.stringify(zone1))
          // console.log('zone2 value:' + JSON.stringify(zone2))

          debugger
        }
      },
      error => {
        console.error('Error when trying to obtain location permission', error);
      },
    );

  }

  //backhandler for exit application
  handleBackButtonClick() {
    if (extipAppCount == 0) {
      Toast.show('Press Back again to Exit.', {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      extipAppCount = extipAppCount + 1
      setTimeout(
        () => { extipAppCount = 0 },
        Toast.durations.LONG
      )
    } else {
      BackHandler.exitApp();
    }
    return true;
  }

  _getStoredData = async () => {
    try {
      var firstName = '', lastName = '', profile = '';

      await AsyncStorage.getItem('firstName', (err, value) => {
        if (value) {
          firstName = value;
        }
      });

      await AsyncStorage.getItem('lastName', (err, value) => {
        if (value) {
          lastName = value
        }
      });

      await AsyncStorage.getItem('profilePitcure', (err, value) => {
        if (value) {
          profile = value
        } else {
          profile = ''
        }
      });

      this.setState({
        userFullName: `${firstName} ${lastName}`,
        userProfileImage: profile,
      });
    } catch (error) {
      console.log(error)
    }
  };

  // top container for showing point and image with gradient color
  _renderTopContainer = () => {
    console.log(`Global App Data: ${GlobalAppModel.rewardProgramId}`);
    return (
      <ImageBackground
        style={{ flexDirection: 'column', height: (maxWidth / 16) * 9, width: maxWidth }}
        source={{
          uri: HomeModel.homePageTopBackgroundImage,
        }}
        resizeMode="cover">
        <LinearGradient
          opacity={HomeModel.homePageTopBackgroundOpacity}
          colors={[parseColor(HomeModel.homePageTopBackgroundGradientStartColor), parseColor(HomeModel.homePageTopBackgroundGradientStopColor)]}
          style={{ flexDirection: 'column', padding: 10, height: (maxWidth / 16) * 9, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', width: '50%', padding: 5 }}>
            <View style={{ height: 6, width: 6, borderRadius: 5, backgroundColor: '#FE9D3F', alignSelf: 'center', marginHorizontal: 5 }} />
            <Text style={{ fontSize: 19, color: 'white', fontFamily: 'bold' }}>{HomeModel.homePageTopTextLine1}</Text>
          </View>
          <View style={{ height: 2, backgroundColor: 'white', width: '50%', margin: 5 }} />
          <AnimateNumber
            value={GlobalAppModel.redeemablePoint || 0}
            formatter={(val) => {
              return <Text
                style={{ fontSize: 26, color: 'white', fontFamily: 'bold', padding: 5 }}
              >{parseFloat(val).toFixed(2)}</Text>
            }} />
          <View style={{ height: 2, backgroundColor: 'white', width: '50%', margin: 5 }} />
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ marginTop: 10 }}
            onPress={() => {
              if (HomeModel.homePageTopButtonLinkType == 'external') {
                try {
                  this.props.navigation.push('webScreen', {
                    title: HomeModel.homePageTopButtonText,
                    webURL: HomeModel.homePageTopButtonLink,
                  });
                } catch (Exeption) { console.log(`Èrror : ${Exeption}`) }
              } else {
                this.props.navigation.push(HomeModel.homePageTopButtonLink);
              }
            }}>
            <LinearGradient
              colors={[parseColor(HomeModel.homePageTopButtonGradientStartColor), parseColor(HomeModel.homePageTopButtonGradientStopColor)]}
              style={{ padding: 10, paddingHorizontal: 25, borderRadius: 5, alignContent: 'center' }}>
              <Text style={{ color: parseColor(HomeModel.homePageTopButtonTextColor), fontSize: 16 }}>{HomeModel.homePageTopButtonText}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>
    );
  }

  onPageLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    // manage bottom container menu item height 
    console.log(`Height ${height} : Width ${width}`)
    if (!(this.state.bottomContainerMenuItemHeight) && HomeModel.menuLinks.length > 0) {
      var bottomMenuItemHeight = 75;
      const tmpMenuItemHeight = height / HomeModel.menuLinks.length;
      if (tmpMenuItemHeight > 75) {
        bottomMenuItemHeight = tmpMenuItemHeight;
      }
      this.setState({
        bottomContainerMenuItemHeight: bottomMenuItemHeight,
      });
    }
  };

  // bottom container for showing dynamic internal and external links
  _renderBottomContainer = () => {
    return (
      <ImageBackground
        ref={(ref) => (this.viewParent = ref)}
        onLayout={this.onPageLayout}
        style={{ flexDirection: 'column', flex: 1, width: maxWidth }}
        opacity={1}
        source={{
          uri: HomeModel.homePageBottomBackgroundImage,
        }}
        resizeMode="cover">
        <View>
          <LinearGradient
            opacity={HomeModel.homePageBottomBackgroundOpacity}
            colors={[parseColor(HomeModel.homePageBottomBackgroundGradientStartColor), parseColor(HomeModel.homePageBottomBackgroundGradientStopColor)]}
            style={{ flexDirection: 'column', height: '100%', width: '100%', position: 'absolute' }} />
          <FlatList
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            data={HomeModel.menuLinks}
            renderItem={({ item, index }) => {
              const menuLink = new MenuLinkModel(item);
              if (this.state.bottomContainerMenuItemHeight) {
                //console.log(`Text Align : ${index} : ${JSON.stringify(menuLink)}`);
                return (
                  <ImageBackground
                    style={{ flexDirection: 'column', flex: 1, width: maxWidth }}
                    opacity={1}
                    source={{
                      uri: menuLink.menuBackgroudImage,
                    }}
                    resizeMode="cover">
                    <View>
                      <LinearGradient
                        colors={[parseColor(menuLink.menuTopColor), parseColor(menuLink.menuBottomColor)]}
                        opacity={menuLink.menuOpacity}
                        style={{ height: this.state.bottomContainerMenuItemHeight, width: '100%', position: 'absolute' }} />
                      <View>
                        <View style={{ height: 1, backgroundColor: 'rgba(153,153,153,1)' }} />
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            if (menuLink.menuLinkType == 'external') {
                              try {
                                this.props.navigation.navigate('webScreen', {
                                  title: menuLink.menuText,
                                  webURL: menuLink.menuExternalLinkUrl,
                                });
                              } catch (Exeption) { console.log(`Èrror : ${Exeption}`) }
                            } else {
                              this.props.navigation.push(menuLink.menuInternalLinkUrl);
                            }
                          }}
                          style={{ padding: 10, flexDirection: 'row', height: this.state.bottomContainerMenuItemHeight || 75 }}>
                          {HomeModel.homePageBottomDisplayIcon && <Icon name={menuLink.icon} style={{ fontSize: 30, color: parseColor(HomeModel.homePageBottomIconColor), backgroundColor: HomeModel.homePageBottomIconShape == 'none' ? '' : parseColor(HomeModel.homePageBottomIconBackgroundColor), padding: 10, borderRadius: HomeModel.homePageBottomIconShape == 'round' ? 50 : 5, marginHorizontal: 10, width: 55, height: 55, textAlign: 'center', alignSelf: 'center' }} />}
                          <Text style={{ flex: 1, paddingHorizontal: 10, fontSize: 18, alignSelf: 'center', color: parseColor(MenuLinkModel.menuTextColor), textAlign: HomeModel.homePageBottomTextAlign.toLowerCase() }}>{menuLink.menuText || ''}</Text>
                          {HomeModel.homePageBottomDisplayArrowIcon && <MDIcon name={'keyboard-arrow-right'} style={{ alignSelf: 'center', fontSize: 30, color: parseColor(HomeModel.homePageBottomArrowColor) }} />}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ImageBackground>
                );
              }
            }}
          />
        </View>
      </ImageBackground>
    );
  }

  // rendering hribbon text as simple text or marquee
  _renderHomePageRibbonText = () => {
    if (HomeModel.homePageRibbonTextMarquee) {
      return (
        <Marquee
          loop={-1}
          style={{ flex: 1, flexDirection: 'row', marginHorizontal: 10, alignItems: 'center' }}>
          <Text style={{ fontSize: 15, color: parseColor(HomeModel.homePageRibbonTextColor), flex: 1, alignSelf: 'center' }}>{HomeModel.homePageRibbonText}</Text>
        </Marquee>
      )
    } else {
      return (<Text numberOfLines={1} ellipsizeMode={'clip'} style={{ fontSize: 15, color: parseColor(HomeModel.homePageRibbonTextColor), paddingHorizontal: 10, flex: 1, alignSelf: 'center' }}>{HomeModel.homePageRibbonText}</Text>);
    }
  }

  // rendering ribbon icon based on possition and visibility
  _renderRibbonIcon = position => {
    if (HomeModel.homePageRibbonDisplayIcon && HomeModel.homePageRibbonIconPosition == position) {
      return <Icon name={HomeModel.homePageRibbonIcon} style={{ color: '#0282C6', fontSize: 20, marginLeft: 5 }} />
    }
  }

  // rebbon for showing internal or external link at top/bottom of top container
  _renderRebbon = isShow => {
    if (HomeModel.homePageDisplayRibbon && isShow) {
      console.log(`Ribbon Icon ${HomeModel.homePageRibbonDisplayIcon} : ${HomeModel.homePageRibbonIcon} : ${HomeModel.homePageRibbonIconPosition}`)
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (HomeModel.homePageRibbonLinkType == 'external') {
              try {
                this.props.navigation.push('webScreen', {
                  title: HomeModel.homePageRibbonText,
                  webURL: HomeModel.homePageRibbonLink,
                });
              } catch (Exeption) { console.log(`Èrror : ${Exeption}`) }
            } else {
              this.props.navigation.push(HomeModel.homePageRibbonLink);
            }
          }}>
          <View style={{ width: '100%', padding: 5, backgroundColor: parseColor(HomeModel.homePageRibbonBackgroundColor), flexDirection: 'row', minHeight: 28 }}>
            {this._renderRibbonIcon('Left')}
            {this._renderHomePageRibbonText()}
            {this._renderRibbonIcon('Right')}
          </View>
        </TouchableOpacity>
      );
    }
  }

  // screen toolbar
  _renderToolBar = () => {
    return (
      <View style={[styles.headerContainer, { backgroundColor: parseColor(GlobalAppModel.primaryColor) }]}>
        <TouchableOpacity onPress={() => {
          this.props.navigation.openDrawer();
        }}>
          <MDIcon name={'menu'} style={styles.leftIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Home</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            this.props.navigation.push('profileScreen')
          }}>
          <ImageLoader
            title={this.state.userFullName}
            src={this.state.userProfileImage}
            rounded
            style={styles.headerUserImage} />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'#081b2e'} />
        <SafeAreaView style={styles.mainContainer}>
          {this._renderToolBar()}
          <View style={{ flex: 1 }}>
            {/* <Text>{this.state.countTimer}</Text> */}
            {Platform.OS == 'android' ?
              <TouchableOpacity onPress={() => { this.beacon() }}>
                <Text style={{ justifyContent: 'center', alignSelf: 'center', fontSize: 20, backgroundColor: '#678498', borderRadius: 5, color: 'white', margin: 5, padding: 5 }}>Beacon</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={() => { this.beaconIOS() }}>
                <Text style={{ justifyContent: 'center', alignSelf: 'center', fontSize: 20, backgroundColor: '#678498', borderRadius: 5, color: 'white', margin: 5, padding: 5 }}>Beacon</Text>
              </TouchableOpacity>
            }
            {this._renderRebbon(HomeModel.homePageRibbonPosition == 'Top')}
            {this._renderTopContainer()}
            {this._renderRebbon(HomeModel.homePageRibbonPosition == 'Middle')}
            {this._renderBottomContainer()}
          </View>
          <BottomNavigationTab
            navigation={this.props.navigation} />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerUserImage: { height: 35, width: 35 },
  headerText: {
    textAlign: 'center',
    flex: 1,
    marginBottom: 12,
    alignSelf: 'center',
    fontSize: 25,
  },
  footerContainer: {
    //height: 50,
    backgroundColor: '#012345',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  footerMenuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    paddingVertical: 15,
    flexDirection: 'column',
  },
  footerMenuItemImage: {
    height: 20,
    width: 20,
    tintColor: 'white',
  },
  footerMenuSelectedItem: {
    height: 24,
    //width: 24,
    tintColor: 'white',
  },
  footerMenuIdelItem: {
    height: 18,
    //width: 18,
    tintColor: '#fff',
  },
  footerMenuSelectedItemText: {
    color: 'white',
    fontSize: 15,
    paddingTop: 5,
    paddingHorizontal: 5,
    marginLeft: 5,
  },
  footerMenuIdelItemText: {
    color: '#000',
    fontSize: 10,
  },
  backgroundImage: {
    height: null,
    width: null,
    flex: 1,
  },
  listContainer: {
    flex: 1,
    padding: 25,
  },
  listTitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  listIcon: {
    fontSize: 26,
    color: '#666',
    width: 60,
  },
  listLabel: {
    fontSize: 16,
  },
  headerContainer: {
    height: Header.HEIGHT,
    paddingHorizontal: 15,
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#012345',
  },
  leftIcon: {
    color: 'white',
    fontSize: 24,
    alignItems: 'center',
    padding: 15,
    paddingLeft: 0
  },
  title: {
    color: 'white',
    fontSize: 18,
    flex: 1,
  },
  point: {
    color: 'white',
    fontSize: 18,
  },
  pointTerm: {
    color: 'white',
    fontSize: 13,
  }
});
