/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  AsyncStorage,
  Alert,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import TextInput from 'react-native-textinput-with-icons';
import {makeRequest} from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import { ActivityIndicator } from 'react-native';
import {isValidEmail, isValidPhoneNo} from './../utils/utility';

export default class LoginScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor() {
    console.log('Constructor called');
    super();
    this.state = {
      isShowLogin: false,
      isShowPassword: true,
      isShowConfirmPassword: true,
      isShowSignUp: false,
      isRememberPassword: false,
      isShowForgotPassword: false,
      userName: '',
      password: '',
      forgotPassword: '',
      webformID: '',
      minutes: 1,
      seconds: 0,
      isTimer: false,
      webFromResponse: {},
      signup: {},
      signupError: {},
    };
    this._getStoredData();
  }

  // get stored user name and password
  _getStoredData = async () => {
    try {
      var userName, password, isRemeber;
      await AsyncStorage.getItem('webformID', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          //const val = JSON.parse(value);
          if (value) {
            this.setState({
              webformID: value,
            })
          }
        }
      });

      await AsyncStorage.getItem('isRemember', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          const val = JSON.parse(value);
          if (val != null && val != undefined && val) {
            isRemeber = val;
          }
        }
      });

      await AsyncStorage.getItem('password', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          if (value) {
            password = value;
          }
        }
      });

      await AsyncStorage.getItem('userName', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          if (value) {
            userName = value;
          }
        }
      });
      this.setState({
        userName: userName,
        password: password,
        isRememberPassword: isRemeber,
      })

      console.log(`start ${userName} ${password} ${isRemeber}`)

    } catch (error) {
      // Error saving data
    }
  };

  // start forgot password timer
  _startTimer=()=> {
    this.myInterval = setInterval(() => {
        const { seconds, minutes } = this.state

        if (seconds > 0) {
            this.setState(({ seconds }) => ({
                seconds: seconds - 1
            }))
        }
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(this.myInterval)
                this.setState({isTimer: false})
            } else {
                this.setState(({ minutes }) => ({
                    minutes: minutes - 1,
                    seconds: 59
                }))
            }
        } 
    }, 1000)
  }

  // stop timer
_stopTimer = () => {
  clearInterval(this.myInterval)
}

