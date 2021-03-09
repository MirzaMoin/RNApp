import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    View,
    Text,
    AsyncStorage,
    Alert,
    ScrollView, FlatList,
    Dimensions,
    SafeAreaView,
    Platform,
    StatusBar,
    ImageBackground,
    TouchableOpacity,
    Modal,
    TouchableHighlight
} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import { makeRequest } from './../api/apiCall';
import APIConstant from './../api/apiConstant';
import { ScreenHeader } from '../widget/ScreenHeader';
import ImageLoader from './../widget/ImageLoader';
import BottomNavigationTab from './../widget/BottomNavigationTab';
import LoadingScreen from '../widget/LoadingScreen';
import GlobalAppModel from '../model/GlobalAppModel';
// import ImageLoader from './../widget/ImageLoader';
import ImageViewer from 'react-native-image-zoom-viewer';

import ScreenOrientation, { PORTRAIT, LANDSCAPE, } from "react-native-orientation-locker/ScreenOrientation";
import Orientation from 'react-native-orientation-locker';
import { set } from 'react-native-reanimated';

var loadingImage = '';
// Orientation.lockToLandscape();
const maxWidth = Dimensions.get('window').width;
// const imageHeight = (maxWidth / 16) * 9;

export default class SpinWheelScreen extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor() {
        super();
        this.state = {
            isLoading: true,
            OrientationStatus: '',
            Height_Layout: '',
            Width_Layout: '',
            spin_btn: true,
            visibleIamge: false,
            chk_spin: 1,
            display_border: false,
        }
    }
    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            loadingImage = GlobalAppModel.getLoadingImage();
            this.setState({
                isLoading: true,
                // chk_spin: true,
            });
            this.DetectOrientation();
        });
    }

    componentWillUnmount() {
        Orientation.lockToPortrait();
        this.focusListener.remove();
    }
    DetectOrientation() {
        if (this.state.Width_Layout > this.state.Height_Layout) {
            // Write Your own code here, which you want to execute on Landscape Mode.
            this.setState({
                OrientationStatus: 'LandscapeMode'
            });
        }
        else {
            // Write Your own code here, which you want to execute on Portrait Mode.
            this.setState({
                OrientationStatus: 'PortraitMode'
            });
        }
    }
    _RenderBodyPortrait() {
        return (
            <>
                <SafeAreaView style={{ flex: 1 }}>
                    <ScreenHeader
                        navigation={this.props.navigation}
                        title={'Spin Wheel'}
                        userPoint={GlobalAppModel.redeemablePoint}
                        style={{ width: '100%' }} />
                    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignSelf: 'center' }}>
                        {
                            Platform.OS == 'ios' ?
                                <Text> Please Rotate your device in Landscape... </Text>
                                :
                                <>
                                    <Text style={{ fontSize: 20 }}> Please Rotate your device in Landscape... </Text>
                                    {/* <Text style={{fontSize:16}}> (Or check your auto rotation is enabled or not.)</Text> */}
                                </>
                        }
                        <Image source={{ uri: 'https://images.squarespace-cdn.com/content/v1/57ea79ec03596e57c7ae156c/1541097906013-CA94BGCJ74JBUQGK9XDB/ke17ZwdGBToddI8pDm48kKbvziBh9F3O3YCZyXQS1alZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVEmlWaBzXugmiTWPEqfELu4sCw4hgGjDRQg6rUv4Ix8qmQ6l2WM7tn7mqHTODzkmeM/rotate.gif' }} style={{ height: 300, width: 300, alignSelf: 'center' }} />
                        <Text style={{ fontSize: 16 }}> Or check your auto rotation is enabled or not...</Text>
                    </View>
                    <BottomNavigationTab navigation={this.props.navigation} />
                </SafeAreaView>
            </>
        )
    }
    // StopSpin() {
    //     this.setState({ spin_btn: !this.state.spin_btn })
    // }
    // ShowWithDelay = () => {
    //     this.setState({ spin_btn: !this.state.spin_btn })
    //     setTimeout(function () {
    //         //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
    //         // Alert.alert("Alert Shows After 5 Seconds of Delay.")
    //         StopSpin()
    //     }, 5000);
    // }


    _RenderItems() {
        RandomNumber1 = Math.floor(Math.random() * 15) + 0
        RandomNumber2 = Math.floor(Math.random() * 15) + 0
        RandomNumber3 = Math.floor(Math.random() * 15) + 0
        return (
            <>
                <View style={{ flex: 1, }}>
                    {RandomNumber1 == 0 ? <Image source={require('../../Image/sloticons/icon_0.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber1 == 1 ? <Image source={require('../../Image/sloticons/icon_1.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber1 == 2 ? <Image source={require('../../Image/sloticons/icon_2.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber1 == 3 ? <Image source={require('../../Image/sloticons/icon_3.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber1 == 4 ? <Image source={require('../../Image/sloticons/icon_4.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber1 == 5 ? <Image source={require('../../Image/sloticons/icon_5.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber1 == 6 ? <Image source={require('../../Image/sloticons/icon_6.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber1 == 7 ? <Image source={require('../../Image/sloticons/icon_7.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber1 == 8 ? <Image source={require('../../Image/sloticons/icon_8.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber1 == 9 ? <Image source={require('../../Image/sloticons/icon_9.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber1 == 10 ? <Image source={require('../../Image/sloticons/icon_10.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber1 == 11 ? <Image source={require('../../Image/sloticons/icon_11.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber1 == 12 ? <Image source={require('../../Image/sloticons/icon_12.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber1 == 13 ? <Image source={require('../../Image/sloticons/icon_13.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber1 == 14 ? <Image source={require('../../Image/sloticons/icon_14.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber1 == 15 ? <Image source={require('../../Image/sloticons/icon_14.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}

                    {this.state.display_border ?
                        <ImageBackground source={require('../../Image/sloticons/anim_squre.gif')} style={{ height: 90, width: 90 }} >
                            {RandomNumber2 == 0 ? <Image source={require('../../Image/sloticons/icon_0.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 1 ? <Image source={require('../../Image/sloticons/icon_1.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 2 ? <Image source={require('../../Image/sloticons/icon_2.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 3 ? <Image source={require('../../Image/sloticons/icon_3.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 4 ? <Image source={require('../../Image/sloticons/icon_4.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 5 ? <Image source={require('../../Image/sloticons/icon_5.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 6 ? <Image source={require('../../Image/sloticons/icon_6.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 7 ? <Image source={require('../../Image/sloticons/icon_7.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 8 ? <Image source={require('../../Image/sloticons/icon_8.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 9 ? <Image source={require('../../Image/sloticons/icon_9.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 10 ? <Image source={require('../../Image/sloticons/icon_10.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 11 ? <Image source={require('../../Image/sloticons/icon_11.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 12 ? <Image source={require('../../Image/sloticons/icon_12.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 13 ? <Image source={require('../../Image/sloticons/icon_13.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 14 ? <Image source={require('../../Image/sloticons/icon_14.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 15 ? <Image source={require('../../Image/sloticons/icon_15.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                        </ImageBackground>
                        :
                        <>
                            {RandomNumber2 == 0 ? <Image source={require('../../Image/sloticons/icon_0.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 1 ? <Image source={require('../../Image/sloticons/icon_1.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 2 ? <Image source={require('../../Image/sloticons/icon_2.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 3 ? <Image source={require('../../Image/sloticons/icon_3.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 4 ? <Image source={require('../../Image/sloticons/icon_4.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 5 ? <Image source={require('../../Image/sloticons/icon_5.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 6 ? <Image source={require('../../Image/sloticons/icon_6.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 7 ? <Image source={require('../../Image/sloticons/icon_7.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 8 ? <Image source={require('../../Image/sloticons/icon_8.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 9 ? <Image source={require('../../Image/sloticons/icon_9.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 10 ? <Image source={require('../../Image/sloticons/icon_10.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 11 ? <Image source={require('../../Image/sloticons/icon_11.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 12 ? <Image source={require('../../Image/sloticons/icon_12.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 13 ? <Image source={require('../../Image/sloticons/icon_13.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 14 ? <Image source={require('../../Image/sloticons/icon_14.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                            {RandomNumber2 == 15 ? <Image source={require('../../Image/sloticons/icon_15.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                        </>
                    }

                    {RandomNumber3 == 0 ? <Image source={require('../../Image/sloticons/icon_0.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber3 == 1 ? <Image source={require('../../Image/sloticons/icon_1.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber3 == 2 ? <Image source={require('../../Image/sloticons/icon_2.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber3 == 3 ? <Image source={require('../../Image/sloticons/icon_3.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber3 == 4 ? <Image source={require('../../Image/sloticons/icon_4.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber3 == 5 ? <Image source={require('../../Image/sloticons/icon_5.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber3 == 6 ? <Image source={require('../../Image/sloticons/icon_6.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber3 == 7 ? <Image source={require('../../Image/sloticons/icon_7.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber3 == 8 ? <Image source={require('../../Image/sloticons/icon_8.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber3 == 9 ? <Image source={require('../../Image/sloticons/icon_9.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber3 == 10 ? <Image source={require('../../Image/sloticons/icon_10.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber3 == 11 ? <Image source={require('../../Image/sloticons/icon_11.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber3 == 12 ? <Image source={require('../../Image/sloticons/icon_12.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber3 == 13 ? <Image source={require('../../Image/sloticons/icon_13.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber3 == 14 ? <Image source={require('../../Image/sloticons/icon_14.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}
                    {RandomNumber3 == 15 ? <Image source={require('../../Image/sloticons/icon_15.png')} style={{ height: 100, width: 70, alignSelf: 'center' }} /> : null}

                </View>
            </>
        )
    }
    _RenderSpinGif() {
        return (
            <>
                <View style={{ flex: 1 }}>
                    <Image source={require('../../Image/sloticons/reel_wait.gif')} style={{ height: '94%', width: '100%', }} />
                </View>
            </>
        )
    }

    _RenderBodyLandscape = () => {
        Orientation.lockToLandscape()
        return (
            <ImageBackground source={require('../../Image/sloticons/ic_back_game.gif')} style={{ backgroundColor: 'black', height: '100%', width: '100%' }}>
                <StatusBar hidden />
                <Modal
                    animationType='slide'
                    animated={false}
                    transparent={true}
                    visible={this.state.visibleIamge}
                    onOrientationChange={'landscape'}
                    enableSwipeDown={true}
                    onSwipeDown={() => this.setState({ visibleIamge: false })}
                    supportedOrientations={['landscape']}
                    presentationStyle={'overFullScreen'}
                // onShow={() => { setTimeout(() => { this.setState({ spin_btn: true, visibleIamge: true }) }, 3000) }}
                >
                    <View style={{ flex: 1 }}>
                        <ImageBackground source={require('../../Image/sloticons/nice_try_wait.gif')} style={{ height: '100%', width: '100%', alignSelf: 'center', }} />
                        <View style={{ position: 'absolute', top: '38%', left: '35%', right: '35%', alignSelf: 'center' }}>
                            <Text style={{ alignSelf: 'center', color: 'white',}}>MAY BE NEXT TIME !</Text>
                        </View>
                        <View style={{ position: 'absolute', top: '55%', left: '35%', right: '35%', alignSelf: 'center' }}>
                            <Text style={{ alignSelf: 'center', color: 'white' }}>50 POINTS AND GIFT OFFERS</Text>
                        </View>
                        <View style={{ position: 'absolute', top: '65%', left: '35%', right: '35%', alignSelf: 'center' }}>
                            <TouchableOpacity onPress={() => { this.setState({ visibleIamge: false }), this.props.navigation.goBack() }}>
                                <ImageBackground source={require('../../Image/sloticons/button.png')} style={{ height: 50, width: 120, alignSelf: 'center', }} resizeMode={'contain'} />
                                <Text style={{ alignSelf: 'center', color: 'yellow', marginTop: -35, }}>Looser button</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <TouchableOpacity onPress={() => { this.setState({ visibleIamge: false }), this.props.navigation.goBack() }} style={{backgroundColor:'red',margin:5,padding:5}}>
                            <ImageBackground source={require('../../Image/sloticons/button.png')} style={{height:50,width:100,alignSelf:'center',}} resizeMode={'contain'}/>
                                <Text style={{ color: 'white', alignSelf: 'center',backgroundColor:"blue",marginTop:-200 }}>close</Text>
                        </TouchableOpacity> */}
                    </View>
                </Modal>
                <View style={{ height: '100%', width: '100%', }}>
                    <View style={{ height: '75%', width: '70%', marginTop: '5%', alignSelf: 'center', }}>
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            {this.state.spin_btn ? this._RenderItems() : this._RenderSpinGif()}
                            {this.state.spin_btn ? this._RenderItems() : this._RenderSpinGif()}
                            {this.state.spin_btn ? this._RenderItems() : this._RenderSpinGif()}
                            {this.state.spin_btn ? this._RenderItems() : this._RenderSpinGif()}
                            {this.state.spin_btn ? this._RenderItems() : this._RenderSpinGif()}
                            
                        </View>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', marginHorizontal: 50, justifyContent: 'center', }}>
                        {this.state.spin_btn ?
                            <TouchableOpacity onPress={() => { this.setState({ spin_btn: false }), setTimeout(() => { this.setState({ spin_btn: true, visibleIamge: true, chk_spin: 0, display_border: true }) }, 3000) }}><Image source={require('../../Image/sloticons/spin_button.png')} style={{ height: 30, width: 60 }} /></TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => console.log("spin stop")}><Image source={require('../../Image/sloticons/spin_button_disabled.png')} style={{ height: 30, width: 60, marginTop: 1 }} /></TouchableOpacity>
                        }
                    </View>
                </View>
            </ImageBackground>
        )
    }

    render() {
        Orientation.lockToLandscape();
        return (
            <View style={{ flex: 1 }}>

                <View style={{ flex: 1, }} onLayout={(event) => this.setState({
                    Width_Layout: event.nativeEvent.layout.width,
                    Height_Layout: event.nativeEvent.layout.height
                }, () => this.DetectOrientation())}>
                    {this.state.OrientationStatus == 'PortraitMode' ? this._RenderBodyPortrait() : this._RenderBodyLandscape()}

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

