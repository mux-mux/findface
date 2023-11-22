import React from 'react';
import Logo from '../Logo/Logo';

const Navigation = ({ onRouteChange, isSignedIn }) => {
  if (isSignedIn) {
    return (
      <nav className="flex justify-between items-center">
        <Logo />
        <p
          className="f3 link dim black underline pa3 pointer"
          onClick={() => onRouteChange('signout')}
        >
          Sign Out
        </p>
      </nav>
    );
  } else {
    return (
      <nav className="flex justify-between items-center">
        <Logo />
        <div className="flex">
          <p
            className="f3 link dim black underline pa3 pointer"
            onClick={() => onRouteChange('signin')}
          >
            Sign In
          </p>
          <p
            className="f3 link dim black underline pa3 pointer"
            onClick={() => onRouteChange('register')}
          >
            Register
          </p>
        </div>
      </nav>
    );
  }
};

export default Navigation;
