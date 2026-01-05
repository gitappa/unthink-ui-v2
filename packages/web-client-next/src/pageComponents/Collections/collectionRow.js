import React, { useEffect, useState } from "react";
import chevRight from "../../images/Polygon4.svg";
import chevDown from "../../images/Polygon6.svg";
import menuIcon from "../../images/menu-gray.svg";
import menuSelectedIcon from "../../images/menu-gray-selected.svg";
import binImg from "../../images/bin.svg";
import { Typography, Image, Menu, Dropdown, Modal, notification } from "antd";
import getUUID from "../../helper/getUUID";
import {
	deleteCollectionAsync,
	setCollectionForEdit,
	setShowCollection,
	updateCollectionStatus,
} from "./redux/actions";
import styles from '../../style/collections/collectionRow.module.scss';
import { useDispatch, useSelector } from "react-redux";
import {
	ShareAltOutlined,
	EditOutlined,
	CheckOutlined,
	DeleteOutlined,
} from "@ant-design/icons";
import ShareOptions from "../shared/shareOptions";
import { getTTid } from "../../helper/getTrackerInfo";
import {
	COLLECTION_DONE,
	INFLUENCER,
	INFLUENCER_SHARED,
} from "../../constants/codes";
import { useRouter } from 'next/router';
import { useNavigate } from "../../helper/useNavigate";
import { generateShareV2Url } from "../../helper/utils";
const { Text } = Typography;

