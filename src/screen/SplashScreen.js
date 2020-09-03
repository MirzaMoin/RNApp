/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, Image, AsyncStorage } from 'react-native';
import apiConstant from '../api/apiConstant';
import GlobalFont from 'react-native-global-font'

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
    GlobalFont.applyGlobal(fontName)
  }

  _getLoginData = async () => {
    try {
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

  componentWillMount() {
    this._storeBOData();
    this._getLoginData();
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