//stop timer on unmount
componentWillUnmount() {
    clearInterval(this.myInterval)
}


  // calling login API
  _callLogin = () => {
    let req = {
      rewardProgramToken: APIConstant.RPTOKEN,
      userName: this.state.userName,
      password: this.state.password,
    };
    console.log('Request :'+JSON.stringify(req))

    makeRequest(
      APIConstant.BASE_URL + APIConstant.LOGIN,
      'post',
      req
    )
      .then(response => {
        console.log(JSON.stringify(response));
        this.setState({isLoadingLogin: false});
        if(response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          console.log('fadsfadf');
          this._storeLoginData(response.responsedata);
        }

        /*this._storeData();
        this.props.navigation.navigate('Main');*/
        
      })
      .catch(error => console.log('error : ' + error));
  };

  // Store Login data
  _storeLoginData = async response => {
    try{
      await AsyncStorage.setItem('isLogin', JSON.stringify(true));
      if(this.state.isRememberPassword){
        await AsyncStorage.setItem('userName', this.state.userName);
        await AsyncStorage.setItem('password', this.state.password);
        await AsyncStorage.setItem('isRemember', JSON.stringify(true));
        console.log('storeing data');
      } else {
        await AsyncStorage.setItem('userName', '');
        await AsyncStorage.setItem('password', '');
        await AsyncStorage.setItem('isRemember', JSON.stringify(false));
        console.log('not');
      }
      await AsyncStorage.setItem('userID',response.contactData.contactID);
      await AsyncStorage.setItem('pointBalance',response.contactData.pointBalance.toString());
      await AsyncStorage.setItem('reedemablePoints',response.contactData.reedemablePoints.toString());
      await AsyncStorage.setItem('firstName',response.contactData.firstName);
      await AsyncStorage.setItem('lastName',response.contactData.lastName);
      await AsyncStorage.setItem('emailAddress',response.contactData.emailAddress);
      await AsyncStorage.setItem('profilePitcure',response.contactData.profilePitcure);

      if(response.contactData.isRequiredPasswordChanged) {
        // redirect to change password
      } else {
        this.props.navigation.navigate('Main',{
          loginData: response,
        });
      }
    }catch (error) {
      console.log(error)
    }
  };

  // CAlling Forgot Password API
  _callForgotPassword = () => {
    this._startTimer();
    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.FORGET_PASSWORD}?RPToken=${APIConstant.RPTOKEN}&WebFormID=${this.state.webformID}&EmailAddressOrMobileNo=${this.state.forgotPassword}`,
      'get',
    )
      .then(response => {
        console.log(JSON.stringify(response));
        this.setState({isLoadingForgot: false, isTimer: true});
        if(response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          Alert.alert('Success', response.statusMessage);
        }

        /*this._storeData();
        this.props.navigation.navigate('Main');*/
        
      })
      .catch(error => console.log('error : ' + error));
  };

  // webform data to show signup form
  _callWebFormData = () => {
    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.GET_WEBFORMFIELD_DATA}?RewardProgramID=78b84a8c-7b9e-4c8c-82fd-3c9f9e32bf20&WebFormId=${this.state.webformID}`,
      'get',
    )
      .then(response => {
        console.log(JSON.stringify(response));
        this.setState({isLoadingForgot: false, isTimer: true});
        if(response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          this.setState({
            isLoadingSignupform: false,
            webFromResponse: response.responsedata,
            isShowSignUp: !this.state.isShowSignUp,
          })
        }
      })
      .catch(error => console.log('error : ' + error));
  };

  _requireFields = [
    'requiredonsignup',
  ];
  _visibleFields = [
    ...this._requireFields,
    'notrequiredonsignup'
  ];
  
  _showLogin = () => {
    if (this.state.isShowLogin) {
      return (
        <View style={{flex: 1, flexDirection: 'column'}}>
          <TextInput
            label="Email, Mobile Member ID"
            labelColor="#ffffff"
            leftIcon="email"
            leftIconSize={20}
            leftIconType="material"
            underlineColor="#ffffff"
            color="#ffffff"
            containerWidth={300}
            labelActiveColor="#ffffff"
            leftIconColor="#ffffff"
            selectionColor={'#ffffff'}
            activeColor="#ffffff"
            rippleColor="rgba(255,255,255,2)"
            value={this.state.userName}
            error={this.state.userNameError}
            onChangeText={text => {
              this.setState({
                userName: text
              });
            }}
          />

          <TextInput
            label="Password"
            leftIcon="key"
            leftIconSize={20}
            containerWidth={300}
            leftIconType="material"
            rightIcon={
              !this.state.isShowPassword ? 'eye-off-outline' : 'eye-outline'
            }
            rightIconSize={20}
            paddingRight={30}
            rightIconType="material"
            selectionColor={'#ffffff'}
            labelActiveColor="#ffffff"
            labelColor="#ffffff"
            underlineColor="#ffffff"
            rightIconColor="#ffffff"
            color="#ffffff"
            secureTextEntry={this.state.isShowPassword}
            leftIconColor="#ffffff"
            rippleColor="rgba(255,255,255,70)"
            activeColor="#ffffff"
            onPressRightIcon={this._onShowPasswordClick}
            value={this.state.password}
            error={this.state.passwordError}
            onChangeText={text => {
              this.setState({
                password: text
              });
            }}
          />

          <CheckBox
            title="Remember Password"
            containerStyle={{backgroundColor: 'transparent', borderWidth: 0, justifyContent: 'flex-start'}}
            textStyle={{color: 'white'}}
            checkedColor={'white'}
            uncheckedColor={'white'}
            checked={this.state.isRememberPassword}
            onPress={() =>
              this.setState({
                isRememberPassword: !this.state.isRememberPassword,
              })
            }
          />
          {this._renderLoginButton()}
          
        </View>
      );
    }
  };

  _renderLoginButton = () => {
    if(this.state.isLoadingLogin){
      return(
        <ActivityIndicator style={{margin: 10}} color={'white'} size={36}/>
      );
    } else {
      return (
        <TouchableOpacity
            style={styles.button}
            onPress={() => {
              // this.props.navigation.navigate('App')
              if(this.state.userName){
                if(this.state.password){
                  this.setState({passwordError: '', isLoadingLogin: true});
                  this._callLogin()
                } else {
                  this.setState({
                    passwordError: 'Enter Passsword',
                    userNameError: '',
                  })
                }
              } else {
                this.setState({userNameError: 'Please Enter Valid email'});
              }
              
            }}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
      );
    }
  }

