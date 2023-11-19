import React from 'react';
import './ImageForm.css';

const ImageForm = () => {
  return (
    <div>
      <p className="f3">Input image url to find faces</p>
      <div className="center">
        <div className="form center pa4 br3 shadow-5">
          <input type="text" name="" id="" className="f4 pa2 w-70" />
          <button className="f4 w-30 grow link ph3 pv2 dib white bg-light-purple">Find</button>
        </div>
      </div>
    </div>
  );
};

export default ImageForm;
