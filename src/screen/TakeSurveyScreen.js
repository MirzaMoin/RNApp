import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  AsyncStorage
} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import BottomNavigationTab from './../widget/BottomNavigationTab';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import CustomTab from './../widget/CustomTab';
import { makeRequest } from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import { ScreenHeader } from '../widget/ScreenHeader';
import GlobalAppModel from '../model/GlobalAppModel';
import Moment from 'moment';
import LoadingScreen from '../widget/LoadingScreen';
const maxWidth = Dimensions.get('window').width;
const imageHeight = (maxWidth / 16) * 9;
var loadingImage = '';

export default class TakeSurveyScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      dataSoureUntaken: [],
      dataSoureTaken: [],
      isFetchingUntaken: true,
      isFetchingTaken: true,
      isLoading: true,
    };
  }


  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      loadingImage = GlobalAppModel.getLoadingImage();
      this.setState({
        isFetchingUntaken: true,
        isLoading: true,
      });
      this._getSurveyList();
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  _getSurveyList = () => {
    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.GET_SURVEY_LIST}?RewardProgramId=${GlobalAppModel.rewardProgramId}&ContactID=${GlobalAppModel.userID}`, 'get')
      .then(response => {
        this.setState({
          isFetchingUntaken: false,
          isFetchingTaken: false,
          isLoading: false,
          dataSoureUntaken: response.responsedata.unTaken || [],
          dataSoureTaken: response.responsedata.completed || [],
        });
      })
      .catch(error => console.log('error : ' + error));
  };

  _onRefreshList() {
    this.setState({ isFetchingTaken: true }, () => {
      this._getSurveyList();
    });
  }

  renderUntakenRow = (itemData, index) => {
    return (
      <TouchableHighlight
        underlayColor="rgba(192,192,192,1,0.6)"
        onPress={() => {
          this.props.navigation.push('webScreen', {
            title: 'Survey',
            webURL: itemData.surveyLink,
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
                  {itemData.surveyTitle}
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
                {Moment(itemData.surveySendDate).format('DD MMM YYYY')}
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
        underlayColor="rgba(192,192,192,1,0.6)">
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
                  {itemData.surveyTitle}
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
                  {Moment(itemData.surveySendDate).format('DD MMM YYYY')}
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
                    {itemData.surveyPoints}
                  </Text>
                </View>
              </View>
            </View>
          
          {/*  <View style={{ flexDirection: 'row' }}>
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
              </View>*/}
          
          </View>
          <View style={styles.saprator} />
        </View>
      </TouchableHighlight>
    );
  };

  _renderBody = () => {
    if(this.state.isLoading) {
      return <LoadingScreen LoadingImage={loadingImage} />
    } else {
      return (
        <View style={{flex: 1}}>
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
        <ScrollableTabView
        tabBarInactiveTextColor={'white'}
        tabBarActiveTextColor={'#13538E'}
        tabBarUnderlineStyle={{ height: 0 }}
        tabBarTextStyle={{ fontSize: 18 }}
        renderTabBar={() => (
          <CustomTab inactiveTabStyle="rgba(19,83,142,1)" />
        )}>
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          data={this.state.dataSoureUntaken}
          ListEmptyComponent={() => {
            return (<View style={{ flex: 1, height: '100%', alignContent: 'center', justifyContent: 'center', }}>
              <Text style={{ fontSize: 20, alignSelf: 'center', marginTop: 150 }}>No Survey Found</Text>
            </View>)
          }}
          renderItem={({ item, index }) => this.renderUntakenRow(item, index)}
          keyExtractor={item => item.surveyID}
          onRefresh={() => this._onRefreshList()}
          refreshing={this.state.isFetchingUntaken}
          tabLabel={'Untaken'}
        />

        <FlatList
          style={{ flex: 1, paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          data={this.state.dataSoureTaken}
          ListEmptyComponent={() => {
            return (<View style={{ flex: 1, height: '100%', alignContent: 'center', justifyContent: 'center', }}>
              <Text style={{ fontSize: 20, alignSelf: 'center', marginTop: 150 }}>No Survey Found</Text>
            </View>)
          }}
          renderItem={({ item, index }) => this.renderTakenRow(item, index)}
          keyExtractor={item => item.surveyID}
          onRefresh={() => this._onRefreshList()}
          refreshing={this.state.isFetchingTaken}
          tabLabel={'Taken'}
        />
      </ScrollableTabView>
          </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <ScreenHeader
          navigation={this.props.navigation}
          title={'Survey'}
          userPoint={GlobalAppModel.redeemablePoint || '0'} />
        {this._renderBody()}
        <BottomNavigationTab
          navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(256,256,256,1)',
  },
  imageOverlay: {
    height: imageHeight,
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
});
