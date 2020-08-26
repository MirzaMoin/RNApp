import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList, AsyncStorage, Alert} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ScreenHeader} from '../widget/ScreenHeader';
import RBSheet from 'react-native-raw-bottom-sheet';

export default class TransactionHistory extends Component {
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
      this._getStoredData();
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  _getStoredData = async () => {
    try {
      await AsyncStorage.getItem('reedemablePoints', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          if (value) {
            this.setState({
              isLoading: true,
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
            })
          }
        }
      });

      await AsyncStorage.getItem('userID', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          //const val = JSON.parse(value);
          if (value) {
            this.setState({
              userID: value,
            }, () => this._callTransactionHistory())
          }
        }
      });
    } catch (error) {
      console.log(error)
    }
  };

  _callTransactionHistory = () => {
    
  }

  render() {
    return (
      <View style={styles.mainContainer}>
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
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled={this.data.length > 3}
          data={this.data}
          renderItem={({item, index}) => (
            <View
              style={[
                styles.rowContainer,
                {
                  backgroundColor:
                    index % 2 ? 'rgba(153,153,153,0.15)' : 'white',
                },
              ]}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <MDIcon style={styles.rowItemIcon} name={'date-range'} />
                <Text style={styles.rowTitle}>Date:</Text>
                <Text style={[styles.rowItemtext, {color: 'red'}]}>
                  {item.date}
                </Text>
              </View>

              <View style={{flex: 1, flexDirection: 'row'}}>
                <MDIcon style={styles.rowItemIcon} name={'location-on'} />
                <Text style={styles.rowTitle}>Location:</Text>
                <Text style={[styles.rowItemtext, {color: 'grey'}]}>
                  {item.location}
                </Text>
              </View>

              <View style={{flex: 1, flexDirection: 'row'}}>
                <Icon name="gift" style={styles.rowItemIcon} size={20} />
                <Text style={styles.rowTitle}>Point:</Text>
                <Text
                  style={[
                    styles.rowItemtext,
                    {
                      color: item.point.indexOf('-') == -1 ? 'green' : 'red',
                    },
                  ]}>
                  {item.point}
                </Text>
              </View>

              <View style={{flex: 1, flexDirection: 'row'}}>
                <MDIcon style={styles.rowItemIcon} name={'credit-card'} />
                <Text style={styles.rowTitle}>Balance:</Text>
                <Text style={[styles.rowItemtext, {color: 'gray'}]}>
                  {item.balance}
                </Text>
              </View>
            </View>
          )}
        />
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.footerMenuItem}
            onPress={() => {
              this.setState({title: 'Profile', tabIndex: 0});
            }}>
            <Image
              style={[
                styles.footerMenuItemImage,
                this.state.tabIndex == 0
                  ? styles.footerMenuSelectedItem
                  : styles.footerMenuIdelItem,
              ]}
              source={{
                uri:
                  'https://image.flaticon.com/icons/png/128/2089/2089773.png',
              }}
              resizeMode="cover"
            />
            <Text
              style={[
                this.state.tabIndex == 0
                  ? styles.footerMenuSelectedItemText
                  : styles.footerMenuIdelItemText,
              ]}>
              Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerMenuItem}
            onPress={() => {
              this.setState({title: 'Ways to earn', tabIndex: 1});
            }}>
            <Image
              style={[
                styles.footerMenuItemImage,
                this.state.tabIndex == 1
                  ? styles.footerMenuSelectedItem
                  : styles.footerMenuIdelItem,
              ]}
              source={{
                uri: 'https://image.flaticon.com/icons/png/128/879/879788.png',
              }}
              resizeMode="cover"
            />
            <Text
              style={[
                this.state.tabIndex == 1
                  ? styles.footerMenuSelectedItemText
                  : styles.footerMenuIdelItemText,
              ]}>
              Way to Earn
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerMenuItem}
            onPress={() => {
              this.setState({title: 'Offer', tabIndex: 2});
            }}>
            <Image
              style={[
                styles.footerMenuItemImage,
                this.state.tabIndex == 2
                  ? styles.footerMenuSelectedItem
                  : styles.footerMenuIdelItem,
              ]}
              source={{
                uri: 'https://image.flaticon.com/icons/png/128/879/879757.png',
              }}
              resizeMode="cover"
            />
            <Text
              style={[
                this.state.tabIndex == 2
                  ? styles.footerMenuSelectedItemText
                  : styles.footerMenuIdelItemText,
              ]}>
              Offer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerMenuItem}
            onPress={() => {
              this.setState({title: 'Notification', tabIndex: 3});
            }}>
            <Image
              style={[
                styles.footerMenuItemImage,
                this.state.tabIndex == 3
                  ? styles.footerMenuSelectedItem
                  : styles.footerMenuIdelItem,
              ]}
              source={{
                uri:
                  'https://image.flaticon.com/icons/png/128/2097/2097743.png',
              }}
              resizeMode="cover"
            />
            <Text
              style={[
                this.state.tabIndex == 3
                  ? styles.footerMenuSelectedItemText
                  : styles.footerMenuIdelItemText,
              ]}>
              Notification
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerMenuItem}>
            <Image
              style={styles.footerMenuItemImage}
              source={{
                uri: 'https://image.flaticon.com/icons/png/128/149/149946.png',
              }}
              resizeMode="cover"
            />
            <Text style={{fontSize: 11, color: 'white'}}>More</Text>
          </TouchableOpacity>
        </View>
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
  rowContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 7,
    paddingBottom: 7,
  },
  rowItemIcon: {alignSelf: 'center', fontSize: 20},
  rowTitle: {
    paddingLeft: 7,
    fontSize: 18,
    fontFamily: 'helvetica',
    fontWeight: 'bold',
  },
  rowItemtext: {
    paddingLeft: 15,
    fontSize: 18,
    fontFamily: 'helvetica',
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
