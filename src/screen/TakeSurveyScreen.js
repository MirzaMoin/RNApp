import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import { ShareDialog } from 'react-native-fbsdk';
import { BottomNavigationTab } from './../widget/BottomNavigationTab';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import { NotificaitonScreen } from './NotificationScreen';
import CustomTab from './../widget/CustomTab';
import { makeRequest } from './../api/apiCall';
import APIConstant from './../api/apiConstant';

export default class TakeSurveyScreen extends Component {
  constructor() {
    super();
    this.state = {
      dataSoureUntaken: [],
      dataSoureTaken: [],
      isFetchingUntaken: true,
      isFetchingTaken: true,
    };
  }

  dataUntakenSurvey = [
    {
      id: 1,
      title: 'New launched Pizza overview',
      date: 'Today',
    },
    {
      id: 2,
      title: 'How was the new year party',
      date: '20/03/2020',
    },
    {
      id: 3,
      title: 'What do you think about our new theme',
      date: '19/03/2020',
    },
  ];

  dataTakenSurvey = [
    {
      id: 1,
      title: 'New year party theme and music',
      date: 'Today',
      point: 6,
    },
    {
      id: 2,
      title: 'Our new launched burger',
      date: '20/03/2020',
      point: 7,
    },
    {
      id: 3,
      title: 'What do you think about us',
      date: '19/03/2020',
      point: 15,
    },
  ];

  getUntakenSurvey = () => {
    makeRequest(APIConstant.BASE_URL + APIConstant.USERS, 'get')
      .then(response => {
        console.log(JSON.stringify(response));
        this.setState({
          isFetchingUntaken: false,
          dataSoureUntaken: response.data,
        });
      })
      .catch(error => console.log('error : ' + error));
  };

  _wait = timeout => {
    let that = this;
    return new Promise(resolve => {
      setTimeout(function () {
        that.setState({ isFetchingTaken: false, isFetchingUntaken: false });
      }, 3000);
    });
  };

  onRefreshTaken() {
    this.setState({ isFetchingTaken: true }, function () {
      this._wait(5000);
      this.setState({
        dataSoure: this.data,
      });
    });
  }

  onRefreshUnaken() {
    this.setState({ isFetchingUntaken: true }, function () {
      this.getUntakenSurvey();
    });
  }

