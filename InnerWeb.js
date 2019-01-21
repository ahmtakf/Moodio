import React, { Component } from 'react'
import { StyleSheet, Text, View } from "react-native";
import { WebView } from 'react-native-webview';

class InnerWeb extends React.Component{

    
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <WebView
            source={{ uri: "https://accounts.spotify.com/authorize?client_id=c4ed4e112a58428b9e4bab08f4fefd8c&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=34fFs29kd09" }}
            style={{ marginTop: 10, width: 400 }}
            onNavigationStateChange={this.props.parentReference}
            onLoadProgress={e => console.log(e.nativeEvent.progress)}
            />
        );
    }

}

export default InnerWeb;