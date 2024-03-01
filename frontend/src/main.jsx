import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SocketProvider } from './context/socketContext.js'
import io from 'socket.io-client';

const socket = io('http://localhost:5000');


ReactDOM.createRoot(document.getElementById('root')).render(
  
    <SocketProvider value={socket}>
    <App />
    </SocketProvider>
 
)
