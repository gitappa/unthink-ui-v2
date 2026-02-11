// set position absolute for spin loader only and prevent spin camera icon
// desktop : h-36px w-36px
// mobile : h-36px w-36px

import React from "react";
import styles from "./Loader.module.css";

const AuraCameraSpinLoader = () => {
	return (
		<div className={`${styles.auraCameraLoader} aura_camera_spin_loader`}></div>
	);
};

export default AuraCameraSpinLoader;
