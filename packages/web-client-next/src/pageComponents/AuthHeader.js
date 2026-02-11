import React from "react";
import Link from 'next/link';
import { useNavigate } from "../helper/useNavigate";
import { Image, Row, Col } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import Logo from "../images/staticpageimages/logo_white.png";
import HeaderUser from "../images/staticpageimages/auth_header_user.svg";
import { is_store_instance, current_store_name } from "../constants/config";
import { PATH_ROOT, PATH_STORE, MY_PROFILE, PROFILE } from "../constants/codes";

import styles from "./AuthHeader.module.css";

export default function AuthHeader({
	userTextLink,
	hideProfile,
	showBackToStore,
}) {
	const navigate = useNavigate();
	return (
		<Row className={styles.headerRow}>
			<Col md={8} span={24} className={styles.backToStoreCol}>
				{showBackToStore && (
					<HomeOutlined
						className={styles.homeIcon}
						onClick={() => navigate(is_store_instance ? PATH_ROOT : PATH_STORE)}
					/>
				)}
			</Col>
			<Col md={8} span={24} className={styles.logoCol}>
				{is_store_instance && current_store_name !== "unthink_ai" && (
					<span className={styles.poweredByText}>Powered By</span>
				)}
				<Link href='/' className={styles.logoLink}>
					<Image
						src={Logo?.src || Logo}
						preview={false}
						height={22}
						className={styles.logoImage}
					/>
				</Link>
			</Col>
			{!hideProfile && (
				<Col
					md={8}
					span={24}
					className={styles.profileCol}>
					{userTextLink && userTextLink.to && (
						<>
							{MY_PROFILE && (
								<Link className={styles.linkText} href={MY_PROFILE}>
									{userTextLink.text}
								</Link>
							)}

							{PROFILE && (
								<Link className={styles.linkText} href={PROFILE}>
									{userTextLink.text}
								</Link>
							)}
						</>
					)}
					<Image src={HeaderUser?.src || HeaderUser} preview={false} height={33} />
				</Col>
			)}
		</Row>
	);
}
