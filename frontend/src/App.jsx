import React, { useEffect } from "react";
import Mainroutes from "./routes/Mainroutes";
import { useDispatch, useSelector } from "react-redux";
import { asyncLoadCurrentUser } from "./store/actions/userAction";
import { useNavigate } from "react-router-dom";


const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state?.userReducer?.user);
  useEffect(() => {
    dispatch(asyncLoadCurrentUser()); 
  },[dispatch]);

  useEffect(()=>{
    if(currentUser === null){
      navigate('/');
    }
  },[currentUser, navigate]);

  
  return (
    <div>
      <Mainroutes />
    </div>
  );
};


export default App;
