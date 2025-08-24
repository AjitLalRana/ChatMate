import React, { useEffect } from "react";
import Mainroutes from "./routes/Mainroutes";
import { useDispatch, useSelector } from "react-redux";
import { asyncLoadCurrentUser } from "./store/actions/userAction";
import { useNavigate } from "react-router-dom";


const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
  const loadUser = async () => {
    const token = document.cookie.includes("token=");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await dispatch(asyncLoadCurrentUser());
    } catch (error) {
      navigate("/login");
    }
  };

  loadUser();
}, [dispatch, navigate]);

  
  return (
    <div>
      <Mainroutes />
    </div>
  );
};


export default App;
