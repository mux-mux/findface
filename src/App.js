import { useState, useEffect, useCallback, createContext } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation.js';
import Signin from './pages/Signin/Signin.js';
import Register from './pages/Register/Register.js';
import Background from './components/Background/Background.js';
import Home from './pages/Home.js';

const initialUserState = {
  id: 0,
  name: '',
  email: '',
  profileImage: 'http://localhost:3001/uploads/default-profile-image.png',
  age: 0,
  entries: 0,
  joined: '',
};

export const UserContext = createContext(null);

const App = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(initialUserState);
  const navigate = useNavigate();

  const loadUser = useCallback((userProfile) => {
    setImageUrl('');
    setUser({
      id: userProfile.id,
      name: userProfile.name,
      email: userProfile.email,
      profileImage: userProfile.profileImage,
      age: userProfile.age,
      entries: userProfile.entries,
      joined: userProfile.joined,
    });
  }, []);

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
    [navigate]
  );

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (!token) return;

    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:3001/signin', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        const data = await response.json();

        if (data?.id) {
          const profile = await fetch(
            `http://localhost:3001/profile/${data.id}`,
            {
              method: 'get',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token,
              },
            }
          );
          const profileData = await profile.json();

          if (profileData?.email) {
            loadUser(profileData);
            onRouteChange('home');
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [loadUser, onRouteChange]);

  const onUserDataChange = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  return (
    <div className="App">
      <Background />
      <UserContext.Provider value={{ user, loadUser }}>
        <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      </UserContext.Provider>

      <Routes>
        <Route
          path="/"
          element={
            isSignedIn ? (
              <Home
                user={user}
                imageUrl={imageUrl}
                onUserDataChange={onUserDataChange}
                setImageUrl={setImageUrl}
              />
            ) : (
              <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
            )
          }
        />
        <Route
          path="signin"
          element={<Signin loadUser={loadUser} onRouteChange={onRouteChange} />}
        />
        <Route
          path="register"
          element={
            <Register loadUser={loadUser} onRouteChange={onRouteChange} />
          }
        />
        <Route
          path="home"
          element={
            isSignedIn ? (
              <Home
                user={user}
                imageUrl={imageUrl}
                onUserDataChange={onUserDataChange}
                setImageUrl={setImageUrl}
              />
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
