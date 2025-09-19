import { NavLink } from 'react-router-dom';

const Logo = () => {
  return (
    <div className="ma3">
      <NavLink href="/" tabIndex="-1" aria-label="Go back to homepage">
        <img
          src={process.env.PUBLIC_URL + '/logo192.png'}
          alt="find face logo"
          height={100}
          width={100}
          fetchpriority="high"
        />
      </NavLink>
    </div>
  );
};

export default Logo;
