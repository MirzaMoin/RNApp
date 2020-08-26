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
import Toast from 'react-native-root-toast';

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
      signup: {
        customData: {},
      },
      signupError: {},
      customerror: {},
      isDisableEmailMenu: true,
      isDisableSMSMenu: true,
      isDisablePreferedMenu: true,
    };
    this._getStoredData();
    var today = new Date();
    this._maxDate=(today.getFullYear() -12) + "-"+ parseInt(today.getMonth()+1) +"-"+ today.getDate();
  }

  _showToast = message => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
  });
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
      
      if(isRemeber){
        this.setState({
          userName: userName,
          password: password,
          isRememberPassword: isRemeber,
        })
      }

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
      await AsyncStorage.setItem('pointBalance', response.contactData.pointBalance ? response.contactData.pointBalance.toString() : '');
      await AsyncStorage.setItem('reedemablePoints', response.contactData.reedemablePoints ? response.contactData.reedemablePoints.toString() : '');
      await AsyncStorage.setItem('firstName',response.contactData.firstName || '');
      await AsyncStorage.setItem('lastName',response.contactData.lastName || '');
      await AsyncStorage.setItem('emailAddress',response.contactData.emailAddress || '');
      await AsyncStorage.setItem('profilePitcure',response.contactData.profilePitcure || '');

      if(response.contactData.isRequiredPasswordChanged) {
        // redirect to change password
        console.log('going chang pass')
        this.props.navigation.navigate('changePassword', {
          fromLogin: true,
        });
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
        //console.log(JSON.stringify(response));
        //this.setState({isLoadingForgot: false, isTimer: true});
        if(response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          this.setState({
            isLoadingSignupform: false,
            webFromResponse: response.responsedata,
            isShowSignUp: !this.state.isShowSignUp,
          })
          this._handleContactMenu();
        }
      })
      .catch(error => console.log('error : ' + error));
  };

  _callSignup = () => {

    this.setState({isLoadingSignupform: true});

    const request ={
      contactID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      isEmailOptinConfirm: null,
      signUpType: 0,
      useOfferID: 0,
      smsProvider: null,
      totalRequiredField: null,
      isSMSOptinConfirm: null,
      firstName: this.state.signup.firstName || null,
      lastName: this.state.signup.lastName || null,
      address: this.state.signup.address || null,
      city: this.state.signup.city || null ,
      state: this.state.signup.state || null,
      zipCode: this.state.signup.postalcode || null,
      gender: this.state.signup.gender || null,
      mobilePhone: this.state.signup.mobile || null,
      emailAddress: this.state.signup.email,
      emailFormat: "HTML",
      birthDate: this.state.signup.birthdate,
      anniversary: this.state.signup.anniversary,
      isAllowEmail: this.state.signup.allowedEmail ? true : false,
      isAllowSMS: this.state.signup.allowedSMS ? true : false,
      isAllowPostalMail: this.state.signup.allowedMail ? true : false,
      preferredMediaType: this.state.signup.preferedMedia || null,
      password: this.state.signup.password || null,
      confirmPassword: this.state.signup.confirmPassword || null,
      memberCardID: this.state.signup.memberCardID || null,
      driverLicense: this.state.signup.driverLicense || null,
      addressID: this.state.signup.location || null,
      rewardProgramIDNew: '78b84a8c-7b9e-4c8c-82fd-3c9f9e32bf20',
      address2: this.state.signup.address2 || null,
      address3: this.state.signup.address3 || null,
      isAllowPush: true,
      webFormID: this.state.webformID,
      customFiledsValue: JSON.stringify(this.state.signup.customData),
      contactListID: '78b84a8c-7b9e-4c8c-82fd-3c9f9e32bf20',
    }

    console.log(`Request: ${JSON.stringify(request)}`);
    makeRequest(
      APIConstant.BASE_URL + APIConstant.SIGNUP,
      'post',
      request
    )
      .then(response => {
        console.log(JSON.stringify(response));
        this.setState({isLoadingSignupform: false});
        if(response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          this._storeSignupData(response.responsedata);
        }
      })
      .catch(error =>{
        Alert.alert('Oppss...', 'Something went wrong.');
        this.setState({isLoadingSignupform: false});
      });
  }

  // Store Login data
  _storeSignupData = async response => {
    try{
      await AsyncStorage.setItem('isLogin', JSON.stringify(true));
      await AsyncStorage.setItem('userID',response.contactData.contactID);
      await AsyncStorage.setItem('firstName', this.state.signup.firstName || '');
      await AsyncStorage.setItem('lastName', this.state.signup.lastName || '');
      await AsyncStorage.setItem('emailAddress',response.contactData.emailAddress);
      
      await AsyncStorage.setItem('pointBalance','0');
      await AsyncStorage.setItem('reedemablePoints','0');
      await AsyncStorage.setItem('profilePitcure','');

      this.props.navigation.navigate('Main',{
        loginData: response,
      });
    }catch (error) {
      console.log(error)
    }
  };

  //Manage menu selection
  _handleContactMenu = (isFromTextInput) => {
    var isAllowEmail = this.state.signup.allowedEmail || false;
    var isAllowSMS = this.state.signup.allowedSMS || false;
    var preferedMedia = this.state.signup.preferedMedia || 'SMS';
    var isDisableEmailMenu = true;
    var isDisableSMSMenu = true;
    var isDisablePreferedMenu = true;

    if (isValidPhoneNo(this.state.signup.mobile)) {
      if(isFromTextInput){
        isAllowSMS = true;
      }
      isDisableSMSMenu = false;
    } else {
      isAllowSMS = false;
      isDisableSMSMenu = true;
    }

    if (isValidEmail(this.state.signup.email)) {
      if(isFromTextInput) {
        isAllowEmail = true;
      }
      isDisableEmailMenu = false;
    } else {
      isAllowSMS = false;
      isDisableSMSMenu = true; 
    }

    if(isAllowEmail && isAllowSMS) {
      isDisablePreferedMenu = false;
    } else if (isAllowEmail) {
      isDisablePreferedMenu = true;
      preferedMedia = 'Email';
    } else if (isAllowSMS) {
      isDisablePreferedMenu = true;
      preferedMedia = 'SMS';
    } else {
      isDisablePreferedMenu = true;
      preferedMedia = 'SMS';
    }

    // setting value
    this.setState({
      isDisableEmailMenu: isDisableEmailMenu,
      isDisableSMSMenu: isDisableSMSMenu,
      isDisablePreferedMenu: isDisablePreferedMenu,
      signup: {
        ...this.state.signup,
        allowedEmail: isAllowEmail,
        allowedSMS: isAllowSMS,
        preferedMedia: preferedMedia,
      }
    })
  }

  // validating form
  _prepareSignup = () => {
    const {fieldsData, customData, locationData} = this.state.webFromResponse;
    var isCall = true;
    var signupError = {};
    var customError = {};
    //debugger;
    if(this._requireFields.indexOf(fieldsData.memberCardIDRequired) > -1){
      if(this.state.signup.memberCardID){
        signupError = {
          ...signupError,
          memberCardID: '',
        }
      } else {
        signupError = {
          ...signupError,
          memberCardID: `Please enter ${fieldsData.memberCardIDLabel || 'Member Card ID'}`
        }
        isCall=false;
      }
    }

    if(this._requireFields.indexOf(fieldsData.driverLicenseRequired) > -1){
      if(this.state.signup.driverLicense){
        if((fieldsData.maxRange == null || fieldsData.minRange == null) || (this.state.signup.driverLicense.length >= fieldsData.minRange && this.state.signup.driverLicense.length <= fieldsData.maxRange)) {
          signupError= {
            ...signupError,
            driverLicense: '',
          };
        } else {
          signupError= {
            ...signupError,
            driverLicense: `${fieldsData.driverLicense || 'Driver License'} value must contain ${fieldsData.minRange} to ${fieldsData.maxRange} character`
          }
          isCall=false;
        }
      } else {
        signupError= {
          ...signupError,
          driverLicense: `Please enter ${fieldsData.driverLicense || 'Driver License'}`
        }
        isCall = false;
      }
    }

    if(this._requireFields.indexOf(fieldsData.firstNameRequired) > -1){
      if(this.state.signup.firstName){
        signupError= {
          ...signupError,
          firstName: '',
        }
      } else {
        signupError= {
          ...signupError,
          firstName: `Please enter ${fieldsData.firstNameLabel || 'First Name'}`
        }
        isCall=false;
      }
    }

    if(this._requireFields.indexOf(fieldsData.lastNameRequired) > -1){
      if(this.state.signup.lastName){
        signupError= {
          ...signupError,
          lastName: '',
        }
      } else {
        signupError = {
          ...signupError,
          lastName: `Please enter ${fieldsData.lastNameLabel || 'Last Name'}`
        }
        isCall=false;
      }
    }

    if(this._requireFields.indexOf(fieldsData.emailRequired) > -1 || this.state.signup.email.length > 0) {
      if(this.state.signup.email && isValidEmail(this.state.signup.email)){
        signupError= {
          ...signupError,
          email: '',
        }
      } else {
        signupError = {
          ...signupError,
          email: `Please enter ${fieldsData.emailLabel || 'Email'}`
        }
        isCall=false;
      }
    }

    if(this._requireFields.indexOf(fieldsData.mobileRequired) > -1 || this.state.signup.mobile){
      if(this.state.signup.mobile && isValidPhoneNo(this.state.signup.mobile)){
        signupError= {
          ...signupError,
          mobile: '',
        }
      } else {
        signupError= {
          ...signupError,
          mobile: `Please enter ${fieldsData.mobileLabel || 'Mobile'}`
        }
        isCall=false;
      }
    }

    if(this._requireFields.indexOf(fieldsData.collectEndUserAddressRequired) > -1){
      if(this.state.signup.address){
        signupError= {
          ...signupError,
          address: '',
        }
      } else {
        signupError= {
          ...signupError,
          address: `Please enter Address`
        }
        isCall=false;
      }

      if(this.state.signup.city){
        signupError= {
          ...signupError,
          city: '',
        }
      } else {
        signupError= {
          ...signupError,
          city: `Please enter City`
        }
        isCall=false;
      }

      if(this.state.signup.state){
        signupError= {
          ...signupError,
          state: '',
        }
      } else {
        signupError= {
          ...signupError,
          state: `Please enter State`
        }
        isCall=false;
      }

      if(this.state.signup.postalcode){
        signupError= {
          ...signupError,
          postalcode: '',
        }
      } else {
        signupError= {
          ...signupError,
          postalcode: `Please enter Postal Code`
        }
        isCall=false;
      }
    }
    
    if(this._requireFields.indexOf(fieldsData.address2required) > -1){
      if(this.state.signup.address2){
        signupError= {
          ...signupError,
          address2: '',
        }
      } else {
        signupError= {
          ...signupError,
          address2: `Please enter ${fieldsData.address2 || 'Address2'}`
        }
        isCall=false;
      }
    }

    if(this._requireFields.indexOf(fieldsData.address3required) > -1){
      if(this.state.signup.address3){
        signupError= {
          ...signupError,
          address3: '',
        }
      } else {
        signupError= {
          ...signupError,
          address3: `Please enter ${fieldsData.address3 || 'Address3'}`
        }
        isCall=false;
      }
    }

    this.setState({
      signupError: signupError,
    });

    if(this._requireFields.indexOf(fieldsData.myLocationRequired) > -1){
      if(!this.state.signup.location || this.state.signup.location === '' || this.state.signup.location === undefined){
        this._showToast(`Please select ${fieldsData.myLocationLabel || 'Location'}`);
        return;
      }
    }

    if(this._requireFields.indexOf(fieldsData.birthdateRequired) > -1){
      if(!this.state.signup.birthdate || this.state.signup.birthdate === '' || this.state.signup.birthdate === undefined){
        this._showToast(`Please select ${fieldsData.birthdateLabel || 'Birth Date'}`);
        return;
      }
    }

    if(this._requireFields.indexOf(fieldsData.anniversaryRequired) > -1){
      if(!this.state.signup.anniversary || this.state.signup.anniversary === '' || this.state.signup.anniversary === undefined){
        this._showToast(`Please select ${fieldsData.anniversaryLabel || 'Anniversary'}`);
        return;
      }
    }

    if(this._requireFields.indexOf(fieldsData.genderRequired) > -1){
      if(!this.state.signup.gender || this.state.signup.gender === '' || this.state.signup.gender === undefined){
        this._showToast(`Please select ${fieldsData.genderLabel || 'Gender'}`);
        return;
      }
    }

    if(this._requireFields.indexOf(fieldsData.tosAgreementRequired) > -1){
      if(!this.state.signup.isTOS){
        this._showToast(`Please check ${fieldsData.tosAgreement || 'Terms of Service'}`);
        return;
      }
    }

    customData.map(field=>{
      if(this._requireFields.indexOf(field.requiredType) > -1 || this.state.signup.customData[field.customFieldID]){
        if(this.state.signup.customData[field.customFieldID]) {
          // hase value
          if(field.minLength > 0 && field.maxLength > 0){
            if(field.controlTypeID >= 1 && field.controlTypeID <= 3) {
              var value = this.state.signup.customData[field.customFieldID];
              if(value.length >= field.minLength && value.length <= field.maxLength) {
                customError= {
                  ...customError,
                  [field.customFieldID]: '',
                }
              } else {
                customError= {
                  ...customError,
                  [field.customFieldID]: `${field.fieldLabel} must contains ${field.minLength} to ${field.maxLength} charecter`,
                }
                isCall = false;
              }
            }
          } else {
            customError= {
              ...customError,
              [field.customFieldID]: '',
            }
          }
        } else {
          // not value
          if(field.controlTypeID >= 1 && field.controlTypeID <= 3) {
            customError= {
              ...customError,
              [field.customFieldID]: `Please Enter ${field.fieldLabel}`
            }
          } else {
            this._showToast(`Please select value of ${field.fieldLabel}`);
          }
          isCall = false;
          console.log('custom value');
        }
      }
    });

    this.setState({
      customerror: customError,
    })

    if(isCall){
      // call signup API
      this._callSignup();
    } else {
      this._showToast(`Please Select all required values`);
    }
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
              this.setState({
                signup: {
                  ...this.state.signup,
                  email: text,
                }
              }, () => this._handleContactMenu(true))
              /*var isAllowEmail = false;
              var isDisableEmailMenu = true;
              var error = '';
              var pref = 'SMS';
              if(this._requireFields.indexOf(fieldsData.emailRequired) > -1 ||text){
                if (isValidEmail(this.state.signup.email)) {
                  isAllowEmail = true;
                  isDisableEmailMenu = false;
                  error = '';
                  pref = this.state.signup.allowedSMS ? this.state.signup.preferedMedia : 'Email';
                } else {
                  isAllowEmail = false;
                  isDisableEmailMenu = true; 
                  error = `Please enter valid ${fieldsData.emailLabel || 'Email'}`;
                  pref = sms
                }                
              }
              this.setState({
                isDisableEmailMenu: isDisableEmailMenu,
                signup: {
                  ...this.state.signup,
                  email: text,
                  allowedEmail: isAllowEmail,
                  preferedMedia: pref,
                },
                signupError: {
                  ...this.state.signupError,
                  email: error
                }
              });*/
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
            keyboardType={'phone-pad'}
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
                }, () => this._handleContactMenu(true));
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
            label={'Address'}
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
            keyboardType={'numeric'}
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
        <View style={{flexDirection: 'column', marginTop: 5, marginBottom: 5}}>
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
          <View style={{height: 1, backgroundColor: 'white'}}/>
        </View>
      );
    }
  }

  _renderAnniversary = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.anniversaryRequired) > -1){
      return (
        <View style={{flexDirection: 'column', marginTop: 5, marginBottom: 5}}>
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
          <View style={{height: 1, backgroundColor: 'white'}}/>
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
          <View style={{height: 1, backgroundColor: 'white'}}/>
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
              <View style={{marginLeft: -10, marginTop: -10, flex: 1}}>
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
          selectedItems={[this.state.signup.location]}
        />
        <View style={{height: 1, backgroundColor: 'white', marginTop: -25, marginBottom: 10}}/>
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
                  }, () => this._handleContactMenu())
                }}>
                <MenuTrigger 
                  disabled={this.state.isDisableEmailMenu}
                  customStyles={{triggerText:{fontSize: 16, color: 'white', alignSelf: 'center'}}} text={this.state.signup.allowedEmail ? 'Yes' : 'No'} 
                />
                <MenuOptions>
                  <MenuOption value={true} text='Yes' />
                  <MenuOption value={false} text='No' />
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
                  },() => this._handleContactMenu())
                }}>
                <MenuTrigger
                  disabled={this.state.isDisableSMSMenu}
                  customStyles={{triggerText:{fontSize: 16, color: 'white', alignSelf: 'center'}}} text={this.state.signup.allowedSMS ? 'Yes' : 'No'} 
                />
                <MenuOptions>
                  <MenuOption value={true} text='Yes' />
                  <MenuOption value={false} text='No' />
                </MenuOptions>
              </Menu>
              <View style={{height: 1, width: '100%', backgroundColor: 'white'}}/>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginVertical: 5, marginTop: 10}}>
            <Text style={{fontSize: 16, color: 'white', flex: 3}}>Allow Prefered Media</Text>
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
                <MenuTrigger
                  disabled={this.state.isDisablePreferedMenu}
                  customStyles={{triggerText:{fontSize: 16, color: 'white', alignSelf: 'center'}}} text={this.state.signup.preferedMedia}
                />
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

  _renderCustomData = customData => {
    if(customData){
      return(
        <View style={{width: 300}}>
          {customData.map(field => {
            if(this._visibleFields.indexOf(field.requiredType) > -1){
              if (field.controlTypeID >= 1 && field.controlTypeID <= 3) {
                // text field
                // 1 -text, 2- multiline, 3- number,
                return (
                  <TextInput
                    label={field.fieldLabel}
                    labelColor="#ffffff"
                    leftIcon="receipt"
                    keyboardType={field.controlTypeID == 3 ? 'numeric' : ''}
                    multiline={field.controlTypeID == 2}
                    leftIconSize={20}
                    containerWidth={300}
                    minHeight={field.controlTypeID == 2 ? 100 : undefined}
                    maxHeight={field.controlTypeID == 2 ? 100 : undefined}
                    leftIconType="material"
                    underlineColor="#ffffff"
                    color="#ffffff"
                    labelActiveColor="#ffffff"
                    leftIconColor="#ffffff"
                    selectionColor={'#ffffff'}
                    activeColor="#ffffff"
                    rippleColor="rgba(255,255,255,2)"
                    error={this.state.customerror[field.customFieldID]}
                    onChangeText={text=>{
                      if(text){
                        const st = this.state.signup.customData;
                        this.setState({
                          signup: {
                            ...this.state.signup,
                            customData: {
                              ...this.state.signup.customData,
                              [field.customFieldID]: text,
                            }
                          },
                        });
                      }
                    }}
                  />
                );
              } else if (field.controlTypeID == 4) {
                // picklist
                var item = [];
                var possibleValue = JSON.parse(field.possibleValue);
                possibleValue.map(value=>{
                  var it = {
                    id: value,
                    name: value 
                  }
                  item.push(it);
                });
                return (
                  <View>
                    <SectionedMultiSelect
                      items={item}
                      uniqueKey="id"
                      renderSelectText={()=>{
                        var title = field.fieldLabel || 'Pick';
                        if(this.state.signup.customData[field.customFieldID]){
                          item.map(i=>{
                            if(i.id === this.state.signup.customData[field.customFieldID]){
                              title = i.name;
                            }
                          })
                        }
                        return (
                          <View style={{flex: 1, marginLeft: -10, marginTop: -10}}>
                            {this._renderLabel(this.state.signup.customData[field.customFieldID], field.fieldLabel)}
                            <View style={{flexDirection: 'row', flex: 1, marginVertical: 5, marginTop: 10}}>
                              <MDIcon name={'list'} style={{fontSize: 24, color: 'white', marginRight: 10,}} />
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
                      onSelectedItemsChange={(selectedItems) => {
                        this.setState({
                          signup: {
                            ...this.state.signup,
                            customData: {
                              ...this.state.signup.customData,
                              [field.customFieldID]: selectedItems[0],
                            }
                          }
                        })
                      }}
                      selectedItems={[this.state.signup.customData[field.customFieldID]]}
                    />
                    <View style={{height: 1, backgroundColor: 'white', marginTop: -25, marginBottom: 10}}/>
                  </View>
                )
              } else if (field.controlTypeID == 5) {
                // check box list
                var item = [];
                var possibleValue = JSON.parse(field.possibleValue);
                possibleValue.map(value=>{
                  var it = {
                    id: value,
                    name: value 
                  }
                  item.push(it);
                });
                return (
                  <View>
                    <SectionedMultiSelect
                      items={item}
                      uniqueKey="id"
                      renderSelectText={()=>{
                        var title = field.fieldLabel || 'Pick';
                        if(this.state.signup.customData[field.customFieldID]){
                          item.map(i=>{
                            if(i.id === this.state.signup.customData[field.customFieldID][0]){
                              var items = this.state.signup.customData[field.customFieldID].length;
                              title = `${i.name} ${items > 1 ?  `and ${items -1 } more ` : '' }`;
                            }
                          })
                        }
                        return (
                          <View style={{flex: 1, marginLeft: -10, marginTop: -10}}>
                            {this._renderLabel(this.state.signup.customData[field.customFieldID], field.fieldLabel)}
                            <View style={{flexDirection: 'row', flex: 1, marginVertical: 5, marginTop: 10}}>
                              <Icon name={'check-square-o'} style={{fontSize: 20, color: 'white', marginRight: 10,}} />
                              <Text style={{color: 'white', flex: 1, fontSize: 16}}>{title}</Text>
                            </View>
                          </View>
                        )
                      }}
                      selectToggleIconComponent={()=>{
                        return <MDIcon name={'keyboard-arrow-down'} style={{fontSize: 24, color: 'white'}} />
                      }}
                      selectedIconComponent={()=>{
                        return (<Icon name={'check-square-o'} style={{fontSize: 20, color: 'black', marginRight: 10,}} />);
                      }}
                      unselectedIconComponent={()=>{
                        return (<Icon name={'square-o'}  style={{fontSize: 20, color: 'black', marginRight: 10,}} />)
                      }}
                      showChips={false}
                      onSelectedItemsChange={(selectedItems) => {
                        this.setState({
                          signup: {
                            ...this.state.signup,
                            customData: {
                              ...this.state.signup.customData,
                              [field.customFieldID]: selectedItems,
                            }
                          }
                        })
                      }}
                      selectedItems={this.state.signup.customData[field.customFieldID]}
                    />
                    <View style={{height: 1, backgroundColor: 'white', marginTop: -25, marginBottom: 10}}/>
                  </View>
                )
              } else if (field.controlTypeID == 6) {
                // radio list
                var item = [];
                var possibleValue = JSON.parse(field.possibleValue);
                possibleValue.map(value=>{
                  var it = {
                    id: value,
                    name: value 
                  }
                  item.push(it);
                });
                return (
                  <View>
                    <SectionedMultiSelect
                      items={item}
                      uniqueKey="id"
                      renderSelectText={()=>{
                        var title = field.fieldLabel || 'Pick';
                        if(this.state.signup.customData[field.customFieldID]){
                          item.map(i=>{
                            if(i.id === this.state.signup.customData[field.customFieldID]){
                              title = i.name;
                            }
                          })
                        }
                        return (
                          <View style={{flex: 1, marginLeft: -10, marginTop: -10}}>
                            {this._renderLabel(this.state.signup.customData[field.customFieldID], field.fieldLabel)}
                            <View style={{flexDirection: 'row', flex: 1, marginVertical: 5, marginTop: 10}}>
                              <MDIcon name={'radio-button-checked'} style={{fontSize: 24, color: 'white', marginRight: 10,}} />
                              <Text style={{color: 'white', flex: 1, fontSize: 16}}>{title}</Text>
                            </View>
                          </View>
                        )
                      }}
                      showChips={false}
                      single={true}
                      selectToggleIconComponent={()=>{
                        return <MDIcon name={'keyboard-arrow-down'} style={{fontSize: 24, color: 'white'}} />
                      }}
                      selectedIconComponent={()=>{
                        return (<MDIcon name={'radio-button-checked'} style={{fontSize: 20, color: 'black', marginRight: 10,}} />);
                      }}
                      unselectedIconComponent={()=>{
                        return (<MDIcon name={'radio-button-unchecked'} style={{fontSize: 20, color: 'black', marginRight: 10,}} />);
                      }}
                      onSelectedItemsChange={(selectedItems) => {
                        this.setState({
                          signup: {
                            ...this.state.signup,
                            customData: {
                              ...this.state.signup.customData,
                              [field.customFieldID]: selectedItems[0],
                            }
                          }
                        })
                      }}
                      selectedItems={[this.state.signup.customData[field.customFieldID]]}
                    />
                    <View style={{height: 1, backgroundColor: 'white', marginTop: -25, marginBottom: 10}}/>
                  </View>
                )
              } else if (field.controlTypeID == 7) {
                // date picker
                return (
                  <View style={{flexDirection: 'column', marginTop: 5, marginBottom: 5}}>
                    {this._renderLabel(this.state.signup.customData[field.customFieldID], field.fieldLabel)}
                    <DatePicker
                      date={this.state.signup.customData[field.customFieldID]}
                      mode="date"
                      placeholder={field.fieldLabel || "select date"}
                      format="YYYY-MM-DD"
                      //maxDate={this._maxDate}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      iconComponent={<MDIcon name={'date-range'} style={{fontSize: 22, color: 'white', marginRight: 10}} />}
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
                        this.setState({
                          signup: {
                            ...this.state.signup,
                            customData: {
                              ...this.state.signup.customData,
                              [field.customFieldID]: date,
                            }
                          }
                        })
                      }}
                    />
                    <View style={{height: 1, width: 300, backgroundColor: 'white'}}/>
                  </View>
                );
              }
            }
          })}
        </View>
      )
    }
  }

  _showSignUp = () => {
    const {fieldsData, customData, locationData} = this.state.webFromResponse;
    if (this.state.isShowSignUp) {
      return (
        <View style={{flexDirection: 'column', width: 300}}>
          {this._renderMemberCardID(fieldsData)}
          {this._renderDrivingLinces(fieldsData)}
          {this._renderFirstName(fieldsData)}
          {this._renderLastName(fieldsData)}          
          {this._renderEmail(fieldsData)}
          {this._renderPhone(fieldsData)}
          {this._renderPassword(fieldsData)}
          {this._renderAddress(fieldsData)}
          {this._renderLocation(fieldsData, locationData)}
          {this._renderBirthDate(fieldsData)}
          {this._renderAnniversary(fieldsData)}
          {this._renderGender(fieldsData)}
          {this._renderCustomData(customData)}
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
      this._prepareSignup();
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
