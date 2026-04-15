import React, { useMemo } from "react";
import { Modal, Row, Col, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import CopyToClipboard from "react-copy-to-clipboard";
import styles from "./ProductDetailsCopyModal.module.css";

import { addSidInProductUrl } from "../helper/utils";
import { PRODUCT_DUMMY_URL } from "../constants/codes";

const ProductDetailsCopyModal = ({
	isOpen,
	productDetails,
	onClose,
	userId,
}) => {
	const productRedirectionUrl = useMemo(
		() =>
			userId && isOpen
				? addSidInProductUrl(productDetails.url, userId)
				: productDetails.url,
		[productDetails.url, isOpen]
	);

	return (
		<div>
			<Modal
				title='Product Urls'
				open={isOpen}
				onCancel={onClose}
				cancelText='Close'
				okButtonProps={{ className: styles.hidden }}>
				<div className={styles.contentWrapper}>
					{productDetails.name ? (
						<Row className={styles.rowPadding}>
							<Col className={styles.capitalize} span={8}>
								Product Name:
							</Col>
							<Col span={16}>{productDetails.name}</Col>
						</Row>
					) : null}
					{productDetails.image ? (
						<Row>
							<b>Product Image Url</b>
							<div className={styles.urlBox}>
								<a href={productDetails.image} target='_blank'>
									{productDetails.image}
								</a>{" "}
								<CopyToClipboard
									text={productDetails.image}
									onCopy={() => message.success("Copied", 1)}>
									<CopyOutlined
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										className={styles.copyIcon}
									/>
								</CopyToClipboard>
							</div>
						</Row>
					) : null}
					{productRedirectionUrl &&
						productRedirectionUrl !== PRODUCT_DUMMY_URL ? (
						<Row>
							<b>Product Url</b>
							<div className={styles.urlBox}>
								<a href={productRedirectionUrl} target='_blank'>
									{productRedirectionUrl}
								</a>{" "}
								<CopyToClipboard
									text={productRedirectionUrl}
									onCopy={() => message.success("Copied", 1)}>
									<CopyOutlined className={styles.copyIcon} />
								</CopyToClipboard>
							</div>
						</Row>
					) : null}
				</div>
			</Modal>
		</div>
	);
};

export default ProductDetailsCopyModal;
