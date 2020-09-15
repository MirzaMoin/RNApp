import React, { Component } from 'react';
import {
    View,
    SafeAreaView,
    AsyncStorage,
    ActivityIndicator,
    TouchableOpacity,
    Text
} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import WebView from 'react-native-webview'
import { ScreenHeader } from '../widget/ScreenHeader';
import GlobalAppModel from './../model/GlobalAppModel';
import { parseColor } from './../utils/utility';
import LoadingScreen from './../widget/LoadingScreen';

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
            //console.log(`RenderRing loading Image ${GlobalAppModel.willShownLoadingImage} : ${GlobalAppModel.getLoadingImage()}`)
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
                    title={this.props.navigation.state.params.title}
                    userPoint={this.state.userPoint || '0'}
                    isGoBack={true}
                    onGoBack={() => {
                        this.props.navigation.goBack();
                        //this.wv.goBack();
                    }} />
                <View style={{ flex: 1 }}>
                    <WebView
                        ref={(ref) => this.wv = ref}
                        source={{
                            uri: this.props.navigation.state.params.webURL
                        }}
                        onLoadStart={() => this.setState({ isLoading: true })}
                        onLoad={() => this.setState({ isLoading: false })}
                        onLoadEnd={() => this.setState({ isLoading: false })}
                        onError={() => {
                            //console.log('faytu')
                        }}
                        onNavigationStateChange={navState => {
                            this.setState({
                                setCanGoBack: navState.canGoBack,
                                setCanGoForward: navState.canGoForward,
                                setCurrentUrl: navState.url,
                            });

                        }}
                    />
                    {this._showLoading()}
                </View>
                <View style={[styles.tabBarContainer, {backgroundColor:parseColor(GlobalAppModel.footerColor)}]}>
                    <TouchableOpacity
                        disabled={!this.state.setCanGoBack}
                        onPress={() => {
                            if (this.state.setCanGoBack) {
                                this.wv.goBack()
                            }
                        }}>
                        <MDIcon name={'arrow-back'} style={{ color: this.state.setCanGoBack ? 'white' : 'rgba(180,180,180,1)', fontSize: 25, padding: 10 }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.wv.reload();
                        }}>
                        <MDIcon name={'refresh'} style={{ color: 'white', fontSize: 25, padding: 10 }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={!this.state.setCanGoForward}
                        onPress={() => {
                            if (this.state.setCanGoForward) {
                                this.wv.goForward()
                            }
                        }}>
                        <MDIcon name={'arrow-forward'} style={{ color: this.state.setCanGoForward ? 'white' : 'rgba(180,180,180,1)', fontSize: 25, padding: 10 }} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = {
    tabBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#012345'
    },
}
