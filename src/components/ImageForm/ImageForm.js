import React from 'react';
import './ImageForm.css';

const ImageForm = ({ onInputChange, onImageSubmit }) => {
  return (
    <div>
      <h1 className="text-xl mb-10">Input image url to find faces</h1>
      <div className="center">
        <form
          className="form py-4 px-2 rounded-2xl shadow-md"
          onSubmit={onImageSubmit}
        >
          <input
            type="text"
            name="imgUrl"
            className="text-sm px-3 m-2 w-5/6 text-gray-600 rounded"
            onChange={onInputChange}
            aria-label="Input image url to find faces on it"
          />
          <button
            type="submit"
            className="search-button"
            aria-label="Find the face/faces in the image"
          >
            Find
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImageForm;
