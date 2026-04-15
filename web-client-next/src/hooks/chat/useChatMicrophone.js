import React, { useState, useEffect, useContext } from "react";
import getUserMedia from "get-user-media-promise";

import { SocketContext } from "../../context/socketV2";
import downsampleBuffer from "./downsampleBuffer";
import { setIsSendSocketMessageWithPrefix } from "../../helper/getTrackerInfo";

const randomId = () => `${new Date().getTime()}`;
const bufferSize = 2048;
const micTimer = 5000;

export const useChatMicrophone = ({ setResultText }) => {
	const [, setMessageId] = useState(randomId());
	const [streaming, setStreaming] = useState(false);
	const [activeContext, setActiveContext] = useState(null);
	const [activeProcessor, setActiveProcessor] = useState(null);
	const [activeInput, setActiveInput] = useState(null);
	const [globalStream, setGlobalStream] = useState(null);
	const [stopAudioRecording, setStopAudioRecording] = useState(false);
	const [, setTimer] = useState(null);
	const { socket } = useContext(SocketContext);

	useEffect(() => {
		if (stopAudioRecording) {
			onStopRecording();
			setStopAudioRecording(false);
		}
	}, [stopAudioRecording]);

	const onStartRecording = () => {
		setMessageId(randomId());
		getUserMedia({ audio: true, video: false }).then((stream) => {
			setStreaming(true);
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
			setStreaming(false);
			let track = globalStream.getTracks()[0];
			track.stop();
			activeInput.disconnect(activeProcessor);
			activeProcessor.disconnect(activeContext.destination);
			activeContext.close().then(function () {
				setActiveInput(null);
				setActiveProcessor(null);
				setActiveContext(null);
				socket.emit("endStream", "");
			});
		}
	};

	const handleMicrophoneProcess = (e) => {
		const left = e.inputBuffer.getChannelData(0);
		try {
			const left16 = downsampleBuffer(left, 44100, 16000);
			socket.emit("binaryData", left16);
		} catch (error) {
			console.error("handleMicrophoneProcess error : ", error);
		}
	};

	const handleTimer = (t) => {
		let timer = setTimeout(() => {
			setStopAudioRecording(true);
		}, t || 3000);
		setTimer(timer);
	};

	const onSpeechData = (data) => {
		let timer;
		setTimer((d) => {
			timer = d;
			return null;
		});
		clearTimeout(timer);
		var dataFinal = undefined || data?.results[0]?.isFinal;
		const results = data?.results[0]?.alternatives[0].transcript;
		let newMessageId = "";
		setMessageId((id) => {
			newMessageId = id;
			return id;
		});
		if (newMessageId) {
			setIsSendSocketMessageWithPrefix(false); // to not send the prefix with message to socket if the input provided by mic/aura
			setResultText(results);
		}

		if (dataFinal) {
			setStopAudioRecording(true);
		}
	};

	useEffect(function () {
		socket.on("speechData", onSpeechData);

		return () => {
			if (streaming) socket.emit("endStream", "");
			socket.off("speechData", onSpeechData);
		};
	}, []);

	const handleMicrophoneClick = () => {
		if (streaming) {
			onStopRecording();
		} else {
			onStartRecording();
		}
	};

	return {
		handleMicrophoneClick,
		onStartRecording,
		onStopRecording,
		streaming,
		setStreaming,
	};
};
