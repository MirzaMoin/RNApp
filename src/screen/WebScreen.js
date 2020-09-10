import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    SafeAreaView,
    TouchableOpacity,
    ImageBackground,
    AsyncStorage,
    ActivityIndicator,
} from 'react-native';
import WebView from 'react-native-webview'
import { ScreenHeader } from '../widget/ScreenHeader';
import GlobalAppModel from './../model/GlobalAppModel';
import ScrollableTabView, {
    ScrollableTabBar,
} from 'react-native-scrollable-tab-view';

export default class WebScreen extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor() {
        super();
        this.state = {

        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('didFocus', () => {
            this.setState({
                isLoading: true,
            });
            this._getStoredData();
        });
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    _getStoredData = async () => {
        try {
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
        } catch (error) {
            console.log(error)
        }
    };

    _showLoading = () => {
        if (this.state.isLoading) {
            console.log(`RenderRing loading Image ${GlobalAppModel.willShownLoadingImage} : ${GlobalAppModel.getLoadingImage()}`)
            return (
                <View style={{ flex: 1, position: 'absolute', alignItems: 'center', justifyContent: 'center', alignContent: 'center', alignSelf: 'center', height: '100%' }}>
                    <ActivityIndicator size={'large'} style={{ alignSelf: 'center' }} />
                </View>
            )
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
                <ScreenHeader
                    navigation={this.props.navigation}
                    title={this.props.title || 'Web Browsing'}
                    userPoint={this.state.userPoint || '0'} 
                    isGoBack={true}
                    onGoBack={() => {
                        //this.props.navigation.state.params.onGoBack();
                        console.log(`Working back`)
                        this.wv.goBack();
                    }}/>
                <View style={{ flex: 1 }}>
                    <WebView
                    ref={(ref) => this.wv= ref}
                        source={{
                            uri: this.props.webURL || 'https://www.google.com'
                        }}
                        onLoadStart={() => this.setState({ isLoading: true })}
                        onLoad={() => this.setState({ isLoading: false })}
                        onLoadEnd={() => this.setState({ isLoading: false })}
                        onError={()=>{
                            console.log('faytu')
                        }}
                    />
                    {this._showLoading()}
                </View>
            </SafeAreaView>
        );
    }
}
