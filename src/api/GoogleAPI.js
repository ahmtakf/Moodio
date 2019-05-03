import {Platform} from 'react-native';

const googleVisionAPI = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCguYvDWzbEjGWCS8GxN9Of7HfVCHcqpU8';
const googleSpeechAPI = 'https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyA9YmBc8vme5V2LCm0aS9UI6aXgVVG-o8w';

const headers = {
  'Accept': 'application/json',
};

export const detectMood = (data) =>
    fetch(`${googleVisionAPI}`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
          {
            'requests':
                [
                  {
                    'image': {'content': data},
                    'features': [
                      {
                        'type': 'FACE_DETECTION',
                        'maxResults': 10,
                      }],
                  },
                ],
          }),
    }).then(res => res.json()).then(data => data);

export const speechToText = (data) => {
  let body;
  if (Platform.OS === 'ios') {
    body = {
      'config': {
        'encoding': 'LINEAR16',
        'languageCode': 'en-US',
        'sampleRateHertz': 16000,
      },
      'audio': {'content': data},
    };
  } else {
    body = {
      'config': {
        'encoding': 'AMR_WB',
        'languageCode': 'en-US',
        'sampleRateHertz': 16000,
        'audioChannelCount': 1,
      },
      'audio': {'content': data},
    };
  }
  return fetch(`${googleSpeechAPI}`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(res => res.json()).then(data => data);
};
