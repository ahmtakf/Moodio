import React, { Component } from 'react'
import { Text, Dimensions, View, Button, StyleSheet } from 'react-native'
import Camera from 'react-native-camera';
import * as GoogleVisionAPI from './GoogleVisionAPI';

const styles = StyleSheet.create({
    preview: { 
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center', 
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width},
    capture: { 
        flex: 0, 
        backgroundColor: '#fff', 
        borderRadius: 5,
         color: '#000', 
         padding: 10,
          margin: 40},
    circle: {
        width: (Dimensions.get('window').width-100),
        height: (Dimensions.get('window').height/2),
        borderRadius: (Dimensions.get('window').width-100)/2,
        borderWidth: 1,
        borderColor: 'black',}
    });

class CameraScreen extends React.Component{

    constructor(props)
    {
        super(props);
    }

    takePicture() { 
        this.camera.capture().then((data) => {
            GoogleVisionAPI.detectMood(data.data).then((mood)=>{
                console.log(mood);
                this.props.navigation.navigate('MoodDetectScreen', { data: { img:data.data, mood: mood} });
            });}
        ).catch(err => console.error(err));
    }

    render()
    {
        return (
            <Camera ref={cam => { this.camera = cam; }} style={styles.preview} aspect={Camera.constants.Aspect.fill} type='front' captureTarget={Camera.constants.CaptureTarget.memory} fixOrientation ={true} > 
                <View style={styles.circle} />
                <Text style={styles.capture} onPress={this.takePicture.bind(this)}> [CAPTURE]
                </Text>
            </Camera>
        ); 
    }

}

export default CameraScreen;