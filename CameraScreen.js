import React, { Component } from 'react'
import { Text, Dimensions, View, Button, StyleSheet } from 'react-native'
import Camera from 'react-native-camera';

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
          margin: 40}
    });

class CameraScreen extends React.Component{

    constructor(props)
    {
        super(props);
    }

    takePicture() { 
        this.camera.capture().then((data) => console.log(data)).catch(err => console.error(err));
    }

    render()
    {
        return (
            <Camera ref={cam => { this.camera = cam; }} style={styles.preview} aspect={Camera.constants.Aspect.fill}> 
                <Text style={styles.capture} onPress={this.takePicture.bind(this)}> [CAPTURE]
                </Text>
            </Camera>
        ); 
    }

}

export default CameraScreen;