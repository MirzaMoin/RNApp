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
  FlatList,
  TextInput,
  Button,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {BottomNavigationTab} from './../widget/BottomNavigationTab';

export default class TransferPointScreen extends Component {
  constructor() {
    console.log('Constructor called');
    super();
    this.state = {
      title: 'HomeScreen',
      tabIndex: 1,
    };
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={{hegith: 150}}>
          <Image
            style={{height: 150}}
            source={{
              uri:
                'http://preview.byaviators.com/template/superlist/assets/img/tmp/agent-2.jpg',
            }}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
        </View>
        <View style={{padding: 10, flex: 1, justifyContent: 'center'}}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              marginBottom: 20,
              fontFamily: 'helvetica',
              textAlign: 'center',
            }}>
            How many are you transfering?
          </Text>
          <Text style={{padding: 10}}>Enter Point Amount</Text>
          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              borderColor: 'rgba(153,153,153,0.5)',
              borderWidth: 2,
              padding: 10,
              borderRadius: 10,
            }}>
            <TextInput
              style={{fontSize: 25, textAlign: 'center', fontWeight: 'bold'}}
              placeholder="50 PTS"
            />
          </View>

          <View
            style={{
              margin: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{flex: 1, flexDirection: 'row', position: 'absolute'}}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(153,153,153,0.5)',
                  height: 2,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: 18,
                backgroundColor: '#fff',
                fontWeight: 'bold',
                paddingLeft: 25,
                paddingRight: 25,
              }}>
              Transfering to
            </Text>
          </View>

          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              borderColor: 'rgba(153,153,153,0.5)',
              borderWidth: 2,
              padding: 10,
              borderRadius: 10,
            }}>
            <TextInput
              style={{fontSize: 17, textAlign: 'center', fontWeight: 'bold'}}
              placeholder="Email, mobile number or Member CardID"
            />
          </View>

          <TouchableOpacity
            style={{
              width: 150,
              marginTop: 30,
              alignSelf: 'flex-end',
              marginRight: 10,
            }}>
            <Text
              style={{
                backgroundColor: '#012340',
                textAlign: 'center',
                fontFamily: 'helvetica',
                fontSize: 16,
                borderRadius: 10,
                color: 'white',
                padding: 15,
              }}>
              Transfer Point
            </Text>
          </TouchableOpacity>
        </View>
        <BottomNavigationTab />
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
};
