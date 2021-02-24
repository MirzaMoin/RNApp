import React, {Component} from 'react';
import {View, Image, TouchableOpacity, Text, SafeAreaView} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import HomeScreen from '../screen/HomeScreen';
import TabScreen from '../screen/TabScreen';
import NotificationScreen from '../screen/NotificationScreen';
import ProfileScreen from '../screen/ProfileScreen';
import {WayToEarnScreen} from '../screen/WaysToEarnScreen';
import LoginScreen from '../screen/LoginScreen';

import Screen1 from '../../pages/Screen1';
import Screen2 from '../../pages/Screen2';
import Screen3 from '../../pages/Screen3';

// const AppNavigation = createStackNavigator(
//   {
//     Home: {screen: HomeScreen},
//   },
//   {
//     initialRouteName: 'Home',
//   },
// );

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
          <MDIcon style={{fontSize: 25, marginLeft: 15}} name={'menu'} />
        </TouchableOpacity>
      </View>
    );
  }
}

class NavigationComponentRight extends Component {
  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigationProps.navigation.navigate('Screen1');
          }}>
          <MDIcon
            style={{fontSize: 25, marginRight: 10, color: 'black'}}
            name={'notifications-none'}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const CreateDrawerComponent = props => (
  <SafeAreaView style={{flex: 1}}>
    <View style={{flex: 1}}>
      <Image
        style={{height: 150}}
        source={{
          uri:
            'https://www.atlassian.design/server/images/avatars/avatar-96.png',
        }}
      />
      <Text
        style={{
          paddingLeft: 15,
          textAlign: 'center',
          paddingRight: 15,
          paddingTop: 5,
          fontSize: 12,
        }}>
        Hi Hardik! scoll arround your reward profile & look for near ways to
        earn and redeem rewards. More custom text, more custom ...
      </Text>
      <DrawerItems {...props} />
    </View>
  </SafeAreaView>
);

const FirstActivity_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  First: {
    screen: TabScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Ways to Earn',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: <NavigationComponentRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#f6f6f6',
      },
    }),
  },
});

const Screen2_StackNavigator = createStackNavigator({
  //All the screen from the Screen2 will be indexed here
  Second: {
    screen: Screen2,
    navigationOptions: ({navigation}) => ({
      title: 'Transaction',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: <NavigationComponentRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#f6f6f6',
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
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: <NavigationComponentRight navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#f6f6f6',
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
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerRight: (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('notificaiton');
            }}>
            <MDIcon
              style={{fontSize: 25, marginRight: 10, color: 'black'}}
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
        backgroundColor: '#f6f6f6',
      },
    }),
  },
});

const Login_StackNavigator = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  Third: {
    screen: LoginScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Home',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#f6f6f6',
      },
    }),
  },
});

const Notificaiton_Navigator = createStackNavigator({
  //All the screen from the Screen3 will be indexed here
  notificaiton: {
    screen: NotificationScreen,
    navigationOptions: ({navigation}) => ({
      title: 'Notification',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: '#f6f6f6',
      },
    }),
  },
});

const AppNavigation = createDrawerNavigator(
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
        drawerLabel: 'Ways to Earn',
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
    LoginScreen: {
      //Title
      screen: Login_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Login',
        drawerIcon: ({tintColor}) => (
          <MDIcon style={{fontSize: 18}} name={'lock-open'} />
        ),
      },
    },
  },
  {
    contentComponent: CreateDrawerComponent,
    drawerType: 'push-screen',
  },
);

export default AppNavigation;
