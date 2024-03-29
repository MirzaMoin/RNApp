import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Alert,
  AsyncStorage,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import { makeRequest } from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import { ScreenHeader } from '../widget/ScreenHeader';
import SwipeButton from 'rn-swipe-button';
import BottomNavigationTab from './../widget/BottomNavigationTab';
import GlobalAppModel from '../model/GlobalAppModel';
import { ScrollView } from 'react-native-gesture-handler';

const maxWidth = Dimensions.get('window').width;
const imageHeight = (maxWidth / 16) * 9;
const textColor = '#848482';
export default class TransferPointScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor() {
    console.log('Constructor called');
    super();
    this.state = {
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({
        transferAmount: '',
        transferTo: '',
      })
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  _prepareForm = () => {
    var isCall = true;
    if (this.state.transferAmount) {
      this.setState({
        transferAmountError: false,
      });
    } else {
      this.setState({
        transferAmountError: true
      })
      isCall = false;
    }

    if (this.state.transferTo) {
      this.setState({
        transferToError: false,
      });
    } else {
      this.setState({
        transferToError: true,
      });
      isCall = false;
    }

    if (isCall) {
      this.setState({ isLoading: true })
      this._callTransferPoint()
    }
  }

  _callTransferPoint = () => {
    const request = {
      rewardProgramID: GlobalAppModel.rewardProgramId,
      contactID: GlobalAppModel.userID,
      transferPoints: this.state.transferAmount,
      transferTo: this.state.transferTo
    };

    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.TRANSFERT_POINT}`,
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
          this._processAfterTransfer()
        }
      })
      .catch(error => console.log('error : ' + error));
  }

  _processAfterTransfer = async () => {
    var currentPoint = GlobalAppModel.redeemablePoint;
    var transfer = this.state.transferAmount;
    const newPoint = currentPoint - transfer;

    await AsyncStorage.setItem('reedemablePoints', newPoint.toString());
    GlobalAppModel.setRedeemablePoint(newPoint.toString());
    this.setState({
      userPoint: newPoint,
      transferAmount: '',
      transferTo: '',
    })
  }

  _renderIcon = () => this.state.isLoading ? <ActivityIndicator color={'#012345'} /> : <MDIcon name="keyboard-arrow-right" size={30} />;

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContainer}>

          <ScreenHeader
            navigation={this.props.navigation}
            title={'Transfer Points'}
            userPoint={GlobalAppModel.redeemablePoint} />
          <ScrollView>
            <View style={{ hegith: imageHeight }}>
              <Image
                style={{ height: imageHeight }}
                source={{
                  uri:
                    APIConstant.HEADER_IMAGE,
                }}
                resizeMode="cover"
              />
              {/* <View style={styles.imageOverlay} /> */}
            </View>

            <View style={{ marginTop: 10, paddingHorizontal: 10, flex: 1, justifyContent: 'center' }}>
              {/* <Text
                style={{
                  fontSize: 22,
                  marginBottom: 10,
                  paddingLeft: 10,
                }}>
                How many are you transfering?
          </Text> */}
              <Text style={{
                padding: 5, paddingLeft: 10,
                // color: this.state.transferAmountError ? 'red' : 'black' 
                color: textColor
              }}>Enter Point Amount</Text>
              <View
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                  borderColor: this.state.transferAmountError ? 'red' : 'rgba(153,153,153,0.5)',
                  borderWidth: 2,
                  padding: Platform.OS == 'android' ? 2 : 10,
                  borderRadius: 10,
                }}>
                <TextInput
                  style={{ fontSize: 16, fontWeight: 'bold' }}
                  placeholder={`${GlobalAppModel.redeemablePoint || 50} PTS`}
                  keyboardType={'numeric'}
                  returnKeyType='done'
                  onChangeText={(text) => {
                    this.setState({
                      transferAmount: text
                    })
                  }}
                />
              </View>

              <View
                style={{
                  margin: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{ flex: 1, flexDirection: 'row', position: 'absolute' }}>
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
                    paddingLeft: 25,
                    paddingRight: 25,
                    color: textColor
                  }}>
                  Transfering to
            </Text>
              </View>

              <Text
                style={{
                  padding: 5, paddingLeft: 10,
                  //color: this.state.transferToError ? 'red' : 'black' 
                  color: textColor
                }}>
                Enter User Details
          </Text>
              <View
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                  borderColor: this.state.transferToError ? 'red' : 'rgba(153,153,153,0.5)',
                  borderWidth: 2,
                  padding: Platform.OS == 'android' ? 2 : 10,
                  borderRadius: 10,
                }}>
                <TextInput
                  style={{ fontSize: 16, fontWeight: 'bold' }}
                  placeholder="Email, mobile number or Member CardID"
                  onChangeText={(text) => {
                    this.setState({
                      transferTo: text,
                    })
                  }}
                />
              </View>

              <View style={{
                marginTop: 20,
                // marginRight: 10,
                // marginVertical:10,
                marginHorizontal: 5
              }}>
                <SwipeButton
                  thumbIconBackgroundColor="#FFFFFF"
                  containerStyle={{ backgroundColor: '#012345' }}
                  swipeSuccessThreshold={90}
                  thumbIconComponent={this._renderIcon}
                  title="Slide to transfer"
                  titleColor={'white'}
                  railBackgroundColor={'#012345'}
                  railFillBackgroundColor={'green'}
                  shouldResetAfterSuccess
                  disabled={this.state.isLoading}
                  onSwipeSuccess={() => {
                    this._prepareForm()
                  }}
                />
                {/* <View style={{ backgroundColor: null }}>
                  <TouchableOpacity style={{ backgroundColor: GlobalAppModel.primaryColor, alignSelf: 'flex-end', padding: 15, borderRadius: 10, width: 150 }} onPress={() => this._prepareForm()}>
                    {this.state.isLoading ? <ActivityIndicator color={'white'} /> : <Text style={{ color: 'white', alignSelf: 'center', }}>Transfer Points</Text>}
                  </TouchableOpacity>
                </View> */}
              </View>
            </View>
          </ScrollView>
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
    backgroundColor: 'rgba(256,256,256,1)',
  },
  imageOverlay: {
    height: 150,
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
};
