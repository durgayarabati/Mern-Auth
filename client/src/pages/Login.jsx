import React from 'react'
import { useState } from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import axios from 'axios'
import { AppContext } from '../context/AppContext.jsx'
import { toast, ToastContainer } from 'react-toastify'

const Login = () => {

  const navigate = useNavigate();

  const {backendUrl,setisLoggedIn,getUserData} = useContext(AppContext);

  const [state, setState] = useState("Sign up")
  const [Name, setName] = useState("")
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  const onsubmitHandler = async (e) => {
    try{
      e.preventDefault();
      axios.defaults.withCredentials = true
      
      if (state === "Sign up") {
        const {data} = await axios.post(backendUrl + "/api/auth/register", {Name,Email,Password});

        if (data.success) {
          setisLoggedIn(true);
          getUserData();
          navigate("/");

        }
        else{
          toast.error(data.message);
        }

      }
      else{
        const {data} = await axios.post(backendUrl + "/api/auth/login", {Email,Password});
        if (data.success) {
          setisLoggedIn(true);
          navigate("/");
        }
        else{
          toast.error(data.message);
        }
      }
    }
    

    catch(err){
      console.log(err);
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 via-purple-700 to-pink-300'>
      <img onClick={() => navigate("/")} src={assets.logo} alt="" className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer" />
      <div className='bg-slate-900 p-10 rounded-lg shadowlg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-2xl font-semibold text-center text-white mb-4'>{state === "Sign up" ? "Create  Account" : "Login  account"}</h2>
        <p className='text-center mb-4'>{state === "Sign up" ? "Create Your Account" : "Login to your account"}</p>
        <form onSubmit={onsubmitHandler}>
          {state === "Sign up" && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt="" />
              <input onChange={(e) => setName(e.target.value)} value ={Name} className='bg-transparent' type='text' placeholder='Full Name' required />

            </div>

          )}

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />
            <input onChange={(e) => setEmail(e.target.value)} value={Email} className='bg-transparent' type='email' placeholder='Email id' required />

          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" />
            <input onChange={(e) => setPassword(e.target.value)} value={Password} className='bg-transparent' type='password' placeholder='enter password' required />

          </div>
          <p onClick={() => navigate("/reset-password")} className='text-left mb-4 text-indigo-300'>Forgot Password</p>

          <button className='w-full py-2.5  rounded-full px-6 py-2 text-gray-800 bg-gradient-to-br from-blue-200 via-purple-700 to-pink-100 transition-all bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium'>{state}</button>
        </form>
        {state === "Sign up" ? (<p className='text-center text-gray-400 text-xs mt-4'>Already have an account ?{''}
          <span onClick={() => setState("Login")} className='text-indigo-300 cursor-pointer'>Login here</span>
        </p>)
          : <p className='text-center text-gray-400 text-xs mt-4'>Don't have an account ?{''}
            <span onClick={() => setState("Sign up")} className='text-indigo-300 cursor-pointer'>Sign up</span>
          </p>}


      </div>


    </div>
  )
}

export default Login;