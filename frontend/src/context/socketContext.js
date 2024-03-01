import { createContext, useContext } from "react";




const SocketContext = createContext({
  socket : null
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = SocketContext.Provider;
