import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {ScreenHeader} from '../widget/ScreenHeader';
import {ProfileScreen} from './ProfileScreen';
import {WayToEarnScreen} from './WaysToEarnScreen';
import RBSheet from 'react-native-raw-bottom-sheet';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';

export default class TabScreen extends Component {
  static navigationOptions = {
    // header: null,
  };

  constructor() {
    console.log('Constructor called');
    super();
    this.state = {
      title: 'HomeScreen',
      tabIndex: 1,
    };
  }

  _renderScreens = () => {
    switch (this.state.tabIndex) {
      case 0:
        console.log('0 lauded');
        return <ProfileScreen />;
      case 1:
        console.log('1 lauded');
        return <WayToEarnScreen />;
      case 2:
        console.log('2 lauded');
        return <View />;
      case 3:
        console.log('3 lauded');
        return <View />;
      case 4:
        console.log('4 lauded');
        this.Standard.open();
        return;
      case 5:
        console.log('5 lauded');
        return <View />;
      case 6:
        console.log('6 lauded');
        return <View />;
      case 7:
        console.log('7 lauded');
        return <View />;
      case 8:
        console.log('8 lauded');
        return <View />;
      case 9:
        console.log('9 lauded');
        return <View />;
      default:
        console.log('default lauded');
        return <View />;
    }
  };
  data = {
    lists: [
      {
        icon: 'photo-camera',
        label: 'Take photo',
        position: 5,
      },
      {
        icon: 'photo',
        label: 'Choose image',
        position: 6,
      },
      {
        icon: 'brush',
        label: 'Drawing',
        position: 7,
      },
      {
        icon: 'mic',
        label: 'Recording',
        position: 8,
      },
      {
        icon: 'check-box',
        label: 'Checkboxes',
        position: 9,
      },
    ],
    grids: [
      {
        label: 'Facebook',
        icon: 'facebook',
        color: '#3b5998',
      },
      {
        label: 'Twitter',
        icon: 'twitter',
        color: '#38A1F3',
      },
      {
        label: 'Google+',
        icon: 'google-plus-official',
        color: '#DD4B39',
      },
      {
        label: 'Linkedin',
        icon: 'linkedin',
        color: '#0077B5',
      },
      {
        label: 'Dropbox',
        icon: 'dropbox',
        color: '#3d9ae8',
      },
      {
        label: 'Reddit',
        icon: 'reddit-alien',
        color: '#FF4301',
      },
      {
        label: 'Skype',
        icon: 'skype',
        color: '#00aff0',
      },
      {
        label: 'Pinterest',
        icon: 'pinterest',
        color: '#c8232c',
      },
      {
        label: 'Flickr',
        icon: 'flickr',
        color: '#ff0084',
      },
      {
        label: 'VK',
        icon: 'vk',
        color: '#4c75a3',
      },
      {
        label: 'Dribbble',
        icon: 'dribbble',
        color: '#ea4c89',
      },
      {
        label: 'Telegram',
        icon: 'send',
        color: '#0088cc',
      },
    ],
  };

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={{flex: 1}}>{this._renderScreens()}</View>
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

          <TouchableOpacity
            style={styles.footerMenuItem}
            onPress={() => {
              this.Standard.open();
            }}>
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
        <RBSheet
          ref={ref => {
            this.Standard = ref;
          }}
          height={330}>
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>Option Menu</Text>
            {this.data.lists.map(list => (
              <TouchableOpacity
                key={list.icon}
                style={styles.listButton}
                onPress={() => {
                  this.setState({
                    title: list.label,
                    tabIndex: list.position,
                  });
                  this.Standard.close();
                }}>
                <MDIcon name={list.icon} style={styles.listIcon} />
                <Text style={styles.listLabel}>{list.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </RBSheet>
      </SafeAreaView>
    );
  }
}

const styles = {
  mainContainer: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    maxHeight: 50,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 1,
    alignItem: 'center',
    flexDirection: 'row',
    backgroundColor: '#f6f6f6',
    textAlign: 'center',
  },
  headerUserImage: {height: 35, width: 35},
  headerText: {
    textAlign: 'center',
    flex: 1,
    marginBottom: 12,
    alignSelf: 'center',
    fontSize: 25,
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
  backgroundImage: {
    height: null,
    width: null,
    flex: 1,
  },
  listContainer: {
    flex: 1,
    padding: 25,
  },
  listTitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  listIcon: {
    fontSize: 26,
    color: '#666',
    width: 60,
  },
  listLabel: {
    fontSize: 16,
  },
};
