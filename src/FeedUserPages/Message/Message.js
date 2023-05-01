import React, { useEffect, useState } from 'react';
import "../Message/message.css"
import { useSelector } from 'react-redux';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useRef } from 'react';

function GroupChatPage(CurrentChat) {
  const userDetails = useSelector((state) => state.user);
  const accesstoken = userDetails.currentUser.accessToken;
  const id = userDetails?.currentUser?.others?._id;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
  const [imagePreview, setImagePreview] = useState(null);

  let selectedChatCompare;
  const user = userDetails?.currentUser?.others

  const socket = useRef();


  const fetchMessages = async()=>{
    if(!CurrentChat) return;
    try {
      const config = {
        headers: {
          token: `${accesstoken}`,
        },
      };
      const { data } = await axios.get(`https://api.aavelance.com/api/message/get/all/group/msg/${CurrentChat?.CurrentChat?._id}`, config);
      setMessages(data);
      socket.current.emit("join chat" , CurrentChat?.CurrentChat?._id);
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    if(CurrentChat !== ''){
      socket.current = io("https://api.aavelance.com");
      socket.current.emit("setup" , user);

    }
   },[id]);

   
   const handleInputChange = (event) => {
     setMessage(event.target.value);
    };
    
    const handleSendClick = async () => {
      if (message) {
        setMessages([...messages, { content: message,image:imagePreview, sender: { profile: `${userDetails?.currentUser?.others?.profile}`, username: `${userDetails?.currentUser?.others?.username}` } }]);
      try {
        await fetch(
          `https://api.aavelance.com/api/message/send/msg`, {
            method: 'POST',
          headers: { 'Content-Type': 'application/json', token: accesstoken },
          body: JSON.stringify({
            sender: userDetails?.currentUser?.others?._id,
            content: message,
            image: imagePreview,
            chatId: CurrentChat?.CurrentChat?._id
          })
        })
        .then(response => {
          response.json()
          .then(data => {
                socket.current.emit("new message" , data);
                setMessages([...messages , data])
              });
            })
      }
      catch (error) {
        console.error(error);
      }
      setMessage('');
    }
  };
  
  const handleAddClick = () => {
    
  };
  
  const handleRemoveClick = () => {
    
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImagePreview(reader.result);
      };
    }
  };

  
  useEffect(()=>{
    fetchMessages();
    selectedChatCompare = CurrentChat?.CurrentChat;
  },[CurrentChat?.CurrentChat?._id])
  

  useEffect(() => {
    socket.current.on("Message received", (newMessageRecieved) => {
     if(CurrentChat.CurrentChat._id == newMessageRecieved.group._id){
       setMessages([...messages, newMessageRecieved]);
     }
    });
  });


  const renderMessageContent = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    return parts.map((part, i) =>
      urlRegex.test(part) ? (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };


  return (
    <div className="group-chat-page">
      <div className="group-name">
        {CurrentChat?.CurrentChat?.Chatname}
        <div className="group-buttons">
          <button className="group-add-button" onClick={handleAddClick}>
            Add
          </button>
          <button className="group-remove-button" onClick={handleRemoveClick}>
            Remove
          </button>
        </div>
      </div>
      <div className="message-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg?.sender?.username === `${userDetails?.currentUser?.others?.username}` ? "sent" : "received"}`}>
            <div className="sender">
              <div>
                <div style={{ display:"inline-flex", alignItems: "center" }}>
                  
                  <div className='messageContainerInmessagePage' >
                    <img src={msg?.sender?.profile} className="profileimagee" alt="" />
                    <div>
                      <p style={{ marginLeft: "7px" , marginTop:"6px" }}>{msg?.sender?.username}</p>
                      <p className='messageText' >
                       {renderMessageContent(msg?.content)}
                    </p>
                      {msg.image !== "" ? 
                      <img src={msg?.image} style={{width:"100%" , borderRadius:"10px"}} alt="" /> : ""
                      }
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="input-field">
      <label htmlFor="image-input" className="image-icon">
        <svg
          xmlns="https://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-image"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <path d="M21 15l-5-5L5 21"></path>
        </svg>
      </label>
      <input
        id="image-input"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageSelect}
      />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Selected image preview"
          style={{ maxHeight: "60px", maxWidth: "70%" , padding:"2px" }}
        />
      )}
      <textarea
        value={message}
        onChange={handleInputChange}
        placeholder="Type a message..."
        className="input-box"
        style={{
          resize: "none",
          height: "auto",
          width: "100%",
          overflow: "hidden",
          border: "none",
          padding: "3px",
          backgroundColor: "black",
          borderRadius: "10px",
          color: "white",
          boxShadow: "none",
        }}
      />

      <button onClick={handleSendClick} className="send-button">
        <svg
          xmlns="https://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-send"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
    </div>

  );
}

export default GroupChatPage;
