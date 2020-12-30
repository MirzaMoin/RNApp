import React, { Component } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  AsyncStorage,
  Dimensions,
  BackHandler,
  Linking,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScreenHeader } from '../widget/ScreenHeader';
import { ScrollView } from 'react-native-gesture-handler';
import ImageLoader from './../widget/ImageLoader';
import Barcode from "react-native-barcode-builder";
import ViewShot from "react-native-view-shot";
import CameraRoll from '@react-native-community/cameraroll';
import { requestMultiple, PERMISSIONS, openSettings } from 'react-native-permissions';
import Toast from 'react-native-root-toast';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { makeRequest } from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import LoadingScreen from '../widget/LoadingScreen';
import GlobalAppModel from '../model/GlobalAppModel';
var loadingImage = '';

const Width = Dimensions.get('window').width;
const maxWidth = Width - (Width * 20 / 100)

export default class OfferDetailScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor() {
    console.log('Constructor called offer details');
    super();
    this.state = {
      isLoading: true,
      addressDetails: {},
      userDetails: {},
      redeemSetting: {},
      offer: {},
      userID: '',
      webFormID: '',
      userPoint: '',
      dataSoure: [],
      location: '',
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentDidMount() {
    const { navigation } = this.props;
    loadingImage = GlobalAppModel.getLoadingImage();
    this.focusListener = navigation.addListener('didFocus', () => {
      console.log(`Offer SCreen DAta: ${JSON.stringify(this.props.navigation.state.params)}`)
      this.setState({
        addressDetails: this.props.navigation.state.params.addressDetails,
        userDetails: this.props.navigation.state.params.userDetails,
        redeemSetting: this.props.navigation.state.params.redeemSetting,
        offer: this.props.navigation.state.params.offer,
        userID: this.props.navigation.state.params.userID,
        webFormID: this.props.navigation.state.params.webFormID,
        userPoint: this.props.navigation.state.params.userPoint,
        isLoading: false,
      }, () => {
        if (this.state.redeemSetting.askWhereAreYou) {
          this._getLocationData();
        }
      });
    });
  }

  _getLocationData = () => {

    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.GET_LOCATION_DATA}?RewardProgramID=${APIConstant.RPID}`,
      'get',
    )
      .then(response => {
        //console.log(JSON.stringify(response));
        this.setState({ isLoading: false });
        if (response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          this.setState({
            dataSoure: response.responsedata.locationData,
          })
        }
      })
      .catch(error => console.log('error : ' + error));
  }

  _callRedeemOffer = () => {
    const request = {
      offerID: this.state.offer.offerID,
      offerSendID: this.state.offer.offerSendID,
      rewardProgramID: APIConstant.RPID,
      contactID: this.state.userID,
      addressID: this.state.location,
      webFormID: this.state.webFormID
    }

    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.REDEEM_OFFER}`,
      'post',
      request,
    )
      .then(response => {
        //console.log(JSON.stringify(response));
        if (response.statusCode == 0) {
          this.setState({ isRedeeming: true })
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          Alert.alert('Success', response.statusMessage, [
            { text: 'Okay', onPress: () => this._processFurther(response.responsedata.reedemablePoints) }
          ]);
        }
      })
      .catch(error => {
        console.log('error : ' + error);
        this.setState({ isRedeeming: true });
      });
  }

  _processFurther = async point => {
    await AsyncStorage.setItem('reedemablePoints', point.toString());
    GlobalAppModel.setRedeemablePoint(point.toString());
    this.setState({ isRedeeming: true });
    this.handleBackButtonClick();
  }

  componentWillUnmount() {
    this.focusListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.state.params.onGoBack();
    this.props.navigation.goBack();
    return true;
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

  _checkPermission = () => {
    requestMultiple([PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]).then(
      (statuses) => {
        if ('granted' == statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]) {
          this.refs.viewShot.capture().then(uri => {
            console.log("do something with ", uri);
            CameraRoll.save(uri, 'photo')
              .then(res => {
                this._showToast('Offer save to Gallery')
              })
              .catch(err => console.log(err))
          });
        } else if ('blocked' == statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]) {
          this._showToast('Grant Storage permission to save offer');
          openSettings().catch(() => console.warn('cannot open settings'));
        }
      },
    );
  }

  _renderButtom = () => {
    if (this.state.offer.allowContactRedeemOffer ||
      this.state.offer.displayPrintButton) {
      return (
        <View style={{ flexDirection: 'row', backgroundColor: '#012345' }}>
          {this.state.offer.allowContactRedeemOffer && this._renderRedeemButton()}
          {(this.state.offer.allowContactRedeemOffer && this.state.offer.displayPrintButton) && <View style={{ width: 1.5, backgroundColor: 'white', height: '50%', marginVertical: 5, alignSelf: 'center' }} />}
          {this.state.offer.displayPrintButton && this._renderPrintButton()}
        </View>
      );
    }
  }

  _onRedeemPress = () => {
    this.setState({ isRedeeming: true })
    if (this.state.redeemSetting.redeemOfferInstruction.length > 0) {
      Alert.alert(
        'Redeem Offer',
        this.state.redeemSetting.redeemOfferInstruction,
        [
          {
            text: 'Cancel', onPress: () => {
              this.setState({ isRedeeming: false })
            }
          },
          {
            text: 'Redeem', onPress: () => {
              this._prepareForLocation();
            }
          }
        ]
      );
    } else {
      this._prepareForLocation();
    }
  }

  _prepareForLocation = () => {
    if (this.state.redeemSetting.askWhereAreYou) {
      this.locationPopup._toggleSelector()
    } else {
      this.setState({
        location: this.state.userDetails.addressID
      }, () => {
        this._callRedeemOffer();
      });
    }
  }

  _renderRedeemButton = () => {
    if (this.state.isRedeeming) {
      return (<View style={{ flex: 1, padding: 10, alignSelf: 'center' }}><ActivityIndicator size={28} color={'white'} /></View>);
    } else {
      return (
        <Text
          onPress={() => this._onRedeemPress()}
          style={{
            flex: 1,
            backgroundColor: '#012345',
            textAlign: 'center',
            color: 'white',
            fontSize: 17,
            padding: 10
          }}>
          Redeem Offer
        </Text>
      )
    }
  }

  _renderPrintButton = () => {
    if (this.state.isPrinting) {
      return (<View style={{ flex: 1, padding: 10, alignSelf: 'center' }}><ActivityIndicator size={28} color={'white'} /></View>);
    } else {
      return (
        <Text
          onPress={() => {
            this._checkPermission();
          }}
          style={{
            flex: 1,
            backgroundColor: '#012345',
            textAlign: 'center',
            color: 'white',
            fontSize: 17,
            padding: 10
          }}>
          Print Offer
        </Text>
      )
    }
  }

  _renderLocation = () => {
    if (this.state.dataSoure.length > 0) {
      var item = [];
      this.state.dataSoure.map(location => {
        var it = {
          id: location.addressID,
          name: location.locationName
        }
        item.push(it);
      });
      return (
        <View style={{ width: 300 }}>
          <SectionedMultiSelect
            items={item}
            uniqueKey="id"
            ref={(locationPopup) => this.locationPopup = locationPopup}
            alwaysShowSelectText={false}
            showChips={true}
            hideSelect={true}
            single={true}
            searchPlaceholderText={'Search Location'}
            onSelectedItemsChange={(selectedItem) => {
              this.setState({
                location: selectedItem[0]
              }, () => { this._callRedeemOffer() })
            }}
            selectedItems={[this.state.location]}
          />
        </View>
      );
    }
  }

  _parseWebURL = url => {
    if (url) {
      const url1 = url.replace('https://', '');
      const urlNew = url1.replace('http://', '');
      return (
        <Text onPress={() => this.openLink(url)} style={{ fontSizeL: 14, color: 'blue' }}>{urlNew}</Text>
      )
    }
  }

  _parsePhoneNum = mobile => {
    if (mobile) {
      return (
        <Text onPress={() => this.openPhone(mobile)} style={{ fontSizeL: 14, color: 'blue' }}>{mobile}</Text>
      )
    }
  }

  openLink = link => {
    Linking.canOpenURL(link).then(supported => {
      if (supported) {
        Linking.openURL(link);
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });
  };

  openPhone = link => {
    const num = `tel:${link}`;
    Linking.canOpenURL(num).then(supported => {
      if (supported) {
        Linking.openURL(num);
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });
  };

  _renderBody = () => {
    if (this.state.isLoading) {
      return <LoadingScreen LoadingImage={loadingImage} />
    } else {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <ViewShot ref="viewShot" options={{ format: "jpg", quality: 0.9 }}>
            <View style={{ backgroundColor: 'white', flex: 1, paddingBottom: 10 }}>
              <View>
                <ImageLoader
                  title={this.state.offer.offerTitle}
                  src={this.state.offer.offerImage}
                  style={{ height: Width, width: Width }}
                  titleStyle={{ fontSize: 20 }} />
                <Text style={{
                  fontSize: 13,
                  backgroundColor: '#4b92d2',
                  borderRadius: 5,
                  color: 'white',
                  alignSelf: 'flex-start',
                  margin: 20,
                  padding: 7,
                  paddingHorizontal: 10,
                  position: 'absolute'
                }}>{this.state.offer.offerImagelabel}</Text>
              </View>
              <Text
                style={{
                  paddingTop: 10,
                  paddingHorizontal: 15,
                  fontSize: 18,
                  fontWeight: '600',
                  width: Width,
                  color: this.state.offer.titleColor ? `${this.state.offer.titleColor.indexOf('#') == -1 ? '#' : ''}${this.state.offer.titleColor}` : 'black',
                }}>
                {this.state.offer.offerTitle}
              </Text>
              <Text style={[styles.offerDetail, { color: this.state.offer.descColor ? `${this.state.offer.descColor.indexOf('#') == -1 ? '#' : ''}${this.state.offer.descColor}` : 'black' }]}>
                {this.state.offer.offerDescription}
              </Text>
              <View style={styles.baseOfferType}>
                <Icon
                  name="trophy"
                  style={{ alignSelf: 'center', color: '#4b92d2' }}
                  size={20}
                />
                <Text style={styles.offerType}>{this.state.offer.offerType}</Text>
                <Text style={styles.offerExpiry}>{this.state.offer.offerExpire}</Text>
              </View>
              {this.state.offer.displayBarcode && <Barcode value={this.state.offer.offerBarcode} text={this.state.offer.offerBarcode} format="CODE128" height={70} />}
              <View style={{ paddingHorizontal: 15, marginBottom: 15 }}>
                <Text style={{ fontSizeL: 16 }}>{this.state.addressDetails.name || ''}</Text>
                <Text style={{ fontSizeL: 14, color: 'grey' }}>{this.state.addressDetails.address || ''}</Text>
                <Text style={{ fontSizeL: 14, color: 'grey' }}>
                  {`${this.state.addressDetails.city} ${this.state.addressDetails.state} ${this.state.addressDetails.zipCode}`}
                </Text>
                {this._parsePhoneNum(this.state.addressDetails.businessPhone)}
                {this._parseWebURL(this.state.addressDetails.websiteURL)}
              </View>

              <View style={{ marginHorizontal: 15, borderWidth: 1, borderColor: 'grey', borderRadius: 10, padding: 10, alignItems: 'center' }}>
                <Text style={{ fontSizeL: 14, color: 'grey' }}>Internal Use Only: {this.state.offer.offerBarcode || ''}</Text>
                <Text style={{ fontSizeL: 14, color: 'grey', marginTop: 5 }}>Mobile: {this.state.userDetails.mobilePhone || ''}</Text>
                <View style={{ flexDirection: 'row', marginTop: 5, paddingHorizontal: 5 }}>
                  <Text style={{ fontSizeL: 14, color: 'grey', flex: 1 }}>CardID: {this.state.userDetails.memberCardID || ''}</Text>
                  <Text style={{ fontSizeL: 14, color: 'grey', flex: 1, textAlign: 'right' }}>Offer ID: {this.state.offer.offerID || ''}</Text>
                </View>
              </View>
            </View>
          </ViewShot>
        </ScrollView>
      );
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContainer}>
          <ScreenHeader
            navigation={this.props.navigation}
            title={'Offer Detail'}
            userPoint={this.state.userPoint}
            isGoBack={true}
            onGoBack={() => {
              this.props.navigation.state.params.onGoBack();
            }} />
          {this._renderLocation()}
          {this._renderBody()}
          {this._renderButtom()}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = {
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(153,153,153,0.2)',
  },
  imageOverlay: {
    height: 150,
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  rowContainer: {
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
  },
  titleRow: { flexDirection: 'row', padding: 15 },
  pointItem: {
    fontSize: 13,
    backgroundColor: '#4b92d2',
    borderRadius: 5,
    color: 'white',
    alignSelf: 'flex-start',
    margin: 20,
  },
  offerTitle: {
    alignSelf: 'center',
    paddingLeft: 15,
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
  },
  offerDetail: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    fontSize: 15,
    textAlign: 'justify',
  },
  baseOfferType: { flexDirection: 'row', padding: 15 },
  offerType: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingLeft: 5,
    color: '#4b92d2',
  },
  offerExpiry: {
    textAlign: 'right',
    flex: 1,
    color: 'gray',
    fontSize: 15,
    fontWeight: 'bold',
  },
  footerContainer: {
    height: 50,
    padding: 5,
    backgroundColor: 'red',
    alignItem: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  footerMenuItem: {
    marginLeft: 5,
    marginRight: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    tintColor: 'white',
  },
  footerMenuItemImage: {
    height: 20,
    width: 20,
    tintColor: 'white',
  },
  footerMenuSelectedItem: {
    height: 24,
    width: 24,
    tintColor: 'white',
  },
  footerMenuIdelItem: {
    height: 18,
    width: 18,
    tintColor: 'white',
  },
  footerMenuSelectedItemText: {
    color: 'white',
    fontSize: 11,
  },
  footerMenuIdelItemText: {
    color: 'white',
    fontSize: 10,
  },
};
