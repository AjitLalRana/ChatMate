import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Register from "../pages/Register"
import Login from '../pages/Login'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'

const Mainroutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/auth/dashboard' element={<Dashboard/>}/>

    </Routes>
  )
}

export default Mainroutes
