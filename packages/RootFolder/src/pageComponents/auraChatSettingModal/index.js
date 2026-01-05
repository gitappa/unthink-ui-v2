import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const AuraChatSettingModal = dynamic(() => import("./AuraChatSettingModal"), {
	ssr: false,
});

export default (props) => {
	const [loadComponent, setLoadComponent] = useState(false);

	useEffect(() => {
		if (!loadComponent && props.isOpen) {
			setLoadComponent(true);
		}
	}, [props.isOpen]);

	return loadComponent && <AuraChatSettingModal {...props} />;
};
