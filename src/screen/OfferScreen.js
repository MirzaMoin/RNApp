import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  // TouchableNativeFeedback,
  TouchableOpacity,
  FlatList,
  AsyncStorage,
  Dimensions,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScreenHeader } from '../widget/ScreenHeader';
import { makeRequest } from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import ImageLoader from './../widget/ImageLoader';
import Toast from 'react-native-root-toast';
import BottomNavigationTab from './../widget/BottomNavigationTab';
import { parseColor } from './../utils/utility';
import LoadingScreen from '../widget/LoadingScreen';
import GlobalAppModel from '../model/GlobalAppModel';
var loadingImage = '';

const Width = Dimensions.get('window').width;
var isRefresh = true;

const textColor = '#848482';

export default class OfferScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    console.log('Constructor called');
    super();
    this.state = {
      isLoading: true,
      addressDetails: {},
      userDetails: {},
      redeemSetting: {},
      offerList: [],
    };
  }

  data = [
    {
      date: '02/10/2020',
      location: 'Bordertown Casino',
      point: '+2',
      balance: '42',
    },
    {
      date: '01/10/2020',
      location: 'Bordertown Casino',
      point: '+3',
      balance: '40',
    },
    {
      date: '30/09/2020',
      location: 'Bordertown Casino',
      point: '-2',
      balance: '42',
    },
    {
      date: '28/09/2020',
      location: 'Bordertown Casino',
      point: '+2',
      balance: '42',
    },
    {
      date: '27/09/2020',
      location: 'Bordertown Casino',
      point: '-5',
      balance: '45',
    },
    {
      date: '25/09/2020',
      location: 'Bordertown Casino',
      point: '+2',
      balance: '42',
    },
  ];

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      loadingImage = GlobalAppModel.getLoadingImage();
      this._getStoredData();
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  _onGoBack = () => {
    console.log('come back from detail')
    isRefresh = false;
  }

  _getStoredData = async () => {
    try {
      this.setState({
        isLoading: isRefresh,
      });

      if (!isRefresh) {
        isRefresh = true;
      }
      this._callGetOffers();
    } catch (error) {
      console.log(error)
    }
  };

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

  _callGetOffers = () => {
    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.GET_OFFER_LIST}?RewardProgramID=${GlobalAppModel.rewardProgramId}&ContactID=${GlobalAppModel.userID}`,
      'get',
    )
      .then(response => {
        //console.log(JSON.stringify(response));
        this.setState({ isLoading: false });
        if (response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
          this.setState({
            offerList: []
          });
        } else {
          this.setState({
            redeemSetting: response.responsedata.redeemSetting,
            addressDetails: response.responsedata.addressDetails,
            userDetails: response.responsedata.userDetails,
            offerList: response.responsedata.offerList,
          });
        }
      })
      .catch(error => console.log('error : ' + error));
  };

  _renderBody = () => {
    if (this.state.isLoading) {
      return (
        <LoadingScreen LoadingImage={loadingImage} />
      );
    } else {
      if (this.state.offerList.length == 0) {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
            <Image
              source={require('./../../Image/no_offer.png')}
              style={{ height: Width / 1.5, width: Width / 1.5 }} />
          </View>
        );
      }
      return (
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          data={this.state.offerList}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              // <TouchableNativeFeedback
              activeOpacity={0.8}
              onPress={() => {
                this.props.navigation.navigate('offerDetail', {
                  offer: item,
                  addressDetails: this.state.addressDetails,
                  userDetails: this.state.userDetails,
                  redeemSetting: this.state.redeemSetting,
                  userID: GlobalAppModel.userID,
                  webformID: GlobalAppModel.webFormID,
                  userPoint: GlobalAppModel.redeemablePoint,
                  onGoBack: () => this._onGoBack(),
                });
              }}>
              <View style={{ marginBottom: 0 }}>
                <View style={{ backgroundColor: 'white' }}>
                  <View style={{ flexDirection: 'column-reverse' }}>
                    <ImageLoader
                      title={item.offerTitle}
                      src={item.offerImage}
                      style={{ height: 250, width: Width }}
                      titleStyle={{ fontSize: 20 }} />
                    <View style={{ height: 250, width: Width, position: 'absolute' }}>
                      <Text style={{
                        fontSize: 12,
                        backgroundColor: '#4b92d2',
                        borderRadius: 5,
                        color: 'white',
                        alignSelf: 'flex-start',
                        margin: 20,
                        marginTop: 10,
                        padding: 5,
                        paddingHorizontal: 10
                      }}>{item.offerImagelabel}</Text>
                      <View style={{ flex: 1 }} />
                      <Text
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        style={{
                          fontSize: 18,
                          fontWeight: 'bold',
                          color: parseColor(item.titleColor, 'white'),
                          backgroundColor: 'rgba(256, 20, 0, 1)',
                          // width: Width,
                          alignSelf: 'flex-start',
                          padding: 5,
                          paddingHorizontal: 20,
                          // paddingVertical:10
                        }}>
                        {item.offerTitle}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.offerDetail, { color: textColor }]}>
                    {item.offerDescription}
                  </Text>
                  <View style={styles.baseOfferType}>
                    <Icon
                      name="trophy"
                      style={{ alignSelf: 'center', color: '#4b92d2' }}
                      size={20}
                    />
                    <Text style={styles.offerType}>{item.offerType}</Text>
                    <Text style={styles.offerExpiry}>{item.offerExpire}</Text>
                  </View>

                </View>
              </View>
              {/* </TouchableNativeFeedback> */}
            </TouchableOpacity>
          )}
        />
      );
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContainer}>
          <ScreenHeader
            navigation={this.props.navigation}
            title={'Offers'}
            userPoint={GlobalAppModel.redeemablePoint} />
          {this._renderBody()}
          <BottomNavigationTab navigation={this.props.navigation} />
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
    // paddingLeft: 15,
    // paddingRight: 15,
    paddingHorizontal: 20,
    paddingTop: 15,
    fontSize: 16,
    textAlign: 'justify',
  },
  baseOfferType: { flexDirection: 'row', padding: 20 },
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
    fontSize: 12,
  },
  footerMenuIdelItemText: {
    color: 'white',
    fontSize: 10,
  },
};
