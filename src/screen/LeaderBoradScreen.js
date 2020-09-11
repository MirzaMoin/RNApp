import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Dimensions
} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { makeRequest } from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import { ScreenHeader } from '../widget/ScreenHeader';
import Toast from 'react-native-root-toast';
import { Header } from 'react-navigation-stack';
import { Card } from 'react-native-elements';
import ImageLoader from './../widget/ImageLoader';
import Filters from './../widget/FilterData';

const maxWidth = Dimensions.get('window').width;

export default class LeaderBoardScreen extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      isLoading: false,
      qualificationCriteria: {},
      filters: [],
      leaderBoardReport: [],
      startYear: 2000,
      endYear: 2018,
      selectedYear: 2018,
      selectedMonth: 5,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({
        isLoading: true,
      })
      this._getStoredData();
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  _processFurther = () => {
    console.log('right Navigation : ' + this.props);
    this.props.navigation.navigate('profileScreen');
  }

  _getStoredData = async () => {
    try {
      await AsyncStorage.getItem('profilePitcure', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          //const val = JSON.parse(value);
          if (value) {
            /*Alert.alert('New Update Profile', 'Please add profile picture and update your profile to participate in Leader board',[
              {text: 'Cancel'},{text: 'Update', onPress: this._processFurther}
            ]);*/
          } else {
            Alert.alert('Update Profile', 'Please add profile picture and update your profile to participate in Leader board', [
              { text: 'Cancel' }, { text: 'Update', onPress: this._processFurther }
            ]);
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
              isLoading: true,
              userID: value,
            })
          }
        }
      });

      await AsyncStorage.getItem('reedemablePoints', (err, value) => {
        if (err) {
          //this.props.navigation.navigate('Auth');
        } else {
          if (value) {
            this.setState({
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
            }, () => { this._callGetLeaderBoardScreenData() });
          }
        }
      });
    } catch (error) {
      console.log(error)
    }
  };

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

  _callGetLeaderBoardScreenData = () => {
    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.GET_LEADERBORD_SCREEN_DATA}?RewardProgramID=${APIConstant.RPID}`,
      'get',
    )
      .then(response => {
        //console.log(JSON.stringify(response));
        this.setState({ isLoading: false });
        if (response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          this.setState({
            qualificationCriteria: response.responsedata.qualificationCriteria,
            filters: response.responsedata.filters,
            leaderBoardReport: response.responsedata.leaderBoardReport,
          })
        }
      })
      .catch(error => console.log('error : ' + error));
  };

  _callGetFilterdData = selectedFilter => {
    makeRequest(
      `${APIConstant.BASE_URL}${APIConstant.GET_LEADERBOARD_FILTERED_DATA}?RewardProgramID=${APIConstant.RPID}&Month=${selectedFilter.month}&Year=${selectedFilter.year}`,
      'get',
    )
      .then(response => {
        //console.log(JSON.stringify(response));
        this.setState({ isLoading: false });
        if (response.statusCode == 0) {
          Alert.alert('Oppss...', response.statusMessage);
        } else {
          this.setState({
            leaderBoardReport: response.responsedata,
          })
        }
      })
      .catch(error => console.log('error : ' + error));
  };

  showPicker = () => {
    console.log('starting filter')
    const { filters } = this.state;
    if (!this.state.isLoading) {
      this.picker
        .show({ filters })
        .then(({ selectedFilter, isClear }) => {
          console.log(`select ${JSON.stringify(selectedFilter)} and clear ${JSON.stringify(isClear)}`)
          this.setState({
            selectedFilter: selectedFilter,
            isClear: isClear,
            search: isClear ? '' : this.state.search,
            isLoading: !isClear,
          });
          if (!isClear) {
            this._callGetFilterdData(selectedFilter)
          }
        })
    }
  }

  _buildFirstWinner = () => {
    if (this.state.leaderBoardReport.length > 0 && this.state.qualificationCriteria.noOfWinners > 0) {
      const winner = this.state.leaderBoardReport[0];
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginTop: this.state.qualificationCriteria.noOfWinners == 2 ? 0 : 30 }}>
          <View style={{ height: 105, }}>
            <Image
              source={require('./../../Image/first_winner.png')}
              style={{ height: 50, width: 50, marginTop: 50, position: 'absolute', alignSelf: 'center' }} />
            <ImageLoader
              title={winner.fullName}
              src={winner.profilePitcure}
              style={styles.profileImage}
              titleStyle={{ fontSize: 20 }} />
          </View>
          <Text style={{ fontSize: 16, color: 'white' }}>{winner.fullName}</Text>
          <Text style={{ fontSize: 14, color: 'white' }}>Point: {winner.totalPoints}</Text>
        </View>

      )
    }
  }

  _buildSecoundWinner = () => {
    if (this.state.leaderBoardReport.length > 1 && this.state.qualificationCriteria.noOfWinners > 1) {
      const winner = this.state.leaderBoardReport[1];
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <View style={{ height: 105, }}>
            <Image
              source={require('./../../Image/second_winner.png')}
              style={{ height: 50, width: 50, marginTop: 50, position: 'absolute', alignSelf: 'center' }} />
            <ImageLoader
              title={winner.fullName}
              src={winner.profilePitcure}
              style={styles.profileImage}
              titleStyle={{ fontSize: 20 }} />
          </View>
          <Text style={{ fontSize: 16, color: 'white' }}>{winner.fullName}</Text>
          <Text style={{ fontSize: 14, color: 'white' }}>Point: {winner.totalPoints}</Text>
        </View>

      )
    }
  }

  _buildThirdWinner = () => {
    if (this.state.leaderBoardReport.length > 2 && this.state.qualificationCriteria.noOfWinners > 2) {
      const winner = this.state.leaderBoardReport[2];
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <View style={{ height: 105, }}>
            <Image
              source={require('./../../Image/third_winner.png')}
              style={{ height: 50, width: 50, marginTop: 50, position: 'absolute', alignSelf: 'center' }} />
            <ImageLoader
              title={winner.fullName}
              src={winner.profilePitcure}
              style={styles.profileImage}
              titleStyle={{ fontSize: 20 }} />
          </View>
          <Text style={{ fontSize: 16, color: 'white' }}>{winner.fullName}</Text>
          <Text style={{ fontSize: 14, color: 'white' }}>Point: {winner.totalPoints}</Text>
        </View>

      )
    }
  }

  _renderBody = () => {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ height: 35, flexDirection: 'row', backgroundColor: '#012345', alignItems: 'center' }}>
            <Card containerStyle={{
              flex: 1,
              marginVertical: 0,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              padding: 5,
              marginRight: 7,
            }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  this._showToast(`To qualify ${this.state.qualificationCriteria.referralToQualify} Share requireds`)
                }}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center' }}>
                  <MDIcon name={'share'} style={{ fontSize: 17 }} />
                  <Text style={{ flex: 1, fontSize: 15, marginHorizontal: 10, textAlign: 'center', }}>Requried {this.state.qualificationCriteria.referralToQualify || 2}</Text>
                </View>
              </TouchableOpacity>
            </Card>

            <Card containerStyle={{
              flex: 1,
              marginVertical: 0,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              padding: 5,
              marginRight: 7,
            }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  this._showToast(`To qualify refere atlist ${this.state.qualificationCriteria.referralToQualify} Friends `)
                }}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center' }}>
                  <MDIcon name={'group-add'} style={{ fontSize: 20 }} />
                  <Text style={{ flex: 1, fontSize: 15, marginHorizontal: 10, textAlign: 'center', }}>Requried {this.state.qualificationCriteria.referralToQualify || 2}</Text>
                </View>
              </TouchableOpacity>
            </Card>
          </View>
          <View style={{
            backgroundColor: '#012345',
            position: 'absolute',
            marginTop: 160,
            height: 70,
            alignSelf: 'center',
            width: maxWidth / 3.1,
            borderBottomLeftRadius: maxWidth / 2,
            borderBottomRightRadius: maxWidth / 2,
            transform: [
              { scaleX: 3.3 }
            ],
          }} />
          <View style={{ height: 150, backgroundColor: '#012345', padding: 15, flexDirection: 'row', paddingTop: 35 }}>
            {this._buildSecoundWinner()}
            {this._buildFirstWinner()}
            {this._buildThirdWinner()}
          </View>
          <FlatList
            style={{ flex: 1, marginTop: 50, paddingHorizontal: 20 }}
            data={this.state.leaderBoardReport}
            ListEmptyComponent={() => {
              return (
                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                  <Text style={{ fontSize: 20, alignSelf: 'center' }}>No Winner Found</Text>
                </View>
              );
            }}
            renderItem={({ item, index }) => {
              if ((index > this.state.qualificationCriteria.noOfWinners - 1) || (index > 2)) {
                if (this.state.search && item.fullName.toLowerCase().indexOf(this.state.search.toLowerCase()) == -1) {
                  return
                }
                return (
                  <View style={{
                    padding: 10,
                    margin: 10,
                    borderBottomLeftRadius: 30,
                    borderTopRightRadius: 30,
                    padding: 10,
                    backgroundColor: 'rgba(153, 153, 153, 0.3)',
                  }}>

                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{
                        padding: 10,
                        backgroundColor: this.state.qualificationCriteria.noOfWinners > index ? 'green' : '#012345',
                        position: 'absolute',
                        marginTop: -20,
                        marginLeft: -20,
                        alignSelf: 'flex-start',
                        borderBottomRightRadius: 30,
                        width: 40,
                        textAlign: 'center',
                        color: 'white'
                      }}>
                        {index + 1}
                      </Text>
                      <View style={{ width: 15 }} />
                      <ImageLoader
                        title={item.fullName}
                        src={item.profilePitcure}
                        style={styles.winnerListProfileImage}
                        titleStyle={{ fontSize: 20 }} />
                      <Text style={{ alignSelf: 'center', flex: 1, paddingLeft: 10, fontSize: 16 }}>{item.fullName}</Text>
                      <Text style={{ alignSelf: 'center', padding: 10 }}>{item.totalPoints}</Text>
                    </View>
                  </View>
                )
              }
            }}
          />
          <Filters
            ref={(picker) => this.picker = picker}
            onSearch={(value) => {
              console.log(`onSEarch : ${value}`);
              this.setState({
                search: value,
              })
            }} />
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <ScreenHeader
          navigation={this.props.navigation}
          title={'Leaderboard'}
          hidePoint={true}
          buildFilter={true}
          onPress={() => { this.showPicker() }} />
        {this._renderBody()}
      </View>
    );
  }
}

const styles = {
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  imageOverlay: {
    height: 150,
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  button: {
    minWidth: 120,
    marginTop: 15,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: '#012345',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    margin: 8,
    marginHorizontal: 15
  },
  profileImage: { height: 60, width: 60, borderRadius: 30 },
  winnerListProfileImage: { height: 50, width: 50, borderRadius: 25 }
};
