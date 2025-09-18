import { useState, useEffect, useCallback } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation.js';
import Signin from './pages/Signin/Signin.js';
import Register from './pages/Register/Register.js';
import Background from './components/Background/Background.js';
import Home from './pages/Home.js';
import { initialUserState, useUser } from './hooks/useUser.js';

const App = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { user, setUser } = useUser();

  const navigate = useNavigate();

  const onRouteChange = useCallback(
    (newRoute) => {
      if (newRoute === 'signout') {
        setIsSignedIn(false);
        setUser(initialUserState);
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('rankBadge');
        navigate('signin');
      } else if (newRoute === 'home') {
        setIsSignedIn(true);
        navigate('home');
      }
    },
    [navigate, setUser]
  );

  useEffect(() => {
    if (user?.id) {
      onRouteChange('home');
    }
  }, [user, onRouteChange]);

  return (
    <div className="App">
      <Background />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />

      <Routes>
        <Route
          path="/"
          element={
            isSignedIn ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
        <Route
          path="signin"
          element={<Signin onRouteChange={onRouteChange} />}
        />
        <Route
          path="register"
          element={<Register onRouteChange={onRouteChange} />}
        />
        <Route
          path="home"
          element={
            isSignedIn ? (
              <Home imageUrl={imageUrl} setImageUrl={setImageUrl} />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
