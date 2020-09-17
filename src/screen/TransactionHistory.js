import React, { Component } from 'react';
import { 
  View,
  Text,
  Image,
  TouchableOpacity,
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
} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScreenHeader } from '../widget/ScreenHeader';
import BottomNavigationTab from './../widget/BottomNavigationTab'
import { makeRequest } from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import ImageViewer from 'react-native-image-zoom-viewer';
import Moment from 'moment';

export default class TransactionHistory extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      data: this.data,
      expanded: false,
      selectedIndex: -1,
      visibleIamge: false,
      selectedImage: '',
      filteredData: [],
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  data = [
    {
      transactionDate: "2020-08-17T04:41:07.36",
      locaitonName: "Primary Location",
      type: "Transaction",
      transactionStatus: "Pending",
      points: "0",
      balance: 0.0,
      childMenus: [
        {
          name: "Total Spent",
          value: "$0.00"
        },
        {
          name: "Offer Name",
          value: "Offer"
        }
      ]
    },
    {
      transactionDate: "2020-08-15T08:13:03.36",
      locaitonName: "Primary Location",
      type: "Transaction",
      transactionStatus: "Pending",
      points: "11",
      balance: 0.0,
      childMenus: [
        {
          name: "Total Spent",
          value: "$11.00"
        }
      ]
    },
    {
      transactionDate: "2020-08-31T05:59:15",
      locaitonName: "Primary Location",
      type: "Receipt",
      transactionStatus: "Earned",
      points: "100",
      balance: null,
      childMenus: [
        {
          name: "Total Spent",
          value: "$10.00"
        },
        {
          name: "Images",
          value: [
            "https://testbucket1692019.s3.us-west-2.amazonaws.com/78b84a8c-7b9e-4c8c-82fd-3c9f9e32bf20/UserUpload/ReceiptUpload/da2ec6b6-8362-47ec-ada7-d4f59e8164ca/bfd70dd9-ffa7-4573-a9c8-3bf7cc29c9e83e2c030761c2928675fb3774ec1bd680.jpg"
          ]
        }
      ]
    },
    {
      transactionDate: "2020-08-31T06:00:37",
      locaitonName: "Primary Location",
      type: "Receipt",
      transactionStatus: "Earned",
      points: "100",
      balance: null,
      childMenus: [
        {
          name: "Total Spent",
          value: "$10.00"
        },
        {
          name: "Images",
          value: [
            "https://testbucket1692019.s3.us-west-2.amazonaws.com/78b84a8c-7b9e-4c8c-82fd-3c9f9e32bf20/UserUpload/ReceiptUpload/2199e86f-14fe-4ce2-bb3e-5391101336cf/c6f41cfe-6f73-42d6-87ee-a7e6bbf32a4a3e2c030761c2928675fb3774ec1bd680.jpg"
          ]
        }
      ]
    },
    {
      transactionDate: "2020-08-17T04:41:07.36",
      locaitonName: "Primary Location",
      type: "Transaction",
      transactionStatus: "Pending",
      points: "250",
      balance: 0.0,
      childMenus: [
        {
          name: "Total Spent",
          value: "$10.00"
        }
      ]
    },
    {
      transactionDate: "2020-08-10T05:13:54.833",
      locaitonName: "Primary Location",
      type: "Transaction",
      transactionStatus: "Reedemed",
      points: "-20",
      balance: 0.0,
      childMenus: [
        {
          name: "Total Spent",
          value: "$0.00"
        },
        {
          name: "Offer Name",
          value: "P(10)"
        }
      ]
    },
    {
      transactionDate: "2020-08-31T06:01:04",
      locaitonName: "Primary Location",
      type: "Receipt",
      transactionStatus: "Earned",
      points: "100",
      balance: null,
      childMenus: [
        {
          name: "Total Spent",
          value: "$10.00"
        },
        {
          name: "Images",
          value: [
            "https://testbucket1692019.s3.us-west-2.amazonaws.com/78b84a8c-7b9e-4c8c-82fd-3c9f9e32bf20/UserUpload/ReceiptUpload/cf582485-92d9-40ac-a8c8-f6fdb0678097/7db2c28d-b177-412e-b1e9-bab4f19a68af1.jpg",
            "https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616__340.jpg",
            "https://i.pinimg.com/originals/79/27/f9/7927f976b17065d627f94c0e125ac79c.jpg",
            "data:image/jpeg;base64,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",
            "https://www.popsci.com/resizer/QgEMm6gNVXFYEFCmonq-Tp9_D7g=/760x506/cloudfront-us-east-1.images.arcpublishing.com/bonnier/3NIEQB3SFVCMNHH6MHZ42FO6PA.jpg",
            "https://img.freepik.com/free-photo/modern-futuristic-neon-light-background_33739-414.jpg?size=626&ext=jpg",
          ]
        },
      ]
    }
  ]

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({
        data: this.data,
        expanded: false,
        selectedIndex: -1,
        visibleIamge: false,
        selectedImage: '',
        filteredData: [],
      })
      this._getStoredData();
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  _getStoredData = async () => {
    this.setState({ isLoading: true });
    try {
      await AsyncStorage.getItem('reedemablePoints', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          if (value) {
            this.setState({
              isLoading: true,
              userPoint: value,
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
              webformID: value,
            })
          }
        }
      });

      await AsyncStorage.getItem('userID', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          //const val = JSON.parse(value);
          if (value) {
            this.setState({
              userID: value,
            }, () => this._callTransactionHistory())
          }
        }
      });
    } catch (error) {
      console.log(error)
    }
  };

  _callTransactionHistory = () => {
    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.GET_TRANSACTION_HISTORY}?RewardProgramId=${APIConstant.RPID}&ContactID=${this.state.userID}`,
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
        <View style={{ width: '100%', height: 1, backgroundColor: 'grey', marginVertical: 5 }} />
        {item.childMenus.map((menu) => {
          if (menu.name == 'Images' && menu.value.length > 0) {
            return (
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row' }}>
                  <MDIcon style={styles.rowItemIcon} name={'image'} />
                  <Text style={styles.rowTitle}>{menu.name}</Text>
                </View>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}>
                  <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                    {menu.value.map(image => {
                      return (
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({ visibleIamge: true, selectedImage: image })
                            }}>
                            <Image
                              style={{ height: 70, width: 70, marginHorizontal: 5, borderRadius: 5 }}
                              source={{
                                uri: image
                              }}
                            />
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
          } else {
            return (
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <MDIcon style={styles.rowItemIcon} name={'list'} />
                <Text style={styles.rowTitle}>{menu.name}:</Text>
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
          activeOpacity={0.8}
          onPress={() => this.setState({ search: '' })}>
          <MDIcon name={'close'} style={{ fontSize: 24 }} />
        </TouchableOpacity>
      )
    }
  }

  _filterHistory = (text) => {
    const filteredAssets = this.state.data.filter(history => history.transactionDate.toLowerCase().indexOf(text.toLowerCase()) !== -1 || history.locaitonName.toLowerCase().indexOf(text.toLowerCase()) !== -1 || history.points.toLowerCase().indexOf(text.toLowerCase()) !== -1 || history.type.toLowerCase().indexOf(text.toLowerCase()) !== -1 || history.transactionStatus.toLowerCase().indexOf(text.toLowerCase()) !== -1);
    this.setState({
      filteredData: filteredAssets
    });
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <ScreenHeader
          title={'Transaction History'}
          userPoint={this.state.userPoint} />
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
        <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginTop: 10, marginHorizontal: 15, borderWidth: 2, borderRadius: 5, borderColor: 'rgba(153,153,153,1)', alignItems: 'center'}}>
          <MDIcon name={'search'} style={{ fontSize: 24 }} />
          <TextInput
            placeholder="Location Name"
            style={{ flex: 1 }}
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
          scrollEnabled={this.data.length > 3}
          data={ this.state.search ? this.state.filteredData : this.data}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                this.setState({
                  selectedIndex: this.state.selectedIndex == index ? -1 : index
                })
              }}>
              <Animated.View
                style={[
                  styles.rowContainer,
                  {
                    backgroundColor:
                      index % 2 ? 'rgba(153,153,153,0.3)' : 'white',
                    justifyContent: 'flex-end'
                  },
                ]}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <MDIcon style={styles.rowItemIcon} name={'date-range'} />
                  <Text style={styles.rowTitle}>Date:</Text>
                  <Text style={[styles.rowItemtext, { color: 'red' }]}>
                    {Moment(item.transactionDate).format('DD MMM YYYY')}
                  </Text>
                </View>

                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <MDIcon style={styles.rowItemIcon} name={'location-on'} />
                  <Text style={styles.rowTitle}>Location:</Text>
                  <Text style={[styles.rowItemtext, { color: 'grey' }]}>
                    {item.locaitonName}
                  </Text>
                </View>

                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Icon name="gift" style={styles.rowItemIcon} size={20} />
                  <Text style={styles.rowTitle}>Point:</Text>
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
                  <Text style={styles.rowTitle}>Balance:</Text>
                  <Text style={[styles.rowItemtext, { color: 'gray' }]}>
                    {item.balance || 0}
                  </Text>
                </View>

                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <MDIcon style={styles.rowItemIcon} name={'style'} />
                  <Text style={styles.rowTitle}>Type:</Text>
                  <Text style={[styles.rowItemtext]}>
                    {item.type}
                  </Text>
                </View>

                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <MDIcon style={styles.rowItemIcon} name={'loop'} />
                  <Text style={styles.rowTitle}>Status:</Text>
                  <Text style={[styles.rowItemtext]}>
                    {item.transactionStatus}
                  </Text>
                </View>
                {this.state.selectedIndex == index && this._renderChieldMenus(item)}
                <MDIcon style={{ alignSelf: 'flex-end', fontSize: 25, position: 'absolute' }} name={this.state.selectedIndex == index ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} />
              </Animated.View>
            </TouchableOpacity>
          )}
        />
        <BottomNavigationTab navigation={this.props.navigation} />
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
  rowContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 7,
    paddingBottom: 7,
  },
  rowItemIcon: { alignSelf: 'center', fontSize: 20 },
  rowTitle: {
    paddingLeft: 7,
    fontSize: 18,
    fontWeight: 'bold',
  },
  rowItemtext: {
    paddingLeft: 15,
    fontSize: 18,
  },
  footerContainer: {
    height: 50,
    padding: 5,
    backgroundColor: 'red',
    alignItem: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  footerMenuItem: {
    marginLeft: 5,
    marginRight: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    tintColor: 'white',
  },
  footerMenuItemImage: {
    height: 20,
    width: 20,
    tintColor: 'white',
  },
  footerMenuSelectedItem: {
    height: 24,
    width: 24,
    tintColor: 'white',
  },
  footerMenuIdelItem: {
    height: 18,
    width: 18,
    tintColor: 'white',
  },
  footerMenuSelectedItemText: {
    color: 'white',
    fontSize: 11,
  },
  footerMenuIdelItemText: {
    color: 'white',
    fontSize: 10,
  },
};
