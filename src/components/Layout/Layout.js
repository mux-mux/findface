import { Outlet } from 'react-router-dom';
import Background from '../Background/Background.js';
import Navigation from '../Navigation/Navigation.js';

const Layout = ({ isSignedIn, onRouteChange }) => {
  return (
    <>
      <Background />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      <Outlet />
    </>
  );
};

export default Layout;
