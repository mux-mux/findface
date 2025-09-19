import Logo from '../Logo/Logo.js';
import Profile from '../Profile/Profile.js';
import Themes from '../Themes/Themes.js';

const Navigation = ({ onRouteChange, isSignedIn }) => {
  return (
    <nav className="flex justify-around items-center mt-10">
      <Themes />
      <Logo />
      {isSignedIn ? (
        <Profile onRouteChange={onRouteChange} />
      ) : (
        <div className="flex-1"></div>
      )}
    </nav>
  );
};

export default Navigation;
