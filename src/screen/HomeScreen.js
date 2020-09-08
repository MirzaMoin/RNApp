import React, { Component } from 'react';
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
  StatusBar,
  StyleSheet,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import ImageLoader from './../widget/ImageLoader';
import AnimateNumber from './../widget/AnimateNumber';
import { Header } from 'react-navigation-stack';
import LinearGradient from 'react-native-linear-gradient';
import { max } from 'react-native-reanimated';
import HomeModel from './../model/HomeModel';
import MenuLinkModel from './../model/MenuLinkModel';
import GlobalAppModel  from './../model/GlobalAppModel';
import { parseColor } from './../utils/utility';

const maxWidth = Dimensions.get('window').width;

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

  componentWillMount() {
    this._getStoredData();
  }

  _getStoredData = async () => {
    try {
      var userID, webformID, firstName = '', lastName = '', profile = '', userPoint = '';
      await AsyncStorage.getItem('userID', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          //const val = JSON.parse(value);
          if (value) {
            userID = value
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

  _menuSelectColor = [
    '#009688',
    '#2196f3',
    '#673ab7',
    '#00bcd4',
    '#009688',
  ];

  // sendering bottom navigation menu
  _renderBottomMenuItem = (title, index, icon) => {
    return (
      <TouchableOpacity
        activeOpacity={this.state.tabIndex == index ? 1 : 0.6}
        style={[
          styles.footerMenuItem,
          //{ flex: this.state.tabIndex == index ? 3 : 1 },
          //{ backgroundColor: this.state.tabIndex == index ? this._menuSelectColor[index] : '#012345' },
          //this.state.tabIndex == index ? { margin: 9, borderRadius: 40, paddingVertical: 7 } : {}
        ]}
        onPress={() => {
          if (index == 4) {
            this.Standard.open();
          } else {
            this.setState({ title: title, tabIndex: index });
          }
        }}>
        <Icon name={icon} style={{ fontSize: this.state.tabIndex == index || true ? 20 : 18, color: 'white' }} />
        {/*<Text lineBreakMode={'tail'} numberOfLines={1} style={styles.footerMenuSelectedItemText}>{title}</Text>*/}
      </TouchableOpacity>
    );
  }

  // top container for showing point and image with gradient color
  _renderTopContainer = () => {
    return (
      <ImageBackground
        style={{ flexDirection: 'column', height: (maxWidth / 16) * 9, width: maxWidth}}
        source={{
          uri: HomeModel.homePageTopBackgroundImage,
        }}
        resizeMode="cover">
        <LinearGradient
          opacity={HomeModel.homePageTopBackgroundOpacity}
          colors={[parseColor(HomeModel.homePageTopBackgroundGradientStartColor), parseColor(HomeModel.homePageTopBackgroundGradientStopColor)]}
          style={{ flexDirection: 'column', padding: 10, height: (maxWidth / 16) * 9, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', width: '50%', padding: 5 }}>
            <View style={{ height: 6, width: 6, borderRadius: 5, backgroundColor: '#FE9D3F', alignSelf: 'center', marginHorizontal: 5 }} />
            <Text style={{ fontSize: 19, color: 'white', fontFamily: 'bold' }}>{HomeModel.homePageTopTextLine1}</Text>
          </View>
          <View style={{ height: 2, backgroundColor: 'white', width: '50%', margin: 5 }} />
          <AnimateNumber
            value={this.state.userPoint || 0}
            formatter={(val) => {
              return <Text
                style={{ fontSize: 26, color: 'white', fontFamily: 'bold', padding: 5 }}
              >{parseFloat(val).toFixed(2)}</Text>
            }} />
          <View style={{ height: 2, backgroundColor: 'white', width: '50%', margin: 5 }} />
          <LinearGradient
            colors={[parseColor(HomeModel.homePageTopButtonGradientStartColor), parseColor(HomeModel.homePageTopButtonGradientStopColor)]}
            style={{marginTop: 10, padding: 10, paddingHorizontal: 25, borderRadius: 5, alignContent: 'center'}}>
            <Text style={{ color: parseColor(HomeModel.homePageTopButtonTextColor), fontSize: 16}}>{HomeModel.homePageTopButtonText}</Text>
          </LinearGradient>
        </LinearGradient>
      </ImageBackground>
    );
  }

  // bottom container for showing dynamic internal and external links
  _renderBottomContainer = () => {
    console.log(`Text Align : ${HomeModel.homePageBottomTextAlign}`);
    return (
      <ImageBackground
        style={{ flexDirection: 'column', flex: 1, width: maxWidth }}
        opacity={1}
        source={{
          uri: HomeModel.homePageBottomBackgroundImage,
        }}
        resizeMode="cover">
        <LinearGradient
          opacity={HomeModel.homePageBottomBackgroundOpacity}
          colors={[parseColor(HomeModel.homePageBottomBackgroundGradientStartColor), parseColor(HomeModel.homePageBottomBackgroundGradientStopColor)]}
          style={{ flexDirection: 'column', flex: 1 }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            data={HomeModel.menuLinks}
            renderItem={({ item, index }) => {
              MenuLinkModel.setMenuLink(item);
              return (
                <>
                  <View style={{ height: 2, backgroundColor: 'rgba(153,153,153,1)' }} />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => { }}
                    style={{ padding: 10, flexDirection: 'row', marginTop: 5, minHeight: 50 }}>
                    {HomeModel.homePageBottomDisplayIcon && <Icon name={MenuLinkModel.icon} style={{ fontSize: 30, color: parseColor(HomeModel.homePageBottomIconColor), backgroundColor: HomeModel.homePageBottomIconShape == 'none' ? '' : parseColor(HomeModel.homePageBottomIconBackgroundColor), padding: 10, borderRadius: HomeModel.homePageBottomIconShape == 'round' ? 50 : 5, marginHorizontal: 10 }} />}
                    <Text style={{ flex: 1, paddingHorizontal: 10, fontSize: 18, alignSelf: 'center', color: parseColor(MenuLinkModel.menuTextColor), textAlign: HomeModel.homePageBottomTextAlign.toLowerCase() }}>{MenuLinkModel.menuText || ''}</Text>
                    {HomeModel.homePageBottomDisplayArrowIcon && <MDIcon name={'keyboard-arrow-right'} style={{ alignSelf: 'center', fontSize: 30, color: parseColor(HomeModel.homePageBottomArrowColor) }} />}
                  </TouchableOpacity>
                </>
              );
            }}
          />
        </LinearGradient>
      </ImageBackground>
    );
  }

  // rebbon for showing internal or external link at top/bottom of top container
  _renderRebbon = isShow => {
    if ( HomeModel.homePageDisplayRibbon && isShow) {
      return (
        <View style={{ width: '100%', padding: 5, backgroundColor: parseColor(HomeModel.homePageRibbonBackgroundColor), flexDirection: 'row' }}>
          <Text style={{ fontSize: 15, color: parseColor(HomeModel.homePageRibbonTextColor), paddingLeft: 10, flex: 1, alignSelf: 'center' }}>{HomeModel.homePageRibbonText}</Text>
          <Icon name={'share-square'} style={{ color: '#0282C6', fontSize: 20 }} />
        </View>
      );
    }
  }

  // screen toolbar
  _renderToolBar = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => {
          this.props.navigation.openDrawer();
        }}>
          <MDIcon name={'menu'} style={styles.leftIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Home</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            this.props.navigation.navigate('profileTab')
          }}>
          <ImageLoader
            title={this.state.userFullName}
            src={this.state.userProfileImage}
            rounded
            style={styles.headerUserImage} />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <StatusBar barStyle={'light-content'} backgroundColor={'#081b2e'} />
        <SafeAreaView style={styles.mainContainer}>
          {this._renderToolBar()}
          <View style={{ flex: 1 }}>
            {this._renderRebbon(HomeModel.homePageRibbonPosition == 'Top')}
            {this._renderTopContainer()}
            {this._renderRebbon(HomeModel.homePageRibbonPosition == 'Middle')}
            {this._renderBottomContainer()}
          </View>
          {HomeModel.homePageDisplayFooter && <View style={[styles.footerContainer, {backgroundColor: parseColor(GlobalAppModel.footerColor)}]}>
            {this._renderBottomMenuItem('Home', 0, 'home')}
            {this._renderBottomMenuItem('Transaction', 1, 'exchange-alt')}
            {this._renderBottomMenuItem('Offer', 2, 'tag')}
            {this._renderBottomMenuItem('Notification', 3, 'bell')}
            {this._renderBottomMenuItem('More', 4, 'ellipsis-h')}
          </View>}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#f6f6f6',
    textAlign: 'center',
  },
  headerUserImage: { height: 35, width: 35 },
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
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  footerMenuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    paddingVertical: 15,
    flexDirection: 'column',
  },
  footerMenuItemImage: {
    height: 20,
    width: 20,
    tintColor: 'white',
  },
  footerMenuSelectedItem: {
    height: 24,
    //width: 24,
    tintColor: 'white',
  },
  footerMenuIdelItem: {
    height: 18,
    //width: 18,
    tintColor: '#fff',
  },
  footerMenuSelectedItemText: {
    color: 'white',
    fontSize: 15,
    paddingTop: 5,
    paddingHorizontal: 5,
    marginLeft: 5,
  },
  footerMenuIdelItemText: {
    color: '#000',
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
});
