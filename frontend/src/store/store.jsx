import {configureStore} from "@reduxjs/toolkit"
import userSlice from "../store/reducers/userSlice"
import chatSlice from '../store/reducers/chatSlice'
import messageSlice from "../store/reducers/messageSlice"

export const store = configureStore({
    reducer:{
        userReducer : userSlice,
        chatReducer : chatSlice,
        messageReducer : messageSlice,
    }
})