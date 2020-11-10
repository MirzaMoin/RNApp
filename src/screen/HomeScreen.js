import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  FlatList,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  BackHandler,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import ImageLoader from './../widget/ImageLoader';
import AnimateNumber from './../widget/AnimateNumber';
import { Header } from 'react-navigation-stack';
import LinearGradient from 'react-native-linear-gradient';
import HomeModel from './../model/HomeModel';
import MenuLinkModel from './../model/MenuLinkModel';
import GlobalAppModel from './../model/GlobalAppModel';
import { parseColor } from './../utils/utility';
import BottomNavigationTab from './../widget/BottomNavigationTab';
import Toast from 'react-native-root-toast';
import Marquee from '../widget/Marquee';

const maxWidth = Dimensions.get('window').width;
var extipAppCount = 0;

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
    extipAppCount = 0;
    this._getStoredData();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    if (extipAppCount == 0) {
      Toast.show('Press Back again to Exit.', {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      extipAppCount = extipAppCount + 1
      setTimeout(
        () => { extipAppCount = 0 },
        Toast.durations.LONG
      )
    } else {
      BackHandler.exitApp();
    }
    return true;
  }

  _getStoredData = async () => {
    try {
      var firstName = '', lastName = '', profile = '';

      await AsyncStorage.getItem('firstName', (err, value) => {
        if (value) {
          firstName = value;
        }
      });

      await AsyncStorage.getItem('lastName', (err, value) => {
        if (value) {
          lastName = value
        }
      });

      await AsyncStorage.getItem('profilePitcure', (err, value) => {
        if (value) {
          profile = value
        } else {
          profile = ''
        }
      });

      this.setState({
        userFullName: `${firstName} ${lastName}`,
        userProfileImage: profile,
      });
    } catch (error) {
      console.log(error)
    }
  };

  // top container for showing point and image with gradient color
  _renderTopContainer = () => {
    console.log(`Global App Data: ${GlobalAppModel.rewardProgramId}`);
    return (
      <ImageBackground
        style={{ flexDirection: 'column', height: (maxWidth / 16) * 9, width: maxWidth }}
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
            value={GlobalAppModel.redeemablePoint || 0}
            formatter={(val) => {
              return <Text
                style={{ fontSize: 26, color: 'white', fontFamily: 'bold', padding: 5 }}
              >{parseFloat(val).toFixed(2)}</Text>
            }} />
          <View style={{ height: 2, backgroundColor: 'white', width: '50%', margin: 5 }} />
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ marginTop: 10 }}
            onPress={() => {
              if (HomeModel.homePageTopButtonLinkType == 'external') {
                try {
                  this.props.navigation.push('webScreen', {
                    title: HomeModel.homePageTopButtonText,
                    webURL: HomeModel.homePageTopButtonLink,
                  });
                } catch (Exeption) { console.log(`Èrror : ${Exeption}`) }
              } else {
                this.props.navigation.push(HomeModel.homePageTopButtonLink);
              }
            }}>
            <LinearGradient
              colors={[parseColor(HomeModel.homePageTopButtonGradientStartColor), parseColor(HomeModel.homePageTopButtonGradientStopColor)]}
              style={{ padding: 10, paddingHorizontal: 25, borderRadius: 5, alignContent: 'center' }}>
              <Text style={{ color: parseColor(HomeModel.homePageTopButtonTextColor), fontSize: 16 }}>{HomeModel.homePageTopButtonText}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>
    );
  }

  onPageLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    // manage bottom container menu item height 
    console.log(`Height ${height} : Width ${width}`)
    if (!(this.state.bottomContainerMenuItemHeight) && HomeModel.menuLinks.length > 0) {
      var bottomMenuItemHeight = 75;
      const tmpMenuItemHeight = height / HomeModel.menuLinks.length;
      if (tmpMenuItemHeight > 75) {
        bottomMenuItemHeight = tmpMenuItemHeight;
      }
      this.setState({
        bottomContainerMenuItemHeight: bottomMenuItemHeight,
      });
    }
  };

  // bottom container for showing dynamic internal and external links
  _renderBottomContainer = () => {
    return (
      <ImageBackground
        ref={(ref) => (this.viewParent = ref)}
        onLayout={this.onPageLayout}
        style={{ flexDirection: 'column', flex: 1, width: maxWidth }}
        opacity={1}
        source={{
          uri: HomeModel.homePageBottomBackgroundImage,
        }}
        resizeMode="cover">
        <View>
          <LinearGradient
            opacity={HomeModel.homePageBottomBackgroundOpacity}
            colors={[parseColor(HomeModel.homePageBottomBackgroundGradientStartColor), parseColor(HomeModel.homePageBottomBackgroundGradientStopColor)]}
            style={{ flexDirection: 'column', height: '100%', width: '100%', position: 'absolute' }} />
          <FlatList
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            data={HomeModel.menuLinks}
            renderItem={({ item, index }) => {
              const menuLink = new MenuLinkModel(item);
              if (this.state.bottomContainerMenuItemHeight) {
                //console.log(`Text Align : ${index} : ${JSON.stringify(menuLink)}`);
                return (
                  <ImageBackground
                    style={{ flexDirection: 'column', flex: 1, width: maxWidth }}
                    opacity={1}
                    source={{
                      uri: menuLink.menuBackgroudImage,
                    }}
                    resizeMode="cover">
                    <View>
                      <LinearGradient
                        colors={[parseColor(menuLink.menuTopColor), parseColor(menuLink.menuBottomColor)]}
                        opacity={menuLink.menuOpacity}
                        style={{ height: this.state.bottomContainerMenuItemHeight, width: '100%', position: 'absolute' }} />
                      <View>
                        <View style={{ height: 1, backgroundColor: 'rgba(153,153,153,1)' }} />
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            if (menuLink.menuLinkType == 'external') {
                              try {
                                this.props.navigation.navigate('webScreen', {
                                  title: menuLink.menuText,
                                  webURL: menuLink.menuExternalLinkUrl,
                                });
                              } catch (Exeption) { console.log(`Èrror : ${Exeption}`) }
                            } else {
                              this.props.navigation.push(menuLink.menuInternalLinkUrl);
                            }
                          }}
                          style={{ padding: 10, flexDirection: 'row', height: this.state.bottomContainerMenuItemHeight || 75 }}>
                          {HomeModel.homePageBottomDisplayIcon && <Icon name={menuLink.icon} style={{ fontSize: 30, color: parseColor(HomeModel.homePageBottomIconColor), backgroundColor: HomeModel.homePageBottomIconShape == 'none' ? '' : parseColor(HomeModel.homePageBottomIconBackgroundColor), padding: 10, borderRadius: HomeModel.homePageBottomIconShape == 'round' ? 50 : 5, marginHorizontal: 10, width: 55, height: 55, textAlign: 'center', alignSelf: 'center' }} />}
                          <Text style={{ flex: 1, paddingHorizontal: 10, fontSize: 18, alignSelf: 'center', color: parseColor(MenuLinkModel.menuTextColor), textAlign: HomeModel.homePageBottomTextAlign.toLowerCase() }}>{menuLink.menuText || ''}</Text>
                          {HomeModel.homePageBottomDisplayArrowIcon && <MDIcon name={'keyboard-arrow-right'} style={{ alignSelf: 'center', fontSize: 30, color: parseColor(HomeModel.homePageBottomArrowColor) }} />}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ImageBackground>
                );
              }
            }}
          />
        </View>
      </ImageBackground>
    );
  }

  // rendering hribbon text as simple text or marquee
  _renderHomePageRibbonText = () => {
    if (HomeModel.homePageRibbonTextMarquee) {
      return (
        <Marquee
          loop={-1}
          style={{ flex: 1, flexDirection: 'row', marginHorizontal: 10, alignItems: 'center' }}>
          <Text style={{ fontSize: 15, color: parseColor(HomeModel.homePageRibbonTextColor), flex: 1, alignSelf: 'center' }}>{HomeModel.homePageRibbonText}</Text>
        </Marquee>
      )
    } else {
      return (<Text numberOfLines={1} ellipsizeMode={'clip'} style={{ fontSize: 15, color: parseColor(HomeModel.homePageRibbonTextColor), paddingHorizontal: 10, flex: 1, alignSelf: 'center' }}>{HomeModel.homePageRibbonText}</Text>);
    }
  }

  // rendering ribbon icon based on possition and visibility
  _renderRibbonIcon = position => {
    if (HomeModel.homePageRibbonDisplayIcon && HomeModel.homePageRibbonIconPosition == position) {
      return <Icon name={HomeModel.homePageRibbonIcon} style={{ color: '#0282C6', fontSize: 20, marginLeft: 5 }} />
    }
  }

  // rebbon for showing internal or external link at top/bottom of top container
  _renderRebbon = isShow => {
    if (HomeModel.homePageDisplayRibbon && isShow) {
      console.log(`Ribbon Icon ${HomeModel.homePageRibbonDisplayIcon} : ${HomeModel.homePageRibbonIcon} : ${HomeModel.homePageRibbonIconPosition}`)
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (HomeModel.homePageRibbonLinkType == 'external') {
              try {
                this.props.navigation.push('webScreen', {
                  title: HomeModel.homePageRibbonText,
                  webURL: HomeModel.homePageRibbonLink,
                });
              } catch (Exeption) { console.log(`Èrror : ${Exeption}`) }
            } else {
              this.props.navigation.push(HomeModel.homePageRibbonLink);
            }
          }}>
          <View style={{ width: '100%', padding: 5, backgroundColor: parseColor(HomeModel.homePageRibbonBackgroundColor), flexDirection: 'row', minHeight: 28 }}>
            {this._renderRibbonIcon('Left')}
            {this._renderHomePageRibbonText()}
            {this._renderRibbonIcon('Right')}
          </View>
        </TouchableOpacity>
      );
    }
  }

  // screen toolbar
  _renderToolBar = () => {
    return (
      <View style={[styles.headerContainer, { backgroundColor: parseColor(GlobalAppModel.primaryColor) }]}>
        <TouchableOpacity onPress={() => {
          this.props.navigation.openDrawer();
        }}>
          <MDIcon name={'menu'} style={styles.leftIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Home</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            this.props.navigation.push('profileScreen')
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
        <StatusBar barStyle={'dark-content'} backgroundColor={'#081b2e'} translucent/>
        <SafeAreaView style={styles.mainContainer}>
          {this._renderToolBar()}
          <View style={{ flex: 1 }}>
            {this._renderRebbon(HomeModel.homePageRibbonPosition == 'Top')}
            {this._renderTopContainer()}
            {this._renderRebbon(HomeModel.homePageRibbonPosition == 'Middle')}
            {this._renderBottomContainer()}
          </View>
          <BottomNavigationTab
           navigation={this.props.navigation} />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
