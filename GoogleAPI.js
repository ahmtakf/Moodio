const googleVisionAPI = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCguYvDWzbEjGWCS8GxN9Of7HfVCHcqpU8"
const googleSpeechAPI = "https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyA9YmBc8vme5V2LCm0aS9UI6aXgVVG-o8w"

const headers = {
    'Accept': 'application/json',
  }

export const detectMood = (data) =>
  fetch(`${googleVisionAPI}`, {
      method: 'POST',
      headers: {
      ...headers,
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(
            { "requests":
                [ 
                    { 
                    "image":{ "content": data }, 
                    "features":[ {
                    "type":"FACE_DETECTION",
                    "maxResults":10 } ]
                    }
                ]
            })
}).then(res => res.json())
  .then(data => data);

export const speechToText = (data) =>
  fetch(`${googleSpeechAPI}`, {
      method: 'POST',
      headers: {
      ...headers,
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
            "config": {
                "encoding": "LINEAR16",
                "sampleRateHertz": 16000,
                "languageCode": "en-US",
                "enableWordTimeOffsets": false,
                "audioChannelCount":1
            },
            "audio": { "content": data }
        })
}).then(res => res.json())
  .then(data => data);