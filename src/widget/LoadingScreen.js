import React, { Component } from 'react';
import { View, Image, ActivityIndicator} from 'react-native';
import HomeModel from './../model/HomeModel';
import GlobalAppModel from './../model/GlobalAppModel';
import { parseColor } from './../utils/utility';
import LoginScreenModel from '../model/LoginScreenModel';
var Spinner = require('react-native-spinkit');
type Props = {
    LoadingImage?: ?String,
    Icon?: ?String,
}
  
type State = {}

export default class LoadingScreen extends Component<Props, State> {

  render() {
    // console.log(`Loading Screen ${this.props.LoadingImage}`);
      return (
        <View style={{flex: 1, height: '100%', width: '100%', alignContent: 'center', alignItems: 'center', backgroundColor: parseColor(GlobalAppModel.loadingPageColor)}}>
            <Image 
                style={{height: '100%', width: '100%'}}
                source={{
                    uri: this.props.LoadingImage
                }}/>
            {/* <ActivityIndicator style={{position: 'absolute', alignItems: 'center', height: '100%'}} color={GlobalAppModel.tertiaryColor || 'white'} size={50} /> */}
          <Spinner style={{ position: 'absolute', alignItems: 'center', height: '100%', width: '100%', marginBottom: 50 }} isVisible={true} size={30} type={'Bounce'} color={'white'} />
          <Image source={{ uri: this.props.Icon || GlobalAppModel.appIcon }} style={{ position: 'absolute', alignItems: 'center', height: '100%', width: '60%' }} resizeMode={'contain'} />
        </View>
      );
  }
}
