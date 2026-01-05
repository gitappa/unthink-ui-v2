// set position absolute for spin loader only and prevent spin camera icon
// desktop : h-36px w-36px
// mobile : h-36px w-36px

import React from "react";

const AuraCameraSpinLoader = () => {
	return (
		<div className='border-2 border-dashed border-indigo-600 dark:border-lightgray-101 aura_camera_spin_loader'></div>
	);
};

export default AuraCameraSpinLoader;
