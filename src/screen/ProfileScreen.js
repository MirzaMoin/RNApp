import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  Picker,
  AsyncStorage,
  Alert,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import TextInput from 'react-native-textinput-with-icons';
import ModalDropdown from 'react-native-modal-dropdown';
import {makeRequest} from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import { ActivityIndicator } from 'react-native';
import {isValidEmail, isValidPhoneNo} from './../utils/utility';
import DatePicker from 'react-native-datepicker'
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { MenuProvider } from 'react-native-popup-menu';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Toast from 'react-native-root-toast';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';
import ImageLoader from './../widget/ImageLoader';

const {width} = Dimensions.get('window')
const maxWidth = width - (width * 20 / 100)

export class ProfileScreen extends Component {
  constructor() {
    super();
    this.state = {
      webformID: '',
      isLoadingSignupform: true,
      webFromResponse: {},
      signup: {
        customData: {},
        additionalBirthDates: [],
      },
      signupError: {},
      customerror: {},
      isDisableEmailMenu: true,
      isDisableSMSMenu: true,
      isDisablePreferedMenu: true,
      additionalDates: [],
    };
    
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

  componentWillMount(){
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
              isLoadingSignupform: true,
              webformID: value,
            },() => this._callGetUserData())
          } else {
          }
        }
      });
    } catch (error) {
      // Error saving data
      console.log(error)
    }
  };

  _callGetUserData = () => {
    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.GET_CONTACT_DATA}?RewardProgramID=78b84a8c-7b9e-4c8c-82fd-3c9f9e32bf20&ContactId=${this.state.userID}`,
      'get',
    )
      .then(response => {
        //console.log(JSON.stringify(response));
        //this.setState({isLoadingForgot: false, isTimer: true});
        if(response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          const {contactData} = response.responsedata;
          const request ={
            profileImage: contactData.profilePitcure,
            contactID: contactData.contactID,
            isEmailOptinConfirm: contactData.isEmailOptinConfirm,
            signUpType: contactData.signUpType,
            useOfferID: contactData.useOfferID,
            smsProvider: contactData.smsProvider,
            totalRequiredField: contactData.totalRequiredField,
            isSMSOptinConfirm: contactData.isSMSOptinConfirm,
            firstName: contactData.firstName,
            lastName: contactData.lastName,
            address: contactData.address,
            city: contactData.city,
            state: contactData.state,
            postalcode: contactData.zipCode,
            gender: contactData.gender,
            mobile: contactData.mobilePhone,
            email: contactData.emailAddress,
            emailFormat: contactData.emailFormat,
            birthdate: contactData.birthDate,
            anniversary: contactData.anniversary,
            allowedEmail: contactData.isAllowEmail,
            allowedSMS: contactData.isAllowSMS,
            isAllowPostalMail: contactData.isAllowPostalMail,
            preferedMedia: contactData.preferedMedia,
            password: contactData.password,
            confirmPassword: contactData.confirmPassword,
            memberCardID: contactData.memberCardID,
            driverLicense: contactData.driverLicense,
            location: contactData.addressID,
            rewardProgramIDNew: '78b84a8c-7b9e-4c8c-82fd-3c9f9e32bf20',
            address2: contactData.address2,
            address3: contactData.address3,
            isAllowPush: true,
            webFormID: this.state.webformID,
            customData: contactData.customFiledsValue ? JSON.parse(contactData.customFiledsValue) : [],
            contactListID: contactData.contactListID,
            additionalBirthDates: contactData.additionalBirthDates ? JSON.parse(contactData.additionalBirthDates) : [],
          }
          //console.log(JSON.stringify(request));
          this.setState({
            signup: request,
            contactData,
          });
          this._callWebFormData();
        }
      })
      .catch(error => console.log('error : ' + error));
  };

  _callWebFormData = () => {
    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.GET_WEBFORMFIELD_DATA}?RewardProgramID=78b84a8c-7b9e-4c8c-82fd-3c9f9e32bf20&WebFormId=${this.state.webformID}`,
      'get',
    )
      .then(response => {
        //console.log(JSON.stringify(response));
        //this.setState({isLoadingForgot: false, isTimer: true});
        if(response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          this.setState({
            isLoadingSignupform: false,
            webFromResponse: response.responsedata,
          })
          this._handleContactMenu();
        }
      })
      .catch(error => console.log('error : ' + error));
  };

  _requireFields = [
    'requiredonsignup',
    'required'
  ];
  _visibleFields = [
    ...this._requireFields,
    'notrequiredonsignup',
    'notrequired'
  ];

  // validating form
  _prepareForm = () => {
    const {fieldsData, customData, locationData} = this.state.webFromResponse;
    var isCall = true;
    var signupError = {};
    var customError = {};
    //debugger;
    if(this._requireFields.indexOf(fieldsData.memberCardIDRequired) > -1){
      if(this.state.signup.memberCardID){
        signupError = {
          ...signupError,
          memberCardID: '',
        }
      } else {
        signupError = {
          ...signupError,
          memberCardID: `Please enter ${fieldsData.memberCardIDLabel || 'Member Card ID'}`
        }
        isCall=false;
      }
    }

    if(this._requireFields.indexOf(fieldsData.driverLicenseRequired) > -1){
      if(this.state.signup.driverLicense){
        if((fieldsData.maxRange == null || fieldsData.minRange == null) || (this.state.signup.driverLicense.length >= fieldsData.minRange && this.state.signup.driverLicense.length <= fieldsData.maxRange)) {
          signupError= {
            ...signupError,
            driverLicense: '',
          };
        } else {
          signupError= {
            ...signupError,
            driverLicense: `${fieldsData.driverLicense || 'Driver License'} value must contain ${fieldsData.minRange} to ${fieldsData.maxRange} character`
          }
          isCall=false;
        }
      } else {
        signupError= {
          ...signupError,
          driverLicense: `Please enter ${fieldsData.driverLicense || 'Driver License'}`
        }
        isCall = false;
      }
    }

    if(this._requireFields.indexOf(fieldsData.firstNameRequired) > -1){
      if(this.state.signup.firstName){
        signupError= {
          ...signupError,
          firstName: '',
        }
      } else {
        signupError= {
          ...signupError,
          firstName: `Please enter ${fieldsData.firstNameLabel || 'First Name'}`
        }
        isCall=false;
      }
    }

    if(this._requireFields.indexOf(fieldsData.lastNameRequired) > -1){
      if(this.state.signup.lastName){
        signupError= {
          ...signupError,
          lastName: '',
        }
      } else {
        signupError = {
          ...signupError,
          lastName: `Please enter ${fieldsData.lastNameLabel || 'Last Name'}`
        }
        isCall=false;
      }
    }

    if(this._requireFields.indexOf(fieldsData.emailRequired) > -1 || this.state.signup.email.length > 0) {
      if(this.state.signup.email && isValidEmail(this.state.signup.email)){
        signupError= {
          ...signupError,
          email: '',
        }
      } else {
        signupError = {
          ...signupError,
          email: `Please enter ${fieldsData.emailLabel || 'Email'}`
        }
        isCall=false;
      }
    }

    if(this._requireFields.indexOf(fieldsData.mobileRequired) > -1 || this.state.signup.mobile){
      if(this.state.signup.mobile && isValidPhoneNo(this.state.signup.mobile)){
        signupError= {
          ...signupError,
          mobile: '',
        }
      } else {
        signupError= {
          ...signupError,
          mobile: `Please enter ${fieldsData.mobileLabel || 'Mobile'}`
        }
        isCall=false;
      }
    }

    if(this._requireFields.indexOf(fieldsData.collectEndUserAddressRequired) > -1){
      if(this.state.signup.address){
        signupError= {
          ...signupError,
          address: '',
        }
      } else {
        signupError= {
          ...signupError,
          address: `Please enter Address`
        }
        isCall=false;
      }

      if(this.state.signup.city){
        signupError= {
          ...signupError,
          city: '',
        }
      } else {
        signupError= {
          ...signupError,
          city: `Please enter City`
        }
        isCall=false;
      }

      if(this.state.signup.state){
        signupError= {
          ...signupError,
          state: '',
        }
      } else {
        signupError= {
          ...signupError,
          state: `Please enter State`
        }
        isCall=false;
      }

      if(this.state.signup.postalcode){
        signupError= {
          ...signupError,
          postalcode: '',
        }
      } else {
        signupError= {
          ...signupError,
          postalcode: `Please enter Postal Code`
        }
        isCall=false;
      }
    }
    
    if(this._requireFields.indexOf(fieldsData.address2required) > -1){
      if(this.state.signup.address2){
        signupError= {
          ...signupError,
          address2: '',
        }
      } else {
        signupError= {
          ...signupError,
          address2: `Please enter ${fieldsData.address2 || 'Address2'}`
        }
        isCall=false;
      }
    }

    if(this._requireFields.indexOf(fieldsData.address3required) > -1){
      if(this.state.signup.address3){
        signupError= {
          ...signupError,
          address3: '',
        }
      } else {
        signupError= {
          ...signupError,
          address3: `Please enter ${fieldsData.address3 || 'Address3'}`
        }
        isCall=false;
      }
    }

    this.setState({
      signupError: signupError,
    });

    if(this._requireFields.indexOf(fieldsData.profilePictureRequired) > -1){
      if(this.state.signup.profileImage == '' && !this.state.profileImageFile){
        this._showToast(`Please select ${fieldsData.profilePictureLabel || 'Profile Image'}`);
        return;
      }
    }

    if(this._requireFields.indexOf(fieldsData.myLocationRequired) > -1){
      if(!this.state.signup.location || this.state.signup.location === '' || this.state.signup.location === undefined){
        this._showToast(`Please select ${fieldsData.myLocationLabel || 'Location'}`);
        return;
      }
    }

    if(this._requireFields.indexOf(fieldsData.birthdateRequired) > -1){
      if(!this.state.signup.birthdate || this.state.signup.birthdate === '' || this.state.signup.birthdate === undefined){
        this._showToast(`Please select ${fieldsData.birthdateLabel || 'Birth Date'}`);
        return;
      }
    }

    if(this._requireFields.indexOf(fieldsData.anniversaryRequired) > -1){
      if(!this.state.signup.anniversary || this.state.signup.anniversary === '' || this.state.signup.anniversary === undefined){
        this._showToast(`Please select ${fieldsData.anniversaryLabel || 'Anniversary'}`);
        return;
      }
    }

    if(this._requireFields.indexOf(fieldsData.genderRequired) > -1){
      if(!this.state.signup.gender || this.state.signup.gender === '' || this.state.signup.gender === undefined){
        this._showToast(`Please select ${fieldsData.genderLabel || 'Gender'}`);
        return;
      }
    }

    if(this._requireFields.indexOf(fieldsData.tosAgreementRequired) > -1){
      if(!this.state.signup.isTOS){
        this._showToast(`Please check ${fieldsData.tosAgreement || 'Terms of Service'}`);
        return;
      }
    }

    if(this._requireFields.indexOf(fieldsData.additionalBirthdayRequired) > -1){
      if(!this.state.signup.additionalBirthDates || this.state.signup.additionalBirthDates.length == 0){
        this._showToast(`Please add ${fieldsData.additionalBirthdaysLabel || 'Addinal Birthday'}`);
        return;
      }
    }

    customData.map(field=>{
      if(this._requireFields.indexOf(field.requiredType) > -1 || this.state.signup.customData[field.customFieldID]){
        if(this.state.signup.customData[field.customFieldID]) {
          // hase value
          if(field.minLength > 0 && field.maxLength > 0){
            if(field.controlTypeID >= 1 && field.controlTypeID <= 3) {
              var value = this.state.signup.customData[field.customFieldID];
              if(value.length >= field.minLength && value.length <= field.maxLength) {
                customError= {
                  ...customError,
                  [field.customFieldID]: '',
                }
              } else {
                customError= {
                  ...customError,
                  [field.customFieldID]: `${field.fieldLabel} must contains ${field.minLength} to ${field.maxLength} charecter`,
                }
                isCall = false;
              }
            }
          } else {
            customError= {
              ...customError,
              [field.customFieldID]: '',
            }
          }
        } else {
          // not value
          if(field.controlTypeID >= 1 && field.controlTypeID <= 3) {
            customError= {
              ...customError,
              [field.customFieldID]: `Please Enter ${field.fieldLabel}`
            }
          } else {
            this._showToast(`Please select value of ${field.fieldLabel}`);
            isCall = false;
            return;
          }
          //console.log('custom value');
        }
      }
    });

    this.setState({
      customerror: customError,
    })

    if(isCall){
      // call signup API
      this.setState({
        isUpdatingProfile: true,
      })
      if (this.state.profileImageFile) {
        this._updateProfileImage();
      } else {
        this._callUpdateUserProfile(this.state.signup.profileImage)
      }
    } else {
      this._showToast(`Please Select all required values`);
    }
  };

  _updateProfileImage = () => {
    const data = new FormData();

    const headers= {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data;'    
    }

    const image = this.state.profileImageFile;

    data.append("ProfilePictureData", {
      name: `${this.state.userID}_${new Date().getTime()}`,
      type: image.mime,
      uri:
        Platform.OS === "android" ? image.path : image.path.replace("file://", "")
    });

    data.append('RewardProgramID',APIConstant.RPID);
    data.append('ContactID',this.state.userID);

    makeRequest(
      APIConstant.BASE_URL + APIConstant.UPLOAD_PROFILE_IMAGE,
      'post',
      data
    ).then(response => {
      //this.setState({isLoadingSignupform: false});
     if(response.statusCode == 0) {
        Alert.alert('Oppss...', response.statusMessage);
        this.setState({isUpdatingProfile: false,})
      } else {
        //this._storeSignupData(response.responsedata);
        this._callUpdateUserProfile(response.responsedata);
      }
    }).catch(error =>{
      console.log('error: '+error)
      Alert.alert('Oppss...', 'Something went wrong.');
      this.setState({isLoadingSignupform: false});
    });
  }

  _callUpdateUserProfile = userProfile => {
    const requrest = {
      contactID: this.state.userID,
      contactListID: this.state.signup.contactListID,
      firstName: this.state.signup.firstName,
      lastName: this.state.signup.lastName,
      address: this.state.signup.address,
      city: this.state.signup.city,
      state: this.state.signup.state,
      zipCode: this.state.signup.postalcode,
      gender: this.state.signup.gender,
      rootID: this.state.contactData.rootID,
      phone: this.state.contactData.phone,
      mobilePhone: this.state.signup.mobile,
      emailAddress: this.state.signup.email,
      emailFormat: this.state.contactData.emailFormat,
      confirmationStatus: this.state.contactData.confirmationStatus,
      activityStatus: this.state.contactData.activityStatus,
      customFiledsValue: JSON.stringify(this.state.signup.customData),
      birthDate: this.state.signup.birthdate,
      anniversary: this.state.signup.anniversary,
      pointBalance: this.state.contactData.pointBalance,
      totalSpent: this.state.contactData.totalSpent,
      lastVisitDate: this.state.contactData.lastVisitDate,
      familyMemberBDay: JSON.stringify(this.state.signup.AdditionalDate),
      overrideTriggerID: this.state.contactData.overrideTriggerID,
      isActive: this.state.contactData.isActive,
      isDelete: this.state.contactData.isDelete,
      createdBy: this.state.contactData.createdBy,
      modifiedBy: this.state.contactData.modifiedBy,
      createdDate: this.state.contactData.createdDate,
      modifiedDate: this.state.contactData.modifiedDate,
      subscribeKey: this.state.contactData.subscribeKey,
      subscribeDate: this.state.contactData.subscribeDate,
      isProfileComplete: this.state.contactData.isProfileComplete,
      additionalBirthDates: JSON.stringify(this.state.signup.additionalBirthDates),
      isAddToAutoresponder: this.state.contactData.isAddToAutoresponder,
      isAllowEmail: this.state.signup.allowedEmail,
      isAllowSMS: this.state.signup.allowedSMS,
      isAllowPostalMail: this.state.contactData.isAllowPostalMail,
      preferredMediaType: this.state.signup.preferedMedia,
      referelContactID: this.state.contactData.referelContactID,
      isOverrideSent: this.state.contactData.isOverrideSent,
      isFBUser: this.state.contactData.isFBUser,
      userName: this.state.contactData.userName,
      password: this.state.contactData.password,
      listJoinDate: this.state.contactData.listJoinDate,
      qualificationPoints: this.state.contactData.qualificationPoints,
      reedemablePoints: this.state.contactData.reedemablePoints,
      isAllowFacebookBonusPoints: this.state.contactData.isAllowFacebookBonusPoints,
      fbUserId: this.state.contactData.fbUserId,
      fbUserAccessToken: this.state.contactData.fbUserAccessToken,
      fbTokenExpirationDate: this.state.contactData.fbTokenExpirationDate,
      fbMessageIndex: this.state.contactData.fbMessageIndex,
      isThankYouEmailByWeForm: this.state.contactData.isThankYouEmailByWeForm,
      isImported: this.state.contactData.isImported,
      isAfterImportShowRPG: this.state.contactData.isAfterImportShowRPG,
      pointBalanceAtImport: this.state.contactData.pointBalanceAtImport,
      rqp: this.state.contactData.rqp,
      memberCardID: this.state.signup.memberCardID,
      vipLevel: this.state.contactData.vipLevel,
      contactLevelExpirationDigit: this.state.contactData.contactLevelExpirationDigit,
      contactLevelExpirationWord: this.state.contactLevelExpirationWord,
      contactLevelExpirationTotal: this.state.contactData.contactLevelExpirationTotal,
      vipMemberJoiningDate: this.state.contactData.vipMemberJoiningDate,
      isVIPLevelExpired: this.state.isVIPLevelExpired,
      sharedContactID: this.state.contactData.sharedContactID,
      isPrimaryContact: this.state.isPrimaryContact,
      isAfterReferDoAnyTx: this.state.contactData.isAfterReferDoAnyTx,
      vipLevelColour: this.state.contactData.vipLevelColour,
      driverLicense: this.state.signup.driverLicense,
      addressID: this.state.signup.location,
      lastSentRotateNumber: this.state.contactData.lastSentRotateNumber,
      smsConfirmationStatus: this.state.contactData.smsConfirmationStatus,
      limeOptionStatus: this.state.contactData.limeOptionStatus,
      hasReferredFriendJoined: this.state.contactData.hasReferredFriendJoined,
      isBirthdayDayEdited: this.state.contactData.isBirthdayDayEdited,
      isAnniversaryEdited: this.state.contactData.isAnniversaryEdited,
      isNoNeedToSetAutoresponder: this.state.contactData.isNoNeedToSetAutoresponder,
      signupType: this.state.contactData.signUpType,
      signUpWebform: this.state.contactData.signUpWebform,
      isOptOut: this.state.contactData.isOptOut,
      languageID: this.state.contactData.languageID,
      rewardProgramIDNew: APIConstant.RPID,
      profilePitcure: userProfile,
      address2: this.state.signup.address2,
      address3: this.state.signup.address3,
      leaderBoardName: this.state.contactData.leaderBoardName,
      profileCompletionPoints: this.state.contactData.profileCompletionPoints,
      isAddressVerify: this.state.contactData.isAddressVerify,
      isBeaconAppLogin: this.state.contactData.isBeaconAppLogin,
      vistaPassword: this.state.contactData.vistaPassword,
      isAllowPush: this.state.contactData.isAllowPush,
      gcmDeviceToken: this.state.contactData.gcmDeviceToken,
      deviceType: this.state.contactData.deviceType,
      hubSpotId: this.state.contactData.hubSpotId,
      amountSum: this.state.contactData.amountSum,
      fullName: this.state.contactData.fullName,
      country: this.state.signup.country,
      countryID: this.state.contactData.countryID,
      contactListPointValue: this.state.contactData.contactListPointValue,
      rewardProgramName: this.state.contactData.rewardProgramName,
      isMultiTieredRewardsType: this.state.contactData.isMultiTieredRewardsType,
      isPaidVIPRewardsType: this.state.contactData.isPaidVIPRewardsType,
      isAllowCheckInPoints: this.state.contactData.isAllowCheckInPoints,
      facebookReferralPoints: this.state.facebookReferralPoints,
      txCount: this.state.contactData.txCount
    }

    makeRequest(
      APIConstant.BASE_URL + APIConstant.UPDATE_USER_PROFILE,
      'post',
      requrest
    )
      .then(response => {
        this.setState({isUpdatingProfile: false,})
        if(response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          Alert.alert('Success', 'Profile Data Updated');
          this._storeUpdateData(userProfile);
        }
      })
      .catch(error =>{
        Alert.alert('Oppss...', 'Something went wrong.');
        this.setState({isLoadingSignupform: false});
      });
    
  }

  _storeUpdateData = async userProfile => {
    await AsyncStorage.setItem('firstName', this.state.signup.firstName);
    await AsyncStorage.setItem('lastName', this.state.signup.lastName);
    await AsyncStorage.setItem('emailAddress', this.state.signup.email);
    await AsyncStorage.setItem('profilePitcure', userProfile);
  }

  _handleImageClick = () => {
    
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
        ImageCropPicker.openCropper({
          path: `file://${response.path}`,
          width: 500,
          height: 500,
          cropping: true,
          cropperCircleOverlay: true,
        }).then(image => {
          console.log(image);
          this.setState({
            profileImagePath: image.path,
            profileImageFile: image,
          });
        });
        
      }
    });
  }

  _handleContactMenu = (isFromTextInput) => {
    var isAllowEmail = this.state.signup.allowedEmail || false;
    var isAllowSMS = this.state.signup.allowedSMS || false;
    var preferedMedia = this.state.signup.preferedMedia || 'SMS';
    var isDisableEmailMenu = true;
    var isDisableSMSMenu = true;
    var isDisablePreferedMenu = true;

    if (isValidPhoneNo(this.state.signup.mobile)) {
      if(isFromTextInput){
        isAllowSMS = true;
      }
      isDisableSMSMenu = false;
    } else {
      isAllowSMS = false;
      isDisableSMSMenu = true;
    }

    if (isValidEmail(this.state.signup.email)) {
      if(isFromTextInput) {
        isAllowEmail = true;
      }
      isDisableEmailMenu = false;
    } else {
      isAllowSMS = false;
      isDisableSMSMenu = true; 
    }

    if(isAllowEmail && isAllowSMS) {
      isDisablePreferedMenu = false;
    } else if (isAllowEmail) {
      isDisablePreferedMenu = true;
      preferedMedia = 'Email';
    } else if (isAllowSMS) {
      isDisablePreferedMenu = true;
      preferedMedia = 'SMS';
    } else {
      isDisablePreferedMenu = true;
      preferedMedia = 'SMS';
    }

    // setting value
    this.setState({
      isDisableEmailMenu: isDisableEmailMenu,
      isDisableSMSMenu: isDisableSMSMenu,
      isDisablePreferedMenu: isDisablePreferedMenu,
      signup: {
        ...this.state.signup,
        allowedEmail: isAllowEmail,
        allowedSMS: isAllowSMS,
        preferedMedia: preferedMedia,
      }
    })
  }

  _renderMemberCardID = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.memberCardIDRequired) > -1){
      return (
        <TextInput
            label={fieldsData.memberCardIDLabel || 'Member Card ID'}
            value={this.state.signup.memberCardID}
            labelColor="gray"
            leftIcon="credit-card"
            leftIconSize={20}
            containerWidth={maxWidth}
            leftIconType="material"
            underlineColor="gray"
            color="gray"
            labelActiveColor="gray"
            leftIconColor="gray"
            selectionColor={'gray'}
            activeColor="gray"
            rippleColor="rgba(255,255,255,2)"
            error={this.state.signupError.memberCardID}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    memberCardID: text,
                  },
                });
                const stER = this.state.signupError;
                  this.setState({
                    signupError: {
                      ...stER,
                      memberCardID: '',
                    },
                  });
              } else {
                if(this._requireFields.indexOf(fieldsData.memberCardIDRequired) > -1){
                  const st = this.state.signupError;
                  this.setState({
                    signupError: {
                      ...st,
                      memberCardID: `Enter Valid ${fieldsData.memberCardIDLabel || 'Memeber Card ID'}`
                    },
                  });
                }
              }
            }}
          />
      )
    }
  }

  _renderDrivingLinces = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.driverLicenseRequired) > -1){
      return (
        <TextInput
            label={fieldsData.driverLicense || 'Driving License'}
            labelColor="gray"
            leftIcon="car"
            leftIconSize={20}
            containerWidth={maxWidth}
            leftIconType="material"
            underlineColor="gray"
            color="gray"
            labelActiveColor="gray"
            leftIconColor="gray"
            selectionColor={'gray'}
            activeColor="gray"
            rippleColor="rgba(255,255,255,2)"
            value={this.state.signup.driverLicense}
            error={this.state.signupError.driverLicense}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    driverLicense: text,
                  },
                });
                const stER = this.state.signupError;
                  this.setState({
                    signupError: {
                      ...stER,
                      driverLicense: '',
                    },
                  });
              } else {
                if(this._requireFields.indexOf(fieldsData.memberCardIDRequired) > -1 && text.length() >= fieldsData.minRange && text.length() <= fieldsData.maxRange){
                  const st = this.state.signupError;
                  this.setState({
                    signupError: {
                      ...st,
                      driverLicense: `Enter Valid ${fieldsData.driverLicense || 'Driving License'}`
                    },
                  });
                }
              }
            }}
          />
      )
    }
  }

  _renderFirstName = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.firstNameRequired) > -1){
      return (
        <TextInput
            label={fieldsData.firstNameLabel || 'First Name'}
            labelColor="grey"
            leftIcon="account"
            leftIconSize={20}
            containerWidth={maxWidth}
            leftIconType="material"
            underlineColor="gray"
            color="gray"
            labelActiveColor="gray"
            leftIconColor="gray"
            selectionColor={'gray'}
            activeColor="gray"
            rippleColor="rgba(255,255,255,2)"
            value={this.state.signup.firstName}
            error={this.state.signupError.firstName}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    firstName: text,
                  },
                });
                const stER = this.state.signupError;
                  this.setState({
                    signupError: {
                      ...stER,
                      firstName: '',
                    },
                  });
              } else {
                if(this._requireFields.indexOf(fieldsData.firstNameRequired) > -1){
                  const st = this.state.signupError;
                  this.setState({
                    signupError: {
                      ...st,
                      firstName: `Enter Valid ${fieldsData.firstNameLabel || 'First Name'}`
                    },
                  });
                }
              }
            }}
          />
      )
    }
  }

  _renderLastName = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.lastNameRequired) > -1){
      return (
        <TextInput
            label={fieldsData.lastNameLabel || 'Last Name'}
            labelColor="grey"
            leftIcon="account"
            leftIconSize={20}
            containerWidth={maxWidth}
            leftIconType="material"
            underlineColor="gray"
            color="gray"
            labelActiveColor="gray"
            leftIconColor="gray"
            selectionColor={'gray'}
            activeColor="gray"
            rippleColor="rgba(255,255,255,2)"
            value={this.state.signup.lastName}
            error={this.state.signupError.lastName}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    lastName: text,
                  },
                });
                const stER = this.state.signupError;
                  this.setState({
                    signupError: {
                      ...stER,
                      lastName: '',
                    },
                  });
              } else {
                if(this._requireFields.indexOf(fieldsData.lastNameRequired) > -1){
                  const st = this.state.signupError;
                  this.setState({
                    signupError: {
                      ...st,
                      lastName: `Enter Valid ${fieldsData.lastNameLabel || 'First Name'}`
                    },
                  });
                }
              }
            }}
          />
      )
    }
  }

  _renderEmail = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.emailRequired) > -1){
      return (
        <TextInput
            label={fieldsData.emailLabel || 'Email'}
            labelColor="gray"
            leftIcon="email"
            leftIconSize={20}
            containerWidth={maxWidth}
            leftIconType="material"
            underlineColor="gray"
            color="gray"
            labelActiveColor="gray"
            leftIconColor="gray"
            selectionColor={'gray'}
            activeColor="gray"
            rippleColor="rgba(255,255,255,2)"
            value={this.state.signup.email}
            error={this.state.signupError.email}
            onChangeText={text=>{
              this.setState({
                signup: {
                  ...this.state.signup,
                  email: text,
                }
              }, () => this._handleContactMenu(true))
            }}
          />
      )
    }
  }

  _renderPhone = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.mobileRequired) > -1){
      return (
        <TextInput
            label={fieldsData.mobileLabel || 'Mobile'}
            labelColor="gray"
            leftIcon="phone"
            keyboardType={'phone-pad'}
            leftIconSize={20}
            containerWidth={maxWidth}
            leftIconType="material"
            underlineColor="gray"
            color="gray"
            labelActiveColor="gray"
            leftIconColor="gray"
            selectionColor={'gray'}
            activeColor="gray"
            rippleColor="rgba(255,255,255,2)"
            value={this.state.signup.mobile}
            error={this.state.signupError.mobile}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    mobile: text,
                  },
                }, () => this._handleContactMenu(true));
              }
            }}
          />
      )
    }
  }

  _renderAddress2 = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.address2required) > -1){
      return (
        <TextInput
            label={fieldsData.address2 || 'Address line 2'}
            labelColor="gray"
            leftIcon="home"
            leftIconSize={20}
            containerWidth={maxWidth}
            multiline={true}
            minHeight={100}
            maxHeight={100}
            leftIconType="material"
            underlineColor="gray"
            color="gray"
            labelActiveColor="gray"
            leftIconColor="gray"
            selectionColor={'gray'}
            activeColor="gray"
            rippleColor="rgba(255,255,255,2)"
            value={this.state.signup.address2}
            error={this.state.signupError.address2}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    address2: text,
                  },
                });
              }
            }}
          />
      )
    }
  }

  _renderAddress3 = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.address3required) > -1){
      return (
        <TextInput
            label={fieldsData.address3 || 'Address line 3'}
            labelColor="gray"
            leftIcon="home"
            leftIconSize={20}
            containerWidth={maxWidth}
            multiline={true}
            minHeight={100}
            maxHeight={100}
            leftIconType="material"
            underlineColor="gray"
            color="gray"
            labelActiveColor="gray"
            leftIconColor="gray"
            selectionColor={'gray'}
            activeColor="gray"
            rippleColor="rgba(255,255,255,2)"
            value={this.state.signup.address3}
            error={this.state.signupError.address3}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    address3: text,
                  },
                });
              }
            }}
          />
      )
    }
  }

  _renderAddress = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.collectEndUserAddressRequired) > -1){
      return (
        <View>
          <TextInput
            label={'Address'}
            labelColor="gray"
            leftIcon="home"
            leftIconSize={20}
            containerWidth={maxWidth}
            multiline={true}
            minHeight={100}
            maxHeight={100}
            leftIconType="material"
            underlineColor="gray"
            color="gray"
            labelActiveColor="gray"
            leftIconColor="gray"
            selectionColor={'gray'}
            activeColor="gray"
            rippleColor="rgba(255,255,255,2)"
            value={this.state.signup.address}
            error={this.state.signupError.address}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    address: text,
                  },
                });
              }
            }}
          />

          {this._renderAddress2(fieldsData)}
          {this._renderAddress3(fieldsData)}

          <TextInput
            label={'City'}
            labelColor="gray"
            leftIcon="city"
            leftIconSize={20}
            containerWidth={maxWidth}
            leftIconType="material"
            underlineColor="gray"
            color="gray"
            labelActiveColor="gray"
            leftIconColor="gray"
            selectionColor={'gray'}
            activeColor="gray"
            rippleColor="rgba(255,255,255,2)"
            value={this.state.signup.city}
            error={this.state.signupError.city}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    city: text,
                  },
                });
              }
            }}
          />

          <TextInput
            label={'State'}
            labelColor="gray"
            leftIcon="domain"
            leftIconSize={20}
            containerWidth={maxWidth}
            leftIconType="material"
            underlineColor="gray"
            color="gray"
            labelActiveColor="gray"
            leftIconColor="gray"
            selectionColor={'gray'}
            activeColor="gray"
            rippleColor="rgba(255,255,255,2)"
            value={this.state.signup.state}
            error={this.state.signupError.state}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    state: text,
                  },
                });
              }
            }}
          />

          <TextInput
            label={'Postal Code'}
            labelColor="gray"
            leftIcon="mailbox"
            keyboardType={'numeric'}
            leftIconSize={20}
            containerWidth={maxWidth}
            leftIconType="material"
            underlineColor="gray"
            color="gray"
            labelActiveColor="gray"
            leftIconColor="gray"
            selectionColor={'gray'}
            activeColor="gray"
            rippleColor="rgba(255,255,255,2)"
            value={this.state.signup.postalcode}
            error={this.state.signupError.postalcode}
            onChangeText={text=>{
              if(text){
                const st = this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    postalcode: text,
                  },
                });
              }
            }}
          />
        </View>
      )
    }
  }

  _renderLabel = (value, label) => {
    if(value) {
      return (
      <Text style={{marginLeft: 26, color: 'gray', fontSize: 14, marginBottom: -8}}>{label}</Text>
      )
    }
  }

  _renderBirthDate = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.birthdateRequired) > -1){
      return (
        <View style={{width: maxWidth, flexDirection: 'column', marginTop: 5, marginBottom: 5}}>
          {this._renderLabel(this.state.signup.birthdate, fieldsData.birthdateLabel || 'Birth Date')}
          <DatePicker
            date={this.state.signup.birthdate}
            mode="date"
            placeholder={fieldsData.birthdateLabel || "select date"}
            format="YYYY-MM-DD"
            maxDate={this._maxDate}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            iconComponent={<MDIcon name={'cake'} style={{fontSize: 22, color: 'gray', marginRight: 10}} />}
            customStyles={{
              placeholderText:{
                fontSize: 15,
                color: 'gray'
              },
              dateText: {
                fontSize: 17,
                color: 'gray'
              }
            }}
            onDateChange={(date) => {
              const st = this.state.signup;
              this.setState({
                signup: {
                  ...st,
                  birthdate: date,
                }
              })
            }}
          />
          <View style={{height: 1, backgroundColor: 'gray'}}/>
        </View>
      );
    }
  }

  _renderAnniversary = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.anniversaryRequired) > -1){
      return (
        <View style={{width: maxWidth, flexDirection: 'column', marginTop: 5, marginBottom: 5}}>
          {this._renderLabel(this.state.signup.anniversary, fieldsData.anniversaryLabel || 'Anniversary Date')}
          <DatePicker
            date={this.state.signup.anniversary}
            mode="date"
            placeholder={fieldsData.anniversaryLabel || "select date"}
            format="YYYY-MM-DD"
            maxDate={new Date()}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            iconComponent={<MDIcon name={'group'} style={{fontSize: 22, color: 'gray', marginRight: 10}} />}
            customStyles={{
              placeholderText:{
                fontSize: 15,
                color: 'gray'
              },
              dateText: {
                fontSize: 17,
                color: 'gray'
              }
            }}
            onDateChange={(date) => {
              const st = this.state.signup;
              this.setState({
                signup: {
                  ...st,
                  anniversary: date,
                }
              })
            }}
          />
          <View style={{height: 1, backgroundColor: 'gray'}}/>
        </View>
      );
    }
  }

  _renderGender = fieldsData => {
    if(!this._visibleFields.indexOf(fieldsData.genderRequired)>-1){
      return(
        <View style={{marginVertical: 10, width: maxWidth}}>
          {this._renderLabel(this.state.signup.gender,fieldsData.genderLabel || 'Gender')}
          <View style={{flexDirection: 'row', alignContent: 'center', marginVertical: 5}}>
            <MDIcon name={'group'} style={{fontSize: 22, color: 'gray', marginRight: 10}} />
            <Menu
              onSelect={value => {
                const st= this.state.signup;
                this.setState({
                  signup: {
                    ...st,
                    gender: value,
                  }
                })
              }}>
              <MenuTrigger customStyles={{triggerText:{fontSize: 16, color: 'gray'}}} text={this.state.signup.gender || fieldsData.genderLabel || 'Gender'} />
              <MenuOptions>
                <MenuOption value='Male' text='Male' />
                <MenuOption value='Female' text='Female' />
              </MenuOptions>
            </Menu>
          </View>
          <View style={{height: 1, backgroundColor: 'gray'}}/>
        </View>
      );
    }
  }

  onSelectedItemsChange = selectedItems => {
    const st = this.state.signup;
    this.setState({ 
      signup: {
        ...st,
        location: selectedItems[0],
      },
    });
    //console.log('selected : '+JSON.stringify(selectedItems))
  };

  _renderLocation = (fieldsData, locationData) => {
    if(this._visibleFields.indexOf(fieldsData.myLocationRequired) > -1){
      var item = [];
    locationData.map(location=>{
      var it = {
        id: location.addressID,
        name: location.locationName 
      }
      item.push(it);
    });
    return (
      <View style={{width: maxWidth}}>
        <SectionedMultiSelect
          items={item}
          uniqueKey="id"
          //selectText="Choose some things..."
          renderSelectText={()=>{
            var title = fieldsData.myLocationLabel || 'My Location';
            if(this.state.signup.location){
              item.map(i=>{
                if(i.id === this.state.signup.location){
                  title = i.name;
                }
              })
            }
            return (
              <View style={{marginLeft: -10, marginTop: -10, flex: 1}}>
                {this._renderLabel(this.state.signup.location, 'Location')}
                <View style={{flexDirection: 'row', flex: 1, marginVertical: 5, marginTop: 10}}>
                  <MDIcon name={'place'} style={{fontSize: 24, color: 'gray', marginRight: 10,}} />
                  <Text style={{color: 'gray', flex: 1, fontSize: 16}}>{title}</Text>
                </View>
              </View>
            )
          }}
          showChips={true}
          single={true}
          selectToggleIconComponent={()=>{
            return <MDIcon name={'keyboard-arrow-down'} style={{fontSize: 24, color: 'gray'}} />
          }}
          selectedIconComponent={()=>{
            return (<MDIcon name={'check'} style={{fontSize: 20, color: 'black', marginRight: 10,}} />);
          }}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={[this.state.signup.location]}
        />
        <View style={{height: 1, backgroundColor: 'gray', marginTop: -25, marginBottom: 10}}/>
      </View>
    )
    }
  }

  _renderContactPermission = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.contactPermissionRequired) > -1) {
      return(
        <View>
          <Text style={styles.title}>{fieldsData.contactPermissionLabel || 'Contact Permission'}</Text>
          <View style={styles.subContainer}>
          <View style={{flexDirection: 'row', marginVertical: 5, marginTop: 10}}>
            <Text style={{fontSize: 16, color: 'gray', flex: 3}}>Allow Email</Text>
            <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
              <Menu
                onSelect={value => {
                  const st= this.state.signup;
                  this.setState({
                    signup: {
                      ...st,
                      allowedEmail: value,
                    }
                  }, () => this._handleContactMenu())
                }}>
                <MenuTrigger 
                  disabled={this.state.isDisableEmailMenu}
                  customStyles={{triggerText:{fontSize: 16, color: 'gray', alignSelf: 'center'}}} text={this.state.signup.allowedEmail ? 'Yes' : 'No'} 
                />
                <MenuOptions>
                  <MenuOption value={true} text='Yes' />
                  <MenuOption value={false} text='No' />
                </MenuOptions>
              </Menu>
              <View style={{height: 1, width: '100%', backgroundColor: 'gray'}}/>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginVertical: 5, marginTop: 10}}>
            <Text style={{fontSize: 16, color: 'gray', flex: 3}}>Allow SMS</Text>
            <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
              <Menu
                onSelect={value => {
                  const st= this.state.signup;
                  this.setState({
                    signup: {
                      ...st,
                      allowedSMS: value,
                    }
                  },() => this._handleContactMenu())
                }}>
                <MenuTrigger
                  disabled={this.state.isDisableSMSMenu}
                  customStyles={{triggerText:{fontSize: 16, color: 'gray', alignSelf: 'center'}}} text={this.state.signup.allowedSMS ? 'Yes' : 'No'} 
                />
                <MenuOptions>
                  <MenuOption value={true} text='Yes' />
                  <MenuOption value={false} text='No' />
                </MenuOptions>
              </Menu>
              <View style={{height: 1, width: '100%', backgroundColor: 'gray'}}/>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginVertical: 5, marginTop: 10}}>
            <Text style={{fontSize: 16, color: 'gray', flex: 3}}>Allow Prefered Media</Text>
            <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
              <Menu
                onSelect={value => {
                  const st= this.state.signup;
                  this.setState({
                    signup: {
                      ...st,
                      preferedMedia: value,
                    }
                  })
                }}>
                <MenuTrigger
                  disabled={this.state.isDisablePreferedMenu}
                  customStyles={{triggerText:{fontSize: 16, color: 'gray', alignSelf: 'center'}}} text={this.state.signup.preferedMedia}
                />
                <MenuOptions>
                  <MenuOption value='Email' text='Email' />
                  <MenuOption value='SMS' text='SMS' />
                </MenuOptions>
              </Menu>
              <View style={{height: 1, width: '100%', backgroundColor: 'gray'}}/>
            </View>
          </View>
          </View>
        </View>
      );
    }
  }

  _renderCustomData = customData => {
    if(customData){
      //console.log(`working ${JSON.stringify(this.state.signup.customData)}`)
      return(
        <View style={{width: maxWidth}}>
          {customData.map(field => {
            //console.log(`working ${field.customFieldID} : ${this.state.signup.customData}`)
            if(this._visibleFields.indexOf(field.requiredType) > -1){
              if (field.controlTypeID >= 1 && field.controlTypeID <= 3) {
                // text field
                // 1 -text, 2- multiline, 3- number,
                console.log(`working ${field.customFieldID}`)
                return (
                  <TextInput
                    label={field.fieldLabel}
                    labelColor="gray"
                    leftIcon="receipt"
                    keyboardType={field.controlTypeID == 3 ? 'numeric' : ''}
                    multiline={field.controlTypeID == 2}
                    leftIconSize={20}
                    containerWidth={maxWidth}
                    minHeight={field.controlTypeID == 2 ? 100 : undefined}
                    maxHeight={field.controlTypeID == 2 ? 100 : undefined}
                    leftIconType="material"
                    underlineColor="gray"
                    color="gray"
                    labelActiveColor="gray"
                    leftIconColor="gray"
                    selectionColor={'gray'}
                    activeColor="gray"
                    rippleColor="rgba(255,255,255,2)"
                    value={this.state.signup.customData[field.customFieldID]}
                    error={this.state.customerror[field.customFieldID]}
                    onChangeText={text=>{
                      if(text){
                        const st = this.state.signup.customData;
                        this.setState({
                          signup: {
                            ...this.state.signup,
                            customData: {
                              ...this.state.signup.customData,
                              [field.customFieldID]: text,
                            }
                          },
                        });
                      }
                    }}
                  />
                );
              } else if (field.controlTypeID == 4) {
                // picklist
                var item = [];
                var possibleValue = JSON.parse(field.possibleValue);
                possibleValue.map(value=>{
                  var it = {
                    id: value,
                    name: value 
                  }
                  item.push(it);
                });
                return (
                  <View style={{width: maxWidth}}>
                    <SectionedMultiSelect
                      items={item}
                      uniqueKey="id"
                      renderSelectText={()=>{
                        var title = field.fieldLabel || 'Pick';
                        if(this.state.signup.customData[field.customFieldID]){
                          item.map(i=>{
                            if(i.id === this.state.signup.customData[field.customFieldID]){
                              title = i.name;
                            }
                          })
                        }
                        return (
                          <View style={{flex: 1, marginLeft: -10, marginTop: -10}}>
                            {this._renderLabel(this.state.signup.customData[field.customFieldID], field.fieldLabel)}
                            <View style={{flexDirection: 'row', flex: 1, marginVertical: 5, marginTop: 10}}>
                              <MDIcon name={'list'} style={{fontSize: 24, color: 'gray', marginRight: 10,}} />
                              <Text style={{color: 'gray', flex: 1, fontSize: 16}}>{title}</Text>
                            </View>
                          </View>
                        )
                      }}
                      showChips={true}
                      single={true}
                      selectToggleIconComponent={()=>{
                        return <MDIcon name={'keyboard-arrow-down'} style={{fontSize: 24, color: 'gray'}} />
                      }}
                      selectedIconComponent={()=>{
                        return (<MDIcon name={'check'} style={{fontSize: 20, color: 'black', marginRight: 10,}} />);
                      }}
                      onSelectedItemsChange={(selectedItems) => {
                        this.setState({
                          signup: {
                            ...this.state.signup,
                            customData: {
                              ...this.state.signup.customData,
                              [field.customFieldID]: selectedItems[0],
                            }
                          }
                        })
                      }}
                      selectedItems={[this.state.signup.customData[field.customFieldID]]}
                    />
                    <View style={{height: 1, backgroundColor: 'gray', marginTop: -25, marginBottom: 10}}/>
                  </View>
                )
              } else if (field.controlTypeID == 5) {
                // check box list
                var item = [];
                var possibleValue = JSON.parse(field.possibleValue);
                possibleValue.map(value=>{
                  var it = {
                    id: value,
                    name: value 
                  }
                  item.push(it);
                });
                return (
                  <View style={{width: maxWidth}}>
                    <SectionedMultiSelect
                      items={item}
                      uniqueKey="id"
                      renderSelectText={()=>{
                        var title = field.fieldLabel || 'Pick';
                        if(this.state.signup.customData[field.customFieldID]){
                          item.map(i=>{
                            if(i.id === this.state.signup.customData[field.customFieldID][0]){
                              var items = this.state.signup.customData[field.customFieldID].length;
                              title = `${i.name} ${items > 1 ?  `and ${items -1 } more ` : '' }`;
                            }
                          })
                        }
                        return (
                          <View style={{flex: 1, marginLeft: -10, marginTop: -10}}>
                            {this._renderLabel(this.state.signup.customData[field.customFieldID], field.fieldLabel)}
                            <View style={{flexDirection: 'row', flex: 1, marginVertical: 5, marginTop: 10}}>
                              <Icon name={'check-square-o'} style={{fontSize: 20, color: 'gray', marginRight: 10,}} />
                              <Text style={{color: 'gray', flex: 1, fontSize: 16}}>{title}</Text>
                            </View>
                          </View>
                        )
                      }}
                      selectToggleIconComponent={()=>{
                        return <MDIcon name={'keyboard-arrow-down'} style={{fontSize: 24, color: 'gray'}} />
                      }}
                      selectedIconComponent={()=>{
                        return (<Icon name={'check-square-o'} style={{fontSize: 20, color: 'black', marginRight: 10,}} />);
                      }}
                      unselectedIconComponent={()=>{
                        return (<Icon name={'square-o'}  style={{fontSize: 20, color: 'black', marginRight: 10,}} />)
                      }}
                      showChips={false}
                      onSelectedItemsChange={(selectedItems) => {
                        this.setState({
                          signup: {
                            ...this.state.signup,
                            customData: {
                              ...this.state.signup.customData,
                              [field.customFieldID]: selectedItems,
                            }
                          }
                        })
                      }}
                      selectedItems={this.state.signup.customData[field.customFieldID]}
                    />
                    <View style={{height: 1, backgroundColor: 'gray', marginTop: -25, marginBottom: 10}}/>
                  </View>
                )
              } else if (field.controlTypeID == 6) {
                // radio list
                var item = [];
                var possibleValue = JSON.parse(field.possibleValue);
                possibleValue.map(value=>{
                  var it = {
                    id: value,
                    name: value 
                  }
                  item.push(it);
                });
                return (
                  <View style={{width: maxWidth}}>
                    <SectionedMultiSelect
                      items={item}
                      uniqueKey="id"
                      renderSelectText={()=>{
                        var title = field.fieldLabel || 'Pick';
                        if(this.state.signup.customData[field.customFieldID]){
                          item.map(i=>{
                            if(i.id === this.state.signup.customData[field.customFieldID]){
                              title = i.name;
                            }
                          })
                        }
                        return (
                          <View style={{flex: 1, marginLeft: -10, marginTop: -10}}>
                            {this._renderLabel(this.state.signup.customData[field.customFieldID], field.fieldLabel)}
                            <View style={{flexDirection: 'row', flex: 1, marginVertical: 5, marginTop: 10}}>
                              <MDIcon name={'radio-button-checked'} style={{fontSize: 24, color: 'gray', marginRight: 10,}} />
                              <Text style={{color: 'gray', flex: 1, fontSize: 16}}>{title}</Text>
                            </View>
                          </View>
                        )
                      }}
                      showChips={false}
                      single={true}
                      selectToggleIconComponent={()=>{
                        return <MDIcon name={'keyboard-arrow-down'} style={{fontSize: 24, color: 'gray'}} />
                      }}
                      selectedIconComponent={()=>{
                        return (<MDIcon name={'radio-button-checked'} style={{fontSize: 20, color: 'black', marginRight: 10,}} />);
                      }}
                      unselectedIconComponent={()=>{
                        return (<MDIcon name={'radio-button-unchecked'} style={{fontSize: 20, color: 'black', marginRight: 10,}} />);
                      }}
                      onSelectedItemsChange={(selectedItems) => {
                        this.setState({
                          signup: {
                            ...this.state.signup,
                            customData: {
                              ...this.state.signup.customData,
                              [field.customFieldID]: selectedItems[0],
                            }
                          }
                        })
                      }}
                      selectedItems={[this.state.signup.customData[field.customFieldID]]}
                    />
                    <View style={{height: 1, backgroundColor: 'gray', marginTop: -25, marginBottom: 10}}/>
                  </View>
                )
              } else if (field.controlTypeID == 7) {
                // date picker
                return (
                  <View style={{width: maxWidth, flexDirection: 'column', marginTop: 5, marginBottom: 5}}>
                    {this._renderLabel(this.state.signup.customData[field.customFieldID], field.fieldLabel)}
                    <DatePicker
                      date={this.state.signup.customData[field.customFieldID]}
                      mode="date"
                      placeholder={field.fieldLabel || "select date"}
                      format="YYYY-MM-DD"
                      //maxDate={this._maxDate}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      iconComponent={<MDIcon name={'date-range'} style={{fontSize: 22, color: 'gray', marginRight: 10}} />}
                      customStyles={{
                        placeholderText:{
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
                          signup: {
                            ...this.state.signup,
                            customData: {
                              ...this.state.signup.customData,
                              [field.customFieldID]: date,
                            }
                          }
                        })
                      }}
                    />
                    <View style={{height: 1, width: maxWidth, backgroundColor: 'gray'}}/>
                  </View>
                );
              }
            }
          })}
        </View>
      )
    }
  }

  _renderProfile = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.profilePictureRequired) > -1) {
      //console.log(`Profiel image state: ${this.state.signup.profileImage}`)
      return(
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={()=>{
            this._handleImageClick();
          }}
          style={{marginBottom: 10, flexDirection: 'column-reverse'}}
          >
          <ImageLoader 
            title={`${this.state.signup.firstName || ''} ${this.state.signup.lastName || ''}`}
            src={this.state.profileImagePath || this.state.signup.profileImage}
            rounded
            avatarSize={'xlarge'}
            style={styles.profileContainer}
            titleStyle={{fontSize: 30}}/>
          <MDIcon name={'add'} style={{fontSize: 20, position: 'absolute', backgroundColor: 'white', borderWidth: 1, borderColor: '#000000', borderRadius: 30, alignSelf: 'flex-end', textAlign: 'center', padding: 5, height: 30, width: 30}} />
        </TouchableOpacity>
      )
    }
  }

  _renderAdditionalDates = fieldsData => {
    if(this._visibleFields.indexOf(fieldsData.additionalBirthdayRequired) > -1) {
      var fields = [];
      if(this.state.signup.additionalBirthDates){
        this.state.signup.additionalBirthDates.map( (field, index) => {
          //console.log(`Map dyanmic value ${Object.keys(field)} : ${field[Object.keys(field)]}`)
          fields.push(
            <View style={{flexDirection: 'row', width: maxWidth}}>
              <View style={{width: 250, flexDirection: 'column', marginTop: 5, marginBottom: 5}}>
                {this._renderLabel(field.AdditionalDate, field.AdditionalName)}
                <DatePicker
                  date={field.AdditionalDate}
                  mode="date"
                  placeholder={field.AdditionalName}
                  format="YYYY-MM-DD"
                  maxDate={new Date()}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  iconComponent={<MDIcon name={'date-range'} style={{fontSize: 22, color: 'gray', marginRight: 10}} />}
                  customStyles={{
                    placeholderText:{
                      fontSize: 15,
                      color: 'gray'
                    },
                    dateText: {
                      fontSize: 17,
                      color: 'gray'
                    }
                  }}
                  onDateChange={(date) => {
                    var dates = [...this.state.signup.additionalBirthDates];
                    dates[index] = {
                      AdditionalName: field.AdditionalName,
                      AdditionalDate: date,
                    }
    
                    this.setState({
                      signup: {
                        ...this.state.signup,
                        additionalBirthDates: dates,
                      }
                    })
                  }}
                />
                <View style={{height: 1, width: maxWidth, backgroundColor: 'gray'}}/>
              </View>  
              <TouchableOpacity
                style={{flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}
                onPress={() => {
                  var dates = this.state.signup.additionalBirthDates;
                  dates.splice(index, 1);
                  this.setState({
                    signup: {
                      ...this.state.signup,
                      additionalBirthDates: dates,
                    }
                  });
                }}>
                <MDIcon name={'delete'} style={{fontSize: 24, margin: 5, color: 'grey'}} />
              </TouchableOpacity>
            </View>
          )
        })
      }
      return(
        <View>
          <Text style={styles.title}>{fieldsData.additionalBirthdaysLabel}</Text>
          <View style={styles.subContainer}>
            {fields}
            <View style={{width: maxWidth, flexDirection: 'column', marginTop: 5, marginBottom: 5}}>
              <TextInput
                label={'Name'}
                labelColor="gray"
                leftIcon="account"
                leftIconSize={20}
                containerWidth={maxWidth}
                leftIconType="material"
                underlineColor="gray"
                color="gray"
                labelActiveColor="gray"
                leftIconColor="gray"
                selectionColor={'gray'}
                activeColor="gray"
                rippleColor="rgba(255,255,255,2)"
                value={this.state.tmp}
                error={this.state.tmpError}
                onChangeText={text=>{
                  this.setState({
                    tmp: text,
                  });
                }}
              />
            <DatePicker
              mode="date"
              placeholder={`Birth Date`}
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              maxDate={new Date()}
              onOpenModal={() => {
                if(!this.state.tmp){
                  this._showToast('Please enter name first')
                  return;
                }
              }}
              iconComponent={<MDIcon name={'date-range'} style={{fontSize: 22, color: 'gray', marginRight: 10}} />}
              customStyles={{
                placeholderText:{
                  fontSize: 15,
                  color: 'gray'
                },
                dateText: {
                  fontSize: 17,
                  color: 'gray'
                }
              }}
              onDateChange={(date) => {
                if(this.state.tmp){
                  var dates = this.state.additionalDates;
                  const newItem = {
                    AdditionalName: this.state.tmp,
                    AdditionalDate: date
                  };
                  dates.push(newItem);
                  this.setState({
                    tmp: '',
                    tmpError: '',
                    signup: {
                      ...this.state.signup,
                      additionalBirthDates: dates
                    }
                  })
                } else {
                  this._showToast('Please enter name before select date')
                  this.setState({
                    tmpError: 'Please enter name first',
                  })
                }
              }}
            />
            <View style={{height: 1, width: maxWidth, backgroundColor: 'gray'}}/>
          </View>
          </View>
        </View>
      )
    }
  }

  _showForm = () => {
    if (this.state.isLoadingSignupform) {
      return (
        <View style={{flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    } else {
      const {fieldsData, customData, locationData} = this.state.webFromResponse;
      return (
        <ScrollView
            keyboardShouldPersistTaps={true}
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.baseScrollView}>
          <View style={styles.mainContainer}>
          <Text style={[styles.title]}>Member Detail</Text>
          <View style={styles.subContainer}>
            {this._renderProfile(fieldsData)}
            {this._renderFirstName(fieldsData)}
            {this._renderLastName(fieldsData)}          
            {this._renderEmail(fieldsData)}
            {this._renderPhone(fieldsData)}
            {this._renderMemberCardID(fieldsData)}
            {this._renderDrivingLinces(fieldsData)}
            {this._renderLocation(fieldsData, locationData)}
            {this._renderGender(fieldsData)}
          </View>
          {((this._visibleFields.indexOf(fieldsData.collectEndUserAddressRequired) > -1) || (this._visibleFields.indexOf(fieldsData.address2required) > -1) || (this._visibleFields.indexOf(fieldsData.address3) > -1)) && <Text style={styles.title}>Member Address</Text>}
          <View style={styles.subContainer}>
          {this._renderAddress(fieldsData)} 
          </View>
          {((this._visibleFields.indexOf(fieldsData.birthdateRequired) > -1) || (this._visibleFields.indexOf(fieldsData.anniversaryRequired) > -1)) && <Text style={styles.title}>Important Dates</Text>}
          <View style={styles.subContainer}>
            {this._renderBirthDate(fieldsData)}
            {this._renderAnniversary(fieldsData)}
          </View>
          {this._renderAdditionalDates(fieldsData)}
          <Text style={styles.title}>More Information</Text>
          <View style={styles.subContainer}>
          {this._renderCustomData(customData)}
          </View>
          {this._renderContactPermission(fieldsData)}
          {this._renderSaveButton()}
        </View>
      </ScrollView>
      );
    }
  };

  _renderSaveButton = () => {
    if (this.state.isUpdatingProfile) {
      return <ActivityIndicator size={'large'} style={{marginBottom: 10}} />
    } else {
      return (
        <View style={styles.subContainer}>
          <TouchableOpacity
            underlayColor="#030a91"
            activeOpacity={0.8}
            style={styles.button}
            onPress={() => this._prepareForm()}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  render() {
    const {width} = Dimensions.get('window');
    const _maxWidth = width - (width * 20) / 100;
    //console.log('Width : ' + width + ' : max : ' + _maxWidth);
    return (
      <MenuProvider>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled={Platform.OS === 'ios' ? true : false}>
            {this._showForm()}
        </KeyboardAvoidingView>
      </MenuProvider>
    );
  }
}

const styles = {
  backgroundImage: {
    height: null,
    width: null,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  baseScrollView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    alignContent: 'stretch',
    alignSelf: 'center',
    backgroundColor: 'rgba(256,256,256,1)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  subContainer: {
    backgroundColor: 'rgba(256,256,256,0.9)',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: maxWidth,
    alignSelf: 'center',
  },
  titleTopRadius: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    flex: 1,
    padding: 5,
    textAlign: 'center',
    backgroundColor: 'rgba(3,10,143,0.2)',
    paddingBottom: 5,
    fontSize: 15,
  },
  profileContainer: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    borderRadius: 50,
    borderColor: 'rgba(3,10,145,0.2)',
    borderWidth: 2,
  },
  button: {
    //marginTop: 10,
    minWidth: 120,
    borderRadius: 10,
    padding: 5,
    alignSelf: 'center',
    maxWidth: 500,
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
  },
};
