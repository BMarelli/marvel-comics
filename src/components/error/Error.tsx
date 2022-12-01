import React from 'react'

interface ErrorProps {
  text: string
}

export const Error: React.FC<ErrorProps> = ({ text }) => {
  return (
    <div className='center'>
      <h1>{text}</h1>
    </div>
  )
}
