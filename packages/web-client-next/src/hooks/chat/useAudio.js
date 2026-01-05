import React from "react";
import { useDispatch } from "react-redux";

import { setIsAuraSpeaking } from "./redux/actions";

const useAudio = (isAuraSpeaking) => {
	let auraSpeakingTimerKey;
	const dispatch = useDispatch();

	const setAuraSpeakingDuration = (duration) => {
		if (auraSpeakingTimerKey) clearTimeout(auraSpeakingTimerKey);
		if (duration) {
			dispatch(setIsAuraSpeaking(true));
			auraSpeakingTimerKey = setTimeout(() => {
				dispatch(setIsAuraSpeaking(false));
			}, duration);
		}
	};

	const onTrackStream = async (data) => {
		const audioContext = new AudioContext();
		if (data.audioContent && data.audioContent.byteLength) {
			const audioBufferChunk = await audioContext.decodeAudioData(
				data.audioContent
			);
			const source = audioContext.createBufferSource();
			source.buffer = audioBufferChunk;
			source.connect(audioContext.destination);
			source.start();
			setAuraSpeakingDuration(Math.floor((source.buffer.duration || 0) * 1000));
		}
	};

	return { onTrackStream };
};

export default useAudio;
