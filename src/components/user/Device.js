import React, { useState, useEffect } from 'react';
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
import {instance_devices, instance_users} from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import AlertDialog from "../AlertDialog";
import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";

const DeviceFormDialog = ({ open, handleClose, handleSubmit, handleChange, currentDevice, users, title, action, userRole }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="description"
                    label="Description"
                    type="text"
                    fullWidth
                    value={currentDevice.description}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="address"
                    label="Address"
                    type="text"
                    fullWidth
                    value={currentDevice.address}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="consumption"
                    label="Consumption"
                    type="number"
                    fullWidth
                    value={currentDevice.consumption}
                    onChange={handleChange}
                />
                {userRole === 'ADMIN' && (
                    <FormControl fullWidth margin="dense">
                        <InputLabel>User ID</InputLabel>
                        <Select
                            name="userID"
                            label="User ID"
                            value={currentDevice.userID}
                            onChange={handleChange}
                        >
                            {Array.isArray(users) && users.length > 0 ? (
                                users.map(user => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.id} - {user.name}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value={''}>No users found</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    {action}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const Device = () => {
    const [devices, setDevices] = useState([]);
    const [users, setUsers] = useState([]);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [currentDevice, setCurrentDevice] = useState({
        id: '',
        description: '',
        address: '',
        consumption: '',
        userID: ''
    });
    const [userRole, setUserRole] = useState('');
    const [currentUserID, setCurrentUserID] = useState('');

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const currentUserID = sessionStorage.getItem('id');
        const userRole = sessionStorage.getItem('role');
        setCurrentUserID(currentUserID);
        setUserRole(userRole);
        fetchDevices(currentUserID, userRole);
        fetchUsers();

        const socket = new SockJS("http://localhost/monitoringapi/alert-websocket");
        const stompClient = Stomp.over(socket);
        console.log("Stomp Client Configuration:", stompClient);

        stompClient.connect({}, () => {
            stompClient.subscribe("/topic/alerts", (message) => {
                console.log(message);
                const data = JSON.parse(message.body);
                if (data.alert) {
                    setAlertMessage(data.alert);
                    setAlertOpen(true);
                }
            });
        });

        return () => {
            stompClient.disconnect();
        };
    }, []);

    const fetchDevices = (currentUserID, userRole) => {
        instance_devices.get("/device/get-devices").then(res => {
            const filteredDevices = res.data.filter(device => {
                if (userRole === 'ADMIN') {
                    return true;
                } else {
                    return String(device.userID) === String(currentUserID);
                }
            });
            setDevices(filteredDevices);
        });
    };

    const fetchUsers = () => {
        instance_users.get("/person/get-persons").then(res => {
            setUsers(res.data);
        });
    };

    const handleDelete = (id) => {
        instance_devices.post(`/device/delete/${id}`).then(() => {
            fetchDevices(currentUserID, userRole);
        });
    };

    const handleOpenUpdate = (device) => {
        setOpenUpdate(true);
        setCurrentDevice(device);
    };

    const handleCloseUpdate = () => {
        setOpenUpdate(false);
        setCurrentDevice({ id: '', description: '', address: '', consumption: '', userID: '' });
    };

    const handleOpenCreate = () => {
        setOpenCreate(true);
        setCurrentDevice({ id: '', description: '', address: '', consumption: '', userID: '' });
    };

    const handleCloseCreate = () => {
        setOpenCreate(false);
        setCurrentDevice({ id: '', description: '', address: '', consumption: '', userID: '' });
    };

    const handleChange = (e) => {
        setCurrentDevice({
            ...currentDevice,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = () => {
        instance_devices.post(`/device/update/${currentDevice.id}`, currentDevice).then(() => {
            fetchDevices(currentUserID, userRole);
            handleCloseUpdate();
        });
    };

    const handleCreate = () => {
        instance_devices.post(`/device/insert`, currentDevice).then(() => {
            fetchDevices(currentUserID, userRole);
            handleCloseCreate();
        });
    };

    const handleConsumption = (id) => {
        navigate('/consumption', { state: { deviceId: id } });
    };
    const handleClose = () => {
        setAlertOpen(false);
    }

    const handleChat = () => {
        navigate('/chat-user');
    }

    return (
        <div>
            <Navbar />
            <Typography variant="h4" gutterBottom style={{ marginTop: '20px', marginBottom: '20px' }}>
                Device Management
            </Typography>
            {userRole === 'USER' && (
                <Button onClick={handleChat} variant="contained" color="primary" style={{ marginBottom: '10px' }}> Chat with an admin </Button>
            )}
            <AlertDialog open={alertOpen} message={alertMessage} handleClose={handleClose} />
            {userRole === 'ADMIN' && (
                <Box mb={2} display="flex" alignItems="center">
                    <Typography variant="body1" style={{ fontSize: '1.1rem', marginRight: '10px' }}>
                        Create a new device:
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <Button variant="contained" color="primary" size="small" onClick={handleOpenCreate}>
                            Create
                        </Button>
                    </Box>
                </Box>
            )}

            <TableContainer component={Paper} style={{ width: '100%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Consumption</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {devices.length > 0 ? (
                            devices.map(device => {
                                const user = users.find(user => user.id === device.userID);
                                return (
                                    <TableRow key={device.id}>
                                        <TableCell>{device.description}</TableCell>
                                        <TableCell>{device.address}</TableCell>
                                        <TableCell>{device.consumption}</TableCell>
                                        <TableCell>{user ? user.name : 'No User Assigned'}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                style={{ marginRight: '5px' }}
                                                onClick={() => handleOpenUpdate(device)}
                                            >
                                                Update
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(device.id)}
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                style={{ marginRight: '5px' }}
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                onClick={() => handleConsumption(device.id)}
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                            >
                                                View consumption
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No devices found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <DeviceFormDialog
                open={openUpdate}
                handleClose={handleCloseUpdate}
                handleSubmit={handleUpdate}
                handleChange={handleChange}
                currentDevice={currentDevice}
                users={users}
                title="Update Device"
                action="Update"
                userRole={userRole}
            />

            <DeviceFormDialog
                open={openCreate}
                handleClose={handleCloseCreate}
                handleSubmit={handleCreate}
                handleChange={handleChange}
                currentDevice={currentDevice}
                users={users}
                title="Create Device"
                action="Create"
                userRole={userRole}
            />
        </div>
    );
};

export default Device;
