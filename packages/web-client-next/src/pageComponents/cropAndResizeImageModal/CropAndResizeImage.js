import React, { useCallback, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";

const CropAndResizeImage = ({
	selectedImg,
	imgRef,
	aspect,
	setCompletedCrop,
}) => {
	const [crop, setCrop] = useState();

	// This is to demonstrate how to make and center a % aspect crop which is a bit trickier so we use some helper functions.
	const centerAspectCrop = useCallback((mediaWidth, mediaHeight, aspect) => {
		return centerCrop(
			makeAspectCrop(
				{
					unit: "%",
					width: 100,
				},
				aspect,
				mediaWidth,
				mediaHeight
			),
			mediaWidth,
			mediaHeight
		);
	}, []);

	const onImageLoad = useCallback(
		(e) => {
			if (aspect) {
				const { width, height } = e.currentTarget;
				setCrop(centerAspectCrop(width, height, aspect));
			}
		},
		[aspect, centerAspectCrop]
	);

	const onCropChange = useCallback((percentCrop) => {
		if (percentCrop.height <= 100 && percentCrop.width <= 100) {
			setCrop(percentCrop);
		}
	}, []);

	return (
		<div
			className='flex justify-center items-center'
			style={{
				height: "500px",
				maxHeight: "500px",
			}}>
			<ReactCrop
				crop={crop}
				onChange={(_, percentCrop) => onCropChange(percentCrop)}
				onComplete={(c) => setCompletedCrop(c)}
				aspect={aspect}
				minHeight={100}
				// circularCrop
				className='h-content'>
				<img
					ref={imgRef}
					alt='Crop me'
					src={selectedImg}
					// style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
					onLoad={onImageLoad}
				/>
			</ReactCrop>
		</div>
	);
};

export default CropAndResizeImage;
