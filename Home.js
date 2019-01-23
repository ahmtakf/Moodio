import React, { Component } from 'react'
import { Text, View, Button } from 'react-native'

class Home extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {accessToken:this.props.navigation.state.params.data.response.access_token};
    }

    componentDidMount(){
        this.setState({accessToken:this.props.navigation.state.params.data.response.access_token});

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
            this.setState({playlist:responseJson});
        })
        .catch((error) =>{
            console.error(error);
        });

    }

    render()
    {
        return (
            <View>
                <Text>Welcome {this.state.display_name} !</Text>
                <Text>Sad playlist for you!</Text>
                <Text>{JSON.stringify(this.state.playlist)}</Text>
            </View>
        ); 
    }

}

export default Home;