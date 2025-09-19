import React from 'react'
import {useRef} from "react"
import {useForm} from "react-hook-form"
import {Link,useNavigate} from "react-router-dom"
import {asyncRegisterUser} from "../store/actions/userAction"
import {useDispatch} from "react-redux"

const Register = () => {
  const {register,reset,handleSubmit} = useForm()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registerHandler = async(data)=>{
    const user ={
      fullName:{
        firstName : data?.firstName,
        lastName : data?.lastName
      },
      email: data?.email,
      password : data?.password
    }
     dispatch(asyncRegisterUser(user));
    reset();
    navigate("/auth/dashboard");
  }
  return (
    <div className='w-full h-screen bg-zinc-900 flex items-center justify-center'>
      <div className="container w-[300px] md:w-[400px] bg-amber-200 rounded-xl flex flex-col items-center gap-4 py-10">
        <h1 className='text-2xl font-semibold'>Create an Account</h1>
        <h4>Its simple and easy!</h4>
          <form onSubmit={handleSubmit(registerHandler)} className='w-[90%] bg-amber-300 shadow-xl rounded-2xl p-4'>
            <label>First Name :</label>
            <input
            className='w-full h-[2rem] border-[1px] px-2 rounded'
              {...register("firstName",{required : true})}
              type="text"
              placeholder='First-name' />

            <label>Last Name :</label>
            <input
            className='w-full h-[2rem] border-[1px] px-2 rounded'

              {...register("lastName",{required: true})}
              type="text"
              placeholder='Last-name' />

            <label>Email :</label>
            <input
            className='w-full h-[2rem] border-[1px] px-2 rounded'

              {...register("email",{required : true})}
              type="email"
              placeholder='Enter your email' />  

            <label>Password :</label>
            <input
            className='w-full h-[2rem] border-[1px] px-2 rounded'

              {...register("password",{required : true})}
              type="password"
              placeholder='Enter your password' /> 

              <div className="button mt-8 w-full flex items-center justify-center">
                    <button className='w-auto h-auto bg-blue-400 px-3 py-1 rounded-full shadow-xl cursor-pointer hover:scale-105 ' type='submit'>Submit</button> 
              </div>

          </form>
          <Link to={"/login"}>Already have an account. <span className='text-blue-600'>login</span></Link>



      </div>
      
    </div>
  )
}

export default Register
