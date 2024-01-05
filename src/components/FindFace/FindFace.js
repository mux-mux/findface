import React, { useState, useEffect } from 'react';
import './FindFace.css';

const FindFace = ({ imageUrl, onUserDataChange, user }) => {
  const [area, setFaceArea] = useState({});

  const getFaceArea = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
      leftCol: clarifaiFace.left_col * width,
    };
  };

  useEffect(() => {
    fetch('https://findface.vercel.app/apicall', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: imageUrl }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          fetch('https://findface.vercel.app/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: user.id }),
          })
            .then((response) => response.json())
            .then((count) => onUserDataChange(Object.assign({ ...user }, { entries: count })))
            .catch(console.log);
        }
        setFaceArea(getFaceArea(result));
      })
      .catch(console.log);
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
