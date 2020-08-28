import React, {Component} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  SafeAreaView,
  AsyncStorage,
  ScrollView,
  Dimensions,
} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import {AppNavigation} from './src/navigation/AppNavigation';
import LoginScreen from './src/screen/LoginScreen';
import SplashScreen from './src/screen/SplashScreen';
import HomeScreen from './src/screen/HomeScreen';
import SocialShareScreen from './src/screen/SocialShareScreen';
import TabScreen from './src/screen/TabScreen';
import NotificationScreen from './src/screen/NotificationScreen';
import NotificationDetailScreen from './src/screen/NotificationDetailScreen';
import TransactionHistory from './src/screen/TransactionHistory';
import TransferPointScreen from './src/screen/TransferPointScreen';
import RefereFriendScreen from './src/screen/RefereFriendScreen';
import RedeemCashbackScreen from './src/screen/RedeemCashbackScreen';
import LeaderboardScreen from './src/screen/LeaderBoradScreen';
import OfferScreen from './src/screen/OfferScreen';
import ContactUs from './src/screen/ContactUs';
import LocationScreen from './src/screen/LocationScreen';
import TakeSurveyScreen from './src/screen/TakeSurveyScreen';
import SurveyFormScreen from './src/screen/SurveyFormScreen';
import ProfileScreen from './src/screen/ProfileScreen';
import ChangePasswordScreen from './src/screen/ChangePasswordScreen';
import UploadReceiptScreen from './src/screen/UploadRecieptScreen';
import RPGScreen from './src/screen/RPGScreen';
import {WayToEarnScreen} from './src/screen/WaysToEarnScreen';
import * as RNEP from '@estimote/react-native-proximity';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {
  startProximityObserver,
  stopProximityObserver,
} from './src/beacons/proximityObserver';

import Screen1 from './pages/Screen1';
import Screen2 from './pages/Screen2';

import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';

/*RNEP.locationPermission.request().then(permission => {
  if (permission != RNEP.locationPermission.DENIED) {
    startProximityObserver();
  } else {
    stopProximityObserver();
    console.log('====================================');
    console.log('estimote location permission : ' + permission);
    console.log('====================================');
  }
});*/

const _storeLououtData = async () => {
  try {
    await AsyncStorage.setItem('isLogin', JSON.stringify(false));
  } catch (error) {
    // Error saving data
  }
};

class NavigationDrawerStructure extends Component {
  //Structure for the navigatin Drawer
  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          <MDIcon
            style={{fontSize: 25, color: 'white', marginLeft: 15}}
            name={'menu'}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

// Logout data here new change
class LogoutItem extends Component {
  render(){
    return (
      <TouchableNativeFeedback
          activeOpacity={1}
          onPress={async ()=>{
            //_storeLououtData();
            try {
              await AsyncStorage.setItem('isLogin', JSON.stringify(false));
            } catch (error) {
              // Error saving data
            }
            this.props.navigationProps.navigate('Auth');
          }}>
          <View style={{padding: 10, flexDirection: 'row', alignContent: 'center', paddingBottom: 20}}>
            <MDIcon name={'exit-to-app'} style={{fontSize: 20, marginLeft: 10}}/>
            <View style={{width: '12%'}} />
            <Text style={{fontWeight: 'bold'}}>Logout</Text>
          </View>
        </TouchableNativeFeedback>
    )
  }
}

class NavigationComponentRight extends Component {
  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            // this.props.navigationProps.navigation.navigate('Screen1');
            debugger;
            _storeLououtData();
            this.props.navigationProps.navigate('Auth');
          }}>
          <MDIcon
            style={{fontSize: 25, marginRight: 10, color: 'white'}}
            name={'notifications-none'}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

class DrawerHeaderComponent extends Component {

  constructor(){
    super();
    this.state={}
  }

  _getStoredData = async () => {
    try {
      var fName, lName, profile, email;
      var isUpdateState = false;
      await AsyncStorage.getItem('profilePitcure', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          //const val = JSON.parse(value);
          if (value) {
            profile = value;
            if(value === this.state.userImage){
              isUpdateState = false;
            } else {
              isUpdateState = true;
            }
          }
        }
      });

