import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InfoCircleOutlined } from "@ant-design/icons";
import { notification } from "antd";

import Modal from "../../components/modal/Modal";
import { setAuraChatSetting } from "../../hooks/chat/redux/actions";
import styles from "./AuraChatSettingModal.module.css";

export const AuraChatSettingModalModes = {
	AURA: "AURA",
	COLLECTION: "COLLECTION",
	BLOG_COLLECTION: "BLOG_COLLECTION",
	VIDEO_COLLECTION: "VIDEO_COLLECTION",
	IMAGE_COLLECTION: "IMAGE_COLLECTION",
	SHOP_A_LOOK: "SHOP_A_LOOK",
	COMPLETE_THE_LOOK: "COMPLETE_THE_LOOK",
	SMART_SEARCH: "SMART_SEARCH",
};

const AuraChatSettingModal = ({
	isOpen,
	onClose,
	mode = AuraChatSettingModalModes.AURA,
}) => {
	const dispatch = useDispatch();
	const [auraChatSetting, storeTemplates] = useSelector((state) => [
		state.chatV2.auraChatSetting,
		state.store.data.templates || {},
	]);
	const [setting, setSetting] = useState({});

	const modes = {
		[AuraChatSettingModalModes.AURA]: ["cc_text"],
		[AuraChatSettingModalModes.COLLECTION]: ["cc_text"],
		[AuraChatSettingModalModes.BLOG_COLLECTION]: ["cc_blog"],
		[AuraChatSettingModalModes.VIDEO_COLLECTION]: ["cc_video", "cc_shortvideo"],
		[AuraChatSettingModalModes.IMAGE_COLLECTION]: ["cc_image"],
		[AuraChatSettingModalModes.SHOP_A_LOOK]: [
			"aura_text_stl",
			"aura_image_stl",
		],
		[AuraChatSettingModalModes.COMPLETE_THE_LOOK]: [
			"aura_text_ctl",
			"aura_image_ctl",
		],
		[AuraChatSettingModalModes.SMART_SEARCH]: ["aura_text_ss"],
	};

	const templateData = {
		cc_text: {
			title: "Text template",
			placeholder: "Type two lines here. for Text template",
		},
		cc_blog: {
			title: "Blog template",
			placeholder: "Type two lines here. for Blog template",
		},
		cc_image: {
			title: "Image template",
			placeholder: "Type two lines here. for Image template",
		},
		cc_video: {
			title: "Video template",
			placeholder: "Type two lines here. for Video template",
		},
		cc_shortvideo: {
			title: "Short video template",
			placeholder: "Type two lines here. for Short video template",
		},
		aura_text_stl: {
			title: "Text template",
			placeholder: "Type two lines here. for Text template",
		},
		aura_image_stl: {
			title: "Image template",
			placeholder: "Type two lines here. for Image template",
		},
		aura_text_ctl: {
			title: "Text template",
			placeholder: "Type two lines here. for Text template",
		},
		aura_image_ctl: {
			title: "Image template",
			placeholder: "Type two lines here. for Image template",
		},
		aura_text_ss: {
			title: "Text template",
			placeholder: "Type two lines here. for Text template",
		},
	};

	const handleSettingInputChange = useCallback((e) => {
		const { name, value } = e.target;

		setSetting((data) => ({
			...data,
			[name]: value,
		}));
	}, []);

	const handleSaveClick = ({
		value = setting,
		successMessage = "Settings saved.",
		closeOnSuccess = false,
		localPayload = undefined,
	} = {}) => {
		const payload = { ...value };

		dispatch(setAuraChatSetting(payload, localPayload)); // using single dispatch can update temp in local storage (saga) and reducer
		if (closeOnSuccess) onClose();
		setSetting((data) => ({
			...data,
			...payload,
		}));
		notification.success({
			message: "Success",
			description: successMessage,
		});
	};

	const handleRestoreDefaultClick = () => {
		let value = {};
		let localPayload = { ...setting };

		modes[mode].forEach((mode) => {
			value[mode] = storeTemplates[mode] || ""; // update temp from storeData in reducer
			delete localPayload[mode]; // remove temp from local storage
		});

		handleSaveClick({
			value: {
				...setting,
				...value,
			},
			successMessage: "Settings restored to default.",
			closeOnSuccess: true,
			localPayload,
		});
	};

	useEffect(() => {
		if (isOpen) {
			setSetting({
				gender: auraChatSetting.gender,
				age_group: auraChatSetting.age_group,
				color: auraChatSetting.color,
				cc_text: auraChatSetting.cc_text,
				cc_image: auraChatSetting.cc_image,
				cc_blog: auraChatSetting.cc_blog,
				cc_video: auraChatSetting.cc_video,
				cc_shortvideo: auraChatSetting.cc_shortvideo,
				aura_text_ss: auraChatSetting.aura_text_ss,
				aura_text_stl: auraChatSetting.aura_text_stl,
				aura_text_ctl: auraChatSetting.aura_text_ctl,
				aura_image_stl: auraChatSetting.aura_image_stl,
				aura_image_ctl: auraChatSetting.aura_image_ctl,
			});
		}
	}, [isOpen]);

	return (
		<Modal isOpen={isOpen} headerText='Settings' onClose={onClose}>
			<div>
				<h3 className={styles.description}>
					<InfoCircleOutlined className={styles.infoIcon} />
					Updating it can get the unexpected results. You can always come back
					and restore default.
				</h3>
				<div className={styles.container}>
					<div className={styles.gridContainer}>
						{modes[mode].map((mode) => (
							<div key={mode}>
								<label className={styles.label}>
									<b>{templateData[mode].title}</b>
								</label>
								<textarea
									rows={15}
									id='aura-chat-modal-tags-template-textarea'
									className={styles.textarea}
									placeholder={templateData[mode].placeholder}
									name={mode}
									value={setting[mode] ?? ""}
									onChange={handleSettingInputChange}
								/>
							</div>
						))}
					</div>

					<div className={styles.buttonContainer}>
						<button
							className={styles.restoreButton}
							onClick={() => handleRestoreDefaultClick()}>
							<b>Restore default</b>
						</button>
						<button
							className={styles.saveButton}
							onClick={() => handleSaveClick({ closeOnSuccess: true })}>
							Save
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default React.memo(AuraChatSettingModal);
