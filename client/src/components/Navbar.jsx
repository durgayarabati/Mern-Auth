import React from 'react';
import { useNavigate } from 'react-router-dom'
import{assets} from '../assets/assets.js'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';

const Navbar = () => {

    const navigate = useNavigate();
    const {userData,backendUrl,setisLoggedIn,setUserData} = useContext(AppContext);

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
        <img src={assets.logo} alt='' className='w-28 sm:w-32' />

        {userData ? 
        <div className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>
          {userData.name[0].toUppercase()}
          <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
            <ul></ul> 
          </div>
          :
          <button onClick={() => navigate('/register')} 
          className='flex items-center gap-2 border border-gray-500 
          rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>Sign up</button>
        }

       
    </div>
  )
}

export default Navbar