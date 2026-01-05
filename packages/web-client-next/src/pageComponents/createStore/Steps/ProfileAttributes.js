import React, { useEffect, useMemo, useState } from "react";
import { Card, Tag, Row, Col, Typography, Button, Popconfirm, Checkbox, Menu, Dropdown, message } from "antd";
import { CloseOutlined, DownOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Select } from 'antd';
import { current_store_name } from "../../../constants/config";
import { STORE_USER_NAME_FASHIONDEMO, STORE_USER_NAME_GOLDSURA } from "../../../constants/codes";
import { useDispatch } from "react-redux";
import { getStoredAttributes, updateAttributePool, updateStoredAttributePool } from "../redux/action";

const { Option } = Select;
const { Title } = Typography;

const AttributeCard = ({
    title,
    attributes = {},
    isAddButtonShowMasterPool,
    onExportTags,
    sourcePool,
    onDeleteTags,
    isEditable,
    dispatch,
    selectedPool1,
    selectedPool2,
    attributePoolData,
    selectedTags: externalSelectedTags,
    setSelectedTags: externalSetSelectedTags,
    onAddToMasterPool,
    activeMasterPoolKey,
    setActiveMasterPoolKey
}) => {
    const [attributeData, setAttributeData] = useState(attributes);
    const [expandedKeys, setExpandedKeys] = useState({});
    const [internalSelectedTags, setInternalSelectedTags] = useState(new Set());
    const [selectedKeys, setSelectedKeys] = useState(new Set());
    const [newTagInputs, setNewTagInputs] = useState({});
    const [visibleAddInputKeys, setVisibleAddInputKeys] = useState({});

    // Use external selected tags if provided (for catalog/collections), otherwise use internal state (for master pool)
    const selectedTags = externalSelectedTags || internalSelectedTags;
    const setSelectedTags = externalSetSelectedTags || setInternalSelectedTags;

    const toggleAddInputVisibility = (key, subKey = null) => {
        const fullKey = subKey ? `${key}.${subKey}` : key;
        setVisibleAddInputKeys((prev) => ({
            ...prev,
            [fullKey]: !prev[fullKey],
        }));
    };

    useEffect(() => {
        setAttributeData(attributes);
    }, [attributes]);

    const normalizeAttributeValues = (values) => {
        if (Array.isArray(values) && values.length && Array.isArray(values[0])) {
            return values.flat();
        }

        if (typeof values === 'object' && !Array.isArray(values)) {
            const normalized = {};
            for (const [subKey, val] of Object.entries(values)) {
                normalized[subKey] = Array.isArray(val[0]) ? val.flat() : val;
            }
            return normalized;
        }
        return values;
    };

    const handleRemoveKey = (key) => {
        const updatedData = { ...attributeData };
        delete updatedData[key];
        setAttributeData(updatedData);
    };

    const handleRemoveSubKey = (key, subKey) => {
        const updatedData = { ...attributeData };
        if (updatedData[key]) {
            delete updatedData[key][subKey];
            if (Object.keys(updatedData[key]).length === 0) {
                delete updatedData[key];
            }
        }
        setAttributeData(updatedData);
    };

    const toggleExpand = (key) => {
        setExpandedKeys((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
        setVisibleAddInputKeys({})
        setSelectedKeys(new Set());
        setSelectedTags(new Set());
    };

    const toggleSubExpand = (key, subKey) => {
        const uniqueKey = `${key}.${subKey}`;
        setExpandedKeys((prev) => ({
            ...prev,
            [uniqueKey]: !prev[uniqueKey],
        }));
        setVisibleAddInputKeys({})
        setSelectedKeys(new Set());
        setSelectedTags(new Set());
    };

    const toggleSelectTag = (key, value) => {
        if (isEditable || sourcePool === 'catalog' || sourcePool === 'collection') {
            const tagKey = `${key}:${value}`;
            setSelectedTags((prevSelectedTags) => {
                const newTags = new Set(prevSelectedTags);
                if (newTags.has(tagKey)) {
                    newTags.delete(tagKey);
                } else {
                    newTags.add(tagKey);
                }
                return newTags;
            });
        }
    };

    const isAllSelectedUnderKey = (key, values) => {
        const getFormattedTags = () => {
            if (Array.isArray(values)) {
                return values.map(val => `${key}:${val}`);
            } else {
                return Object.values(values).flat().map(val => `${key}:${val}`);
            }
        };

        const tagsToCheck = getFormattedTags();

        if (!tagsToCheck.length || selectedTags.size === 0) {
            return false;
        }

        return tagsToCheck.every(tag => selectedTags.has(tag));
    };

    const toggleSelectKey = (key, values) => {
        setSelectedKeys((prevSelectedKeys) => {
            const newKeys = new Set(prevSelectedKeys);
            const newTags = new Set(selectedTags);

            const getFormattedTags = (key, values) => {
                if (Array.isArray(values)) {
                    return values.map(value => `${key}:${value}`);
                } else {
                    return Object.values(values).flat().map(value => `${key}:${value}`);
                }
            };

            const formattedTags = getFormattedTags(key, values);

            if (newKeys.has(key)) {
                newKeys.delete(key);
                formattedTags.forEach((tag) => newTags.delete(tag));
            } else {
                newKeys.add(key);
                formattedTags.forEach((tag) => newTags.add(tag));
            }

            setSelectedTags(newTags);
            return newKeys;
        });
    };

    const handleInputChange = (key, subKey, value) => {
        const inputKey = subKey ? `${key}.${subKey}` : key;
        setNewTagInputs((prev) => ({
            ...prev,
            [inputKey]: value
        }));
    };

    const handleAddNewTag = (key, subKey) => {
        const inputKey = subKey ? `${key}.${subKey}` : key;
        const newTag = newTagInputs[inputKey]?.trim();
        if (!newTag) return;

        const updatedData = { ...attributeData };

        if (subKey) {
            if (!updatedData[key][subKey].includes(newTag)) {
                updatedData[key][subKey].push(newTag);
            }
        } else {
            if (!updatedData[key].includes(newTag)) {
                updatedData[key].push(newTag);
            }
        }

        setAttributeData(updatedData);
        setNewTagInputs((prev) => ({
            ...prev,
            [inputKey]: ""
        }));
    };

    const toggleSelectSubKey = (key, subKey, values) => {
        const uniqueKey = `${key}.${subKey}`;
        setSelectedKeys((prevSelectedKeys) => {
            const newKeys = new Set(prevSelectedKeys);
            const newTags = new Set(selectedTags);

            if (newKeys.has(uniqueKey)) {
                newKeys.delete(uniqueKey);
                values.forEach((value) => newTags.delete(`${key}:${value}`));
            } else {
                newKeys.add(uniqueKey);
                values.forEach((value) => newTags.add(`${key}:${value}`));
            }

            setSelectedTags(newTags);
            return newKeys;
        });
    };

    const getSubMenu = (key) => {
        const menuItems = [
            {
                label: "Delete",
                key: "delete",
                danger: true,
                disabled: selectedTags.size === 0
            },
        ];

        // if (sourcePool !== 'master_pool') {
        //     menuItems.push({
        //         label: "Move",
        //         key: "export",
        //         disabled: selectedTags.size === 0
        //     });
        // }

        return (
            <Menu
                onClick={({ key: actionKey }) => {
                    if (actionKey === "delete") {
                        handleDeleteSelectedTags(key);
                    } else if (actionKey === "export") {
                        handleExportSelectedTags(key);
                    }
                }}
                items={menuItems}
            />
        );
    };

    const getMenu = (key) => {
        const menuItems = [
            {
                label: "Delete",
                key: "delete",
                danger: true,
                disabled: selectedTags.size === 0
            },
        ];

        // if (sourcePool !== 'master_pool') {
        //     menuItems.push({
        //         label: "Move",
        //         key: "export",
        //         disabled: selectedTags.size === 0
        //     });
        // }

        return (
            <Menu
                onClick={({ key: actionKey }) => {
                    if (actionKey === "delete") {
                        handleDeleteSelectedTags(key);
                    } else if (actionKey === "export") {
                        handleExportSelectedTags(key);
                    }
                }}
                items={menuItems}
            />
        );
    };

    const handleExportSelectedTags = (key) => {
        if (!onExportTags) return;

        const tagsToExport = Array.from(selectedTags)
            .filter(tagKey => tagKey.startsWith(`${key}:`))
            .map(tagKey => tagKey.split(':')[1]);

        if (tagsToExport.length > 0) {
            onExportTags({
                sourcePool,
                attributeKey: key,
                tags: tagsToExport
            });

            setSelectedTags(prev => {
                const newSet = new Set(prev);
                tagsToExport.forEach(tag => newSet.delete(`${key}:${tag}`));
                return newSet;
            });
        }
    };

    const handleDeleteSelectedTags = (key) => {
        const tagsToDelete = Array.from(selectedTags)
            .filter(tagKey => tagKey.startsWith(`${key}:`))
            .map(tagKey => tagKey.split(':')[1]);

        if (tagsToDelete.length > 0 && onDeleteTags) {
            onDeleteTags({
                poolType: sourcePool,
                attributeKey: key,
                tags: tagsToDelete
            });

            setSelectedTags(prev => {
                const newSet = new Set(prev);
                tagsToDelete.forEach(tag => newSet.delete(`${key}:${tag}`));
                return newSet;
            });
        }
    };

    const [showKeywordInput, setShowKeywordInput] = useState(false);
    const [newKeywordInput, setNewKeywordInput] = useState('');

    const handleAddNewKeyword = () => {
        const keyword = newKeywordInput.trim();
        if (!keyword) return;

        const formattedKey = keyword.toLowerCase().replace(/\s+/g, '_');

        if (attributeData[formattedKey]) {
            console.warn('Keyword already exists');
            return;
        }

        const updatedData = {
            ...attributeData,
            [formattedKey]: []
        };

        setAttributeData(updatedData);
        setNewKeywordInput('');
        setShowKeywordInput(false);

        if (isEditable && sourcePool && dispatch) {
            const updatedPool = JSON.parse(JSON.stringify(attributePoolData || {}));
            updatedPool[sourcePool] = updatedPool[sourcePool] || {};
            updatedPool[sourcePool][formattedKey] = [];
            dispatch(updateAttributePool(updatedPool));
        }
    };

    const handleAddToMasterKey = (masterKey) => {
        if (!selectedTags || selectedTags.size === 0) return;

        const tagsToAdd = Array.from(selectedTags)
            .map(tagKey => ({
                key: tagKey.split(':')[0],
                value: tagKey.split(':')[1]
            }));

        if (tagsToAdd.length > 0 && onAddToMasterPool) {
            onAddToMasterPool(masterKey, tagsToAdd);
        }
    };

    return (
        <Card className="text-base antd_card_hrading" title={title} style={{ width: "100%" }}>
            {isEditable && isAddButtonShowMasterPool && (
                <>
                    <Button
                        type="dashed"
                        onClick={() => setShowKeywordInput(prev => !prev)}
                        icon={<PlusOutlined />}
                        className="mb-2 w-full"
                    >
                        Add New Keyword
                    </Button>

                    {showKeywordInput && (
                        <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-5">
                            <input
                                type="text"
                                placeholder="Enter new keyword"
                                className="border border-black-300 placeholder-black-101 px-3 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newKeywordInput}
                                onChange={(e) => setNewKeywordInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddNewKeyword()}
                            />
                            <Button
                                type="primary"
                                onClick={handleAddNewKeyword}
                                disabled={!newKeywordInput.trim()}
                                className="w-full sm:w-auto h-full py-2"
                            >
                                Add
                            </Button>
                        </div>
                    )}
                </>
            )}

            {Object.entries(attributeData).map(([key, rawValues]) => {
                const values = normalizeAttributeValues(rawValues);

                // Only show simplified view if we have external selected tags (from catalog/collection)
                // AND we're in master pool
                if (sourcePool === 'master_pool' &&
                    ((externalSelectedTags && externalSelectedTags.size > 0))) {
                    return (
                        <div
                            key={key}
                            className={`p-3 h-14 rounded cursor-pointer mb-2 ${activeMasterPoolKey === key ? "bg-blue-100 border border-blue-500" : "bg-gray-100 hover:bg-blue-100"}`}
                            onClick={() => {
                                handleAddToMasterKey(key);
                                setActiveMasterPoolKey(key);
                            }}
                        >
                            <strong className="text-base">{key.replace("_", " ")}</strong>
                        </div>
                    );
                }

                return (
                    <div className="flex flex-wrap gap-2 text-base w-full" key={key} style={{ marginBottom: 10 }}>
                        <div className="flex justify-between w-full items-center p-3 bg-gray-100 rounded">
                            <div className="flex items-center gap-2">
                                {
                                    (isEditable || sourcePool === 'catalog' || sourcePool === 'collection') &&
                                    <Checkbox
                                        onChange={() => toggleSelectKey(key, values)}
                                        checked={isAllSelectedUnderKey(key, values)}
                                    />
                                }

                                <Button
                                    type="text"
                                    icon={expandedKeys[key] ? <MinusOutlined /> : <PlusOutlined />}
                                    onClick={() => {
                                        toggleExpand(key);
                                        if (sourcePool === 'master_pool' && selectedTags && selectedTags.size > 0) {
                                            setActiveMasterPoolKey(key);
                                        }
                                    }}
                                />
                                <strong className="text-base">{key.replace("_", " ")}</strong>
                            </div>

                            {selectedTags.size > 0 && expandedKeys[key] && (isEditable || sourcePool === 'catalog' || sourcePool === 'collection') && (
                                <Dropdown
                                    overlay={getMenu(key)}
                                    trigger={['click']}
                                    placement="bottomRight"
                                >
                                    <Button className="px-4 py-3" size="small">
                                        Actions <DownOutlined />
                                    </Button>
                                </Dropdown>
                            )}

                            {
                                isEditable &&
                                <Popconfirm
                                    title="Are you sure you want to delete this attribute?"
                                    onConfirm={() => handleRemoveKey(key)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button type="text" icon={<CloseOutlined />} />
                                </Popconfirm>
                            }
                        </div>

                        {expandedKeys[key] &&
                            (Array.isArray(values) ? (
                                <>
                                    {values.map((value) => (
                                        <Tag
                                            className={`p-1 px-3 text-sm whitespace-normal cursor-pointer ${selectedTags.has(`${key}:${value}`)
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-100 text-black"
                                                }`}
                                            key={value}
                                            onClick={() => toggleSelectTag(key, value)}
                                        >
                                            {value}
                                        </Tag>
                                    ))}
                                    {isEditable && isAddButtonShowMasterPool && (
                                        <>
                                            {!visibleAddInputKeys[key] ? (
                                                <Button
                                                    className="p-3 h-7 text-sm whitespace-normal cursor-pointer"
                                                    size="small"
                                                    type="dashed"
                                                    icon={<PlusOutlined />}
                                                    onClick={() => toggleAddInputVisibility(key)}
                                                >
                                                    Add Tag
                                                </Button>
                                            ) : (
                                                <div className="flex mt-2 gap-2 w-full">
                                                    <input
                                                        className="w-full border p-1 px-2 rounded text-sm"
                                                        placeholder="Add new tag"
                                                        value={newTagInputs[key] || ""}
                                                        onChange={(e) => handleInputChange(key, null, e.target.value)}
                                                    />
                                                    <Button
                                                        className="h-full w-25"
                                                        type="primary"
                                                        size="small"
                                                        onClick={() => handleAddNewTag(key, null)}
                                                    >
                                                        Add
                                                    </Button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                Object.entries(values || {}).map(([subKey, subValues]) => (
                                    <div className="flex flex-wrap gap-2 w-full" key={subKey} style={{ marginBottom: 10 }}>
                                        <div className="flex justify-between w-full items-center p-3 bg-gray-100 rounded">
                                            <div className="flex items-center gap-2">
                                                {
                                                    (isEditable || sourcePool === 'catalog' || sourcePool === 'collection') &&
                                                    <Checkbox
                                                        onChange={() => toggleSelectSubKey(key, subKey, subValues)}
                                                        checked={selectedKeys.has(`${key}.${subKey}`)}
                                                    />
                                                }
                                                <Button
                                                    type="text"
                                                    icon={expandedKeys[`${key}.${subKey}`] ? <MinusOutlined /> : <PlusOutlined />}
                                                    onClick={() => toggleSubExpand(key, subKey)}
                                                />
                                                <strong className="text-base">{subKey.replace("_", " ")}</strong>
                                            </div>
                                            {selectedTags.size > 0 && expandedKeys[`${key}.${subKey}`] && (isEditable || sourcePool === 'catalog' || sourcePool === 'collection') && (
                                                <div>
                                                    <Dropdown
                                                        overlay={getSubMenu(key)}
                                                        trigger={['click']}
                                                        placement="bottomRight"
                                                    >
                                                        <Button className="px-4 py-3" size="small">
                                                            Actions <DownOutlined />
                                                        </Button>
                                                    </Dropdown>
                                                </div>
                                            )}

                                            {
                                                isEditable &&
                                                <Popconfirm
                                                    title="Are you sure you want to delete this sub-attribute?"
                                                    onConfirm={() => handleRemoveSubKey(key, subKey)}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <Button type="text" icon={<CloseOutlined />} />
                                                </Popconfirm>
                                            }
                                        </div>
                                        {isEditable && isAddButtonShowMasterPool && (
                                            <div className="flex mt-2 gap-2 w-full">
                                                <input
                                                    className="w-full border p-1 px-2 rounded text-sm"
                                                    placeholder="Add new tag"
                                                    value={newTagInputs[`${key}.${subKey}`] || ""}
                                                    onChange={(e) => handleInputChange(key, subKey, e.target.value)}
                                                />
                                                <Button
                                                    className="h-full w-25"
                                                    type="primary"
                                                    size="small"
                                                    onClick={() => handleAddNewTag(key, subKey)}
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        )}
                                        {expandedKeys[`${key}.${subKey}`] &&
                                            subValues.map((value) => (
                                                <Tag
                                                    className={`p-1 px-3 text-sm whitespace-normal cursor-pointer ${selectedTags.has(`${key}:${value}`)
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-gray-100 text-black"
                                                        }`}
                                                    key={value}
                                                    onClick={() => toggleSelectTag(key, value)}
                                                >
                                                    {value}
                                                </Tag>
                                            ))}
                                    </div>
                                ))
                            ))}
                    </div>
                );
            })}
        </Card>
    );
};

const ProfileAttributes = ({
    nextStep,
    prevStep,
    profileData,
    handleChange,
    isSaving,
    templatesKey,
    updatedTemplates,
    handleTemplatesChange,
    isAdminLoggedIn,
    attributePoolTypes,
    attributePoolData,
    is_editable,
    storeReferenceOption,
    selectedPool1,
    selectedPool2,
    setSelectedPool1,
    setSelectedPool2,
    storeData
}) => {
    const dispatch = useDispatch();
    const [storeTypeError, setStoreTypeError] = useState(false);
    const [storeRefError, setStoreRefError] = useState(false);
    const [selectedCatalogTags, setSelectedCatalogTags] = useState(new Set());
    const [selectedCollectionTags, setSelectedCollectionTags] = useState(new Set());
    const [activeMasterPoolKey, setActiveMasterPoolKey] = useState(null);

    const isEditableMemo = useMemo(() => {
        const match = storeReferenceOption.find(item => item.name === selectedPool2);
        return match?.is_editable || false;
    }, [selectedPool2, storeReferenceOption]);

    useEffect(() => {
        if (selectedPool1 && selectedPool2) {
            const payload = {
                store_reference: selectedPool2,
                store_type: selectedPool1,
                is_editable: isEditableMemo
            }
            dispatch(getStoredAttributes(payload))
        }
    }, [current_store_name, selectedPool1, selectedPool2, isEditableMemo]);

    const handleExportTags = ({ sourcePool, attributeKey, tags }) => {
        if (!attributePoolData) return;

        const updatedPool = JSON.parse(JSON.stringify(attributePoolData));

        // Remove from source pool
        if (updatedPool[sourcePool] && updatedPool[sourcePool][attributeKey]) {
            if (Array.isArray(updatedPool[sourcePool][attributeKey])) {
                updatedPool[sourcePool][attributeKey] = updatedPool[sourcePool][attributeKey].filter(
                    tag => !tags.includes(tag)
                );
            } else {
                for (const subKey in updatedPool[sourcePool][attributeKey]) {
                    updatedPool[sourcePool][attributeKey][subKey] =
                        updatedPool[sourcePool][attributeKey][subKey].filter(
                            tag => !tags.includes(tag)
                        );
                }
            }
        }

        // Add to master pool
        if (updatedPool.master_pool) {
            if (!updatedPool.master_pool[attributeKey]) {
                updatedPool.master_pool[attributeKey] = [];
            }

            tags.forEach(tag => {
                if (!updatedPool.master_pool[attributeKey].includes(tag)) {
                    updatedPool.master_pool[attributeKey].push(tag);
                }
            });
        }

        dispatch(updateAttributePool(updatedPool));
    };

    const handleDeleteTags = ({ poolType, attributeKey, tags }) => {
        if (!attributePoolData) return;

        const updatedPool = JSON.parse(JSON.stringify(attributePoolData));

        if (updatedPool?.[poolType]?.[attributeKey]) {
            if (Array.isArray(updatedPool[poolType][attributeKey])) {
                updatedPool[poolType][attributeKey] = updatedPool[poolType][attributeKey].filter(
                    tag => !tags.includes(tag)
                );
            } else {
                for (const subKey in updatedPool[poolType][attributeKey]) {
                    updatedPool[poolType][attributeKey][subKey] =
                        updatedPool[poolType][attributeKey][subKey].filter(tag => !tags.includes(tag));
                }
            }
        }

        dispatch(updateAttributePool(updatedPool));
    };

    const handleAddToMasterPool = (masterKey, tagsToAdd) => {
        if (!attributePoolData) return;

        const updatedPool = JSON.parse(JSON.stringify(attributePoolData));

        // Initialize master_pool if it doesn't exist
        if (!updatedPool.master_pool) {
            updatedPool.master_pool = {};
        }

        // Initialize the masterKey if it doesn't exist
        if (!updatedPool.master_pool[masterKey]) {
            updatedPool.master_pool[masterKey] = [];
        }

        // Add each tag if it doesn't already exist
        tagsToAdd.forEach(({ value }) => {
            if (!updatedPool.master_pool[masterKey].includes(value)) {
                updatedPool.master_pool[masterKey].push(value);
            }

            // Remove from source pools
            ['catalog', 'collection'].forEach(pool => {
                if (updatedPool[pool]) {
                    Object.keys(updatedPool[pool]).forEach(poolKey => {
                        if (Array.isArray(updatedPool[pool][poolKey])) {
                            updatedPool[pool][poolKey] = updatedPool[pool][poolKey].filter(tag => tag !== value);
                        } else if (typeof updatedPool[pool][poolKey] === 'object') {
                            Object.keys(updatedPool[pool][poolKey]).forEach(subKey => {
                                updatedPool[pool][poolKey][subKey] = updatedPool[pool][poolKey][subKey].filter(tag => tag !== value);
                            });
                        }
                    });
                }
            });
        });

        dispatch(updateAttributePool(updatedPool));

        // Clear the selected tags after adding
        setSelectedCatalogTags(new Set());
        setSelectedCollectionTags(new Set());
        setActiveMasterPoolKey(null);
        message.success('Tags added to master pool successfully');
    };

    const payload = {
        updated_data: attributePoolData,
        store_type: selectedPool1,
        store_reference: selectedPool2,
    }

    return (
        <div className='additional-brands-wrapper'>
            <Row justify='space-between'>
                <Col span={24} className='flex justify-between'>
                    <Button type='primary' onClick={prevStep}>Back</Button>
                    <Button
                        className='loading-button'
                        type='primary'
                        onClick={() => {
                            const hasError = !selectedPool1 || !selectedPool2;
                            setStoreTypeError(!selectedPool1);
                            setStoreRefError(!selectedPool2);

                            if (!hasError) {
                                dispatch(updateStoredAttributePool(payload))
                                nextStep();
                            }
                        }} loading={isSaving}
                    >
                        Continue
                    </Button>
                </Col>
            </Row>
            {isAdminLoggedIn ? (
                <div className="mt-5">
                    <Title level={2} className="text-center text-white mb-5">Attributes</Title>
                    <div className="flex gap-4">
                        <div className="mb-5 w-1/4">
                            <label className="block mb-1 text-sm font-medium text-white">Store Type</label>
                            <Select
                                placeholder="Select Store Type"
                                className={`h-10 w-full ${storeTypeError ? 'border-2 rounded-lg border-red-500' : ''}`}
                                value={selectedPool1}
                                onChange={(value) => {
                                    setSelectedPool1(value);
                                    setStoreTypeError(false);
                                }}
                                options={
                                    storeData.store_type?.map((item) => ({
                                        label: item.charAt(0).toUpperCase() + item.slice(1),
                                        value: item,
                                    })) || []
                                }
                            />
                            {storeTypeError && <p className="text-red-500 text-xs mt-1">Store Type is required</p>}
                        </div>

                        <div className="mb-5 w-1/4">
                            <label className="block mb-1 text-sm font-medium text-white">Store Reference</label>
                            <Select
                                placeholder="Select Store Reference"
                                className={`h-10 w-full ${storeRefError ? 'border-2 rounded-lg border-red-500' : ''}`}
                                value={selectedPool2}
                                onChange={(value) => {
                                    setSelectedPool2(value);
                                    setStoreRefError(false);
                                }}
                                options={
                                    storeReferenceOption?.map((item) => ({
                                        label: item.name,
                                        value: item.name,
                                    })) || []
                                }
                            />
                            {storeRefError && <p className="text-red-500 text-xs mt-1">Store Reference is required</p>}
                        </div>
                    </div>

                    <Row gutter={[16, 16]}>
                        {/* Left side - Master Pool */}
                        {attributePoolData?.master_pool && (
                            <Col span={12}>
                                <AttributeCard
                                    className="text-lg"
                                    title="Master Pool"
                                    attributes={attributePoolData.master_pool}
                                    isAddButtonShowMasterPool={true}
                                    onExportTags={handleExportTags}
                                    onDeleteTags={handleDeleteTags}
                                    sourcePool="master_pool"
                                    isEditable={isEditableMemo}
                                    dispatch={dispatch}
                                    selectedPool1={selectedPool1}
                                    selectedPool2={selectedPool2}
                                    attributePoolData={attributePoolData}
                                    selectedTags={
                                        selectedCatalogTags.size > 0 ? selectedCatalogTags :
                                            selectedCollectionTags.size > 0 ? selectedCollectionTags :
                                                null
                                    }
                                    setSelectedTags={
                                        selectedCatalogTags.size > 0 ? setSelectedCatalogTags :
                                            selectedCollectionTags.size > 0 ? setSelectedCollectionTags :
                                                null
                                    }
                                    onAddToMasterPool={handleAddToMasterPool}
                                    activeMasterPoolKey={activeMasterPoolKey}
                                    setActiveMasterPoolKey={setActiveMasterPoolKey}
                                />
                            </Col>
                        )}

                        {/* Right side - Catalog and Collection vertically stacked */}
                        <Col span={12}>
                            <Row gutter={[16, 16]}>
                                {attributePoolData?.catalog && (
                                    <Col span={24}>
                                        <AttributeCard
                                            className="text-lg"
                                            title="Catalog"
                                            attributes={attributePoolData.catalog}
                                            onExportTags={handleExportTags}
                                            onDeleteTags={handleDeleteTags}
                                            sourcePool="catalog"
                                            isEditable={isEditableMemo}
                                            dispatch={dispatch}
                                            selectedPool1={selectedPool1}
                                            selectedPool2={selectedPool2}
                                            attributePoolData={attributePoolData}
                                            selectedTags={selectedCatalogTags}
                                            setSelectedTags={setSelectedCatalogTags}
                                        />
                                    </Col>
                                )}

                                {attributePoolData?.collection && (
                                    <Col span={24}>
                                        <AttributeCard
                                            title="Collections"
                                            attributes={attributePoolData.collection}
                                            onExportTags={handleExportTags}
                                            onDeleteTags={handleDeleteTags}
                                            sourcePool="collection"
                                            isEditable={isEditableMemo}
                                            dispatch={dispatch}
                                            selectedPool1={selectedPool1}
                                            selectedPool2={selectedPool2}
                                            attributePoolData={attributePoolData}
                                            selectedTags={selectedCollectionTags}
                                            setSelectedTags={setSelectedCollectionTags}
                                        />
                                    </Col>
                                )}
                            </Row>
                        </Col>
                    </Row>

                    {
                        !attributePoolData?.master_pool && !attributePoolData?.catalog && !attributePoolData?.collection && selectedPool2 && selectedPool1 && (
                            <div className="text-center text-white text-lg cursor-pointer my-10">
                                <span>No attribute pool data found.</span>
                            </div>
                        )
                    }
                </div>
            ) : null}
            <div className='text-center text-secondary underline text-lg cursor-pointer mt-3'>
                <span onClick={nextStep}>Skip and continue</span>
            </div>
        </div>
    );
};

export default ProfileAttributes;