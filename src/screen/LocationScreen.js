import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  FlatList,
  Linking,
} from 'react-native';
import {BottomNavigationTab} from './../widget/BottomNavigationTab';
import TextInput from 'react-native-textinput-with-icons';
import MapView, {AnimatedRegion, Marker} from 'react-native-maps';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Card} from 'react-native-elements';

export default class LocationScreen extends Component {
  constructor() {
    super();
    this.state = {
      title: 'HomeScreen',
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

  data = [
    {
      location: 'Primary Location',
      address1: '104 E 4th st',
      address2: 'Norrius city IL 96325',
      linkTitle: 'roborewards.net',
      link: 'https://www.roborewards.net',
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
      },
    },
    {
      location: 'Suvya Web',
      address1: '302 Atlanta Shopping mall',
      address2: 'Althan-Bhimrad Canal Road',
      linkTitle: 'suvyaweb.com',
      link: 'https://www.suvyaweb.com',
      region: {
        latitude: 21.1382122,
        longitude: 72.7656166,
      },
    },
    {
      location: 'Hardik Patel',
      address1: '302 Sunddaram Apartment',
      address2: 'B/H Sargam Shopping center',
      linkTitle: 'roborewards.net',
      link: 'https://www.roborewards.net',
      region: {
        latitude: 21.5014799,
        longitude: 73.2384527,
      },
    },
  ];
  //33.0640445,65.2065243

  _openSheetFull = () => {
    // this.Standard.close();
    const {height} = Dimensions.get('window');
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
        sheetHeight: height,
        isFullScreen: true,
      });
    }
    let that = this;
    setTimeout(function() {
      that.Standard.open();
    }, 100);
  };

  componentDidMount() {
    this.setState({
      dataSoure: this.data,
      locaiton: this.data[0].locaiton,
      address: this.data[0].address1 + this.data[0].address2,
    });
  }

  openLink = link => {
    Linking.canOpenURL(link).then(supported => {
      if (supported) {
        Linking.openURL(link);
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });
  };

  renderRow = rowData => {
    return (
      <View style={styles.locationContainer}>
        <View style={{flexDirection: 'row'}}>
          <MDIcon name={'location-on'} style={styles.locationIcon} />
          <TouchableOpacity
            onPress={() =>
              this._changeLocation(
                rowData.region.latitude,
                rowData.region.longitude,
                rowData.location,
                rowData.address1,
                rowData.address2,
              )
            }>
            <Text style={styles.locationTitle}>{rowData.location}</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
          <MDIcon name={'location-city'} style={{fontSize: 20}} />
          <View style={{flex: 1, flexDirection: 'column'}}>
            <Text style={styles.addressText}>{rowData.address1}</Text>
            <Text style={styles.addressText}>{rowData.address2}</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <MDIcon name={'open-in-browser'} style={styles.locationIcon} />
          <TouchableOpacity onPress={() => this.openLink(rowData.link)}>
            <Text style={styles.addressText}>{rowData.linkTitle}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.devider} />
      </View>
    );
  };

  _changeLocation = (lat, long, locaiton, address1, address2) => {
    this.setState({
      latitude: lat,
      longitude: long,
      location: locaiton,
      address: address1 + address2,
    });
    const duration = 500;
    // this.marker._component.animateMarkerToCoordinate(
    //   {
    //     coordinate: new AnimatedRegion({
    //       latitude: lat,
    //       longitude: long,
    //     }),
    //   },
    //   duration,
    // );
  };

  render() {
    const {height} = Dimensions.get('window');
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.mainContainer}>
          <MapView
            style={{flex: 1}}
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
              onPress={() => {
                this.setState({
                  sheetIcon: 'keyboard-arrow-up',
                  sheetHeight: 330,
                });
                let that = this;
                setTimeout(function() {
                  that.Standard.open();
                }, 100);
              }}>
              <View style={styles.button}>
                <MDIcon style={styles.buttonIcon} name={'menu'} />
              </View>
            </TouchableOpacity>
          </View>
          <RBSheet
            ref={ref => {
              this.Standard = ref;
            }}
            closeOnDragDown={true}
            height={this.state.sheetHeight}>
            <View style={styles.bottomSheetContainer}>
              <Text style={styles.bottomSheetTitle}>Locations</Text>
              <View style={styles.topIconContainer}>
                <TouchableOpacity onPress={() => this._openSheetFull()}>
                  <MDIcon name={this.state.sheetIcon} style={{fontSize: 30}} />
                </TouchableOpacity>
              </View>
              <FlatList
                style={{flex: 1}}
                showsVerticalScrollIndicator={false}
                scrollEnabled={this.data.length > 2}
                data={this.state.dataSoure}
                renderItem={({item, index}) => this.renderRow(item)}
                keyExtractor={item => item.location.toString()}
              />
            </View>
          </RBSheet>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = {
  mainContainer: {
    flex: 1,
    flexDirection: 'column-reverse',
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
    margin: 15,
  },
  buttonIcon: {
    fontSize: 26,
    alignSelf: 'center',
    color: '#7a7a7a',
  },
  bottomSheetContainer: {flex: 1, paddingLeft: 20, paddingRight: 20},
  bottomSheetTitle: {fontSize: 24, textAlign: 'center'},
  locationContainer: {flex: 1, flexDirection: 'column', padding: 5},
  locationIcon: {fontSize: 20, alignSelf: 'center'},
  locationTitle: {paddingLeft: 15, fontSize: 22},
  addressText: {paddingLeft: 15, fontSize: 15},
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
};
