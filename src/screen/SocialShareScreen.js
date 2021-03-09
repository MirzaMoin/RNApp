import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  // TouchableNativeFeedback,
  TouchableOpacity,
  ScrollView,
  Linking,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ShareDialog } from 'react-native-fbsdk';
import { BottomNavigationTab } from './../widget/BottomNavigationTab';
// import LinkedInSDK from 'react-native-linkedin-sdk';

let facebookParameters = '';

export default class SocialShareScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FacebookShareURL: 'https://aboutreact.com',
      FacebookShareMessage:
        'Hello Guys, This is a testing of facebook share example',
      shareLinkContent: {
        contentType: 'link',
        contentUrl: 'https://facebook.com',
        contentDescription: 'Wow, check out this great site!',
      },
    };
  }

  postOnFacebook = () => {
    let FacebookShareURL = this.state.FacebookShareURL;
    let FacebookShareMessage = this.state.FacebookShareMessage;
    if (this.state.FacebookShareURL != undefined) {
      if (facebookParameters.includes('?') == false) {
        facebookParameters =
          facebookParameters + '?u=' + encodeURI(this.state.FacebookShareURL);
      } else {
        facebookParameters =
          facebookParameters + '&u=' + encodeURI(this.state.FacebookShareURL);
      }
    }
    if (this.state.FacebookShareMessage != undefined) {
      if (facebookParameters.includes('?') == false) {
        facebookParameters =
          facebookParameters +
          '?quote=' +
          encodeURI(this.state.FacebookShareMessage);
      } else {
        facebookParameters =
          facebookParameters +
          '&quote=' +
          encodeURI(this.state.FacebookShareMessage);
      }
    }
    let url = 'https://www.facebook.com/sharer/sharer.php' + facebookParameters;
    Linking.openURL(url)
      .then(data => {
        alert('Facebook Opened');
      })
      .catch(() => {
        alert('Something went wrong');
      });
  };

  shareLinkWithShareDialog = () => {
    var tmp = this;
    ShareDialog.canShow(this.state.shareLinkContent)
      .then(function (canShow) {
        if (canShow) {
          return ShareDialog.show(tmp.state.shareLinkContent);
        }
      })
      .then(
        function (result) {
          if (result.isCancelled) {
            console.log('Share cancelled');
          } else {
            console.log('Share success with postId: ' + result.postId);
          }
        },
        function (error) {
          console.log('Share fail with error: ' + error);
        },
      );
  };

  createTweetIntent(text, url, hashtags) {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text,
    )}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
  }
// render(){
//   return(<View><Text>Hello</Text></View>);
// }
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContainer}>
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
          <ScrollView>
            <View style={{ padding: 15, flex: 1 }}>
              <Image
                style={styles.socialShareImage}
                source={{
                  uri:
                    'https://i.pinimg.com/474x/68/b9/14/68b9148f7d8410ab7029476bb15a65aa.jpg',
                }}
                resizeMode="contain"
              />
              <Text style={styles.titleText}>Free Cash - RoboRewards</Text>
              <Text style={styles.socialShareText}>
                this is text information this is text information this is text
                information this is text information this is text information this
                is text information this is text information this is text
                information this is text information this is text information this
                is text information this is text information this is text
            </Text>
              <View style={styles.socailIconContainer}>
                {/* <TouchableNativeFeedback */}
                <TouchableOpacity
                  style={{ margin: 10 }}
                  onPress={this.shareLinkWithShareDialog}>
                  <Icon
                    name={'facebook-square'}
                    style={{ fontSize: 60, color: '#3b5998' }}
                  />
                </TouchableOpacity>
                {/* </TouchableNativeFeedback> */}
                {/* <TouchableNativeFeedback */}
                <TouchableOpacity style={{ margin: 10 }}>
                  <Icon
                    name={'linkedin-square'}
                    style={{ fontSize: 60, color: '#0e76a8' }}
                  />
                </TouchableOpacity>
                {/* </TouchableNativeFeedback> */}
                {/* <TouchableNativeFeedback */}
                <TouchableOpacity style={{ margin: 10 }}>
                  <Icon
                    name={'tumblr-square'}
                    style={{ fontSize: 60, color: '#34526f' }}
                  />
                </TouchableOpacity>
                {/* </TouchableNativeFeedback> */}
                {/* <TouchableNativeFeedback */}
                <TouchableOpacity
                  style={{ margin: 10 }}
                  onPress={() => {
                    try {
                      let intent = this.createTweetIntent(
                        'Some text to tweet',
                        'https://breakingscope.com/',
                        'tag1,tag2,tag3',
                      );
                      Linking.openURL(intent);
                    } catch (error) {
                      console.log('Error opening link', error);
                    }
                  }}>
                  <Icon
                    name={'twitter-square'}
                    style={{ fontSize: 60, color: '#00acee' }}
                  />
                </TouchableOpacity>
                {/* </TouchableNativeFeedback> */}
                {/* <TouchableNativeFeedback */}
                <TouchableOpacity style={{ margin: 10 }}>
                  <Icon
                    name={'pinterest-square'}
                    style={{ fontSize: 60, color: '#c8232c' }}
                  />
                  {/* </TouchableNativeFeedback> */}
                </TouchableOpacity>
              </View>

              <Text style={{ fontSize: 16, textAlign: 'justify' }}>
                this is text information this is text information this is text
                information this is text information this is text information this
                is text information this is text information this is text
            </Text>
            </View>
          </ScrollView>
          {/* <BottomNavigationTab navigation={this.props.navigation} /> */}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = {
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "rgba(256,256,256,1)",
  },
  imageOverlay: {
    height: 150,
    width: "100%",
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  socialShareImage: {
    height: 180,
    width: undefined,
    margin: 10,
  },
  socialShareText: {
    fontSize: 16,
    textAlign: "justify",
  },
  socailIconContainer: {
    //marginTop: 10,
    marginBottom: 15,
    //padding: 5,
    flexDirection: "row",
    backgroundColor: "rgba(153,153,153,0.2)",
    justifyContent: "space-evenly",
    borderRadius: 15,
    marginHorizontal: 10,
  },
  carousel: {
    width: 360,
    height: 360,
  },
  cardContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: "white",
    //padding:10,
  },
  cardImage: {
    width: "100%",
    height: "70%",
    resizeMode: "cover",
    borderRadius: 10,
    backgroundColor: "grey",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardtext: {
    color: "grey",
    fontSize: 16,
    alignSelf: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 5,
    // margin: 5,
    // textAlign:'justify'
  },
  cardTitle: {
    color: "black",
    fontSize: 18,
    alignSelf: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: 5,
    margin: 5,
    fontWeight: "bold",
    textAlign: "justify",
  },
};
