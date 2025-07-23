import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/pexels-visax-179884925-12815478.jpg")] bg-cover bg-center bg-no-repeat'>
      <Navbar />
      <Header />
    </div>
  )
}

export default Home