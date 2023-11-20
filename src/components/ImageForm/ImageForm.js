import React from 'react';
import './ImageForm.css';

const ImageForm = () => {
  return (
    <div>
      <p className="f3">Input image url to find faces</p>
      <div className="center">
        <div className="form center pa4 br3 shadow-5">
          <input type="text" name="" id="" className="f4 pa2 mr2 w-70" />
          <button className="search-button">Find</button>
        </div>
      </div>
    </div>
  );
};

export default ImageForm;
