import { createRoot } from 'react-dom/client';
import App from './App.js';

it('renders without crashing', () => {
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  }
});
