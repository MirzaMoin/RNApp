import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import { Header } from 'react-navigation-stack';

export class ScreenHeader extends Component {

  _renderPoint = point => {
    //console.log(`HeaderPoint : ${point}`)
    if(point){
      return (
        <Text>
          <Text style={styles.point}>{point}</Text>
          <Text style={styles.pointTerm}> PTS</Text>
        </Text>
      );
    } else if(point == undefined && !this.props.hidePoint) {
      return (
        <Text>
          <Text style={styles.point}>0</Text>
          <Text style={styles.pointTerm}> PTS</Text>
        </Text>
      );
    }
  }

  _buildFilter = () => {
    if (this.props.buildFilter) {
      return(
        <TouchableOpacity
          onPress={this.props.onPress}>
          <MDIcon name={'import-export'} style={{color: 'white', fontSize: 24}}/>
        </TouchableOpacity>
      )
    }
  }

  render() {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => {
          if(this.props.isGoBack) {
            if (this.props.onGoBack) {
              this.props.onGoBack();
            }
            this.props.navigation.goBack();
          } else {
            this.props.navigation.navigate('homeScreen');
          }
        }}>
        <MDIcon name={'arrow-back'} style={styles.leftIcon}/>
        </TouchableOpacity>
        <Text style={styles.title}>{this.props.title}</Text>
        {this._renderPoint(this.props.userPoint)}
        {this._buildFilter()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    height: Header.HEIGHT,
    paddingHorizontal: 15,
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#012345',
  },
  leftIcon: {
    color: 'white',
    fontSize: 24,
    alignItems: 'center',
    padding: 15,
    paddingLeft: 0
  },
  title: {
    color: 'white',
    fontSize: 18,
    flex: 1,
  },
  point: {
    color: 'white',
    fontSize: 18,
  },
  pointTerm: {
    color: 'white',
    fontSize: 13,
  }
});
