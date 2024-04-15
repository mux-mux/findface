/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import './FindFace.css';

const FindFace = ({ imageUrl, onUserDataChange, user }) => {
  const [areas, setFaceAreas] = useState([]);

  const getFaceAreas = (data) => {
    if (data && data.outputs) {
      return data.outputs[0].data.regions.map((face) => {
        const clarifaiFace = face.region_info.bounding_box;
        const image = document.getElementById('inputImage');
        const width = Number(image.width);
        const height = Number(image.height);

        return {
          topRow: clarifaiFace.top_row * height,
          rightCol: width - clarifaiFace.right_col * width,
          bottomRow: height - clarifaiFace.bottom_row * height,
          leftCol: clarifaiFace.left_col * width,
        };
      });
    }
    return;
  };

  useEffect(() => {
    const apiCallSetArea = async () => {
      try {
        const response = await fetch('http://localhost:3001/apicall', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: window.localStorage.getItem('token'),
          },
          body: JSON.stringify({ input: imageUrl }),
        });
        const result = await response.json();

        if (result && result !== 'Unauthorized') {
          try {
            const count = await fetch('http://localhost:3001/image', {
              method: 'put',
              headers: {
                'Content-Type': 'application/json',
                Authorization: window.localStorage.getItem('token'),
              },
              body: JSON.stringify({ id: user.id }),
            });
            const countData = await count.json();

            onUserDataChange({ ...user, entries: countData });
            console.log(result);
            setFaceAreas(getFaceAreas(result));
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    apiCallSetArea();
  }, [imageUrl]);

  return (
    <div className="flex justify-center mt-4">
      <div className="relative">
        <img src={imageUrl} id="inputImage" alt="faces" width="500" height="auto" />
        {areas.map((area) => {
          return (
            <div
              key={area.topRow}
              className="face-area"
              style={{
                top: area.topRow,
                right: area.rightCol,
                bottom: area.bottomRow,
                left: area.leftCol,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default FindFace;
