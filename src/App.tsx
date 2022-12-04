import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import './App.css';


// Views
import { Home } from './views/Home';
import { Characters } from './views/Characters';
import { Comics } from './views/Comics';
import { Fetcher } from './util/api';

function App() {
  const fetcher = new Fetcher()

  return (
    <>
      <header className='nav'>
        <Link to="/"><h1>Marvel Universe</h1></Link>
      </header>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home fetcher={fetcher} />} />
          <Route path="comic/:id" element={<Comics fetcher={fetcher} />} />
          <Route path="character/:id" element={<Characters fetcher={fetcher} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
