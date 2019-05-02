const azureFaceAPI = "https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair"

const headers = {
    'Accept': 'application/json',
  }

export const detectMood = (data) =>
  fetch(`${azureFaceAPI}`, {
      method: 'POST',
      headers: {
      ...headers,
      'Content-Type': 'application/octet-stream',
      'Ocp-Apim-Subscription-Key':'6163804f762148a3b9f67b09a6b95e8e'
      },
      processData: false,
      body: data
}).then(res => res.json())
  .then(data => data);