import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Header} from 'react-navigation-stack';
import {Avatar} from 'react-native-elements';
import {Card} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
// import { FlatList } from 'react-native-gesture-handler';
import {makeRequest} from './../api/apiCall';
import APIConstant from './../api/apiConstant';

export default class NotificationScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
    this.state = {
      dataSoure: [],
      selectedCount: 0,
      isFetching: true,
      isFirst: true,
      page: 1,
      fetchingStatus: false,
      totalRecord: 0,
    };
  }

  onRefresh() {
    this.setState({isFetching: true, page: 1}, function() {
      this.getNotificationList();
    });
  }

  getNotificationList = () => {
    makeRequest(
      APIConstant.USERS + '&page=' + this.state.page,
      'get',
    )
      .then(response => {
        console.log(JSON.stringify(response));
        if (this.state.page == 1) {
          this.setState({
            isFetching: false,
            dataSoure: response.data,
            isFirst: false,
            fetchingStatus: false,
            totalRecord: response.total,
          });
        } else {
          this.setState({
            isFetching: false,
            dataSoure: [...this.state.dataSoure, ...response.data],
            isFirst: false,
            fetchingStatus: false,
          });
        }
      })
      .catch(error => console.log('error : ' + error));
  };

  componentDidMount() {
    this.getNotificationList();
  }

  selectNotification = data => {
    var s = this.state.selectedCount;
    if (data.isSelected) {
      s = s - 1;
    } else {
      s = s + 1;
    }
    console.log('selected : ' + s);
    data.isSelected = !data.isSelected;
    this.setState({
      dataSoure: data,
      selectedCount: s,
    });
  };

  deleteNotification = (rowData, index) => {
    var array = [...this.state.dataSoure];
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({dataSoure: array});
    }
    console.log('remove from : ' + index + ' : ' + JSON.stringify(rowData));
  };

  _checkAllNotification = isCheck => {
    var dt = [...this.state.dataSoure];
    var cnt = isCheck ? 0 : dt.length;
    for (let i = 0; i < dt.length; i++) {
      dt[i].isSelected = !isCheck;
    }
    this.setState({dataSoure: dt, selectedCount: cnt});
  };

  _deleteMultipleNotification = () => {
    var array = [...this.state.dataSoure];
    var ar = [];
    for (let i = 0; i < array.length; i++) {
      if (!array[i].isSelected) {
        ar.push(array[i]);
      }
    }
    this.setState({dataSoure: ar, selectedCount: 0});
  };

  showSelection = rowData => {
    if (rowData.isSelected) {
      return (
        <View style={styles.selectNotificationIconBase}>
          <MDIcon name={'check'} style={styles.selectNotificationIcon} />
        </View>
      );
    }
  };

  renderIcon = rowData => {
    if (rowData.avatar != undefined && rowData.avatar != '') {
      return (
        <Image
          style={styles.profileContainer}
          source={{
            uri: rowData.avatar,
          }}
          onLoad={() => console.log('loaded image')}
          onError={error => console.log('error: ' + error)}
          resizeMode="cover"
        />
      );
    } else {
      return (
        <Avatar
          size="medium"
          style={styles.profileContainer}
          rounded
          title={rowData.first_name.substring(0, 2)}
        />
      );
    }
  };

  renderRow(rowData, index) {
    let swipeBtns = [
      {
        text: 'Delete',
        backgroundColor: 'red',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => {
          this.deleteNotification(rowData, index);
        },
      },
    ];

    return (
      <Swipeout
        right={swipeBtns}
        autoClose="true"
        backgroundColor="transparent">
        <TouchableHighlight
          underlayColor="rgba(192,192,192,1,0.6)"
          onPress={() => {
            if (this.state.selectedCount > 0) {
              this.selectNotification(rowData);
            } else {
              console.log('notification selected : ' + JSON.stringify(rowData));
              this.props.navigation.navigate('notificaitonDetail', {
                notification: rowData,
              });
            }
          }}
          onLongPress={() => {
            this.selectNotification(rowData);
          }}>
          <View
            style={{
              backgroundColor: rowData.isSelected
                ? 'rgba(153,153,153,0.1)'
                : 'rgba(256,256,256,1)',
            }}>
            <View style={styles.subContainer}>
              {this.renderIcon(rowData)}
              {this.showSelection(rowData)}
              <View style={styles.messageContainer}>
                <Text
                  style={[
                    {fontSize: 20, padding: 1},
                    {color: rowData.isSelected ? 'black' : 'gray'},
                  ]}>
                  {/* rowData.title */ rowData.email}
                </Text>
                <Text
                  style={[
                    {fontSize: 15, padding: 1},
                    {color: rowData.isSelected ? 'black' : 'gray'},
                  ]}>
                  {/*rowData.message*/ rowData.first_name}
                </Text>
                <Text
                  style={[
                    {fontSize: 12, padding: 1},
                    {color: rowData.isSelected ? 'black' : 'gray'},
                  ]}>
                  {/* {rowData.time} */ rowData.last_name}
                </Text>
              </View>
              <MDIcon
                name={'keyboard-arrow-right'}
                style={[
                  {fontSize: 30, alignSelf: 'center', marginRight: 5},
                  {color: rowData.isSelected ? 'black' : 'gray'},
                ]}
              />
            </View>
            <View style={styles.saprator} />
          </View>
        </TouchableHighlight>
      </Swipeout>
    );
  }

  _showDeleteButton = () => {
    if (this.state.selectedCount > 0)
      return (
        <View style={{flexDirection: 'row'}}>
          <TouchableHighlight
            onPress={() => {
              this._checkAllNotification(
                this.state.selectedCount == this.state.dataSoure.length,
              );
            }}
            onLongPress={() =>
              Toast.show(
                this.state.selectedCount == this.state.dataSoure.length
                  ? 'Uncheck all notificaiton'
                  : 'Check all notificaiton',
                Toast.LONG,
              )
            }
            style={{justifyContent: 'center', margin: 2}}>
            <MDIcon
              style={{
                fontSize: 25,
                color: 'white',
                alignSelf: 'center',
                marginLeft: 7,
                marginRight: 10,
              }}
              name={
                this.state.selectedCount == this.state.dataSoure.length
                  ? 'check-box-outline-blank'
                  : 'check-box'
              }
            />
          </TouchableHighlight>
          <TouchableOpacity
            onPress={() => this._deleteMultipleNotification()}
            onLongPress={() =>
              Toast.show('Delete checked notification', Toast.LONG)
            }
            style={{justifyContent: 'center', flex: 1, margin: 2}}>
            <MDIcon
              style={{
                fontSize: 25,
                color: 'white',
                alignSelf: 'center',
                marginRight: 12,
                marginLeft: 5,
              }}
              name={'delete'}
            />
          </TouchableOpacity>
        </View>
      );
  };

  BottomView = () => {
    return (
      <View>
        {this.state.fetchingStatus ? (
          <ActivityIndicator
            size="large"
            color="#13538E"
            style={{marginLeft: 6}}
          />
        ) : null}
      </View>
    );
  };

  _showNotificationContent = () => {
    if (this.state.dataSoure.length > 0) {
      return (
        <FlatList
          style={{flex: 1, paddingBottom: 10}}
          showsVerticalScrollIndicator={false}
          scrollEnabled={this.state.dataSoure.length > 3}
          data={this.state.dataSoure}
          renderItem={({item, index}) => this.renderRow(item, index)}
          keyExtractor={item => item.id.toString()}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.isFetching}
          onScrollEndDrag={() => console.log(' *********end')}
          onScrollBeginDrag={() => console.log(' *******start')}
          initialNumToRender={8}
          maxToRenderPerBatch={2}
          onEndReachedThreshold={0.5}
          onEndReached={({distanceFromEnd}) => {
            console.log(' ***************** ' + distanceFromEnd);
            if (
              this.state.dataSoure.length < this.state.totalRecord &&
              !this.state.fetchingStatus &&
              !this.state.isFetching
            ) {
              var pg = this.state.page + 1;
              this.setState({page: pg, fetchingStatus: true});
              this.getNotificationList();
            } else {
              console.log('all data loaded');
            }
          }}
          ListFooterComponent={this.BottomView()}
        />
      );
    } else {
      return (
        <View style={{flex: 1}}>
          <View style={{flex: 1}} />
          <Image
            style={{height: 250, width: '100%', alignSelf: 'center'}}
            source={require('./../../Image/notification_3.png')}
            resizeMode="contain"
          />
          <Text
            style={{
              fontFamily: 'helvetica',
              marginTop: 30,
              fontSize: 26,
              textAlign: 'center',
            }}>
            No Notification Found
          </Text>
          <View style={{flex: 1.5}} />
        </View>
      );
    }
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
          }}>
          <View
            style={{
              height: Header.HEIGHT,
              width: '100%',
              flexDirection: 'row',
              backgroundColor: '#012340',
            }}>
            <TouchableOpacity
              style={{justifyContent: 'center', flex: 1}}
              onPress={() => {
                this.props.navigation.toggleDrawer();
              }}>
              <MDIcon
                style={{
                  fontSize: 25,
                  color: 'white',
                  alignSelf: 'center',
                  marginLeft: 15,
                }}
                name={'menu'}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 20,
                color: 'white',
                marginLeft: 12,
                alignSelf: 'center',
                flex: 1,
              }}>
              Notification
            </Text>
            {this._showDeleteButton()}
          </View>
          {this.state.isFirst ? (
            <ActivityIndicator
              style={{alignSelf: 'center', flex: 1}}
              size="large"
              color="#13538E"
            />
          ) : (
            this._showNotificationContent()
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = {
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
  mainContainer: {
    flex: 1,
    alignContent: 'stretch',
    alignSelf: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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
};
