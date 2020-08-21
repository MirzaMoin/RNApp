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
import DatePicker from 'react-native-datepicker'
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { MenuProvider } from 'react-native-popup-menu';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

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
    var today = new Date();
    this._maxDate=(today.getFullYear() -12) + "-"+ parseInt(today.getMonth()+1) +"-"+ today.getDate();
  }

  _maxDate = '';

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

  _renderDrivingLinces = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.driverLicenseRequired) > -1){
      return (
        <TextInput
            label={fieldsData.driverLicense || 'Driving License'}
            labelColor="#ffffff"
            leftIcon="car"
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
            error={this.state.signupError.driverLicense}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    driverLicense: text,
                  },
                });
                const stER = this.state.signupError;
                  this.setState({
                    signupError: {
                      ...stER,
                      driverLicense: '',
                    },
                  });
              } else {
                if(this._requireFields.indexOf(fieldsData.memberCardIDRequired) > -1 && text.length() >= fieldsData.minRange && text.length() <= fieldsData.maxRange){
                  const st = this.state.signupError;
                  this.setState({
                    signupError: {
                      ...st,
                      driverLicense: `Enter Valid ${fieldsData.driverLicense || 'Driving License'}`
                    },
                  });
                }
              }
            }}
          />
      )
    }
  }

  _renderFirstName = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.firstNameRequired) > -1){
      return (
        <TextInput
            label={fieldsData.firstNameLabel || 'First Name'}
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
            error={this.state.signupError.firstName}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    firstName: text,
                  },
                });
                const stER = this.state.signupError;
                  this.setState({
                    signupError: {
                      ...stER,
                      firstName: '',
                    },
                  });
              } else {
                if(this._requireFields.indexOf(fieldsData.firstNameRequired) > -1){
                  const st = this.state.signupError;
                  this.setState({
                    signupError: {
                      ...st,
                      firstName: `Enter Valid ${fieldsData.firstNameLabel || 'First Name'}`
                    },
                  });
                }
              }
            }}
          />
      )
    }
  }

  _renderLastName = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.lastNameRequired) > -1){
      return (
        <TextInput
            label={fieldsData.lastNameLabel || 'Last Name'}
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
            error={this.state.signupError.lastName}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    lastName: text,
                  },
                });
                const stER = this.state.signupError;
                  this.setState({
                    signupError: {
                      ...stER,
                      lastName: '',
                    },
                  });
              } else {
                if(this._requireFields.indexOf(fieldsData.lastNameRequired) > -1){
                  const st = this.state.signupError;
                  this.setState({
                    signupError: {
                      ...st,
                      lastName: `Enter Valid ${fieldsData.lastNameLabel || 'First Name'}`
                    },
                  });
                }
              }
            }}
          />
      )
    }
  }

  _renderEmail = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.emailRequired) > -1){
      return (
        <TextInput
            label={fieldsData.emailLabel || 'Email'}
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
            error={this.state.signupError.email}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    email: text,
                  },
                });
              }
            }}
          />
      )
    }
  }

  _renderPhone = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.mobileRequired) > -1){
      return (
        <TextInput
            label={fieldsData.mobileLabel || 'Mobile'}
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
            error={this.state.signupError.mobile}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    mobile: text,
                  },
                });
              }
            }}
          />
      )
    }
  }

  _renderPassword = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.passwordRequired) > -1){
      return (
        <View>
          <TextInput
            label={fieldsData.passwordLabel || 'Password'}
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
            error={this.state.signupError.password}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    password: text,
                  },
                });
              }
            }}
          />

          <TextInput
            label={`Confirm ${fieldsData.passwordLabel || 'Password'}`}
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
            error={this.state.signupError.confirmPassword}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    confirmPassword: text,
                  },
                });
              }
            }}
          />
        </View>
      )
    }
  }

  _renderAddress2 = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.address2required) > -1){
      return (
        <TextInput
            label={fieldsData.address2 || 'Address line 2'}
            labelColor="#ffffff"
            leftIcon="home"
            leftIconSize={20}
            containerWidth={300}
            multiline={true}
            minHeight={100}
            maxHeight={100}
            leftIconType="material"
            underlineColor="#ffffff"
            color="#ffffff"
            labelActiveColor="#ffffff"
            leftIconColor="#ffffff"
            selectionColor={'#ffffff'}
            activeColor="#ffffff"
            rippleColor="rgba(255,255,255,2)"
            error={this.state.signupError.address2}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    address2: text,
                  },
                });
              }
            }}
          />
      )
    }
  }

  _renderAddress3 = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.address3required) > -1){
      return (
        <TextInput
            label={fieldsData.address3 || 'Address line 3'}
            labelColor="#ffffff"
            leftIcon="home"
            leftIconSize={20}
            containerWidth={300}
            multiline={true}
            minHeight={100}
            maxHeight={100}
            leftIconType="material"
            underlineColor="#ffffff"
            color="#ffffff"
            labelActiveColor="#ffffff"
            leftIconColor="#ffffff"
            selectionColor={'#ffffff'}
            activeColor="#ffffff"
            rippleColor="rgba(255,255,255,2)"
            error={this.state.signupError.address3}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    address3: text,
                  },
                });
              }
            }}
          />
      )
    }
  }

  _renderAddress = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.collectEndUserAddressRequired) > -1){
      return (
        <View>
          <TextInput
            label={fieldsData.collectEndUserAddressLabel || 'Address'}
            labelColor="#ffffff"
            leftIcon="home"
            leftIconSize={20}
            containerWidth={300}
            multiline={true}
            minHeight={100}
            maxHeight={100}
            leftIconType="material"
            underlineColor="#ffffff"
            color="#ffffff"
            labelActiveColor="#ffffff"
            leftIconColor="#ffffff"
            selectionColor={'#ffffff'}
            activeColor="#ffffff"
            rippleColor="rgba(255,255,255,2)"
            error={this.state.signupError.address}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    address: text,
                  },
                });
              }
            }}
          />

          {this._renderAddress2(fieldsData)}
          {this._renderAddress3(fieldsData)}

          <TextInput
            label={'City'}
            labelColor="#ffffff"
            leftIcon="city"
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
            error={this.state.signupError.city}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    city: text,
                  },
                });
              }
            }}
          />

          <TextInput
            label={'State'}
            labelColor="#ffffff"
            leftIcon="domain"
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
            error={this.state.signupError.state}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    state: text,
                  },
                });
              }
            }}
          />

          <TextInput
            label={'Postal Code'}
            labelColor="#ffffff"
            leftIcon="mailbox"
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
            error={this.state.signupError.postalcode}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    postalcode: text,
                  },
                });
              }
            }}
          />
        </View>
      )
    }
  }

  _renderLabel = (value, label) => {
    if(value) {
      return (
      <Text style={{marginLeft: 26, color: 'white', fontSize: 14, marginBottom: -8}}>{label}</Text>
      )
    }
  }

  _renderBirthDate = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.birthdateRequired) > -1){
      return (
        <View style={{flexDirection: 'column', width: '100%', marginTop: 5, marginBottom: 5}}>
          {this._renderLabel(this.state.signup.birthdate, fieldsData.birthdateLabel || 'Birth Date')}
          <DatePicker
            date={this.state.signup.birthdate}
            mode="date"
            placeholder={fieldsData.birthdateLabel || "select date"}
            format="YYYY-MM-DD"
            maxDate={this._maxDate}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            iconComponent={<MDIcon name={'cake'} style={{fontSize: 22, color: 'white', marginRight: 10}} />}
            customStyles={{
              placeholderText:{
                fontSize: 15,
                color: 'white'
              },
              dateText: {
                fontSize: 17,
                color: 'white'
              }
            }}
            onDateChange={(date) => {
              const st = this.state.signup;
              this.setState({
                signup: {
                  ...st,
                  birthdate: date,
                }
              })
            }}
          />
          <View style={{height: 1, width: '100%', backgroundColor: 'white'}}/>
        </View>
      );
    }
  }

  _renderAnniversary = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.anniversaryRequired) > -1){
      return (
        <View style={{flexDirection: 'column', width: '100%', marginTop: 5, marginBottom: 5}}>
          {this._renderLabel(this.state.signup.anniversary, fieldsData.anniversaryLabel || 'Anniversary Date')}
          <DatePicker
            date={this.state.signup.anniversary}
            mode="date"
            placeholder={fieldsData.anniversaryLabel || "select date"}
            format="YYYY-MM-DD"
            maxDate={new Date()}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            iconComponent={<MDIcon name={'group'} style={{fontSize: 22, color: 'white', marginRight: 10}} />}
            customStyles={{
              placeholderText:{
                fontSize: 15,
                color: 'white'
              },
              dateText: {
                fontSize: 17,
                color: 'white'
              }
            }}
            onDateChange={(date) => {
              const st = this.state.signup;
              this.setState({
                signup: {
                  ...st,
                  anniversary: date,
                }
              })
            }}
          />
          <View style={{height: 1, width: '100%', backgroundColor: 'white'}}/>
        </View>
      );
    }
  }

  _renderGender = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.genderRequired)>-1){
      return(
        <View style={{marginVertical: 10}}>
          {this._renderLabel(this.state.signup.gender,fieldsData.genderLabel || 'Gender')}
          <View style={{flexDirection: 'row', alignContent: 'center', marginVertical: 5}}>
            <MDIcon name={'group'} style={{fontSize: 22, color: 'white', marginRight: 10}} />
            <Menu
              onSelect={value => {
                const st= this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    gender: value,
                  }
                })
              }}>
              <MenuTrigger customStyles={{triggerText:{fontSize: 16, color: 'white'}}} text={this.state.signup.gender || fieldsData.genderLabel || 'Gender'} />
              <MenuOptions>
                <MenuOption value='Male' text='Male' />
                <MenuOption value='Female' text='Female' />
              </MenuOptions>
            </Menu>
          </View>
          <View style={{height: 1, width: '100%', backgroundColor: 'white'}}/>
        </View>
      );
    }
  }

  onSelectedItemsChange = selectedItems => {
    const st = this.state.signup;
    this.setState({ 
      signup: {
        ...st,
        location: selectedItems[0],
      },
    });
    console.log('selected : '+JSON.stringify(selectedItems))
  };

  _renderLocation = (fieldsData, locationData) => {
    if(this._visibleFields.indexOf(fieldsData.myLocationRequired) > -1){
      var item = [];
    locationData.map(location=>{
      var it = {
        id: location.addressID,
        name: location.locationName 
      }
      item.push(it);
    });
    return (
      <View>
        <SectionedMultiSelect
          items={item}
          uniqueKey="id"
          //selectText="Choose some things..."
          renderSelectText={()=>{
            var title = fieldsData.myLocationLabel || 'My Location';
            if(this.state.signup.location){
              item.map(i=>{
                if(i.id === this.state.signup.location){
                  title = i.name;
                }
              })
            }
            return (
              <View style={{width: '100%', marginLeft: -10, marginTop: -10}}>
                {this._renderLabel(this.state.signup.location, 'Location')}
                <View style={{flexDirection: 'row', flex: 1, marginVertical: 5, marginTop: 10}}>
                  <MDIcon name={'place'} style={{fontSize: 24, color: 'white', marginRight: 10,}} />
                  <Text style={{color: 'white', flex: 1, fontSize: 16}}>{title}</Text>
                </View>
              </View>
            )
          }}
          showChips={true}
          single={true}
          selectToggleIconComponent={()=>{
            return <MDIcon name={'keyboard-arrow-down'} style={{fontSize: 24, color: 'white'}} />
          }}
          selectedIconComponent={()=>{
            return (<MDIcon name={'check'} style={{fontSize: 20, color: 'black', marginRight: 10,}} />);
          }}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.selectedItems}
        />
        <View style={{height: 1, width: '100%', backgroundColor: 'white', marginTop: -25, marginBottom: 10}}/>
      </View>
    )
    }
  }

  _renderContactPermission = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.contactPermissionRequired) > -1) {
      return(
        <View>
          <View style={{backgroundColor: '#6b9fdb', padding: 10, justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginVertical: 5}}>
            <Text style={{fontSize: 16, color: 'white', alignItems: 'center'}}>{fieldsData.contactPermissionLabel || 'Contact Permission'}</Text>
          </View>
          <View style={{flexDirection: 'row', marginVertical: 5, marginTop: 10}}>
            <Text style={{fontSize: 16, color: 'white', flex: 3}}>Allow Email</Text>
            <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
              <Menu
                onSelect={value => {
                  const st= this.state.signup;
                  this.setState({
                    signup: {
                      ...st,
                      allowedEmail: value,
                    }
                  })
                }}>
                <MenuTrigger customStyles={{triggerText:{fontSize: 16, color: 'white', alignSelf: 'center'}}} text={this.state.signup.allowedEmail || 'No'} />
                <MenuOptions>
                  <MenuOption value='Yes' text='Yes' />
                  <MenuOption value='No' text='No' />
                </MenuOptions>
              </Menu>
              <View style={{height: 1, width: '100%', backgroundColor: 'white'}}/>
            </View>
          </View>
  
          <View style={{flexDirection: 'row', marginVertical: 5, marginTop: 10}}>
            <Text style={{fontSize: 16, color: 'white', flex: 3}}>Allow SMS</Text>
            <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
              <Menu
                onSelect={value => {
                  const st= this.state.signup;
                  this.setState({
                    signup: {
                      ...st,
                      allowedSMS: value,
                    }
                  })
                }}>
                <MenuTrigger customStyles={{triggerText:{fontSize: 16, color: 'white', alignSelf: 'center'}}} text={this.state.signup.allowedEmail || 'No'} />
                <MenuOptions>
                  <MenuOption value='Yes' text='Yes' />
                  <MenuOption value='No' text='No' />
                </MenuOptions>
              </Menu>
              <View style={{height: 1, width: '100%', backgroundColor: 'white'}}/>
            </View>
          </View>
  
          <View style={{flexDirection: 'row', marginVertical: 5, marginTop: 10}}>
            <Text style={{fontSize: 16, color: 'white', flex: 3}}>Allow Email</Text>
            <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
              <Menu
                onSelect={value => {
                  const st= this.state.signup;
                  this.setState({
                    signup: {
                      ...st,
                      preferedMedia: value,
                    }
                  })
                }}>
                <MenuTrigger customStyles={{triggerText:{fontSize: 16, color: 'white', alignSelf: 'center'}}} text={this.state.signup.allowedEmail || 'No'} />
                <MenuOptions>
                  <MenuOption value='Email' text='Email' />
                  <MenuOption value='SMS' text='SMS' />
                </MenuOptions>
              </Menu>
              <View style={{height: 1, width: '100%', backgroundColor: 'white'}}/>
            </View>
          </View>
        </View>
      );
    }
  }

  _renderTOS = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.tosAgreementRequired) > -1){
      return (
        <CheckBox
            title={fieldsData.tosAgreement}
            containerStyle={{backgroundColor: 'transparent', borderWidth: 0, justifyContent: 'flex-start', fontSize: 20}}
            textStyle={{color: 'white'}}
            checkedColor={'white'}
            uncheckedColor={'white'}
            size={24}
            checked={this.state.signup.isTOS}
            onPress={() =>{
              const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    isTOS: !this.state.signup.isTOS,
                  }
                })
              }
            }
          />
      )
    }
  }

  _showSignUp = () => {
    const {fieldsData, customData, locationData} = this.state.webFromResponse;
    if (this.state.isShowSignUp) {
      return (
        <View style={{flexDirection: 'column', width: '90%'}}>
          {this._renderMemberCardID(fieldsData)}
          {this._renderDrivingLinces(fieldsData)}
          {this._renderFirstName(fieldsData)}
          {this._renderLastName(fieldsData)}          
          {this._renderEmail(fieldsData)}
          {this._renderPhone(fieldsData)}
          {this._renderPassword(fieldsData)}
          {this._renderAddress(fieldsData)}
          {this._renderBirthDate(fieldsData)}
          {this._renderAnniversary(fieldsData)}
          {this._renderGender(fieldsData)}
          {this._renderLocation(fieldsData, locationData)}
          {this._renderContactPermission(fieldsData)}
          {this._renderTOS(fieldsData)}
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
      <MenuProvider>
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
      </MenuProvider>
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
