import React, { useState } from 'react';

import Navigation from './components/Navigation/Navigation';
import ImageForm from './components/ImageForm/ImageForm';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import FindFace from './components/FindFace/FindFace';
import Background from './components/Background/Background';

import './App.css';

const App = () => {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);

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
        <div>
          <Rank />
          <ImageForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
          {imageUrl !== '' ? <FindFace imageUrl={imageUrl} /> : null}
        </div>
      );
    } else if (route === 'signin') {
      return <Signin onRouteChange={onRouteChange} />;
    } else {
      return <Register onRouteChange={onRouteChange} />;
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
