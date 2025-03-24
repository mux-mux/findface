import React from 'react';

const Logo = () => {
  return (
    <div className="ma3">
      <a href="/" tabIndex="-1" aria-label="Go back to homepage">
        <img
          src={process.env.PUBLIC_URL + '/logo192.png'}
          alt="find face logo"
          height={100}
          width={100}
          fetchpriority="high"
        />
      </a>
    </div>
  );
};

export default Logo;
