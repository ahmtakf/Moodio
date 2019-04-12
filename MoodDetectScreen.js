import React, { Component } from 'react'
import { Image, Text, Dimensions, View, Button, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        width: 0,
        flexGrow: 1,
        flex: 1,
    }
    });

class MoodDetect extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {check:this.props.navigation.state.params.data.mood, mood:this.props.navigation.state.params.data.mood.responses[0].faceAnnotations[0], img:this.props.navigation.state.params.data.img};
    }

    componentDidMount(){
        this.setState({check:this.props.navigation.state.params.data.mood, mood:this.props.navigation.state.params.data.mood.responses[0].faceAnnotations[0], img:this.props.navigation.state.params.data.img});
        
    }

    render()
    {
        return (
            <View>
                <Image style={{ width:150, height: 150, resizeMode: 'contain', }} source={{ uri: 'data:image/png;base64,'+this.state.img, }}></Image>
                <Text>joyLikelihood: {JSON.stringify(this.state.mood.joyLikelihood)}</Text>
                <Text>sorrowLikelihood: {JSON.stringify(this.state.mood.sorrowLikelihood)}</Text>
                <Text>angerLikelihood: {JSON.stringify(this.state.mood.angerLikelihood)}</Text>
                <Text>surpriseLikelihood: {JSON.stringify(this.state.mood.surpriseLikelihood)}</Text>
                <Text>underExposedLikelihood: {JSON.stringify(this.state.mood.underExposedLikelihood)}</Text>
                <Text>blurredLikelihood: {JSON.stringify(this.state.mood.blurredLikelihood)}</Text>
                <Text>headwearLikelihood: {JSON.stringify(this.state.mood.headwearLikelihood)}</Text>
                <Text>Check: {JSON.stringify(this.state.mood)}</Text>
                <Text>Img: {JSON.stringify(this.state.img)}</Text>
            </View>
        ); 
    }

}

export default MoodDetect;