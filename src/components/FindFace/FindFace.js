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

  const emojiMap = {
    emoji: '😎',
    alien: '👽',
    dog: '🐶',
    ghost: '🫠',
  };

  const isEmojiSupported = (emoji) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '16px Arial';

    const textWidth = ctx.measureText(emoji).width;
    ctx.fillText(emoji, 0, 16);

    return emoji === undefined ? true : textWidth > 0;
  };

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

      const imagePromises = [];

      faceAreas.forEach((area) => {
        const { width, height, fontSize } = getAreaSize(img, area);

        if (filterType === 'blur') {
          const blurredCanvas = document.createElement('canvas');
          const blurredCtx = blurredCanvas.getContext('2d', {
            willReadFrequently: true,
          });

          blurredCanvas.width = img.width;
          blurredCanvas.height = img.height;

          blurredCtx.filter = 'blur(20px)';
          blurredCtx.drawImage(img, 0, 0, img.width, img.height);

          const faceImageData = blurredCtx.getImageData(
            area.leftCol,
            area.topRow,
            width,
            height
          );
          ctx.putImageData(faceImageData, area.leftCol, area.topRow);
        }

        if (Object.keys(emojiMap).includes(filterType)) {
          const emoji = emojiMap[filterType];

          if (isEmojiSupported(emoji)) {
            ctx.font = `${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
              emoji,
              area.leftCol + width / 2,
              area.topRow + height / 2
            );
          } else {
            const imgPromise = new Promise((resolve, reject) => {
              const filterImg = new Image();
              filterImg.src = `/images/${filterType}.png`;
              filterImg.onload = () => {
                const aspectRatio = filterImg.width / filterImg.height;
                let scaledWidth = width;
                let scaledHeight = height;

                if (scaledWidth / aspectRatio > scaledHeight) {
                  scaledHeight = scaledWidth / aspectRatio;
                } else {
                  scaledWidth = scaledHeight * aspectRatio;
                }

                const offsetX = area.leftCol + (width - scaledWidth) / 2;
                const offsetY = area.topRow + (height - scaledHeight) / 2;

                ctx.drawImage(
                  filterImg,
                  offsetX,
                  offsetY,
                  scaledWidth,
                  scaledHeight
                );

                resolve();
              };
              filterImg.onerror = (error) => {
                console.error('Error loading filter image:', error);
                reject(error);
              };
            });

            imagePromises.push(imgPromise);
          }
        }
      });

      Promise.all(imagePromises)
        .then(() => {
          canvas.toBlob((blob) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'filtered_image.png';
            link.click();
            setIsDownloading(false);
          }, 'image/png');
        })
        .catch((error) => {
          console.error('Error loading filter images:', error);
          setIsDownloading(false);
        });
    };

    img.onerror = () => {
      console.error('Failed to load image for processing.');
      setIsDownloading(false);
    };
  };

  return (
    <div className="flex items-center flex-col mt-4 gap-3">
      <div className="filter-controls">
        {['none', 'blur', ...Object.keys(emojiMap)].map((type) => (
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

          const isSupported = isEmojiSupported(emojiMap[filterType]);

          return (
            <div
              key={index}
              className={`absolute flex flex-wrap justify-center filter-${filterType}`}
              style={{
                top: area.topRow,
                left: area.leftCol,
                right: area.rightCol,
                bottom: area.bottomRow,
              }}
            >
              {isSupported ? (
                <span
                  className="w-full h-full flex justify-center items-start leading-[0.8]"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {emojiMap[filterType]}
                </span>
              ) : (
                <img
                  src={`/images/${filterType}.png`}
                  alt={filterType}
                  style={{ objectFit: 'contain', transform: 'scale(1.3)' }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FindFace;
