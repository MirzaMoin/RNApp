import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  // TouchableNativeFeedback,
  TouchableOpacity,
  TextInput,
  Alert,
  AsyncStorage,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView
} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import { makeRequest } from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import { ScreenHeader } from '../widget/ScreenHeader';
import SwipeButton from 'rn-swipe-button';
import { Card } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-root-toast';
import BottomNavigationTab from './../widget/BottomNavigationTab';
import LoadingScreen from '../widget/LoadingScreen';
import GlobalAppModel from '../model/GlobalAppModel';
var loadingImage = '';

const maxWidth = Dimensions.get('window').width;
const imageHeight = (maxWidth / 16) * 9;
const textColor = '#848482';

export default class RedeemCashbackScreen extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      isLoading: true,
      isLoadingForm: true
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      loadingImage = GlobalAppModel.getLoadingImage();
      this.setState({ isLoadingForm: true })
      this._callGetRedeemCashback()
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
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

  _callGetRedeemCashback = () => {
    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.GET_CASHBACK_SCREEN_DATA}?RewardProgramID=${GlobalAppModel.rewardProgramId}&ContactID=${GlobalAppModel.userID}`,
      'get',
    )
      .then(response => {
        console.log(JSON.stringify(response));
        this.setState({ isLoading: false, isLoadingForm: false });
        if (response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          this.setState({
            amount: response.responsedata.amount,
            isAllowPartialCashbackRedemption: response.responsedata.isAllowPartialCashbackRedemption,
            isRequireWholeNumberRedemption: response.responsedata.isRequireWholeNumberRedemption
          })
        }
      })
      .catch(error => console.log('error : ' + error));
  }

  _prepareForm = () => {
    var isCall = true;
    if (!this.state.isAllowPartialCashbackRedemption) {
      this.setState({
        otherAmount: this.state.amount,
        isLoading: true,
      }, () => this._callRedeemCashbackTransaction())
    } else {
      if (this.state.otherAmount) {
        if (this.state.isRequireWholeNumberRedemption && this.state.otherAmount % 1 == 0) {
          // need to enter full amount only
          this.setState({ otherAmounterror: false });
        } else {
          // able to redeem with point amount
          this.setState({ otherAmounterror: true });
          this._showToast('Enter amount without point');
          isCall = false
        }
      } else {
        this.setState({
          otherAmounterror: true
        })
        isCall = false;
        this._showToast('Please enter amout');
      }
      if (isCall) {
        this.setState({ isLoading: true });
        this._callRedeemCashbackTransaction();
      }
    }
  }

  _callRedeemCashbackTransaction = () => {
    const request = {
      rewardProgramID: GlobalAppModel.rewardProgramId,
      contactID: GlobalAppModel.userID,
      webFormID: GlobalAppModel.webFormID,
      cashbackAmount: this.state.otherAmount
    };

    console.log(`Reqeust : ${JSON.stringify(request)}`)

    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.REDEEM_CASHBACK}`,
      'post',
      request,
    )
      .then(response => {
        console.log(JSON.stringify(response));
        this.setState({ isLoading: false });
        if (response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          Alert.alert('Success', response.statusMessage);
          this._processAfterTransfer(response.responsedata.reedemablePoints)
        }
      })
      .catch(error => console.log('error : ' + error));
  }

  _processAfterTransfer = async point => {
    await AsyncStorage.setItem('reedemablePoints', point.toString());
    GlobalAppModel.setRedeemablePoint(point.toString());
    this.setState({
      userPoint: point,
      otherAmount: '',
      otherAmounterror: false,
    });
    this._callGetRedeemCashback();
  }

  _renderIcon = () => this.state.isLoading ? <ActivityIndicator color={'#012345'} /> : <MDIcon name="keyboard-arrow-right" size={30} />;

  _renderSuggession = () => {
    const c = 100
    { console.log("imageHeight " + Math.round(maxWidth / 100) + " imageHeight " + Math.round(maxWidth / c)) }
    if (this.state.amount > 0 && this.state.isAllowPartialCashbackRedemption) {
      var sugessions = [];
      var amount = 1;
      if (this.state.amount > Math.round(maxWidth / 80)) {
        amount = Math.round(this.state.amount / Math.round(maxWidth / 80));
        for (var i = amount; i <= this.state.amount; i = i + amount) {
          const tmp = i;
          sugessions.push(
            <TouchableOpacity
              // <TouchableNativeFeedback
              style={{ marginHorizontal: 5 }}
              activeOpacity={0.8}
              onPress={() => {
                console.log(`Tapped: ${tmp}`)
                this.setState({ otherAmount: tmp })
              }}
            >
              <View style={{ padding: 10, paddingHorizontal: 15, minHeight: 50, borderRadius: 25, backgroundColor: '#012345', justifyContent: 'center', alignSelf: 'center', alignContent: 'center', width: maxWidth / c > 4 ? (maxWidth / c) * 15 : (maxWidth / c) * 20 }}>
                <Text style={{ color: 'white', alignSelf: 'center', fontSize: 18 }}>${tmp}</Text>
              </View>
              {/* </TouchableNativeFeedback> */}
            </TouchableOpacity>
          )
        }
        return (
          <View style={{ flexDirection: 'row', marginVertical: 5, alignSelf: 'center', }}>
            {sugessions}
          </View>
          // <ScrollView
          //   showsVerticalScrollIndicator={false}
          //   showsHorizontalScrollIndicator={false}
          //   horizontal={true}>
          //   <View style={{ flexDirection: 'row', marginVertical: 5,alignSelf:'center'}}>
          //     {sugessions}
          //   </View>
          // </ScrollView>
        );
      }

    }
  }

  _renderBody = () => {
    if (this.state.isLoadingForm) {
      return <LoadingScreen LoadingImage={loadingImage} />
    } else {
      return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <ScrollView>
            <View style={{ flexDirection: 'column' }}>
              <View style={{ hegith: imageHeight }}>
                <Image
                  style={{ height: imageHeight }}
                  source={{
                    uri: APIConstant.HEADER_IMAGE,
                  }}
                  resizeMode="cover"
                />
                {/* <View style={styles.imageOverlay} /> */}
              </View>
              <View style={{ paddingHorizontal: 20, flex: 1, paddingTop: 0, marginTop: 10 }}>
                {/* <Text style={{ fontSize: 24, padding: 0, paddingBottom: 0,backgroundColor:'red' }}>How much chashback would you like to?</Text> */}
                {/* <TouchableNativeFeedback */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => this.setState({ otherAmount: this.state.amount })}>
                  <View style={{ borderRadius: 15, height: 180, width: '100%', alignItems: 'center', justifyContent: 'center', alignContent: 'center', alignSelf: 'center', marginVertical: 0, paddingHorizontal: 0 }}>
                    <Image
                      style={{
                        width: '100%',
                        height: 180,
                        alignSelf: 'center',
                        borderRadius: 15,
                        position: 'absolute'
                      }}
                      source={{
                        uri: 'https://www.creativeclique.co.za/wp-content/uploads/2019/01/Material-Design-Background-Undesigns-00.jpg'
                      }}
                      resizeMode={'cover'} />

                    <View style={{ height: 180, alignSelf: 'center', width: '100%', paddingVertical: 10, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 15, }}>
                      <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>Tap to redeem maximum cashback amount</Text>
                      <Text style={{ fontSize: 30, color: 'white', alignSelf: 'center', marginTop: 50 }}>${this.state.amount || '0'}</Text>
                    </View>
                  </View>
                  {/* </TouchableNativeFeedback> */}
                </TouchableOpacity>
                {this._renderSuggession()}
              </View>
            </View>
            {/* <Card
              containerStyle={{
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                marginBottom: 0,
                marginHorizontal: 20,
              }}> */}
            {this.state.isAllowPartialCashbackRedemption &&
              <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                <Text
                  style={{
                    paddingLeft: 10,
                    //color: this.state.otherAmounterror ? 'red' : 'black' 
                    color: textColor, fontSize: 16
                  }}>
                  Enter other amount
                </Text>
                <View
                  style={{
                    marginTop: 10,
                    borderColor: this.state.otherAmounterror ? 'red' : 'rgba(153,153,153,0.5)',
                    borderWidth: 2,
                    paddingHorizontal: 10,
                    marginHorizontal: 5,
                    borderRadius: 10,
                    flexDirection: 'row',
                    marginBottom: 0,
                    width: '95%',
                    alignSelf: 'center',
                  }}>
                  <Text style={{ alignSelf: 'center', fontSize: 16 }}>$</Text>
                  <TextInput
                    style={{ fontSize: 17, fontWeight: 'bold', margin: 5, padding: 5, width: '95%' }}
                    keyboardType={'numeric'}
                    returnKeyType='done'
                    value={`${this.state.otherAmount || ''}`}
                    placeholder="Enter other amount"
                    onChangeText={(text) => {
                      this.setState({
                        otherAmount: text,
                      })
                    }}
                  />
                </View>
              </View>}

            <View style={{ alignSelf: 'center', width: '100%', justifyContent: 'center', alignContent: 'center', alignItems: 'center', }} >
              <SwipeButton
                thumbIconBackgroundColor="#FFFFFF"
                containerStyle={{ backgroundColor: GlobalAppModel.primaryButtonColor || '#012345', }}
                swipeSuccessThreshold={80}
                thumbIconComponent={this._renderIcon}
                width={'90%'}
                title="Slide to Redeem"
                titleColor={'white'}
                railBackgroundColor={GlobalAppModel.primaryButtonColor || '#012345'}
                railFillBackgroundColor={'green'}
                shouldResetAfterSuccess
                disabled={this.state.isLoading}
                onSwipeSuccess={() => {
                  this._prepareForm()
                }} />
            </View>
            {/* </Card> */}

          </ScrollView>
        </View>
      )
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContainer}>
          <ScreenHeader
            navigation={this.props.navigation}
            title={'Redeem Cashback'}
            userPoint={GlobalAppModel.redeemablePoint} />
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            enabled={Platform.OS === 'ios' ? true : false}>
            {this._renderBody()}
          </KeyboardAvoidingView>
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
    height: imageHeight,
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
};
