import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Row, Col, Card } from 'antd';
import { UserOutlined, CrownOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { setIsRegistered, setTTid, setUserId } from '../../helper/getTrackerInfo';
import { clearStorages } from '../../helper/utils';
import { MY_PROFILE } from '../../constants/codes';
import { adminUserId } from '../../constants/config';

const AdminInfluencerPopup = () => {
    const [authUser, admin_list] = useSelector((state) => [
        state.auth.user.data,
        state.store.data.admin_list,
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const isAdditionAdminCheck = useMemo(() => {
        if (authUser && authUser?.emailId) {
            return admin_list?.includes(authUser?.emailId);
        }
        return false;
    }, [authUser, admin_list]);

    // Show modal only if admin and first time
    useEffect(() => {
        const alreadyShown = localStorage.getItem('adminRolePopupShown');
        if (isAdditionAdminCheck && !alreadyShown) {
            setIsModalVisible(true);
        }
    }, [isAdditionAdminCheck, authUser]);

    const handleRoleClick = (e, role) => {
        if (role === 'Admin') {
            handleSignInAsInfluencer(e, adminUserId);
        }
        // Only set once when closing
        localStorage.setItem('adminRolePopupShown', 'true');
        setIsModalVisible(false);
    };

    const handleSignInAsInfluencer = useCallback(
        (e, infUserId) => {
            if (isAdditionAdminCheck) {
                e.stopPropagation();

                clearStorages(); // logout current user

                setTTid(infUserId); // set influencer user id to login with as that user
                setIsRegistered(true); // setting is registered browser storage
                setUserId(infUserId); // set influencer user id to login with as that user

                if (window && window.location) {
                    // redirecting user to store page and refreshing page to reload everything with new user
                    window.location.href = MY_PROFILE;
                }
            }
        },
        [isAdditionAdminCheck]
    );

    return (
        <Modal
            title={
                <h2
                    style={{
                        fontSize: '24px',
                        marginBottom: '20px',
                        textAlign: 'center',
                        fontWeight: 700,
                    }}
                >
                    Select Your Role
                </h2>
            }
            open={isModalVisible}
            footer={null}
            closable={false}
            centered
        >
            <Row gutter={16} justify="center">
                <Col span={10}>
                    <Card
                        hoverable
                        style={{ textAlign: 'center', borderRadius: '12px' }}
                        onClick={(e) => handleRoleClick(e, 'Admin')}
                    >
                        <CrownOutlined
                            style={{
                                fontSize: '40px',
                                color: '#1890ff',
                                marginBottom: '10px',
                            }}
                        />
                        <div style={{ fontSize: '16px', fontWeight: 500 }}>Admin</div>
                    </Card>
                </Col>
                <Col span={10}>
                    <Card
                        hoverable
                        style={{ textAlign: 'center', borderRadius: '12px' }}
                        onClick={(e) => handleRoleClick(e, 'Influencer')}
                    >
                        <UserOutlined
                            style={{
                                fontSize: '40px',
                                color: '#52c41a',
                                marginBottom: '10px',
                            }}
                        />
                        <div style={{ fontSize: '16px', fontWeight: 500 }}>Influencer</div>
                    </Card>
                </Col>
            </Row>
        </Modal>
    );
};

export default AdminInfluencerPopup;
