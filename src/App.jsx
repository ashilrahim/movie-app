import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MovieDetails from './MovieDetails'
import Home from './Home'

const App = () => {
  return (
    <main className='w-full justify-center items-center'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </main>
  )
}

export default App