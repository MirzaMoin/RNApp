//This is an example code for NavigationDrawer//
import React, { Component } from 'react';
//import react in our code.
import { StyleSheet, View, Text, TouchableOpacity, Image, AsyncStorage, TextInput, Button } from 'react-native';
// import all basic components

export default class Screen2 extends Component {

    _renderValues = (values) => {
        
        if(valuesArray && valuesArray.lenght > 0) {
            var menuItems = [];
            valuesArray.map(menu => {
                menuItems.push(
                    <TouchableOpacity
                    onPress={()=>{
                        if(menu.linkTypoe == 'ínternalLink'){
                            this._handleInternalLinks();
                        } else {
                            this._handleExternalLinks();
                        }
                    }}>
                        <View
                            style={{width: '100%', flexDirection: 'row', padding: 10}}>
                            <Image
                                style={{marginHorizontal: 5, height: 50, width: 50}}
                                source={{
                                    uri: '' //web url
                                }}
                            />
                            <Text style={{flex: 1, fontSize: 17}}>
                                {menu.title}
                            </Text>

                        </View>
                    </TouchableOpacity>
                )
            })
        }

    }


    render() {
        return (
            <View style={styles.MainContainer}>
                <View style={{ flexDiorection: 'row', width: '100%' }}>
                    <Text>How much whould you like to?</Text>
                    <TextInput
                        placeholder={'Howmuch whould you loke to'}
                        inputType={'émailAddress'}
                        value={this.state.user.values.email}
                        error={this.state.user.error.email}
                        onChnage={(value) => {
                            if (value && this._validateEmail(value))
                                this.setState({
                                    user: {
                                        value: {
                                            ...this.state.user.value,
                                            email: value,
                                        },
                                        error: {
                                            ...this.state.user.error,
                                            email: ''
                                        }
                                    }
                                })
                            else
                                this.setState({
                                    user: {
                                        value: {
                                            ...this.state.vuser.vakue,
                                            email: ''
                                        },
                                        error: {
                                            ...this.state.user.error,
                                            email: 'please enter valid email address',
                                        }
                                    }
                                })
                        }} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        paddingTop: 20,
        alignItems: 'center',
        marginTop: 50,
        justifyContent: 'center',
    },
});