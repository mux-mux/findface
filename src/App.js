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

  const onInputChange = (e) => {
    setInput(e.target.value);
  };

  const onButtonSubmit = () => {
    setImageUrl(input);
  };

  const onRouteChange = (route) => {
    setRoute(route);
  };

  return (
    <div className="App">
      <Background />
      <Navigation onRouteChange={onRouteChange} />
      {route === 'home' ? (
        <div>
          <Rank />
          <ImageForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
          {imageUrl !== '' ? <FindFace imageUrl={imageUrl} /> : null}
        </div>
      ) : route === 'signin' ? (
        <Signin onRouteChange={onRouteChange} />
      ) : (
        <Register onRouteChange={onRouteChange} />
      )}
    </div>
  );
};

export default App;
