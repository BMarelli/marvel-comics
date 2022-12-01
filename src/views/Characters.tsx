import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Fetcher } from '../util/api'
import { parseIdfromURI } from '../util/util'

// Types
import { CharacterInterface } from '../types/Comic'
import { FetchError } from "../types/Fetcher";

// Components
import { Error } from '../components/error/Error'

interface CharactersProps {
  fetcher: Fetcher
}

export const Characters: React.FC<CharactersProps> = ({ fetcher }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [character, setCharacter] = useState<CharacterInterface | undefined>(undefined)
  const [errorText, setErrorText] = useState<string>("")
  let { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        if (id) {
          setCharacter(await fetcher.getCharacter(+id))
          setLoading(false)
        }
      } catch (error) {
        if (error instanceof FetchError) setErrorText(error.message)
      }
    }
    fetchData()
  }, [id, loading, fetcher])

  if (loading) {
    return (<><h1>Loading...</h1></>)
  }

  return (
    <>
      {
        errorText === "" ?
          <div>
            <h3>{character?.name}</h3>
            <div className="img-container">
              <img src={`${character?.thumbnail.path}/portrait_incredible.${character?.thumbnail.extension}`} alt={character?.id.toString()} />
            </div>
            {character?.description ? <p>{character?.description}</p> : <p>No description</p>}
            <hr />
            <h4>Comics</h4>
            {character?.comics.available ?
              <ul>
                {character?.comics.items.map(comic => <li key={`comic-${comic.name}`}><Link role="comic" to={`/comic/${parseIdfromURI(comic.resourceURI)}`}>{comic.name}</Link></li>)}
              </ul>
              : <h4>There are no comics</h4>}
          </div>
          :
          <div className='layout'>
            <Error text={errorText}></Error>
          </div>
      }
    </>
  )
}
