import React from 'react'
import { assets } from '../assets/assets.js'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'

const Header = () => {

  const {userData} = useContext(AppContext);
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-900'>
        <img src={assets.header_img} alt=""
        className='w-36 h-36 rounded-full mb-6' />
        <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {userData ? userData.name : 'Developer'} <img className='w-8 aspect-square' src={assets.hand_wave} alt="" />'</h1>
        <h2 className='text-2xl sm:text-4xl font-semibold mb-4'>Welcome to Prasad-Mern Auth App</h2>
        <p className='mb-6 max-w-md'>lets start with a quick product tour and we will have you up and rumming in no time !</p>
        <button className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>Get Started</button>
    </div>
  )
}

export default Header