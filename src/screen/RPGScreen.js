import React, { Component } from 'react';
import { 
    StyleSheet,
    Image,
    View,
    Text,
    AsyncStorage,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    ScrollView, FlatList
} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import TextInput from 'react-native-textinput-with-icons';
import {makeRequest} from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import {ScreenHeader} from '../widget/ScreenHeader';

export default class RPGScreen extends Component {
  static navigationOptions = {
    header: null,
  };
   
  constructor() {
    super();
    this.state = {
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({ 
        isLoading: true
      });
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
            },()=>{this._callRPGData()});
          } else {
          }
        }
      });
    } catch (error) {
      console.log(error)
    }
  };

  data=[
      {name: 'hardik'},{name: 'patel'}
  ]

  _callRPGData = () => {
    makeRequest(
        `${APIConstant.BASE_URL}${APIConstant.GET_RPG_DATA}?RPToken=${APIConstant.RPTOKEN}&ContactId=${this.state.userID}`,
        'get',
      )
        .then(response => {
          if(response.statusCode == 0) {
            Alert.alert('Oppss...', response.statusMessage);
          } else {
            this.setState({
              screenData: response.responsedata.lstRPG,
              isLoading: false,
            });
          }
        })
        .catch(error => console.log('error : ' + error));
  }

  _renderRow = item => {
      return(
        <View style={{flexDirection: 'row', minHeight: 70, alignContent: 'center', alignItems: 'center', height: 80}}>
            <View style={{padding: 5, height: '100%', backgroundColor: 'rgba(153,153,153,0.5)', width: '18%', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
                <Text style={{fontSize: 18}}>{item.pointValue}</Text>
                <Text>Entries</Text>
            </View>
            <Image
                style={{height: 60, width: 60, borderRadius: 10, marginHorizontal: 5}}
                source={{
                    uri: item.image
                }}
            />
            <View style={{flex: 1, height: 70, flexDirection: 'column', paddingLeft: 5}}>
            <Text style={{fontSize: 18,}}>{item.title}</Text>
            <Text numberOfLines={2} ellipsizeMode='tail' style={{fontSize: 15, color: 'rgba(153, 153, 153, 1)'}}>{item.details}</Text>
            </View>
            <View style={{width: '10%', height: '100%', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
                <View style={{height: '100%', width: 2, backgroundColor: item.isActive ? 'red' : 'rgba(153,153,153,1)'}} />
                <View style={{backgroundColor: item.isActive ? 'red' : 'rgba(153,153,153,1)', position: 'absolute', padding: 5, borderRadius: 50}}>
                    <MDIcon name={'check'} style={{color: 'white', fontSize: 14, fontWeight: 'bold'}} />
                </View>
            </View>
        </View>
      )
  }

  _renderBody = () => {
      if(this.state.isLoading) {
          return (
            <View style={{flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={'large'} />
          </View>
          );
      } else {
          return (
            <ScrollView>
            <View style={{flexDirection: 'column', flex: 1}}>
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
            </View>
            <FlatList
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                data={this.state.screenData}
                renderItem={({item, index}) => this._renderRow(item)}
            />
        </ScrollView>
          )
      }
  }

  render() {
    return (
      <View style={{flex:1, flexDirection: 'column'}}>
        <ScreenHeader
          navigation={this.props.navigation}
          title={'Rewards Entry Goal'}
          userPoint={this.state.userPoint}/>
            {this._renderBody()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        paddingTop: 50,
        alignItems: 'center',
    },
    button: {
        minWidth: 120,
        marginTop: 20,
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: '#012345',
      },
      picker: {
        flex: 1,
        height: 55,
        alignContent: 'flex-end',
        alignSelf: 'center',
        justifyContent: 'center',
        marginLeft: 10,
      },
      buttonText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
        margin: 8,
        marginHorizontal: 15
      },
      imageOverlay: {
        height: 150,
        width: '100%',
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.35)',
      },
});