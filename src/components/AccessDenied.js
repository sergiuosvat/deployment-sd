import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function AccessDenied () {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h2" component="h2">
                Access Denied
            </Typography>
            <Typography variant="body1">
                You do not have permission to view this page.
            </Typography>
            <Typography variant="body1">
                Please contact the administrator for assistance.
            </Typography>
            <Button variant="contained" component={Link} to="/home" style={{ marginTop: 20 }}>
                Go to Home
            </Button>
        </div>
    );
}

export default AccessDenied;