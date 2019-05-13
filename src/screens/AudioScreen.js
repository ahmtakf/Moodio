import React, {Component} from 'react';
import {ActivityIndicator, Button, StyleSheet, Text, View} from 'react-native';
import {Buffer} from 'buffer';
import Permissions from 'react-native-permissions';
import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';

import {playlistFromAudio} from '../MoodDetect';

export default class App extends Component {
  sound = null;
  state = {
    audioFile: '',
    recording: false,
    loaded: false,
    paused: true,
    loading: false,
  };

  async componentDidMount() {
    await this.checkPermission();

    const options = {
      sampleRate: 160000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: 'test.wav',
    };

    AudioRecord.init(options);

    AudioRecord.on('data', data => {
      const chunk = Buffer.from(data, 'base64');
      console.log('chunk size', chunk.byteLength);
      // do something with audio chunk
    });
  }

  checkPermission = async () => {
    const p = await Permissions.check('microphone');
    console.log('permission check', p);
    if (p === 'authorized') return;
    return this.requestPermission();
  };

  requestPermission = async () => {
    const p = await Permissions.request('microphone');
    console.log('permission request', p);
  };

  start = async () => {
    console.log('start record');
    this.setState({audioFile: '', recording: true, loaded: false});
    AudioRecord.start();
    setTimeout(() => this.stop(), 30000);
  };

  stop = async () => {
    if (!this.state.recording) return;
    console.log('stop record');
    let audioFile = await AudioRecord.stop();
    console.log('audioFile', audioFile);
    this.setState({audioFile, recording: false});

    const file = {
      uri: audioFile,
      type: 'audio/wave',
      name: 'test.wav',
    };

    const body = new FormData();
    body.append('file', file);

    this.setState({loading: true});
    fetch('https://fathomless-ocean-63613.herokuapp.com/audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: body,
    }).then((response) => response.json()).then((responseJson) => {
      console.log('Success: detecting mood from audio');
      console.log(responseJson);
      playlistFromAudio(responseJson).then(() => this.setState({loading: false}));
    }).catch(() => {
      console.log('Error: detecting mood from audio');
      this.setState({loading: false});
    });
  };

  load = () => {
    return new Promise((resolve, reject) => {
      if (!this.state.audioFile) {
        return reject('file path is empty');
      }

      this.sound = new Sound(this.state.audioFile, '', error => {
        if (error) {
          console.log('failed to load the file', error);
          return reject(error);
        }
        this.setState({loaded: true});
        return resolve();
      });
    });
  };

  play = async () => {
    if (!this.state.loaded) {
      try {
        await this.load();
      } catch (error) {
        console.log(error);
      }
    }

    this.setState({paused: false});
    Sound.setCategory('Playback');

    this.sound.play(success => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
      this.setState({paused: true});
      // this.sound.release();
    });
  };

  pause = () => {
    this.sound.pause();
    this.setState({paused: true});
  };

  render() {
    const {recording, paused, audioFile} = this.state;
    if (this.state.loading) {
      return <View style={styles.container}>
        <ActivityIndicator animating={true} style={styles.loadIndicator}>
        </ActivityIndicator>
        <Text style={styles.loadMessage}>
          Loading...
        </Text>
      </View>
    } else {
      return (
          <View style={styles.container}>
            <View style={styles.row}>
              <Button onPress={this.start} title="Record" disabled={recording}/>
              <Button onPress={this.stop} title="Stop" disabled={!recording}/>
              {paused ? (
                  <Button onPress={this.play} title="Play" disabled={!audioFile}/>
              ) : (
                  <Button onPress={this.pause} title="Pause"
                          disabled={!audioFile}/>
              )}
            </View>
          </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
