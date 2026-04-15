import React from "react";
import socketio from "socket.io-client";

import { SOCKET_URL } from "../constants/config";

export const socket = socketio(SOCKET_URL, {
	reconnectionDelay: 1000,
	reconnection: true,
	reconnectionDelayMax: 5000,
	reconnectionAttempts: 5,
	transports: ["websocket"],
	agent: false,
	upgrade: false,
	rejectUnauthorized: false,
});

// Add error event listeners
socket.on("connect_error", (error) => {
	console.error("WebSocket connection error:", error);
});

socket.on("disconnect", (reason) => {
	console.warn("WebSocket disconnected:", reason);
});

export const SocketContext = React.createContext();
