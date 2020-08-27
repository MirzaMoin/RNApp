import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import { Header } from 'react-navigation-stack';
import { Avatar, Accessory } from 'react-native-elements';

export default class ImageLoader extends Component {

 constructor() {
     super();
     this.state={
        isLoading: false,
     }
 }

 _renderPlaceHolder = isLoading => {
    if(isLoading) {
        if(this.props.title) {
            var name = this.props.title.trim();
            const names = name.split(' ');
            if(names.length > 1){
              name = `${names[0].substring(0,1)}${names[1].substring(0,1)}`
            } else {
              name = names[0].substring(0,2);
            }
            return (
              <Avatar 
                containerStyle={this.props.style || {}}
                overlayContainerStyle={this.props.style ? [this.props.style, {marginLeft: 0}] : {}}
                titleStyle={this.props.titleStyle || {}}
                size={this.props.avatarSize || 'small'}
                rounded={this.props.rounded} 
                title={name} />
            );
        } else {
            return (
              <Avatar containerStyle={this.props.style || {}} size={this.props.avatarSize || 'small'} rounded={this.props.rounded} icon={{ name: 'person' }} />
            )
        }
    }
 }

 _renderImage = () => {
   if (this.props.src) {
      return(
        <Image 
          source={{
              uri: this.props.src
          }}
          style={[
              {borderRadius: this.props.rounded ? 100 : 0},
              this.props.style || styles.image,
          ]}
          onLoadStart={()=>{
              //console.log('image start')
              this.setState({isLoading: true})
          }}
          onLoad={()=>{
              //console.log('image loaded')
              this.setState({isLoading: false}
          )}}
          onError={(error)=>{
              //console.log(` inage Èrror: ${error}`)
              this.setState({isLoading: true})
          }}
          resizeMode={'cover'}
        />
      );
   } else {
     return this._renderPlaceHolder(true);
   }
 }

  render() { 
      console.log(`Ìmage props : ${JSON.stringify(this.props)} ${this.props.src}`)
    return (
      <View>
        {this._renderImage()}
        {this.state.isLoading && <View style={[{position: 'absolute'}, this.props.style || styles.image]}>{this._renderPlaceHolder(this.state.isLoading)}</View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
      height: 50,
      width: 50
  }
});
