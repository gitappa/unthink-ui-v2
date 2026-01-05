import express from "express";
import googleSpeechToText from "./googleSpeechToText";
import startRecognitionStream from "./googleSpeechToText/synchronizeSpeechToText";
import stopRecognitionStream from "./googleSpeechToText/stopRecognitionStream";
import path from "path";
import fs from "fs";
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
var ss = require("socket.io-stream");

app.use(express.static(__dirname + "/public"));

// Serve frontend
app.get("/", async (req, res) => {
	res.render("index");
});

// Listen for new connection
io.on("connection", (socket) => {
	let recognizeStream = null;
	const startStreaming = () => {
		return startRecognitionStream(
			socket,
			(isRestart) => {
				if (isRestart) {
					recognizeStream = startStreaming();
				} else {
					recognizeStream = null;
				}
			},
			recognizeStream
		);
	};
	socket.on("startStream", function (data) {
		recognizeStream = null;
		console.log("start streaming");
		recognizeStream = startStreaming();
	});

	socket.on("endStream", function () {
		console.log("stop streaming");
		stopRecognitionStream(recognizeStream, () => {
			recognizeStream = null;
		});
	});

	socket.on("binaryData", function (data) {
		// console.log(data); //log binary data
		if (recognizeStream !== null) {
			recognizeStream.write(data);
		}
	});

	ss(socket).on("client-audio", (stream) => {
		try {
			const dir = "./tmp";

			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}
			var filename = dir + "/" + path.basename(`${socket.id}`);
			const writableStream = stream.pipe(fs.createWriteStream(filename));
			writableStream.on("finish", function () {
				const file = fs.readFileSync(filename);
				const audioBytes = file.toString("base64");
				const audio = {
					content: audioBytes,
				};
				googleSpeechToText(audio).then((text) => {
					socket.emit("messageFromClient", text);
					console.log(`new transcription: ${text}`);
				});
			});
		} catch (err) {
			console.log(err);
		}
	});
	socket.on("client", (data) => {
		console.log(`data from cliend id : ${socket.id}`);
		console.log(`message : ${data}`);
		socket.emit("server", "ok");
	});
});
// [END cloudrun_websockets_server]

module.exports = server;
