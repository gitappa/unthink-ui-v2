import React, { useState, useEffect, useContext } from "react";
import getUserMedia from "get-user-media-promise";
import downsampleBuffer from "./downsampleBuffer";
import { SocketContext } from "../../context/socket";
import { Image } from "antd";
import newMircophone from "../../images/new_microphone.svg";
import newMicrophonePlay from "../../images/new_microphone_red.svg";
import styles from './streamMicrophone.module.scss';
const randomId = () => `${new Date().getTime()}`;
const micTimer = 5000;

const StreamMicrophone = (props) => {
	const [, setMessageId] = useState(randomId());
	const [, setSpeechData] = useState("");
	// const [streaming, setStreaming] = useState(false); // should be removed later
	const { streaming, setStreaming } = props;

	const [activeContext, setActiveContext] = useState(null);
	const [activeProcessor, setActiveProcessor] = useState(null);
	const [activeInput, setActiveInput] = useState(null);
	const [globalStream, setGlobalStream] = useState(null);
	const [stopAudioRecording, setStopAudioRecording] = useState(false);
	const [, setTimer] = useState(null);
	const bufferSize = 2048;
	const socket = useContext(SocketContext);
	useEffect(() => {
		if (stopAudioRecording) {
			onStopRecording();
			setStopAudioRecording(false);
		}
	}, [stopAudioRecording]);
	const startRecording = () => {
		setMessageId(randomId());
		getUserMedia({ audio: true, video: false }).then((stream) => {
			setStreaming(true);
			props.setMicClicked(true);
			socket.emit("startStream", "");
			const contxt = window.AudioContext || window.webkitAudioContext;
			const context = new contxt({
				latencyHint: "interactive",
			});
			let processor;
			processor = context.createScriptProcessor(bufferSize, 1, 1);
			processor.connect(context.destination);
			context.resume();
			setActiveProcessor(processor);
			setActiveContext(context);
			handleSuccess(stream, context, processor);
		});
	};
	const handleSuccess = (stream, context, processor) => {
		setGlobalStream(stream);
		let input = context.createMediaStreamSource(stream);
		input.connect(processor);
		setActiveInput(input);
		handleTimer(micTimer);
		processor.onaudioprocess = function (e) {
			handleMicrophoneProcess(e);
		};
	};

	const onStopRecording = () => {
		if (streaming) {
			props.sendMessage();
			setStreaming(false);
			let track = globalStream.getTracks()[0];
			track.stop();
			activeInput.disconnect(activeProcessor);
			activeProcessor.disconnect(activeContext.destination);
			activeContext.close().then(function () {
				setActiveInput(null);
				setActiveProcessor(null);
				setActiveContext(null);
				props.setMicClicked(false);
				socket.emit("endStream", "");
			});
		}
	};

	const handleMicrophoneProcess = (e) => {
		const left = e.inputBuffer.getChannelData(0);
		// var left16 = convertFloat32ToInt16(left); // old 32 to 16 function
		const left16 = downsampleBuffer(left, 44100, 16000);
		socket.emit("binaryData", left16);
	};
	const handleTimer = (t) => {
		let timer = setTimeout(() => {
			setStopAudioRecording(true);
		}, t || 3000);
		setTimer(timer);
	};
	useEffect(function () {
		socket.on("speechData", function (data) {
			let timer;
			setTimer((d) => {
				timer = d;
				return null;
			});
			clearTimeout(timer);
			var dataFinal = undefined || data?.results[0]?.isFinal;
			const results = data?.results[0]?.alternatives[0].transcript;
			setSpeechData(results);
			let newMessageId = "";
			setMessageId((id) => {
				newMessageId = id;
				return id;
			});
			if (newMessageId) props.setMessage(results);
			// dispatch(
			// 	setClientChatMessage({ message: results, messageId: newMessageId })
			// );
			if (dataFinal) {
				setStopAudioRecording(true);
			}
		});
		return () => {
			if (streaming) socket.emit("endStream", "");
		};
	}, []);
	const handleMicrophoneClick = () => {
		if (streaming) {
			onStopRecording();
		} else {
			startRecording();
		}
	};
	return (
		<>
			<div className='microphone' onClick={handleMicrophoneClick}>
				{/* removed for new chat UI */}
				{/* <div
					className={`unthink-microphone__icon ${
						streaming ? "streaming" : ""
					}`}>
					<Image
						src={streaming ? newMicrophonePlay : newMircophone}
						preview={false}></Image>
				</div> */}
			</div>
		</>
	);
};

export default StreamMicrophone;
