import React from 'react';
import { Tilt } from 'react-tilt';

const Logo = () => {
  return (
    <div className="ma3">
      <Tilt style={{ height: 100, width: 100 }}>
        <a href="/">
          <img src={process.env.PUBLIC_URL + '/logo192.png'} alt="find face logo" />
        </a>
      </Tilt>
    </div>
  );
};

export default Logo;
