import React from 'react';
import Logo from '../Logo/Logo.js';
import Profile from '../Profile/Profile.js';
import Themes from '../Themes/Themes.js';

const Navigation = ({ onRouteChange, isSignedIn, user, loadUser }) => {
  if (isSignedIn) {
    return (
      <nav className="flex justify-around items-center">
        <Themes />
        <Logo />
        <Profile onRouteChange={onRouteChange} user={user} loadUser={loadUser} />
      </nav>
    );
  } else {
    return (
      <nav className="flex justify-around items-center">
        <Themes />
        <Logo />
        <div className="basis-20"></div>
      </nav>
    );
  }
};

export default Navigation;
