import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Card} from 'react-native-elements';

export default class OfferScreen extends Component {
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
          style={{marginTop: 5}}
          renderItem={({item, index}) => (
            <Card containerStyle={{padding: 0}} style={styles.rowContainer}>
              <View style={{backgroundColor: 'white'}}>
                <View style={styles.titleRow}>
                  <Text style={styles.pointItem}>37 PTS</Text>
                  <Text style={styles.offerTitle}>COUTOP OFFER TITLE</Text>
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
                <Image
                  style={{height: 250}}
                  source={{
                    uri:
                      'https://dg.imgix.net/let-not-food-destroy-the-body-egu11qj4-en/landscape/let-not-food-destroy-the-body-egu11qj4-1bf920a0e6871d3d5af01ec847a8d908.jpg?ts=1574201747&ixlib=rails-4.0.0&auto=format%2Ccompress&fit=min&w=700&h=394&dpr=2&ch=Width%2CDPR',
                  }}
                  resizeMode="cover"
                />
              </View>
            </Card>
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
    padding: 5,
    color: 'white',
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
