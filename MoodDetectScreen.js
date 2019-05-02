import React, { Component } from 'react'
import { Image, Text, Dimensions, ScrollView, View, Button, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flex: 1
    }
    });

class MoodDetect extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {check:this.props.navigation.state.params.data.mood, mood:this.props.navigation.state.params.data.mood, img:this.props.navigation.state.params.data.img};    }

    componentDidMount(){
        this.setState({check:this.props.navigation.state.params.data.mood, mood:this.props.navigation.state.params.data.mood, img:this.props.navigation.state.params.data.img});
    }

    render()
    {
        return (
            <ScrollView >
                <Image style={{ width:150, height: 150, resizeMode: 'contain', }} source={{ uri: 'data:image/png;base64,'+this.state.img, }}></Image>
                <Text>Result: {JSON.stringify(this.state.mood)}</Text>
            </ScrollView >
        ); 
    }

}

export default MoodDetect;