import React from 'react';
import './ImageForm.css';

const ImageForm = ({ onInputChange, onImageSubmit }) => {
  return (
    <div>
      <p className="f3 mb-2">Input image url to find faces</p>
      <div className="center">
        <div className="form pv4 ph2 br3 shadow-5">
          <input type="text" name="imgUrl" className="f5 pa2 ma2 w-80" onChange={onInputChange} />
          <button className="search-button" onClick={onImageSubmit}>
            Find
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageForm;
