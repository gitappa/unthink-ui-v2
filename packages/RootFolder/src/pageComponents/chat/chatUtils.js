import React from "react";

export const generateAutoSuggestOptions = (arr) =>
	arr.map(({ text, value }) => ({
		label: (
			<span
				dangerouslySetInnerHTML={{
					__html: text,
				}}
			/>
		),
		value,
	}));
