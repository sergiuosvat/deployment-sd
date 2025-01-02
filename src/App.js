import {BrowserRouter as Router, Navigate as Redirect, Route, Routes as Switch} from "react-router-dom";
import './App.css';
import Home from "./components/Home";
import AccessDenied from "./components/AccessDenied";
import Admin from "./components/admin/Admin";
import User from "./components/admin/User";
import Device from "./components/user/Device";
import DateGraph from "./components/user/DateGraph";
import ChatUser from "./components/user/ChatUser";
import ChatListAdmin from "./components/admin/ChatListAdmin";
import ChatAdmin from "./components/admin/ChatAdmin";

const App = () => {
    const defaultRoute = window.location.pathname === '/' ? <Redirect to="/home"/> : undefined;
    const role = sessionStorage.getItem('role');

    return (
        <Router>
            <Switch>
                <Route exact path="/home" element={<Home/>}/>
                <Route exact path="/admin" element={role === "ADMIN" ? <Admin/> : <AccessDenied/>}/>
                <Route exact path="/user" element={role === "ADMIN" ? <User/> : <AccessDenied/>}/>
                <Route exact path="/devices" element={<Device/>}></Route>
                <Route exact path="/consumption" element={<DateGraph/>}></Route>
                <Route exact path="/chat-user" element={<ChatUser/>}></Route>
                <Route exact path="/chat/:id" element={<ChatAdmin/>}></Route>
                <Route exact path="/chat-admin" element={role === "ADMIN" ? <ChatListAdmin/> : <AccessDenied/>}/>
                <Route exact path="/denied" element={<AccessDenied/>}></Route>
            </Switch>
            {defaultRoute}
        </Router>
    );
}

export default App;
