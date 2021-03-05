import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  AsyncStorage,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
  Modal,
  TextInput,
  Animated,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScreenHeader } from '../widget/ScreenHeader';
import BottomNavigationTab from './../widget/BottomNavigationTab'
import { makeRequest } from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import ImageViewer from 'react-native-image-zoom-viewer';
import Moment from 'moment';
import ImageLoader from './../widget/ImageLoader';
// import {
//   // TouchableNativeFeedback, 
//   TouchableOpacity
// } from 'react-native-gesture-handler';
import GlobalAppModel from '../model/GlobalAppModel';
import LoadingScreen from '../widget/LoadingScreen';
var loadingImage = '';
const maxWidth = Dimensions.get('window').width;
const imageHeight = (maxWidth / 16) * 9;
export default class TransactionHistory extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      data: [],
      expanded: false,
      selectedIndex: -1,
      visibleIamge: false,
      selectedImage: '',
      filteredData: [],
      isLoading: true,
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({
        data: [],
        isLoading: true,
        expanded: false,
        selectedIndex: -1,
        visibleIamge: false,
        selectedImage: '',
        filteredData: [],
      })
      loadingImage = GlobalAppModel.getLoadingImage();
      this._callTransactionHistory()
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  _callTransactionHistory = () => {
    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.GET_TRANSACTION_HISTORY}?RewardProgramId=${GlobalAppModel.rewardProgramId}&ContactID=${GlobalAppModel.userID}`,
      'get',
    )
      .then(response => {
        this.setState({ isLoading: false });
        if (response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          this.setState({
            data: response.responsedata
          });
          console.log(`response`)
        }
      })
      .catch(error => console.log('error : ' + error));
  }

  onClick = (index) => {
    const temp = this.state.data.slice()
    temp[index].value = !temp[index].value
    this.setState({ data: temp })
  }

  toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: !this.state.expanded })
  }

  _renderChieldMenus = item => {
    return (
      <View style={{ flexDirection: 'column' }}>
        {item.childMenus.map((menu) => {
          if (menu.name == 'Images' && menu.value.length > 0) {
            return (
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row' }}>
                  <MDIcon style={styles.rowItemIcon} name={'image'} />
                  <Text style={styles.rowChildTitle}>{menu.name}</Text>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}>
                  <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                    {menu.value.map(image => {
                      return (
                        <View>
                          {/* <TouchableNativeFeedback */}
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                              console.log('btn 2 call')
                              this.setState({ visibleIamge: true, selectedImage: image })
                            }}>
                            <ImageLoader
                              src={image}
                              avatarName={'image'}
                              style={{ height: 70, width: 70, marginRight: 10, borderRadius: 5 }} />
                            {/* </TouchableNativeFeedback> */}
                          </TouchableOpacity>
                          <Modal visible={this.state.visibleIamge && this.state.selectedImage == image} transparent={true}>
                            <ImageViewer
                              animationType="fade"
                              backgroundColor="rgba(0,0,0,0.8)"
                              renderIndicator={() => null}
                              renderHeader={() => (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    paddingTop: 30,
                                    paddingRight: 30,
                                  }}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.setState({ visibleIamge: false, selectedImage: '' });
                                    }}>
                                    <MDIcon
                                      style={{ fontSize: 30, color: 'white', marginLeft: 15 }}
                                      name={'close'}
                                    />
                                  </TouchableOpacity>
                                </View>
                              )}
                              enableSwipeDown={true}
                              onSwipeDown={() => {
                                this.setState({ visibleIamge: false, selectedImage: '' });
                              }}

                              imageUrls={[
                                {
                                  url: image,
                                },
                              ]}
                            />
                          </Modal>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            )
          } else if (menu.name != 'Images') {
            return (
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <MDIcon style={styles.rowItemIcon} name={'list'} />
                <Text style={styles.rowChildTitle}>{menu.name}:</Text>
                <Text style={[styles.rowItemtext]}>
                  {menu.value}
                </Text>
              </View>
            )
          }
        })}
      </View>
    )
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

  _filterHistory = (text) => {
    const filteredAssets = this.state.data.filter(history => Moment(history.transactionDate).format('DD MMM YYYY').toLowerCase().indexOf(text.toLowerCase()) !== -1 || history.locationName.toLowerCase().indexOf(text.toLowerCase()) !== -1 || history.points.toLowerCase().indexOf(text.toLowerCase()) !== -1 || history.type.toLowerCase().indexOf(text.toLowerCase()) !== -1 || history.transactionStatus.toLowerCase().indexOf(text.toLowerCase()) !== -1);
    this.setState({
      filteredData: filteredAssets
    });
  }

  _renderBody = () => {
    if (this.state.isLoading) {
      return <LoadingScreen LoadingImage={loadingImage} />
    } else {
      return (
        <>
          <View style={{ hegith: imageHeight }}>
            <Image
              style={{ height: imageHeight  }}
              source={{
                uri:
                  APIConstant.HEADER_IMAGE,
              }}
              resizeMode="cover"
            />
          </View>
          <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 10, marginTop: 10, marginHorizontal: 15, borderWidth: 2, borderRadius: 5, borderColor: 'rgba(153,153,153,1)', alignItems: 'center' }}>
            <MDIcon name={'search'} style={{ fontSize: 24 }} />
            <TextInput
              placeholder="Location Name"
              style={{ flex: 1, }}
              value={this.state.search}
              onChangeText={(text) => {
                this.setState({
                  search: text
                });
                this._filterHistory(text)
              }} />
            {this._renderClearSearch()}
          </View>

          <FlatList
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            ListEmptyComponent={() => {
              return (<View style={{ flex: 1, height: '100%', alignContent: 'center', justifyContent: 'center', }}>
                <Text style={{ fontSize: 24, alignSelf: 'center', marginTop:'20%' }}>No Transaction Found</Text>
              </View>)
            }}
            data={this.state.search ? this.state.filteredData : this.state.data}
            renderItem={({ item, index }) => (

              <Animated.View
                style={[
                  styles.rowContainer,
                  {
                    backgroundColor:
                      index % 2 ? 'rgba(153,153,153,0.2)' : 'white',
                    justifyContent: 'flex-end'
                  },
                ]}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <MDIcon style={styles.rowItemIcon} name={'date-range'} />
                  <Text style={styles.rowTitle}>Date: </Text>
                  <Text style={[styles.rowItemtext, { color: 'red' }]}>
                    {Moment(item.transactionDate).format('DD MMM YYYY')}
                  </Text>
                </View>

                {this.state.selectedIndex == index && <View style={{ flex: 1, flexDirection: 'row' }}>
                  <MDIcon style={styles.rowItemIcon} name={'location-on'} />
                  <Text style={styles.rowTitle}>Location: </Text>
                  <Text style={[styles.rowItemtext, { color: 'grey' }]}>
                    {item.locationName}
                  </Text>
                </View>}

                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Icon name="gift" style={[styles.rowItemIcon, { marginLeft: 1 }]} size={20} />
                  <Text style={styles.rowTitle}>Point: </Text>
                  <Text
                    style={[
                      styles.rowItemtext,
                      {
                        color: item.points == '0' ? 'grey' : item.points.indexOf('-') == -1 ? 'green' : 'red',
                      },
                    ]}>
                    {item.points.indexOf('-') == -1 && item.points != 0 ? `+${item.points}` : item.points}
                  </Text>
                </View>

                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <MDIcon style={styles.rowItemIcon} name={'credit-card'} />
                  <Text style={styles.rowTitle}>Balance: </Text>
                  <Text style={[styles.rowItemtext, { color: 'gray' }]}>
                    {item.balance || 0}
                  </Text>
                </View>

                {this.state.selectedIndex == index && <View style={{ flex: 1, flexDirection: 'row' }}>
                  <MDIcon style={styles.rowItemIcon} name={'style'} />
                  <Text style={styles.rowTitle}>Type: </Text>
                  <Text style={[styles.rowItemtext]}>
                    {item.type}
                  </Text>
                </View>}

                {this.state.selectedIndex == index && <View style={{ flex: 1, flexDirection: 'row' }}>
                  <MDIcon style={styles.rowItemIcon} name={'loop'} />
                  <Text style={styles.rowTitle}>Status: </Text>
                  <Text style={[styles.rowItemtext]}>
                    {item.transactionStatus}
                  </Text>
                </View>}
                {this.state.selectedIndex == index && (this._renderChieldMenus(item))}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    this.setState({
                      selectedIndex: this.state.selectedIndex == index ? -1 : index
                    })
                  }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'black', marginRight: 15 }} />
                    <MDIcon style={{ fontSize: 26, alignSelf: 'center' }} name={this.state.selectedIndex == index ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} />
                    <View style={{ flex: 1, height: 1, backgroundColor: 'black', marginLeft: 15 }} />
                  </View>
                </TouchableOpacity>
                {/*this.state.selectedIndex == index && this._renderChieldMenus(item)*/}
              </Animated.View>
            )}
          />
        </>
      )
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContainer}>
          <ScreenHeader
            title={'Transaction History'}
            userPoint={GlobalAppModel.redeemablePoint}
            navigation={this.props.navigation} />
          {this._renderBody()}
          <BottomNavigationTab navigation={this.props.navigation} />
        </View>
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
  imageOverlay: {
    height: 150,
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  rowContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 7,
    paddingBottom: 7,
  },
  rowItemIcon: {
    alignSelf: 'center',
    fontSize: 20,
    minWidth: 20,
    color:'grey'
  },
  rowTitle: {
    paddingLeft: 7,
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center'
    //width: 83,
  },
  rowChildTitle: {
    paddingLeft: 7,
    fontSize: 18,
    fontWeight: 'bold',
    //width: 83,
  },
  rowItemtext: {
    //paddingLeft: 15,
    fontSize: 18,
    alignSelf: 'center'
  },
});
