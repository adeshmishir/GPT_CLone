import React, { createContext, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

// Initial state
const initialState = {
  chats: [],          // { id, title, messages[] }
  currentChatId: null,
  searchQuery: "",
};

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case "CREATE_CHAT": {
      const id = action.payload.id || uuidv4();
      const newChat = {
        id,
        title: action.payload.title || "New Chat",
        messages: [],
        createdAt: Date.now(),
      };
      return {
        ...state,
        chats: [newChat, ...state.chats],
        currentChatId: id,
      };
    }

    case "SEND_MESSAGE": {
      const { chatId, text, role = "user" } = action.payload;
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    id: uuidv4(),
                    role,
                    text,
                    createdAt: Date.now(),
                  },
                ],
              }
            : chat
        ),
      };
    }

    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };

    case "SET_CURRENT":
      return { ...state, currentChatId: action.payload };

    default:
      return state;
  }
}

// Context
export const ChatContext = createContext();

// Provider
export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}
