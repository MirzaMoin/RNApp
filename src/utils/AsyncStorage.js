import {AsyncStorage} from 'react-native';

_getData = async (key) => {
    try {
      await AsyncStorage.getItem(key, (err, value) => {
        if (err) {
            console.log('err');
          return undefined;
        } else {
          const val = JSON.parse(value);
          if (val != null && val != undefined && val) {
              return value;
            //this.props.navigation.navigate('Main');
          } else {
              return undefined;
            //this.props.navigation.navigate('Auth');
          }
        }
      });
    } catch (error) {
      this.props.navigation.navigate('Auth');
    }
  };


export async function GetLogin () {
    await _getData(keys.BASE_URL);
}