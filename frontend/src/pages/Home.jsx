import React from 'react'
import {Link} from "react-router-dom"

const Home = () => {
  return (
    <div className='w-full h-screen bg-neutral-800 text-white flex items-center justify-center gap-10'>
      home
      
      <Link to={"/register"} className='text-blue-400 cursor-pointer'>Register</Link>
      <Link to={"/login"} className='text-blue-400 cursor-pointer'>Login</Link>



    </div>
  )
}

export default Home