  renderUntakenRow = (itemData, index) => {
    return (
      <TouchableHighlight
        underlayColor="rgba(192,192,192,1,0.6)"
        onPress={() => {
          this.props.navigation.navigate('SurveyForm', {
            notification: itemData,
          });
        }}>
        <View style={{ backgroundColor: 'rgba(256,256,256,1)', padding: 5 }}>
          <View style={styles.subContainer}>
            <View style={styles.messageContainer}>
              <View style={{ flexDirection: 'row' }}>
                <MDIcon
                  name={'assignment'}
                  style={{ alignSelf: 'center', fontSize: 16, marginRight: 4 }}
                />
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 18, flex: 1, padding: 1, paddingRight: 5 }}>
                  {itemData.email}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <MDIcon
                  name={'date-range'}
                  style={{
                    alignSelf: 'center',
                    fontSize: 14,
                    marginRight: 4,
                    color: 'gray',
                  }}
                />
                <Text style={{ fontSize: 12, padding: 1, color: 'gray' }}>
                  {itemData.first_name}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{ alignSelf: 'center', fontSize: 16, color: '#13538E' }}>
                Start
              </Text>
              <MDIcon
                name={'keyboard-arrow-right'}
                style={{
                  fontSize: 30,
                  alignSelf: 'center',
                  marginRight: 5,
                  color: '#13538E',
                }}
              />
            </View>
          </View>
          <View style={styles.saprator} />
        </View>
      </TouchableHighlight>
    );
  };

  renderTakenRow = (itemData, index) => {
    return (
      <TouchableHighlight
        underlayColor="rgba(192,192,192,1,0.6)"
        onPress={() => {
          this.props.navigation.navigate('SurveyForm', {
            notification: itemData,
          });
        }}>
        <View style={{ backgroundColor: 'rgba(256,256,256,1)', padding: 5 }}>
          <View style={styles.subContainer}>
            <View style={styles.messageContainer}>
              <View style={{ flexDirection: 'row' }}>
                <MDIcon
                  name={'assignment'}
                  style={{ alignSelf: 'center', fontSize: 16, marginRight: 4 }}
                />
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 18, flex: 1, padding: 1, paddingRight: 5 }}>
                  {itemData.title}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <MDIcon
                    name={'date-range'}
                    style={{
                      alignSelf: 'center',
                      fontSize: 14,
                      marginRight: 4,
                      color: 'gray',
                    }}
                  />
                  <Text style={{ fontSize: 12, padding: 1, color: 'gray' }}>
                    {itemData.date}
                  </Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <MDIcon
                    name={'attach-money'}
                    style={{
                      alignSelf: 'center',
                      fontSize: 14,
                      marginRight: 4,
                      color: 'gray',
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      padding: 1,
                      color: 'gray',
                      marginLeft: -5,
                    }}>
                    {itemData.point}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{ alignSelf: 'center', fontSize: 16, color: '#13538E' }}>
                Open
              </Text>
              <MDIcon
                name={'keyboard-arrow-right'}
                style={{
                  fontSize: 30,
                  alignSelf: 'center',
                  marginRight: 5,
                  color: '#13538E',
                }}
              />
            </View>
          </View>
          <View style={styles.saprator} />
        </View>
      </TouchableHighlight>
    );
  };
  componentDidMount() {
    this.getUntakenSurvey();
    this.setState({
      dataSoureTaken: this.dataTakenSurvey,
      isFetchingTaken: false,
    });
  }

  render() {
    return (
      <View style={styles.mainContainer}>
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
        <ScrollableTabView
          tabBarInactiveTextColor={'white'}
          tabBarActiveTextColor={'#13538E'}
          tabBarUnderlineStyle={{ backgroundColor: '#13538E' }}
          tabBarTextStyle={{ fontSize: 18 }}
          renderTabBar={() => (
            <CustomTab inactiveTabStyle="rgba(19,83,142,1)" />
          )}>
          <FlatList
            showsVerticalScrollIndicator={false}
            scrollEnabled={this.state.dataSoureUntaken.length > 3}
            data={this.state.dataSoureUntaken}
            renderItem={({ item, index }) => this.renderUntakenRow(item, index)}
            keyExtractor={item => item.id.toString()}
            onRefresh={() => this.onRefreshUnaken()}
            refreshing={this.state.isFetchingUntaken}
            tabLabel={'Untaken'}
          />

          <FlatList
            style={{ flex: 1, paddingBottom: 10 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={this.dataTakenSurvey.length > 3}
            data={this.state.dataSoureTaken}
            renderItem={({ item, index }) => this.renderTakenRow(item, index)}
            keyExtractor={item => item.id.toString()}
            onRefresh={() => this.onRefreshTaken()}
            refreshing={this.state.isFetchingTaken}
            tabLabel={'Taken'}
          />
        </ScrollableTabView>
        <BottomNavigationTab />
      </View>
    );
  }
}

const styles = {
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(256,256,256,1)',
  },
  imageOverlay: {
    height: 150,
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  socialShareImage: {
    height: 150,
    width: undefined,
    margin: 10,
  },
  socialShareText: {
    fontSize: 16,
    textAlign: 'justify',
  },
  socailIconContainer: {
    marginTop: 15,
    marginBottom: 15,
    padding: 5,
    flexDirection: 'row',
    backgroundColor: 'rgba(153,153,153,0.2)',
    justifyContent: 'space-evenly',
    borderRadius: 15,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(256,256,256,1)',
  },
  baseScrollView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saprator: {
    backgroundColor: '#808080',
    flex: 1,
    height: 1,
  },
  messageContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
  },
  profileContainer: {
    marginRight: 10,
    marginLeft: 10,
    height: 50,
    width: 50,
    borderRadius: 25,
    borderColor: 'rgba(3,10,145,0.2)',
    borderWidth: 2,
    alignSelf: 'center',
  },
  selectNotificationIconBase: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignSelf: 'center',
    position: 'absolute',
    marginRight: 0,
    marginLeft: 15,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(153,153,153,0.9)',
  },
  selectNotificationIcon: {
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    fontSize: 40,
  },
};
