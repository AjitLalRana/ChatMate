import { loadchats,addchat,logoutchats } from "../reducers/chatSlice";

import axios from "../../api/axiosconfig"

export const asyncAddNewChat = (title) => async(dispatch,getState) => {
    try {
            const res = await axios.post("/api/chat",title,{withCredentials: true});
            const newChat = res.data?.chat;
            // console.log(newChat)

            //may causes problem
            dispatch(addchat(newChat));
            return newChat;
    } catch (error) {
        console.log("adding new chat error ;",error);
    }
}

export const asyncLoadUserChats = ()=> async(dispatch,getState) =>{
    try {
        const res = await axios.get("/api/chat/user",{withCredentials: true});
        const userChats = res.data?.userChats;
        await dispatch(loadchats(userChats));
    } catch (error) {
        console.log(error);
    }
}