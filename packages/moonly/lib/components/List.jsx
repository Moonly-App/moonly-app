import React from 'react'
import WithScrollReveal from './WithScrollReveal'

const List = ({ children }) => (
  <div>
    <h1>List:</h1>
    {children}
  </div>
)

export default WithScrollReveal(List)
