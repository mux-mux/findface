import React, { useState, useEffect, useCallback, createContext } from 'react';
import DOMPurify from 'dompurify';

import Navigation from './components/Navigation/Navigation.js';
import ImageForm from './components/ImageForm/ImageForm.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';
import Rank from './components/Rank/Rank.js';
import FindFace from './components/FindFace/FindFace.js';
import Background from './components/Background/Background.js';
import Spinner from './components/Spinner/Spinner.js';

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
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [user, setUser] = useState(initialUserState);

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

  const onInputChange = (e) => {
    setInput(e.target.value);
  };

  const onImageSubmit = async (e) => {
    e.preventDefault();
    const sanitizedUrl = DOMPurify.sanitize(input).trim();
    (await isImageUrl(sanitizedUrl)) && setImageUrl(sanitizedUrl);
  };

  function isImageUrl(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => {
        alert('Url is not an image');
        resolve(false);
      };
      img.src = url;
    });
  }

  const onRouteChange = useCallback((newRoute) => {
    if (newRoute === 'signout') {
      setIsSignedIn(false);
      setUser(initialUserState);
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('rankBadge');
    } else if (newRoute === 'home') {
      setIsSignedIn(true);
    }
    setRoute(newRoute);
  }, []);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (!token) {
      setIsAuthChecking(false);
      return;
    }

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
      } finally {
        setIsAuthChecking(false);
      }
    };

    fetchUser();
  }, [loadUser, onRouteChange]);

  const onUserDataChange = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  const renderRoute = () => {
    switch (route) {
      case 'home':
        return (
          <div className="text-center">
            <Rank userName={user.name} userEntries={user.entries} />
            <ImageForm
              onInputChange={onInputChange}
              onImageSubmit={onImageSubmit}
            />
            {imageUrl && (
              <FindFace
                imageUrl={imageUrl}
                onUserDataChange={onUserDataChange}
                user={user}
              />
            )}
          </div>
        );
      case 'signin':
      case 'signout':
        return <Signin loadUser={loadUser} onRouteChange={onRouteChange} />;
      case 'register':
      default:
        return <Register loadUser={loadUser} onRouteChange={onRouteChange} />;
    }
  };

  return (
    <div className="App">
      <Background />
      <UserContext.Provider value={{ user, loadUser }}>
        <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      </UserContext.Provider>
      {isAuthChecking ? <Spinner /> : renderRoute()}
    </div>
  );
};

export default App;
