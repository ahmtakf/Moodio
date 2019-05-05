import React from 'react';
import {Image, Dimensions, ScrollView, StyleSheet, Text} from 'react-native';
import Spotify from 'rn-spotify-sdk';

class MoodDetect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mood: this.props.navigation.state.params.data.mood,
      img: this.props.navigation.state.params.data.img,
    };
  }

  componentDidMount() {
    this.setState({
      mood: this.props.navigation.state.params.data.mood,
      img: this.props.navigation.state.params.data.img,
    });

    Spotify.sendRequest('v1/me/top/artists', 'GET', {limit:5},
    false).then((responseJson) => {
      console.log(responseJson);
      this.setState({topArtists: responseJson.items.map(item => item.name)});

      let artistIDs = responseJson.items.map(item => item.id);
      let artists = "";
      artistIDs.forEach(function(element) {
        console.log(element);
        artists = artists + element + ",";
      });
      console.log(artists);

      let anger = parseFloat(this.state.mood[0].FaceAttributes.emotion.anger);
      let happiness = parseFloat(this.state.mood[0].FaceAttributes.emotion.happiness);
      let neutral = parseFloat(this.state.mood[0].FaceAttributes.emotion.neutral);
      let sadness = parseFloat(this.state.mood[0].FaceAttributes.emotion.sadness);
      let surprise = parseFloat(this.state.mood[0].FaceAttributes.emotion.surprise);
      console.log(anger);
      console.log(happiness);
      console.log(neutral);
      console.log(sadness);
      console.log(surprise);

      let energy = (5*anger+5*happiness+3*neutral+2*sadness+6*surprise)/6.0;
      console.log(energy);

      let valence = (1*anger+5*happiness+3*neutral+0*sadness+4*surprise)/6.0;
      console.log(valence);

      Spotify.sendRequest('v1/recommendations', 'GET', {'seed_artists': artists, 'target_energy': energy, 'target_valence': valence},
            false).then((responseJson) => {
          console.log(responseJson);
          this.setState({playlist: responseJson.tracks.map(track => track.name)}); //
        }).catch((error) => {
          console.error(error);
        });
    }).catch((error) => {
      console.error(error);
    });

  }

  render() {
    return (
        <ScrollView>
          <Image style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width, resizeMode: 'contain'}}
            source={{
              uri: this.state.img,
            }}/>
          <Text>Playlist: {JSON.stringify(this.state.playlist)}</Text>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flex: 1,
  },
});

export default MoodDetect;
