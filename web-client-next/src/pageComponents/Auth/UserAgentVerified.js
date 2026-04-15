import React from "react";
import { Result } from "antd";

import AuthHeader from "../AuthHeader";
import Link from "next/link";
import styles from "./authPage.module.scss";

const UserAgentVerified = () => {
    return (
        <div className={`static_page_bg ${styles.verifiedRoot}`}>
            <div className={styles.authHeaderContainer}>
                <AuthHeader
                    userTextLink={{
                        text: "Sign In",
                        to: "/signin",
                    }}
                />
            </div>
            <div className={styles.verifiedContainer}>
                <div className={styles.verifiedContent}>
                    <Result
                        className={styles.verifiedResult}
                        status='success'
                        title={<span className={styles.verifiedTitle}>Verification Success!</span>}
                        subTitle={
                            <>
                                <p className={styles.verifiedSubtitle}>
                                    Thank you. Your email has been verified.
                                </p>
                                <p className={styles.verifiedSubtitleBlock}>Continue chatting with the agent.</p>
                            </>
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default UserAgentVerified;
