import React from 'react';
import Navbar from "../Navbar";
import Typography from "@mui/material/Typography";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {instance_users} from "../../utils/axios";

class User extends React.Component {
    state = {
        people: [],
        openUpdate: false,
        openCreate: false,
        currentUser: {
            id: '',
            username: '',
            password: '',
            name: '',
            role: ''
        }
    }

    componentDidMount() {
        this.fetchPeople();
    }

    fetchPeople = () => {
        instance_users.get("/person/get-persons").then(res => {
            this.setState({people: res.data});
        });
    }

    handleDelete = (id) => {
        instance_users.post(`/person/delete/${id}`).then(() => {
            this.fetchPeople();
        });
    }

    handleOpenUpdate = (person) => {
        this.setState({openUpdate: true, currentUser: person});
    }

    handleCloseUpdate = () => {
        this.setState({openUpdate: false, currentUser: {id: '', username: '', password: '', name: '', role: ''}});
    }

    handleOpenCreate = () => {
        this.setState({openCreate: true, currentUser: {id: '', username: '', password: '', name: '', role: ''}});
    }

    handleCloseCreate = () => {
        this.setState({openCreate: false, currentUser: {id: '', username: '', password: '', name: '', role: ''}});
    }

    handleChange = (e) => {
        this.setState({
            currentUser: {
                ...this.state.currentUser,
                [e.target.name]: e.target.value
            }
        });
    }

    handleUpdate = () => {
        const {currentUser} = this.state;
        instance_users.post(`/person/update/${currentUser.id}`, currentUser).then(() => {
            this.fetchPeople();
            this.handleCloseUpdate();
        });
    }

    handleCreate = () => {
        const {currentUser} = this.state;
        instance_users.post(`/person/insert`, currentUser).then(() => {
            this.fetchPeople();
            this.handleCloseCreate();
        });
    }

    render() {
        const {people, openUpdate, openCreate, currentUser} = this.state;
        return (
            <div>
                <Navbar/>
                <Typography variant="h4" gutterBottom style={{marginTop: '20px', marginBottom: '20px'}}>
                    User Management
                </Typography>
                <Box mb={2} display="flex" alignItems="center">
                    <Typography variant="body1" style={{fontSize: '1.1rem', marginRight: '10px'}}>
                        Create a new user:
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <Button variant="contained" color="primary" size="small" onClick={this.handleOpenCreate}>
                            Create
                        </Button>
                    </Box>
                </Box>

                <TableContainer component={Paper} style={{width: '100%'}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(Array.isArray(people) && people.length > 0) ? (
                                people.map(person => (
                                    <TableRow key={person.id}>
                                        <TableCell>{person.username}</TableCell>
                                        <TableCell>{person.name}</TableCell>
                                        <TableCell>{person.role}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="primary" size="small"
                                                    style={{marginRight: '5px'}}
                                                    onClick={() => this.handleOpenUpdate(person)}>
                                                Update
                                            </Button>
                                            <Button
                                                onClick={() => this.handleDelete(person.id)}
                                                variant="contained"
                                                color="error"
                                                size="small"
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">No users found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={openUpdate} onClose={this.handleCloseUpdate}>
                    <DialogTitle>Update User</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="username"
                            label="Username"
                            type="text"
                            fullWidth
                            value={currentUser.username}
                            onChange={this.handleChange}
                        />
                        <TextField
                            margin="dense"
                            name="name"
                            label="Name"
                            type="text"
                            fullWidth
                            value={currentUser.name}
                            onChange={this.handleChange}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Role</InputLabel>
                            <Select
                                name="role"
                                label="Role"
                                value={currentUser.role}
                                onChange={this.handleChange}
                            >
                                <MenuItem value="ADMIN">ADMIN</MenuItem>
                                <MenuItem value="USER">USER</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseUpdate} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleUpdate} color="primary">
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openCreate} onClose={this.handleCloseCreate}>
                    <DialogTitle>Create User</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="username"
                            label="Username"
                            type="text"
                            fullWidth
                            value={currentUser.username}
                            onChange={this.handleChange}
                        />
                        <TextField
                            margin="dense"
                            name="password"
                            label="Password"
                            type="password"
                            fullWidth
                            value={currentUser.password}
                            onChange={this.handleChange}
                        />
                        <TextField
                            margin="dense"
                            name="name"
                            label="Name"
                            type="text"
                            fullWidth
                            value={currentUser.name}
                            onChange={this.handleChange}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Role</InputLabel>
                            <Select
                                name="role"
                                label="Role"
                                value={currentUser.role}
                                onChange={this.handleChange}
                            >
                                <MenuItem value="ADMIN">ADMIN</MenuItem>
                                <MenuItem value="USER">USER</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseCreate} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleCreate} color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default User;
