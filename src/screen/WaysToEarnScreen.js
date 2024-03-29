import React, { Component } from 'react';
import { View, Text, Image, FlatList, AsyncStorage, ActivityIndicator, Dimensions, SafeAreaView } from 'react-native';
import { makeRequest } from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';
import ReadMore from 'react-native-read-more-text';
import ImageLoader from './../widget/ImageLoader';
import BottomNavigationTab from './../widget/BottomNavigationTab';
import { ScreenHeader } from '../widget/ScreenHeader';
import LoadingScreen from '../widget/LoadingScreen';
import GlobalAppModel from '../model/GlobalAppModel';
var loadingImage = '';

const maxWidth = Dimensions.get('window').width;
const imageHeight = (maxWidth / 16) * 9;
const textColor = '#848482';

export default class WayToEarnScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    console.log('Constructor called');
    super();
    this.state = {
      desc: -1,
      screenData: {},
      isLoading: true,
    };
    this._showItem = 0;
  }

  _showItem = 0;

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      loadingImage = GlobalAppModel.getLoadingImage();
      this.setState({
        desc: -1,
        screenData: {},
        isLoading: true,
      });
      this._callGetWayToEarnScreenData()
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  _callGetWayToEarnScreenData = () => {
    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.GET_WAYTO_EARN_DATA}?RPToken=${APIConstant.RPTOKEN}&ContactId=${GlobalAppModel.userID}&WebFormID=${GlobalAppModel.webFormID}`,
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

  _showImageIcon = (icon, title) => {
    if (icon) {
      return (
        <ImageLoader
          src={icon}
          style={styles.titleIcon}
          title={title} />
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
      // this.props.handleProfile();
    }
  }

  _showRecentActivity = (item) => {
    if (item > 0)
      return <Text onPress={() => {
        this._handleClick(item)
      }} style={styles.btnRecentActivity}>Recent Activity</Text>;
  };

  _renderItem = (item, index) => {
    if (item.isVisible) {
      this._showItem = this._showItem + 1;
      return (
        <View
          style={{
            paddingHorizontal: 20,
            //padding: 20,
            paddingVertical: 20,
            backgroundColor: this._showItem % 2 ? 'white' : 'rgba(153,153,153,0.2)',
          }}>
          <View style={styles.titleContainer}>
            {this._showImageIcon(item.imageURL, item.title)}
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

  _renderBody = () => {
    if (this.state.isLoading) {
      return <LoadingScreen LoadingImage={loadingImage} />
    } else {
      return (
        <ScrollView>
          <View style={{ hegith: imageHeight }}>
            <Image
              style={{ height: imageHeight }}
              source={{
                uri:
                  APIConstant.HEADER_IMAGE,
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
      )
    }
  }

  render() {
    this._showItem = 0;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContainer}>
          <ScreenHeader
            navigation={this.props.navigation}
            title={'Way to Earn'}
            userPoint={GlobalAppModel.redeemablePoint || '0'} />
          {this._renderBody()}
          <BottomNavigationTab navigation={this.props.navigation} />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = {
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  imageOverlay: {
    height: imageHeight,
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
    fontSize: 24,
    color: textColor,
    textAlign: 'left',
    fontWeight: 'normal',
  },
  description: {
    marginTop: 10,
    textAlign: 'justify',
    fontSize: 16,
    color: textColor,
    lineHeight: 16 * 1.5,
  },
  subTitle: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    paddingTop: 20,
    color: textColor
  },
  btnRecentActivity: {
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: GlobalAppModel.primaryButtonColor || '#4b92d2',
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
