import React from 'react';
import '../styles/App.css';
import { BrowserRouter as Router } from 'react-router-dom'

import Header from './Header'

function App() {
  return (
    <Router>
      <Header />
    </Router>
  );
}

export default App;
