import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Dimensions
} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {makeRequest} from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import {ScreenHeader} from '../widget/ScreenHeader';
import Toast from 'react-native-root-toast';
import { Header } from 'react-navigation-stack';

const maxWidth = Dimensions.get('window').width;

export default class LeaderBoardScreen extends Component {
  
    static navigationOptions = {
        header: null,
    };

  constructor() {
    super();
    this.state = {
        qualificationCriteria: {},
        filters: [],
        leaderBoardReport: [],
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
                isLoading: true,
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
            },()=>{this._callGetUploadReceiptScreenData()});
          }
        }
      });
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

  _callGetUploadReceiptScreenData = () => {
      return;
    makeRequest(
        `${APIConstant.BASE_URL}${APIConstant.GET_UPLOAD_RECEIPT_SCREEN_DATA}?RewardProgramID=${APIConstant.RPID}&WebFormID=${this.state.webformID}`,
        'get',
      )
    .then(response => {
        //console.log(JSON.stringify(response));
        this.setState({isLoading: false});
        if(response.statusCode == 0) {
            Alert.alert('Oppss...', response.statusMessage);
        } else {
            
        }  
    })
    .catch(error => console.log('error : ' + error));
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <ScreenHeader
          navigation={this.props.navigation}
          title={'Leaderboard'}/>
          <View style={{height: 30, flexDirection: 'row', backgroundColor: '#012345', alignItems: 'center'}}>
              <Text style={{flex: 1, fontSize: 15, marginHorizontal: 10, textAlign: 'center', backgroundColor: 'white', marginLeft: 20, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, height: '100%'}}> Welcome </Text>
              <Text style={{flex: 1, fontSize: 15, marginHorizontal: 10, textAlign: 'center', backgroundColor: 'white', marginLeft: 20, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, height: '100%'}}> Welcome </Text>
          </View>
          <View style={{
            backgroundColor: '#012345',
            position: 'absolute',
            marginTop: 160 + Header.HEIGHT,
            height: 70,
            alignSelf: 'center',
            width: maxWidth/3.1,
            borderBottomLeftRadius: maxWidth/2,
            borderBottomRightRadius: maxWidth/2,
            transform: [
                {scaleX: 3.3}
            ],
        }} />
        <View style={{height: 150, backgroundColor: '#012345'}}>

        </View>
        
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
  button: {
    minWidth: 120,
    marginTop: 15,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: '#012345',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    margin: 8,
    marginHorizontal: 15
  }
};
