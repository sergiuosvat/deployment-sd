import React, {useEffect, useState} from 'react';
import Navbar from "../Navbar";
import Typography from "@mui/material/Typography";
import {Box, List, ListItem, ListItemButton} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {instance_users} from "../../utils/axios";

const ChatListAdmin = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [participantNames, setParticipantNames] = useState({});

    useEffect(() => {
        fetchChats().then(() => console.log("Fetched chats"));
    }, []);

    const fetchChats = async () => {
        const users_temp = []
        for (let i = 0; i < localStorage.length; i++) {
            let current_key = localStorage.key(i);
            if (current_key.startsWith("chat_")) {
                current_key = current_key.replace("chat_", "");
                const userResponse = await instance_users.get(`/person/get/${current_key}`);
                setParticipantNames(prev => ({
                    ...prev,
                    [current_key]: userResponse.data.name
                }));
                users_temp.push({id: current_key});
            }
        }
        setUsers(users_temp);
    }

    const handleClick = (id) => {
        navigate(`/chat/${id}`);
    }

    return (
        <div>
            <Navbar/>
            <Typography variant="h4" align="center" style={{marginTop: "20px"}}>Available Chats</Typography>

            <List sx={{width: '100%', maxWidth: '600px', bgcolor: 'background.paper', marginX: 'auto'}}>
                {users.map((user) => (
                    <ListItem key={user.id} sx={{padding: 0}}>
                        <Box
                            component={ListItemButton}
                            onClick={() => handleClick(user.id)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '15px',
                                backgroundColor: 'primary.light',
                                borderRadius: '8px',
                                margin: '10px 0',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                color: `#fff`,
                                '&:hover': {
                                    backgroundColor: 'primary.main',
                                    color: '#fff',
                                },
                            }}
                        >
                            <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                                {`Chat with ${participantNames[user.id] || "Loading..."}`}
                            </Typography>
                        </Box>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default ChatListAdmin;
