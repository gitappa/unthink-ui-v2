import { REGISTER_APP_LOADER, DEREGISTER_APP_LOADER } from "./constants";

export const registerAppLoader = (name) => ({
	type: REGISTER_APP_LOADER,
	name,
});

export const deregisterAppLoader = (name) => ({
	type: DEREGISTER_APP_LOADER,
	name,
});
