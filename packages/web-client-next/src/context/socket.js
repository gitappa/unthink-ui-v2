import React from "react";
import socketio from "socket.io-client";
import { SOCKET_URL } from "../constants/config";

export const socket = socketio(SOCKET_URL, {
	reconnectionDelay: 1000,
	reconnection: true,
	reconnectionAttemps: 10,
	transports: ["websocket"],
	agent: false,
	upgrade: false,
	rejectUnauthorized: false,
}).connect();
export const SocketContext = React.createContext();
