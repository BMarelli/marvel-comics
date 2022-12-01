import React from 'react'
import { ComicInterface } from '../../types/Comic'
import './Comic.css'

interface ComicProps {
  comic: ComicInterface
}

export const Comic: React.FC<ComicProps> = ({ comic }) => {
  return (
    <div className="item">
      <h3>{comic.title}</h3>
      <img src={`${comic.thumbnail.path}/portrait_medium.${comic.thumbnail.extension}`} alt="" />
    </div>
  )
}
