import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableNativeFeedback,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  TextInput,
  Share,
  Linking,
} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomNavigationTab  from './../widget/BottomNavigationTab';
import apiConstant from '../api/apiConstant';
import { ScreenHeader } from '../widget/ScreenHeader';
//import dynamicLinks, { firebase } from '@react-native-firebase/dynamic-links';
//import firebase
import firebase from 'react-native-firebase';
const SENDER_UID = 'USER1234';

class RefereFriendScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state={
      userPoint: '',
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      loadingImage = GlobalAppModel.getLoadingImage();
      this.setState({
        isLoading: true
      });
      this._getStoredData();
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  _getStoredData = async () => {
    try {
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

      await AsyncStorage.getItem('webformID', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          //const val = JSON.parse(value);
          if (value) {
            this.setState({
              webformID: value,
            }, () => { this._callRPGData() });
          } else {
          }
        }
      });
    } catch (error) {
      console.log(error)
    }
  };

  static navigationOptions = props => {
    return {
      drawerLockMode: 'locked-closed',
    };
  };
  _ShareMessage = msg => {
    Share.share({
      message: msg.toString(),
    })
      .then(result => console.log(result))
      .catch(errorMsg => console.log(errorMsg));
  };

   _buildLink = async () => {
    /*const link = await dynamicLinks().buildLink({
      link: 'https://rrbeacon.page.link/naxz',
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: 'https://rrbeacon.page.link/',
      // optional set up which updates Firebase analytics campaign
      // "banner". This also needs setting up before hand
      analytics: {
        campaign: 'banner',
      },
    });
  
    return link;*/
    console.log(`strat`)
    const link = `https://rrbeacon.page.link/naxz?invitedBy=${SENDER_UID}`;
    console.log(`strat 1`)
    const dynamicLinkDomain = 'https://rrbeacon.page.link/';
    console.log(`strat 2`)
    //call  DynamicLink constructor
    const DynamicLink = new firebase.links.DynamicLink(link, dynamicLinkDomain);
    DynamicLink.android.setPackageName('com.rrbeacon')
    DynamicLink.android.setFallbackUrl('https://play.google.com/store/apps/details?id=com.rrbeacon')
    DynamicLink.ios.setBundleId('com.rrbeacon')
    
    console.log(`strat 3`)
    //get the generatedLink
    const generatedLink = await firebase.links().createDynamicLink(DynamicLink);
    console.log('created link', generatedLink);
  }

  render() {
    const { width } = Dimensions.get('window');
    return (
      <View style={styles.container}>
        <ScreenHeader
          navigation={this.props.navigation}
          title={'Rewards Entry Goal'}
          userPoint={this.state.userPoint} />
        <View style={{ hegith: 150 }}>
          <Image
            style={{ height: 150 }}
            source={{
              uri:
                apiConstant.HEADER_IMAGE,
            }}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.baseScrollView}>
            <View>
              <View style={{ flex: 1, marginTop: 15 }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 24,
                    fontWeight: 'bold',
                  }}>
                  Invite Your Friend
                </Text>
                <Text
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    textAlign: 'center',
                    marginTop: 5,
                    minHeight: 150,
                  }}>
                  For every frind that join, you will recive $20{' '}
                </Text>
                {/*<Image
                  style={{flex: 1, height: 200, width: undefined}}
                  source={require('./../../Image/referre_friend.jpg')}
                  resizeMode="center"
                />*/}
                <TouchableNativeFeedback
                  style={{
                    marginLeft: 10,
                    marginRight: 10,
                    width: undefined,
                    marginTop: 10,
                    marginBottom: 20,
                    alignSelf: 'center',
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    this._ShareMessage('hello firend sw');
                    // Linking.canOpenURL('mailto:example@gmail.com?subject=example&body=example')
                    //   .then(supported => {
                    //     if (!supported) {
                    //       console.log('Cant handle url')
                    //     } else {
                    //       return Linking.openURL('message:this is frial')
                    //     }
                    //   })
                    //   .catch(err => {
                    //     console.error('An error occurred', err)
                    //   })
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      backgroundColor: '#012340',
                      textAlign: 'center',
                      fontSize: 16,
                      borderRadius: 10,
                      color: 'white',
                      padding: 15,
                    }}>
                    Get Invite Link
                  </Text>
                </TouchableNativeFeedback>
                <View
                  style={{
                    marginTop: 10,
                    marginLeft: 10,
                    marginRight: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      position: 'absolute',
                    }}>
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: 'rgba(153,153,153,0.5)',
                        height: 2,
                      }}
                    />
                  </View>
                  <Text
                    onPress={()=>{
                      this._buildLink()
                      console.log(`Somethig : `)
                    }}
                    style={{
                      fontSize: 18,
                      backgroundColor: '#fff',
                      fontWeight: 'bold',
                      paddingLeft: 25,
                      paddingRight: 25,
                    }}>
                    Share with Link
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginTop: 10,
                    justifyContent: 'center',
                  }}>
                  <Icon
                    name={'facebook'}
                    style={{ fontSize: 25, margin: 10, color: '#3b5998' }}
                  />
                  <Icon
                    name={'whatsapp'}
                    style={{ fontSize: 25, margin: 10, color: '#4fce5d' }}
                  />
                  <MDIcon
                    name={'mail-outline'}
                    style={{ fontSize: 27, margin: 10, color: '#b23121' }}
                  />
                  <Icon
                    name={'twitter'}
                    style={{ fontSize: 25, margin: 10, color: '#00acee' }}
                  />
                  <Icon
                    name={'commenting-o'}
                    style={{ fontSize: 25, margin: 10, color: 'blue' }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        <BottomNavigationTab />
      </View>
    );
  }
}

export default RefereFriendScreen;

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'rgba(256,256,256,1)',
  },
  baseScrollView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saprator: {
    backgroundColor: '#808080',
    flex: 1,
    height: 1,
  },
  mainContainer: {
    flex: 1,
    alignContent: 'stretch',
    alignSelf: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  messageContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    backgroundColor: 'rgba(256,256,256,1)',
  },
  profileContainer: {
    marginRight: 10,
    marginLeft: 10,
    height: 50,
    width: 50,
    borderRadius: 25,
    borderColor: 'rgba(3,10,145,0.2)',
    borderWidth: 2,
    alignSelf: 'center',
  },
};