      await AsyncStorage.getItem('firstName', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          if (value) {
            fName = value;
          }
        }
      });

      await AsyncStorage.getItem('lastName', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          if (value) {
            lName = value;
          }
        }
      });

      await AsyncStorage.getItem('emailAddress', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          if (value) {
            email = value;
          }
        }
      });

      if(
        this.state.email === email &&
        this.state.name === `${fName} ${lName}` &&
        this.state.userImage === profile
      ) {
        //console.log('Same Data')
      } else {
        this.setState({
          name: `${fName} ${lName}`,
          email: email,
          userImage: profile,
        });
      }

      /*this.setState({
        name: `${fName} ${lName}`,
        email: email,
        userImage: profile,
      })*/

    } catch (error) {
      // Error saving data
      console.log(`Drawer HeaderComponent: ${error}`)
    }
  };

  onPageLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    //console.log(`ON LAYOUT ${width} ${height}`);
    //this.setState({width, height})
    if(!(this.state.width)){
      this.setState({
        width: width,
      });
    }
  };

  render() {
    this._getStoredData();
    return (
      <View style={{flexDirection: 'column'}} ref={(ref) => (this.viewParent = ref)} onLayout={this.onPageLayout}>
        <Image
          style={{width: this.state.width || '100%', height: this.state.width || 200}}
          source={{
            uri:
              this.state.userImage || '',
          }}
      />
      <Text
        style={{
          paddingLeft: 15,
          textAlign: 'center',
          paddingRight: 15,
          paddingTop: 5,
          fontSize: 16,
        }}>
        {this.state.name}
      </Text>
      <Text
        style={{
          paddingLeft: 15,
          textAlign: 'center',
          paddingRight: 15,
          paddingTop: 5,
          fontSize: 14,
          paddingBottom: 5,
        }}>
        {this.state.email}
      </Text>
      </View>
    );
  }
}

const CreateDrawerComponent = props => (
  <SafeAreaView style={{flex: 1}}>
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        <DrawerHeaderComponent navigation={props.navigation} />
        <DrawerItems {...props} />
        {/*<LogoutItem navigationProps={props}/>*/}
        <TouchableNativeFeedback
          activeOpacity={1}
          onPress={async ()=>{
            //_storeLououtData();
            try {
              await AsyncStorage.setItem('isLogin', JSON.stringify(false));
            } catch (error) {
              // Error saving data
            }
            props.navigation.navigate('Auth');
          }}>
          <View style={{padding: 10, flexDirection: 'row', alignContent: 'center', paddingBottom: 20}}>
            <MDIcon name={'exit-to-app'} style={{fontSize: 20, marginLeft: 10}}/>
            <View style={{width: '12%'}} />
            <Text style={{fontWeight: 'bold'}}>Logout</Text>
          </View>
        </TouchableNativeFeedback>
      </ScrollView>
    </View>
  </SafeAreaView>
);

const Screen2_StackNavigator = createStackNavigator({
  //All the screen from the Screen2 will be indexed here
  Second: {
    screen: Screen2,
    navigationOptions: ({navigation}) => ({
      title: 'Transaction',
      headerTitleStyle: {
        color: 'white',
        marginLeft: -7,
      },
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: <NavigationComponentRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#012340',
      },
    }),
  },
});

const ChangePasswordStackNavigator = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  changePassword: {
    screen: ChangePasswordScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Change Password',
      headerTitleStyle: {
        color: 'white',
        marginLeft: -7,
      },
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: <NavigationComponentRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#012340',
      },
    }),
  },
});

const UploadReceiptStackNavigator = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  uploadReceipt: {
    screen: UploadReceiptScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Upload Receipt',
      headerTitleStyle: {
        color: 'white',
        marginLeft: -7,
      },
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: <NavigationComponentRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#012340',
      },
    }),
  },
});

const RedeemCashbackScreenStackNavigator = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  redeemCashback: {
    screen: RedeemCashbackScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Redeem Cashback',
      headerTitleStyle: {
        color: 'white',
        marginLeft: -7,
      },
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: <NavigationComponentRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#012340',
      },
    }),
  },
});

const LeaderboardScreenStackNavigator = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  redeemCashback: {
    screen: LeaderboardScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Redeem Cashback',
      headerTitleStyle: {
        color: 'white',
        marginLeft: -7,
      },
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: <NavigationComponentRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#012340',
      },
    }),
  },
});

const RPGScreenStackNavigation = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  rpgScreen: {
    screen: RPGScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Rewar Program Goal',
      headerTitleStyle: {
        color: 'white',
        marginLeft: -7,
      },
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: <NavigationComponentRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#012340',
      },
    }),
  },
});

const Home_StackNavigator = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  Third: {
    screen: HomeScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Home',
      headerTitleStyle: {
        color: 'white',
        marginLeft: -7,
      },
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('notificaiton');
            }}>
            <MDIcon
              style={{fontSize: 25, marginRight: 10, color: 'white'}}
              name={'notifications-none'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Screen1');
            }}>
            <Image
              source={{
                uri:
                  'https://www.atlassian.design/server/images/avatars/avatar-96.png',
              }}
              style={{width: 25, height: 25, marginRight: 10}}
            />
          </TouchableOpacity>
        </View>
      ),
      headerStyle: {
        backgroundColor: '#012340',
      },
    }),
  },
});

