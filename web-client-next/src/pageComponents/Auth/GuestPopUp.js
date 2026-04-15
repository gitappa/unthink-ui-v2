import React, { useCallback, useEffect, useState } from 'react'
import { CloseOutlined } from "@ant-design/icons";
import { GuestPopUpShow } from './redux/actions';
import { useDispatch } from 'react-redux';
import popupStyles from '../auraResponseProductsWithTags/chatSuggestionsWithProducts.module.scss'
import styles from './authPage.module.scss'


function GuestPopUp({
    handleGuestSubmit,
    errors,
    handleGuestSkip,
    guestChange,
    guestData,
    setIsPopupShow
}) {

    const dispatch = useDispatch()

    const handClose = () => {
        dispatch(GuestPopUpShow(false))
        setIsPopupShow(false)
    }

    return (
        <form onSubmit={handleGuestSubmit} className={popupStyles['popup-overlay']}>
            <div className={popupStyles['popup-content']}>
                <div className={styles.guestHeader}>
                    <h2 className={styles.guestTitle}>
                        Please provide your email to ensure your collections are saved and accessible whenever you return.
                    </h2>
                    <CloseOutlined
                        className={styles.guestCloseIcon}
                        onClick={handClose}
                    />
                </div>
                <div>
                    <label className={styles.guestLabel}>Email Address</label>
                    <input
                        className={`${styles.guestInput} ${errors.email ? styles.guestInputError : ""}`}
                        name="email"
                        type="text"
                        placeholder="Email Address"
                        value={guestData.email}
                        onChange={guestChange}
                    />
                    {errors.email && <p className={styles.guestErrorText}>{errors.email}</p>}
                </div>
                <div>
                    <div className={styles.guestActions}>
                        <button
                            type="submit"
                            className={styles.guestButton}
                        >
                            Ok
                        </button>
                        <button
                            className={styles.guestButton}
                            onClick={handleGuestSkip}
                        >
                            Skip
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default GuestPopUp