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
import { ScrollView } from 'react-native-gesture-handler';

const Width = Dimensions.get('window').width;

export default class OfferDetailScreen extends Component {
  static navigationOptions = {
    header: null,
  };    
  constructor() {
    console.log('Constructor called offer details');
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
      this._getStoredData();
      console.log(`Offer SCreen DAta: ${JSON.stringify(this.props.navigation.state.params)}`)
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
        <View style={{backgroundColor: 'white', flex: 1, paddingBottom: 10}}>
            <View>
                <Image
                    style={{height: Width, width: Width}}
                    source={{
                    uri:
                        'https://dg.imgix.net/let-not-food-destroy-the-body-egu11qj4-en/landscape/let-not-food-destroy-the-body-egu11qj4-1bf920a0e6871d3d5af01ec847a8d908.jpg?ts=1574201747&ixlib=rails-4.0.0&auto=format%2Ccompress&fit=min&w=700&h=394&dpr=2&ch=Width%2CDPR',
                    }}
                    resizeMode="cover"
                />
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
                    }}>37 PTS</Text>
            </View>
            <Text
                style={{
                    paddingTop: 10,
                    paddingHorizontal: 15,
                    fontSize: 18,
                    fontWeight: '600',
                    width: Width,
                    alignSelf: 'flex-end',}}>Hello this is title now we are trying to show it in full screebn</Text>
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
            <Image
                style={{height: 100, marginBottom: 15, marginHorizontal: 10}}
                source={{
                    uri: 'https://internationalbarcodes.com/wp-content/uploads/sites/95/2013/11/SSCC-Pallet-Barcode.jpg',
                }}
                resizeMode={'center'}
                /> 
            <View style={{paddingHorizontal: 15, marginBottom: 15}}>
                <Text style={{fontSizeL: 16}}>Demo TimeBase</Text>
                <Text style={{fontSizeL: 14, color: 'grey'}}>104, E 04 ET</Text>
                <Text style={{fontSizeL: 14, color: 'grey'}}>Norries city</Text>
                <Text style={{fontSizeL: 14, color: 'blue'}}>http://roborewards.net</Text>
            </View>

            <View style={{marginHorizontal: 15, borderWidth: 1, borderColor: 'grey', borderRadius: 10, padding: 10, alignItems: 'center'}}>
                <Text style={{fontSizeL: 14, color: 'grey'}}>Internal use only -00000000001310</Text>
                <Text style={{fontSizeL: 14, color: 'grey', marginTop: 5}}>Mobile: 2136001111</Text>
                <View style={{flexDirection: 'row', marginTop: 5, paddingHorizontal: 5}}>
                  <Text style={{fontSizeL: 14, color: 'grey', flex: 1}}>CardID: </Text>
                  <Text style={{fontSizeL: 14, color: 'grey', flex: 1, textAlign: 'right'}}>Offer ID: 5619</Text>
                </View>
            </View>
        </View>
        </ScrollView>
        <View style={{flexDirection: 'row', backgroundColor: '#012345'}}>
            <Text style={{flex: 1, backgroundColor: '#012345', textAlign: 'center', color: 'white', fontSize: 17, padding: 10}}>Redeem Offer</Text>        
            <View style={{width: 1.5, backgroundColor: 'white', height: '50%', marginVertical: 5, alignSelf: 'center'}}/>
            <Text style={{flex: 1, backgroundColor: '#012345', textAlign: 'center', color: 'white', fontSize: 17, padding: 10}}>Print Offer</Text>        
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