_renderSignupButton = () => {
  if(this.state.isLoadingSignupform){
    return(
      <ActivityIndicator style={{margin: 10}} color={'white'} size={36}/>
    );
  } else {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={this._onSignUpClick}>
        <Text style={styles.buttonText}>{this.state.isShowSignUp ? 'Register' : 'SIGN ME UP'}</Text>
      </TouchableOpacity>

    );
  }
}

  _renderMemberCardID = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.memberCardIDRequired) > -1){
      return (
        <TextInput
            label={fieldsData.memberCardIDLabel || 'Member Card ID'}
            labelColor="#ffffff"
            leftIcon="credit-card"
            leftIconSize={20}
            containerWidth={300}
            leftIconType="material"
            underlineColor="#ffffff"
            color="#ffffff"
            labelActiveColor="#ffffff"
            leftIconColor="#ffffff"
            selectionColor={'#ffffff'}
            activeColor="#ffffff"
            rippleColor="rgba(255,255,255,2)"
            error={this.state.signupError.memberCardID}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    memberCardID: text,
                  },
                });
                const stER = this.state.signupError;
                  this.setState({
                    signupError: {
                      ...stER,
                      memberCardID: '',
                    },
                  });
              } else {
                if(this._requireFields.indexOf(fieldsData.memberCardIDRequired) > -1){
                  const st = this.state.signupError;
                  this.setState({
                    signupError: {
                      ...st,
                      memberCardID: `Enter Valid ${fieldsData.memberCardIDLabel || 'Memeber Card ID'}`
                    },
                  });
                }
              }
            }}
          />
      )
    }
  }

  _showSignUp = () => {
    const {fieldsData, customData, locationData} = this.state.webFromResponse;
    if (this.state.isShowSignUp) {
      return (
        <View>
          {this._renderMemberCardID(fieldsData)}
          <TextInput
            label="Full Name"
            labelColor="#ffffff"
            leftIcon="account"
            leftIconSize={20}
            containerWidth={300}
            leftIconType="material"
            underlineColor="#ffffff"
            color="#ffffff"
            labelActiveColor="#ffffff"
            leftIconColor="#ffffff"
            selectionColor={'#ffffff'}
            activeColor="#ffffff"
            rippleColor="rgba(255,255,255,2)"
          />

          <TextInput
            label="Mobile Number"
            labelColor="#ffffff"
            leftIcon="phone"
            leftIconSize={20}
            containerWidth={300}
            leftIconType="material"
            underlineColor="#ffffff"
            color="#ffffff"
            labelActiveColor="#ffffff"
            leftIconColor="#ffffff"
            selectionColor={'#ffffff'}
            activeColor="#ffffff"
            rippleColor="rgba(255,255,255,2)"
          />

          <TextInput
            label="Email address"
            labelColor="#ffffff"
            leftIcon="email"
            leftIconSize={20}
            containerWidth={300}
            leftIconType="material"
            underlineColor="#ffffff"
            color="#ffffff"
            labelActiveColor="#ffffff"
            leftIconColor="#ffffff"
            selectionColor={'#ffffff'}
            activeColor="#ffffff"
            rippleColor="rgba(255,255,255,2)"
          />

          <TextInput
            label="Password"
            leftIcon="key"
            leftIconSize={20}
            containerWidth={300}
            leftIconType="material"
            rightIcon={
              !this.state.isShowPassword ? 'eye-off-outline' : 'eye-outline'
            }
            rightIconSize={20}
            paddingRight={30}
            rightIconType="material"
            selectionColor={'#ffffff'}
            labelActiveColor="#ffffff"
            labelColor="#ffffff"
            underlineColor="#ffffff"
            rightIconColor="#ffffff"
            color="#ffffff"
            secureTextEntry={this.state.isShowPassword}
            leftIconColor="#ffffff"
            rippleColor="rgba(255,255,255,70)"
            activeColor="#ffffff"
            onPressRightIcon={this._onShowPasswordClick}
          />

          <TextInput
            label="Confirm Password"
            leftIcon="key"
            leftIconSize={20}
            containerWidth={300}
            leftIconType="material"
            rightIcon={
              !this.state.isShowConfirmPassword
                ? 'eye-off-outline'
                : 'eye-outline'
            }
            rightIconSize={20}
            paddingRight={30}
            rightIconType="material"
            selectionColor={'#ffffff'}
            labelActiveColor="#ffffff"
            labelColor="#ffffff"
            underlineColor="#ffffff"
            rightIconColor="#ffffff"
            color="#ffffff"
            secureTextEntry={this.state.isShowConfirmPassword}
            leftIconColor="#ffffff"
            rippleColor="rgba(255,255,255,70)"
            activeColor="#ffffff"
            onPressRightIcon={this._onShowConfirmPasswordClick}
          />

          <TextInput
            label="address"
            labelColor="#ffffff"
            leftIcon="home"
            leftIconSize={20}
            containerWidth={300}
            leftIconType="material"
            underlineColor="#ffffff"
            color="#ffffff"
            labelActiveColor="#ffffff"
            leftIconColor="#ffffff"
            selectionColor={'#ffffff'}
            activeColor="#ffffff"
            rippleColor="rgba(255,255,255,2)"
          />
        </View>
      );
    }
  };

  _showForgotPassword = () => {
    if (this.state.isShowForgotPassword) {
      return (
        <View style={{flex: 1, flexDirection: 'column'}}>
          <TextInput
            label="Enter your registered Email"
            labelColor="#ffffff"
            leftIcon="email"
            leftIconSize={20}
            containerWidth={300}
            leftIconType="material"
            underlineColor="#ffffff"
            color="#ffffff"
            labelActiveColor="#ffffff"
            leftIconColor="#ffffff"
            selectionColor={'#ffffff'}
            activeColor="#ffffff"
            rippleColor="rgba(255,255,255,2)"
            error={this.state.forgotPasswordError}
            onChangeText={text => {
              this.setState({
                forgotPassword: text
              });
            }}
          />

          <Text style={{fontSize: 16, color: 'white', padding: 5, alignSelf: 'center'}}>Please wait {this.state.minutes} : {this.state.seconds}</Text>

          {this._renderForgotButton()}
        </View>
      );
    }
  };

  _renderForgotButton = () => {
    if(this.state.isLoadingForgot){
      return(
        <ActivityIndicator style={{margin: 10}} color={'white'} size={36}/>
      );
    } else {
      return (
        <TouchableOpacity
            style={[styles.button,{backgroundColor: this.state.isTimer ? '#1d5799' : '#6b9fdb'}]}
            disabled={this.state.isTimer}
            onPress={()=>{
              if(isValidEmail(this.state.forgotPassword) || isValidPhoneNo(this.state.forgotPassword)){
                this._callForgotPassword();
                this.setState({
                  forgotPasswordError: '',
                  isLoadingForgot: true,
                  minutes: 1,
                  seconds: 0,
                })
              }else{
                this.setState({
                  forgotPasswordError: 'Please valida user email or mobile'
                })
              }
            }}>
            <Text style={styles.buttonText}>Send Password</Text>
          </TouchableOpacity>
      );
    }
  }

  _onShowPasswordClick = () => {
    this.setState({isShowPassword: !this.state.isShowPassword});
  };

  _onShowConfirmPasswordClick = () => {
    this.setState({isShowConfirmPassword: !this.state.isShowConfirmPassword});
  };

  _onLoginClick = () => {
    this.setState({
      isShowLogin: !this.state.isShowLogin,
      isShowSignUp: false,
      isShowPassword: true,
      isShowForgotPassword: false,
    });
  };

  _onSignUpClick = () => {
    if(this.state.isShowSignUp){
      // apply signup process
    } else {
      this.setState({
        isShowLogin: false,
        isLoadingSignupform: true,
        isShowPassword: true,
        isShowForgotPassword: false,
      });
      this._callWebFormData();
    }
  };

  _onForgotPasswordClick = () => {
    this.setState({
      isShowLogin: false,
      isShowSignUp: false,
      isShowPassword: true,
      isShowForgotPassword: true,
    });
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={styles.baseContainer}
        behavior="padding"
        enabled={Platform.OS === 'ios' ? true : false}>
        <View style={styles.baseContainer}>
          <View style={styles.backgroundImageBase}>
            <Image
              style={styles.backgroundImage}
              // source={require('./Image/background.png')}
              source={{
                uri:
                  'https://cdn-media-1.freecodecamp.org/images/1*gQEm5r-73VpwmSrHYRi0AQ.jpeg',
              }}
              resizeMode="cover"
            />
          </View>
          <View style={styles.baseScrollView}>
            <ScrollView
              keyboardShouldPersistTaps={true}
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={styles.mainContainer}>
                <Text style={styles.textStyle}>
                  OUR FRIEND GOES OUT BETTER WE HELP THEM GO OUT MORE
                </Text>
                <View style={styles.seprator} />
                <Text style={styles.textStyle2}>
                  Beacome a rewards member and get perks no one else does
                </Text>
                {this._showSignUp()}
                {this._renderSignupButton()}
                <TouchableOpacity
                  style={styles.button}
                  onPress={this._onLoginClick}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                {this._showLogin()}
                <Text
                  style={styles.forgotPassword}
                  onPress={this._onForgotPasswordClick}>
                  FORGOT PASSWORD
                </Text>
                <View
                  style={{
                    width: 170,
                    margine: -10,
                    height: 1,
                    backgroundColor: '#ffffff',
                  }}
                />
                {this._showForgotPassword()}
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: 'transparent',
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
    justifyContent: 'space-around',
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
});
