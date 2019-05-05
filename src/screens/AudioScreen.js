import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  Dimensions,
  View,
} from 'react-native';
import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import {speechToText} from '../api/GoogleAPI';
import * as Progress from 'react-native-progress';

class AudioScreen extends Component {

  state = {
    currentTime: 0.0,
    recording: false,
    paused: false,
    stoppedRecording: false,
    finished: false,
    audioPath: undefined,
    hasPermission: undefined,
    recordText: '●',            // ● ■   ❚❚ | ▶ ♬
    playText: '▶',              // ▶ ♬
    progress: 1,
    indeterminate: true,
  };

  static _renderPlayButton(title, onPress, active){
    return (
      <TouchableHighlight style={[styles.button], {position: 'absolute', top: 95,}} onPress={onPress}>
        <Text style={styles.buttonText}> {title} </Text>
      </TouchableHighlight>
    );
  }

  static _renderRecordButton(title, onPress, active){
    return (
      <TouchableHighlight style={styles.record} onPress={onPress}>
        <Text style={{fontSize: 80, color: 'red',}}> {title} </Text>
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

  async _resume() {
    try {
      await AudioRecorder.resumeRecording();
      this.setState({paused: false});
    } catch (error) {
      console.error(error);
    }
  }
// ● ■
  async _stop() {
    this.setState({ recordText: '●'});

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
    this.setState({ playText: '♬'});

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
            sc = true;
            console.log('successfully finished playing');
            this.setState({ playText: '▶'});
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }, 100);
    }, 100);

  }
// ● ■
  async _record() {
    this.setState({ recordText: '■'});

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

// ● ■   ❚❚ | ▶ ♬

/*
     componentDidMount() {
        this.animate();
      }

      animate() {
        let duration = this.state.currentTime;
        console.warn('duration-->', this.state.currentTime);
        let progress = 1;
        this.setState({ progress });
        setTimeout(() => {
          this.setState({ indeterminate: false });
          setInterval(() => {
            //progress -= ( 1 / duration) ;
            if (progress < 0)
              progress = 0;
            this.setState({ progress });
          }, 500);
        }, 1500);
      }
*/

render() {
  return (
    < View style = {styles.container}>
      <View style = {styles.circle}>
        <Progress.Circle style = {{alignItems: 'center',}}
                        size = {250}
                        //marginTop = {75}
                        thickness = {18}
                        color = {'#431540'}
                        //progress={1}
                        progress = {this.state.progress}
                        indeterminate = {false}
                        direction = "counter-clockwise" >
          {AudioScreen._renderPlayButton(this.state.playText, () => { this._play(); })}

        </Progress.Circle >
      </View>

      {AudioScreen._renderRecordButton(this.state.recordText, () => {
        if (this.state.recordText == '●') {
          {
            this._record();
          }
        } else if (this.state.recordText == '■') {
          {
            this._stop();
          }
        }
      }, this.state.recording)}
    </View>

  );
}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  controls: {
    justifyContent: 'center',
    alignItems: 'center',
    //flex: 1,
  },
  progressText: {
    paddingTop: 50,
    fontSize: 50,
    color: '#431540',
  },
  button: {
    padding: 20,
  },
  disabledButtonText: {
    color: '#eee',
  },
  buttonText: {
    fontSize: 50,
    color: '#431540',
  },
  activeButtonText: {
    fontSize: 20,
    color: '#B81F00',
  },
  circle: {
    top: 75,
  },
  record:{
    position: 'absolute',
    bottom: 0,
    left: Dimensions.get('window').width / 2 - 45,
  }

});

export default AudioScreen;

 /*<Text style = {styles.progressText}> {this.state.currentTime} s </Text>*/