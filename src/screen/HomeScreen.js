import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  FlatList,
  AsyncStorage,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import ImageLoader from './../widget/ImageLoader';
import AnimateNumber from './../widget/AnimateNumber';
import { Header } from 'react-navigation-stack';
import LinearGradient from 'react-native-linear-gradient';

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
      var userID, webformID, firstName = '', lastName = '', profile ='', userPoint ='';
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
          } else {
            profile = ''
          }
        }
      });

      await AsyncStorage.getItem('reedemablePoints', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          //const val = JSON.parse(value);
          if (value) {
            userPoint = value
          }
        }
      });
      this.setState({
        userID: userID,
        webformID: webformID,
        userFullName: `${firstName} ${lastName}`,
        userProfileImage: profile,
        userPoint: userPoint,
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

  _renderBottomMenuItem = (title, index, icon) => {
    return (
      <TouchableOpacity
        activeOpacity={this.state.tabIndex == index ? 1 : 0.6}
        style={[
          styles.footerMenuItem,
          {flex: this.state.tabIndex == index ? 3 : 1},
          {backgroundColor: this.state.tabIndex == index ? '#075985' : '#012345'},
          this.state.tabIndex == index ? {margin: 9, borderRadius: 40, paddingVertical: 7} : {}
        ]}
        onPress={() => {
          if(index == 4) {
            this.Standard.open();
          } else {
            this.setState({title: title, tabIndex: index});
          }
        }}>
        <Image
          style={[styles.footerMenuItemImage,this.state.tabIndex==index?styles.footerMenuSelectedItem:styles.footerMenuIdelItem]}
          source={{
            uri:
              icon,
          }}
          resizeMode="cover"
        />
        {this.state.tabIndex == index && <Text style={styles.footerMenuSelectedItemText}>{title}</Text>}
      </TouchableOpacity>
    );
  }

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
        {/*<ImageBackground
          style={styles.backgroundImage}
          source={{
            uri:
              'https://cdn-media-1.freecodecamp.org/images/1*gQEm5r-73VpwmSrHYRi0AQ.jpeg',
          }}
          resizeMode="cover">*/}
          {/*<View style={{flex: 1}}>{this._renderScreens()}</View>*/}
          <View style={{width: '100%', padding: 5, backgroundColor: '#FE9D3F', flexDirection: 'row'}}>
            <Text style={{fontSize: 15, color: 'white', paddingLeft: 10, flex: 1, alignSelf: 'center'}}>Refere Friend & Earn 40 Points!</Text>
            <Icon name={'share-square'} style={{color: '#0282C6', fontSize: 20}} />
          </View>
          <View style={{flex: 1}}>
            <LinearGradient
              colors={['#0282C6', '#075985']}
              style={{flexDirection: 'column', padding: 10, height: 200, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                <View style={{flexDirection: 'row', width: '50%', padding: 5}}>
                  <View style={{height: 6, width: 6,borderRadius: 5 , backgroundColor: '#FE9D3F', alignSelf: 'center', marginHorizontal: 5}}/>
                  <Text style={{fontSize: 19, color: 'white', fontFamily: 'bold'}}>Current Points</Text>
                </View>
                <View style={{height: 2, backgroundColor: 'white', width: '50%', margin: 5}} />
                <AnimateNumber
                  value={this.state.userPoint || 0}
                  formatter={(val) => {
                  return <Text 
                  style={{fontSize: 26, color: 'white', fontFamily: 'bold', padding: 5}}
                  >{parseFloat(val).toFixed(2)}</Text>
                }}/>
                <View style={{height: 2, backgroundColor: 'white', width: '50%', margin: 5}} />
                <Text style={{color: '#FE9D3F', fontSize: 16, marginTop: 10, padding: 10, backgroundColor: '#012345', paddingHorizontal: 25, borderRadius: 5}}>Redeem Offer</Text>
            </LinearGradient>
            <FlatList
                style={{flex: 1, backgroundColor: 'rgba(153,153,153,0.5)'}}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
                data={this.data.lists}
                renderItem={({item, index}) => {
                  return (
                    <View style={{padding: 10, flexDirection: 'row', marginTop: 5, backgroundColor: 'white'}}>
                      <MDIcon name={'person'} style={{fontSize: 30, color: 'grey', backgroundColor: 'rgba(153, 153, 153, 0.5)', padding: 10, borderRadius: 50, marginHorizontal: 10}} />
                      <Text style={{flex: 1, paddingHorizontal: 10, fontSize: 18, alignSelf: 'center'}}>Golden Status</Text>
                      <MDIcon name={'keyboard-arrow-right'} style={{alignSelf: 'center', fontSize: 30, color: '#FE9D3F'}}/>
                    </View>
                  );
                }}
              />
          </View>
          <View style={styles.footerContainer}>
            {this._renderBottomMenuItem('Home', 0, 'https://image.flaticon.com/icons/png/128/747/747420.png')}
            {this._renderBottomMenuItem('Transaction', 1, 'https://image.flaticon.com/icons/png/128/879/879788.png')}
            {this._renderBottomMenuItem('Offer', 2, 'https://image.flaticon.com/icons/png/128/879/879757.png')}
            {this._renderBottomMenuItem('Notification', 3, 'https://image.flaticon.com/icons/png/128/2097/2097743.png')}
            {this._renderBottomMenuItem('More', 4, 'https://image.flaticon.com/icons/png/128/149/149946.png')}
          </View>
        {/*</ImageBackground>*/}
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
    //height: 50,
    backgroundColor: '#012345',
    alignItem: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  footerMenuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'wite',
    padding: 10,
    flexDirection: 'row',
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
    tintColor: '#fff',
  },
  footerMenuSelectedItemText: {
    color: 'white',
    fontSize: 15,
    padding: 5,
    marginLeft: 5,
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
