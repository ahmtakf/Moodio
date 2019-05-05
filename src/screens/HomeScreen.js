import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CookieManager from 'react-native-cookies';
import Spotify from 'rn-spotify-sdk';
import D from '../dimensions';
import CoverFlowItem from '../coverflow-item';

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentSession: Spotify.getSession(),
      username: 'USER',
      images: [{url: 'https://emgroupuk.com/wp-content/uploads/2018/06/profile-icon-9.png'}],
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.openCameraScreen = this.openCameraScreen.bind(this);
    this.openAudioScreen = this.openAudioScreen.bind(this);
  }

  componentDidMount() {
    Spotify.getMe().then(result => {
      this.setState({username: result.display_name});
    });
    Spotify.sendRequest('v1/recommendations', 'GET', {'seed_genres': 'sad'},
        false).then((responseJson) => {
      console.log(responseJson);
      this.setState({playlist: responseJson.tracks.map(track => track.name)}); //
    }).catch((error) => {
      console.error(error);
    });

  }

  handleLogout(event) {

    this.props.navigation.navigate('LoginScreen');
    CookieManager.clearAll();
    console.log('Logout');
    Spotify.logout();
    console.log('logout finish');
    event.preventDefault();
  }

  openCameraScreen(event) {
    this.props.navigation.navigate('CameraScreen');

    event.preventDefault();
  }

  openAudioScreen(event) {
    this.props.navigation.navigate('AudioScreen');

    event.preventDefault();
  }

  renderCoverflow() {
    const width = D.width * 2.8 / 5,
        height = D.width * 2.8 / 5;
    return (
        <ScrollView pagingEnabled={true} horizontal={true}>
          <CoverFlowItem page_width={D.width} width={width} height={height}
                         source={require('../../assets/images/1.jpg')}/>
          <CoverFlowItem page_width={D.width} width={width} height={height}
                         source={require('../../assets/images/2.jpeg')}/>
          <CoverFlowItem page_width={D.width} width={width} height={height}
                         source={require('../../assets/images/3.jpg')}/>
          <CoverFlowItem page_width={D.width} width={width} height={height}
                         source={require('../../assets/images/16.jpg')}/>
          <CoverFlowItem page_width={D.width} width={width} height={height}
                         source={require('../../assets/images/17.jpeg')}/>
          <CoverFlowItem page_width={D.width} width={width} height={height}
                         source={require('../../assets/images/18.jpg')}/>
        </ScrollView>
    );
  }

  renderProfileInfo() {
    return (
        <View style={styles.container}>
          <Image
              style={{
                width: 60,
                height: 60,
                position: 'absolute',
                left: 10,
                top: 5,
                borderRadius: 60 / 2,
              }}
              source={{uri: this.state.images[0].url}}
          />
          <Text style={styles.text1}> {this.state.username}</Text>
        </View>

    );
  }

  renderLogout() {
    return (
        <TouchableOpacity onPress={this.handleLogout} style={{
          position: 'absolute',
          backgroundColor: '#000000',
          alignItems: 'center',
          justifyContent: 'center',
          height: 50,
          width: 50,
          borderRadius: 100,
          right: 25,
          top: 25,
        }}>
          <Text style={{color: '#EFEFEF'}}>Logout</Text>
        </TouchableOpacity>

    );
  }

  render() {
    return (

        <View style={styles.container}>
          <ScrollView style={styles.sv}>
            <Text style={{
              justifyContent: 'center',
              alignItems: 'center',
              color: '#EFEFEF',
              position: 'absolute',
              left: 90,
              top: 6,
              fontSize: 12,
              fontWeight: '100',
            }}> USER </Text>
            {this.renderProfileInfo()}
            {this.renderLogout()}

            <Text style={styles.textFirst}> Recommended for You</Text>
            {this.renderCoverflow()}
            <Text style={styles.text}> Favorite Singers</Text>
            {this.renderCoverflow()}
            <Text style={styles.text}> Recently Played</Text>
            {this.renderCoverflow()}
          </ScrollView>

        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#000000',
  },
  container2: {
    position: 'absolute',
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
  },
  textFirst: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#EFEFEF',
    marginTop: '10%',
    fontSize: 25,
    fontWeight: '700',
    left: 50,
    paddingTop: 70,
  },
  text1: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#EFEFEF',
    position: 'absolute',
    left: 90,
    top: 20,
    fontSize: 25,
    fontWeight: '700',

  },
  text: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#EFEFEF',
    marginTop: '10%',
    fontSize: 25,
    fontWeight: '700',
    left: 50,
  }
  ,
  sv: {
    paddingTop: 22,
  },

});

export default HomeScreen;
