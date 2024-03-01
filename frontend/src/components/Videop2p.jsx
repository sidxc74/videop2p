import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import peerconnection from '../PeerService';
import { useSocket } from '../context/socketContext';

function Videop2p() {
  const [remoteid, setRemoteId] = useState();
  const [connected, setConnected] = useState(false);
  const remoteVideoRef = useRef();
  const myVideoRef = useRef();
  const socket = useSocket();

  const handleICECandidate = async (event) => {
    if (event.candidate) {
      console.log("handling ice candidate in frontend")
      socket.emit('ice-candidate', { to: remoteid, candidate: event.candidate });
    }
  };

  const handleCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach((track) => peerconnection.peer.addTrack(track, stream));

      const offer = await peerconnection.peer.createOffer();
      peerconnection.peer.setLocalDescription(offer);

      socket.emit('call', { to: remoteid, offer });
      console.log('handling call');
    } catch (error) {
      console.error('Error handling call:', error);
    }
  };

  useEffect(() => {
    let stream;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((s) => {
        myVideoRef.current.srcObject = s;
        stream = s;
      })
      .catch((error) => console.error('Error accessing media devices:', error));

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  });

  useEffect(() => {
    const handleIncomingCall = async ({ from, offer }) => {
      setRemoteId(from);
      console.log('incoming call');

      

      try {
        await peerconnection.peer.setRemoteDescription(offer);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach((track) => peerconnection.peer.addTrack(track, stream));
        const answer = await peerconnection.peer.createAnswer();
        await peerconnection.peer.setLocalDescription(answer);

        socket.emit('call-accepted', { to: from, answer });
      } catch (error) {
        console.error('Error handling incoming call:', error);
      }
    };

    socket.on('user-joined', ({ from, name }) => {
      setRemoteId(from);
      console.log("handling user-joined in frontend")
      console.log(from);
    });

    socket.on('incomming-call', handleIncomingCall);

    socket.on('answer', async ({ from, sdp }) => {
      try {
        console.log("handling answer in frontend")
        peerconnection.peer.setRemoteDescription(sdp);
        
      } catch (error) {
        console.error('Error handling answer in fro:', error);
      }
    });

    socket.on('ice-candidate', ({ from, candidate }) => {
      try {

        if(peerconnection.peer.remoteDescription){

        peerconnection.peer.addIceCandidate(candidate);
        console.log("handling ice candidate from backend in frontend")
        setConnected(true);
        }
      } catch (error) {
        console.error('Error handling ice-candidate:', error);
      }
    });

    peerconnection.peer.onicecandidate = handleICECandidate;

    peerconnection.peer.ontrack = (event) => {
      console.log("track agya")
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerconnection.peer.onconnectionstatechange = (event) => {
      if (peerconnection.peer.connectionState === 'connected') {
        console.log('connection established');
      }
    };
  },[peerconnection.peer]);

  return (
    <div>
      Your video
      <video ref={myVideoRef} playsInline autoPlay />
      {remoteid ? (
        <>
          <video ref={remoteVideoRef} playsInline autoPlay />
          <button onClick={handleCall}>Call</button>
        </>
      ) : (
        <p>No one in this room</p>
      )}
    </div>
  );
}

export default Videop2p;
