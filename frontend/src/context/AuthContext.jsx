
import axios from "axios";
import { createContext, useContext, useState } from "react";
import httpStatus from "http-status"
import { useNavigate } from "react-router-dom";



export const AuthContext = createContext({});


const client = axios.create({
    baseURL: "http://localhost:8000/api/v1/users"
})

export const AuthProvider = ({ children }) => {

    const authContext = useContext(AuthContext);

    const [userData, setUserData] = useState(authContext)
    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
            let request = await client.post("/register", {
                name: name,
                username: username,
                password: password,
            })
            if (request.status === httpStatus.CREATED) {
                return request.data.message;
            }
        } catch (err) {
            throw err;
        }
    }

    const handleLogin = async (username, password) => {
        try {
            let request = await client.post("/login", {
                username: username,
                password: password
            });
            console.log(request.data);
            if (request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token);
                router("/home")
            }
        } catch (err) {
            throw err;
        }
    }
    const deleteHistoryOfUser = async () => {
        try {
            let request = await client.post('/delete_all_activity', {
                token: localStorage.getItem("token"),
            });
        } catch (e) {
            throw e;
        }
    }

    const getHistoryOfUser = async () => {
        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            });
            return request.data
        } catch (e) {
            throw e;
        }
    }

    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode,
            });

            return request;

        } catch (err) {
            throw err;
        }
    }
    const data = {

        userData, setUserData, handleRegister, handleLogin, addToUserHistory, getHistoryOfUser, deleteHistoryOfUser
    }
    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}
