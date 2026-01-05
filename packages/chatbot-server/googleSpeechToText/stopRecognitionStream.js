const stopRecognitionStream = (recognizeStream, callback, isRestart) => {
	if (recognizeStream) {
		recognizeStream.end();
	}
	callback(isRestart);
};
export default stopRecognitionStream;
