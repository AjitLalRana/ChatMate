import React, { useEffect } from "react";
import Mainroutes from "./routes/Mainroutes";
import { useDispatch, useSelector } from "react-redux";
import { asyncLoadCurrentUser } from "./store/actions/userAction";
import { useNavigate } from "react-router-dom";


const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(asyncLoadCurrentUser()); 
  },[dispatch]);

  

  
  return (
    <div>
      <Mainroutes />
    </div>
  );
};


export default App;
