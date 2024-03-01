import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SocketProvider } from './context/socketContext.js'
import io from 'socket.io-client';

const socket = io('https://videop2p.onrender.com');


ReactDOM.createRoot(document.getElementById('root')).render(
  
    <SocketProvider value={socket}>
    <App />
    </SocketProvider>
 
)
