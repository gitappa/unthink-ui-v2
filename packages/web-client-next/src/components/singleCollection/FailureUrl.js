import { Result } from "antd";
import Link from "next/link";
import React from "react";
import styles from "./StatusUrl.module.css";

const FailureUrl = () => {
    return (
        <div className={`static_page_bg ${styles.statusContainer}`} style={{ minHeight: '100vh' }}>
            <Result
                className={styles.resultWrapper}
                status='success'
                title={<span className={styles.textWhite}> Payment Failed </span>}
                subTitle={
                    <>
                        <p className={`${styles.textWhite} ${styles.marginZero}`}>
                            Oops! Your payment could not be processed.
                        </p>
                        <p className={styles.textWhite}>You can now proceed to sign in.</p>
                    </>
                }
                extra={
                    <Link href='/'>
                        <button className={styles.homeButton}>
                            Home
                        </button>
                    </Link>
                }
            />
        </div>
    );
};

export default FailureUrl;
