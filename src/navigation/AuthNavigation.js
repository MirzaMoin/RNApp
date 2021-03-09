//AuthNavigation.js
import {createStackNavigator} from 'react-navigation-stack';
import LoginScreen from '../screen/LoginScreen';

const AuthNavigation = createStackNavigator(
  {
    Login: {screen: LoginScreen},
  },
  {
    initialRouteName: 'Login',
  },
);

export default AuthNavigation;
