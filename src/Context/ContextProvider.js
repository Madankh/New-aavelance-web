import React, { createContext, useContext, useState } from "react";


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