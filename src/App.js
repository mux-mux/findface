import { Component } from 'react';

import Navigation from './components/Navigation/Navigation';
import ImageForm from './components/ImageForm/ImageForm';
import Rank from './components/Rank/Rank';
import Background from './components/Background/Background';

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
    };
  }

  onInputChange = (e) => {
    console.log(e.target.value);
  };

  onButtonSubmit = () => {
    console.log('click');
  };

  render() {
    return (
      <div className="App">
        <Background />
        <Navigation />
        <Rank />
        <ImageForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
        {/* <FaceRecognition /> */}
      </div>
    );
  }
}

export default App;
