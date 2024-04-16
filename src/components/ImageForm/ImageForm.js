import React from 'react';
import './ImageForm.css';

const ImageForm = ({ onInputChange, onImageSubmit }) => {
  return (
    <div>
      <p className="text-xl mb-10">Input image url to find faces</p>
      <div className="center">
        <form className="form py-4 px-2 rounded-2xl shadow-md" onSubmit={onImageSubmit}>
          <input
            type="text"
            name="imgUrl"
            className="text-sm px-3 m-2 w-5/6 text-gray-600 rounded"
            onChange={onInputChange}
          />
          <button type="submit" className="search-button">
            Find
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImageForm;
