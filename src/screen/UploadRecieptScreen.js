import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  // TouchableNativeFeedback,
  Alert,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import { makeRequest } from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import { ScreenHeader } from '../widget/ScreenHeader';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-root-toast';
import TextInput from 'react-native-textinput-with-icons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import BottomNavigationTab from './../widget/BottomNavigationTab';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import LoadingScreen from '../widget/LoadingScreen';
import GlobalAppModel from '../model/GlobalAppModel';
var loadingImage = '';
const maxWidth = Dimensions.get('window').width;
const imageHeight = (maxWidth / 16) * 9;

export default class UploadReceiptScreen extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      dateDetails: {},
      categories: [],
      settingsDetails: {},
      selectedImages: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      loadingImage = GlobalAppModel.getLoadingImage();
      this._callGetUploadReceiptScreenData()
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }


  _showToast = message => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  }

  _callGetUploadReceiptScreenData = () => {
    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.GET_UPLOAD_RECEIPT_SCREEN_DATA}?RewardProgramID=${GlobalAppModel.rewardProgramId}&WebFormID=${GlobalAppModel.webFormID}`,
      'get',
    )
      .then(response => {
        //console.log(JSON.stringify(response));
        this.setState({ isLoading: false });
        if (response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          var selectedCategory = '';
          var selectedLocation = '';

          if (response.responsedata.categories && response.responsedata.categories.length == 1) {
            selectedCategory = response.responsedata.categories[0].id;
            if (response.responsedata.categories[0].addresses.lenght == 1) {
              selectedLocation = response.responsedata.categories[0].addresses[0].addressID
            }
          }
          this.setState({
            dateDetails: response.responsedata.dateDetails || {},
            categories: response.responsedata.categories || [],
            settingsDetails: response.responsedata.settingsDetails || {},
            selectedLocation: selectedLocation,
            selectedCategory: selectedCategory
          });
        }
      })
      .catch(error => console.log('error : ' + error));
  }

  _prepareForm = () => {
    var isCall = true;
    if (this.state.settingsDetails.isShowURSubTotalBeforeTax) {
      if (this.state.subTotal) {
        this.setState({
          subTotalError: ``
        });
      } else {
        this.setState({
          subTotalError: `Please enter ${this.state.settingsDetails.urSubTotalBeforeTax || 'Sub total before text'}`
        });
        isCall = false;
      }
    }

    if (this.state.settingsDetails.isShowURReceiptType) {
      if (!(this.state.selectedCategory)) {
        isCall = false;
        this._showToast(`Please select ${this.state.settingsDetails.urReceiptType || 'Receipt type'}`)
      }
    }

    if (this.state.settingsDetails.isShowURPrimaryLocation) {
      if (!(this.state.selectedLocation)) {
        isCall = false;
        this._showToast(`Please select ${this.state.settingsDetails.urPrimaryLocation || 'Location'}`)
      }
    }

    if (this.state.settingsDetails.isShowURReceiptDate) {
      if (this.state.receiptDate) {
        const today = new Date().getTime();
        const selectedDate = new Date(this.state.receiptDate).getTime();
        var limit = this.state.dateDetails.receiptsCount;

        if (this.state.dateDetails.receiptsCountType.toLowerCase() == 'month') {
          limit = this.state.dateDetails.receiptsCount * 30;
        } else if (this.state.dateDetails.receiptsCountType.toLowerCase() == 'week') {
          limit = this.state.dateDetails.receiptsCount * 7;
        }
        const dateDiff = (today - selectedDate) / (1000 * 3600 * 24);

        if (dateDiff > limit) {
          isCall = false;
          this._showToast(`Date must be lessthen ${this.state.dateDetails.receiptsCount} ${this.state.dateDetails.receiptsCountType}`)
        }
      } else {
        isCall = false;
        this._showToast(`Please select ${this.state.settingsDetails.urReceiptDate || 'Receipt Date'}`)
      }
    }

    if (this.state.settingsDetails.isShowURReceiptNumber) {
      if (this.state.receiptNumber) {
        this.setState({
          receiptNumberError: ``
        });
      } else {
        this.setState({
          receiptNumberError: `Please enter ${this.state.settingsDetails.urReceiptNumber || 'Receipt Number'}`
        });
        isCall = false;
      }
    }

    if (this.state.selectedImages.length == 0) {
      isCall = false;
      this._showToast('Please select atlist one image to upload receipt')
    }

    if (isCall) {
      this._callUploadReceiptData(true);
      // this.setState({ isProcessing: true })
    }
  }

  _callUploadReceiptData = isCheckStatusCode => {
    this.setState({ isProcessing: true })
    const request = {
      contactID: GlobalAppModel.userID,
      rewardProgramID: GlobalAppModel.rewardProgramId,
      addressID: this.state.selectedLocation || '',
      receiptCategoryID: this.state.selectedCategory || '',
      amount: this.state.subTotal || 0,
      receiptDate: this.state.receiptDate || '',
      receiptNumber: this.state.receiptNumber || '',
      checkStatusCode5: isCheckStatusCode
    };

    console.log(`Reqeust : ${JSON.stringify(request)}`)

    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.UPLOAD_RECEIPT_DATA}`,
      'post',
      request,
    )
      .then(response => {
        console.log(JSON.stringify(response));
        this.setState({ isLoading: false });
        if (response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else if (response.statusCode == 5) {
          Alert.alert('Oppss...', response.statusMessage, [
            {
              text: 'okay',
              onPress: () => this._callUploadReceiptData(false),
            }
          ]);
        } else {
          this._callUploadReceiptImage(response.responsedata.receiptUploadID)
        }
      })
      .catch(error => console.log('error : ' + error));
  }

  _callUploadReceiptImage = uploadId => {
    const data = new FormData();

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data;'
    }

    this.state.selectedImages.map((image, index) => {
      data.append("files", {
        name: `${GlobalAppModel.userID}_${new Date().getTime()}_${index}`,
        type: 'ímage/jpeg',
        uri:
          Platform.OS === "android" ? image : image.replace("file://", "")
      });
    })

    data.append('RewardProgramID', GlobalAppModel.rewardProgramId);
    data.append('ReceiptUploadID', uploadId);

    makeRequest(
      APIConstant.BASE_URL + APIConstant.UPLOAD_RECEIPT_IMAGE,
      'post',
      data
    ).then(response => {
      console.log(`response ${response}`)
      this.setState({ isProcessing: false })
      if (response.statusCode == 0) {
        Alert.alert('Oppss...', response.statusMessage);
      } else {
        Alert.alert('Sucess', response.statusMessage);
        this.setState({
          receiptNumber: '',
          subTotal: '',
          selectedCategory: '',
          selectedLocation: '',
          receiptDate: '',
          selectedImages: [],
        })
      }
    }).catch(error => {
      console.log('error: ' + error)
      Alert.alert('Oppss...', 'Something went wrong.');
      this.setState({ isProcessing: false });
    });
  }

  _renderSubTotal = () => {
    if (this.state.settingsDetails.isShowURSubTotalBeforeTax) {
      return (
        <TextInput
          label={this.state.settingsDetails.urSubTotalBeforeTax || 'Subtotal before tax'}
          leftIcon="credit-card"
          leftIconSize={20}
          containerWidth={300}
          leftIconType="material"
          selectionColor={'gray'}
          labelActiveColor={'#012345'}
          labelColor={'gray'}
          underlineColor={'gray'}
          rightIconColor={'gray'}
          color={'gray'}
          leftIconColor={'gray'}
          rippleColor="rgba(255,255,255,70)"
          activeColor={'#012345'}
          keyboardType={'numeric'}
          value={this.state.subTotal}
          error={this.state.subTotalError}
          onChangeText={text => {
            this.setState({
              subTotal: text
            });
          }} />)
    }
  }

  _renderReceiptNumber = () => {
    if (this.state.settingsDetails.isShowURReceiptNumber) {
      return (
        <TextInput
          label={this.state.settingsDetails.urReceiptNumber || 'Receipt number'}
          leftIcon="receipt"
          leftIconSize={20}
          containerWidth={300}
          leftIconType="material"
          selectionColor={'gray'}
          labelActiveColor={'#012345'}
          labelColor={'gray'}
          underlineColor={'gray'}
          rightIconColor={'gray'}
          color={'gray'}
          leftIconColor={'gray'}
          rippleColor="rgba(255,255,255,70)"
          activeColor={'#012345'}
          value={this.state.receiptNumber}
          error={this.state.receiptNumberError}
          onChangeText={text => {
            this.setState({
              receiptNumber: text
            });
          }} />
      );
    }
  };

  _renderLabel = (value, label) => {
    if (value) {
      return (
        <Text style={{ marginLeft: 26, color: 'gray', fontSize: 14, marginBottom: -8 }}>{label}</Text>
      )
    }
  }

  _renderReceiptCategory = () => {
    if (this.state.settingsDetails.isShowURReceiptType) {
      return (
        <View style={{ width: 300 }}>
          <SectionedMultiSelect
            items={this.state.categories}
            uniqueKey="id"
            //selectText="Choose some things..."
            renderSelectText={() => {
              var title = this.state.settingsDetails.urReceiptType || 'Receipt Category';
              if (this.state.selectedCategory) {
                this.state.categories.map(i => {
                  if (i.id === this.state.selectedCategory) {
                    title = i.name;
                  }
                })
              }
              return (
                <View style={{ marginLeft: -10, marginTop: -10, flex: 1 }}>
                  {this._renderLabel(this.state.selectedCategory, this.state.settingsDetails.urReceiptType || 'Receipt Category')}
                  <View style={{ flexDirection: 'row', flex: 1, marginVertical: 5, marginTop: 10 }}>
                    <MDIcon name={'list'} style={{ fontSize: 24, color: 'gray', marginRight: 10, }} />
                    <Text style={{ color: 'gray', flex: 1, fontSize: 16 }}>{title}</Text>
                  </View>
                </View>
              )
            }}
            showChips={true}
            single={true}
            selectToggleIconComponent={() => {
              return <MDIcon name={'keyboard-arrow-down'} style={{ fontSize: 24, color: 'gray' }} />
            }}
            selectedIconComponent={() => {
              return (<MDIcon name={'check'} style={{ fontSize: 20, color: 'black', marginRight: 10, }} />);
            }}
            onSelectedItemsChange={(selectedItem) => {
              this.setState({
                selectedCategory: selectedItem[0],
                selectedLocation: '',
              });
            }}
            selectedItems={[this.state.selectedCategory]}
          />
          <View style={{ height: 1, backgroundColor: 'gray', marginTop: -25, marginBottom: 10 }} />
        </View>
      )
    }
  }

  _renderLocation = () => {
    if (this.state.settingsDetails.isShowURPrimaryLocation) {
      var item = [];
      this.state.categories.map(cat => {
        if (cat.id == this.state.selectedCategory) {
          cat.addresses.map(location => {
            var it = {
              id: location.addressID,
              name: location.locationName
            }
            item.push(it);
          })
        }
      });
      return (
        <View style={{ width: 300 }}>
          <SectionedMultiSelect
            items={item}
            uniqueKey="id"
            renderSelectText={() => {
              var title = this.state.settingsDetails.urPrimaryLocation || 'Primary Location';
              if (this.state.selectedLocation) {
                item.map(i => {
                  if (i.id === this.state.selectedLocation) {
                    title = i.name;
                  }
                })
              }
              return (
                <View style={{ marginLeft: -10, marginTop: -10, flex: 1 }}>
                  {this._renderLabel(this.state.selectedLocation, this.state.settingsDetails.urPrimaryLocation || 'Primary Location')}
                  <View style={{ flexDirection: 'row', flex: 1, marginVertical: 5, marginTop: 10 }}>
                    <MDIcon name={'place'} style={{ fontSize: 24, color: 'gray', marginRight: 10, }} />
                    <Text style={{ color: 'gray', flex: 1, fontSize: 16 }}>{title}</Text>
                  </View>
                </View>
              )
            }}
            showChips={true}
            single={true}
            selectToggleIconComponent={() => {
              return <MDIcon name={'keyboard-arrow-down'} style={{ fontSize: 24, color: 'gray' }} />
            }}
            selectedIconComponent={() => {
              return (<MDIcon name={'check'} style={{ fontSize: 20, color: 'black', marginRight: 10, }} />);
            }}
            onSelectedItemsChange={(selectedItem) => {
              this.setState({
                selectedLocation: selectedItem[0],
              })
            }}
            selectedItems={[this.state.selectedLocation]}
          />
          <View style={{ height: 1, backgroundColor: 'gray', marginTop: -25, marginBottom: 10 }} />
        </View>
      )
    }
  }

  _renderReceiptDate = () => {
    if (this.state.settingsDetails.isShowURReceiptDate) {
      return (
        <View style={{ width: 300, flexDirection: 'column', marginTop: 5, marginBottom: 5 }}>
          {this._renderLabel(this.state.receiptDate, this.state.settingsDetails.urReceiptDate || 'Receipt Date')}
          <DatePicker
            date={this.state.receiptDate}
            mode="date"
            placeholder={this.state.settingsDetails.urReceiptDate || "select date"}
            format="YYYY-MM-DD"
            maxDate={new Date()}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            iconComponent={<MDIcon name={'date-range'} style={{ fontSize: 22, color: 'gray', marginRight: 10 }} />}
            customStyles={{
              placeholderText: {
                fontSize: 15,
                color: 'gray'
              },
              dateText: {
                fontSize: 17,
                color: 'gray'
              }
            }}
            onDateChange={(date) => {
              this.setState({
                receiptDate: date
              })
            }}
          />
          <View style={{ height: 1, backgroundColor: 'gray' }} />
        </View>
      );
    }
  }

  _renderButton = () => {
    if (this.state.isProcessing) {
      return <ActivityIndicator size={'large'} style={{ margin: 20 }} />
    } else {
      return (
        <TouchableOpacity
          underlayColor="#030a91"
          activeOpacity={0.8}
          style={styles.button}
          onPress={() => this._prepareForm()}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      );
    }
  }

  _handleImageClick = index => {
    if (Platform.OS === 'ios') {
      Alert.alert(
        "Image pick",
        "You can select image from your storage or you can capture image using camera...",
        [
          {
            text: "Open Picker",
            onPress: () => {
              ImageCropPicker.openPicker({
                // width: 300,
                // height: 400,
                cropping: true
              }).then(image => {
                console.log("imagr picker " + JSON.stringify(image));
                const images = this.state.selectedImages;
                // images[index] = `file://${Image.path}`
                images[index] = Platform == 'ios' ? `~/${Image.path}` : `file://${image.path}`,
                  this.setState({
                    selectedImages: images,
                  })
              });
            },
          },
          {
            text: "Open camera", onPress: () => {
              ImageCropPicker.openCamera({
                // width: 300,
                // height: 400,
                cropping: true,
              }).then(image => {
                console.log("from camera " + JSON.stringify(image));
                const images = this.state.selectedImages;
                // images[index] = `file://${Image.path}`
                images[index] = Platform == 'ios' ? `~/${image.path}` : `file://${image.path}`,
                  this.setState({
                    selectedImages: images,
                  })
              });
            },
          }
        ],
        { cancelable: false }
      );
    } else {
      const options = {
        title: 'Select Profile Image',
        storageOptions: {
          path: 'images',
        },
      };
      ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const images = this.state.selectedImages;
          // images[index] = `file://${response.path}`
          images[index] = Platform == 'ios' ? `~/${response.path}` : `file://${response.path}`,
            this.setState({
              selectedImages: images,
            })
        }
      });
    }
  }

  _renderImage = (index) => {
    if (this.state.selectedImages.length > index) {
      return (
        <View style={{ backgroundColor: 'rgba(153,153,153,0.3)', padding: 5, height: 100, width: 100, margin: 5, borderRadius: 10 }}>
          <Image
            source={{
              uri: this.state.selectedImages[index]
            }}
            style={{ height: '100%', width: '100%', borderRadius: 5 }}
          />
        </View>
      )
    } else {
      return (
        <TouchableOpacity
          // <TouchableNativeFeedback
          activeOpacity={0.8}
          onPress={() => {
            this._handleImageClick(index)
          }}>
          <View style={{ backgroundColor: 'rgba(153,153,153,0.3)', padding: 10, height: 100, width: 100, margin: 5, borderRadius: 10, justifyContent: 'center' }}>
            <Image
              source={{
                uri: 'https://image.flaticon.com/icons/png/128/2089/2089588.png'
              }}
              style={{ height: 40, width: 40, alignSelf: 'center' }} />
          </View>
          {/* </TouchableNativeFeedback> */}
        </TouchableOpacity>
      )
    }
  }

  _renderBody = () => {
    if (this.state.isLoading) {
      return <LoadingScreen LoadingImage={loadingImage} />
    } else {
      return (
        <ScrollView
          keyboardShouldPersistTaps={true}>
          <View style={{ flexDirection: 'column' }}>
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
            <View style={{ flexDirection: 'column', alignItems: 'center', paddingTop: 10 }}>
              {this._renderSubTotal()}
              {this._renderReceiptCategory()}
              {this._renderLocation()}
              {this._renderReceiptDate()}
              {this._renderReceiptNumber()}
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                {this._renderImage(0)}
                {this._renderImage(1)}
                {this._renderImage(2)}
              </View>
              {this._renderButton()}
            </View>
          </View>
        </ScrollView>
      );
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContainer}>
          <ScreenHeader
            navigation={this.props.navigation}
            title={'Upload Receipt'}
            userPoint={GlobalAppModel.redeemablePoint} />
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
    backgroundColor: 'rgba(153,153,153,0.2)',
  },
  imageOverlay: {
    height: imageHeight,
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  button: {
    minWidth: 120,
    marginVertical: 15,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: GlobalAppModel.primaryButtonColor || '#012345',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    margin: 8,
    marginHorizontal: 15
  }
};