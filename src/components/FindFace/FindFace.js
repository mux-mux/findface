import React, { useState } from 'react';

const FindFace = ({ imageUrl }) => {
  const [area, setFaceArea] = useState({});

  const getFaceArea = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);

    return {
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
      leftCol: clarifaiFace.left_col * width,
    };
  };

  const PAT = 'f84586df8fdd422dbfb6682190576da4';
  const USER_ID = 'mux-mux';
  const APP_ID = 'findface-app';
  const MODEL_ID = 'face-detection';
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Key ' + PAT,
    },
    body: raw,
  };

  fetch('https://api.clarifai.com/v2/models/' + MODEL_ID + '/outputs', requestOptions)
    .then((response) => response.json())
    .then((result) => setFaceArea(getFaceArea(result)))
    .catch((error) => console.log('error', error));

  return (
    <div className="center mt4">
      <img src={imageUrl} id="inputImage" alt="faces" width="500" height="auto" />
    </div>
  );
};

export default FindFace;
