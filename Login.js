import React, { Component } from 'react'
import { Text, View, Linking, Button } from 'react-native'
import InnerWeb from './InnerWeb';
import { Buffer } from 'buffer'
import url from 'url';

class Login extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {message:'', error:''};
        this.handleLogin = this.handleLogin.bind(this);
        this.onNavigationChange = this.onNavigationChange.bind(this);
    }

    handleLogin(event) {

        this.setState({message:'hey'});
        
        event.preventDefault();
    }

    onNavigationChange(webViewState) {
        if (webViewState.url.substring(0,28) === 'https://example.com/callback'){
            if (webViewState.url.substring(29,34) === 'error'){
                this.setState({message:'', error:webViewState.url.substring(35)});
            }
            else{
                const usercode = webViewState.url.substring(34, webViewState.url.length - 17)
                //Get tokens for user
                fetch('https://accounts.spotify.com/api/token?grant_type=authorization_code&code=' + usercode 
                + '&redirect_uri=https://example.com/callback', {
                    method: 'POST',
                    headers: {
                      'Accept':'application/json',
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Authorization': 'Basic ' + Buffer.from("c4ed4e112a58428b9e4bab08f4fefd8c" + ':' + "7865065897654383bac631a451d42900").toString('base64')
                    }
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({message:'', error:usercode});
                    this.props.navigation.navigate('HomeScreen', { data: { usercode: usercode, response: responseJson} });

                })
                .catch((error) =>{
                    console.error(error);
                });
            }
        }
    }

    render()
    {
        if (this.state.message === ''){
            return (
                <View>
                    <Text>Listen your mood!</Text>
                    <Text>Login with your Spotify account-></Text>
                    <Button onPress={this.handleLogin} title="Login"></Button>
                    <Text>message: {this.state.message}</Text>
                    <Text>error: {JSON.stringify(this.state.error)}</Text>
                </View>
            ); 
        }
        else{
            return (
                <View>
                    <InnerWeb parentReference = {this.onNavigationChange}>
                    </InnerWeb>
                </View>
            ); 
        }
    }

}

export default Login;