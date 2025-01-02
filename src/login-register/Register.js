import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import {instance_users} from "../utils/axios";
import Grid from "@mui/material/Grid";
import history from "../utils/history";
import {jwtDecode} from "jwt-decode";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            name: "",
        };
    }

    handleInput = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    onSubmitFunction = event => {
        event.preventDefault();
        let userData = {
            username: this.state.username,
            password: this.state.password,
            name: this.state.name,
        };

        instance_users.post("/register", userData)
            .then(res => {
                const token = res.data.token;
                const decoded_token = jwtDecode(token);
                const role = decoded_token.role;
                sessionStorage.setItem("role", role);
                sessionStorage.setItem("id", decoded_token.id);
                sessionStorage.setItem("token", token);
                history.push("/devices");
                window.location.reload();
            })
            .catch(error => {
                console.error("Registration Error:", error);
            });
    };

    render() {
        return (
            <Container maxWidth="sm">
                <div>
                    <Grid>
                        <form onSubmit={this.onSubmitFunction}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="string"
                                onChange={this.handleInput}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                onChange={this.handleInput}
                                autoComplete="current-password"
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                name="name"
                                autoComplete="string"
                                onChange={this.handleInput}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                Register
                            </Button>
                        </form>
                    </Grid>
                </div>
            </Container>
        );
    }
}

export default Register;