const googleapi = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCguYvDWzbEjGWCS8GxN9Of7HfVCHcqpU8';

const headers = {
  'Accept': 'application/json',
};

export const detectMood = (data) =>
    fetch(`${googleapi}`, {
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
