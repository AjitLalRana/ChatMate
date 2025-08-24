import React from 'react'
import {useRef} from "react"
import {useForm} from "react-hook-form"
import {Link,useNavigate} from "react-router-dom"
import {asyncLoginUser} from "../store/actions/userAction"
import {useDispatch,} from "react-redux"


const Login = () => {
  const {register,reset,handleSubmit} = useForm()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginHandler = async(user)=>{
    console.log(user)
    const success =  await dispatch(asyncLoginUser(user));
    if(success){
      reset();
      navigate("/auth/dashboard");
    }
    
  }
  return (
    <div className='w-full h-screen bg-zinc-900 flex items-center justify-center'>
      <div className="container w-[400px] bg-amber-200 rounded flex flex-col items-center gap-4 py-10">
        <h1 className='text-2xl'>Enter your credentials.</h1>
        <h4>Its simple and quick!</h4>
          <form onSubmit={handleSubmit(loginHandler)} className='w-[90%] bg-amber-300 rounded-2xl p-4'>

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
                    <button className='w-auto h-auto bg-blue-400 px-3 py-1 rounded-full cursor-pointer ' type='submit'>Submit</button> 
              </div>

          </form>
          <Link to={"/register"}>Don't hava any account!. <span className='text-blue-600'>Register</span></Link>



      </div>
      
    </div>
  )
}


export default Login
