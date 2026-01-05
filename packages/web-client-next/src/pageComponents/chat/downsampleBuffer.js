const downsampleBuffer = (buffer, sampleRate, outSampleRate) => {
	if (outSampleRate === sampleRate) {
		return buffer;
	}
	if (outSampleRate > sampleRate) {
		throw "downsampling rate show be smaller than original sample rate";
	}
	var sampleRateRatio = sampleRate / outSampleRate;
	var newLength = Math.round(buffer.length / sampleRateRatio);
	var result = new Int16Array(newLength);
	var offsetResult = 0;
	var offsetBuffer = 0;
	while (offsetResult < result.length) {
		var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
		var accum = 0,
			count = 0;
		for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
			accum += buffer[i];
			count++;
		}

		result[offsetResult] = Math.min(1, accum / count) * 0x7fff;
		offsetResult++;
		offsetBuffer = nextOffsetBuffer;
	}
	return result.buffer;
};

export const capitalize = (s) => {
	if (s.length < 1) {
		return s;
	}
	return s.charAt(0).toUpperCase() + s.slice(1);
};
export default downsampleBuffer;
