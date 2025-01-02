import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IconButton, Container, Grid } from "@mui/material";
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import Login from '../login-register/Login';
import Register from '../login-register/Register';
import homeImage from '../images/20945615.jpg';

const Home = () => {
    const [formType, setFormType] = useState("home");

    const handleLogIn = () => {
        setFormType("login");
    };

    const handleRegister = () => {
        setFormType("register");
    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton sx={{ mr: 2 }} color="inherit">
                        <EnergySavingsLeafIcon fontSize="large" />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Energy Management System
                    </Typography>
                    <Button color="inherit" onClick={handleLogIn}>Login</Button>
                    <Button color="inherit" onClick={handleRegister}>Register</Button>
                </Toolbar>
            </AppBar>

            {formType === "login" ? (
                <Container maxWidth="sm" sx={{ mt: 4 }}>
                    <Login onRegisterClick={handleRegister} />
                </Container>
            ) : formType === "register" ? (
                <Container maxWidth="sm" sx={{ mt: 4 }}>
                    <Register />
                </Container>
            ) : (
                <Container maxWidth="lg" sx={{ mt: 6 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h4" align="center">
                                Welcome to the Energy Management System
                            </Typography>
                            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                                Monitor and manage energy usage efficiently.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                            <img
                                src={homeImage}
                                alt="Energy Management"
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            )}
        </div>
    );
};

export default Home;
