import { NavLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-96 flex flex-col justify-center items-center text-center gap-4">
      <h1 className="text-7xl">404</h1>
      <h2 className="text-3xl">Page Not Found</h2>
      <p className="text-xl my-2">
        Sorry, the page you are looking for doesn't exist.
      </p>
      <NavLink to="/" className="mt-2 px-1 py-2 decoration-0 text-lg underline">
        🏠 Go Back to Homepage
      </NavLink>
    </div>
  );
};

export default NotFound;
