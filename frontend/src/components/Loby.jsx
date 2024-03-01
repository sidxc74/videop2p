import React, { useState } from 'react'
import { useSocket } from '../context/socketContext';
import {useNavigate} from 'react-router-dom'

function Loby() {

    const [roomid,setroomid] = useState("");
    const [name, setname] = useState("");
    const socket = useSocket();
    const navigate = useNavigate();

    const handleCreateRoom = () => {
        socket.emit('create-room',{name,roomid})
        navigate(`/room/${roomid}`);

        

    }

    const handleJoinRoom = () => {
        socket.emit('join-room',{name,roomid})
        navigate(`/room/${roomid}`);
    }


  return (
    <div>
        <input value={name} onChange={(e)=> setname(e.target.value)} />
        <input value={roomid} onChange={(e) => setroomid(e.target.value)} />
        <button onClick={handleCreateRoom}>Create Room</button>
        <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  )
}

export default Loby