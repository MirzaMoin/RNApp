import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  AsyncStorage,
  Alert,
  ActivityIndicator
} from 'react-native';
import { BottomNavigationTab } from './../widget/BottomNavigationTab';
import TextInput from 'react-native-textinput-with-icons';
import { isValidEmail, isValidPhoneNo } from './../utils/utility';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
import { Card } from 'react-native-elements';
import { makeRequest } from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import GlobalAppModel from './../model/GlobalAppModel';
import { ScreenHeader } from '../widget/ScreenHeader';

export default class ContactUs extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    console.log('Constructor called');
    super();
    this.state = {
      title: 'HomeScreen',
      tabIndex: 1,
      firstName: '',
      errorFirstName: '',
      lastName: '',
      errorLastName: '',
      email: '',
      errorEmail: '',
      mobile: '',
      errorMobile: '',
      message: '',
      errorMessage: '',
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this._getStoredData();
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  _getStoredData = async () => {
    try {
      await AsyncStorage.getItem('reedemablePoints', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          if (value) {
            this.setState({
              userPoint: value,
            })
          }
        }
      });

      await AsyncStorage.getItem('userID', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          //const val = JSON.parse(value);
          if (value) {
            this.setState({
              userID: value,
            })
          }
        }
      });

      await AsyncStorage.getItem('webformID', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          //const val = JSON.parse(value);
          if (value) {
            this.setState({
              webformID: value,
            })
          } else {
          }
        }
      });
    } catch (error) {
      console.log(error)
    }
  };

  _validateData = () => {
    if (this._validateFirstName(this.state.firstName)) {
      return;
    }
    if (this._validateLastName(this.state.lastName)) {
      return;
    }
    if (this._validateEmail(this.state.email)) {
      return;
    }
    if (this._validateMobile(this.state.mobile)) {
      return;
    }
    if (this._validateMessage(this.state.message)) {
      return;
    }
    this.setState({isLoading: true})
    this._callSubmitContatUsData()
  };

  _validateFirstName = firstName => {
    if (firstName) {
      this.setState({ errorFirstName: '' });
      return false;
    } else {
      this.setState({ errorFirstName: 'Please Enter First name' });
      return true;
    }
  };

  _validateLastName = lastName => {
    if (lastName) {
      this.setState({ errorLastName: '' });
      return false;
    } else {
      this.setState({ errorLastName: 'Please Enter Last name' });
      return true;
    }
  };

  _validateEmail = email => {
    if (email) {
      if (!isValidEmail(email)) {
        this.setState({ errorEmail: 'Please Enter valid Email' });
        return true;
      } else {
        this.setState({ errorEmail: '' });
        return false;
      }
    } else {
      this.setState({ errorEmail: 'Please Enter Email' });
      return true;
    }
  };

  _validateMobile = mobile => {
    if (mobile) {
      if (isValidPhoneNo(mobile)) {
        this.setState({ errorMobile: '' });
        return false;
      } else {
        this.setState({ errorMobile: 'Please Enter valid Mobile' });
        return true;
      }
    } else {
      this.setState({ errorMobile: 'Please Enter Mobile' });
      return true;
    }
  };

  _validateMessage = message => {
    if (message) {
      this.setState({ errorMessage: '' });
      return false;
    } else {
      this.setState({ errorMessage: 'Please Enter Message' });
      return true;
    }
  };

  _callSubmitContatUsData = () => {

    const request = {
      rewardProgramID: APIConstant.RPID,
      webFormID: this.state.webformID,
      contactID: this.state.userID,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      emailId: this.state.email,
      mobileNo: this.state.mobile,
      message: this.state.message
    }

    console.log(`Reques: ${JSON.stringify(request)}`);

    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.SUBMIT_CONTACT_US}`,
      'post',
      request
    )
      .then(response => {
        //console.log(JSON.stringify(response));
        this.setState({ isLoading: false });
        if (response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          this.setState({
            email: '',
            mobile: '',
            firstName: '',
            lastName: '',
            message: '',
          });
          Alert.alert('Success.', response.statusMessage);
        }
      })
      .catch(error => console.log('error : ' + error));
  }

  _renderSubmitButton = () => {
    if(this.state.isLoading) {
      return <ActivityIndicator style={{marginTop: 10}} size={30} />
    } else {
      return <TouchableOpacity
      style={styles.buttonContainer}
      onPress={() => this._validateData()}>
      <Text style={styles.button}>Send Message</Text>
    </TouchableOpacity> 
    }

  }

  render() {
    const { width, height } = Dimensions.get('window');
    const maxWidth = (width - (width * 20) / 100) / 2 - width * 0.015;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScreenHeader
          navigation={this.props.navigation}
          title={'Contact Us'}
          userPoint={this.state.userPoint} />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
          enabled={Platform.OS === 'ios' ? true : false}>
          <View style={styles.mainContainer}>
            <ScrollView 
              keyboardShouldPersistTaps={true}
              showsVerticalScrollIndicator={false} 
              bounces={false}>
              <View style={{ flexDirection: 'column', flex: 1 }}>
                <Card
                  containerStyle={{ padding: 0, margin: 0, elevation: 5 }}
                  style={{ hegith: height * 0.35 }}>
                  <MapView
                    style={{ height: height * 0.35 }}
                    zoomEnabled={false}
                    zoomTapEnabled={false}
                    scrollEnabled={false}
                    pitchEnabled={false}
                    initialRegion={{
                      latitude: 37.78825,
                      longitude: -122.4324,
                      latitudeDelta: 0.0522,
                      longitudeDelta: 0.0121,
                    }}>
                    <Marker
                      ref={marker => {
                        this.marker = marker;
                      }}
                      coordinate={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                      }}
                      tracksViewChanges={true}
                      title={'Primary Location'}
                      description={
                        'This is Primary Locaiton for this business from where you can contact us'
                      }
                    />
                  </MapView>
                </Card>

                <View style={styles.formContainer}>
                  <View style={styles.nameContainer}>
                    <View style={{ marginRight: '2%' }}>
                      <TextInput
                        label="First Name"
                        leftIcon="account-outline"
                        leftIconSize={20}
                        containerWidth={maxWidth}
                        value={this.state.firstName}
                        leftIconType="material"
                        error={this.state.errorFirstName}
                        onChangeText={firstName => {
                          this.setState({ firstName: firstName });
                          this._validateFirstName(firstName);
                        }}
                      />
                    </View>

                    <View style={{ marginLeft: '2%' }}>
                      <TextInput
                        label="Last Name"
                        leftIcon="account-outline"
                        leftIconSize={20}
                        containerWidth={maxWidth}
                        leftIconType="material"
                        value={this.state.lastName}
                        error={this.state.errorLastName}
                        onChangeText={lastName => {
                          this.setState({ lastName: lastName });
                          this._validateLastName(lastName);
                        }}
                      />
                    </View>
                  </View>
                  <TextInput
                    label="Email address"
                    leftIcon="email-outline"
                    leftIconSize={20}
                    leftIconType="material"
                    value={this.state.email}
                    error={this.state.errorEmail}
                    keyboardType="email-address"
                    onChangeText={email => {
                      this.setState({ email: email });
                      this._validateEmail(email);
                    }}
                  />
                  <TextInput
                    label="Mobile"
                    leftIcon="phone-outline"
                    leftIconSize={20}
                    leftIconType="material"
                    keyboardType="phone-pad"
                    value={this.state.mobile}
                    error={this.state.errorMobile}
                    onChangeText={mobile => {
                      this.setState({ mobile: mobile });
                      this._validateMobile(mobile);
                    }}
                  />
                  <TextInput
                    label="Message"
                    leftIcon="message-outline"
                    leftIconSize={20}
                    containerheight={320}
                    leftIconType="material"
                    numberOfLines={5}
                    multiline={true}
                    height={100}
                    value={this.state.message}
                    error={this.state.errorMessage}
                    onChangeText={message => {
                      this.setState({ message: message });
                      this._validateMessage(message);
                    }}
                  />
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    {this._renderSubmitButton()}
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = {
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(256,256,256,1)',
  },
  baseScrollView: {
    flex: 1,
    flexDirection: 'row',
  },
  formContainer: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    padding: 5,
    marginTop: 5,
  },
  imageOverlay: {
    height: 200,
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.10)',
  },
  nameContainer: {
    flexDirection: 'row',
    marginLeft: '8%',
    marginRight: '8%',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstNameContainer: {
    flex: 1,
    marginRight: '1%',
    borderColor: 'rgba(153,153,153,0.5)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputContainer: {
    marginLeft: '8%',
    marginRight: '8%',
    borderColor: 'rgba(153,153,153,0.5)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastNameContainer: {
    flex: 1,
    marginLeft: '1%',
    borderColor: 'rgba(153,153,153,0.5)',
    borderWidth: 2,
  },
  textInput: {
    marginLeft: 10,
    marginRight: 10,
  },
  buttonContainer: {
    marginLeft: '25%',
    marginRight: '25%',
    width: undefined,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    backgroundColor: '#012340',
    textAlign: 'center',
    fontSize: 16,
    borderRadius: 10,
    color: 'white',
    padding: 15,
  },
};
