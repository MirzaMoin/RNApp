import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  AsyncStorage,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import ImageLoader from './../widget/ImageLoader';
import { Header } from 'react-navigation-stack';

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      title: 'HomeScreen',
      tabIndex: 0,
    };
  }

  componentWillMount(){
    this._getStoredData();
  }

  _getStoredData = async () => {
    try {
      var userID, webformID, firstName, lastName, profile;
      await AsyncStorage.getItem('userID', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          //const val = JSON.parse(value);
          if (value) {
            userID= value
          }
        }
      });

      await AsyncStorage.getItem('webformID', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          //const val = JSON.parse(value);
          if (value) {
            webformID = value
          }
        }
      });

      await AsyncStorage.getItem('firstName', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          //const val = JSON.parse(value);
          if (value) {
            firstName = value;
          }
        }
      });

      await AsyncStorage.getItem('lastName', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          //const val = JSON.parse(value);
          if (value) {
            lastName = value
          }
        }
      });

      await AsyncStorage.getItem('profilePitcure', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          //const val = JSON.parse(value);
          if (value) {
            profile = value
          }
        }
      });
      this.setState({
        userID: userID,
        webformID: webformID,
        userFullName: `${firstName} ${lastName}`,
        userProfileImage: profile,
      });
    } catch (error) {
      // Error saving data
      console.log(error)
    }
  };

  _renderScreens = () => {
    switch (this.state.tabIndex) {
      case 0:
        console.log('0 lauded');
        return <View />;
      case 1:
        console.log('1 lauded');
        return <View />;
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
        console.log('3 lauded');
        return <View />;
      case 6:
        console.log('4 lauded');
        return <View />;
      case 7:
        console.log('4 lauded');
        return <View />;
      case 8:
        console.log('4 lauded');
        return <View />;
      case 9:
        console.log('4 lauded');
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
      // eslint-disable-next-line react-native/no-inline-styles
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => {
          this.props.navigation.openDrawer();
        }}>
        <MDIcon name={'menu'} style={styles.leftIcon}/>
        </TouchableOpacity>
        <Text style={styles.title}>Home</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={()=>{
            this.props.navigation.navigate('profileTab')
          }}>
          <ImageLoader 
            title={this.state.userFullName}
            src={this.state.userProfileImage}
            rounded
            style={styles.headerUserImage}/>
        </TouchableOpacity>
      </View>
        <ImageBackground
          style={styles.backgroundImage}
          source={{
            uri:
              'https://cdn-media-1.freecodecamp.org/images/1*gQEm5r-73VpwmSrHYRi0AQ.jpeg',
          }}
          resizeMode="cover">
          <View style={{flex: 1}}>{this._renderScreens()}</View>
          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={styles.footerMenuItem}
              onPress={() => {
                this.setState({title: 'Home', tabIndex: 0});
              }}>
              <Image
                style={[styles.footerMenuItemImage,this.state.tabIndex==0?styles.footerMenuSelectedItem:styles.footerMenuIdelItem]}
                source={{
                  uri:
                    'https://image.flaticon.com/icons/png/128/747/747420.png',
                }}
                resizeMode="cover"
              />
              <Text style={[this.state.tabIndex == 0 ? styles.footerMenuSelectedItemText : styles.footerMenuIdelItemText]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.footerMenuItem}
              onPress={() => {
                this.setState({title: 'Transaction', tabIndex: 1});
              }}>
              <Image
                style={[styles.footerMenuItemImage, this.state.tabIndex == 1 ? styles.footerMenuSelectedItem : styles.footerMenuIdelItem]}
                source={{
                  uri:
                    'https://image.flaticon.com/icons/png/128/879/879788.png',
                }}
                resizeMode="cover"
              />
              <Text style={[this.state.tabIndex == 1 ? styles.footerMenuSelectedItemText : styles.footerMenuIdelItemText]}>Transaction</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.footerMenuItem}
              onPress={() => {
                this.setState({title: 'Offer', tabIndex: 2});
              }}>
              <Image
                style={[styles.footerMenuItemImage, this.state.tabIndex == 2 ? styles.footerMenuSelectedItem : styles.footerMenuIdelItem]}
                source={{
                  uri:
                    'https://image.flaticon.com/icons/png/128/879/879757.png',
                }}
                resizeMode="cover"
              />
              <Text style={[this.state.tabIndex == 2 ? styles.footerMenuSelectedItemText : styles.footerMenuIdelItemText]}>Offer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.footerMenuItem}
              onPress={() => {
                this.setState({title: 'Notification', tabIndex: 3});
              }}>
              <Image
                style={[styles.footerMenuItemImage, this.state.tabIndex == 3 ? styles.footerMenuSelectedItem : styles.footerMenuIdelItem]}
                source={{
                  uri:
                    'https://image.flaticon.com/icons/png/128/2097/2097743.png',
                }}
                resizeMode="cover"
              />
              <Text style={[this.state.tabIndex == 3 ? styles.footerMenuSelectedItemText : styles.footerMenuIdelItemText]}>Notification</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.footerMenuItem}
              onPress={() => {
                this.Standard.open();
              }}>
              <Image
                style={styles.footerMenuItemImage}
                source={{
                  uri:
                    'https://image.flaticon.com/icons/png/128/149/149946.png',
                }}
                resizeMode="cover"
              />
              <Text style={{ fontSize: 11 }}>More</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
  },
  footerMenuItemImage: {
    height: 20,
    width: 20,
  },
  footerMenuSelectedItem: {
    height: 24,
    width: 24,
    tintColor: 'blue',
  },
  footerMenuIdelItem: {
    height: 18,
    width: 18,
    tintColor: '#000',
  },
  footerMenuSelectedItemText: {
    color: 'blue',
    fontSize:11,
  },
  footerMenuIdelItemText: {
    color: '#000',
    fontSize:10,
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
  headerContainer: {
    height: Header.HEIGHT,
    paddingHorizontal: 15,
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#012345',
  },
  leftIcon: {
    color: 'white',
    fontSize: 24,
    alignItems: 'center',
    padding: 15,
    paddingLeft: 0
  },
  title: {
    color: 'white',
    fontSize: 18,
    flex: 1,
  },
  point: {
    color: 'white',
    fontSize: 18,
  },
  pointTerm: {
    color: 'white',
    fontSize: 13,
  }
};