const Notificaiton_Navigator = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  notificaiton: {
    screen: NotificationScreen,
    navigationOptions: ({navigation}) => ({
      drawerLockMode: 'locked-closed',
      title: 'Notification',
      headerTitleStyle: {
        color: 'white',
        marginLeft: -7,
      },
      headerLeft: (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MDIcon
              style={{fontSize: 25, color: 'white', marginLeft: 15}}
              name={'arrow-back'}
            />
          </TouchableOpacity>
        </View>
      ),
      headerStyle: {
        backgroundColor: '#012340',
      },
    }),
  },
  notificaitonDetail: {
    screen: NotificationDetailScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Notification Detail',
      headerTitleStyle: {
        color: 'white',
        marginLeft: -7,
      },
      headerLeft: (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MDIcon
              style={{fontSize: 25, color: 'white', marginLeft: 15}}
              name={'arrow-back'}
            />
          </TouchableOpacity>
        </View>
      ),
      headerStyle: {
        backgroundColor: '#012340',
      },
    }),
  },
});

const Transaction_Navigator = createStackNavigator({
  transaction: {
    screen: TransactionHistory,
    navigationOptions: ({navigation}) => ({
      title: 'Transaction',
      headerTitleStyle: {
        color: 'white',
        marginLeft: -7,
      },
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: (
        <View>
          <Text
            style={{
              fontSize: 20,
              marginRight: 15,
              fontWeight: 'bold',
              color: 'white',
            }}>
            50 PTS
          </Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: '#012340',
      },
    }),
  },
});

const Offer_Navigator = createStackNavigator({
  transaction: {
    screen: OfferScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Offers',
      headerTitleStyle: {
        color: 'white',
        marginLeft: -7,
      },
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: (
        <View>
          <Text
            style={{
              fontSize: 20,
              marginRight: 15,
              fontWeight: 'bold',
              color: 'white',
            }}>
            50 PTS
          </Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: '#012340',
      },
    }),
  },
});

const TransferPoint_Navigator = createStackNavigator({
  transaction: {
    screen: TransferPointScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Transfer Point',
      headerTitleStyle: {
        color: 'white',
        marginLeft: -7,
      },
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: (
        <View>
          <Text
            style={{
              fontSize: 20,
              marginRight: 15,
              fontWeight: 'bold',
              color: 'white',
            }}>
            50 PTS
          </Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: '#012340',
      },
    }),
  },
});

const RefereFriend_StackNavigator = createStackNavigator({
  //All the screen from the Screen2 will be indexed here
  Second: {
    screen: RefereFriendScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Refere Friend',
      headerTitleStyle: {
        color: 'white',
        marginLeft: -7,
      },
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: <NavigationComponentRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#012340',
      },
    }),
  },
});

const ContactUs_StackNavigator = createStackNavigator({
  //All the screen from the Screen2 will be indexed here
  Second: {
    screen: ContactUs,
    navigationOptions: ({navigation}) => ({
      title: 'Contact Us',
      headerTitleStyle: {
        color: 'white',
        marginLeft: -7,
      },
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: <NavigationComponentRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#012340',
      },
    }),
  },
});

const Location_StackNavigator = createStackNavigator({
  //All the screen from the Screen2 will be indexed here
  Second: {
    screen: LocationScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Loation',
      headerTitleStyle: {
        color: 'white',
        marginLeft: -7,
      },
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: <NavigationComponentRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#012340',
      },
    }),
  },
});

const SocialShare_StackNavigator = createStackNavigator({
  //All the screen from the Screen2 will be indexed here
  Second: {
    screen: SocialShareScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Social Share',
      headerTitleStyle: {
        color: 'white',
        marginLeft: -7,
      },
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: <NavigationComponentRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#012340',
      },
    }),
  },
});

const TakeSurveyScreen_StackNavigator = createStackNavigator({
  //All the screen from the Screen2 will be indexed here
  Second: {
    screen: TakeSurveyScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Take Survey',
      headerTitleStyle: {
        color: 'white',
        marginLeft: -7,
      },
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: <NavigationComponentRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#012340',
      },
    }),
  },
  SurveyForm: {
    screen: SurveyFormScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Survey Form',
      headerTitleStyle: {
        color: 'white',
        marginLeft: -7,
      },
      headerLeft: (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MDIcon
              style={{fontSize: 25, color: 'white', marginLeft: 15}}
              name={'arrow-back'}
            />
          </TouchableOpacity>
        </View>
      ),
      headerStyle: {
        backgroundColor: '#012340',
      },
    }),
  },
});

const ProfileTabScreenStackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  profileTabScreen: {
    screen: TabScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Ways to Earn',
      headerTitleStyle: {
        color: 'white',
        marginLeft: -7,
      },
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: (
        <View>
          <Text
            style={{
              fontSize: 20,
              marginRight: 15,
              fontWeight: 'bold',
              color: 'white',
            }}>
            50 PTS
          </Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: '#012340',
      },
    }),
  },
});

