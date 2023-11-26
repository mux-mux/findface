import React from 'react';
import Logo from '../Logo/Logo';
import Themes from '../Themes/Themes';

const Navigation = ({ onRouteChange, isSignedIn }) => {
  if (isSignedIn) {
    return (
      <nav className="flex justify-between items-center">
        <Logo />
        <p className="f3 link dim underline pa3 pointer" onClick={() => onRouteChange('signout')}>
          Sign Out
        </p>
        <Themes />
      </nav>
    );
  } else {
    return (
      <nav className="flex justify-between items-center">
        <Logo />
        <div className="flex">
          <p className="f3 link dim underline pa3 pointer" onClick={() => onRouteChange('signin')}>
            Sign In
          </p>
          <p
            className="f3 link dim underline pa3 pointer"
            onClick={() => onRouteChange('register')}
          >
            Register
          </p>
        </div>
        <Themes />
      </nav>
    );
  }
};

export default Navigation;
