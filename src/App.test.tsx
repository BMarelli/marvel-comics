import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

import { Fetcher } from './util/api'
import { CharacterInterface, ComicInterface } from './types/Comic';
import { ApiResponse } from './types/Fetcher'
import { Home } from './views/Home';
import { Comics } from './views/Comics';
import { Characters } from './views/Characters';

afterEach(() => {
  jest.clearAllMocks();
});

describe('Home view', () => {
  it('should render 20 comics', async () => {
    const fetcher = new Fetcher()
    const json_test: ApiResponse<ComicInterface[]> = require('./test/test_comics.json')
    jest.spyOn(fetcher, 'getComics').mockImplementation(() => Promise.resolve(json_test.data.results))
    render(
      <BrowserRouter>
        <Home fetcher={fetcher}></Home>
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      const comics = screen.getAllByRole('comic')
      expect(comics.length).toBe(20)
    })
  })

  it('should render comics with links to "/comic/:id"', async () => {
    const fetcher = new Fetcher()
    const json_test: ApiResponse<ComicInterface[]> = require('./test/test_comics.json')
    jest.spyOn(fetcher, 'getComics').mockImplementation(() => Promise.resolve(json_test.data.results))
    render(
      <BrowserRouter>
        <Home fetcher={fetcher}></Home>
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      const comics = screen.getAllByRole('comic')
      expect(comics.length).toBe(20)
      for (let i = 0; i < 20; i++) {
        expect(comics[i].getAttribute('href')).toBe(`/comic/${json_test.data.results[i].id}`)
      }
    })
  })

  it('should not render comics', async () => {
    const fetcher = new Fetcher()
    const json_test: ApiResponse<ComicInterface[]> = require('./test/test_comics_empty.json')
    jest.spyOn(fetcher, 'getComics').mockImplementation(() => Promise.resolve(json_test.data.results))
    render(
      <BrowserRouter>
        <Home fetcher={fetcher}></Home>
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByRole('comic')).not.toBeInTheDocument();
    })
  })
})

// describe('Comic view', () => {
//   it('should render comic information', async () => {
//     const fetcher = new Fetcher()
//     const json_test: ApiResponse<ComicInterface[]> = require('./test/test_comic_6181.json')
//     jest.spyOn(fetcher, 'getComic').mockImplementation(() => Promise.resolve(json_test.data.results[0]))
//     const comic = json_test.data.results[0]

//     render(
//       <MemoryRouter initialEntries={[`/comic/${comic.id}`]}>
//         <Comics fetcher={fetcher}></Comics>
//       </MemoryRouter>
//     )

//     expect(screen.getByText('Loading...')).toBeInTheDocument()

//     await waitFor(() => {
//       expect(screen.getByText(comic.title)).toBeInTheDocument()
//     })

//     expect(screen.getByText(comic.description)).toBeInTheDocument()

//     comic.characters.items.forEach(character => {
//       expect(screen.getByText(character.name)).toBeInTheDocument()
//     })
//   })

//   it("should render comic's characters links to '/character/:id'", async () => {
//     const fetcher = new Fetcher()
//     const json_test: ApiResponse<ComicInterface[]> = require('./test/test_comic_6181.json')
//     jest.spyOn(fetcher, 'getComic').mockImplementation(() => Promise.resolve(json_test.data.results[0]))
//     const comic = json_test.data.results[0]

//     render(
//       <MemoryRouter initialEntries={[`/comic/${comic.id}`]}>
//         <Comics fetcher={fetcher}></Comics>
//       </MemoryRouter>
//     )

//     expect(screen.getByText('Loading...')).toBeInTheDocument()

//     await waitFor(() => {
//       comic.characters.items.forEach(character => {
//         let id = character.resourceURI.split('/').pop()
//         expect(screen.getByText(character.name).getAttribute('href')).toBe(`/character/${id}`)
//       })
//     })
//   })

//   it("should not render comic's characters", async () => {
//     const fetcher = new Fetcher()
//     const json_test: ApiResponse<ComicInterface[]> = require('./test/test_comic_6181.json')
//     jest.spyOn(fetcher, 'getComic').mockImplementation(() => Promise.resolve(json_test.data.results[0]))
//     const comic = json_test.data.results[0]

//     render(
//       <MemoryRouter initialEntries={[`/comic/${comic.id}`]}>
//         <Comics fetcher={fetcher}></Comics>
//       </MemoryRouter>
//     )

//     expect(screen.getByText('Loading...')).toBeInTheDocument()

//     await waitFor(() => {
//       expect(screen.queryByRole('character')).not.toBeInTheDocument();
//     })
//   })
// })

// describe('Character view', () => {
//   it('should render character information', async () => {
//     const fetcher = new Fetcher()
//     const json_test: ApiResponse<CharacterInterface[]> = require('./test/test_character_1009262.json')
//     jest.spyOn(fetcher, 'getCharacter').mockImplementation(() => Promise.resolve(json_test.data.results[0]))
//     const character = json_test.data.results[0]

//     render(
//       <MemoryRouter initialEntries={[`/comic/${character.id}`]}>
//         <Characters fetcher={fetcher}></Characters>
//       </MemoryRouter>
//     )
//     expect(screen.getByText('Loading...')).toBeInTheDocument()

//     await waitFor(() => {
//       expect(screen.getByText(character.name)).toBeInTheDocument()
//     })

//     expect(screen.getByText(character.description)).toBeInTheDocument()

//     const comics = screen.getAllByRole('comic')
//     expect(comics.length).toBe(character.comics.items.length)

//     character.comics.items.forEach(comic => {
//       expect(screen.getByText(comic.name)).toBeInTheDocument()
//     })
//   })

//   it("should render character's comics links to '/comic/:id'", async () => {
//     const fetcher = new Fetcher()
//     const json_test: ApiResponse<CharacterInterface[]> = require('./test/test_character_1009262.json')
//     jest.spyOn(fetcher, 'getCharacter').mockImplementation(() => Promise.resolve(json_test.data.results[0]))
//     const character = json_test.data.results[0]

//     render(
//       <MemoryRouter initialEntries={[`/comic/${character.id}`]}>
//         <Characters fetcher={fetcher}></Characters>
//       </MemoryRouter>
//     )
//     expect(screen.getByText('Loading...')).toBeInTheDocument()
//     await waitFor(() => {
//       character.comics.items.forEach(comic => {
//         let id = comic.resourceURI.split('/').pop()
//         expect(screen.getByText(comic.name).getAttribute('href')).toBe(`/comic/${id}`)
//       })
//     })
//   })

//   it("should not render character's comics", async () => {
//     const fetcher = new Fetcher()
//     const json_test: ApiResponse<CharacterInterface[]> = require('./test/test_character_1009636.json')
//     jest.spyOn(fetcher, 'getCharacter').mockImplementation(() => Promise.resolve(json_test.data.results[0]))
//     const character = json_test.data.results[0]

//     render(
//       <MemoryRouter initialEntries={[`/character/${character.id}`]}>
//         <Characters fetcher={fetcher}></Characters>
//       </MemoryRouter>
//     )

//     expect(screen.getByText('Loading...')).toBeInTheDocument()

//     await waitFor(() => {
//       expect(screen.queryByRole('comic')).not.toBeInTheDocument();
//     })
//   })
// })
