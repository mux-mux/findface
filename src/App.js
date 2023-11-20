import { Component } from 'react';

import Navigation from './components/Navigation/Navigation';
import ImageForm from './components/ImageForm/ImageForm';
import Rank from './components/Rank/Rank';
import FindFace from './components/FindFace/FindFace';
import Background from './components/Background/Background';

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
    };
  }

  onInputChange = (e) => {
    this.setState({ input: e.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
  };

  render() {
    return (
      <div className="App">
        <Background />
        <Navigation />
        <Rank />
        <ImageForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
        <FindFace imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
