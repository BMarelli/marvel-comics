export interface InformationComic {
  name: string
  resourceURI: string
}

export interface InformationCharacter {
  name: string
  resourceURI: string
}

export interface ComicInterface {
  id: number
  title: string
  thumbnail: { path: string, extension: string }
  description: string
  characters: { available: number, items: InformationCharacter[] }
}


export interface CharacterInterface {
  id: number
  resourceURI: string
  name: string
  thumbnail: { path: string, extension: string }
  description: string
  comics: { available: number, items: InformationComic[] }
}
