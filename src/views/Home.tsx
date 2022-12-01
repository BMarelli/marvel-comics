import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Fetcher } from '../util/api';

// Types
import { ComicInterface } from '../types/Comic';
import { FetchError } from "../types/Fetcher";

// Components
import { Comic } from '../components/comic/Comic'
import { Error } from '../components/error/Error'

interface HomeProps {
  // offset: number
  // setOffset: React.Dispatch<React.SetStateAction<number>>
  fetcher: Fetcher
}

export const Home: React.FC<HomeProps> = ({ fetcher }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [comics, setComics] = useState<ComicInterface[]>([])
  const [offset, setOffset] = useState<number>(0)
  const [errorText, setErrorText] = useState<string>("")

  useEffect(() => {
    async function fetchData() {
      if (loading) {
        try {
          setComics(await fetcher.getComics(offset))
          setLoading(false)
        } catch (error) {
          if (error instanceof FetchError) setErrorText(error.message)
        }
      }
    }
    fetchData()
  }, [loading, offset, fetcher])

  function updateComicsOffset(n: number): void {
    setLoading(true)
    setOffset(n)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  if (loading) {
    return (<><h1>Loading...</h1></>)
  }

  return (
    <>
      {
        errorText === "" ?
          <div>
            <div className='grid-container'>
              {comics.map(comic => {
                return (
                  <Link key={comic.id} role='comic' to={`/comic/${comic.id}`}><Comic comic={comic}></Comic></Link>
                )
              })}
            </div>
            <hr />
            <div className='nav-pagination'>
              <ul className="pagination">
                <li><button id='left' onClick={(e) => { if (offset >= 1) updateComicsOffset(offset - 1) }}><span aria-hidden="true">«</span></button></li>
                <li><p>{offset}</p></li>
                <li><button id='right' onClick={(e) => updateComicsOffset(offset + 1)}><span aria-hidden="true">»</span></button></li>
              </ul>
            </div>
          </div>
          :
          <div className='layout'>
            <Error text={errorText}></Error>
          </div>
      }
    </>
  )
}
