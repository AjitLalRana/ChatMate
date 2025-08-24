import axios from "../../api/axiosconfig"
import { loadmessages } from "../reducers/messageSlice";


export const asyncLoadMessages = (chatId)=> async(dispatch, getState)=>{
    try {
        const res = await axios.get(`/api/messages/${chatId}`);
        const  currentChatMessages = res?.data?.messages;
        console.log(currentChatMessages)
        

    await dispatch(loadmessages(currentChatMessages));
    } catch (error) {
        console.log(error)
    }
    
}

export const asyncAddMessage = (message) => async(dispatch,getState)=>{
    try {
        if(message.role == "user"){
            
        }
    } catch (error) {
        
    }
}

// export const asyncCurrentChatMessages = ()=> async(dispatch,getState)=>{
//     try {
        
//     } catch (error) {
//         console.log("loading current chat messages error : ",error)
//     }
// }
