import Navigation from './components/Navigation/Navigation';
import ImageForm from './components/ImageForm/ImageForm';
import Rank from './components/Rank/Rank';
import Background from './components/Background/Background';

import './App.css';

function App() {
  return (
    <div className="App">
      <Background />
      <Navigation />
      <Rank />
      <ImageForm />
      {/* <FaceRecognition /> */}
    </div>
  );
}

export default App;
