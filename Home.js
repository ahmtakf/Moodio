import React, { Component } from 'react'
import { Text, Dimensions, View, Button, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    button: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    }
    });

class Home extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {accessToken:this.props.navigation.state.params.data.response.access_token};
        this.handleLogout = this.handleLogout.bind(this);
        this.openCameraScreen = this.openCameraScreen.bind(this);
        this.openAudioScreen = this.openAudioScreen.bind(this);
    }

    componentDidMount(){
        this.setState({accessToken:this.props.navigation.state.params.data.response.access_token});
        console.log(this.state.accessToken);
        fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
                'Accept':'application/json',
                'Authorization': 'Bearer ' + this.state.accessToken
            }
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState(responseJson);
        })
        .catch((error) =>{
            console.error(error);
        });

        fetch('https://api.spotify.com/v1/recommendations?' + 
        'seed_genres=sad', {
            method: 'GET',
            headers: {
                'Accept':'application/json',
                'Authorization': 'Bearer ' + this.state.accessToken
            }
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({playlist:responseJson.tracks.map(track => track.name)});
        })
        .catch((error) =>{
            console.error(error);
        });

    }

    handleLogout(event) {
        
        this.props.navigation.navigate('LoginScreen');

        event.preventDefault();
    }

    openCameraScreen(event){
        this.props.navigation.navigate('CameraScreen');

        event.preventDefault();
    }
    
    openAudioScreen(event){
        this.props.navigation.navigate('AudioScreen');

        event.preventDefault();
    }

    render()
    {
        return (
            <View>
                <Button style={styles.button} onPress={this.handleLogout} title="Logout"></Button>
                <Button style={styles.button} onPress={this.openCameraScreen} title="Take Photo"></Button>
                <Button style={styles.button} onPress={this.openAudioScreen} title="Record Voice"></Button>
                <Text>Welcome {this.state.accessToken} !</Text>
                <Text>Sad playlist for you!</Text>
                <Text>{JSON.stringify(this.state.playlist)}</Text>
            </View>
        ); 
    }

}

export default Home;