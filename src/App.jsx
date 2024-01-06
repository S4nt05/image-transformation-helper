import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import ImageEditorWithOCR2 from './ImageEditorWithOCR2';
import VideoSplitter from './VideoSplitter';
import './CSS/StyleCropper.css'; // Ajusta la ruta según la ubicación de tu archivo CSS

function App() {
  return (
    <Router>
      <nav>
        <ul className="navbar">
          <li>
            <Link to="/">Image Editor</Link>
          </li>
          <li>
            <Link to="/VideoSplitter">Video Splitter</Link>
          </li>
        </ul>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<ImageEditorWithOCR2 />} />
          <Route path="/VideoSplitter" element={<VideoSplitter />} />
        </Routes>
      </div>
      <div style={{marginTop:'10px'}}>
        <br></br>
      </div>
    </Router>
  );
}

export default App;
