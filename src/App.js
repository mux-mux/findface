import React, { useState } from 'react';

import Navigation from './components/Navigation/Navigation';
import ImageForm from './components/ImageForm/ImageForm';
import Rank from './components/Rank/Rank';
import FindFace from './components/FindFace/FindFace';
import Background from './components/Background/Background';

import './App.css';

const App = () => {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const onInputChange = (e) => {
    setInput(e.target.value);
  };

  const onButtonSubmit = () => {
    setImageUrl(input);
  };

  return (
    <div className="App">
      <Background />
      <Navigation />
      <Rank />
      <ImageForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
      {imageUrl !== '' ? <FindFace imageUrl={imageUrl} /> : null}
    </div>
  );
};

export default App;
