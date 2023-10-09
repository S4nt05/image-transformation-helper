import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import ImageEditorWithOCR2 from './ImageEditorWithOCR2';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageEditorWithOCR2/>} />
      </Routes>
    </Router>
  );
}

export default App;