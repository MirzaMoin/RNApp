import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  Picker,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import TextInput from 'react-native-textinput-with-icons';
import ModalDropdown from 'react-native-modal-dropdown';
import {isValidEmail, isValidPhoneNo} from './../utils/utility';

export class ProfileScreen extends Component {
  constructor() {
    super();
    this.state = {
      gender: '-- Select Gender --',
      firstName: {
        value: '',
        error: '',
      },
      lastName: {
        value: '',
        error: '',
      },
      email: {
        value: '',
        error: '',
      },
      phone: {
        value: '',
        error: '',
      },
      gender: {
        value: '',
        error: '',
      },
      address: {
        value: '',
        error: '',
      },
      address2: {
        value: '',
        error: '',
      },
      address3: {
        value: '',
        error: '',
      },
      state: {
        value: '',
        error: '',
      },
      city: {
        value: '',
        error: '',
      },
      postCode: {
        value: '',
        error: '',
      },
    };
  }

  _validateData = () => {
    if (this._validateFirstName(this.state.firstName.value)) {
      return;
    }
    if (this._validateLastName(this.state.lastName.value)) {
      return;
    }
    if (this._validateEmail(this.state.email.value)) {
      return;
    }
    if (this._validateMobile(this.state.phone.value)) {
      return;
    }
    if (this._validateGender(this.state.gender.value)) {
      return;
    }
    if (this._validateAddress(this.state.address.value)) {
      return;
    }
    if (this._validateAddress2(this.state.address2.value)) {
      return;
    }
    if (this._validateAddress3(this.state.address3.value)) {
      return;
    }
    if (this._validateState(this.state.state.value)) {
      return;
    }
    if (this._validateCity(this.state.city.value)) {
      return;
    }
    if (this._validatePostCode(this.state.postCode.value)) {
      return;
    }
    alert('Data validated');
  };

  _validateFirstName = firstName => {
    if (firstName) {
      this.setState({firstName: {value: firstName, error: ''}});
      return false;
    } else {
      this.setState({firstName: {error: 'Please enter First Name'}});
      return true;
    }
  };

  _validateLastName = lastName => {
    if (lastName) {
      this.setState({lastName: {value: lastName, error: ''}});
      return false;
    } else {
      this.setState({lastName: {error: 'Please enter Last Name'}});
      return true;
    }
  };

  _validateEmail = email => {
    if (email) {
      if (isValidEmail(email)) {
        this.setState({email: {value: email, error: ''}});
        return false;
      } else {
        this.setState({email: {error: 'Please enter valid email'}});
        return true;
      }
    } else {
      this.setState({email: {error: 'Please enter email'}});
      return true;
    }
  };

  _validateMobile = mobile => {
    if (mobile) {
      if (isValidPhoneNo(mobile)) {
        this.setState({phone: {value: mobile, error: ''}});
        return false;
      } else {
        this.setState({phone: {error: 'Please enter valid Mobile'}});
        return true;
      }
    } else {
      this.setState({phone: {error: 'Please enter Mobile'}});
      return true;
    }
  };

  _validateGender = gender => {
    if (gender) {
      this.setState({gender: {error: 'Please enter Mobile'}});
      return false;
    } else {
      alert('Please select gender');
      this.setState({gender: {error: 'Please enter Mobile'}});
      return true;
    }
  };

  _validateAddress = address => {
    if (address) {
      this.setState({address: {value: address, error: ''}});
      return false;
    } else {
      this.setState({address: {error: 'Please enter Address'}});
      return true;
    }
  };

  _validateAddress2 = address => {
    if (address) {
      this.setState({address2: {value: address, error: ''}});
      return false;
    } else {
      this.setState({address2: {error: 'Please enter Address2'}});
      return true;
    }
  };

  _validateAddress3 = address => {
    if (address) {
      this.setState({address3: {value: address, error: ''}});
      return false;
    } else {
      this.setState({address3: {error: 'Please enter Address3'}});
      return true;
    }
  };

  _validateState = state => {
    if (state) {
      this.setState({state: {value: state, error: ''}});
      return false;
    } else {
      this.setState({state: {error: 'Please enter State'}});
      return true;
    }
  };

  _validateCity = city => {
    if (city) {
      this.setState({city: {value: city, error: ''}});
      return false;
    } else {
      this.setState({city: {error: 'Please enter City'}});
      return true;
    }
  };

  _validatePostCode = postCode => {
    if (postCode) {
      this.setState({postCode: {value: postCode, error: ''}});
      return false;
    } else {
      this.setState({postCode: {error: 'Please enter Post Code'}});
      return true;
    }
  };

