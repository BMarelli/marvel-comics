import { FetchError } from "../types/Fetcher";
import md5 from "blueimp-md5";

// export const MARVEL_PUB_KEY = "074de923ec9ffafe7651fb0668947078"
// export const MARVEL_PRIV_KEY = "9f60cc8d6d8dac104f166f1b5a805909ef27ddf8"
// export const API = "https://gateway.marvel.com"

export class Fetcher< T=any > {
  private api = "https://gateway.marvel.com"
  private public_key = "074de923ec9ffafe7651fb0668947078"
  private private_key = "9f60cc8d6d8dac104f166f1b5a805909ef27ddf8"

  async fetch(endpoint: string, offset?: number): Promise<T> {
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

  private async parseErrorFromResponse(response: Response): Promise<string | undefined> {
    try {
      return (await response.json()).status
    } catch(error) {
      return undefined
    }
  }
}
