import React from 'react';
import Logo from '../Logo/Logo.js';
import Themes from '../Themes/Themes.js';

const Navigation = ({ onRouteChange, isSignedIn }) => {
  if (isSignedIn) {
    return (
      <nav className="flex justify-around items-center">
        <Logo />
        <p
          className="text-xl transition duration-200 hover:text-gray-300 underline pa3 absolute cursor-pointer"
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
