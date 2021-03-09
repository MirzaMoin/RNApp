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
const { width } = Dimensions.get("window");
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import SwipeButton from 'rn-swipe-button';
import { SliderBox } from "react-native-image-slider-box";
import Carousel, { Pagination } from 'react-native-snap-carousel';

// const TotalWidth = width - (width * 1) / 100;
const TotalWidth = width - 20
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
      images: [
        "https://source.unsplash.com/1024x768/?nature",
        "https://source.unsplash.com/1024x768/?water",
        "https://source.unsplash.com/1024x768/?sky",
        "https://source.unsplash.com/1024x768/?tree",
        "https://source.unsplash.com/1024x768/?fire",
        "https://source.unsplash.com/1024x768/?bird",
        "https://source.unsplash.com/1024x768/?dog",
        "https://source.unsplash.com/1024x768/?music",
      ],
      opv: 1,
      activeIndex: 0,
      carouselItems: [
        {
          title: "",
          text: "",
          image: "https://source.unsplash.com/1024x768/?water",
        },
        {
          title: "",
          text: "",
          image: "https://source.unsplash.com/1024x768/?fire",
        },
        {
          title: "",
          text: "",
          image: "https://source.unsplash.com/1024x768/?music",
        },
        {
          title: "",
          text: "",
          image: "https://source.unsplash.com/1024x768/?sky",
        },
        {
          title: "",
          text: "",
          image: "https://source.unsplash.com/1024x768/?tree",
        },
      ]
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
  _renderIcon = () => this.state.isProcessing ? <ActivityIndicator color={'#012345'} /> : <MDIcon name="keyboard-arrow-right" size={30} />;


  _renderButton = () => {
    return (
      <View style={{
        marginTop: 20,
        width: '90%',
        marginHorizontal: 5
      }}>
        <SwipeButton
          thumbIconBackgroundColor="#FFFFFF"
          containerStyle={{ backgroundColor: '#012345' }}
          swipeSuccessThreshold={90}
          thumbIconComponent={this._renderIcon}
          title="Change Password"
          titleColor={'white'}
          railBackgroundColor={'#012345'}
          railFillBackgroundColor={'green'}
          shouldResetAfterSuccess
          disabled={this.state.isProcessing}
          onSwipeSuccess={() => {
            this._prepareForm()
          }}
        />
      </View>
    )
  }
  _renderItem({ item, index }) {
    that = this
    return (
      <View style={{
        backgroundColor: 'floralwhite',
        borderRadius: 5,
        height: '100%',
      }}>
        <TouchableOpacity onPress={() => { console.log("item pressed " + index + " active ") }} style={{ height: '100%', width: '100%', opacity: 1 }}>
          <Image source={{ uri: item.image }} style={{ height: '100%', width: "100%", position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
          {/* <Text style={{ fontSize: 30 }}>{item.title}</Text>
          <Text>{item.text}</Text> */}
        </TouchableOpacity>
      </View>

    )
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <ScreenHeader
            navigation={this.props.navigation}
            title={'Change Password'}
            userPoint={GlobalAppModel.redeemablePoint} />
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            enabled={Platform.OS === 'ios' ? true : false}>
            <ScrollView>
              <View style={{ hegith: imageHeight / 1.5 }}>
                {false ? <Image
                  style={{ height: imageHeight / 1.5, opacity: .5 }}
                  source={{
                    uri:
                      APIConstant.HEADER_IMAGE,
                  }}
                  resizeMode="cover"
                />
                  :
                  <View style={{ flex: 1, justifyContent: 'center', height: imageHeight / 1.5 }}>
                    <Carousel
                      autoplay
                      loop
                      // autoplayDelay={1000}
                      layout={'stack'}
                      ref={ref => this.carousel = ref}
                      data={this.state.carouselItems}
                      sliderWidth={maxWidth}
                      itemWidth={maxWidth}
                      renderItem={this._renderItem}
                      onSnapToItem={index => { this.setState({ activeIndex: index }) }}
                    />
                    <Pagination
                      dotsLength={this.state.carouselItems.length}
                      activeDotIndex={this.state.activeIndex}
                      containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.01)', position: 'absolute', bottom: 0, left: 0, right: 0 }}
                      dotStyle={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginHorizontal: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.92)'
                      }}
                      inactiveDotStyle={{
                        // Define styles for inactive dots here
                      }}
                      inactiveDotOpacity={0.4}
                      inactiveDotScale={0.6}
                    />
                  </View>
                  // <SliderBox
                  //   images={this.state.images}
                  //   onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                  //   currentImageEmitter={index => { index == 2 ? this.setState({ opv: .2 }) : this.setState({ opv: 1 }) , console.log("index " + index + " opv " + this.state.opv) }}
                  //   dotColor="white"
                  //   inactiveDotColor="#90A4AE"
                  //   autoplay
                  //   circleLoop
                  //   // resizeMethod={'resize'}
                  //   // resizeMode={'cover'}
                  //   paginationBoxStyle={{
                  //     position: "absolute",
                  //     bottom: 0,
                  //     padding: 0,
                  //     alignItems: "center",
                  //     alignSelf: "center",
                  //     justifyContent: "center",
                  //     paddingVertical: 20
                  //   }}
                  //   dotStyle={{
                  //     width: 10,
                  //     height: 10,
                  //     borderRadius: 5,
                  //     marginHorizontal: 0,
                  //     padding: 0,
                  //     margin: 0,
                  //     backgroundColor: "rgba(128, 128, 128, 0.8)"
                  //   }}
                  //   ImageComponentStyle={{ borderRadius: 0, marginTop: 0, height: imageHeight / 1.5, opacity: this.state.opv }}
                  //   imageLoadingColor="#2196F3"
                  // />
                }
              </View>
              <View style={styles.MainContainer}>
                <TextInput
                  label="Current Password"
                  leftIcon="key"
                  leftIconSize={20}
                  containerWidth={TotalWidth - 20}
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
                  containerWidth={TotalWidth - 20}
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
                  containerWidth={TotalWidth - 20}
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
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>);
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: 10,
    alignItems: 'center',
    // backgroundColor:'lime'
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