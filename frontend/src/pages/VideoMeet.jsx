import React, { useEffect, useRef, useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import io from "socket.io-client";
import { Call, Description, Mic, StopScreenShare, VideocamOff } from "@mui/icons-material";
import { fontWeight, height } from "@mui/system";
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import styles from "../styles/videoComponent.module.css"
import { Badge, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from "react-router-dom";

const server_url = "http://localhost:8000/";

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        {
            "urls": "stun:stun.l.google.com:19302"
        }
    ]
}

export default function VideoMeetComponent() {

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoRef = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState([]);

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setShowModal] = useState(false);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([]);

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(0);

    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("")

    const routeTo = useNavigate();

    const videoRef = useRef([]);


    let [videos, setVideos] = useState([]);


    useEffect(() => {
        getPermissions();
    }, [])

    let getDisplayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDisplayMediaSucess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }
    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });

            if (videoPermission) {
                setVideoAvailable(true);
            } else {
                setVideoAvailable(false);
            }
            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });

            if (audioPermission) {
                setAudioAvailable(true);
            } else {
                setAudioAvailable(false);
            }


            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });

                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = userMediaStream;
                    }
                }
            }


        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    })

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);

        connectToSocketServer();
    }

    let getUserMediaSucess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) {
            console.log(e);
        }

        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log(description);
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }
        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);
            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop())
            } catch (e) {
                console.log(e);
            }
            //TODO BlackSilence

            let blackSlience = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSlience();
            localVideoRef.current.srcObject = window.localStream;

            for (let id in connections) {
                connections[id].addStream(window.localStream)
                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ "sdp": connections[id].localDescription }))
                        }).catch(e => console.log(e));
                })
            }
        })
    }


    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSucess) //TODO: getUserMediaSucess
                .then((stream) => { })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop())
            } catch (e) {

            }
        }
    }

    let getDisplayMediaSucess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) {
            console.log(e)
        }
        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            connections[id].addStream(window.localStream)
            connections[id].createOffer().then((description) => [
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit("signal", id, JSON.stringify({ sdp: connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            ])
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false);

            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop())
            } catch (e) {
                console.log(e);
            }
            //TODO BlackSilence

            let blackSlience = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSlience();
            localVideoRef.current.srcObject = window.localStream;

            getUserMedia();

        })
    }

    //TODO
    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === "offer") {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ "sdp": connections[fromId].localDescription }))
                            }).catch(e => console.log(e));
                        }).catch(e => console.log(e));
                    }
                }).catch(e => console.log(e));
            }
            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
            }
        }
    }

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {

            socketRef.current.emit('join-call', window.location.href)

            socketIdRef.current = socketRef.current.id;

            socketRef.current.on('chat-message', addMessage);

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    if (socketListId === socketIdRef.current) return;
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

                    connections[socketListId].onicecandidate = (event) => {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }
                    connections[socketListId].onaddstream = (event) => {
                        let videoExists = videoRef.current.find(video => video.socketId === socketListId)
                        if (videoExists) {
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            })
                        } else {
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true

                            }

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }


                    };
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream);
                    } else {
                        //TODO BLACKSLIENCE
                        // let blackSlience

                        let blackSlience = (...args) => new MediaStream([black(...args), silence()]);
                        window.localStream = blackSlience();
                        connections[socketListId].addStream(window.localStream);
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue
                        try {
                            connections[id2].addStream(window.localStream);
                        } catch (err) {

                        }
                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }


    let silence = () => {
        let ctx = new AudioContext();
        let oscillator = ctx.createOscillator();

        let dst = oscillator.connect(ctx.createMediaStreamDestination());

        oscillator.start();
        ctx.resume();
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }

    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height });

        canvas.getContext('2d').fillRect(0, 0, width, height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        setVideo(!video);
    }
    let handleAudio = () => {
        setAudio(!audio);
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDisplayMedia();
        }
    }, [screen])

    let handleScreen = () => {
        setScreen(!screen);
    }

    //Todo add messgage
    let addMessage = (data, sender, socketIdSender,) => {

        setMessages((prevMessages) => [
            ...prevMessages, {
                sender: sender, data: data, socketIdSender: socketIdSender,
            }
        ]);

        if (socketIdSender !== socketIdRef.current) {

            console.log(showModal)
            if (!showModal) {
                setNewMessages((prevMessages) => prevMessages + 1);
            }
        }
    }







    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }

    let handleShowModal = () => {
        setShowModal(!showModal);
        setNewMessages(0);
    }


    let sendMessage = () => {
        socketRef.current.emit("chat-message", message, username, socketIdRef);
        setMessage("");
    }


    let handleEndCall = () => {
        try {
            let tracks = localVideoRef.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) {

        }
        routeTo("/home");
    }




    return (
        <div>
            {askForUsername === true ?
                <div>
                    <h2>Enter into Lobby</h2>
                    <form >
                        <TextField id="outlined-basic" label="Username" required value={username} onChange={e => setUsername(e.target.value)} variant="outlined" />
                        <Button variant="contained" onClick={username.length > 0 ? connect : () => { }}>Connect</Button>
                    </form>

                    <div>
                        <video ref={localVideoRef} autoPlay muted></video>
                    </div>
                </div> :

                <div className={styles.meetVideoContainer}>
                    {showModal ? <div className={styles.chatRoom}>
                        <h1>Chat</h1>
                        <div className={styles.chatContainer}>

                            <div className="chattingDisplay" >
                                {messages.length > 0 ? messages.map((item, index) => {
                                    return (
                                        <div key={index} style={{ marginBottom: "13px", textAlign: item.socketIdSender === socketIdRef.current ? "right" : "left", backgroundColor: item.socketIdSender === socketIdRef.current ? "lightgrey" : "transparent", padding: "5px 10px 5px 10px", borderRadius: "10px", border: "1px solid black", boxShadow: "2px 3px 2px #888888" }}>

                                            <p style={{ textDecoration: "underline", fontWeight: "bold", fontSize: "0.9rem", fontStyle: "italic" }}>{item.socketIdSender === socketIdRef.current ? <>Me</> : item.sender}</p>
                                            <p >{item.data}</p>

                                        </div>

                                    )

                                }) : <>No messages yet</>}
                            </div>


                        </div>
                        <div className={styles.chattingArea}>


                            <TextField className="messageField" id="outlined-basic" label="Type Here" variant="outlined" value={message} onChange={e => setMessage(e.target.value)} />
                            <Button varient="contained" onClick={message.length > 0 ? sendMessage : () => { }}> <SendIcon /></Button>
                        </div>
                    </div> : <></>}

                    <video className={styles.meetUserVideo}
                        ref={localVideoRef} autoPlay muted></video>

                    <div className={styles.confrenceView}>
                        {videos.map((video) => (
                            <div key={video.socketId}  >
                                <video data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                ></video>
                            </div>

                        ))}
                    </div>
                    <div className={styles.btnContainers}>
                        <IconButton style={{ color: "white" }} onClick={handleVideo}>
                            {(video === true ? <VideocamIcon /> : <VideocamOffIcon />)}
                        </IconButton>

                        <IconButton style={{ color: "white" }} onClick={handleAudio}>
                            {(audio === true) ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>
                        <IconButton style={{ color: "red" }} onClick={handleEndCall}>
                            <CallEndIcon />
                        </IconButton >

                        <IconButton style={{ color: "white" }} onClick={handleScreen}>
                            {(screen === true) ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                        </IconButton>
                        <Badge badgeContent={newMessages}>
                            <IconButton style={{ color: "white" }} onClick={handleShowModal}>
                                <ChatIcon />
                            </IconButton>
                        </Badge>
                    </div>
                </div>

            } </div>
    )


}