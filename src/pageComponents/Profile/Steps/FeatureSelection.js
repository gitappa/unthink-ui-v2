import React, { useEffect, useState, useMemo } from "react";
import {
    Input,
    Typography,
    Row,
    Col,
    Button,
    Space,
    Select,
    message,
    Switch,
    Upload,
    Radio,
    Spin,
} from "antd";
import {
    PlusOutlined,
    CloseOutlined,
    MenuOutlined,
    UploadOutlined,
    LoadingOutlined,
    MinusOutlined,
    DownOutlined,
} from "@ant-design/icons";
import axios from "axios";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { profileAPIs } from "../../../helper/serverAPIs";
import { auraYfretUserCollBaseUrl } from "../../../constants/config";
import { useNavigate } from "../../../helper/useNavigate";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const CURRENCY_OPTIONS = ["USD", "INR", "HBAR"];
const ACTION_OPTIONS = ["next", "skip", "download", "upload"];
const ACTION_TYPE_OPTIONS = ["button", "anchor link", "page link"];
const PROTECTED_FIELDS = ["Welcome Note", "Welcome Banner", "email", "full name", "badge template", "payment details"];

const SortableItem = ({ id, disabled, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: disabled ? 'default' : 'move'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
        >
            {children({ dragHandle: !disabled ? listeners : undefined })}
        </div>
    );
};

const labelToKey = (label) => {
    return label.toLowerCase().replace(/\s+/g, "_");
};

const generateUniqueKey = (label, existingKeys) => {
    let baseKey = labelToKey(label);
    let candidateKey = baseKey;
    let counter = 1;

    while (existingKeys.includes(candidateKey)) {
        candidateKey = `${baseKey}_${counter}`;
        counter++;
    }

    return candidateKey;
};

