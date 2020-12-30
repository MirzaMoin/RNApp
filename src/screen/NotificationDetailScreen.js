import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  // TouchableNativeFeedback,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import ImageViewer from 'react-native-image-zoom-viewer';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Video from 'react-native-video';

export default class NotificationDetailScreen extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
    };
  }

  static navigationOptions = {
    drawerLockMode: 'locked-closed',
    disableGestures: true,
  };

  _renderImageVideo = index => {
    if (index.includes('.jpg') || index.includes('.jpeg') || index.includes('.png')) {
      return (
        <View style={{ hegith: 300 }}>
          <TouchableHighlight
            onPress={() => {
              this.setState({ visible: true });
            }}>
            <Image
              style={{ height: 300 }}
              source={{
                uri: this.props.navigation.state.params.notification.avatar,
              }}
              resizeMode="cover"
            />
          </TouchableHighlight>

          <Modal visible={this.state.visible} transparent={true}>
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
                  {/* <TouchableNativeFeedback */}
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ visible: false });
                    }}>
                    <MDIcon
                      style={{ fontSize: 30, color: 'white', marginLeft: 15 }}
                      name={'close'}
                    />
                    {/* </TouchableNativeFeedback> */}
                  </TouchableOpacity>
                </View>
              )}
              enableSwipeDown={true}
              onSwipeDown={() => {
                this.setState({ visible: false });
              }}
              imageUrls={[
                {
                  url: this.props.navigation.state.params.notification.avatar,
                },
              ]}
            />
          </Modal>
        </View>
      );
    } else {
      console.log('this is not');
      return (
        <View style={{ hegith: 300, flex: 0.7 }}>
          <Video
            source={{
              uri:
                'https://rawgit.com/mediaelement/mediaelement-files/master/big_buck_bunny.mp4',
            }}
            ref={ref => {
              this.player = ref;
            }}
            onBuffer={this.onBuffer}
            onError={this.videoError}
            controls={true}
            repeat={true}
            resizeMode={'stretch'}
            style={styles.backgroundVideo}
          />
        </View>
      );
    }
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {this._renderImageVideo(
            this.props.navigation.state.params.notification.avatar,
          )}
          <View
            style={{
              padding: 15,
              backgroundColor: 'rgba(153,153,153,0.5)',
              flex: 1,
            }}>
            <Text
              style={{
                fontSize: 25,
                textAlign: 'center',
              }}>
              {this.props.navigation.state.params.notification.email}
            </Text>
            <Text
              style={{
                marginTop: 15,
                fontSize: 15,
                textAlign: 'justify',
              }}>
              {this.props.navigation.state.params.notification.first_name}
            </Text>
          </View>
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
    backgroundColor: 'rgba(256,256,256,1)',
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
  backgroundVideo: {
    flex: 1,
    hegith: 300,
  },
};
