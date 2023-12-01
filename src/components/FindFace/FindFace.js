import React, { useState, useEffect } from 'react';
import './FindFace.css';

const FindFace = ({ imageUrl, userID }) => {
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

  useEffect(() => {
    fetch('https://api.clarifai.com/v2/models/' + MODEL_ID + '/outputs', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userID }),
          });
        }
        setFaceArea(getFaceArea(result));
      })
      .then((count) => {})
      .catch((error) => console.log('error', error));
  }, [imageUrl]);

  return (
    <div className="center mt4">
      <div className="relative">
        <img src={imageUrl} id="inputImage" alt="faces" width="500" height="auto" />
        <div
          className="face-area"
          style={{
            top: area.topRow,
            right: area.rightCol,
            bottom: area.bottomRow,
            left: area.leftCol,
          }}
        ></div>
      </div>
    </div>
  );
};

export default FindFace;
