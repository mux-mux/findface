import React from 'react';
import './ImageForm.css';

const ImageForm = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div>
      <p className="f3">Input image url to find faces</p>
      <div className="center">
        <div className="form center pt4 pb4 br3 shadow-5 w-40">
          <input type="text" name="imgUrl" className="f5 pa2 mr2 w-80" onChange={onInputChange} />
          <button className="search-button" onClick={onButtonSubmit}>
            Find
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageForm;
