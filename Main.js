import React, {Component} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  SafeAreaView,
  AsyncStorage,
  ScrollView,
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
import OfferScreen from './src/screen/OfferScreen';
import ContactUs from './src/screen/ContactUs';
import LocationScreen from './src/screen/LocationScreen';
import TakeSurveyScreen from './src/screen/TakeSurveyScreen';
import SurveyFormScreen from './src/screen/SurveyFormScreen';
import ProfileScreen from './src/screen/ProfileScreen';
import {WayToEarnScreen} from './src/screen/WaysToEarnScreen';
import * as RNEP from '@estimote/react-native-proximity';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import {
  startProximityObserver,
  stopProximityObserver,
} from './src/beacons/proximityObserver';

import Screen1 from './pages/Screen1';
import Screen2 from './pages/Screen2';
import Screen3 from './pages/Screen3';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

RNEP.locationPermission.request().then(permission => {
  if (permission != RNEP.locationPermission.DENIED) {
    startProximityObserver();
  } else {
    stopProximityObserver();
    console.log('====================================');
    console.log('estimote location permission : ' + permission);
    console.log('====================================');
  }
});

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
            console.log('right Navigation : ' + this.props);
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
            console.log('right Navigation : ' + this.props);
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
      await AsyncStorage.getItem('profilePitcure', (err, value) => {
        if (err) {
          this.props.navigation.navigate('Auth');
        } else {
          //const val = JSON.parse(value);
          if (value) {
            profile = value;
          }
        }
      });

      await AsyncStorage.getItem('firstName', (err, value) => {
        if (err) {
          this.props.navigation.navigate('Auth');
        } else {
          if (value) {
            fName = value;
          }
        }
      });

      await AsyncStorage.getItem('lastName', (err, value) => {
        if (err) {
          this.props.navigation.navigate('Auth');
        } else {
          if (value) {
            lName = value;
          }
        }
      });

      await AsyncStorage.getItem('emailAddress', (err, value) => {
        if (err) {
          this.props.navigation.navigate('Auth');
        } else {
          if (value) {
            email = value;
          }
        }
      });

      this.setState({
        name: `${fName} ${lName}`,
        email: email,
        userImage: profile,
      })

      console.log(`draweer ${fName} ${lName} ${èmail} ${profile}`)

    } catch (error) {
      // Error saving data
    }
  };

  componentWillMount(){
    this._getStoredData();
  }

  componentDidMount() {
    //Here is the Trick
    const { navigation } = this.props;
    //Adding an event listner om focus
    //So whenever the screen will have focus it will set the state to zero
    this.focusListener = navigation.addListener('didFocus', () => {
        //this.setState({ count: 0 });
        console.log('úpdateeeee')
    });
  }

  componentWillUnmount() {
    // Remove the event listener before removing the screen from the stack
    this.focusListener.remove();
  };

  render() {
    return (
      <View style={{flexDirection: 'column'}}>
        <Image
        style={{height: 150}}
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
          fontSize: 10,
        }}>
        {this.state.name}
      </Text>
      <Text
        style={{
          paddingLeft: 15,
          textAlign: 'center',
          paddingRight: 15,
          paddingTop: 5,
          fontSize: 10,
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
      <DrawerHeaderComponent navigation={props.navigation} />
      <ScrollView style={{flex: 1}}>
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
            console.log('right Navigation : ' + props);
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

const Screen3_StackNavigator = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  Third: {
    screen: Screen3,
    navigationOptions: ({navigation}) => ({
      title: 'Settings',
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

const FirstActivity_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  First: {
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
    HomeScreen: {
      //Title
      screen: Home_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Home',
        drawerIcon: ({tintColor}) => (
          <MDIcon style={{fontSize: 18}} name={'home'} />
        ),
      },
    },
    //Drawer Optons and indexing
    Screen1: {
      //Title
      screen: FirstActivity_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Profile',
        drawerIcon: ({tintColor}) => (
          <MDIcon style={{fontSize: 18}} name={'local-offer'} />
        ),
      },
    },
    notificaiton: {
      //Title
      screen: Notificaiton_Navigator,
      navigationOptions: {
        drawerLabel: 'Notification',
        drawerIcon: ({tintColor}) => (
          <MDIcon style={{fontSize: 18}} name={'local-offer'} />
        ),
      },
    },
    Screen2: {
      //Title
      screen: Screen2_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Transaction',
        drawerIcon: ({tintColor}) => (
          <MDIcon style={{fontSize: 18}} name={'lock'} />
        ),
      },
    },
    Screen3: {
      //Title
      screen: Screen3_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Setting',
        drawerIcon: ({tintColor}) => (
          <MDIcon style={{fontSize: 18}} name={'settings'} />
        ),
      },
    },
    Transaction: {
      screen: Transaction_Navigator,
      navigationOptions: {
        drawerLabel: 'Transaction History',
        drawerIcon: ({tintColor}) => (
          <MDIcon style={{fontSize: 18}} name={'history'} />
        ),
      },
    },
    Offer: {
      screen: Offer_Navigator,
      navigationOptions: {
        drawerLabel: 'Offers',
        drawerIcon: ({tintColor}) => (
          <MDIcon style={{fontSize: 18}} name={'history'} />
        ),
      },
    },
    Transfer: {
      screen: TransferPoint_Navigator,
      navigationOptions: {
        drawerLabel: 'Point Transfer',
        drawerIcon: ({tintColor}) => (
          <MDIcon style={{fontSize: 18}} name={'history'} />
        ),
      },
    },
    Refere: {
      screen: RefereFriend_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Refere Friend',
        drawerIcon: () => <MDIcon style={{fontSize: 18}} name={'share'} />,
      },
    },
    ContactUs: {
      screen: ContactUs_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Contact Us',
        drawerIcon: () => <MDIcon style={{fontSize: 18}} name={'share'} />,
      },
    },
    Location: {
      screen: Location_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Location',
        drawerIcon: () => (
          <MDIcon style={{fontSize: 18}} name={'location-on'} />
        ),
      },
    },
    SocialShare: {
      screen: SocialShare_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Social Share',
        drawerIcon: () => <MDIcon style={{fontSize: 18}} name={'share'} />,
      },
    },
    TakeSurvey: {
      screen: TakeSurveyScreen_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Take Survey',
        drawerIcon: () => <MDIcon style={{fontSize: 18}} name={'edit'} />,
      },
    },
  },
  {
    contentComponent: CreateDrawerComponent,
    drawerType: 'push-screen',
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
