import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  // TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
  Dimensions,
  FlatList,
  Linking,
  AsyncStorage,
  StyleSheet,
  TextInput,
  StatusBar
} from 'react-native';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import { makeRequest } from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import { ScreenHeader } from '../widget/ScreenHeader';
import GetLocation from 'react-native-get-location'
import GlobalAppModel from '../model/GlobalAppModel';
import BottomNavigationTab from './../widget/BottomNavigationTab';
import LoadingScreen from '../widget/LoadingScreen';
var loadingImage = '';

export default class LocationScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      isLoading: true,
      sheetIcon: 'keyboard-arrow-up',
      sheetHeight: 330,
      isFullScreen: false,
      dataSoure: [],
      latitude: 37.78825,
      longitude: -122.4324,
      location: 'primary',
      address: 'address',
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      loadingImage = GlobalAppModel.getLoadingImage();
      this.setState({
        isLoading: true,
      });
      this._getCurrentLocation();
      this._getLocationData()
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  _getCurrentLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log(location);
        this.setState({
          currentLat: location.latitude,
          currentLong: location.longitude
        });
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
  }

  _getLocationData = () => {

    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.GET_LOCATION_DATA}?RewardProgramID=${GlobalAppModel.rewardProgramId}`,
      'get',
    )
      .then(response => {
        console.log(JSON.stringify(response));
        this.setState({ isLoading: false });
        if (response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          this.setState({
            dataSoure: response.responsedata.locationData,
            locaiton: response.responsedata.locationData.lenght > 0 ? response.responsedata.locationData[0].locationName : '',
            address: response.responsedata.locationData.lenght > 0 ? response.responsedata.locationData.storeAddress.address1 : '',
            latitude: parseFloat(response.responsedata.locationData[0].storeAddress.latitude),
            longitude: parseFloat(response.responsedata.locationData[0].storeAddress.longitude),
          })
        }
      })
      .catch(error => console.log('error : ' + error));
  }

  _openSheetFull = () => {
    // this.Standard.close();
    const { height } = Dimensions.get('window');
    console.log('height : ' + height + ' sheet : ' + this.state.sheetHeight);
    if (this.state.isFullScreen) {
      this.setState({
        sheetIcon: 'keyboard-arrow-up',
        sheetHeight: 330,
        isFullScreen: false,
      });
    } else {
      this.setState({
        sheetIcon: 'keyboard-arrow-down',
        sheetHeight: (Platform.OS == 'ios') ? height - 44 : height,
        isFullScreen: true,
      });
    }
    let that = this;
    setTimeout(function () {
      that.locationListSheet.open();
    }, 100);
  };

  openLink = link => {
    /*Linking.canOpenURL(link).then(supported => {
      if (supported) {
        Linking.openURL(link);
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });*/
    try {
      this.locationListSheet.close()
      this.props.navigation.push('webScreen', {
        title: 'Location',
        webURL: link,
      });
    } catch (Exeption) {
      console.log(`Somethign wring : ${Exeption}`)
    }
  };

  _showDirectionOnMap = address => {
    var link = '';
    if (Platform.OS == 'ios') {
      link = '';
    } else {
      link = `https://www.google.com/maps/dir/?api=1&origin=${this.state.currentLat},${this.state.currentLong}&destination=${address.latitude},${address.longitude}`;
    }
    console.log(`Location : ${link}`)
    Linking.canOpenURL(link).then(supported => {
      if (supported) {
        Linking.openURL(link);
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });
  }

  renderRow = rowData => {
    return (
      <View style={styles.locationContainer}>
        <View style={{ flexDirection: 'row' }}>
          <MDIcon name={'location-on'} style={styles.locationIcon} />
          {/* <TouchableNativeFeedback */}
          <TouchableOpacity
            onPress={() => {
              if (rowData.storeAddress.latitude && rowData.storeAddress.longitude) {
                this._changeLocation(
                  parseFloat(rowData.storeAddress.latitude),
                  parseFloat(rowData.storeAddress.longitude),
                  rowData.storeAddress,
                )
              } else { console.log('not possible') }
            }}>
            <Text style={styles.locationTitle}>{rowData.locationName}</Text>
          </TouchableOpacity>
          {/* </TouchableNativeFeedback> */}
        </View>
        {this._renderAddress(rowData.storeAddress)}
        {this._parseWebURL(rowData.websiteUrl)}
        {this._renderDirection(rowData.storeAddress)}
        <View style={styles.devider} />
      </View>
    );
  };

  _renderAddress = address => {
    if (address) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <MDIcon name={'location-city'} style={{ fontSize: 20 }} />
          <View style={{ flex: 1, flexDirection: 'column' }}>
            {this._renderAddressLine(address.address1)}
            {this._renderAddressLine(address.address2)}
            {this._renderAddressLine(`${address.city} ${address.state} ${address.zipCode}`)}
          </View>
        </View>
      )
    }
  }

  _renderAddressLine = text => {
    if (text) {
      return (<Text style={styles.addressText}>{text}</Text>);
    }
  }

  _parseWebURL = url => {
    if (url) {
      const url1 = url.replace('https://', '');
      const urlNew = url1.replace('http://', '');
      return (
        <View style={{ flexDirection: 'row' }}>
          <MDIcon name={'open-in-browser'} style={styles.locationIcon} />
          {/* <TouchableNativeFeedback  */}
          <TouchableOpacity
            onPress={() => this.openLink(url)}>
            <Text style={styles.webTextText}>{urlNew}</Text>
          </TouchableOpacity>
          {/* </TouchableNativeFeedback> */}
        </View>
      )
    }
  }

  _renderDirection = address => {
    if (address.latitude && address.longitude) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <MDIcon name={'directions'} style={styles.locationIcon} />
          {/* <TouchableNativeFeedback  */}
          <TouchableOpacity onPress={() => this._showDirectionOnMap(address)}>
            <Text style={styles.directionText}>Get Direction</Text>
          </TouchableOpacity>
          {/* </TouchableNativeFeedback> */}
        </View>
      )
    }
  }

  _changeLocation = (lat, long, storeAddress) => {
    this.setState({
      latitude: lat,
      longitude: long,
      address: `${storeAddress.address1}${storeAddress.address2}`,
    });
  };

  _filterLocation = (text) => {
    const filteredAssets = this.state.dataSoure.filter(location => location.locationName.toLowerCase().indexOf(text.toLowerCase()) !== -1);
    this.setState({
      filteredData: filteredAssets
    });
  }

  _renderClearSearch = () => {
    if (this.state.search) {
      return (
        <TouchableOpacity
          // <TouchableNativeFeedback
          activeOpacity={0.8}
          onPress={() => this.setState({ search: '' })}>
          <MDIcon name={'close'} style={{ fontSize: 24 }} />
          {/* </TouchableNativeFeedback> */}
        </TouchableOpacity>
      )
    }
  }

  _renderBody = () => {
    if (this.state.isLoading) {
      return (
        <LoadingScreen LoadingImage={loadingImage} />
      );
    } else {
      return (
        <View style={styles.mainContainer}>
          <View style={{ flex: 1, flexDirection: 'column-reverse' }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.0522,
                longitudeDelta: 0.0121,
              }}
              region={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.0522,
                longitudeDelta: 0.0121,
              }}>
              <Marker
                ref={marker => {
                  this.marker = marker;
                }}
                coordinate={{
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                }}
                tracksViewChanges={true}
                title={this.state.location}
                description={this.state.address}
              />
            </MapView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                // {/* <TouchableNativeFeedback */}
                style={styles.button}
                onPress={() => {
                  this.setState({
                    sheetIcon: 'keyboard-arrow-up',
                    sheetHeight: 330,
                  });
                  let that = this;
                  setTimeout(function () {
                    that.locationListSheet.open();
                  }, 100);
                }}>
                <View >
                  <MDIcon style={styles.buttonIcon} name={'menu'} />
                </View>
                {/* </TouchableNativeFeedback> */}
              </TouchableOpacity>
            </View>

          </View>
          <BottomNavigationTab navigation={this.props.navigation} />
          <RBSheet
            ref={ref => {
              this.locationListSheet = ref;
            }}
            closeOnDragDown={true}
            customStyles={{
              container: {
                borderTopLeftRadius: this.state.isFullScreen ? 0 : 15,
                borderTopRightRadius: this.state.isFullScreen ? 0 : 15
              }
            }}
            height={this.state.sheetHeight}>
            <View style={styles.bottomSheetContainer}>
              <Text style={styles.bottomSheetTitle}>Locations</Text>
              <View style={styles.topIconContainer}>
                {/* <TouchableNativeFeedback  */}
                <TouchableOpacity style={styles.topIconContainer} onPress={() => this._openSheetFull()}>
                  <MDIcon name={this.state.sheetIcon} style={{ fontSize: 30 }} />
                </TouchableOpacity>
                {/* </TouchableNativeFeedback> */}

              </View>
              <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginVertical: 5, borderWidth: 2, borderRadius: 5, borderColor: 'rgba(153,153,153,1)', alignItems: 'center', marginTop: 10 }}>
                <MDIcon name={'search'} style={{ fontSize: 24 }} />
                <TextInput
                  placeholder="Location Name"
                  style={{ flex: 1 }}
                  value={this.state.search}
                  onChangeText={(text) => {
                    this.setState({
                      search: text
                    });
                    this._filterLocation(text)
                  }} />
                {this._renderClearSearch()}
              </View>
              <FlatList
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
                ListEmptyComponent={() => {
                  return (
                    <View style={{ flex: 1, height: this.state.sheetHeight - 150, justifyContent: 'center', alignContent: 'center' }}>
                      <Text style={{ fontSize: 20, alignSelf: 'center' }}>No Location Found</Text>
                    </View>
                  );
                }}
                data={this.state.search ? this.state.filteredData : this.state.dataSoure}
                renderItem={({ item, index }) => this.renderRow(item)}
                keyExtractor={item => item.addressId.toString()}
              />
            </View>
          </RBSheet>
        </View>
      );
    }
  }

  render() {
    const { height } = Dimensions.get('window');
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScreenHeader
          navigation={this.props.navigation}
          title={'Locations'}
          userPoint={GlobalAppModel.redeemablePoint} />
        {this._renderBody()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(256,256,256,1)',
  },
  buttonContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    flex: 1,
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(153,153,153,0.5)',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignContent: 'center',
    margin: 25,
  },
  buttonIcon: {
    fontSize: 26,
    alignSelf: 'center',
    color: '#7a7a7a',
    // margin:25
  },
  bottomSheetContainer: { flex: 1, paddingLeft: 20, paddingRight: 20 },
  bottomSheetTitle: { fontSize: 24, textAlign: 'center' },
  locationContainer: { flex: 1, flexDirection: 'column', padding: 5, width: '100%' },
  locationIcon: { fontSize: 20, alignSelf: 'center' },
  locationTitle: { paddingLeft: 15, fontSize: 22 },
  addressText: { paddingLeft: 15, fontSize: 15 },
  webTextText: { paddingLeft: 15, fontSize: 15, color: 'blue' },
  directionText: { paddingLeft: 15, fontSize: 15, color: 'green' },
  devider: {
    height: 1,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(153,153,153,0.3)',
  },
  topIconContainer: {
    paddingRight: 10,
    paddingTop: 5,
    alignSelf: 'flex-end',
    position: 'absolute',
  },
});
