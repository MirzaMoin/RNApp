/**
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { 
  StyleSheet,
  View,
  Image,
  AsyncStorage,
  Alert
} from 'react-native';
import apiConstant from '../api/apiConstant';
import GlobalFont from 'react-native-global-font'
import { makeRequest } from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import HomeModel  from './../model/HomeModel';
import LoginScreenModel  from './../model/LoginScreenModel';
import GlobalAppModel  from './../model/GlobalAppModel';
import firebase from 'react-native-firebase';
import Toast from 'react-native-root-toast';
//import MenuLinkModel  from './../model/MenuLinkModel';
//import MenuPermissionModel  from './../model/MenuPermissionModel';

import { createBeaconTable } from './../database/BeaconDatabase';

export default class SplashScreen extends Component {
  
  static navigationOptions = {
    header: null,
  };

  constructor() {
    console.log('Constructor called');
    super();
  }

  componentDidMount() {
    let fontName = 'regular'
    // GlobalFont.applyGlobal(fontName)
    this.createTBL();
  }
  createTBL = async ()  => {
    await createBeaconTable();
    // print('Data Created Splash');
  }

  _getLoginData = async () => {
    try {
      /*var inviteFrom, inviteBy;
      await AsyncStorage.getItem('inviteFrom', (err, value) => {
        if (value) {
          inviteFrom = value
        }
      });

      await AsyncStorage.getItem('inviteBy', (err, value) => {
        if(value){
          Toast.show(`inviteFrom ${inviteFrom}\n${value}`, {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        }
      });*/

      await AsyncStorage.getItem('reedemablePoints', (err, value) => {
        if (value) {
          GlobalAppModel.setRedeemablePoint(value)
        }
      });

      await AsyncStorage.getItem('userID', (err, value) => {
        if (value) {
          GlobalAppModel.setUserID(value)
        }
      });

      await AsyncStorage.getItem('isLogin', (err, value) => {
        if (err) {
          this.props.navigation.navigate('Auth');
        } else {
          const val = JSON.parse(value);
          if (val != null && val != undefined && val) {
            this.props.navigation.navigate('Main');
          } else {
            this.props.navigation.navigate('Auth');
          }
        }
      });
      // get APP INTAKE DATA
      //this._callGetAppIntakeData()
    } catch (error) {
      this.props.navigation.navigate('Auth');
    }
  };

  _storeBOData = async () => {
    try {
      await AsyncStorage.setItem(
        'webformID',
        '8cf8bde6-22a6-43c8-a581-e3e2f53ed9e4'
      );
      await AsyncStorage.setItem(
        'RPID',
        '78b84a8c-7b9e-4c8c-82fd-3c9f9e32bf20'
      );
    } catch (error) {
      console.log('error while store data : ' + error)
    }
  }

  getParameterFromUrl(url, parm) {
    var re = new RegExp(".*[?&]" + parm + "=([^&]+)(&|$)");
    var match = url.match(re);
    return (match ? match[1] : "");
  }

  async componentWillMount() {
    this._storeBOData();
    this._callGetAppIntakeData()
    //this._getLoginData();
  }

  _callGetAppIntakeData = () => {
    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.GET_APP_INTAKEDATA}?RPToken=${APIConstant.RPTOKEN}`,
      'get',
    )
      .then(response => {
        //console.log(`Global App Response: ${JSON.stringify(response)}`)
        if (response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          LoginScreenModel.setLoginScreenData(response.responsedata.logInScreen);
          HomeModel.setHomeScreenData(response.responsedata.homeScreen);
          GlobalAppModel.setAppColor(response.responsedata.appColor);
          GlobalAppModel.setLoadingImages(response.responsedata.loadingImages);
          GlobalAppModel.setGlobalAppData(response.responsedata.appDetails);
          this._getInviteData(response.responsedata.appDetails.rewardProgramId);
          this._storeAppData();
          this._getLoginData();
        }
      })
      .catch(error => {
        console.log('error : ' + error);
        Alert.alert('Oppss...', `'Something went wrong please contact to support.`);
      });
  };

  _getInviteData = async rpID => {
    // console.log(`startubg bro now oringfi`)
    let url = await firebase.links().getInitialLink();
    firebase.links().getInit
    console.log(`URL : ${url} :`)
    if(url === 'some_condition_here'){
    //code to execute
    }
    const ID = this.getParameterFromUrl(url, 'invitedBy');
    const invitedBy = this.getParameterFromUrl(url, 'invitedFrom')
    /*Toast.show(`Link from ${invitedBy}\ninvitedBy ${ID}`, {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });*/
    
    await AsyncStorage.setItem(
      'inviteFrom',
      invitedBy
    );

    await AsyncStorage.setItem(
      'inviteBy',
      ID
    );
    this._callSentLinkClickData(ID, url, rpID);
  }

  _callSentLinkClickData = (invitedBy, link, rpID) => {
    
    const request = {
      rewardProgramId: rpID,
      referContactId: invitedBy,
      visitedLink: link
    };

    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.SENT_REFER_CLICK_DATA}`,
      'post',
      request
    )
      .then(response => {
        //console.log(`Global App Response: ${JSON.stringify(response)}`)
        if (response.statusCode == 0) {
          //Alert.alert('Oppss...', response.statusMessage);
          console.log('Érror')
        } else {
          console.log('çomplete')
        }
      })
      .catch(error => {
        console.log('error : ' + error);
        //Alert.alert('Oppss...', `'Something went wrong please contact to support.`);
      });
  };

  _storeAppData = async () => {
    try {
      await AsyncStorage.setItem(
        'LoginScreen',
        JSON.stringify(LoginScreenModel)
      );
      await AsyncStorage.setItem(
        'HomeModel',
        JSON.stringify(HomeModel)
      );
      await AsyncStorage.setItem(
        'GlobalAppModel',
        JSON.stringify(GlobalAppModel)
      );
    } catch (error) {
      console.log('error while store data : ' + error)
    }
  }

  render() {
    return (
      <View style={styles.baseContainer}>
        <View style={styles.backgroundImageBase}>
          <Image
            style={styles.backgroundImage}
            source={require('./../../Image/splash_screen_image.png')}
            resizeMode="cover"
          />
        </View>
        <View style={styles.baseScrollView}>
          <Image
            style={styles.profileContainer}
            source={{
              uri: apiConstant.USER_IMAGE,
            }}
            resizeMode="cover"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  backgroundImageBase: {
    position: 'absolute',
    opacity: 0.9,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  backgroundImage: {
    height: null,
    width: null,
    flex: 1,
  },
  container: {
    alignSelf: 'stretch',
    backgroundColor: '#000000',
    flex: 1,
    alignItems: 'center',
  },
  forgotPassword: {
    color: '#ffffff',
    flex: 1,
    marginTop: 10,
    textAlign: 'center',
    fontSize: 17,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  baseScrollView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  mainContainer: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'stretch',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0,0.30)',
    margin: 20,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  textStyle: {
    color: '#ffffff',
    marginBottom: 10,
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
  },
  textStyle2: {
    color: '#ffffff',
    marginBottom: 10,
    marginTop: 10,
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  seprator: {
    width: 200,
    height: 2,
    backgroundColor: '#ffffff',
  },
  button: {
    margin: 5,
    minWidth: 120,
    borderRadius: 10,
    alignSelf: 'center',
    maxWidth: 500,
    backgroundColor: '#6b9fdb',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    textAlign: 'center',
    margin: 10,
  },
  profileContainer: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    borderRadius: 50,
    borderColor: 'rgba(3,10,145,0.2)',
    borderWidth: 2,
  },
});
