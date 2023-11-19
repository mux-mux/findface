import React from 'react';
import { Tilt } from 'react-tilt';

const Logo = () => {
  return (
    <div className="ml4">
      <Tilt style={{ height: 150, width: 150 }}>
        <img src={process.env.PUBLIC_URL + '/logo192.png'} alt="find face logo" />
      </Tilt>
    </div>
  );
};

export default Logo;
