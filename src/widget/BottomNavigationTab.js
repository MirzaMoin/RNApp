import React, {Component} from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';
import {Card} from 'react-native-elements';

export class BottomNavigationTab extends Component {
  constructor() {
    console.log('Constructor called');
    super();
    this.state = {
      title: 'HomeScreen',
      tabIndex: 1,
    };
  }

  render() {
    return (
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
              uri: 'https://image.flaticon.com/icons/png/128/2089/2089773.png',
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
              uri: 'https://image.flaticon.com/icons/png/128/2097/2097743.png',
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
    );
  }
}

const styles = {
  footerContainer: {
    height: 50,
    padding: 5,
    backgroundColor: '#012340',
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
