import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import {Card} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ShareDialog} from 'react-native-fbsdk';
import {BottomNavigationTab} from './../widget/BottomNavigationTab';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import {NotificaitonScreen} from './NotificationScreen';
import StepIndicator from 'react-native-step-indicator';
import StarRating from 'react-native-star-rating';
import TextInput from 'react-native-textinput-with-icons';

export default class SurveyFormScreen extends Component {
  customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#012340',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#012340',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#012340',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#012340',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 16,
    stepIndicatorLabelCurrentColor: '#012340',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#012340',
  };

  constructor() {
    super();
    this.state = {
      currentPosition: 2,
      starCount: 0,
    };
  }

  onPageChange(position) {
    this.setState({currentPosition: position});
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <Text style={{margin: 10, fontSize: 20}}>Pages to Completion</Text>
        <StepIndicator
          customStyles={this.customStyles}
          currentPosition={this.state.currentPosition}
          labels={this.labels}
        />
        <View style={{flex: 1, marginTop: 1, paddingBottom: 5}}>
          <ScrollView style={{flex: 1}}>
            <View style={{flex: 1}}>
              <Card containerStyle={{borderRadius: 10}} st>
                <Text style={{fontSize: 20, color: '#012340'}}>
                  1. How is our app
                </Text>
                <Text style={{marginBottom: 10, marginTop: 10, fontSize: 15}}>
                  Please rate us on 5 star scale, 5=Best 1=Worst
                </Text>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={this.state.starCount}
                  selectedStar={rating => this.onStarRatingPress(rating)}
                  style={{margin: 10}}
                  halfStarEnabled={true}
                  fullStarColor={'#012340'}
                />
              </Card>

              <Card containerStyle={{borderRadius: 10}}>
                <Text style={{fontSize: 20, color: '#012340'}}>
                  2. Write something to us.
                </Text>
                <Text style={{marginBottom: 10, marginTop: 10, fontSize: 15}}>
                  Optiona answer, not required
                </Text>
                <TextInput
                  containerheight={320}
                  numberOfLines={5}
                  multiline={true}
                  height={100}
                  label="Enter Something"
                  leftIconSize={20}
                />
              </Card>

              <Card containerStyle={{borderRadius: 10}} st>
                <Text style={{fontSize: 20, color: '#012340'}}>
                  1. How is our app
                </Text>
                <Text style={{marginBottom: 10, marginTop: 10, fontSize: 15}}>
                  Please rate us on 5 star scale, 5=Best 1=Worst
                </Text>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={this.state.starCount}
                  selectedStar={rating => this.onStarRatingPress(rating)}
                  style={{margin: 10}}
                  halfStarEnabled={true}
                  fullStarColor={'#012340'}
                />
              </Card>

              <Card containerStyle={{borderRadius: 10}} st>
                <Text style={{fontSize: 20, color: '#012340'}}>
                  2. Write something to us.
                </Text>
                <Text style={{marginBottom: 10, marginTop: 10, fontSize: 15}}>
                  Optiona answer, not required
                </Text>
                <TextInput
                  containerheight={320}
                  numberOfLines={5}
                  multiline={true}
                  height={100}
                  label="Enter Something"
                  leftIconSize={20}
                />
              </Card>

              <Card containerStyle={{borderRadius: 10}} st>
                <Text style={{fontSize: 20, color: '#012340'}}>
                  1. How is our app
                </Text>
                <Text style={{marginBottom: 10, marginTop: 10, fontSize: 15}}>
                  Please rate us on 5 star scale, 5=Best 1=Worst
                </Text>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={this.state.starCount}
                  selectedStar={rating => this.onStarRatingPress(rating)}
                  style={{margin: 10}}
                  halfStarEnabled={true}
                  fullStarColor={'#012340'}
                />
              </Card>

              <Card containerStyle={{borderRadius: 10}} st>
                <Text style={{fontSize: 20, color: '#012340'}}>
                  2. Write something to us.
                </Text>
                <Text style={{marginBottom: 10, marginTop: 10, fontSize: 15}}>
                  Optiona answer, not required
                </Text>
                <TextInput
                  containerheight={320}
                  numberOfLines={5}
                  multiline={true}
                  height={100}
                  label="Enter Something"
                  leftIconSize={20}
                />
              </Card>
            </View>
          </ScrollView>
        </View>
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
    fontFamily: 'helvetica',
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
};
