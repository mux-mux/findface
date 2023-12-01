import React, { useState } from 'react';

import Navigation from './components/Navigation/Navigation.js';
import ImageForm from './components/ImageForm/ImageForm.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';
import Rank from './components/Rank/Rank.js';
import FindFace from './components/FindFace/FindFace.js';
import Background from './components/Background/Background.js';

import './App.css';

const App = () => {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: 0,
    name: '',
    email: '',
    entries: 0,
    joined: '',
  });

  const loadUser = (userProfile) => {
    setUser({
      id: userProfile.id,
      name: userProfile.name,
      email: userProfile.email,
      entries: userProfile.entries,
      joined: userProfile.joined,
    });
  };

  const onInputChange = (e) => {
    setInput(e.target.value);
  };

  const onImageSubmit = () => {
    setImageUrl(input);
  };

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setIsSignedIn(false);
    } else if (route === 'home') {
      setIsSignedIn(true);
    }
    setRoute(route);
  };

  const showHomeOrForm = () => {
    if (route === 'home') {
      return (
        <div className="tc">
          <Rank userName={user.name} userEntries={user.entries} />
          <ImageForm onInputChange={onInputChange} onImageSubmit={onImageSubmit} />
          {imageUrl !== '' ? (
            <FindFace imageUrl={imageUrl} userID={user.id} setUser={setUser} user={user} />
          ) : null}
        </div>
      );
    } else if (route === 'signin') {
      return <Signin loadUser={loadUser} onRouteChange={onRouteChange} />;
    } else {
      return <Register loadUser={loadUser} onRouteChange={onRouteChange} />;
    }
  };

  return (
    <div className="App">
      <Background />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {showHomeOrForm()}
    </div>
  );
};

export default App;