  render() {
    const {width} = Dimensions.get('window');
    const _maxWidth = width - (width * 20) / 100;
    console.log('Width : ' + width + ' : max : ' + _maxWidth);
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        enabled={Platform.OS === 'ios' ? true : false}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.baseScrollView}>
          <View style={styles.mainContainer}>
            <Text style={[styles.title]}>Member Detail</Text>
            <View style={styles.subContainer}>
              <Image
                style={styles.profileContainer}
                source={{
                  uri:
                    'http://preview.byaviators.com/template/superlist/assets/img/tmp/agent-2.jpg',
                }}
                resizeMode="cover"
              />
              <TextInput
                label="First Name"
                leftIcon="account-outline"
                leftIconSize={20}
                leftIconType="material"
                error={this.state.firstName.error}
                onChangeText={value => {
                  this.setState({firstName: {value: value}});
                  this._validateFirstName(value);
                }}
              />
              <TextInput
                label="Last Name"
                leftIcon="account-outline"
                leftIconSize={20}
                leftIconType="material"
                error={this.state.lastName.error}
                onChangeText={value => {
                  this.setState({lastName: {value: value}});
                  this._validateLastName(value);
                }}
              />
              <TextInput
                label="Email"
                leftIcon="email-outline"
                leftIconSize={20}
                leftIconType="material"
                keyboardType="email-address"
                error={this.state.email.error}
                onChangeText={value => {
                  this.setState({email: {value: value}});
                  this._validateEmail(value);
                }}
              />
              <TextInput
                label="Mobile"
                leftIcon="phone-outline"
                leftIconSize={20}
                leftIconType="material"
                keyboardType="phone-pad"
                error={this.state.phone.error}
                onChangeText={value => {
                  this.setState({phone: {value: value}});
                  this._validateMobile(value);
                }}
              />

              <View style={{flex: 1, flexDirection: 'row', marginLeft: '8%'}}>
                <MDIcon
                  style={{
                    fontSize: 20,
                    alignSelf: 'center',
                    color: '#7a7a7a',
                  }}
                  name={'face'}
                />
                <ModalDropdown
                  style={styles.picker}
                  textStyle={{fontSize: 16}}
                  defaultValue={'Please select gender'}
                  options={['Male', 'Female']}
                  dropdownStyle={{
                    flex: 1,
                    fontSize: 20,
                    width: _maxWidth * 0.8,
                  }}
                  onSelect={(idx, value) => {
                    console.log('index : ' + idx + ' : value : ' + value);
                    this.setState({gender: {value: value}});
                  }}
                />
              </View>
              <View
                style={{
                  backgroundColor: '#959595',
                  height: 1,
                  width: _maxWidth,
                  marginTop: -10,
                }}
              />
            </View>
            <Text style={styles.title}>Member Address</Text>
            <View style={styles.subContainer}>
              <TextInput
                label="Address"
                leftIcon="home"
                leftIconSize={20}
                leftIconType="material"
                multyline={true}
                error={this.state.address.error}
                onChangeText={value => {
                  this.setState({address: {value: value}});
                  this._validateAddress(value);
                }}
              />
              <TextInput
                label="Address 2"
                leftIcon="home-outline"
                leftIconSize={20}
                leftIconType="material"
                error={this.state.address2.error}
                onChangeText={value => {
                  this.setState({address2: {value: value}});
                  this._validateAddress2(value);
                }}
              />
              <TextInput
                label="Address 3"
                leftIcon="home-outline"
                leftIconSize={20}
                leftIconType="material"
                error={this.state.address3.error}
                onChangeText={value => {
                  this.setState({address3: {value: value}});
                  this._validateAddress3(value);
                }}
              />
              <TextInput
                label="State"
                leftIcon="earth"
                leftIconSize={20}
                leftIconType="material"
                error={this.state.state.error}
                onChangeText={value => {
                  this.setState({state: {value: value}});
                  this._validateState(value);
                }}
              />
              <TextInput
                label="City"
                leftIcon="city"
                leftIconSize={20}
                leftIconType="material"
                error={this.state.city.error}
                onChangeText={value => {
                  this.setState({city: {value: value}});
                  this._validateCity(value);
                }}
              />
              <TextInput
                label="Postal code"
                leftIcon="mailbox-outline"
                leftIconSize={20}
                keyboardType="numeric"
                leftIconType="material"
                error={this.state.postCode.error}
                onChangeText={value => {
                  this.setState({postCode: {value: value}});
                  this._validatePostCode(value);
                }}
              />
            </View>
            <Text style={styles.title}>Member Permission & Preference</Text>
            <View style={styles.subContainer}>
              <TouchableOpacity
                underlayColor="#030a91"
                activeOpacity={0.8}
                style={styles.button}
                onPress={() => this._validateData()}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = {
  backgroundImage: {
    height: null,
    width: null,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  baseScrollView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    alignContent: 'stretch',
    alignSelf: 'center',
    backgroundColor: 'rgba(256,256,256,1)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  subContainer: {
    backgroundColor: 'rgba(256,256,256,0.9)',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  titleTopRadius: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    flex: 1,
    padding: 5,
    textAlign: 'center',
    backgroundColor: 'rgba(3,10,143,0.2)',
    paddingBottom: 5,
    fontSize: 15,
  },
  profileContainer: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    borderRadius: 50,
    borderColor: 'rgba(3,10,145,0.2)',
    borderWidth: 2,
  },
  button: {
    marginTop: 10,
    minWidth: 120,
    borderRadius: 10,
    alignSelf: 'center',
    maxWidth: 500,
    backgroundColor: '#030a91',
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
    color: '#ffffff',
    fontSize: 15,
    textAlign: 'center',
    margin: 8,
  },
};
