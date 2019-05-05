import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import logo from '../../assets/icons/app-name-icon.png';
import CookieManager from 'react-native-cookies';
import Spotify from 'rn-spotify-sdk';

console.log(logo);

class LoginScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {spotifyInitialized: false};
    this.spotifyLoginButtonWasPressed = this.spotifyLoginButtonWasPressed.bind(
        this);
  }

  goToTabs() {
    this.props.navigation.navigate('Tabs');
  }

  async initializeIfNeeded() {
    // initialize Spotify if it hasn't been initialized yet
    if (!await Spotify.isInitializedAsync()) {
      // initialize spotify
      const spotifyOptions = {
        'clientID': 'c4ed4e112a58428b9e4bab08f4fefd8c',
        'sessionUserDefaultsKey': '7865065897654383bac631a451d42900',
        'redirectURL': 'https://thawing-ravine-99621.herokuapp.com/callback/',
        'scopes': [
          'user-read-private',
          'user-read-email'],
      };
      const loggedIn = await Spotify.initialize(spotifyOptions);
      // update UI state
      this.setState({
        spotifyInitialized: true,
      });
      // handle initialization
      if (loggedIn) {
        this.goToTabs();
      }
    } else {
      // update UI state
      this.setState({
        spotifyInitialized: true,
      });
      // handle logged in
      if (await Spotify.isLoggedInAsync()) {
        this.goToTabs();
      }
    }
  }

  componentDidMount() {
    this.initializeIfNeeded().catch((error) => {
      Alert.alert('Error', error.message);
      Spotify.logout();
    });
  }

  spotifyLoginButtonWasPressed() {
    // log into Spotify
    Spotify.login().then((loggedIn) => {
      if (loggedIn) {
        // logged in
        this.goToTabs();
      } else {
        // cancelled
      }
    }).catch((error) => {
      // error
      Alert.alert('Error', error.message);
      CookieManager.clearAll();
    });
  }

  render() {
    if (!this.state.spotifyInitialized) {
      return (

          <View style={styles.container}>
            <ActivityIndicator animating={true} style={styles.loadIndicator}>
            </ActivityIndicator>
            <Text style={styles.loadMessage}>
              Loading...
            </Text>
          </View>
      );
    } else {
      return (
          <View style={styles.container}>
            <Image style={{width: 300, height: 70}}
                   resizeMode="cover"
                   source={require('../../assets/icons/app-name-icon.png')}
                //source={{ uri: './logo.png' }}
            />
            <Text style={styles.text}>LISTEN TO YOUR MOOD</Text>
            <Text style={styles.loginText}>Login with your Spotify
              account</Text>
            <Text/>
            <TouchableHighlight onPress={this.spotifyLoginButtonWasPressed}
                                style={styles.spotifyLoginButton}>
              <Text style={styles.spotifyLoginButtonText}>Login</Text>
            </TouchableHighlight>
          </View>
      );
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
  },
  logoContainer: {
    flex: 0,
    height: undefined,
    width: undefined,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
  },
  text: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#431540',
    marginTop: '10%',
    fontSize: 25,
  },
  loginText: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#431540',
    marginTop: '25%',
    fontSize: 15,
  },
  spotifyLoginButton: {
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'rgb(195, 125, 198)',
    overflow: 'hidden',
    width: 200,
    height: 40,
    margin: 20,
  },
  spotifyLoginButtonText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
});

export default LoginScreen;
