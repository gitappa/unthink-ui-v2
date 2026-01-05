const _ = require("lodash");
const speech = require("@google-cloud/speech");

const speechToText = async (audio) => {
	const speechClient = new speech.SpeechClient({
		keyFileName: "../dialogflow-api-service-account.json",
	});
	const config = {
		encoding: "LINEAR16",
		languageCode: "en-US",
		alternativeLanguageCodes: ["en-IN", "en-US"],
	};
	const request = {
		audio,
		config,
	};
	const data = await speechClient.recognize(request);
	const results = _.get(data[0], "results", []);
	const transcription = results
		.map((result) => result.alternatives[0].transcript)
		.join("\n");
	return transcription;
};

export default speechToText;