const CollectionRow = (props) => {
	const navigate = useNavigate();
	const [isCollapsed, setCollapsed] = useState(true);
	const [uuid] = useState(getUUID());
	const [showOptionState, setShowOption] = useState(false);
	const isBrowser = () => typeof window !== "undefined";
	const ttId = getTTid();
	const authUser = useSelector((state) => state?.auth?.user?.data || {});

	const helpMeShopShareUrl =
		authUser.emailId && authUser.user_name
			? `${INFLUENCER}/${authUser.user_name}/`
			: `${INFLUENCER_SHARED}/${ttId}`;

	const sharedPageUrl = generateShareV2Url(
		authUser?.user_id,
		authUser?.user_name
	);

	useEffect(() => {
		if (props.expandedList) {
			const list =
				props.expandedList.filter((list) => list === props.name).length > 0;
			setCollapsed(!list);
		}
	}, [props.expandedList]);
	const handleExpandedList = () => {
		if (props.expandedList.includes(props.name)) {
			const updatedList = props.expandedList.filter(
				(list) => list !== props.name
			);
			props.setExpandedList(updatedList);
		} else {
			props.setExpandedList((prevState) => [...prevState, props.name]);
		}
	};

	return (
		<div className='unthink-collection-row'>
			<div
				className={"unthink-collection-row__header"}
				onClick={() => {
					props.onListClick ? props.onListClick() : handleExpandedList();
				}}>
				<div className={"unthink-collection-row__header-text"}>
					<div className='circle'></div>
					<Text>{props.name}</Text>
				</div>
				<div className='unthink-collection-row__share-div'>
					{props.showShareOption && (
						<div className='unthink-collection-row__share'>
							<ShareAltOutlined
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									setShowOption(true);
								}}
							/>
							{showOptionState && (
								<ShareOptions
									setShow={setShowOption}
									url={
										props.showHelpMeShop ? helpMeShopShareUrl : sharedPageUrl
									}
									showMyProfile
									showHelpMeShop={props.showHelpMeShop}
								/>
							)}
						</div>
					)}
					<Image src={isCollapsed ? chevRight : chevDown} preview={false} />
				</div>
			</div>
			{!isCollapsed && (
				<div className='unthink-collection-row__content'>
					{props.list?.map((data, index) => {
						return (
							<div
								key={`${uuid}-${index}`}
								onClick={() => {
									props.onClick &&
										props.onClick(data.type, data?.data ?? {}, data.value);
								}}>
								<div
									className={`circle ${
										data?.data?.status === COLLECTION_DONE
											? "circle-done"
											: "bg-primary"
									}`}></div>
								<Text>{data.value}</Text>
								{data?.data?.collection_id && <DropdownList data={data} />}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};
const DropdownList = (props) => {
	const dispatch = useDispatch();
	const [isVisible, setVisible] = useState(false);
	const ttId = getTTid();
	const handleMenuClick = (e, id) => {
		e.preventDefault();
		e.stopPropagation();
		setVisible(false);
		confirm(id);
		// dispatch(
		// 	deleteCollectionAsync({
		// 		collection_id: id,
		// 		onSuccess: () => {},
		// 	})
		// );
	};

	const onEditCollection = (e, collectionData) => {
		e.preventDefault();
		e.stopPropagation();
		dispatch(setCollectionForEdit(collectionData));
		dispatch(setShowCollection(true));
	};

	const data = props.data;
	const menuOption = ({ id, collectionData = {} }) => {
		const userId = collectionData?.user_id;
		const expertId = collectionData?.expert_id;

		const confirmUpdateCollectionStatus = (status, data = {}) => {
			dispatch(updateCollectionStatus({ ...data, status }));
		};

		const handleUpdateCollectionStatus = (status, data) => {
			Modal.confirm({
				title: "Confirm",
				content: "Are you sure you want to mark the collection as Done?",
				okText: "Confirm",
				cancelText: "Cancel",
				onOk: () => confirmUpdateCollectionStatus(status, data),
			});
		};

		const items = [
			{
				key: 'editCollection',
				onClick: (e) => onEditCollection(e.domEvent, collectionData),
				label: (
					<div className='flex items-center'>
						<EditOutlined className='mr-2' />
						<Text>Edit Collection</Text>
					</div>
				),
			},
			{
				key: 'deleteList',
				onClick: (e) => handleMenuClick(e.domEvent, id),
				label: (
					<div className='flex items-center'>
						<DeleteOutlined className='mr-2' />
						<Text>Delete List</Text>
					</div>
				),
			},
		];

		if (expertId === ttId && collectionData.status !== COLLECTION_DONE) {
			items.push({
				key: 'markAsDone',
				onClick: (e) => {
					e.domEvent.stopPropagation();
					handleUpdateCollectionStatus(COLLECTION_DONE, collectionData);
				},
				label: (
					<div className='flex items-center'>
						<CheckOutlined className='mr-2' />
						<Text>Mark As Done</Text>
					</div>
				),
			});
		}

		if (expertId && userId) {
			items.push({
				key: 'viewSharedPage',
				onClick: (e) => {
					e.domEvent.stopPropagation();
					navigate(`${INFLUENCER_SHARED}${userId}`);
				},
				label: (
					<div className='flex items-center'>
						<ShareAltOutlined className='mr-2' />
						<Text>View Shared Page</Text>
					</div>
				),
			});
		}

		return items;
	};

	const handleProceed = (id) => {
		dispatch(
			deleteCollectionAsync({
				collection_id: id,
				onSuccess: () => {
					notification["success"]({
						message: "Success",
						description: "Collection has been successfully deleted",
					});
				},
				onFailure: () => {
					notification["error"]({
						message: "Failed",
						description: "failed to delete collection, try after sometime",
					});
				},
			})
		);
	};
	const confirm = (id) => {
		Modal.confirm({
			title: "Confirm",
			content: "Are you sure you want to delete the collection?",
			okText: "Delete",
			cancelText: "Cancel",
			onOk: () => {
				handleProceed(id);
			},
		});
	};
	return (
		<Dropdown
			open={isVisible}
			destroyOnHidden
			onOpenChange={(e) => setVisible(e)}
			menu={{
				items: menuOption({
					id: data?.data?.collection_id,
					collectionData: data?.data,
				})
			}}
			trigger={["click"]}>
			<a
				className='ant-dropdown-link'
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}>
				<Image src={isVisible ? menuSelectedIcon : menuIcon} preview={false} />
			</a>
		</Dropdown>
	);
};
export default CollectionRow;
