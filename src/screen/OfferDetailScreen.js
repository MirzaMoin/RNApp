import React, {Component} from 'react';
import {
  View,
  Text,
  Image, 
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  AsyncStorage,
  Dimensions,
  BackHandler,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Card} from 'react-native-elements';
import {ScreenHeader} from '../widget/ScreenHeader';
import { ScrollView } from 'react-native-gesture-handler';
import ImageLoader from './../widget/ImageLoader';
import Barcode from "react-native-barcode-builder";
import ViewShot from "react-native-view-shot";
import CameraRoll from '@react-native-community/cameraroll';
import {requestMultiple, PERMISSIONS, openSettings} from 'react-native-permissions';
import Toast from 'react-native-root-toast';

const Width = Dimensions.get('window').width;

export default class OfferDetailScreen extends Component {
  static navigationOptions = {
    header: null,
  };    
  constructor() {
    console.log('Constructor called offer details');
    super();
    this.state = {
      addressDetails: {},
      userDetails: {},
      redeemSetting: {},
      offer: {},
      userID: '',
      webFormID: '',
      userPoint: '',
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentDidMount() {
    const { navigation } = this.props;
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
      });
    });
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

  _getStoredData = async () => {
    try {
      
    } catch (error) {
      console.log(error)
    }
  };

  _checkPermission = () => {
    requestMultiple([PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]).then(
      (statuses) => {
        if('granted' == statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]){
          this.refs.viewShot.capture().then(uri => {
            console.log("do something with ", uri);
            CameraRoll.save(uri, 'photo')
            .then(res => {
              this._showToast('Offer save to Gallery')
            })
            .catch(err => console.log(err))
          });
        } else if('blocked' == statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]){
          this._showToast('Grant Storage permission to save offer');
          openSettings().catch(() => console.warn('cannot open settings'));
        }
      },
    );
  }

  _renderButtom = () => {
    if(this.state.offer.allowContactRedeemOffer ||
      this.state.offer.displayPrintButton) {
      return(
        <View style={{flexDirection: 'row', backgroundColor: '#012345'}}>
          {this.state.offer.allowContactRedeemOffer && this._renderRedeemButton()}
          {(this.state.offer.allowContactRedeemOffer && this.state.offer.displayPrintButton) && <View style={{width: 1.5, backgroundColor: 'white', height: '50%', marginVertical: 5, alignSelf: 'center'}}/>}
          {this.state.offer.displayPrintButton && this._renderPrintButton()}
        </View>
      );
    }
  }

  _renderRedeemButton = () => {
    if (this.state.isRedeeming) {
      return ( <View style={{flex: 1, padding: 10, alignSelf: 'center'}}><ActivityIndicator size={28} color={'white'} /></View> );
    } else {
      return (
        <Text 
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
      return ( <View style={{flex: 1, padding: 10, alignSelf: 'center'}}><ActivityIndicator size={28} color={'white'} /></View> );
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

  render() {
    return (
      <View style={styles.mainContainer}>
        <ScreenHeader
          navigation={this.props.navigation}
          title={'Offer Detail'}
          userPoint={this.state.userPoint}
          isGoBack={true}
          onGoBack={ () => {
            this.props.navigation.state.params.onGoBack();
          }}/>
           
            <ScrollView
              showsVerticalScrollIndicator={false}>
              <ViewShot ref="viewShot" options={{ format: "jpg", quality: 0.9 }}>
                <View style={{backgroundColor: 'white', flex: 1, paddingBottom: 10}}>
                <View>
                  <ImageLoader 
                    title={this.state.offer.offerTitle}
                    src={this.state.offer.offerImage}
                    style={{height: Width, width: Width}}
                    titleStyle={{fontSize: 20}} />
                  <Text style={{
                    fontFamily: 'helvetica',
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
                <Text style={[styles.offerDetail, {color: this.state.offer.descColor ? `${this.state.offer.descColor.indexOf('#') == -1 ? '#' : ''}${this.state.offer.descColor}` : 'black'}]}>
                  {this.state.offer.offerDescription}
                </Text>
                <View style={styles.baseOfferType}>
                  <Icon
                    name="trophy"
                    style={{alignSelf: 'center', color: '#4b92d2'}}
                    size={20}
                  />
                  <Text style={styles.offerType}>{this.state.offer.offerType}</Text>
                  <Text style={styles.offerExpiry}>{this.state.offer.offerExpire}</Text>
                </View>
                {this.state.offer.displayBarcode && <Barcode value={this.state.offer.offerBarcode} text={this.state.offer.offerBarcode} format="CODE128" />}
                <View style={{paddingHorizontal: 15, marginBottom: 15}}>
                  <Text style={{fontSizeL: 16}}>{this.state.addressDetails.name || ''}</Text>
                  <Text style={{fontSizeL: 14, color: 'grey'}}>{this.state.addressDetails.address || ''}</Text>
                  <Text style={{fontSizeL: 14, color: 'grey'}}>
                    {`${this.state.addressDetails.city} ${this.state.addressDetails.state} ${this.state.addressDetails.zipCode}`}
                  </Text>
                  <Text style={{fontSizeL: 14, color: 'blue'}}>{this.state.addressDetails.businessPhone || ''}</Text>
                  <Text style={{fontSizeL: 14, color: 'blue'}}>{this.state.addressDetails.websiteURL || ''}</Text>
                </View>

                <View style={{marginHorizontal: 15, borderWidth: 1, borderColor: 'grey', borderRadius: 10, padding: 10, alignItems: 'center'}}>
                  <Text style={{fontSizeL: 14, color: 'grey'}}>{this.state.offer.offerBarcode || ''}</Text>
                  <Text style={{fontSizeL: 14, color: 'grey', marginTop: 5}}>Mobile: {this.state.userDetails.mobilePhone || ''}</Text>
                    <View style={{flexDirection: 'row', marginTop: 5, paddingHorizontal: 5}}>
                      <Text style={{fontSizeL: 14, color: 'grey', flex: 1}}>CardID: {this.state.userDetails.memberCardID || ''}</Text>
                      <Text style={{fontSizeL: 14, color: 'grey', flex: 1, textAlign: 'right'}}>Offer ID: {this.state.offer.offerID || ''}</Text>
                    </View>
                </View>
            </View>
            </ViewShot>
          </ScrollView>
        
        {this._renderButtom()}
      </View>
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
  titleRow: {flexDirection: 'row', padding: 15},
  pointItem: {
    fontFamily: 'helvetica',
    fontSize: 13,
    backgroundColor: '#4b92d2',
    borderRadius: 5,
    color: 'white',
    alignSelf: 'flex-start',
    margin: 20,
  },
  offerTitle: {
    fontFamily: 'helvetica',
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
  baseOfferType: {flexDirection: 'row', padding: 15},
  offerType: {
    fontFamily: 'helvetica',
    fontSize: 15,
    fontWeight: 'bold',
    paddingLeft: 5,
    color: '#4b92d2',
  },
  offerExpiry: {
    fontFamily: 'helvetica',
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
