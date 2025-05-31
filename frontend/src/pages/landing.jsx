import React from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'
import LoginIcon from '@mui/icons-material/Login';
import { Button } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export default function LandingPage() {
    return (
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'>
                    <h2>Connectify</h2>
                </div>
                <div className='navlist'>
                    <Button style={{ color: "white" }} onClick={() => { window.location.href = '/akkhhe4' }}>
                        <AccountCircleIcon />Join as Guest
                    </Button>
                    <Button style={{ color: "white" }} onClick={() => { window.location.href = '/auth' }}>
                        <HowToRegIcon />Register
                    </Button>
                    <Button style={{ color: "white" }} onClick={() => { window.location.href = '/auth' }}>
                        <LoginIcon />Login
                    </Button>
                </div>
            </nav>
            <div className="landingMainContainer">
                <div>
                    <h1><span style={{ color: "#FF9839" }}>Connect</span> with your loved Ones</h1>
                    <p>
                        Bridging Distances, Connecting Lives
                    </p>
                    <div role='button'>
                        <Link to={"/home"}>Get started</Link>
                    </div>
                </div>

                <div>
                    <img src="/mobile.png" alt="" />
                </div>
            </div>
        </div>
    )
}
