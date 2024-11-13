import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "../store/useAuthStore";

const SocketContext = createContext(null);
const apiUrl = "http://192.168.100.6:8000/";

export const SocketProvider = ({ children }) => {
    const { access } = useAuthStore();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (access && !socket) {
            const newSocket = io(apiUrl, {
                auth: { token: access },
            });

            newSocket.on("connect", () => {
                console.log("Connected with socket ID:", newSocket.id);
            });

            newSocket.on("disconnect", () => {
                console.log("Disconnected from server");
            });

            setSocket(newSocket);

            return () => {
                if (socket) {
                    socket.disconnect();
                }
            };
        }
    }, [access, socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};