import React, {Component} from 'react';
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
} from 'react-native';
import {BottomNavigationTab} from './../widget/BottomNavigationTab';
import TextInput from 'react-native-textinput-with-icons';
import {isValidEmail, isValidPhoneNo} from './../utils/utility';
import MapView, {AnimatedRegion, Marker} from 'react-native-maps';
import {Card} from 'react-native-elements';

export default class ContactUs extends Component {
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
    alert('Data validated');
  };

  _validateFirstName = firstName => {
    if (firstName) {
      this.setState({errorFirstName: ''});
      return false;
    } else {
      this.setState({errorFirstName: 'Please Enter First name'});
      return true;
    }
  };

  _validateLastName = lastName => {
    if (lastName) {
      this.setState({errorLastName: ''});
      return false;
    } else {
      this.setState({errorLastName: 'Please Enter Last name'});
      return true;
    }
  };

  _validateEmail = email => {
    if (email) {
      if (!isValidEmail(email)) {
        this.setState({errorEmail: 'Please Enter valid Email'});
        return true;
      } else {
        this.setState({errorEmail: ''});
        return false;
      }
    } else {
      this.setState({errorEmail: 'Please Enter Email'});
      return true;
    }
  };

  _validateMobile = mobile => {
    if (mobile) {
      if (isValidPhoneNo(mobile)) {
        this.setState({errorMobile: ''});
        return false;
      } else {
        this.setState({errorMobile: 'Please Enter valid Mobile'});
        return true;
      }
    } else {
      this.setState({errorMobile: 'Please Enter Mobile'});
      return true;
    }
  };

  _validateMessage = message => {
    if (message) {
      this.setState({errorMessage: ''});
      return false;
    } else {
      this.setState({errorMessage: 'Please Enter Message'});
      return true;
    }
  };

  render() {
    const {width, height} = Dimensions.get('window');
    const maxWidth = (width - (width * 20) / 100) / 2 - width * 0.015;
    return (
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior="padding"
          enabled={Platform.OS === 'ios' ? true : false}>
          <View style={styles.mainContainer}>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              <View style={{flexDirection: 'column', flex: 1}}>
                <Card
                  containerStyle={{padding: 0, margin: 0, elevation: 5}}
                  style={{hegith: height * 0.35}}>
                  <MapView
                    style={{height: height * 0.35}}
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
                    <View style={{marginRight: '2%'}}>
                      <TextInput
                        label="First Name"
                        leftIcon="account-outline"
                        leftIconSize={20}
                        containerWidth={maxWidth}
                        leftIconType="material"
                        error={this.state.errorFirstName}
                        onChangeText={firstName => {
                          this.setState({firstName: firstName});
                          this._validateFirstName(firstName);
                        }}
                      />
                    </View>

                    <View style={{marginLeft: '2%'}}>
                      <TextInput
                        label="Last Name"
                        leftIcon="account-outline"
                        leftIconSize={20}
                        containerWidth={maxWidth}
                        leftIconType="material"
                        error={this.state.errorLastName}
                        onChangeText={lastName => {
                          this.setState({lastName: lastName});
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
                    error={this.state.errorEmail}
                    keyboardType="email-address"
                    onChangeText={email => {
                      this.setState({email: email});
                      this._validateEmail(email);
                    }}
                  />
                  <TextInput
                    label="Mobile"
                    leftIcon="phone-outline"
                    leftIconSize={20}
                    leftIconType="material"
                    keyboardType="phone-pad"
                    error={this.state.errorMobile}
                    onChangeText={mobile => {
                      this.setState({mobile: mobile});
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
                    error={this.state.errorMessage}
                    onChangeText={message => {
                      this.setState({message: message});
                      this._validateMessage(message);
                    }}
                  />
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <TouchableOpacity
                      style={styles.buttonContainer}
                      onPress={() => this._validateData()}>
                      <Text style={styles.button}>Send Message</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
            <BottomNavigationTab />
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
    fontFamily: 'helvetica',
    fontSize: 16,
    borderRadius: 10,
    color: 'white',
    padding: 15,
  },
};
