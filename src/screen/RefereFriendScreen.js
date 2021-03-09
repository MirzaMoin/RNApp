import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  Share,
  Linking,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import BottomNavigationTab from './../widget/BottomNavigationTab';
import apiConstant from '../api/apiConstant';
import { ShareDialog } from 'react-native-fbsdk';
import { ScreenHeader } from '../widget/ScreenHeader';
import firebase from 'react-native-firebase';
import GlobalAppModel from '../model/GlobalAppModel';

const maxWidth = Dimensions.get('window').width;
const imageHeight = (maxWidth / 16) * 9;

export default class RefereFriendScreen extends Component {
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
      //firebase config
      const iosConfig = {
        clientId: '757739001851-1figk5703uqf94agrmldaf3m15t0ci8a.apps.googleusercontent.com',
        appId: '1:757739001851:ios:1bb002b8361480481d1d5e',
        apiKey: 'AIzaSyAnMUGeHLKwgmFIRDf7rcl0vEBy4x-qznA',
        databaseURL: 'https://rnbeacon-55576.firebaseio.com',
        storageBucket: 'rnbeacon-55576.appspot.com',
        projectId: 'rnbeacon-55576',
        persistence: true,
      };
      firebase.initializeApp(
        // use platform specific firebase config
        Platform.OS === 'ios' ? iosConfig : null,
        // name of this app
        'rnbeacon-55576',
      );

    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  _ShareMessage = msg => {
    Share.share({
      message: msg.toString(),
    })
      .then(result => console.log(result))
      .catch(errorMsg => console.log(errorMsg));
  };

  _buildLink = async invitedFrom => {
    const link = `https://rrbeacon.page.link/naxz?invitedBy=${GlobalAppModel.userID}&invitedFrom=${invitedFrom}`;
    const dynamicLinkDomain = 'https://rrbeacon.page.link/';
    const DynamicLink = new firebase.links.DynamicLink(link, dynamicLinkDomain);
    DynamicLink.android.setPackageName('com.rrbeacon')
    DynamicLink.android.setFallbackUrl('https://play.google.com/store/apps/details?id=com.rrbeacon')
    DynamicLink.ios.setBundleId('com.rrbeacon')
    DynamicLink.ios.setFallbackUrl('https://www.facebook.com')
    // Add ios app details.
    const generatedLink = await firebase.links().createDynamicLink(DynamicLink);
    //this.setState({ inviteLink: generatedLink });
    console.log(`Ìntite from : ${invitedFrom} : ${generatedLink}`)
    return generatedLink;
  }

  render() {
    const { width } = Dimensions.get('window');
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <ScreenHeader
            navigation={this.props.navigation}
            title={'Refer Friend'}
            userPoint={GlobalAppModel.redeemablePoint} />
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
                <View style={{ flex: 1, marginVertical: 20, marginHorizontal: 20, }}>
                  <Text
                    style={{
                      marginHorizontal: 0,
                      textAlign: 'justify',
                      fontSize: 24,
                      fontWeight: 'normal',
                      color: '#848482',

                    }}>
                    Refer Friends & Get Rewards
                </Text>
                  <Text
                    style={{
                      marginHorizontal: 0,
                      textAlign: 'justify',
                      marginTop: 20,
                      minHeight: 80,
                      fontSize: 16,
                      color: '#848482',
                      lineHeight: 16 * 1.5,

                    }}>
                    Receive $10 for each friend who joins & make a purchase. Get the invite link & share in your favorite places.

                  </Text>
                  <View
                    style={{
                      marginTop: 15,
                      marginLeft: 1,
                      marginRight: 1,
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
                          height: 3,
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
                        marginVertical: 25,
                        color: '#848482',
                      }}>
                      Share with Link
                  </Text>
                  </View>
                  {/* <TouchableHighlight */}
                  {/* please check touchable TouchableOpacity  in ios */}
                  <TouchableOpacity
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      width: undefined,
                      marginTop: 10,
                      marginBottom: 20,
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}
                    onPress={async () => {
                      console.log("shere button presed")
                      const link = await this._buildLink('Self')
                      this._ShareMessage(link);
                    }}>
                    <View style={{ justifyContent: 'center', width: '70%' }}>
                      <Text
                        style={{
                          flex: 1,
                          backgroundColor: GlobalAppModel.secondaryButtonColor || '#012340',
                          textAlign: 'center',
                          fontSize: 16,
                          borderRadius: 10,
                          color: 'white',
                          padding: 10,

                        }}>
                        Get Invite Link
                  </Text>
                      <Icon name={'share-alt'} style={{ color: 'white', fontSize: .20, position: 'absolute', alignSelf: 'flex-end', margin: 10, paddingRight: 15 }} />
                    </View>
                    {/* </TouchableHighlight> */}
                  </TouchableOpacity>
                  {/* <View
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
                  </View> */}
                  <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                    <TouchableHighlight
                      // <TouchableOpacity
                      onPress={async () => {
                        console.log("facebook button presed")
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
                                console.log('Share cancelled by user');
                              } else {
                                console.log('Share success with postId: ' + result.postId);
                              }
                            },
                            function (error) {
                              console.log('Something went wrong while sharing social media: ' + error);
                            },
                          );
                      }}>
                      <Icon
                        name={'facebook'}
                        style={{ fontSize: 35, padding: 10, color: '#3b5998' }}
                      />
                    </TouchableHighlight>
                    {/* </TouchableOpacity> */}

                    <TouchableHighlight
                      // <TouchableOpacity
                      onPress={async () => {
                        console.log("wa button presed")
                        const link = await this._buildLink('WhatsApp')
                        const url = `https://wa.me/?text=${link}`;
                        Linking.openURL(url);
                      }}>
                      <Icon
                        name={'whatsapp'}
                        style={{ fontSize: 35, padding: 10, color: '#4fce5d' }}
                      />
                      {/* </TouchableOpacity> */}
                    </TouchableHighlight>

                    <TouchableHighlight
                      // <TouchableOpacity
                      onPress={async () => {
                        console.log("email button presed")
                        const link = await this._buildLink('Email')
                        const url = `mailto:?subject=Imvite and Earn&body=${link}`;
                        Linking.openURL(url);
                      }}>
                      <Icon
                        name={'envelope'}
                        style={{ fontSize: 35, padding: 10, color: '#b23121' }}
                      />
                      {/* </TouchableOpacity> */}
                    </TouchableHighlight>

                    <TouchableHighlight
                      // <TouchableOpacity
                      onPress={async () => {
                        try {
                          console.log("twitter button presed")
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
                      {/* </TouchableOpacity>Î */}
                    </TouchableHighlight>

                    <TouchableHighlight
                      // <TouchableOpacity
                      onPress={async () => {
                        try {
                          console.log("sms button presed")
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
                      {/* </TouchableOpacity> */}
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
          <BottomNavigationTab navigation={this.props.navigation} />
        </View>
      </SafeAreaView>
    );
  }
}



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