import React from "react";
import { useRouter } from "next/router";
import GuestSignupForm from "../pageComponents/Auth/GuestSignupForm";

const tryForFreeContainer = () => {
	const router = useRouter();
	const defaultEmail = typeof router.query?.email === "string" ? router.query.email : "";
	return <GuestSignupForm defaultEmail={defaultEmail} />;
};

export default tryForFreeContainer;
