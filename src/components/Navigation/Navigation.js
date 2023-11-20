import React from 'react';
import Logo from '../Logo/Logo';

const Navigation = () => {
  return (
    <nav className="flex justify-between items-center">
      <Logo />
      <p className="f3 link dim black underline pa3 pointer">Sign Out</p>
    </nav>
  );
};

export default Navigation;
