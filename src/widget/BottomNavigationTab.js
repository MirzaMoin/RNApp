import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { Card } from 'react-native-elements';
import HomeModel from './../model/HomeModel';
import GlobalAppModel from './../model/GlobalAppModel';
import { parseColor } from './../utils/utility';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';

export default class BottomNavigationTab extends Component {
  constructor() {
    console.log('Constructor called');
    super();
    this.state = {
      title: 'HomeScreen',
      tabIndex: 1,
    };
  }

  _renderBottomMenuItem = (title, index, icon) => {
    return (
      <TouchableOpacity
        activeOpacity={this.state.tabIndex == index ? 1 : 0.6}
        style={[
          styles.footerMenuItem,
          //{ flex: this.state.tabIndex == index ? 3 : 1 },
          //{ backgroundColor: this.state.tabIndex == index ? this._menuSelectColor[index] : '#012345' },
          //this.state.tabIndex == index ? { margin: 9, borderRadius: 40, paddingVertical: 7 } : {}
        ]}
        onPress={() => {
          this.setState({abs: ''})
          //this.props.navigation.navigate('offer')
          /*if (HomeModel.homePageRibbonLinkType == 'external') {
            try {
              this.props.navigation.push('webScreen', {
                title: HomeModel.homePageRibbonText,
                webURL: HomeModel.homePageTopButtonLink,
              });
            } catch (Exeption) { console.log(`Èrror : ${Exeption}`) }
          } else {
            this.props.navigation.push(HomeModel.homePageTopButtonLink);
          }*/
        }}>
        <Icon name={icon} style={{ fontSize: this.state.tabIndex == index || true ? 20 : 18, color: 'white' }} />
        {/*<Text lineBreakMode={'tail'} numberOfLines={1} style={styles.footerMenuSelectedItemText}>{title}</Text>*/}
      </TouchableOpacity>
    );
  }

  render() {
    if (HomeModel.homePageDisplayFooter && HomeModel.footerLinks.length > 0) {
      return (
        <View style={styles.footerContainer}>
          {this._renderBottomMenuItem('Home', 0, 'home')}
          {this._renderBottomMenuItem('Transaction', 1, 'exchange-alt')}
          {this._renderBottomMenuItem('Offer', 2, 'tag')}
          {this._renderBottomMenuItem('Notification', 3, 'bell')}
          {this._renderBottomMenuItem('More', 4, 'ellipsis-h')}
        </View>
      );
    } else {
      return <View />
    }
  }
}

const styles = {
  footerContainer: {
    height: 50,
    backgroundColor: parseColor(GlobalAppModel.footerColor),
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  footerMenuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    paddingVertical: 15,
    flexDirection: 'column',
  },
  footerMenuItemImage: {
    height: 20,
    width: 20,
    tintColor: 'white',
  },
  footerMenuSelectedItem: {
    height: 24,
    //width: 24,
    tintColor: 'white',
  },
  footerMenuIdelItem: {
    height: 18,
    //width: 18,
    tintColor: '#fff',
  },
  footerMenuSelectedItemText: {
    color: 'white',
    fontSize: 15,
    paddingTop: 5,
    paddingHorizontal: 5,
    marginLeft: 5,
  },
  footerMenuIdelItemText: {
    color: '#000',
    fontSize: 10,
  },
};
