import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ContextProvider = ({ children }) => {
  const [notification, setNotification] = useState([]);

  return (
    <ChatContext.Provider
      value={{
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ContextProvider;