import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  AsyncStorage,
  Alert,
  ScrollView, FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import { makeRequest } from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import { ScreenHeader } from '../widget/ScreenHeader';
import ImageLoader from './../widget/ImageLoader';
import BottomNavigationTab from './../widget/BottomNavigationTab';
import LoadingScreen from '../widget/LoadingScreen';
import GlobalAppModel from '../model/GlobalAppModel';
var loadingImage = '';

const maxWidth = Dimensions.get('window').width;
const imageHeight = (maxWidth / 16) * 9;

export default class RPGScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      isLoading: true,
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      loadingImage = GlobalAppModel.getLoadingImage();
      this.setState({
        isLoading: true
      });
      this._callRPGData()
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  _callRPGData = () => {
    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.GET_RPG_DATA}?RPToken=${APIConstant.RPTOKEN}&ContactId=${GlobalAppModel.userID}`,
      'get',
    )
      .then(response => {
        if (response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          this.setState({
            screenData: response.responsedata.lstRPG,
            isLoading: false,
          });
        }
      })
      .catch(error => console.log('error : ' + error));
  }

  _renderRow = item => {
    return (
      <View style={{ flexDirection: 'row', minHeight: 70, alignContent: 'center', alignItems: 'center', height: 80, borderBottomColor: 'lightgrey', borderBottomWidth: 0.5 }}>
        <View style={{ padding: 5, height: '100%', backgroundColor: item.isActive ? 'rgba(29,201,22, 1)' : 'rgba(153,153,153,1)', width: '15%', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
          <Text style={{ fontSize: 16,fontWeight:"bold" }}>{item.pointValue}</Text>
          <Text>Points</Text>
        </View>
        {/* <View style={{ flexDirection: 'row', width: '70%', borderBottomColor: 'lightgrey', borderBottomWidth: 0.5,marginLeft:5}}> */}
          <ImageLoader
            title={item.title}
            src={item.image}
            style={styles.offerImage}
            titleStyle={{ fontSize: 24 }} />
          <View style={{ flex: 1, height: 70, flexDirection: 'column', }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', paddingTop: 2 }}>{item.title}</Text>
            <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontSize: 14, color: 'rgba(153, 153, 153, 1)', }}>{item.details}</Text>
          </View>
        {/* </View> */}
        {/* <View style={{ width: '10%', height: '100%', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}> */}
          {/* <View style={{ height: '100%', width: 2, backgroundColor: item.isActive ? 'red' : 'rgba(153,153,153,1)' }} />
          <View style={{ backgroundColor: item.isActive ? 'red' : 'rgba(153,153,153,1)', position: 'absolute', padding: 5, borderRadius: 50 }}>
            <MDIcon name={'check'} style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }} />
          </View> */}
        {/* </View> */}
      </View>
    )
  }

  _renderBody = () => {
    if (this.state.isLoading) {
      return (
        <LoadingScreen LoadingImage={loadingImage} />
      );
    } else {
      return (
        <ScrollView>
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <View style={{ hegith: imageHeight }}>
              <Image
                style={{ height: imageHeight }}
                opacity={1}
                source={{
                  uri: APIConstant.HEADER_IMAGE
                }}
                resizeMode="cover"
              />
              <View opacity={0} style={styles.imageOverlay} />
            </View>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            data={this.state.screenData}
            renderItem={({ item, index }) => this._renderRow(item)}
          />
        </ScrollView>
      )
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <ScreenHeader
            navigation={this.props.navigation}
            title={'Rewards Entry Goal'}
            userPoint={GlobalAppModel.redeemablePoint} />
          {this._renderBody()}
          <BottomNavigationTab navigation={this.props.navigation} />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
  },
  button: {
    minWidth: 120,
    marginTop: 20,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: '#012345',
  },
  picker: {
    flex: 1,
    height: 55,
    alignContent: 'flex-end',
    alignSelf: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    margin: 8,
    marginHorizontal: 15
  },
  imageOverlay: {
    height: imageHeight,
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,1)',
  },
  offerImage: {
    height: 60,
    width: 60,
    borderRadius: 10,
    marginHorizontal: 5,
    marginLeft:10,
  }
});