import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    chats :[]
}

const chatSlice = createSlice({
    name: "chats",
    initialState,
    reducers : {
        loadchats : (state,action)=>{
            state.chats = action.payload;
        },
        addchat :(state,action) =>{
            state.chats.unshift(action.payload);
        },
        logoutchats : (state,action)=>{
            state.chats = []
        }

    }
})

export default chatSlice.reducer;
export const {loadchats,addchat,logoutchats} = chatSlice.actions;