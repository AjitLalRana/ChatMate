import React, { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "remixicon/fonts/remixicon.css";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { asyncLoadMessages } from "../store/actions/messageAction";
import { pushmessage } from "../store/reducers/messageSlice";
import { asyncAddNewChat } from "../store/actions/chatAction";
import { io } from "socket.io-client";

const Dashboard = () => {
  const [socket, setsocket] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); //  new state
  const [activeChat, setActiveChat] = useState(null);

  const { reset, register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const tempSocket = io("https://chatmate-dy3z.onrender.com", { withCredentials: true });
    setsocket(tempSocket);
    return () => tempSocket.disconnect();
  }, []);

  const currentChatMessages = useSelector(
    (state) => state.messageReducer.messages
  );
  const currentUser = useSelector((state) => state?.userReducer?.user);
  const chats = useSelector((state) => state.chatReducer.chats);

  useEffect(() => {
    if (activeChat) {
      dispatch(asyncLoadMessages(activeChat._id));
    }
  }, [activeChat, dispatch]);

  useEffect(() => {
    if (!socket) return;
    socket.on("ai-response", (response) => {
      const aiResponse = {
        userId: currentUser?._id,
        chatId: activeChat?._id,
        content: response?.content,
        role: "model",
      };
      dispatch(pushmessage(aiResponse));
    });
    return () => socket.off("ai-response");
  }, [dispatch, activeChat, currentUser]);

  {
    /* scrollIntoView() */
  }
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChatMessages]);

  const inputHandler = async (data) => {
    if (!activeChat) return alert("Please select a chat first!");
    const { prompt } = data;
    if (formRef.current) {
      const textarea = formRef.current.querySelector("textarea");
      if (textarea) textarea.style.height = "auto";
    }
    const userMessage = {
      userId: currentUser?._id,
      chatId: activeChat?._id,
      content: prompt,
      role: "user",
    };
    dispatch(pushmessage(userMessage));
    await socket.emit("ai-message", {
      chatId: activeChat?._id,
      content: prompt,
    });
    reset();
  };

  const newChatHandler = async () => {
    const newChat = prompt("Enter chat title : ");
    if (!newChat) return;
    const createdChat = await dispatch(asyncAddNewChat({ title: newChat }));
    if (createdChat?._id) setActiveChat(createdChat);
  };

  const handleActiveChat = (chat) => setActiveChat(chat);

  return (
    <div className="w-full h-screen bg-zinc-900 text-white flex">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-50 h-screen w-[18rem] bg-[#181818] flex flex-col items-center transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        <div className="w-full flex flex-col items-center sticky">
          <div className="w-full h-[3rem] px-2 flex items-center justify-between">
            <h1 className="font-bold text-2xl px-5">ChatMate</h1>
            {/* Close button (only mobile) */}
            <i
              className="ri-close-line text-2xl cursor-pointer md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            ></i>
          </div>
          <div
            onClick={newChatHandler}
            className="newChat w-[90%] h-10 mt-5 text-black bg-blue-400 rounded flex items-center justify-center cursor-pointer hover:bg-blue-500"
          >
            + New Chat
          </div>
        </div>

        <div className="chats mt-5 mb-5 w-[90%] h-[80vh] overflow-y-auto bg-[#212121] rounded">
          <ul className="mt-4 space-y-2 px-2">
            {(chats || []).map((chat, index) => (
              <li
                key={index}
                onClick={() => {
                  handleActiveChat(chat);
                  setIsSidebarOpen(false); //  auto close on mobile
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
                  activeChat?._id === chat?._id
                    ? "bg-[#181818]"
                    : "hover:bg-zinc-800"
                }`}
              >
                <i className="ri-chat-3-line"></i>
                <span>{chat?.title || "Untitled Chat"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right bar */}
      <div className="right-bar flex-1 h-screen bg-[#212121] px-5 pb-5 flex flex-col gap-2">
        {/* Navbar */}
        <div className="nav sticky w-full h-[3rem] flex items-center gap-10">
          {/* Hamburger button */}
          <i
            className="ri-menu-2-line text-2xl cursor-pointer md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          ></i>

          <div className="w-full flex items-center justify-center py-2">
            <h1 className="h-10 font-bold text-md rounded bg-[#181818] py-2 px-10">
              {activeChat?.title || "ChatMate"}
            </h1>
          </div>
        </div>

        {/* Chat messages */}
        <div className="main-chat-area overflow-y-auto w-full rounded flex-1 flex flex-col gap-4">
          {activeChat === null ? (
            <div className="flex flex-col items-center justify-center flex-1">
              <i className="ri-robot-line text-[8rem] text-gray-600"></i>
              <h1 className="text-lg md:text-3xl font-bold text-gray-600">
                {" "}
                Select a chat to start messaging{" "}
              </h1>
            </div>
          ) : (
            currentChatMessages.map((msg, index) =>
              msg.role === "user" ? (
                <div key={index} className="user-prompt flex gap-3">
                  <i className="ri-user-2-fill text-2xl mb-3 p-2"></i>
                  <div className="input-area max-w-[70%] text-sm  md:text-[1.2rem] mt-5 pl-5 p-3 font-semibold rounded-3xl rounded-tl-none bg-neutral-300 text-black">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div key={index} className="ai-response flex justify-end gap-3">
                  <div className="max-w-[70%] mt-5 pl-5 p-3 text-sm  md:text-[1.2rem] rounded-3xl rounded-tr-none bg-[#303030] text-gray-200">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  <i className="ri-robot-3-fill mb-3 p-2 text-2xl"></i>
                </div>
              )
            )
          )}

          <div ref={messagesEndRef}></div>
        </div>

        {/* Input box */}
        <div className="input-box w-full md:w-[90%] min-h-[50px] bg-[#303030] mb-5 px-5 py-3 rounded-3xl flex items-end justify-between">
          <div className="flex items-center justify-center">
            <i className="ri-add-line text-2xl"></i>
          </div>
          <form
            ref={formRef}
            onSubmit={handleSubmit(inputHandler)}
            className="w-full flex items-end justify-center px-5"
          >
            <textarea
              {...register("prompt", { required: true })}
              placeholder={
                activeChat ? "Ask me..." : "Select a chat to start messaging"
              }
              rows={1}
              disabled={!activeChat}
              className="w-full text-[1em] resize-none outline-none p-2 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // prevent newline
                  handleSubmit(inputHandler)(); // trigger submit
                }
              }}
            />

            <button
              type="submit"
              disabled={!activeChat} // disable send button
              className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="ri-send-plane-line text-2xl hover:text-blue-300"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
