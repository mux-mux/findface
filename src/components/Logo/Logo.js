import React from 'react';

const Logo = () => {
  return (
    <div className="ma3">
      <a href="/" aria-label="Go back to homepage">
        <img
          src={process.env.PUBLIC_URL + '/logo192.png'}
          alt="find face logo"
          height={100}
          width={100}
        />
      </a>
    </div>
  );
};

export default Logo;
