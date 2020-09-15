import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import HomeModel from './../model/HomeModel';
import GlobalAppModel from './../model/GlobalAppModel';
import FooterMenuModel from './../model/FooterMenuModel';
import { parseColor } from './../utils/utility';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';

type Props = {
  navigation?: ?Object,
}

type State = {}

export default class BottomNavigationTab extends Component<Props, State> {
  constructor() {
    super();
    this.state = {
      title: 'HomeScreen',
      tabIndex: 1,
    };
  }

  _renderBottomMenuItem = menuItem => {
    const footerMenu = new FooterMenuModel(menuItem)
    return (
      <TouchableOpacity
        activeOpacity={0.4}
        style={styles.footerMenuItem}
        onPress={() => {
          if (footerMenu.footerLinkType == 'external') {
            try {
              this.props.navigation.push('webScreen', {
                title: footerMenu.footerText,
                webURL: footerMenu.footerExternalLinkUrl,
              });
            } catch (Exeption) { console.log(`Error : ${Exeption}`) }
          } else {
            if(footerMenu.footerInternalLinkUrl !== this.props.navigation.state.routeName){
              this.props.navigation.push(footerMenu.footerInternalLinkUrl);
            }
          }
        }}>
        <Icon name={footerMenu.footerIcon} style={{ fontSize: 19, color: 'white' }} />
        <Text lineBreakMode={'tail'} numberOfLines={1} style={styles.footerMenuSelectedItemText}>{footerMenu.footerText}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    if (HomeModel.homePageDisplayFooter && HomeModel.footerLinks.length > 0) {
      return (
        <View style={[styles.footerContainer,{backgroundColor: parseColor(GlobalAppModel.footerColor)}]}>
          {
            HomeModel.footerLinks.map((item) => {
             return this._renderBottomMenuItem(item)
            })
          }
        </View>
      );
    } else {
      return <View />
    }
  }
}

const styles = {
  footerContainer: {
    minHeight: 50,
    backgroundColor: '#012345',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  footerMenuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    paddingVertical: 10,
    flexDirection: 'column',
  },
  footerMenuSelectedItemText: {
    color: 'white',
    fontSize: 13,
    marginTop: 3,
    paddingHorizontal: 5,
    marginLeft: 5,
  },
};
