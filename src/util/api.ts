import { ApiResponse, FetchError } from "../types/Fetcher";
import md5 from "blueimp-md5";
import { ComicInterface, CharacterInterface } from "../types/Comic";

// export const MARVEL_PUB_KEY = "074de923ec9ffafe7651fb0668947078"
// export const MARVEL_PRIV_KEY = "9f60cc8d6d8dac104f166f1b5a805909ef27ddf8"
// export const API = "https://gateway.marvel.com"

export class Fetcher {
  private api = "https://gateway.marvel.com"
  private public_key = "074de923ec9ffafe7651fb0668947078"
  private private_key = "9f60cc8d6d8dac104f166f1b5a805909ef27ddf8"

  /*
    Abstraction of the fetch method to make it easier to use
    @param endpoint: string - the endpoint to fetch from
    @param offset: number | undefined - the offset to fetch from
    @returns Promise<T> - the response from the fetch
  */
  private async fetch<T>(endpoint: string, offset?: number): Promise<T> {
    let ts: number = Date.now()
    let hash = md5(`${ts}${this.private_key}${this.public_key}`);
    let url = offset ? `${this.api}${endpoint}offset=${offset}&ts=${ts}&apikey=${this.public_key}&hash=${hash}`
      : `${this.api}${endpoint}ts=${ts}&apikey=${this.public_key}&hash=${hash}`
    let response = await fetch(url)

    if (!response.ok) {
      const errorStatus = await this.parseErrorFromResponse(response)

      throw new FetchError(errorStatus)
    }

    return await response.json()
  }

  /*
    Parses the error from the response
    @param response: Response - the response to parse
    @returns Promise<string | undefined> - the error message or undefined
  */
  private async parseErrorFromResponse(response: Response): Promise<string | undefined> {
    try {
      return (await response.json()).status
    } catch (error) {
      return undefined
    }
  }

  /*
    Fetches the comics from the Marvel API
    @param offset: number | undefined - the offset to fetch from
    @returns Promise<ComicInterface[]> - the comics from the API
  */
  async getComics(offset?: number): Promise<ComicInterface[]> {
    const response = await this.fetch<ApiResponse<ComicInterface[]>>(':443/v1/public/comics?format=comic&', offset)

    return response.data.results.map<ComicInterface>(comic => {
      return {
        id: comic.id,
        title: comic.title,
        description: comic.description,
        thumbnail: comic.thumbnail,
        characters: { available: comic.characters.available, items: comic.characters.items }
      }
    })
  }

  /*
    Fetches a specific comic from the Marvel API
    @param id: number - the id of the comic to fetch
    @returns Promise<ComicInterface> - the comic from the API
  */
  async getComic(id: number): Promise<ComicInterface> {
    const response = await this.fetch<ApiResponse<ComicInterface[]>>(`:443/v1/public/comics/${id}?`)
    const comic = response.data.results[0]

    return {
      id: comic.id,
      title: comic.title,
      thumbnail: comic.thumbnail,
      description: comic.description,
      characters: { available: comic.characters.available, items: comic.characters.items }
    }
  }

  /*
    Fetches a specific character from the Marvel API
    @param id: number - the id of the character to fetch
    @returns Promise<CharacterInterface> - the character from the API
  */
  async getCharacter(id: number): Promise<CharacterInterface> {
    const response = await this.fetch<ApiResponse<CharacterInterface[]>>(`:443/v1/public/characters/${id}?`)
    const character = response.data.results[0]
    return {
      id: character.id,
      name: character.name,
      resourceURI: character.resourceURI,
      thumbnail: character.thumbnail,
      description: character.description,
      comics: { available: character.comics.available, items: character.comics.items }
    }
  }
}
