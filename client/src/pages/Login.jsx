import React from 'react'
import { useState } from 'react'
import { assets } from '../assets/assets.js'

const Login = () => {

  const[state,setState] =useState("Sign up")


  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 via-purple-700 to-pink-300'>
    <img src={assets.logo} alt="" className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"  />
    <div>
    <h2>{state === "Sign up" ? "Create  Account" : "Login  account"}</h2>
    <p>{state === "Sign up" ? "Create Your Account" : "Login to your account"}</p>
    </div>
    
    </div>
  )
}

export default Login