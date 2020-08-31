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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Card} from 'react-native-elements';
import {ScreenHeader} from '../widget/ScreenHeader';

const Width = Dimensions.get('window').width;
var isRefresh = true;

export default class OfferScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    console.log('Constructor called');
    super();
    this.state = {
      title: 'HomeScreen',
      tabIndex: 1,
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
      console.log('refressing')
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
          if (value) {
            this.setState({
              webformID: value,
            });
          }
        }
      });
    } catch (error) {
      console.log(error)
    }
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <ScreenHeader
          navigation={this.props.navigation}
          title={'Offers'}
          userPoint={this.state.userPoint}/>
        {/*<View style={{hegith: 150}}>
          <Image
            style={{height: 150}}
            source={{
              uri:
                'http://preview.byaviators.com/template/superlist/assets/img/tmp/agent-2.jpg',
            }}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
          </View>*/}
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled={this.data.length > 3}
          data={this.data}
          renderItem={({item, index}) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={()=>{
                this.props.navigation.navigate('offerDetail', {
                  notification: item,
                  userID: this.state.userID,
                  webformID: this.state.webformID,
                  userPoint: this.state.userPoint,
                  onGoBack: () => this._onGoBack(),
                });
              }}>
              <Card containerStyle={{padding: 0, margin: 0, marginBottom: 10}} style={styles.rowContainer}>
                <View style={{backgroundColor: 'white'}}>
                  <View style={{flexDirection: 'column-reverse'}}>
                    <Image
                        style={{height: 250}}
                        source={{
                          uri:
                            'https://dg.imgix.net/let-not-food-destroy-the-body-egu11qj4-en/landscape/let-not-food-destroy-the-body-egu11qj4-1bf920a0e6871d3d5af01ec847a8d908.jpg?ts=1574201747&ixlib=rails-4.0.0&auto=format%2Ccompress&fit=min&w=700&h=394&dpr=2&ch=Width%2CDPR',
                        }}
                        resizeMode="cover"
                      />
                      <View style={{height: 250, width: Width, position: 'absolute'}}>
                        <Text style={{
                          fontFamily: 'helvetica',
                          fontSize: 13,
                          backgroundColor: '#4b92d2',
                          borderRadius: 5,
                          color: 'white',
                          alignSelf: 'flex-start',
                          margin: 20,
                          padding: 7,
                          paddingHorizontal: 10
                        }}>37 PTS</Text>
                        <View style={{flex: 1}} />
                        <Text
                          numberOfLines={1}
                          ellipsizeMode='tail'
                          style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: 'white',
                            backgroundColor: 'rgba(256, 20, 0, 0.5)',
                            width: Width,
                            alignSelf: 'flex-end',
                            padding: 5}}> Hello this is title now we are trying to show it in full screebn</Text>
                      </View>
                  </View>
                  <Text style={styles.offerDetail}>
                    Offer description text, Offer description text,Offer
                    description text,Offer description text,Offer description
                    text,Offer description text,Offer description text,Offer
                    description text,Offer description text,Offer description
                    text,Offer description text,Offer description text,
                  </Text>
                  <View style={styles.baseOfferType}>
                    <Icon
                      name="trophy"
                      style={{alignSelf: 'center', color: '#4b92d2'}}
                      size={20}
                    />
                    <Text style={styles.offerType}>Rewards Goal</Text>
                    <Text style={styles.offerExpiry}>No Expiration</Text>
                  </View>
                  
                </View>
              </Card>
            </TouchableOpacity>
          )}
        />
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
    paddingTop: 15,
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
