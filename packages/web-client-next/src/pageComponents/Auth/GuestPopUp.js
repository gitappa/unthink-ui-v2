import React, { useCallback, useEffect, useState } from 'react'
import { CloseOutlined } from "@ant-design/icons";
import { GuestPopUpShow } from './redux/actions';
import { useDispatch } from 'react-redux';
import styles from '../auraResponseProductsWithTags/chatSuggestionsWithProducts.module.scss'


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
        <form onSubmit={handleGuestSubmit} className={styles['popup-overlay'] }>
            <div className={styles['popup-content'] }>
                <div className="flex justify-between items-center gap-5 mb-5">
                    <h2 className="text-xl font-medium">
                        Please provide your email to ensure your collections are saved and accessible whenever you return.
                    </h2>
                    <CloseOutlined
                        className="anticon anticon-close close flex items-center font-semibold cursor-pointer text-xl"
                        onClick={handClose}
                    />
                </div>
                <div className="">
                    <label className="text-base text-left text-black-100 font-semibold block mb-0.75">Email Address</label>
                    <input
                        className={`text-left placeholder-gray-101 outline-none px-3 h-10 bg-slate-100 rounded-xl w-full ${errors.email ? "border-red-500" : ""
                            }`}
                        name="email"
                        type="text"
                        placeholder="Email Address"
                        value={guestData.email}
                        onChange={guestChange}
                    />
                    {errors.email && <p className="text-red-500 text-sm text-left mt-2">{errors.email}</p>}
                </div>
                <div>
                    <div className="text-right mt-4 flex gap-2 justify-end items-center">
                        <button
                            type="submit"
                            className="rounded-xl text-indigo-100 font-bold text-xs md:text-sm py-2 px-4.5 bg-indigo-600"
                        >
                            Ok
                        </button>
                        <button
                            className="rounded-xl text-indigo-100 font-bold text-xs md:text-sm py-2 px-4.5 bg-indigo-600"
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