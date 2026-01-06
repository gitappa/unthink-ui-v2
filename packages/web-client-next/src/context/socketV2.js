import React from "react";
import socketio from "socket.io-client";

import { SOCKET_URL } from "../constants/config";

export const socket = socketio(SOCKET_URL, {
	reconnectionDelay: 1000,
	reconnection: true,
	// reconnectionAttempts: 10,
	transports: ["websocket"],
	agent: false,
	upgrade: false,
	rejectUnauthorized: false,
});

export const SocketContext = React.createContext();
