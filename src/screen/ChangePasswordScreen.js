import React, { Component } from 'react';
import { StyleSheet, View, Text, AsyncStorage, Platform, KeyboardAvoidingView, ActivityIndicator, Alert, Image, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import TextInput from 'react-native-textinput-with-icons';
import { makeRequest } from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import { ScreenHeader } from '../widget/ScreenHeader';
import { TouchableOpacity } from 'react-native-gesture-handler';
import GlobalAppModel from '../model/GlobalAppModel';
const maxWidth = Dimensions.get('window').width;
const imageHeight = (maxWidth / 16) * 9;

export default class ChangePassword extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      isShowPassword: false,
      isShowNewPassword: false,
      isShowConfirmPassword: false,
      isProcessing: false,
      password: '',
      newPassword: '',
      confirmPassword: '',
      passwordError: '',
      newPasswordError: '',
      confirmPasswordError: '',
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({
        isShowPassword: false,
        isShowNewPassword: false,
        isShowConfirmPassword: false,
        isProcessing: false,
        password: '',
        newPassword: '',
        confirmPassword: '',
        passwordError: '',
        newPasswordError: '',
        confirmPasswordError: '',
      });
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  _prepareForm = () => {
    var isCall = true;
    if (this.state.password) {
      this.setState({
        passwordError: ''
      })
    } else {
      this.setState({
        passwordError: 'Please enter current password'
      });
      isCall = false;
    }

    if (this.state.newPassword) {
      if (this.state.password === this.state.newPassword) {
        this.setState({
          passwordError: '',
          newPasswordError: 'Please enter another password',
        })
        isCall = false;
      } else {
        if (this.state.confirmPassword) {
          if (this.state.newPassword === this.state.confirmPassword) {
            this.setState({
              passwordError: '',
              newPasswordError: '',
              confirmPasswordError: '',
              isProcessing: true,
            });
          } else {
            this.setState({
              passwordError: '',
              newPasswordError: 'Password does not match',
              confirmPasswordError: 'Password does not match',
            })
            isCall = false;
          }
        } else {
          this.setState({
            confirmPasswordError: 'Please enter confirm password',
            newPasswordError: ''
          });
          isCall = false;
        }
      }
    } else {
      this.setState({
        newPasswordError: 'Please enter new password'
      });
      isCall = false;
    }

    if (isCall) {
      this._callChangePassword();
    }
  }

  _callChangePassword = () => {
    const request = {
      contactID: GlobalAppModel.userID,
      webFormID: GlobalAppModel.webFormID,
      rpToken: APIConstant.RPTOKEN,
      oldPassword: this.state.password,
      newPassword: this.state.newPassword,
    }
    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.CHANGE_PASSWORD}`,
      'post',
      request,
    )
      .then(response => {
        console.log(JSON.stringify(response));
        this.setState({ isProcessing: false });
        if (response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          Alert.alert('Success', response.statusMessage, [
            { text: 'Login', onPress: this._processFurther }
          ]);
        }
      })
      .catch(error => console.log('error : ' + error));
  }

  _processFurther = async () => {
    try {
      await AsyncStorage.setItem('isLogin', JSON.stringify(false));
    } catch (error) {
      // Error saving data
    }
    console.log('right Navigation : ' + this.props);
    this.props.navigation.navigate('Auth');
  }

  _renderButton = () => {
    if (this.state.isProcessing) {
      return <ActivityIndicator size={'large'} style={{ margin: 20 }} />
    } else {
      return (
        <TouchableOpacity
          underlayColor="#030a91"
          activeOpacity={0.8}
          style={styles.button}
          onPress={() => this._prepareForm()}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      );
    }
  }

  render() {
    console.log(`color : ${GlobalAppModel.primaryButtonColor}`)
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <ScreenHeader
            navigation={this.props.navigation}
            title={'Change Password'}
            userPoint={GlobalAppModel.redeemablePoint} />
          {/* <KeyboardAvoidingView
            style={{flex:1}}
            behavior="padding"
            enabled={Platform.OS === 'ios' ? true : false}> */}
          <ScrollView>
            <View style={{ hegith: imageHeight }}>
              <Image
                style={{ height: imageHeight }}
                source={{
                  uri:
                    APIConstant.HEADER_IMAGE,
                }}
                resizeMode="cover"
              />
              {/* <View style={styles.imageOverlay} /> */}
            </View>
            <View style={styles.MainContainer}>
              <TextInput
                label="Current Password"
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
                selectionColor={'gray'}
                labelActiveColor={'#012345'}
                labelColor={'gray'}
                underlineColor={'gray'}
                rightIconColor={'gray'}
                color={'gray'}
                secureTextEntry={this.state.isShowPassword}
                leftIconColor={'gray'}
                rippleColor="rgba(255,255,255,70)"
                activeColor={'#012345'}
                onPressRightIcon={() => this.setState({ isShowPassword: !this.state.isShowPassword })}
                value={this.state.password}
                error={this.state.passwordError}
                onChangeText={text => {
                  this.setState({
                    password: text
                  });
                }} />

              <TextInput
                label="New Password"
                leftIcon="key"
                leftIconSize={20}
                containerWidth={300}
                leftIconType="material"
                rightIcon={
                  !this.state.isShowNewPassword ? 'eye-off-outline' : 'eye-outline'
                }
                rightIconSize={20}
                paddingRight={30}
                rightIconType="material"
                selectionColor={'gray'}
                labelActiveColor={'#012345'}
                labelColor={'gray'}
                underlineColor={'gray'}
                rightIconColor={'gray'}
                color={'gray'}
                secureTextEntry={this.state.isShowNewPassword}
                leftIconColor={'gray'}
                rippleColor="rgba(255,255,255,70)"
                activeColor={'#012345'}
                onPressRightIcon={() => this.setState({ isShowNewPassword: !this.state.isShowNewPassword })}
                value={this.state.newPassword}
                error={this.state.newPasswordError}
                onChangeText={text => {
                  this.setState({
                    newPassword: text
                  });
                }} />

              <TextInput
                label="Confirm Password"
                leftIcon="key"
                leftIconSize={20}
                containerWidth={300}
                leftIconType="material"
                rightIcon={
                  !this.state.isShowConfirmPassword ? 'eye-off-outline' : 'eye-outline'
                }
                rightIconSize={20}
                paddingRight={30}
                rightIconType="material"
                selectionColor={'gray'}
                labelActiveColor={'#012345'}
                labelColor={'gray'}
                underlineColor={'gray'}
                rightIconColor={'gray'}
                color={'gray'}
                secureTextEntry={this.state.isShowConfirmPassword}
                leftIconColor={'gray'}
                rippleColor="rgba(255,255,255,70)"
                activeColor={'#012345'}
                onPressRightIcon={() => this.setState({ isShowConfirmPassword: !this.state.isShowConfirmPassword })}
                value={this.state.confirmPassword}
                error={this.state.confirmPasswordError}
                onChangeText={text => {
                  this.setState({
                    confirmPassword: text
                  });
                }} />

              {this._renderButton()}
            </View>
          </ScrollView>{/* </KeyboardAvoidingView> */}
        </View>
      </SafeAreaView>);
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
  },
  button: {
    minWidth: 120,
    marginTop: 20,
    borderRadius: 10,
    padding: 5,
    alignSelf: 'center',
    backgroundColor: GlobalAppModel.primaryButtonColor || '#012345',
  },
  picker: {
    flex: 1,
    height: 55,
    alignContent: 'flex-end',
    alignSelf: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    margin: 8,
    marginHorizontal: 15
  }
});