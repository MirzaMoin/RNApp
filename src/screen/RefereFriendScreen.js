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
  AsyncStorage,
} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import BottomNavigationTab from './../widget/BottomNavigationTab';
import apiConstant from '../api/apiConstant';
import { ShareDialog } from 'react-native-fbsdk';
import { ScreenHeader } from '../widget/ScreenHeader';
//import dynamicLinks, { firebase } from '@react-native-firebase/dynamic-links';
//import firebase
import firebase from 'react-native-firebase';
const SENDER_UID = 'USER1234';

const maxWidth = Dimensions.get('window').width;
const imageHeight = (maxWidth / 16) * 9;

class RefereFriendScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      userPoint: '0',
      inviteLink: '',
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      //loadingImage = GlobalAppModel.getLoadingImage();
      this.setState({
        isLoading: true
      });
      //this._buildLink()
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
            });
          } else {
          }
        }
      });
    } catch (error) {
      console.log(error)
    }
  };

  _ShareMessage = msg => {
    Share.share({
      message: msg.toString(),
    })
      .then(result => console.log(result))
      .catch(errorMsg => console.log(errorMsg));
  };

  _buildLink = async invitedFrom => {
    const link = `https://rrbeacon.page.link/naxz?invitedBy=${this.state.userID}&invitedFrom=${invitedFrom}`;
    const dynamicLinkDomain = 'https://rrbeacon.page.link/';
    const DynamicLink = new firebase.links.DynamicLink(link, dynamicLinkDomain);
    DynamicLink.android.setPackageName('com.rrbeacon')
    DynamicLink.android.setFallbackUrl('https://play.google.com/store/apps/details?id=com.rrbeacon')
    DynamicLink.ios.setBundleId('com.rrbeacon')
    DynamicLink.ios.setFallbackUrl('https://www.facebook.com')
    // Add ios app details.
    const generatedLink = await firebase.links().createShortDynamicLink(DynamicLink);
    //this.setState({ inviteLink: generatedLink });
    console.log(`Ìntite from : ${invitedFrom} : ${generatedLink}`)
    return generatedLink;
  }

  render() {
    const { width } = Dimensions.get('window');
    return (
      <View style={styles.container}>
        <ScreenHeader
          navigation={this.props.navigation}
          title={'Refer Friend'}
          userPoint={this.state.userPoint} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.baseScrollView}>
            <View>
              <View style={{ hegith: imageHeight, width: maxWidth }}>
                <Image
                  style={{ height: imageHeight }}
                  source={{
                    uri:
                      apiConstant.HEADER_IMAGE,
                  }}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay} />
              </View>
              <View style={{ flex: 1, marginVertical: 15, marginHorizontal: '10%' }}>
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
                    marginTop: 10,
                    minHeight: 150,
                  }}>
                  For every frind that join, you will recive $20{' '}
                </Text>
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
                  onPress={async () => {
                    const link = await this._buildLink('Self')
                    this._ShareMessage(link);
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
                  <View style={{justifyContent: 'center'}}>
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
                    Share/Copy Invite Link
                  </Text>
                  <Icon name={'share-alt'} style={{color: 'white', fontSize: 20, position: 'absolute', alignSelf: 'flex-end', margin: 10, paddingRight: 15}} />
                  </View>
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
                    style={{
                      fontSize: 18,
                      backgroundColor: '#fff',
                      fontWeight: 'bold',
                      paddingLeft: 25,
                      paddingRight: 25,
                      marginVertical: 25
                    }}>
                    Share Link with
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',

                  }}>
                  <TouchableNativeFeedback
                    onPress={async () => {
                      const link = await this._buildLink('Facebook')
                      const shareLinkContent = {
                        contentType: 'link',
                        contentUrl: link,
                        contentDescription: 'Wow, check out this great site!',
                      };
                      ShareDialog.canShow(shareLinkContent)
                        .then(function (canShow) {
                          if (canShow) {
                            return ShareDialog.show(shareLinkContent);
                          }
                        })
                        .then(
                          function (result) {
                            if (result.isCancelled) {
                              console.log('Share cancelled');
                            } else {
                              console.log('Share success with postId: ' + result.postId);
                            }
                          },
                          function (error) {
                            console.log('Share fail with error: ' + error);
                          },
                        );
                    }}>
                    <Icon
                      name={'facebook'}
                      style={{ fontSize: 35, padding: 10, color: '#3b5998' }}
                    />
                  </TouchableNativeFeedback>

                  <TouchableNativeFeedback
                    onPress={async () => {
                      const link = await this._buildLink('WhatsApp')
                      const url = `https://wa.me/?text=${link}`;
                      Linking.openURL(url);
                    }}>
                    <Icon
                      name={'whatsapp'}
                      style={{ fontSize: 35, padding: 10, color: '#4fce5d' }}
                    />
                  </TouchableNativeFeedback>

                  <TouchableNativeFeedback
                    onPress={async() => {
                      const link = await this._buildLink('Email')
                      const url = `mailto:?subject=Imvite and Earn&body=${link}`;
                      Linking.openURL(url);
                    }}>
                    <Icon
                      name={'envelope'}
                      style={{ fontSize: 35, padding: 10, color: '#b23121' }}
                    />
                  </TouchableNativeFeedback>

                  <TouchableNativeFeedback
                    onPress={ async () => {
                      try {
                        const link = await this._buildLink('Twitter')
                        const linkOpen = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Welcomer to the app click the link to install app`)}&url=${encodeURIComponent(link)}`
                        Linking.openURL(linkOpen);
                      } catch (error) {
                        console.log('Error opening link', error);
                      }
                    }}>
                    <Icon
                      name={'twitter'}
                      style={{ fontSize: 35, padding: 10, color: '#00acee' }}
                    />
                  </TouchableNativeFeedback>

                  <TouchableNativeFeedback
                    onPress={ async () => {
                      try {
                        const link = await this._buildLink('SMS')
                        const url = `sms:${Platform.OS === "ios" ? "&" : "?"}body=${link}`
                        Linking.openURL(url);
                      } catch (error) {
                        console.log(`èrror while twitting ${error}`)
                      }
                    }}>
                    <Icon
                      name={'comment-dots'}
                      style={{ fontSize: 35, padding: 10, color: '#3949ab' }}
                    />
                  </TouchableNativeFeedback>
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
