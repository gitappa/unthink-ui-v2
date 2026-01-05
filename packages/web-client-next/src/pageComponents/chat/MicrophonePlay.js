import React from "react";

const MicrophonePlay = (props) => {
	return (
		<div
			className='rounded-full justify-evenly cursor-pointer items-center flex bg-yellow-300 w-37px h-37px'
			onClick={props.onClick}>
			<div className='w-2px '>
				<div className='bg-black-100 animate-mic-audio  h-7px w-3px rounded-sm'></div>
			</div>
			<div className='w-2px'>
				<div className='bg-black-100 animate-mic-audio delay-75 h-12px w-3px rounded-sm'></div>
			</div>
			<div className='w-2px'>
				<div className='bg-black-100 animate-mic-audio delay-100 h-7px w-3px rounded-sm'></div>
			</div>
		</div>
	);
};
export default MicrophonePlay;