const DrawerNavigatorExample = createDrawerNavigator(
  {
    homeScreen: {
      screen: Home_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Home',
        drawerIcon: ({tintColor}) => (
          <MDIcon style={{fontSize: 18}} name={'home'} />
        ),
      },
    },
    profileTab: {
      screen: ProfileTabScreenStackNavigator,
      navigationOptions: {
        drawerLabel: 'Profile',
        drawerIcon: ({tintColor}) => (
          <MDIcon style={{fontSize: 18}} name={'person'} />
        ),
      },
    },
    rpg: {
      screen: RPGScreenStackNavigation,
      navigationOptions: {
        drawerLabel: 'Reward Entry Goal',
        drawerIcon: ({tintColor}) => (
          <MDIcon style={{fontSize: 18}} name={'star'} />
        ),
      },
    },
    redeemCashback: {
      screen: RedeemCashbackScreenStackNavigator,
      navigationOptions: {
        drawerLabel: 'Redeem Cashback',
        drawerIcon: ({tintColor}) => (
          <MDIcon style={{fontSize: 18}} name={'redeem'} />
        ),
      },
    },
    leaderboard: {
      screen: LeaderboardScreenStackNavigator,
      navigationOptions: {
        drawerLabel: 'Leaderboard',
        drawerIcon: ({tintColor}) => (
          <Icon style={{fontSize: 18}} name={'trophy'} />
        ),
      },
    },
    notificaiton: {
      //Title
      screen: Notificaiton_Navigator,
      navigationOptions: {
        drawerLabel: 'Notification',
        drawerIcon: ({tintColor}) => (
          <MDIcon style={{fontSize: 18}} name={'notifications'} />
        ),
      },
    },
    transactionHistory: {
      screen: Transaction_Navigator,
      navigationOptions: {
        drawerLabel: 'Transaction History',
        drawerIcon: ({tintColor}) => (
          <MDIcon style={{fontSize: 18}} name={'history'} />
        ),
      },
    },
    offer: {
      screen: Offer_Navigator,
      navigationOptions: {
        drawerLabel: 'Offers',
        drawerIcon: ({tintColor}) => (
          <MDIcon style={{fontSize: 18}} name={'local-offer'} />
        ),
      },
    },
    transferPoint: {
      screen: TransferPoint_Navigator,
      navigationOptions: {
        drawerLabel: 'Transfer Point',
        drawerIcon: ({tintColor}) => (
          <MDIcon style={{fontSize: 18}} name={'swap-horiz'} />
        ),
      },
    },
    uploadReceipt: {
      //Title
      screen: UploadReceiptStackNavigator,
      navigationOptions: {
        drawerLabel: 'Upload Receipt',
        drawerIcon: ({tintColor}) => (
          <Icon style={{fontSize: 18}} name={'upload'} />
        ),
      },
    },
    refereFriend: {
      screen: RefereFriend_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Refere Friend',
        drawerIcon: () => <MDIcon style={{fontSize: 18}} name={'group-add'} />,
      },
    },
    contactUs: {
      screen: ContactUs_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Contact Us',
        drawerIcon: () => <MDIcon style={{fontSize: 18}} name={'phone'} />,
      },
    },
    locations: {
      screen: Location_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Location',
        drawerIcon: () => (
          <MDIcon style={{fontSize: 18}} name={'location-on'} />
        ),
      },
    },
    socialShare: {
      screen: SocialShare_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Social Share',
        drawerIcon: () => <MDIcon style={{fontSize: 18}} name={'share'} />,
      },
    },
    takeSurvey: {
      screen: TakeSurveyScreen_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Take Survey',
        drawerIcon: () => <MDIcon style={{fontSize: 18}} name={'edit'} />,
      },
    },
    changePassword: {
      //Title
      screen: ChangePasswordStackNavigator,
      navigationOptions: {
        drawerLabel: 'Change Password',
        drawerIcon: ({tintColor}) => (
          <MDIcon style={{fontSize: 18}} name={'lock'} />
        ),
      },
    },
  },
  {
    contentComponent: CreateDrawerComponent,
    drawerType: 'push-screen',
    edgeWidth: 3,
  },
);

const Drawer_StackNavigator = createStackNavigator({
  Main: {
    screen: DrawerNavigatorExample,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
});

const Login_StackNavigator = createStackNavigator({
  //All the screen from the Screen2 will be indexed here
  Login: {
    screen: LoginScreen,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
});

// need to create another screen for AuthLoading (Splash) to check user login or not on based of that nex root will decide.
const switchNavigation = createSwitchNavigator(
  {
    AuthLoading: SplashScreen,
    App: Drawer_StackNavigator,
    Auth: Login_StackNavigator,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

export default createAppContainer(switchNavigation);
