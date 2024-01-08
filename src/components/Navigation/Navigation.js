import React from 'react';
import Logo from '../Logo/Logo.js';
import Themes from '../Themes/Themes.js';

const Navigation = ({ onRouteChange, isSignedIn }) => {
  if (isSignedIn) {
    return (
      <nav className="flex justify-around items-center">
        <Logo />
        <p
          className="f3 link dim underline pa3 absolute pointer"
          onClick={() => onRouteChange('signout')}
        >
          Sign Out
        </p>
        <Themes />
      </nav>
    );
  } else {
    return (
      <nav className="flex justify-around items-center">
        <Logo />
        <Themes />
      </nav>
    );
  }
};

export default Navigation;
