import React, { useContext, useState } from 'react'
import Box from '@mui/system/Box';
import Grid from "@mui/material/Grid"
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Avatar, Button, CssBaseline, Paper, Snackbar, TextField, Typography } from '@mui/material';
import { light } from '@mui/material/styles/createPalette';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthContext } from '../context/AuthContext';




const defaultTheme = createTheme();


export default function Authentication() {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState();
    const [message, setMessage] = useState();

    const [formState, SetFormState] = useState(0);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState();
    const { handleRegister, handleLogin } = useContext(AuthContext);

    let handleAuth = async () => {
        try {
            if (formState === 0) {

                let result = await handleLogin(username, password);


                setMessage(result);
                setUsername("");
                setPassword("");
            }
            if (formState === 1) {
                let result = await handleRegister(name, username, password);
                console.log(result);
                setMessage(result);
                setOpen(true);
                setError("");
                SetFormState(0);
                setPassword("");
                setName("");
                setUsername("");


            }
        } catch (err) {
            console.log(err);

            let message = (err.response.data.message)
            setError(message);
        }
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component='main' sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: "url(https://img.freepik.com/free-vector/login-concept-illustration_114360-739.jpg?t=st=1736417172~exp=1736420772~hmac=b7030159da5dd0a5782711abbb3b21089430a396dddd1dfc634aa5931d43b947&w=740)",
                        backgroundRepeate: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === light ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',


                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <div>
                            <Button variant={formState === 0 ? "contained" : ""} onClick={() => { SetFormState(0) }}>
                                Sign In
                            </Button>
                            <Button variant={formState === 1 ? "contained" : ""} onClick={() => { SetFormState(1) }}>
                                Sign Up
                            </Button>
                        </div>

                        <Box component='form' noValidate sx={{ mt: 1 }}>
                            {formState === 1 ? <TextField
                                margin='normal'
                                required
                                fullWidth
                                id="name"
                                label="Full Name"
                                name='name'
                                autoFocus
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            /> : <></>}

                            <TextField
                                margin='normal'
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name='username'
                                autoFocus
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}

                            />
                            <TextField
                                margin='normal'
                                required
                                fullWidth
                                id="password"
                                label="Password"
                                name='password'
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <p style={{ color: "red" }}>{error}</p>

                            <Button
                                type='button'
                                fullWidth
                                variant='contained'
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleAuth}
                            >
                                {formState === 0 ? "Sign In" : "Sign UP"}
                            </Button>

                        </Box>
                    </Box>

                </Grid>


            </Grid>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                message={message} />

        </ThemeProvider>


    )
}
