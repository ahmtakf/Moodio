/* eslint-disable no-console */
import RNFetchBlob from 'rn-fetch-blob';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import {RNCamera} from 'react-native-camera';

import {playlistFromImage} from '../MoodDetect';

const azureFaceAPI = 'https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,smile,emotion,hair';

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

const landmarkSize = 2;

export default class CameraScreen extends React.Component {

  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    autoFocusPoint: {
      normalized: {x: 0.5, y: 0.5}, // normalized values required for autoFocusPointOfInterest
      drawRectPosition: {
        x: Dimensions.get('window').width * 0.5 - 32,
        y: Dimensions.get('window').height * 0.5 - 32,
      },
    },
    depth: 0,
    type: 'front',
    whiteBalance: 'auto',
    ratio: '16:9',
  };

  constructor(props) {
    super(props);
  }

  toggleFacing() {
    this.setState({
      type: this.state.type === 'back' ? 'front' : 'back',
    });
  }

  toggleFlash() {
    this.setState({
      flash: flashModeOrder[this.state.flash],
    });
  }

  toggleWB() {
    this.setState({
      whiteBalance: wbOrder[this.state.whiteBalance],
    });
  }

  toggleFocus() {
    this.setState({
      autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
    });
  }

  touchToFocus(event) {
    const {pageX, pageY} = event.nativeEvent;
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const isPortrait = screenHeight > screenWidth;

    let x = pageX / screenWidth;
    let y = pageY / screenHeight;
    // Coordinate transform for portrait. See autoFocusPointOfInterest in docs for more info
    if (isPortrait) {
      x = pageY / screenHeight;
      y = -(pageX / screenWidth) + 1;
    }

    this.setState({
      autoFocusPoint: {
        normalized: {x, y},
        drawRectPosition: {x: pageX, y: pageY},
      },
    });
  }

  zoomOut() {
    this.setState({
      zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
    });
  }

  zoomIn() {
    this.setState({
      zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
    });
  }

  setFocusDepth(depth) {
    this.setState({
      depth,
    });
  }

  takePicture = async function(camera) {
    const options = {base64: true};
    const data = await this.camera.takePictureAsync(options);
    //console.warn('click', 'click');

    //  eslint-disable-next-line
    /*console.warn('1', data.uri);
    console.warn('2', data.base64);
    console.warn('3', RNFetchBlob.wrap(stripFilePathPrefix(data.uri)));
    console.warn('4', RNFetchBlob.wrap(data.uri));
    const picPath = data.uri;*/

    RNFetchBlob.fetch('POST', azureFaceAPI, {
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key': '6163804f762148a3b9f67b09a6b95e8e',
      // Change BASE64 encoded data to a file path with prefix `RNFetchBlob-file://`.
      // Or simply wrap the file path with RNFetchBlob.wrap().
    }, data.base64).then((res) => {
      console.warn('AZURE SONUCU --> ', res.json());
      playlistFromImage(res.json());
    }).catch((err) => {
      // error handling ..
      console.log(err);
    });

    //this.props.navigation.navigate('MoodDetectScreen', data: {img: data.uri, mood: res.json()}});

  };

  toggle = value => () => this.setState(
      prevState => ({[value]: !prevState[value]}));

  renderTextBlock = ({bounds, value}) => (
      <React.Fragment key={value + bounds.origin.x}>
        <Text style={[
          styles.textBlock,
          {left: bounds.origin.x, top: bounds.origin.y}]}>
          {value}
        </Text>
        <View
            style={[
              styles.text,
              {
                ...bounds.size,
                left: bounds.origin.x,
                top: bounds.origin.y,
              },
            ]}
        />
      </React.Fragment>
  );

  textRecognized = object => {
    const {textBlocks} = object;
    this.setState({textBlocks});
  };

  barcodeRecognized = ({barcodes}) => this.setState({barcodes});

  renderBarcode = ({bounds, data, type}) => (
      <React.Fragment key={data + bounds.origin.x}>
        <View
            style={[
              styles.text,
              {
                ...bounds.size,
                left: bounds.origin.x,
                top: bounds.origin.y,
              },
            ]}
        >
          <Text style={[styles.textBlock]}>{`${data} ${type}`}</Text>
        </View>
      </React.Fragment>
  );

  renderCamera() {
    const {canDetectFaces, canDetectText, canDetectBarcode} = this.state;

    const drawFocusRingPosition = {
      top: this.state.autoFocusPoint.drawRectPosition.y - 32,
      left: this.state.autoFocusPoint.drawRectPosition.x - 32,
    };
    return (
        <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={{
              flex: 1,
              justifyContent: 'space-between',
            }}
            onPress={this.takePicture.bind(this)}
            type={this.state.type}
            flashMode={this.state.flash}
            autoFocus={this.state.autoFocus}
            autoFocusPointOfInterest={this.state.autoFocusPoint.normalized}
            zoom={this.state.zoom}
            whiteBalance={this.state.whiteBalance}
            ratio={this.state.ratio}
            focusDepth={this.state.depth}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}
            faceDetectionLandmarks={
              RNCamera.Constants.FaceDetection.Landmarks
                  ? RNCamera.Constants.FaceDetection.Landmarks.all
                  : undefined
            }
            onFacesDetecized={canDetectText ? this.textRecognized : null}
            onGoogleVisited={canDetectFaces ? this.facesDetected : null}
            onTextRecognized={canDetectText ? this.textRecognized : null}
            onGoogleVisionBarcodesDetected={canDetectBarcode
                ? this.barcodeRecognized
                : null}
        >

          <View
              style={{
                flex: 0.5,
                height: 72,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
          >
          </View>

          <View
              style={{bottom: 0, left: (Dimensions.get('window').width - 60)}}>
            <TouchableOpacity
                style={{
                  position: 'absolute',
                  backgroundColor: '#54A8D1', //8B709A
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 50,
                  width: 50,
                  borderRadius: 100,
                }}
                onPress={this.zoomIn.bind(this)}
            >
              <Text style={styles.flipText}> + </Text>
            </TouchableOpacity>
          </View>

          <View
              style={{bottom: 0, left: (Dimensions.get('window').width - 60)}}>
            <TouchableOpacity
                style={{
                  position: 'absolute',
                  backgroundColor: '#54A8D1', //8B709A
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 50,
                  width: 50,
                  borderRadius: 100,
                }}
                onPress={this.zoomOut.bind(this)}
            >
              <Text style={styles.flipText}> - </Text>
            </TouchableOpacity>
          </View>

          <View style={{
            bottom: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <TouchableOpacity onPress={this.takePicture.bind(this)}
                              style={{
                                position: 'absolute',
                                backgroundColor: '#431540', //8B709A
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 70,
                                width: 70,
                                borderRadius: 140,
                              }}>
              <Text style={{color: '#EFEFEF'}}>SNAP</Text>
            </TouchableOpacity>
          </View>
        </RNCamera>
    );
  }

  render() {
    return <View style={styles.container}>{this.renderCamera()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#000',
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoFocusBox: {
    position: 'absolute',
    height: 64,
    width: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    opacity: 0.4,
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },
  zoomText: {
    position: 'absolute',
    bottom: 70,
    zIndex: 2,
    left: 2,
  },
  picButton: {
    backgroundColor: 'darkseagreen',
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: 'absolute',
    backgroundColor: 'red',
  },
  text: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#F00',
    justifyContent: 'center',
  },
  textBlock: {
    color: '#F00',
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});

/*
      <TouchableOpacity
        style={[styles.flipButton, styles.picButton, { flex: 0.3, alignSelf: 'flex-end' }]}
        onPress={this.takePicture.bind(this)}
      >
        <Text style={styles.flipText}> SNAP </Text>
      </TouchableOpacity>
      */
