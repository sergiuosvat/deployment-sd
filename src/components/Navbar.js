import Toolbar from "@mui/material/Toolbar";
import {Button, IconButton} from "@mui/material";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import React from "react";
import history from "../utils/history";

class Navbar extends React.Component {
    handleLogout = () => {
        sessionStorage.clear();
        localStorage.clear();
        history.push("/home");
        window.location.reload();
    };
    render() {
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton sx={{mr: 2}} color="inherit">
                            <EnergySavingsLeafIcon fontSize="large"/>
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            Energy Management System
                        </Typography>
                        <Button color="inherit" onClick={this.handleLogout}>
                            Log Out
                        </Button>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default Navbar;