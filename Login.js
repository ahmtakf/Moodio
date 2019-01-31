import React, { Component } from 'react'
import { Text, View, StyleSheet, Linking, Button } from 'react-native'
import InnerWeb from './InnerWeb';
import { Buffer } from 'buffer'

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    loginText: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'blue',
        marginTop: '10%'
    }
  });

class Login extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {loginClick:false, error:''};
        this.handleLogin = this.handleLogin.bind(this);
        this.onNavigationChange = this.onNavigationChange.bind(this);
    }

    handleLogin(event) {

        this.setState({loginClick:'true'});
        
        event.preventDefault();
    }

    onNavigationChange(webViewState) {
        //Check if the process is successfully redirected
        if (webViewState.url.substring(0,28) === 'https://example.com/callback'){
            if (webViewState.url.substring(29,34) === 'error'){
                this.setState({loginClick:false, error:webViewState.url.substring(35)});
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
                    this.setState({loginClick:false, error:''});
                    this.props.navigation.navigate('HomeScreen', { data: { usercode: usercode, response: responseJson} });

                })
                .catch((error) =>{
                    this.setState({loginClick:false, error:error});
                    console.error(error);
                });
            }
        }
    }

    render()
    {
        if (!this.state.loginClick){
            return (
                <View style={styles.container}>
                    <Text style={styles.loginText}>Listen your mood!</Text>
                    <Text style={styles.loginText}>Login with your Spotify account-></Text>
                    <Button onPress={this.handleLogin} title="Login"></Button>
                    <Text>error: {JSON.stringify(this.state.error)}</Text>
                </View>
            ); 
        }
        else{
            return (
                <View style={styles.container}>
                    <InnerWeb parentReference = {this.onNavigationChange}>
                    </InnerWeb>
                </View>
            ); 
        }
    }
    
}

export default Login;