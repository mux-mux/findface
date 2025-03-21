import React, { useState, useEffect, useCallback } from 'react';
import Spinner from '../Spinner/Spinner.js';
import './FindFace.css';

const FindFace = ({ imageUrl, onUserDataChange, user }) => {
  const [faceAreas, setFaceAreas] = useState([]);
  const [filterType, setFilterType] = useState('none');
  const [isDownloading, setIsDownloading] = useState(false);

  const getFaceAreas = useCallback((data) => {
    if (!data.outputs[0].data.regions) {
      alert('No faces detected!');
      return [];
    }

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
    setFaceAreas([]);
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

  const getAreaSize = useCallback((image, faceArea) => {
    const width = image.width - (faceArea.leftCol + faceArea.rightCol);
    const height = image.height - (faceArea.bottomRow + faceArea.topRow);
    const fontSize = Math.max(width, height) * 1.1;

    return {
      width,
      height,
      fontSize,
    };
  }, []);

  useEffect(() => {
    fetchFaceData();
  }, [fetchFaceData]);

  const handleDownload = () => {
    setIsDownloading(true);

    const img = new Image();
    const proxyUrl = 'https://cors-anywhere-api-liwc.onrender.com/proxy?url=';
    const proxiedImageUrl = proxyUrl + imageUrl;
    img.crossOrigin = 'anonymous';
    img.src = proxiedImageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', {
        willReadFrequently: true,
      });

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0, img.width, img.height);

      faceAreas.forEach((area) => {
        const { width, height, fontSize } = getAreaSize(img, area);

        if (filterType === 'blur') {
          const blurredCanvas = document.createElement('canvas');
          const blurredCtx = blurredCanvas.getContext('2d', {
            willReadFrequently: true,
          });

          blurredCanvas.width = img.width;
          blurredCanvas.height = img.height;

          ctx.drawImage(img, 0, 0, img.width, img.height);
          blurredCtx.filter = 'blur(20px)';
          blurredCtx.drawImage(img, 0, 0, img.width, img.height);

          faceAreas.forEach((area) => {
            const faceImageData = blurredCtx.getImageData(
              area.leftCol,
              area.topRow,
              width,
              height
            );

            ctx.putImageData(faceImageData, area.leftCol, area.topRow);
          });
        }

        if (['emoji', 'alien', 'dog', 'ghost'].includes(filterType)) {
          const emojiMap = {
            emoji: '😎',
            alien: '👽',
            dog: '🐶',
            ghost: '🫠',
          };

          ctx.font = `${fontSize}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            emojiMap[filterType],
            area.leftCol + width / 2,
            area.topRow + height / 2
          );
        }
      });

      canvas.toBlob((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'filtered_image.png';
        link.click();
        setIsDownloading(false);
      }, 'image/png');
    };

    img.onerror = () => {
      console.error('Failed to load image for processing.');
      setIsDownloading(false);
    };
  };

  return (
    <div className="flex items-center flex-col mt-4 gap-3">
      <div className="filter-controls">
        {['none', 'blur', 'emoji', 'alien', 'dog', 'ghost'].map((type) => (
          <button
            key={type}
            className={filterType === type ? 'selected' : ''}
            onClick={() => setFilterType(type)}
            aria-label={`Apply a filter ${type}`}
          >
            {type === 'none'
              ? 'No Filter'
              : `Apply ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          </button>
        ))}
      </div>
      <div className="relative mb-5">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="download-controls flex items-center"
          aria-label="Download the Image with the applied filter"
        >
          {'Download Image'}
        </button>
        {isDownloading && (
          <Spinner className="absolute -right-2 top-5 translate-x-full -translate-y-1/2 !m-0" />
        )}
      </div>
      <div className="relative">
        <img
          src={imageUrl}
          id="inputImage"
          alt="faces"
          width="auto"
          height="auto"
        />
        {faceAreas.map((area, index) => {
          const img = document.getElementById('inputImage');
          const { fontSize } = getAreaSize(img, area);

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
              {filterType === 'alien' && (
                <span style={{ fontSize: `${fontSize}px` }}>👽</span>
              )}
              {filterType === 'dog' && (
                <span style={{ fontSize: `${fontSize}px` }}>🐶</span>
              )}
              {filterType === 'ghost' && (
                <span style={{ fontSize: `${fontSize}px` }}>🫠</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FindFace;
