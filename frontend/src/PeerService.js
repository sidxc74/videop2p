class peerservice {
    static iceConfiguration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            
        ],
    };

    constructor() {
        this.peer = new RTCPeerConnection(peerservice.iceConfiguration);
    }
}

export default new peerservice();
