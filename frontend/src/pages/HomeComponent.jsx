import React, { useState } from 'react'
import withAuth from '../utils/WithAuth'
import { useNavigate } from 'react-router-dom'
import { Button, IconButton } from '@mui/material';
import "../App.css"
import HistoryIcon from '@mui/icons-material/History';
import TextField from '@mui/material/TextField';
import LogoutIcon from '@mui/icons-material/Logout';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function HomeComponent() {

    let navigate = useNavigate()

    const [meetingCode, setMeetingCode] = useState("");
    const { addToUserHistory } = useContext(AuthContext)
    let handleJoinVideoCall = async () => {
        await addToUserHistory(meetingCode);
        navigate(`${meetingCode}`)
    }

    return (
        <>
            <div className="navBar">
                <div style={{ display: "flex", alignItems: "center" }}>
                    <h2>Connetify Video Call</h2>
                </div>


                <div style={{ display: "flex", alignItems: 'center' }}>

                    <Button onClick={() => {
                        navigate("/history")
                    }}>  <HistoryIcon />History</Button>
                    <Button onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/auth")
                    }} ><LogoutIcon />
                        Logout
                    </Button>
                </div>
            </div>
            <div className="meetContainer">
                <div className="leftPanel">
                    <div>
                        <h2>High Quality video Call Providing</h2>
                        <div style={{ display: "flex", gap: "10px", }}>
                            <TextField onChange={e => setMeetingCode(e.target.value)} id='outlined-basic' label='Enter Meeting Code' variant='outlined'></TextField>
                            <Button variant="contained" onClick={handleJoinVideoCall}>Join Call</Button>
                        </div>
                    </div>

                </div>
                <div className="rightPanel">
                    <img srcSet="/logo03.png" alt="" />
                </div>
            </div>
        </>
    )
}

export default withAuth(HomeComponent);