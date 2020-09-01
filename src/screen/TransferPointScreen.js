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
import {BottomNavigationTab} from './../widget/BottomNavigationTab';
import {makeRequest} from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import {ScreenHeader} from '../widget/ScreenHeader';
import SwipeButton from 'rn-swipe-button';

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
      userPoint: newPoint,
      transferAmount: '',
      transferTo: '',
    })
  }

  _renderIcon = () => this.state.isLoading ? <ActivityIndicator color={'#012345'} /> : <MDIcon name="keyboard-arrow-right" size={30} />;

  render() {
    return (
      <View style={styles.mainContainer}>
        <ScreenHeader
          navigation={this.props.navigation}
          title={'Transfer Point'}
          userPoint={this.state.userPoint}/>
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
        <View style={{padding: 10, flex: 1, justifyContent: 'center'}}>
          <Text
            style={{
              fontSize: 22,
              marginBottom: 20,
              paddingLeft: 10,
            }}>
            How many are you transfering?
          </Text>
          <Text style={{padding: 5, paddingLeft: 10, color: this.state.transferAmountError ? 'red' : 'black'}}>Enter Point Amount</Text>
          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              borderColor: this.state.transferAmountError ? 'red' : 'rgba(153,153,153,0.5)',
              borderWidth: 2,
              padding: 10,
              borderRadius: 10,
            }}>
            <TextInput
              style={{fontSize: 17, fontWeight: 'bold'}}
              placeholder={`${this.state.userPoint || 50} PTS`}
              keyboardType={'numeric'}
              onChangeText={(text) => {
                this.setState({
                  transferAmount: text
                })
              }}
            />
          </View>

          <View
            style={{
              margin: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{flex: 1, flexDirection: 'row', position: 'absolute'}}>
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
              }}>
              Transfering to
            </Text>
          </View>

          <Text
            style={{padding: 5, paddingLeft: 10, color: this.state.transferToError ? 'red' : 'black'}}>
            Enter User Details
          </Text>
          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              borderColor: this.state.transferToError ? 'red' : 'rgba(153,153,153,0.5)',
              borderWidth: 2,
              padding: 10,
              borderRadius: 10,
            }}>
            <TextInput
              style={{fontSize: 17, fontWeight: 'bold'}}
              placeholder="Email, mobile number or Member CardID"
              onChangeText={(text) => {
                this.setState({
                  transferTo: text,
                })
              }}
            />
          </View>

          <View style={{
              marginTop: 30,
              marginRight: 10,
            }}>
            <SwipeButton
              thumbIconBackgroundColor="#FFFFFF"
              containerStyle={{backgroundColor: '#012345'}}
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
          </View>
        </View>
        <BottomNavigationTab />
      </View>
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
