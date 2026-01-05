import React, { useMemo } from "react";
import { Modal, Row, Col, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import CopyToClipboard from "react-copy-to-clipboard";

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
				okButtonProps={{ className: "hidden" }}>
				<div className='flex flex-col gap-2'>
					{productDetails.name ? (
						<Row className='pt-3'>
							<Col className='capitalize' span={8}>
								Product Name:
							</Col>
							<Col span={16}>{productDetails.name}</Col>
						</Row>
					) : null}
					{productDetails.image ? (
						<Row>
							<b>Product Image Url</b>
							<div className='border p-1 rounded flex break-all'>
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
										className='text-xl flex ml-2'
									/>
								</CopyToClipboard>
							</div>
						</Row>
					) : null}
					{productRedirectionUrl &&
					productRedirectionUrl !== PRODUCT_DUMMY_URL ? (
						<Row>
							<b>Product Url</b>
							<div className='border p-1 rounded flex break-all'>
								<a href={productRedirectionUrl} target='_blank'>
									{productRedirectionUrl}
								</a>{" "}
								<CopyToClipboard
									text={productRedirectionUrl}
									onCopy={() => message.success("Copied", 1)}>
									<CopyOutlined className='text-xl flex ml-2' />
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