const FeatureSelection = ({ nextStep, prevStep, storeData }) => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState([]);
    const [selectedFeatureDetail, setSelectedFeatureDetail] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [combinedFields, setCombinedFields] = useState([]);
    const [nextActionField, setNextActionField] = useState({ value: [], action: [], section: [] });
    const [groupCategories, setGroupCategories] = useState([]);
    const [selectedFeatureId, setSelectedFeatureId] = useState(null);
    const [newGroupCategory, setNewGroupCategory] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingField, setUploadingField] = useState(null);
    const [sectionDetails, setSectionDetails] = useState({});
    const [newSectionInputs, setNewSectionInputs] = useState({});
    const [expandedFields, setExpandedFields] = useState({});
    const [availableActions, setAvailableActions] = useState(ACTION_OPTIONS);
    const [newActionInputs, setNewActionInputs] = useState({});
    const [filterGroup, setFilterGroup] = useState(null);
    const [uploading, setUploading] = useState(false);
    const sensors = useSensors(useSensor(PointerSensor));

    const allSections = useMemo(() => {
        const sections = new Set();
        Object.values(sectionDetails).forEach(groupSections => {
            groupSections.forEach(section => sections.add(section));
        });
        return Array.from(sections);
    }, [sectionDetails]);

    const isProtectedField = (field) => {
        return PROTECTED_FIELDS.includes(field.label);
    };

    const toggleFieldExpansion = (fieldKey) => {
        setExpandedFields(prev => ({
            ...prev,
            [fieldKey]: !prev[fieldKey]
        }));
    };

    const [fileName, setFileName] = useState("");

    console.log("fileName", fileName);


    const handleFileUpload = async (file, fieldKey, fileType) => {
        setUploadingField(fieldKey);
        try {
            let response;
            if (fileType === "image") {
                response = await profileAPIs.uploadImage({
                    file,
                    type: "feature_image",
                });
            } else {
                response = await profileAPIs.uploadVideo({
                    file,
                    fileType: fileType === "audio" ? "audio" : "video",
                });
            }
            setFileName(response?.data?.data?.[0]?.name || "");
            if (response?.data?.data?.[0]?.url) {
                const url = response.data.data[0].url;
                handleFieldChange(fieldKey, {
                    ...combinedFields.find((f) => f.key === fieldKey),
                    messageAttachment: url,
                    messageAttachmentType: file.type,
                });
                message.success(
                    `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} uploaded successfully`
                );
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            console.error("Upload error:", error);
            message.error(`Failed to upload ${fileType}`);
        } finally {
            setUploadingField(null);
        }
    };

    const handleDeleteGroup = (groupToDelete, e) => {
        e.stopPropagation();
        const updatedGroups = groupCategories.filter((g) => g !== groupToDelete);
        setGroupCategories(updatedGroups);

        const updatedSectionDetails = { ...sectionDetails };
        delete updatedSectionDetails[groupToDelete];
        setSectionDetails(updatedSectionDetails);

        if (nextActionField?.group === groupToDelete) {
            setNextActionField((prev) => ({ ...prev, group: undefined }));
        }
    };

    const handleDeleteAction = (actionKey) => {
        setNextActionField((prev) => ({
            ...prev,
            value: prev.value.filter((v) => v !== actionKey),
            action: prev.action.filter((a) => a.key !== actionKey),
        }));
    };

    const addSectionToGroup = (group) => {
        const section = newSectionInputs[group]?.trim();
        if (section) {
            setSectionDetails(prev => ({
                ...prev,
                [group]: [...(prev[group] || []), section]
            }));
            setNewSectionInputs(prev => ({ ...prev, [group]: '' }));
        }
    };

    const handleRemoveSection = (fieldKey, sectionName) => {
        const field = combinedFields.find(f => f.key === fieldKey);
        if (!field) return;

        let updatedField = { ...field };
        if (sectionName === 'responseMessage') updatedField.showResponseMessage = false;
        else if (sectionName === 'actions') updatedField.showActions = false;
        else if (sectionName === 'actionTypes') updatedField.showActionTypes = false;

        handleFieldChange(fieldKey, updatedField);
    };

    const addNewAction = (fieldKey) => {
        const newAction = newActionInputs[fieldKey]?.trim();
        if (newAction) {
            if (!availableActions.includes(newAction)) {
                setAvailableActions(prev => [...prev, newAction]);
            }

            const field = combinedFields.find(f => f.key === fieldKey);
            if (field) {
                const updatedActions = [...(field.action || []), newAction];
                handleFieldChange(fieldKey, { ...field, action: updatedActions });
            }
            setNewActionInputs(prev => ({ ...prev, [fieldKey]: '' }));
        }
    };

    const handleActionGroupChange = (actionKey, newGroup) => {
        setNextActionField((prev) => ({
            ...prev,
            action: prev.action.map((a) =>
                a.key === actionKey ? { ...a, group: newGroup } : a
            ),
        }));
    };

    const handleActionSectionChange = (actionKey, newSections) => {
        setNextActionField((prev) => ({
            ...prev,
            action: prev.action.map((a) =>
                a.key === actionKey ? { ...a, section: newSections } : a
            ),
        }));
    };

    const handleNextActionChange = (selectedActions) => {
        setNextActionField((prev) => {
            const currentActions = [...(prev.action || [])];
            selectedActions.forEach((key) => {
                if (!currentActions.some((a) => a.key === key)) {
                    currentActions.push({ key, position: "last" });
                }
            });
            const filteredActions = currentActions.filter((action) =>
                selectedActions.includes(action.key)
            );
            return {
                ...prev,
                value: selectedActions,
                action: filteredActions,
            };
        });
    };

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await axios.get(
                    `${auraYfretUserCollBaseUrl}/feature_collection/getsummary/`
                );
                if (res.data.status_code === 200) {
                    setSummary(res.data.data);
                } else {
                    message.error("Failed fetching summary");
                }
            } catch (error) {
                message.error("Failed fetching summary");
            }
        };
        fetchSummary();
    }, []);

    useEffect(() => {
        if (selectedFeatureDetail && Object.keys(selectedFeatureDetail).length > 0) {
            if (selectedFeatureDetail.group_category) {
                setGroupCategories(selectedFeatureDetail.group_category);
            }
            if (selectedFeatureDetail.section_details) {
                setSectionDetails(selectedFeatureDetail.section_details);
            }
            processAdminDetails(selectedFeatureDetail.admin_details);
        }
    }, [selectedFeatureDetail?._id]);

    const processAdminDetails = (adminDetails = []) => {
        const normal = [];
        const special = [];
        let nextAction = { value: [], action: [], section: [] };
        const initialExpandedFields = {};

        adminDetails.forEach((field) => {
            if (field.group && !Array.isArray(field.group)) {
                field.group = [field.group];
            }
            if (field.section && !Array.isArray(field.section)) {
                field.section = field.section ? [field.section] : [];
            }

            initialExpandedFields[field.key] = false;

            if (field.key === "next_action") {
                nextAction = {
                    ...field,
                    value: field.value || [],
                    action: field.action || [],
                    section: field.section || []
                };
            } else if (field.type === "object") {
                special.push(field);
            } else {
                field.showResponseMessage = field.response_message !== undefined;
                field.showActions = field.action !== undefined;
                field.showActionTypes = field.action_type !== undefined;
                normal.push(field);
            }
        });

        setExpandedFields(initialExpandedFields);
        setCombinedFields([...normal, ...special]);
        setNextActionField(nextAction);
    };

    const handleCreateClick = async () => {
        if (!selectedFeatureId) return;
        try {
            const res = await axios.get(
                `${auraYfretUserCollBaseUrl}/feature_collection/get/?feature_id=${selectedFeatureId}`
            );
            if (res.data.status === "success") {
                setSelectedFeatureDetail(res.data.data[0]);
                setIsCreating(true);
            }
        } catch {
            message.error("Failed fetching feature detail");
        }
    };

    const handleBack = () => {
        if (isCreating) {
            setIsCreating(false);
            setSelectedFeatureDetail(null);
            setCombinedFields([]);
            setSelectedFeatureId(null);
        } else {
            prevStep();
        }
    };

    const handleSkip = () => {
        navigate("/");
    };

    const handleSubmit = async () => {
        if (!selectedFeatureDetail) return;
        setIsSaving(true);

        try {
            const keyMap = {};
            const fieldsToUpdate = [];

            combinedFields.forEach(field => {
                if (field.__isNew && field.label) {
                    const existingKeys = combinedFields
                        .filter(f => !f.__isNew)
                        .map(f => f.key);
                    const newKey = generateUniqueKey(field.label, existingKeys);
                    keyMap[field.key] = newKey;
                    fieldsToUpdate.push({
                        oldKey: field.key,
                        newKey,
                        field: { ...field, key: newKey }
                    });
                }
            });

            const updatedCombinedFields = combinedFields.map(field => {
                const updatedField = fieldsToUpdate.find(f => f.oldKey === field.key);
                return updatedField ? updatedField.field : field;
            });

            let updatedNextActionField = nextActionField;
            if (nextActionField) {
                updatedNextActionField = {
                    ...nextActionField,
                    value: nextActionField.value.map(key => keyMap[key] || key),
                    action: nextActionField.action.map(action => ({
                        ...action,
                        key: keyMap[action.key] || action.key
                    })),
                    section: nextActionField.section || []
                };
            }

            const { _id, ...featureDetailWithoutId } = selectedFeatureDetail;

            const payload = {
                ...featureDetailWithoutId,
                store_id: storeData.store_id,
                store_name: storeData.store_name,
                user_id: storeData.user_id,
                user_name: storeData.user_name,
                creator_emailId: storeData.emailId,
                current_group: updatedNextActionField?.group,
                agent_url: { event_url: "", event_mapped_url: "", admin_url: "" },
                admin_details: [
                    ...updatedCombinedFields.map((field) => {
                        let cleanedField = { ...field };

                        if (field.key === "next_action") {
                            return {
                                ...cleanedField,
                                value: updatedNextActionField.value || [],
                                action: updatedNextActionField.action || [],
                                section: updatedNextActionField.section || []
                            };
                        }

                        if (field.is_user_input === false) {
                            delete cleanedField.response_message;
                            delete cleanedField.action;
                            delete cleanedField.action_type;
                        } else {
                            if (field.showResponseMessage === false) delete cleanedField.response_message;
                            if (field.showActions === false) delete cleanedField.action;
                            if (field.showActionTypes === false) delete cleanedField.action_type;
                        }

                        delete cleanedField.showResponseMessage;
                        delete cleanedField.showActions;
                        delete cleanedField.showActionTypes;
                        delete cleanedField.__isNew;
                        delete cleanedField.thumbnail;
                        delete cleanedField.messageAttachment;
                        delete cleanedField.messageAttachmentType;

                        if (field.group && Array.isArray(field.group) && field.group.length === 1) {
                            cleanedField.group = field.group[0];
                        }

                        return cleanedField;
                    }),
                    ...(updatedCombinedFields.some(f => f.key === "next_action") ? [] : [{
                        key: "next_action",
                        label: "next action",
                        type: "multi-select",
                        is_display: true,
                        is_user_input: false,
                        mandatory: false,
                        value: updatedNextActionField.value || [],
                        action: updatedNextActionField.action || [],
                    }])
                ],
                section_details: sectionDetails,
                group_category: groupCategories,
            };

            const response = await axios.post(
                `${auraYfretUserCollBaseUrl}/agent_collection/create/`,
                payload
            );

            if (response.data.status === "success") {
                message.success("Feature configuration saved successfully!");
                nextStep(payload);
            } else {
                message.error("Failed to save configuration: " + response.data.message);
            }
        } catch (error) {
            console.error("API Error:", error);
            message.error("Failed to save configuration. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleFieldChange = (key, newField) => {
        const normalizedField = {
            ...newField,
            group: Array.isArray(newField.group) ? newField.group :
                (newField.group ? [newField.group] : [])
        };

        setCombinedFields((prev) =>
            prev.map((f) => (f.key === key ? normalizedField : f))
        );

        setSelectedFeatureDetail((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                admin_details: prev.admin_details.map((field) => {
                    if (field.key === key) {
                        return {
                            ...field,
                            ...normalizedField,
                            is_display: field.is_display !== undefined ? field.is_display : true,
                            is_user_input: normalizedField.is_user_input !== undefined
                                ? normalizedField.is_user_input
                                : field.is_user_input,
                            mandatory: normalizedField.mandatory !== undefined
                                ? normalizedField.mandatory
                                : field.mandatory,
                        };
                    }
                    return field;
                }),
            };
        });
    };

    const removeField = (key) => {
        setCombinedFields((prev) => prev.filter((f) => f.key !== key));
        setSelectedFeatureDetail((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                admin_details: prev.admin_details.filter((field) => field.key !== key),
            };
        });
    };

    const addGroupCategory = () => {
        const trimmed = newGroupCategory.trim();
        if (trimmed && !groupCategories.includes(trimmed)) {
            setGroupCategories([...groupCategories, trimmed]);
            setSectionDetails(prev => ({
                ...prev,
                [trimmed]: []
            }));
            setNewGroupCategory("");
        }
    };

    const addNewField = () => {
        const existingKeys = combinedFields.map(f => f.key);
        const tempKey = `new_field_${Date.now()}`;

        const newField = {
            key: tempKey,
            label: "",
            type: "text",
            message: "",
            response_message: "",
            action: [],
            action_type: [],
            is_display: true,
            is_user_input: true,
            mandatory: false,
            __isNew: true,
            showResponseMessage: true,
            showActions: true,
            showActionTypes: true,
            group: groupCategories.length > 0 ? [filterGroup] : [],
            section: []
        };

        setCombinedFields((prev) => [...prev, newField]);
        setExpandedFields(prev => ({ ...prev, [tempKey]: true }));
    };

    const hasGroupCategories = groupCategories.length > 0;

    const renderFieldEditor = (field, onChange, onDelete, dragHandle) => {
        if (field.key === "custom_details") return null;

        const isSelect = field.type === "select" || field.type === "multi-select";
        const multiMode = field.type === "multi-select";
        const hasMessageField = field.message !== undefined;
        const hasResponseMessage = field.response_message !== undefined;
        const hasPaymentDetails = field.label === "payment details";
        const isExpanded = expandedFields[field.key];
        const isProtected = isProtectedField(field);

        const groupArray = Array.isArray(field.group) ? field.group :
            (field.group ? [field.group] : []);

        return (
            <div className='bg-white rounded shadow p-6 mb-6'>
                <Row gutter={[16, 16]}>
                    <Col span={24} className='flex justify-between items-center mb-2'>
                        <div className="flex items-center">
                            {!isProtected && (
                                <span {...dragHandle} className='cursor-move mr-2'>
                                    <MenuOutlined />
                                </span>
                            )}
                            <Button
                                type="text"
                                icon={isExpanded ? <MinusOutlined /> : <DownOutlined />}
                                onClick={() => toggleFieldExpansion(field.key)}
                                className="mr-2"
                            />
                            {!isProtected ? (
                                <Input
                                    placeholder="Field Label"
                                    value={field.label || ''}
                                    onChange={e => onChange({ ...field, label: e.target.value })}
                                    style={{ width: 200 }}
                                />
                            ) : (
                                <Title level={4} className="mb-0 text-gray-800 font-semibold">
                                    {field.label}
                                </Title>
                            )}
                        </div>
                        {!isProtected && (
                            <Button
                                type='text'
                                danger
                                icon={<CloseOutlined />}
                                onClick={onDelete}
                            />
                        )}
                    </Col>

                    {isExpanded && (
                        <>
                            <>
                                <Col span={24}>
                                    <Title level={5}>Groups</Title>
                                    <Select
                                        mode="multiple"
                                        placeholder="Select group(s)"
                                        value={groupArray.filter((g) => groupCategories.includes(g))} // only valid groups
                                        onChange={(groups) =>
                                            onChange({ ...field, group: groups, section: [] })
                                        }
                                        size="large"
                                        style={{ width: "100%" }}
                                    >
                                        {groupCategories.map((group) => (
                                            <Option key={group} value={group}>
                                                {group}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                                {/* {groupArray.length > 0 && (
                                        <Col span={24}>
                                            <Title level={5}>Sections</Title>
                                            <Select
                                                mode="multiple"
                                                placeholder="Select section(s)"
                                                value={field.section || []}
                                                onChange={(sections) => onChange({ ...field, section: sections })}
                                                size='large'
                                                style={{ width: "100%" }}
                                            >
                                                {groupArray.flatMap(groupName => {
                                                    const groupSections = sectionDetails[groupName] || [];
                                                    return groupSections.map(section => (
                                                        <Option key={`${groupName}-${section}`} value={section}>
                                                            {section}
                                                        </Option>
                                                    ));
                                                })}
                                            </Select>
                                        </Col>
                                    )} */}
                            </>

                            {hasMessageField && !hasPaymentDetails && (
                                <Col span={24}>
                                    <Row style={{ marginBottom: "10px" }} justify="space-between" align="middle">
                                        <Title level={5}>Display Message</Title>
                                        <Upload
                                            beforeUpload={async (file) => {
                                                const fileType = file.type.split("/")[0];
                                                // spinner ON for this field
                                                setUploadingField(field.key);

                                                try {
                                                    const minDelay = new Promise((resolve) => setTimeout(resolve, 2000));

                                                    await Promise.all([
                                                        handleFileUpload(file, field.key, fileType),
                                                        minDelay
                                                    ]);
                                                } catch (err) {
                                                    console.error("Upload error", err);
                                                } finally {
                                                    // spinner OFF
                                                    setUploadingField(null);
                                                }

                                                return false;
                                            }}
                                            showUploadList={false}
                                            accept="image/*,video/*,audio/*"
                                        >
                                            <Button
                                                icon={uploadingField === field.key ? <LoadingOutlined /> : <UploadOutlined />}
                                                loading={uploadingField === field.key}
                                            >
                                                {field.messageAttachment ? "Replace file" : "Attach file"}
                                            </Button>
                                        </Upload>
                                    </Row>

                                    {field.messageAttachment && (
                                        <div className="attachment-preview" style={{ marginBottom: "10px" }}>
                                            {uploadingField === field.key ? (
                                                <div
                                                    style={{
                                                        width: "150px",
                                                        height: "150px",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Spin
                                                        size="large"
                                                        indicator={
                                                            <LoadingOutlined style={{ fontSize: 32, color: "#52c41a" }} spin />
                                                        }
                                                    />
                                                </div>
                                            ) : field.messageAttachmentType?.startsWith("image/") ? (
                                                <div style={{ position: "relative", display: "inline-block", right: "0" }}>
                                                    <img
                                                        src={field.messageAttachment}
                                                        alt="Attachment preview"
                                                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                                    />
                                                    <Button
                                                        type="text"
                                                        danger
                                                        icon={<CloseOutlined />}
                                                        style={{ position: "absolute", top: 0, right: 0 }}
                                                        onClick={() => {
                                                            onChange({
                                                                ...field,
                                                                messageAttachment: null,
                                                                messageAttachmentType: null,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div style={{ position: "relative", display: "inline-block" }}>
                                                    <Text>
                                                        Attachment:{" "}
                                                        {decodeURIComponent(field.messageAttachment.split("/").pop())}
                                                    </Text>
                                                    <Button
                                                        type="text"
                                                        danger
                                                        icon={<CloseOutlined />}
                                                        onClick={() => {
                                                            onChange({
                                                                ...field,
                                                                messageAttachment: null,
                                                                messageAttachmentType: null,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <TextArea
                                        placeholder="Write the Display Message"
                                        value={field.message}
                                        onChange={(e) => onChange({ ...field, message: e.target.value })}
                                        size="large"
                                        autoSize={{ minRows: 2, maxRows: 6 }}
                                    />
                                </Col>
                            )}

                            <Col span={24}>
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Space direction="vertical" size={4}>
                                            {/* <Text strong>User Type</Text> */}
                                            <Radio.Group
                                                value={field.is_user_input}
                                                onChange={(e) => {
                                                    const isUserInput = e.target.value;
                                                    onChange({
                                                        ...field,
                                                        is_user_input: isUserInput,
                                                        mandatory: isUserInput ? field.mandatory : false
                                                    });
                                                }}
                                            >
                                                <Space direction="vertical">
                                                    <Radio value={false}>Announcement</Radio>
                                                    <Radio value={true}>Question</Radio>
                                                </Space>
                                            </Radio.Group>
                                        </Space>
                                    </Col>

                                    {field.is_user_input && (
                                        <Col span={12}>
                                            <Space direction="vertical" size={4}>
                                                <Text strong>Mandatory</Text>
                                                <Switch
                                                    checked={field.mandatory}
                                                    onChange={(m) => onChange({ ...field, mandatory: m })}
                                                />
                                            </Space>
                                        </Col>
                                    )}
                                </Row>
                            </Col>

                            {!isProtected && (
                                <Col span={24}>
                                    <Title level={5}>User Input Type</Title>
                                    <Select
                                        placeholder='Select field type'
                                        value={field.type}
                                        onChange={(t) =>
                                            onChange({
                                                ...field,
                                                type: t,
                                                options: [],
                                                value: t === "multi-select" ? [] : "",
                                                message: field.message || "",
                                                response_message: field.response_message || "",
                                            })
                                        }
                                        size='large'
                                        style={{ width: "100%" }}>
                                        {[
                                            "text",
                                            "number",
                                            "upload file",
                                            "select",
                                            "multi-select",
                                            "boolean",
                                        ].map((t) => (
                                            <Option key={t} value={t}>
                                                {t}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                            )}

                            {/* {(field.type === "image" ||
                                field.type === "video" ||
                                field.type === "audio") && (
                                    <Col span={24} className='mt-4'>
                                        <Title level={5}>
                                            {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
                                        </Title>

                                                <Upload
                                                    beforeUpload={(file) => {
                                                        handleFileUpload(file, field.key, field.type);
                                                        return false;
                                                    }}
                                                    showUploadList={false}>
                                                    <Button
                                                        icon={
                                                            uploadingField === field.key ? (
                                                                <LoadingOutlined />
                                                            ) : (
                                                                <UploadOutlined />
                                                            )
                                                        }
                                                        disabled={uploadingField === field.key}>
                                                        {field.value
                                                            ? ` change ${field.type}`
                                                            : `Upload ${field.type}`}
                                                    </Button>
                                                </Upload>

                                        {field.value && (
                                            <div className='mt-2'>
                                                <Text strong className='block mb-1'>
                                                    Preview:
                                                </Text>
                                                {field.type === "image" ? (
                                                    <img
                                                        src={field.value}
                                                        alt='Uploaded content'
                                                        className='max-w-full h-auto max-h-40 object-contain border rounded'
                                                    />
                                                ) : (
                                                    <div className='mt-2'>
                                                        <a
                                                            href={field.value}
                                                            target='_blank'
                                                            rel='noopener noreferrer'
                                                            className='text-blue-500 underline'>
                                                            View {field.type}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Col>
                                )} */}

                            {isSelect && (
                                <Col span={24}>
                                    <Title level={5}>Create Your Options</Title>
                                    <Select
                                        mode={multiMode ? "multiple" : undefined}
                                        placeholder={`Choose ${field.label}`}
                                        className='mutliSelect-antd'
                                        value={field.value}
                                        onChange={(val) => onChange({ ...field, value: val })}
                                        size='large'
                                        style={{ width: "100%" }}
                                        suffixIcon={null}
                                        dropdownRender={(menu) => (
                                            <>
                                                {field.options?.length > 0 && (
                                                    <div className="select-options-container">
                                                        {field.options.map((opt) => (
                                                            <div
                                                                key={opt}
                                                                className="select-option-item"
                                                                onClick={() => {
                                                                    if (multiMode) {
                                                                        const newValue = field.value.includes(opt)
                                                                            ? field.value.filter((v) => v !== opt)
                                                                            : [...field.value, opt];
                                                                        onChange({ ...field, value: newValue });
                                                                    } else {
                                                                        onChange({ ...field, value: opt });
                                                                    }
                                                                }}>
                                                                <span>{opt}</span>
                                                                <Button
                                                                    type='text'
                                                                    danger
                                                                    size='small'
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        const newOpts = field.options.filter(
                                                                            (o) => o !== opt
                                                                        );
                                                                        const newVal = multiMode
                                                                            ? (field.value || []).filter((v) => v !== opt)
                                                                            : field.value === opt
                                                                                ? undefined
                                                                                : field.value;
                                                                        onChange({
                                                                            ...field,
                                                                            options: newOpts,
                                                                            value: newVal,
                                                                        });
                                                                    }}>
                                                                    ❌
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="select-add-option">
                                                    <Input
                                                        placeholder='Add option'
                                                        value={field.newOption || ""}
                                                        onChange={(e) =>
                                                            onChange({ ...field, newOption: e.target.value })
                                                        }
                                                        onPressEnter={() => {
                                                            const opt = field.newOption?.trim();
                                                            if (opt && !(field.options || []).includes(opt)) {
                                                                const newOpts = [...(field.options || []), opt];
                                                                onChange({
                                                                    ...field,
                                                                    options: newOpts,
                                                                    value: multiMode
                                                                        ? [...(field.value || []), opt]
                                                                        : opt,
                                                                });
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        type='link'
                                                        onClick={() => {
                                                            const opt = field.newOption?.trim();
                                                            if (opt && !(field.options || []).includes(opt)) {
                                                                const newOpts = [...(field.options || []), opt];
                                                                onChange({
                                                                    ...field,
                                                                    options: newOpts,
                                                                    value: multiMode
                                                                        ? [...(field.value || []), opt]
                                                                        : opt,
                                                                });
                                                            }
                                                        }}>
                                                        Add
                                                    </Button>
                                                </div>
                                            </>
                                        )}>
                                        {(field.options || []).map((opt) => (
                                            <Option key={opt} value={opt}>
                                                {opt}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                            )}

                            {field.type === "object" && (
                                <>
                                    <Col span={24}>
                                        <Select
                                            placeholder={`Select ${field.label}`}
                                            value={field.selectedOption}
                                            onChange={(o) => onChange({ ...field, selectedOption: o })}
                                            size='large'
                                            style={{ width: "100%" }}>
                                            {Object.keys(field.value).map((k) => (
                                                <Option key={k} value={k}>
                                                    {k}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Col>

                                    {field.selectedOption && (
                                        <>
                                            <Col span={24}>
                                                <Title level={5}>
                                                    {field.value[field.selectedOption].label}
                                                </Title>
                                                <Input
                                                    placeholder={field.value[field.selectedOption].label}
                                                    value={field.value[field.selectedOption].value}
                                                    onChange={(e) => {
                                                        const f = { ...field };
                                                        f.value[field.selectedOption].value = e.target.value;
                                                        onChange(f);
                                                    }}
                                                    size='large'
                                                    type={
                                                        field.value[field.selectedOption].type === "number"
                                                            ? "number"
                                                            : "text"
                                                    }
                                                />
                                            </Col>

                                            {field.value[field.selectedOption].message !== undefined && (
                                                <Col span={24}>
                                                    <TextArea
                                                        placeholder='Display Message'
                                                        value={field.value[field.selectedOption].message}
                                                        onChange={(e) => {
                                                            const f = { ...field };
                                                            f.value[field.selectedOption].message =
                                                                e.target.value;
                                                            onChange(f);
                                                        }}
                                                        size='large'
                                                        autoSize={{ minRows: 2, maxRows: 6 }}
                                                    />
                                                </Col>
                                            )}

                                            {field.value[field.selectedOption].currency !== undefined && (
                                                <Col span={24}>
                                                    <Select
                                                        placeholder='Currency'
                                                        value={field.value[field.selectedOption].currency}
                                                        onChange={(c) => {
                                                            const f = { ...field };
                                                            f.value[field.selectedOption].currency = c;
                                                            onChange(f);
                                                        }}
                                                        style={{ width: "100%" }}
                                                        size='large'>
                                                        <Option value='' disabled>
                                                            Select currency
                                                        </Option>

                                                        {CURRENCY_OPTIONS.map((c) => (
                                                            <Option key={c} value={c}>
                                                                {c}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Col>
                                            )}
                                        </>
                                    )}
                                </>
                            )}

                            {field.is_user_input === true && field.showResponseMessage && !isProtected && (
                                <Col span={24}>
                                    <div className="flex justify-between items-center">
                                        <Title level={5}>Acknowledgement to the user response</Title>
                                        <Button
                                            type="text"
                                            icon={<CloseOutlined />}
                                            onClick={() => handleRemoveSection(field.key, 'responseMessage')}
                                        />
                                    </div>
                                    <TextArea
                                        placeholder='This appears after the user has responded to your question'
                                        value={field.response_message}
                                        onChange={(e) =>
                                            onChange({ ...field, response_message: e.target.value })
                                        }
                                        size='large'
                                        autoSize={{ minRows: 2, maxRows: 6 }}
                                    />
                                </Col>
                            )}

                            {field.showActions && (
                                <Col span={24}>
                                    <div className="flex justify-between items-center">
                                        <Title level={5}>Action label</Title>
                                        <Button
                                            type="text"
                                            icon={<CloseOutlined />}
                                            onClick={() => handleRemoveSection(field.key, 'actions')}
                                        />
                                    </div>
                                    <div className='mb-4'>
                                        <Select
                                            mode="multiple"
                                            placeholder="Select actions"
                                            value={field.action || []}
                                            onChange={(actions) => onChange({ ...field, action: actions })}
                                            style={{ width: "100%" }}
                                            size="large"
                                            dropdownRender={(menu) => (
                                                <div>
                                                    {menu}
                                                    <div style={{ padding: '8px', display: 'flex' }}>
                                                        <Input
                                                            value={newActionInputs[field.key] || ''}
                                                            onChange={(e) => setNewActionInputs(prev => ({
                                                                ...prev,
                                                                [field.key]: e.target.value
                                                            }))}
                                                            onPressEnter={() => addNewAction(field.key)}
                                                            placeholder="Add new action"
                                                        />
                                                        <Button
                                                            type="primary"
                                                            onClick={() => addNewAction(field.key)}
                                                            style={{ marginLeft: 8 }}
                                                        >
                                                            Add
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        >
                                            {availableActions.map((action) => (
                                                <Option key={action} value={action}>
                                                    {action}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                </Col>
                            )}

                            {field.showActionTypes && (
                                <Col span={24}>
                                    <div className="flex justify-between items-center">
                                        <Title level={5}>Action Element</Title>
                                        <Button
                                            type="text"
                                            icon={<CloseOutlined />}
                                            onClick={() => handleRemoveSection(field.key, 'actionTypes')}
                                        />
                                    </div>
                                    <div className='mb-4'>
                                        <Select
                                            mode='select'
                                            placeholder='Select action types'
                                            value={field.action_type || []}
                                            onChange={(actionTypes) => onChange({ ...field, action_type: actionTypes })}
                                            style={{ width: "100%" }}
                                            size='large'>
                                            {ACTION_TYPE_OPTIONS.map((type) => (
                                                <Option key={type} value={type}>
                                                    {type}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                </Col>
                            )}
                        </>
                    )}
                </Row>
            </div>
        );
    };

    return (
        <div className=' min-h-screen py-10 px-6 xl:px-44 lg:px-28'>
            <Row className='mb-6'>
                <Col span={24} className='flex justify-between'>
                    <Button type='primary' onClick={handleBack}>
                        Back
                    </Button>

                    <div className='flex gap-2'>
                        <Button type='primary' onClick={handleSkip} >
                            Skip
                        </Button>
                        <Button type='primary' loading={isSaving} onClick={handleSubmit}>
                            Continue
                        </Button>
                    </div>
                </Col>
            </Row>

            {!isCreating ? (
                <div className='bg-white p-6 rounded-lg shadow-md'>
                    <Title level={3} className='mb-4'>
                        Select Feature
                    </Title>

                    <Select
                        style={{ width: "100%" }}
                        placeholder='Select feature'
                        onChange={setSelectedFeatureId}
                        value={selectedFeatureId}
                        size='large'>
                        {summary.map((f) => (
                            <Option key={f.feature_id} value={f.feature_id}>
                                {f.feature_name}
                            </Option>
                        ))}
                    </Select>

                    <Row gutter={16} className='mt-4'>
                        <Col span={12}>
                            <Button
                                type='primary'
                                block
                                onClick={handleCreateClick}
                                disabled={!selectedFeatureId}
                                size='large'>
                                Create
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button
                                type='default'
                                block
                                disabled={true}
                                style={{ cursor: "not-allowed", opacity: 0.6 }}
                                size='large'>
                                View
                            </Button>
                        </Col>
                    </Row>
                </div>
            ) : (
                <>
                    <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
                        <Title level={4} className='mb-4 text-center'>
                            Event Information
                        </Title>

                        <div className='mb-4'>
                            <Title level={5} >
                                Event Name<span className="ml-1 text-red-600">*</span>
                            </Title>
                            <Input
                                value={selectedFeatureDetail?.service_name || ""}
                                placeholder='Event name'
                                onChange={(e) => {
                                    setSelectedFeatureDetail((prev) => ({
                                        ...prev,
                                        service_name: e.target.value,
                                    }));
                                }}
                                size='large'
                            />
                        </div>

                        <>
                            <div className='mb-4'>
                                <Title level={5} strong className='block mb-2'>
                                    Add Group
                                </Title>
                                <Select
                                    placeholder='Select group'
                                    value={nextActionField?.group}
                                    onChange={(group) =>
                                        setNextActionField((prev) => ({ ...prev, group }))
                                    }
                                    size='large'
                                    style={{ width: "100%" }}
                                    dropdownRender={() => (
                                        <>
                                            <div className='custom-options-container'>
                                                {groupCategories.map((group) => (
                                                    <div
                                                        key={group}
                                                        className='ant-select-item ant-select-item-option'
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            padding: "8px 12px",
                                                        }}>
                                                        <span
                                                            style={{ flex: 1, cursor: "pointer" }}
                                                            onClick={() =>
                                                                setNextActionField((prev) => ({
                                                                    ...prev,
                                                                    group,
                                                                }))
                                                            }>
                                                            {group}
                                                        </span>
                                                        <Button
                                                            type='text'
                                                            danger
                                                            icon={<CloseOutlined />}
                                                            onClick={(e) => handleDeleteGroup(group, e)}
                                                            className='delete-btn'
                                                            style={{ fontSize: "12px" }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ display: "flex", padding: 8 }}>
                                                <Input
                                                    value={newGroupCategory}
                                                    onChange={(e) => setNewGroupCategory(e.target.value)}
                                                    style={{ flex: "auto" }}
                                                    placeholder='Add new group'
                                                />
                                                <Button
                                                    type='link'
                                                    onClick={addGroupCategory}
                                                    icon={<PlusOutlined />}>
                                                    Add
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                />
                            </div>

                            <div className='mb-4'>
                                <Title level={5} strong className='block mb-2'>
                                    Filter by Group
                                </Title>
                                <Select
                                    placeholder='Select group to filter'
                                    value={filterGroup || "all"}
                                    onChange={(group) => setFilterGroup(group === "all" ? null : group)}
                                    size='large'
                                    style={{ width: "100%" }}
                                >
                                    <Option key="all" value="all">
                                        All
                                    </Option>
                                    {groupCategories.map((group) => (
                                        <Option key={group} value={group}>
                                            {group}
                                        </Option>
                                    ))}
                                </Select>
                            </div>


                            {
                                hasGroupCategories && (
                                    <div className='mb-4'>
                                        <Title level={5} strong className='block mb-2'>
                                            Active Group
                                        </Title>
                                        <Radio.Group
                                            value={nextActionField?.group || null}
                                            onChange={(e) => {
                                                const newGroup = e.target.value;
                                                setNextActionField((prev) => ({ ...prev, group: newGroup }));
                                            }}
                                            style={{ width: "100%" }}
                                        >
                                            <Space direction="vertical">
                                                {groupCategories.map((group) => (
                                                    <Radio key={group} value={group}>
                                                        {group}
                                                    </Radio>
                                                ))}
                                                <Radio value={null} style={{ display: 'none' }} />
                                            </Space>
                                        </Radio.Group>
                                    </div>
                                )
                            }
                        </>

                        {/* {hasGroupCategories && (
                            <div className='mt-6'>
                                <Title strong level={5} className='mb-4'>
                                    Event Stage Management
                                </Title>

                                {groupCategories.map((group) => (
                                    <div key={group} className='mb-4'>
                                        <div className='flex justify-between items-center mb-2'>
                                            <Text strong>{group}</Text>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <Select
                                                mode='tags'
                                                style={{ flex: 1 }}
                                                placeholder='Add sections'
                                                value={sectionDetails[group] || []}
                                                onChange={(newSections) => {
                                                    setSectionDetails(prev => ({
                                                        ...prev,
                                                        [group]: newSections
                                                    }));
                                                }}
                                                size='large'
                                                tokenSeparators={[',']}
                                            />
                                            <Button
                                                type='primary'
                                                onClick={() => {
                                                    const input = newSectionInputs[group]?.trim();
                                                    if (input) {
                                                        setSectionDetails(prev => ({
                                                            ...prev,
                                                            [group]: [...(prev[group] || []), input]
                                                        }));
                                                        setNewSectionInputs(prev => ({ ...prev, [group]: '' }));
                                                    }
                                                }}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )} */}
                    </div>

                    {selectedFeatureDetail?.feature_name && (
                        <Title level={4} className='mb-4 text-center uppercase text-white'>
                            {selectedFeatureDetail.feature_name} Fields
                        </Title>
                    )}

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={({ active, over }) => {
                            if (active.id !== over?.id) {
                                setCombinedFields((prev) => {
                                    const oldIndex = prev.findIndex((f) => f.key === active.id);
                                    const newIndex = prev.findIndex((f) => f.key === over.id);

                                    if (isProtectedField(prev[oldIndex]) || isProtectedField(prev[newIndex])) {
                                        return prev;
                                    }
                                    return arrayMove(prev, oldIndex, newIndex);
                                });
                            }
                        }}>
                        <SortableContext
                            items={combinedFields.map((f) => f.key)}
                            strategy={verticalListSortingStrategy}>
                            {combinedFields
                                .filter(field => {
                                    if (!filterGroup) return true;
                                    const fieldGroups = Array.isArray(field.group) ? field.group :
                                        (field.group ? [field.group] : []);
                                    return fieldGroups.includes(filterGroup);
                                })
                                .map((fld) => {
                                    const isProtected = isProtectedField(fld);
                                    return (
                                        <SortableItem key={fld.key} id={fld.key} disabled={isProtected}>
                                            {({ dragHandle }) => (
                                                <Col span={24}>
                                                    {renderFieldEditor(
                                                        fld,
                                                        (f) => handleFieldChange(fld.key, f),
                                                        () => removeField(fld.key),
                                                        dragHandle
                                                    )}
                                                </Col>
                                            )}
                                        </SortableItem>
                                    );
                                })}
                        </SortableContext>
                    </DndContext>

                    <Col span={24} className='mb-6'>
                        <Button
                            type='dashed'
                            icon={<PlusOutlined />}
                            block
                            onClick={addNewField}>
                            Add New Field
                        </Button>
                    </Col>

                    {nextActionField && (
                        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
                            <Title level={4} className='mb-4'>
                                Next Action Configuration
                            </Title>

                            <div className='mb-4'>
                                <Text strong className='block mb-2'>
                                    Selected Next Actions
                                </Text>
                                <Select
                                    mode='multiple'
                                    size='large'
                                    style={{ width: "100%" }}
                                    placeholder='Choose next actions'
                                    value={nextActionField.value || []}
                                    onChange={handleNextActionChange}
                                    optionLabelProp='label'>
                                    {combinedFields
                                        .filter((f) => f.key !== "custom_details")
                                        .map((field) => (
                                            <Option
                                                key={field.key}
                                                value={field.key}
                                                label={field.label || field.key}>
                                                {field.label || field.key}
                                            </Option>
                                        ))}
                                </Select>
                            </div>

                            <div className='mb-6'>
                                <Text strong className='block mb-2'>
                                    Configured Actions
                                </Text>
                                <div className='space-y-4'>
                                    {nextActionField.action.map((action) => {
                                        const actionField = combinedFields.find(
                                            (f) => f.key === action.key
                                        );
                                        const displayLabel = actionField?.label || action.key;

                                        return (
                                            <div
                                                key={action.key}
                                                className='bg-gray-50 p-4 rounded-lg'>
                                                <div className='flex justify-between items-center mb-2'>
                                                    <Text strong>{displayLabel}</Text>
                                                    <Button
                                                        type='text'
                                                        danger
                                                        icon={<CloseOutlined />}
                                                        onClick={() => handleDeleteAction(action.key)}
                                                    />
                                                </div>

                                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                                    <div>
                                                        <Text className='block mb-1'>Position:</Text>
                                                        <Select
                                                            value='last'
                                                            disabled
                                                            style={{ width: "100%" }}>
                                                            <Option value='last'>Last</Option>
                                                        </Select>
                                                    </div>

                                                    {hasGroupCategories && (
                                                        <div>
                                                            <Text className='block mb-1'>
                                                                Event Stage
                                                            </Text>
                                                            <Select
                                                                value={action.group}
                                                                onChange={(value) =>
                                                                    handleActionGroupChange(action.key, value)
                                                                }
                                                                style={{ width: "100%" }}>
                                                                {groupCategories.map((group) => (
                                                                    <Option key={group} value={group}>
                                                                        {group}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        </div>
                                                    )}

                                                    {/* {hasGroupCategories && action.group && (
                                                        <div>
                                                            <Text className='block mb-1'>
                                                                Section (Optional):
                                                            </Text>
                                                            <Select
                                                                mode="multiple"
                                                                value={action.section || []}
                                                                onChange={(value) =>
                                                                    handleActionSectionChange(action.key, value)
                                                                }
                                                                style={{ width: "100%" }}>
                                                                {sectionDetails[action.group]?.map(section => (
                                                                    <Option key={`${action.group}-${section}`} value={section}>
                                                                        {section}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        </div>
                                                    )} */}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FeatureSelection;