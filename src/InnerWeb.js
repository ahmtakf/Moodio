import React from 'react';
import {WebView} from 'react-native-webview';

// import { StyleSheet, Text, View } from "react-native";

const redirect_uri = 'https://thawing-ravine-99621.herokuapp.com/callback/';

class InnerWeb extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <WebView
            source={{uri: 'https://accounts.spotify.com/authorize?client_id=c4ed4e112a58428b9e4bab08f4fefd8c&response_type=code&redirect_uri='+redirect_uri+'&scope=user-read-private%20user-read-email&state=34fFs29kd09'}}
            style={{marginTop: 10, width: 400, height: 800}}
            onNavigationStateChange={this.props.parentReference}
            onLoadProgress={e => console.log(e.nativeEvent.progress)}
        />
    );
  }

}

export default InnerWeb;
