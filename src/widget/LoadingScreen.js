import React, { Component } from 'react';
import { View, Image, ActivityIndicator} from 'react-native';
import HomeModel from './../model/HomeModel';
import GlobalAppModel from './../model/GlobalAppModel';
import { parseColor } from './../utils/utility';

type Props = {
    LoadingImage?: ?String,
}
  
type State = {}

export default class LoadingScreen extends Component<Props, State> {

  render() {
    console.log(`Loading Screen ${this.props.LoadingImage}`);
      return (
        <View style={{flex: 1, height: '100%', width: '100%', alignContent: 'center', alignItems: 'center', backgroundColor: parseColor(GlobalAppModel.loadingPageColor)}}>
            <Image 
                style={{height: '100%', width: '100%'}}
                source={{
                    uri: this.props.LoadingImage
                }}/>
            <ActivityIndicator style={{position: 'absolute', alignItems: 'center', height: '100%'}} size={30} />
        </View>
      );
  }
}
