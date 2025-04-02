import React from 'react';

import './Spinner.css';

const Spinner = ({ className }) => {
  return (
    <div
      className={
        className ? `spinner-container ${className}` : 'spinner-container'
      }
      role="status"
    >
      <div className="loader"></div>
    </div>
  );
};

export default Spinner;
