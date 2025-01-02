import {Button, Container, Grid, TextField} from "@mui/material";
import history from "../utils/history";
import {useState} from "react";
import {instance_users} from "../utils/axios";
import {jwtDecode} from "jwt-decode";

const Login = ({ onRegisterClick }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleInput = (event) => {
        const { value, name } = event.target;
        if (name === "username") {
            setUsername(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    const onSubmitFunction = event => {
        event.preventDefault();
        let credentials = {
            username: username,
            password: password
        }

        instance_users.post("/login", credentials)
            .then(
                res => {
                    const token = res.data.token;
                    const decoded_token = jwtDecode(token);
                    const role = decoded_token.role;
                    sessionStorage.setItem("role", role);
                    sessionStorage.setItem("id", decoded_token.id);
                    sessionStorage.setItem("token", token);
                    if (role === "USER") {
                        history.push("/devices");
                        window.location.reload();
                    }else if (role === "ADMIN") {
                        history.push("/admin");
                        window.location.reload();
                    }
                }
            )
            .catch(error => {
                console.log()
                console.log(error)
            })
    }

    return (
        <Container maxWidth="sm">
            <div>
                <Grid>
                    <form onSubmit={onSubmitFunction}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="string"
                            onChange={handleInput}
                            autoFocus
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
                            onChange={handleInput}
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Sign In
                        </Button>
                        <Button
                            onClick={onRegisterClick}
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            No account? Register
                        </Button>
                    </form>
                </Grid>
            </div>
        </Container>
    );
}
export default Login;