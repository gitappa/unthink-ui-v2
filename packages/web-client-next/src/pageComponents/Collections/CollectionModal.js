import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Modal,
	Input,
	Button,
	Typography,
	notification,
	Checkbox,
	Row,
	Col,
} from "antd";

import {
	addToCollectionAsync,
	setShowCollection,
	createCollectionAsync,
	getCollectionsAsync,
	setProductToSaveAfterCollectionCreated,
	setCollectionForEdit,
	editCollection,
} from "./redux/actions";
import { getCollectionList } from "./collectionsUtils";

import styles from './collectionModal.module.scss';
import { getTTid } from "../../helper/getTrackerInfo";
import { getCurrentPath } from "../../helper/utils";
import { COLLECTION_PRIVATE, COLLECTION_PUBLIC } from "../../constants/codes";

const { Text } = Typography;
const { TextArea } = Input;

const initialCollectionData = {
	name: "",
	description: "",
	collections: [],
};

const CollectionModal = ({ expertUser = {} }) => {
	const dispatch = useDispatch();
	const [err, setErr] = useState("");
	const [collectionList, productToSave] = useSelector((state) => [
		state?.collections?.collectionList?.data ?? [],
		state?.collections?.productToSaveAfterCollectionCreated,
	]);
	const [collectionData, setCollectionData] = useState(initialCollectionData);

	const [
		showModal,
		isCreating,
		isSharedCreateCollection,
		collectionListUserId,
		selectedCollectionForEdit,
		collOwnerUser,
	] = useSelector((state) => [
		state.collections?.showCreateCollection,
		state.collections?.isCreatingCollection,
		state.collections?.isSharedCreateCollection,
		state.collections?.collectionListUserId,
		state.collections?.selectedCollectionForEdit,
		state?.shared?.user?.data ?? {},
	]);

	useEffect(() => {
		if (selectedCollectionForEdit?.collection_id) {
			setCollectionData(selectedCollectionForEdit);
		}
	}, [selectedCollectionForEdit]);

	const collections = getCollectionList(collectionList);
	const myCollections = collections.filter(
		(c) => c.access === COLLECTION_PRIVATE
	);

	const isCollectionAlreadyExist = (name) => {
		const list = [];
		collectionList.map((data) => {
			data?.collections?.map &&
				data.collections.map((collection) => list.push(collection));
		});
		return list.filter((collection) => collection.name === name).length > 0;
	};
	const handleOk = () => {
		if (collectionData.name) {
			const isSharedPage =
				getCurrentPath().includes("/store/shared") ||
				getCurrentPath().includes("/influencer/");

			setErr("");
			if (collectionData.collection_id) {
				if (
					collectionData.name !== selectedCollectionForEdit?.name &&
					isCollectionAlreadyExist(collectionData.name)
				) {
					setErr("Collection name already exists");
				} else {
					dispatch(
						editCollection({
							...collectionData,
							is_influencer: collOwnerUser.is_influencer,
							onSuccess: (data) => {
								if (data.status_code === 200) {
									notification["success"]({
										message: "Collection Updated Successfully!",
									});
									dispatch(
										getCollectionsAsync({ userId: collectionListUserId })
									);
									handleCancel();
								} else {
									setErr(data.status_desc);
								}
							},
						})
					);
				}
			} else {
				if (
					collectionData.name &&
					isCollectionAlreadyExist(collectionData.name)
				) {
					setErr("Collection name already exists");
				} else {
					dispatch(
						createCollectionAsync({
							...collectionData,
							isSharedCreateCollection,
							expert_name: expertUser.first_name,
							collOwnerUserId: isSharedPage
								? collOwnerUser.user_id
								: expertUser.user_id,
							user_name: isSharedPage
								? collOwnerUser.first_name
								: expertUser.user_id,
							onSuccess: (data) => {
								if (data.status_code === 200) {
									if (productToSave) {
										const payload = {
											name: collectionData.name,
											mfr_code: productToSave,
											type: data.type,
											access: isSharedCreateCollection
												? COLLECTION_PUBLIC
												: COLLECTION_PRIVATE,
											user_id:
												(isSharedPage && collOwnerUser.user_id) ||
												expertUser.user_id,
											expert_id: isSharedCreateCollection
												? getTTid()
												: undefined,
											onSuccess: (data) => {
												if (data.status_code === 200) {
													notification["success"]({
														message: "Success",
														descriptions: "product added to the collection",
													});
													dispatch(setProductToSaveAfterCollectionCreated(""));
													dispatch(
														getCollectionsAsync({
															userId: collectionListUserId,
														})
													);
													handleCancel();
												} else {
													notification["failure"]({
														message: "failure",
														descriptions: "failed to add product to collection",
													});
													handleCancel();
												}
											},
										};
										dispatch(addToCollectionAsync(payload));
									} else {
										dispatch(
											getCollectionsAsync({ userId: collectionListUserId })
										);
										handleCancel();
									}
								} else {
									setErr(data.status_desc);
								}
							},
						})
					);
				}
			}
		} else {
			setErr("Please enter valid collection name");
		}
	};
	const handleCancel = () => {
		dispatch(setShowCollection(false));
		selectedCollectionForEdit?.collection_id &&
			dispatch(setCollectionForEdit({}));
		setErr("");
		setCollectionData(initialCollectionData);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCollectionData({
			...collectionData,
			[name]: value,
		});
	};

	const handleCollectionsChange = (newVal) => {
		setCollectionData({
			...collectionData,
			["collections"]: newVal,
		});
	};

	return (
		<Modal
			title={
				collectionData.collection_id ? "Edit Collection" : "Create Collection"
			}
			open={showModal}
			footer={null}
			onCancel={handleCancel}
			closable={!isCreating}
			maskClosable={!isCreating}>
			<div>
				<Input
					value={collectionData.name}
					placeholder='Enter Collection name'
					onChange={handleInputChange}
					name='name'
				/>
			</div>
			{err && <Text className='unthink-collection-modal__error'>{err}</Text>}
			<div className='mt-4'>
				<TextArea
					rows={4}
					value={collectionData.description}
					placeholder='Enter Collection description'
					name='description'
					onChange={handleInputChange}
				/>
			</div>
			{(isSharedCreateCollection && myCollections.length && (
				<div className='mt-4'>
					<p className='mb-1'>Select collections</p>
					<Checkbox.Group
						onChange={handleCollectionsChange}
						value={collectionData.collections}>
						<Row>
							{myCollections.map((i) => (
								<Col span={24} key={i.collection_id}>
									<Checkbox value={i.collection_id}>{i.name}</Checkbox>
								</Col>
							))}
						</Row>
					</Checkbox.Group>
				</div>
			)) ||
				null}
			<div className='unthink-collection-modal__footer pt-4'>
				<Button
					type='primary'
					onClick={handleOk}
					className='mr-4 bg-primary border-primary'
					loading={isCreating}>
					{collectionData.collection_id ? "Edit" : "Create"}
				</Button>
				{!isCreating && <Button onClick={handleCancel}>Cancel</Button>}
			</div>
		</Modal>
	);
};

export default CollectionModal;
