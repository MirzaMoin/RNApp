import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';

export class ScreenHeader extends Component {
  render() {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity>
          <Image
            style={styles.headerUserImage}
            source={{
              uri:
                'https://www.atlassian.design/server/images/avatars/avatar-96.png',
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <View style={styles.headerUserImage}></View>
        <Text style={styles.headerText}>{this.props.title}</Text>
        <TouchableOpacity style={styles.headerMenuItem}>
          <Image
            style={styles.headerMenuItem}
            source={{
              uri: 'https://image.flaticon.com/icons/png/128/2097/2097743.png',
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerMenuItem}>
          <Image
            style={styles.headerMenuItem}
            source={{
              uri: 'https://image.flaticon.com/icons/png/128/1286/1286969.png',
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  headerContainer: {
    flex: 1,
    maxHeight: 50,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 1,
    alignItem: 'center',
    flexDirection: 'row',
    backgroundColor: '#f6f6f6',
    textAlign: 'center',
  },
  headerUserImage: {height: 35, width: 35, marginLeft: 5},
  headerMenuItem: {height: 35, width: 35, marginLeft: 7, marginRight: 10},
  headerText: {textAlign: 'center', flex: 1, marginBottom:12 , alignSelf: 'center', fontSize: 25},
};
