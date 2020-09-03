import React, { Component } from 'react';
import { View, Text, Image, FlatList, AsyncStorage, ActivityIndicator } from 'react-native';
import { makeRequest } from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';
import ReadMore from 'react-native-read-more-text';

export class WayToEarnScreen extends Component {
  constructor() {
    console.log('Constructor called');
    super();
    this.state = {
      title: 'HomeScreen',
      tabIndex: 1,
      desc: -1,
      screenData: {},
      isLoading: true,
    };
    this._showItem = 0;
  }

  _showItem = 0;

  componentWillMount() {
    this._getStoredData();
  }

  _getStoredData = async () => {
    try {
      await AsyncStorage.getItem('userID', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          //const val = JSON.parse(value);
          if (value) {
            this.setState({
              userID: value,
            })
          }
        }
      });

      await AsyncStorage.getItem('webformID', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          //const val = JSON.parse(value);
          if (value) {
            this.setState({
              isLoading: true,
              webformID: value,
            }, () => this._callGetWayToEarnScreenData())
          } else {
          }
        }
      });
    } catch (error) {
      // Error saving data
      console.log(error)
    }
  };

  _callGetWayToEarnScreenData = () => {
    console.log('way to earn');
    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.GET_WAYTO_EARN_DATA}?RPToken=${APIConstant.RPTOKEN}&ContactId=${this.state.userID}&WebFormID=${this.state.webformID}`,
      'get',
    )
      .then(response => {
        if (response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          this.setState({
            screenData: response.responsedata,
            isLoading: false,
          });
        }
      })
      .catch(error => console.log('error : ' + error));
  }

  _showImageIcon = icon => {
    if (icon) {
      console.log('show Image : ' + icon);
      return (
        <Image
          style={styles.titleIcon}
          source={{
            uri: icon,
          }}
          resizeMode="cover"
        />
      );
    }
  };

  _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{ color: 'blue', marginTop: 5 }} onPress={handlePress}>
        Read more
      </Text>
    );
  }

  _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{ color: 'blue', marginTop: 5 }} onPress={handlePress}>
        Show less
      </Text>
    );
  }

  _showDescription = (index, text) => {
    /*if (this.state.desc == index) {
      return <Text style={styles.description}>{text}</Text>;
    }*/
    return <ReadMore
      numberOfLines={1.5}
      renderTruncatedFooter={this._renderTruncatedFooter}
      renderRevealedFooter={this._renderRevealedFooter}
    >
      <Text style={styles.description}>
        {text}
      </Text>
    </ReadMore>
  };

  _showExtraText = index => {
    if (this.state.desc != index) {
      return 'Read more...';
    } else {
      return '';
    }
  };

  _handleClick = index => {
    if (index == 6) {
      this.props.handleProfile();
    }
  }

  _showRecentActivity = (item) => {
    if (item > 0)
      return <Text onPress={() => {
        -this._handleClick(item)
      }} style={styles.btnRecentActivity}>Recent Activity</Text>;
  };

  _renderItem = (item, index) => {
    if (item.isVisible) {
      this._showItem = this._showItem + 1;
      return (
        <View
          style={{
            padding: 15,
            backgroundColor: this._showItem % 2 ? 'white' : 'rgba(153,153,153,0.2)',
          }}>
          <View style={styles.titleContainer}>
            {this._showImageIcon(item.imageURL)}
            <Text style={styles.title}>{item.title}</Text>
          </View>
          {this._showDescription(this._showItem, item.description)}
          <Text style={styles.subTitle}>{item.subtitle}</Text>
          <View style={styles.footerContainer}>
            {this._showRecentActivity(index)}
            <Text style={styles.pointCount}>{item.points}</Text>
            <Text style={styles.pointTerm}>PTS</Text>
          </View>
        </View>
      );
    }
  };

  render() {
    this._showItem = 0;
    if (this.state.isLoading) {
      return <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} />
      </View>
    }
    return (
      <View style={styles.mainContainer}>
        <ScrollView>
          <View style={{ hegith: 150 }}>
            <Image
              style={{ height: 150 }}
              source={{
                uri:
                  'http://preview.byaviators.com/template/superlist/assets/img/tmp/agent-2.jpg',
              }}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay} />
          </View>

          {this._renderItem(this.state.screenData.totalPoints, 0)}
          {this._renderItem(this.state.screenData.purchasePoints, 1)}
          {this._renderItem(this.state.screenData.socialShare, 2)}
          {this._renderItem(this.state.screenData.referFriends, 3)}
          {this._renderItem(this.state.screenData.leaderboard, 4)}
          {this._renderItem(this.state.screenData.surveys, 5)}
          {this._renderItem(this.state.screenData.completeProfile, 6)}
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  imageOverlay: {
    height: 150,
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    marginRight: 10,
  },
  titleIcon: {
    height: 50,
    width: 50,
    marginRight: 15,
  },
  title: {
    flex: 1,
    fontSize: 21,
    color: '#576b81',
  },
  description: {
    marginTop: 10,
    textAlign: 'justify',
    fontSize: 16,
    color: '#576b81',
  },
  subTitle: {
    flex: 1,
    textAlign: 'right',
    fontSize: 15,
    paddingTop: 15,
  },
  btnRecentActivity: {
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: '#4b92d2',
    fontWeight: 'bold',
    color: 'white',
    borderRadius: 5,
  },
  pointCount: {
    textAlign: 'right',
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
    alignSelf: 'flex-end',
  },
  pointTerm: {
    textAlign: 'right',
    alignSelf: 'flex-end',
    paddingLeft: 5,
    fontSize: 15,
    color: 'green',
  },
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
};
