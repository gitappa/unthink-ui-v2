const _ = require("lodash");
const speech = require("@google-cloud/speech");
import stopRecognitionStream from "./stopRecognitionStream";
const speechToText = (client, callback, stream) => {
	const speechClient = new speech.SpeechClient({
		keyFileName: "../dialogflow-api-service-account.json",
	});
	const config = {
		encoding: "LINEAR16",
		sampleRateHertz: 16000,
		languageCode: "en-US",
		alternativeLanguageCodes: ["en-IN", "en-US"],
	};
	const request = {
		config,
		interimResults: true, //Get interim results from stream
	};
	const handleProcessData = (data) => {
		process.stdout.write(
			data.results[0] && data.results[0].alternatives[0]
				? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
				: "\n\nReached transcription time limit, press Ctrl+C\n"
		);
		client.emit("speechData", data);

		// if end of utterance, let's restart stream
		// this is a small hack. After 65 seconds of silence, the stream will still throw an error for speech length limit
		if (data.results[0] && data.results[0].isFinal) {
			stopRecognitionStream(stream, callback, true);
			console.log("restarted stream serverside");
		}
	};
	const recognizeStream = speechClient
		.streamingRecognize(request)
		.on("error", console.error)
		.on("data", handleProcessData);

	return recognizeStream;
};

export default speechToText;
