import React, { useState, useEffect, useCallback } from 'react';
import './FindFace.css';

const FindFace = ({ imageUrl, onUserDataChange, user }) => {
  const [faceAreas, setFaceAreas] = useState([]);
  const [filterType, setFilterType] = useState('none');

  const getFaceAreas = useCallback((data) => {
    if (!data?.outputs) return [];

    const image = document.getElementById('inputImage');
    if (!image) return [];

    const width = image.width;
    const height = image.height;

    return data.outputs[0].data.regions.map(({ region_info }) => {
      const { top_row, right_col, bottom_row, left_col } =
        region_info.bounding_box;
      return {
        topRow: top_row * height,
        rightCol: width - right_col * width,
        bottomRow: height - bottom_row * height,
        leftCol: left_col * width,
      };
    });
  }, []);

  const fetchFaceData = useCallback(async () => {
    if (!imageUrl) return;

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
      if (!result && result === 'Unauthorized') return;

      const countResponse = await fetch('http://localhost:3001/image', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: window.localStorage.getItem('token'),
        },
        body: JSON.stringify({ id: user.id }),
      });

      const countData = await countResponse.json();
      onUserDataChange((prevUser) => ({ ...prevUser, entries: countData }));

      setFaceAreas(getFaceAreas(result));
    } catch (error) {
      console.error('Error fetching face data:', error);
    }
  }, [imageUrl, user.id, onUserDataChange, getFaceAreas]);

  useEffect(() => {
    fetchFaceData();
  }, [fetchFaceData]);

  return (
    <div className="flex items-center flex-col mt-4">
      <div className="filter-controls">
        {['none', 'blur', 'emoji', 'cat', 'dog'].map((type) => (
          <button
            key={type}
            className={filterType === type ? 'selected' : ''}
            onClick={() => setFilterType(type)}
          >
            {type === 'none'
              ? 'No Filter'
              : `Apply ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          </button>
        ))}
      </div>
      <div className="relative">
        <img
          src={imageUrl}
          id="inputImage"
          alt="faces"
          width="500"
          height="auto"
        />
        {faceAreas.map((area, index) => {
          const imgWidth = 500;
          const width = imgWidth - (area.leftCol + area.bottomRow);
          const fontSize = width * 0.9;

          return (
            <div
              key={index}
              className={`face-area filter-${filterType}`}
              style={{
                top: area.topRow,
                left: area.leftCol,
                right: area.rightCol,
                bottom: area.bottomRow,
              }}
            >
              {filterType === 'emoji' && (
                <span style={{ fontSize: `${fontSize}px` }}>😎</span>
              )}
              {filterType === 'cat' && (
                <span style={{ fontSize: `${fontSize}px` }}>🐱</span>
              )}
              {filterType === 'dog' && (
                <span style={{ fontSize: `${fontSize}px` }}>🐶</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FindFace;
