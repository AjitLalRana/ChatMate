import React, { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "remixicon/fonts/remixicon.css";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import {asyncLoadMessages} from "../store/actions/messageAction";

import { pushmessage } from "../store/reducers/messageSlice";
import { asyncAddNewChat } from "../store/actions/chatAction";
import { io } from "socket.io-client";

const Dashboard = () => {
  const { reset, register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000", {
      withCredentials: true,
    });

    return () => {
      socketRef.current.disconnect(); // cleanup on unmount
    };
  }, []);

  // ✅ Correct way: directly use selectors
  const currentChatMessages = useSelector(
    (state) => state.messageReducer.messages
  );
  

  const currentUser = useSelector((state) => state?.userReducer?.user);
  const chats = useSelector((state) => state.chatReducer.chats);

  // ✅ Track active chat
  const [activeChat, setActiveChat] = useState(null);

  // Load messages whenever activeChat changes
  useEffect(() => {
    if (activeChat) {
      dispatch(asyncLoadMessages(activeChat._id));
    }
  }, [activeChat, dispatch]);


  useEffect(() => {
    socketRef.current.on("ai-response", (response) => {
      const aiResponse = {
          userId: currentUser?._id,
          chatId: activeChat?._id,
          content: response?.content,
          role: "model",
        }
      dispatch(pushmessage(aiResponse));
    });

    return () => {
      socketRef.current.off("ai-response"); // cleanup listener
    };
  }, [dispatch, activeChat, currentUser]);

  const inputHandler = async (data) => {
    const { prompt } = data;

    if (formRef.current) {
      const textarea = formRef.current.querySelector("textarea");
      if (textarea) {
        textarea.style.height = "auto"; // reset height
      }
    }

    // TODO: socket.io API call with `prompt`
    const userMessage = {
        userId: currentUser?._id,
        chatId: activeChat?._id,
        content: prompt,
        role: "user",
      }
    dispatch(pushmessage(userMessage));

    await socketRef.current.emit("ai-message", {
      chatId: activeChat?._id,
      content: prompt,
    });
    reset();
  };




  const newChatHandler = async (e) => {
    const newChat = prompt("Enter chat title : ");
    if (!newChat) return;
    const createdChat = await dispatch(asyncAddNewChat({ title: newChat }));
    if (createdChat?._id) {
      setActiveChat(createdChat);
    }
  };

  const handleActiveChat = (chat) => {
    //change bg color
    setActiveChat(chat);
  };

  return (
    <div className="w-full h-screen bg-zinc-900 text-white p-0 flex items-center">
      {/* Sidebar */}
      <div className="sideBar  w-[20rem] h-screen bg-[#181818] flex flex-col items-center">
        <div className="w-full flex flex-col items-center sticky">
          <div className="w-full h-[3rem] px-2 flex items-center justify-between">
            <i className="ri-ancient-pavilion-line text-xl"></i>
            <i className="ri-menu-2-line text-xl hidden cursor-pointer"></i>
            <i className="ri-arrow-left-s-fill text-2xl cursor-pointer"></i>
          </div>
          <div
            onClick={newChatHandler}
            className="newChat w-[90%] h-10 mt-5 text-black bg-blue-400 rounded flex items-center justify-center cursor-pointer hover:bg-blue-500"
          >
            + New Chat
          </div>
        </div>

        {/* ✅ Render chat list dynamically */}
        <div className="chats mt-5 mb-5 w-[90%] h-[80vh] overflow-y-auto  bg-[#212121] rounded">
          <ul className="mt-4 space-y-2 px-2">
            {(chats || []).map((chat, index) => (
              <li
                key={index}
                onClick={() => handleActiveChat(chat)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition  ${
                  activeChat?._id === chat?._id
                    ? "bg-[#181818]"
                    : "hover:bg-zinc-800"
                } `}
              >
                <i className="ri-chat-3-line"></i>
                <span>{chat?.title || "Untitled Chat"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right bar */}
      <div className="right-bar w-full h-screen bg-[#212121] px-5 pb-5 flex flex-col items-center justify-between gap-2">
        {/* Navbar */}
        <div className="nav sticky  w-full h-[3rem] flex items-center gap-10">
          <i className="ri-menu-2-line text-xl cursor-pointer hidden"></i>
          <div className="w-full h-full flex items-center justify-center">
            <h1 className=" font-bold rounded bg-[#181818] py-2 px-10">{activeChat?.title || ""}</h1>
          </div>
        </div>

        {/* Chat messages */}
        <div className="main-chat-area overflow-y-auto w-full rounded h-full flex flex-col gap-4">
          {currentChatMessages.map((msg, index) =>
            msg.role === "user" ? (
              <div key={index} className="user-prompt flex gap-3">
                <i className="ri-user-2-fill text-2xl mb-3 p-2"></i>
                <div className="input-area  max-w-[70%] mt-5 pl-5 p-3 font-semibold rounded-3xl rounded-tl-none bg-neutral-300 text-black ">
                  {msg.content}
                </div>
              </div>
            ) : (
              <div key={index} className="ai-response flex justify-end gap-3">
                <div className=" max-w-[70%]  mt-5 pl-5 p-3 text-[1.2rem]  rounded-3xl rounded-tr-none bg-[#303030] text-gray-200">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                <i className="ri-robot-3-fill mb-3 p-2 text-2xl"></i>
              </div>
            )
          )}
        </div>

        {/* Input box */}
        <div className="input-box w-[90%] min-h-[50px] bg-[#303030] mb-5 px-5 py-3 rounded-3xl flex items-end justify-between sticky">
          <i className="ri-add-line text-2xl"></i>
          <form
            ref={formRef}
            onSubmit={handleSubmit(inputHandler)}
            className="w-[100%] flex items-end justify-center  px-5"
          >
            <textarea
              {...register("prompt", { required: true })}
              placeholder="Ask me..."
              rows={1}
              className="w-full text-[1em] flex-1 resize-none outline-none p-2 bg-transparent"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`; // auto-grow
              }}
            />
            <button type="submit" className="cursor-pointer ">
              <i className="ri-send-plane-line text-2xl hover:text-blue-300 "></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
