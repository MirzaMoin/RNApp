import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {BottomNavigationTab} from './../widget/BottomNavigationTab';
import {makeRequest} from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import {ScreenHeader} from '../widget/ScreenHeader';
import SwipeButton from 'rn-swipe-button';
import { Card } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';

export default class RedeemCashbackScreen extends Component {
  
    static navigationOptions = {
    header: null,
  };

  constructor() {
    console.log('Constructor called');
    super();
    this.state = {
        amount: 108,
        isAllowPartialCashbackRedemption: true,
        isRequireWholeNumberRedemption: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
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
            },()=>{this._callGetRedeemCashback()});
          }
        }
      });
    } catch (error) {
      console.log(error)
    }
  };

  _callGetRedeemCashback = () => {
    makeRequest(
        `${APIConstant.BASE_URL}${APIConstant.GET_CASHBACK_SCREEN_DATA}?RewardProgramID=${APIConstant.RPID}&ContactID=${this.state.userID}`,
        'get',
      )
    .then(response => {
        console.log(JSON.stringify(response));
        this.setState({isLoading: false});
        if(response.statusCode == 0) {
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

    if(isCall){
      this.setState({isLoading: true})
      this._callTransferPoint()
    }
  }

  _callTransferPoint = () => {
    const request = {
      rewardProgramID: APIConstant.RPID,
      contactID: this.state.userID,
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
        this.setState({isLoading: false});
        if(response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          Alert.alert('Success', response.statusMessage);
          this._processAfterTransfer()
        }  
      })
      .catch(error => console.log('error : ' + error));
  }

  _processAfterTransfer = async () => {
    var currentPoint = this.state.userPoint;
    var transfer = this.state.transferAmount;
    const newPoint = currentPoint - transfer;

    await AsyncStorage.setItem('reedemablePoints', newPoint.toString());
    this.setState({
      userPoint: newPoint
    })
  }

  _renderIcon = () => this.state.isLoading ? <ActivityIndicator color={'#012345'} /> : <MDIcon name="keyboard-arrow-right" size={30} />;

  _renderSuggession = () => {
      if(this.state.amount > 0 && this.state.isAllowPartialCashbackRedemption) {
          var sugessions = [];
          var amount = 1;
          if(this.state.amount > 10) {
              amount = Math.round(this.state.amount / 10);
              for(var i = amount; i <= this.state.amount; i = i+amount) {
                  const tmp = i;
                  sugessions.push(
                      <TouchableOpacity
                        style={{marginHorizontal: 5}}
                        activeOpacity={0.8}
                        onPress={()=>{
                            console.log(`Tapped: ${tmp}`)
                            this.setState({otherAmount: tmp})
                        }}
                        >
                        <View style={{ padding: 10, paddingHorizontal: 15, minHeight: 50, borderRadius: 25, backgroundColor: '#012345', justifyContent: 'center', alignSelf: 'center', alignContent: 'center'}}>
                          <Text style={{color: 'white', alignSelf: 'center', fontSize: 18}}>${tmp}</Text>
                        </View>
                      </TouchableOpacity>
                  )
              }
              return (
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}>
                      <View style={{flexDirection: 'row', paddingLeft: 15, marginVertical: 10}}>
                          {sugessions}
                      </View>
                  </ScrollView>
              );
          }
          
      }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <ScreenHeader
          navigation={this.props.navigation}
          title={'Redeem Cashback'}
          userPoint={this.state.userPoint}/>
        <ScrollView>
            <View style={{flexDirection: 'column'}}>
            <View style={{hegith: 150}}>
            <Image
                style={{height: 150}}
                source={{
                uri:
                    'http://preview.byaviators.com/template/superlist/assets/img/tmp/agent-2.jpg',
                }}
                resizeMode="cover"
            />
            <View style={styles.imageOverlay} />
            </View>
            <View style={{paddingHorizontal: 10, flex: 1, paddingTop: 5}}>
                <Text style={{fontSize: 24, padding: 10}}>How much chashback would you like to?</Text>
                <TouchableOpacity
                activeOpacity={0.8}
                onPress={()=>this.setState({otherAmount: this.state.amount})}>
                <View style={{borderRadius: 15, height: 180, width: '90%', alignItems: 'center', justifyContent: 'center', alignContent: 'center', alignSelf: 'center', marginVertical: 15}}>
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
                        resizeMode={'cover'}/>

                    <View style={{height: 180, alignSelf: 'center', paddingHorizontal: '10%', paddingVertical: 10, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 15,}}>
                        <Text style={{fontSize: 16, color: 'white', textAlign: 'center'}}>Tap to redeem maximum cashback amount</Text>
                        <Text style={{fontSize: 30, color: 'white', alignSelf: 'center', marginTop: 25}}>${this.state.amount || '80'}</Text>
                    </View>
                </View>
                </TouchableOpacity>
                {this._renderSuggession()}
                <Card 
                    containerStyle={{
                        flex: 1,
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                        marginBottom: 0,
                    }}>
                {this.state.isAllowPartialCashbackRedemption && <View>
                    <Text
                        style={{paddingLeft: 10, color: this.state.otherAmounterror ? 'red' : 'black'}}>
                        Enter other amount
                    </Text>
                    <View
                        style={{
                            marginVertical: 10,
                            borderColor: this.state.otherAmounterror ? 'red' : 'rgba(153,153,153,0.5)',
                            borderWidth: 2,
                            paddingHorizontal: 10,
                            marginHorizontal: 5,
                            borderRadius: 10,
                            flexDirection: 'row'
                        }}>
                        <Text style={{alignSelf: 'center', fontSize: 16}}>$</Text>
                        <TextInput
                            style={{fontSize: 17, fontWeight: 'bold'}}
                            keyboardType={'numeric'}
                            value={`${this.state.otherAmount || ''}`}
                            placeholder="Enter other amount"
                            onChangeText={(text) => {
                                this.setState({
                                    otherAmount: text,
                                })
                            }}
                        />
                    </View></View>}
                
                <SwipeButton
                    thumbIconBackgroundColor="#FFFFFF"
                    containerStyle={{backgroundColor: '#012345'}}
                    swipeSuccessThreshold={90}
                    thumbIconComponent={this._renderIcon}
                    title="Slide to Redeem"
                    titleColor={'white'}
                    railBackgroundColor={'#012345'}
                    railFillBackgroundColor={'green'}
                    shouldResetAfterSuccess
                    disabled={this.state.isLoading}
                    onSwipeSuccess={() => {
                        this._prepareForm()
                    }}
                    />
                </Card>
                </View>
                
            </View>
        </ScrollView>
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
};
