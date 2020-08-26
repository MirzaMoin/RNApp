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

 _renderPlaceHolder = () => {
    if(this.state.isLoading) {
        if(this.props.title) {
            var name = this.props.title.trim();
            const names = name.split(' ');
            if(names.length > 1){
              name = `${names[0].substring(0,1)}${names[1].substring(0,1)}`
            } else {
              name = names[0].substring(0,2);
            }
            return (
              <Avatar size={this.props.avatarSize || 'small'} rounded={this.props.rounded} title={name} />
            );
        } else {
            return (
              <Avatar size={this.props.avatarSize || 'small'} rounded={this.props.rounded} icon={{ name: 'person' }} />
            )
        }
    }
 }

  render() { 
      console.log(`Ìmage props : ${JSON.stringify(this.props)} ${this.props.src}`)
    return (
      <View>
          <Image 
            source={{
                uri: this.props.src
            }}
            style={[
                this.props.style || styles.image,
                {borderRadius: this.props.rounded ? 100 : 0}
            ]}
            onLoadStart={()=>{
                console.log('image start')
                this.setState({isLoading: true})
            }}
            onLoad={()=>{
                console.log('image loaded')
                this.setState({isLoading: false}
            )}}
            onError={(error)=>{
                console.log(` inage Èrror: ${error}`)
                this.setState({isLoading: true})
            }}
            resizeMode={'cover'}
        />
        {!this.state.isLoading && <View style={{position: 'absolute'}}>{this._renderPlaceHolder()}</View>}
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
