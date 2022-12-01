import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import './App.css';


// Views
import { Home } from './views/Home';
import { Characters } from './views/Characters';
import { Comics } from './views/Comics';
import { Fetcher } from './util/api';
import { CharacterInterface, ComicInterface } from './types/Comic';
import { ApiResponse } from './types/Fetcher'

function App() {
  const comicFetcher = new Fetcher<ApiResponse<ComicInterface[]>>()
  const characterFetcher = new Fetcher<ApiResponse<CharacterInterface[]>>()

  return (
    <>
      <header className='nav'>
        <Link to="/"><h1>Marvel Universe</h1></Link>
      </header>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home fetcher={comicFetcher} />} />
          <Route path="comic/:id" element={<Comics fetcher={comicFetcher} />} />
          <Route path="character/:id" element={<Characters fetcher={characterFetcher} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
