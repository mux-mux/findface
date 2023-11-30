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

  const loadUser = (newUser) => {
    setUser({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      entries: newUser.entries,
      joined: newUser.joined,
    });
  };

  const onInputChange = (e) => {
    setInput(e.target.value);
  };

  const onButtonSubmit = () => {
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
          <Rank />
          <ImageForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
          {imageUrl !== '' ? <FindFace imageUrl={imageUrl} /> : null}
        </div>
      );
    } else if (route === 'signin') {
      return <Signin onRouteChange={onRouteChange} />;
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
