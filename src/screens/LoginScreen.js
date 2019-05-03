import React from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import {Buffer} from 'buffer';
import InnerWeb from '../InnerWeb';
import logo from '../../assets/icons/app-name-icon.png';
import CookieManager from 'react-native-cookies';

const redirect_uri = 'https://thawing-ravine-99621.herokuapp.com/callback/';

console.log(logo);

class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {loginClick: false, error: ''};
    this.handleLogin = this.handleLogin.bind(this);
    this.onNavigationChange = this.onNavigationChange.bind(this);
  }

  componentDidMount(){
    CookieManager.clearAll();
  }

  handleLogin(event) {

    this.setState({loginClick: 'true'});

    event.preventDefault();
  }

  onNavigationChange(webViewState) {
    //Check if the process is successfully redirected
    if (webViewState.url.substring(0, redirect_uri.length) === redirect_uri) {
      if (webViewState.url.substring(redirect_uri.length, redirect_uri.length+5) === 'error') {
        this.setState(
            {loginClick: false, error: webViewState.url.substring(redirect_uri.length+6)});
        CookieManager.clearAll();
      } else {
        const usercode = webViewState.url.substring(redirect_uri.length+6,
            webViewState.url.length - 17);
        console.log(usercode);
        //Get tokens for user
        fetch(
            'https://accounts.spotify.com/api/token?grant_type=authorization_code&code=' +
            usercode
            + '&redirect_uri=' + redirect_uri, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(
                    'c4ed4e112a58428b9e4bab08f4fefd8c' + ':' +
                    '7865065897654383bac631a451d42900').toString('base64'),
              },
            }).then((response) => response.json()).then((responseJson) => {
          this.setState({loginClick: false, error: ''});
          console.log(responseJson);
          this.props.navigation.navigate('Tabs',
              {data: {usercode: usercode, response: responseJson}});

        }).catch((error) => {
          this.setState({loginClick: false, error: error});
          console.error(error);
        });
      }
    }
  }

  render() {
    if (!this.state.loginClick) {
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
            <Button onPress={this.handleLogin} title="Login"
                    color="#431540"/>
          </View>
      );
    } else {
      return (
          <View style={styles.container}>
            <InnerWeb parentReference={this.onNavigationChange}>
            </InnerWeb>
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
  button: {
    padding: 5,
    height: 50,
    width: 50,  //The Width must be the same as the height
    borderRadius: 100, //Then Make the Border Radius twice the size of width or Height
    backgroundColor: 'rgb(195, 125, 198)',

  },
});

export default LoginScreen;
