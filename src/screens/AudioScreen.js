import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import {speechToText} from '../api/GoogleAPI';

class AudioScreen extends Component {

  state = {
    currentTime: 0.0,
    recording: false,
    paused: false,
    stoppedRecording: false,
    finished: false,
    audioPath: undefined,
    hasPermission: undefined,
  };

  static _renderButton(title, onPress, active) {
    const style = (active) ? styles.activeButtonText : styles.buttonText;

    return (
        <TouchableHighlight style={styles.button} onPress={onPress}>
          <Text style={style}>
            {title}
          </Text>
        </TouchableHighlight>
    );
  }

  prepareRecordingPath() {
    let audioPath;
    if (Platform.OS === 'ios') {
      audioPath = AudioUtils.DocumentDirectoryPath + '/test.wav';
      AudioRecorder.prepareRecordingAtPath(audioPath, {
        SampleRate: 16000,
        Channels: 1,
        AudioQuality: 'Low',
        AudioEncoding: 'lpcm',
        IncludeBase64: true,
      });
    } else {
      audioPath = AudioUtils.DocumentDirectoryPath + '/test.3gp';
      AudioRecorder.prepareRecordingAtPath(audioPath, {
        SampleRate: 16000,
        Channels: 1,
        AudioQuality: 'Low',
        AudioEncoding: 'amr_wb',
        IncludeBase64: true,
      });
    }
    this.state.audioPath = audioPath;
  }

  componentDidMount() {
    AudioRecorder.requestAuthorization().then((isAuthorised) => {
      this.setState({hasPermission: isAuthorised});

      if (!isAuthorised) return;

      this.prepareRecordingPath();

      AudioRecorder.onProgress = (data) => {
        this.setState({currentTime: Math.floor(data.currentTime)});
      };

      AudioRecorder.onFinished = (data) => {
        // Android callback comes in the form of a promise instead.
        if (Platform.OS === 'ios') {
          this._finishRecording(data.status === 'OK', data['audioFileURL'],
              data['audioFileSize']);
        }

        const query = data.base64.replace(/(\r\n|\n|\r)/gm, '');
        speechToText(query).then((res) => {
          this.props.navigation.navigate('RecordDetectScreen',
              {data: {res: res}});
        });
      };
    });
  }

  _renderPauseButton(onPress, active) {
    const style = (active) ? styles.activeButtonText : styles.buttonText;
    const title = this.state.paused ? 'RESUME' : 'PAUSE';
    return (
        <TouchableHighlight style={styles.button} onPress={onPress}>
          <Text style={style}>
            {title}
          </Text>
        </TouchableHighlight>
    );
  }

  async _pause() {
    if (!this.state.recording) {
      console.warn('Can\'t pause, not recording!');
      return;
    }

    try {
      await AudioRecorder.pauseRecording();
      this.setState({paused: true});
    } catch (error) {
      console.error(error);
    }
  }

  async _resume() {
    if (!this.state.paused) {
      console.warn('Can\'t resume, not paused!');
      return;
    }

    try {
      await AudioRecorder.resumeRecording();
      this.setState({paused: false});
    } catch (error) {
      console.error(error);
    }
  }

  async _stop() {
    if (!this.state.recording) {
      console.warn('Can\'t stop, not recording!');
      return;
    }

    this.setState({stoppedRecording: true, recording: false, paused: false});

    try {
      const filePath = await AudioRecorder.stopRecording();

      if (Platform.OS === 'android') {
        this._finishRecording(true, filePath);
      }
      return filePath;
    } catch (error) {
      console.error(error);
    }
  }

  async _play() {
    if (this.state.recording) {
      await this._stop();
    }

    // These timeouts are a hacky workaround for some issues with react-native-sound.
    // See https://github.com/zmxv/react-native-sound/issues/89.
    setTimeout(() => {
      const sound = new Sound(this.state.audioPath, '', (error) => {
        if (error) {
          console.log('failed to load the sound', error);
        }
      });

      setTimeout(() => {
        sound.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }, 100);
    }, 100);
  }

  async _record() {
    if (this.state.recording) {
      console.warn('Already recording!');
      return;
    }

    if (!this.state.hasPermission) {
      console.warn('Can\'t record, no permission granted!');
      return;
    }

    if (this.state.stoppedRecording) {
      this.prepareRecordingPath(this.state.audioPath);
    }

    this.setState({recording: true, paused: false});

    try {
      await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  }

  _finishRecording(didSucceed, filePath, fileSize) {
    this.setState({finished: didSucceed});
    console.log(
        `Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize ||
        0} bytes`);
  }

  render() {

    return (
        <View style={styles.container}>
          <View style={styles.controls}>
            {AudioScreen._renderButton('RECORD', () => {this._record();},
                this.state.recording)}
            {AudioScreen._renderButton('PLAY', () => {this._play();})}
            {AudioScreen._renderButton('STOP', () => {this._stop();})}
            {/* {this._renderButton("PAUSE", () => {this._pause()} )} */}
            {this._renderPauseButton(
                () => {this.state.paused ? this._resume() : this._pause();})}
            <Text style={styles.progressText}>{this.state.currentTime}s</Text>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#431540',
  },
  controls: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  progressText: {
    paddingTop: 50,
    fontSize: 50,
    color: '#EFEFEF',
  },
  button: {
    padding: 20,
  },
  disabledButtonText: {
    color: '#eee',
  },
  buttonText: {
    fontSize: 20,
    color: '#EFEFEF',
  },
  activeButtonText: {
    fontSize: 20,
    color: '#B81F00',
  },

});

export default AudioScreen;
