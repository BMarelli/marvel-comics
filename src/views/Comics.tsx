import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Fetcher } from '../util/api'
import { parseIdfromURI } from '../util/util'

// Types
import { ComicInterface } from '../types/Comic'
import { FetchError } from "../types/Fetcher";

// Components
import { Error } from '../components/error/Error'

interface ComicsProps {
  fetcher: Fetcher
}

export const Comics: React.FC<ComicsProps> = ({ fetcher }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [comic, setComic] = useState<ComicInterface | undefined>(undefined)
  const [errorText, setErrorText] = useState<string>("")
  let { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        if (id) {
          setComic(await fetcher.getComic(+id))
          setLoading(false)
        }
      } catch (error) {
        if (error instanceof FetchError) setErrorText(error.message)
      }
    }
    fetchData()
  }, [id, fetcher])

  if (loading) {
    return <><h1>Loading...</h1></>
  }

  return (
    <>
      {
        errorText === "" ?
          <div className='comic-view'>
            <h3>{comic?.title}</h3>
            <div className='img-container'>
              <img src={`${comic?.thumbnail.path}/portrait_incredible.${comic?.thumbnail.extension}`} alt={comic?.id.toString()} />
            </div>
            {comic?.description ? <p>{comic?.description}</p> : <p>No description</p>}
            <hr />
            <h4>Characters</h4>
            {comic?.characters.available ? <ul>
              {comic?.characters.items.map(character => <li key={`comic-${character.name}`}><Link role='character' to={`/character/${parseIdfromURI(character.resourceURI)}`}>{character.name}</Link></li>)}
            </ul>
              : <h4>There are no characters</h4>}
          </div>
          :
          <div className='layout'>
            <Error text={errorText}></Error>
          </div>
      }
    </>
  )
}
