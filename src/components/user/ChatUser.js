import React, {useEffect, useRef, useState} from 'react';
import {Avatar, Box, Button, List, ListItem, TextField, Typography} from '@mui/material';
import Navbar from '../Navbar';
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {CheckCircle, CheckCircleOutline} from "@mui/icons-material";

const ChatUser = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const stompClientRef = useRef(null);
    const [typing, setTyping] = useState(false);
    const userId = sessionStorage.getItem("id");
    const storage_key = "chat_" + userId;

    useEffect(() => {
        const storedMessages = JSON.parse(localStorage.getItem(storage_key)) || [];
        setMessages(storedMessages);
        setMessages((storedMessages) => {
            const updatedMessages = storedMessages.map((message) => {
                if (message.senderId === 'admin' && message.readStatus === "false") {
                    return { ...message, readStatus: "true" };
                }
                return message;
            });
            localStorage.setItem(storage_key, JSON.stringify(updatedMessages));
            return updatedMessages;
        });

        const socket = new SockJS("http://localhost/chat-api/message-websocket");
        const stompClient = Stomp.over(socket);
        stompClientRef.current = stompClient;

        stompClient.connect({}, () => {
            stompClient.subscribe(`/msg/${userId}`, (message) => {
                const chatMessage = JSON.parse(message.body);
                if (chatMessage.senderId === "admin") {
                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages, chatMessage];
                        localStorage.setItem(storage_key, JSON.stringify(updatedMessages));
                        if (stompClientRef.current) {
                            stompClientRef.current.send(
                                "/read",
                                {},
                                JSON.stringify({senderId: userId, recipientId: "admin", content: "", readStatus: "true"})
                            );
                        }
                        return updatedMessages;
                    });
                    window.location.reload();
                }
            });
            stompClient.subscribe(`/notify/typing`, (message) => {
                const typingData = JSON.parse(message.body);
                if(typingData.recipientId === userId)
                {
                    setTyping(typingData.content === "true");
                }
            });
            stompClient.subscribe("/notify/read", () => {
                setMessages((prevMessages) => {
                    const updatedMessages = prevMessages.map((message) => {
                        if (message.senderId === userId && message.readStatus === "false") {
                            return { ...message, readStatus: "true" };
                        }
                        return message;
                    });
                    localStorage.setItem(storage_key, JSON.stringify(updatedMessages));
                    return updatedMessages;
                });
            });
        });

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.disconnect();
            }
        };

    }, [storage_key, userId]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleMessageSubmit();
        }
    };

    const sendTypingNotification = (isTyping) => {
        if (stompClientRef.current) {
            stompClientRef.current.send(
                "/typing",
                {},
                JSON.stringify({senderId: userId, recipientId: "admin", content: isTyping.toString(), readStatus: "false"})
            );
        }
    };

    const handleFocus = () => {
        sendTypingNotification(true);
    };

    const handleBlur = () => {
        sendTypingNotification(false);
    };

    const handleMessageSubmit = () => {
        if (newMessage.trim()) {
            const chatMessage = {
                senderId: userId,
                recipientId: "admin",
                content: newMessage,
                readStatus: "false",
            };
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, chatMessage];
                localStorage.setItem(storage_key, JSON.stringify(updatedMessages));
                return updatedMessages;
            });
            if (stompClientRef.current) {
                stompClientRef.current.send(
                    "/sendMessage",
                    {},
                    JSON.stringify(chatMessage)
                );
                setNewMessage("");
            } else {
                console.error("StompClient is not connected.");
            }
        }
    };

    return (
        <div>
            <Navbar/>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    padding: 2,
                    backgroundColor: '#fff',
                    mt: 2,
                }}
            >
                {messages.length > 0 && (
                    <Box sx={{flexGrow: 1, overflowY: 'auto', marginBottom: 2}}>
                        <List>
                            {messages.map((message, index) => (
                                <ListItem
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent:
                                            message.senderId !== 'admin' ? 'flex-end' : 'flex-start',
                                        alignItems: 'center',
                                        marginBottom: '16px'
                                    }}
                                >
                                    {message.senderId === 'admin' && (
                                        <>
                                            <Avatar sx={{bgcolor: '#3f51b5', mr: '8px'}}>A</Avatar>
                                            <Box
                                                sx={{
                                                    maxWidth: '80%',
                                                    paddingX: '12px',
                                                    paddingY: '8px',
                                                    backgroundColor: '#424242',
                                                    borderRadius: "20px",
                                                    color: "#fff",
                                                }}
                                            >

                                                <Typography variant="body1">{message.content}</Typography>
                                            </Box>
                                        </>
                                    )}

                                    {message.senderId !== 'admin' && (
                                        <>
                                            <Box
                                                sx={{
                                                    maxWidth: "80%",
                                                    paddingX: "12px",
                                                    paddingY: "8px",
                                                    backgroundColor: "#424242",
                                                    borderRadius: "20px",
                                                    color: "#fff"
                                                }}
                                            >
                                                <Typography variant="body1">{message.content}</Typography>
                                            </Box>

                                            <Avatar sx={{bgcolor: '#ff5722', ml: 1}}>U</Avatar>
                                            {message.readStatus === "true" ? (
                                                <CheckCircle sx={{ color: '#4caf50', ml: 1 }} />
                                            ) : (
                                                <CheckCircleOutline sx={{ color: '#ccc', ml: 1 }} />
                                            )}
                                        </>
                                    )}
                                </ListItem>
                            ))}
                        </List>
                        {typing && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#888',
                                    fontStyle: 'italic',
                                    marginLeft: '16px'
                                }}
                            >
                                Admin is typing...
                            </Typography>
                        )}
                    </Box>
                )}

                <Box sx={{display: `flex`, justifyContent: `space-between`, alignItems: `center`}}>
                    <Box
                        sx={{
                            flex: 1,
                            padding: '1px',
                            display: `flex`,
                            alignItems: `center`
                        }}
                    >
                        <TextField
                            variant="outlined"
                            fullWidth
                            placeholder="Type a message..."
                            multiline
                            value={newMessage}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onChange={(e) => {
                                setNewMessage(e.target.value);
                            }}
                            onKeyDown={handleKeyDown}
                            sx={{
                                borderRadius: "20px",
                                backgroundColor: "#424242",
                                color: '#FFFFFF',
                                '& .MuiOutlinedInput-root': {
                                    maxHeight: '120px',
                                    overflow: 'auto',
                                },
                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'transparent',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                                textarea: {
                                    resize: 'none',
                                    color: '#FFFFFF',
                                },
                            }}
                        />
                    </Box>


                    <Button
                        variant="contained"
                        sx={{
                            marginLeft: 2,
                        }}
                        onClick={handleMessageSubmit}
                    >
                        Send
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

export default ChatUser;
