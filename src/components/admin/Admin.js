import React from 'react';
import {Button, Container, Grid} from '@mui/material';
import Typography from "@mui/material/Typography";
import history from "../../utils/history";
import Navbar from "../Navbar";

class Admin extends React.Component {

    handleClients = () => {
        history.push("/user");
        window.location.reload();
    };

    handleDevices = () => {
        history.push("/devices");
        window.location.reload();
    };

    handleChats = () => {
        history.push("/chat-admin");
        window.location.reload();
    }

    render() {
        return (
            <div>
                <Navbar/>
                <Container maxWidth="lg" sx={{mt: 6}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h4" align="center">
                                Welcome to the Energy Management System, Admin!
                            </Typography>
                            <Typography variant="body1" align="center" sx={{mt: 2}}>
                                Monitor and manage energy usage efficiently. Choose a category:
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mt: 4
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{width: '50%', mb: 2}}
                            onClick={this.handleClients}
                        >
                            Clients
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{width: '50%', mb:2}}
                            onClick={this.handleDevices}
                        >
                            Devices
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{width: '50%'}}
                            onClick={this.handleChats}
                        >
                            See chats
                        </Button>
                    </Grid>
                </Container>
            </div>
        );
    }
}

export default Admin;